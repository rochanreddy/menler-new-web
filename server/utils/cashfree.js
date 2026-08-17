// Cashfree Payment Gateway helpers (raw HTTPS — no SDK dependency).
// Docs: https://www.cashfree.com/docs/api-reference/payments/latest/orders/create
//
// Env (server-side only): CASHFREE_ENV (SANDBOX|PRODUCTION), CASHFREE_APP_ID,
// CASHFREE_SECRET_KEY. Never expose the secret to the browser.

import crypto from 'crypto';

const ENV = (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase();
const BASE = ENV === 'PRODUCTION'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';
const API_VERSION = '2023-08-01';

export const CASHFREE_MODE = ENV === 'PRODUCTION' ? 'production' : 'sandbox';

export function cashfreeConfigured() {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-api-version': API_VERSION,
    'x-client-id': process.env.CASHFREE_APP_ID,
    'x-client-secret': process.env.CASHFREE_SECRET_KEY,
  };
}

// Create an order. Returns Cashfree's order object incl. payment_session_id.
export async function createCashfreeOrder({ orderId, amount, customer, returnUrl, notifyUrl }) {
  const body = {
    order_id: orderId,
    order_amount: Number(amount),
    order_currency: 'INR',
    customer_details: {
      customer_id: customer.id,
      customer_phone: customer.phone,
      ...(customer.name ? { customer_name: customer.name } : {}),
      ...(customer.email ? { customer_email: customer.email } : {}),
    },
    order_meta: {
      ...(returnUrl ? { return_url: returnUrl } : {}),
      ...(notifyUrl ? { notify_url: notifyUrl } : {}),
    },
  };
  const resp = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = new Error(data?.message || `Cashfree order failed (${resp.status})`);
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Fetch an order → order_status: PAID | ACTIVE | EXPIRED | TERMINATED | ...
export async function getCashfreeOrder(orderId) {
  const resp = await fetch(`${BASE}/orders/${encodeURIComponent(orderId)}`, {
    headers: authHeaders(),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = new Error(data?.message || `Cashfree fetch failed (${resp.status})`);
    err.status = resp.status;
    throw err;
  }
  return data;
}

// Payments made against an order → each has cf_payment_id (Cashfree's
// transaction id, the one shown in the Cashfree dashboard) + payment_status.
export async function getCashfreePayments(orderId) {
  const resp = await fetch(`${BASE}/orders/${encodeURIComponent(orderId)}/payments`, {
    headers: authHeaders(),
  });
  const data = await resp.json().catch(() => ([]));
  if (!resp.ok) {
    const err = new Error(data?.message || `Cashfree payments fetch failed (${resp.status})`);
    err.status = resp.status;
    throw err;
  }
  return Array.isArray(data) ? data : [];
}

// A payment link → its own record, and the orders raised against it. Payments
// taken over a shared link (rather than through the website) are the whole
// reason manual entries exist, so this is how those get verified.
export async function getCashfreeLink(linkId) {
  const resp = await fetch(`${BASE}/links/${encodeURIComponent(linkId)}`, { headers: authHeaders() });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = new Error(data?.message || `Cashfree link fetch failed (${resp.status})`);
    err.status = resp.status;
    throw err;
  }
  return data;
}

export async function getCashfreeLinkOrders(linkId) {
  const resp = await fetch(`${BASE}/links/${encodeURIComponent(linkId)}/orders`, { headers: authHeaders() });
  const data = await resp.json().catch(() => ([]));
  if (!resp.ok) {
    const err = new Error(data?.message || `Cashfree link orders fetch failed (${resp.status})`);
    err.status = resp.status;
    throw err;
  }
  return Array.isArray(data) ? data : [];
}

const isSuccess = (p) => String(p?.payment_status || '').toUpperCase() === 'SUCCESS';

/* How a payment was actually made.
 *
 * `payment_group` is the field that separates an EMI from an outright card
 * payment, and it is the one thing about a payment that nothing else records:
 * the amount, the payer and the date all reach us by other routes, but whether
 * someone spread ₹59,999 over six months is only ever in here. Cashfree spells
 * the group several ways (card_emi, credit_card_emi, cardless_emi, emi), so
 * anything with "emi" in it counts.
 *
 * The details sit under payment_method, keyed by instrument — one key, whose
 * name is the instrument. Read that way rather than by checking for each
 * instrument in turn, so a method Cashfree adds later still comes through
 * labelled instead of blank. */
const GROUP_LABELS = {
  credit_card: 'Credit card',
  debit_card: 'Debit card',
  net_banking: 'Net banking',
  upi: 'UPI',
  wallet: 'Wallet',
  pay_later: 'Pay later',
  paypal: 'PayPal',
  bank_transfer: 'Bank transfer',
};

const titleise = (s) => String(s || '')
  .replace(/[_-]+/g, ' ')
  .replace(/\b\w/g, (c) => c.toUpperCase())
  .trim();

export function describePayment(payment) {
  if (!payment) return null;
  const group = String(payment.payment_group || '').toLowerCase();
  const method = payment.payment_method && typeof payment.payment_method === 'object'
    ? payment.payment_method
    : {};
  const kind = Object.keys(method)[0] || '';
  const d = method[kind] && typeof method[kind] === 'object' ? method[kind] : {};
  const emi = /emi/.test(group) || /emi/.test(kind);

  /* A card carries its issuer, net banking its bank, and a cardless EMI a
   * provider instead. Bank names are passed through exactly as Cashfree sends
   * them — they arrive shouty ("STATE BANK OF INDIA") but title-casing them
   * turns HDFC into "Hdfc", and a mangled bank name is worse than a loud one.
   * Providers are lowercase slugs, so those do get tidied. */
  const bank = String(d.card_bank_name || d.netbanking_bank_name || '').trim()
    || (d.provider ? titleise(d.provider) : '');
  const bits = [
    bank,
    d.card_network && `${titleise(d.card_network)}${d.card_type ? ` ${d.card_type.replace(/_/g, ' ')}` : ''}`,
    d.card_number && `••${String(d.card_number).slice(-4)}`,
    d.upi_id,
  ].filter(Boolean);

  return {
    group: group || kind || '',
    // EMI first: someone paying by card EMI shows as credit_card in the group
    // on some flows, and "Credit card" would hide the thing worth knowing.
    label: emi
      ? (/cardless/.test(group) || /cardless/.test(kind) ? 'Cardless EMI' : 'EMI')
      : (GROUP_LABELS[group] || titleise(kind) || 'Cashfree'),
    emi,
    detail: bits.join(' · '),
    bank,
    reference: payment.bank_reference ? String(payment.bank_reference) : '',
  };
}

/**
 * Try to fetch a payment from its cf_payment_id alone.
 *
 * The documented PG route addresses a payment under its order, but a bare
 * lookup is worth attempting before telling someone to go and find an order id:
 * if the account serves it, pasting the transaction id is all anyone needs.
 * Anything other than a usable body is treated as "not available" so the
 * caller falls through to the routes that are guaranteed.
 */
async function tryPaymentById(cfPaymentId) {
  for (const path of [`payments/${encodeURIComponent(cfPaymentId)}`,
    `orders/payments/${encodeURIComponent(cfPaymentId)}`]) {
    try {
      const resp = await fetch(`${BASE}/${path}`, { headers: authHeaders() });
      if (!resp.ok) continue;
      const data = await resp.json().catch(() => null);
      const payment = Array.isArray(data) ? data[0] : data;
      if (payment?.cf_payment_id && payment?.order_id) return payment;
    } catch { /* network/route unavailable — fall through */ }
  }
  return null;
}

/** Flatten one Cashfree payment into the shape the admin UI shows. */
function normalise(order, payment) {
  return {
    order_id: order?.order_id || payment?.order_id || '',
    cf_payment_id: payment?.cf_payment_id ? String(payment.cf_payment_id) : '',
    amount: Number(payment?.payment_amount ?? order?.order_amount ?? 0),
    status: String(payment?.payment_status || order?.order_status || '').toUpperCase(),
    method: payment?.payment_group || (payment?.payment_method && Object.keys(payment.payment_method)[0]) || '',
    // The readable form of the same thing — kept beside `method` rather than
    // replacing it, because `method` is already stored on existing orders.
    methodInfo: describePayment(payment),
    paid_at: payment?.payment_time || order?.created_at || null,
    customer: {
      name: order?.customer_details?.customer_name || '',
      email: order?.customer_details?.customer_email || '',
      phone: order?.customer_details?.customer_phone || '',
    },
  };
}

/**
 * Resolve whatever reference an admin has to hand into a real Cashfree payment:
 * an order id, a payment-link id, or a bare transaction id.
 *
 * A transaction id is tried directly first — if the account serves that route,
 * pasting the number off the dashboard is all anyone has to do. The documented
 * routes address a payment under its order, so those remain the fallback, and
 * only if every one of them comes up empty is the caller asked for an order id.
 */
export async function findCashfreePayment(reference) {
  const ref = String(reference || '').trim();
  if (!ref) return { found: false, reason: 'empty' };

  // 0. A bare number is a cf_payment_id. Resolve it without an order if we can.
  if (/^\d{6,}$/.test(ref)) {
    const payment = await tryPaymentById(ref);
    if (payment) {
      if (!isSuccess(payment)) {
        return {
          found: false,
          reason: 'not_paid',
          detail: `Transaction ${ref} exists but its status is ${payment.payment_status || 'unknown'}, not SUCCESS.`,
        };
      }
      // Pull the order too, purely for the payer's details.
      const order = await getCashfreeOrder(payment.order_id).catch(() => null);
      return { found: true, via: 'payment', payment: normalise(order, payment) };
    }
  }

  // 1. Treat it as an order id.
  try {
    const order = await getCashfreeOrder(ref);
    if (order?.order_id) {
      const payments = await getCashfreePayments(ref).catch(() => []);
      const paid = payments.find(isSuccess);
      if (paid) return { found: true, via: 'order', payment: normalise(order, paid) };
      return {
        found: false,
        reason: 'not_paid',
        detail: `Order ${ref} exists but has no successful payment (status ${order.order_status || 'unknown'}).`,
      };
    }
  } catch (err) {
    if (err.status && err.status !== 404) throw err;   // auth/network problems must surface
  }

  // 2. Treat it as a payment-link id.
  try {
    const link = await getCashfreeLink(ref);
    if (link?.link_id) {
      const orders = await getCashfreeLinkOrders(ref).catch(() => []);
      for (const o of orders) {
        const payments = await getCashfreePayments(o.order_id).catch(() => []);
        const paid = payments.find(isSuccess);
        if (paid) return { found: true, via: 'link', payment: normalise(o, paid) };
      }
      return {
        found: false,
        reason: 'not_paid',
        detail: `Payment link ${ref} exists but nobody has paid it yet (status ${link.link_status || 'unknown'}).`,
      };
    }
  } catch (err) {
    if (err.status && err.status !== 404) throw err;
  }

  // 3. A transaction id that step 0 couldn't resolve. Cashfree's documented
  //    routes need the order, so that's what has to be pasted instead.
  if (/^\d{6,}$/.test(ref)) {
    return {
      found: false,
      reason: 'needs_order',
      detail: `Cashfree wouldn’t return transaction ${ref} on its own. Open it in the Cashfree dashboard and paste the Order ID from that same row instead — that always works.`,
    };
  }

  return { found: false, reason: 'not_found', detail: `Nothing in Cashfree matches "${ref}".` };
}

// Verify a webhook: Cashfree signs base64(HMAC-SHA256(timestamp + rawBody, secret)).
// Pass the RAW request body (Buffer/string), not the parsed JSON.
export function verifyWebhookSignature(signature, rawBody, timestamp) {
  if (!signature || !timestamp || !process.env.CASHFREE_SECRET_KEY) return false;
  const payload = String(timestamp) + (Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : String(rawBody || ''));
  const expected = crypto
    .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
    .update(payload)
    .digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
