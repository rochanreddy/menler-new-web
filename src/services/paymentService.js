// Payment API client — talks to the Cashfree payment endpoints on the Menler API.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function readError(res, fallback) {
  try { const j = await res.json(); if (j && j.error) return j.error; } catch { /* no json */ }
  return fallback;
}

// Create a Cashfree order for a paid program or paid campaign.
// Pass leadId when the registrant already exists (campaign checkout).
// Returns { order_id, payment_session_id, mode }.
export async function createEnrolOrder({ program, leadId, name, email, phone, city, background, track }) {
  const res = await fetch(`${API_URL}/payments/cashfree/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ program, leadId, name, email, phone, city, background, track }),
  });
  if (!res.ok) throw new Error(await readError(res, 'Could not start the payment.'));
  return res.json();
}

// Confirm an order's status (source of truth is our server).
export async function getPaymentStatus(orderId) {
  const res = await fetch(`${API_URL}/payments/cashfree/status/${encodeURIComponent(orderId)}`);
  if (!res.ok) throw new Error(await readError(res, 'Could not check payment status.'));
  return res.json();
}
