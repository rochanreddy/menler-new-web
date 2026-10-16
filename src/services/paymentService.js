// Payment API client — talks to the Cashfree payment endpoints on the Menler API.

import { apiFetch } from '../lib/apiFetch';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create a Cashfree order for a paid program or paid campaign.
// Pass leadId when the registrant already exists (campaign checkout).
// Returns { order_id, payment_session_id, mode }.
// `pdf` / `resource` name the single Library item a ₹49 order buys. They are
// sent when the order is CREATED, not after payment, so delivery no longer
// depends on this browser coming back from checkout to say what to send.
// `method: 'upi'` asks for a UPI-only checkout (the "Pay with UPI instead" retry).
export async function createEnrolOrder({ program, leadId, name, email, phone, city, background, college, graduation_year, track, pdf, resource, pack, addons, method }) {
  return apiFetch(`${API_URL}/payments/cashfree/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ program, leadId, name, email, phone, city, background, college, graduation_year, track, pdf, resource, pack, addons, method }),
  }, { fallback: 'Could not start the payment.' });
}

// Confirm an order's status (source of truth is our server).
export async function getPaymentStatus(orderId) {
  return apiFetch(`${API_URL}/payments/cashfree/status/${encodeURIComponent(orderId)}`, {}, { fallback: 'Could not check payment status.' });
}
