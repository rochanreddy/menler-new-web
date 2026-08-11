// Central price list for paid programs and paid campaigns (INR, whole rupees).
// The SERVER is authoritative — the client never sends the amount; it only
// sends the program/campaign key. Change a price here and both the API charge
// and the button label (via /payments/pricing) update. Campaigns not listed
// here stay free (₹0) and skip Cashfree.
export const PROGRAM_PRICES = {
  kickstarter: { amount: 4999, label: 'Gen AI Kickstarter' },
  generalist: { amount: 59999, label: 'Claude AI Generalist Fellowship' },
  // Paid campaign resource packs (keyed by Sanity slug) — the ₹99 Claude Playbook Pack.
  'build-ai-automation-with-claude': { amount: 99, label: 'Build AI Automation with Claude' },
  'program-and-ops-with-ai': { amount: 99, label: 'AI powered Program & Operations' },
  'build-claude-skills-and-schedules': { amount: 99, label: 'Build Claude Skills and Schedules' },
  'crack-your-next-high-paying-job-with-ai': { amount: 99, label: 'Crack Your Next High-Paying Job with AI' },
  'build-your-first-webapp-with-claude': { amount: 99, label: 'Build Your First Webapp with Claude' },
  // Menler Library — ₹49 per playbook/resource download (menler.in/resources).
  library: { amount: 49, label: 'Menler Library' },
  // Internal gateway test — a live ₹5 charge via /pay-test. Remove after testing.
  test: { amount: 5, label: 'Payment Gateway Test' },
};

export function priceFor(program) {
  return PROGRAM_PRICES[String(program || '').toLowerCase()] || null;
}
