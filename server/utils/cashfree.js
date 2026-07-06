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
