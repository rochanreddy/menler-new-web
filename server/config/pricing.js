// Central price list for paid programs and paid campaigns (INR, whole rupees).
// The SERVER is authoritative — the client never sends the amount; it only
// sends the program/campaign key. Change a price here and both the API charge
// and the button label (via /payments/pricing) update. Campaigns not listed
// here stay free (₹0) and skip Cashfree.
export const PROGRAM_PRICES = {
  kickstarter: { amount: 4999, label: 'Gen AI Kickstarter' },
  generalist: { amount: 59999, label: 'Claude AI Generalist Fellowship' },
  // The ₹99 Claude Playbook Pack is retired — the playbooks are free. Those
  // campaign slugs are deliberately absent so this file, which is the authority,
  // refuses to price them: an order request for one now fails instead of
  // charging. Re-add a slug here (and in RESOURCE_PACKS client-side) to sell a
  // pack again.
  // Menler Library — ₹49 per playbook/resource download (menler.in/resources).
  library: { amount: 49, label: 'Menler Library' },
  // Internal gateway test — a live ₹5 charge via /pay-test. Remove after testing.
  test: { amount: 5, label: 'Payment Gateway Test' },
};

export function priceFor(program) {
  return PROGRAM_PRICES[String(program || '').toLowerCase()] || null;
}
