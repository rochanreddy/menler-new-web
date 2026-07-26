// Central price list for paid programs and paid campaigns (INR, whole rupees).
// The SERVER is authoritative — the client never sends the amount; it only
// sends the program/campaign key. Change a price here and both the API charge
// and the button label (via /payments/pricing) update. Campaigns not listed
// here stay free (₹0) and skip Cashfree.
export const PROGRAM_PRICES = {
  kickstarter: { amount: 4999, label: 'Gen AI Kickstarter' },
  generalist: { amount: 59999, label: 'Claude AI Generalist Fellowship' },
  // Paid campaign masterclasses (keyed by Sanity slug)
  'build-ai-automation-with-claude': { amount: 99, label: 'Build AI Automation with Claude' },
  // Internal gateway test — a live ₹5 charge via /pay-test. Remove after testing.
  test: { amount: 5, label: 'Payment Gateway Test' },
};

export function priceFor(program) {
  return PROGRAM_PRICES[String(program || '').toLowerCase()] || null;
}
