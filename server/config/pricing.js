// Central price list for paid programs (INR, whole rupees).
// The SERVER is authoritative — the client never sends the amount; it only
// sends the program key. Change a price here and both the API charge and the
// button label (via /payments/pricing) update. Campaign checkout is free (₹0)
// and intentionally NOT listed here — free orders don't go through Cashfree.
export const PROGRAM_PRICES = {
  kickstarter: { amount: 4999, label: 'Gen AI Kickstarter' },
  generalist: { amount: 59999, label: 'Claude AI Generalist Fellowship' },
  // Internal gateway test — a live ₹5 charge via /pay-test. Remove after testing.
  test: { amount: 5, label: 'Payment Gateway Test' },
};

export function priceFor(program) {
  return PROGRAM_PRICES[String(program || '').toLowerCase()] || null;
}
