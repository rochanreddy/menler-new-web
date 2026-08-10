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

/** Flatten one Cashfree payment into the shape the admin UI shows. */
function normalise(order, payment) {
  return {
    order_id: order?.order_id || payment?.order_id || '',
    cf_payment_id: payment?.cf_payment_id ? String(payment.cf_payment_id) : '',
    amount: Number(payment?.payment_amount ?? order?.order_amount ?? 0),
    status: String(payment?.payment_status || order?.order_status || '').toUpperCase(),
    method: payment?.payment_group || (payment?.payment_method && Object.keys(payment.payment_method)[0]) || '',
    paid_at: payment?.payment_time || order?.created_at || null,
    customer: {
      name: order?.customer_details?.customer_name || '',
      email: order?.customer_details?.customer_email || '',
      phone: order?.customer_details?.customer_phone || '',
    },
  };
}

/**
 * Resolve whatever reference an admin has to hand into a real Cashfree payment.
 *
 * The PG API has no "fetch a payment by its id alone" route — a payment is only
 * addressable under its order. So an order id or a payment-link id can be
 * verified, and a bare transaction id can't be; the caller is told which it is
 * rather than being left with a silent failure.
 */
export async function findCashfreePayment(reference) {
  const ref = String(reference || '').trim();
  if (!ref) return { found: false, reason: 'empty' };

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

  // 3. A bare numeric id is a cf_payment_id, which can't be looked up on its own.
  if (/^\d{6,}$/.test(ref)) {
    return {
      found: false,
      reason: 'needs_order',
      detail: 'That looks like a transaction ID. Cashfree can only look a payment up through its order, so paste the Order ID or the payment-link ID from the same row of the dashboard.',
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
