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
  'build-ai-agents-lightning-fast': { amount: 99, label: 'Build AI Agents Lightning Fast' },
  'build-with-generative-ai': { amount: 99, label: 'Build with Generative AI' },
  'ai-forward-deployed-engineering': { amount: 99, label: 'AI Forward Deployed Engineering' },
  // Paid seat, not a pack (₹199) — so its slug must stay OUT of the client's
  // RESOURCE_PACKS. Also listed in the client PROGRAM_PRICES for display.
  'ai-for-modern-work-and-careers': { amount: 199, label: 'AI for Modern Work and Careers' },
  'build-like-an-ai-fde': { amount: 199, label: 'AI Forward Deployed Engineering (FDE)' },
  // Menler Library — ₹49 per playbook/resource download (menler.in/resources).
  library: { amount: 49, label: 'Menler Library' },
  // Internal gateway test — a live ₹5 charge via /pay-test. Remove after testing.
  test: { amount: 5, label: 'Payment Gateway Test' },
};

export function priceFor(program) {
  return PROGRAM_PRICES[String(program || '').toLowerCase()] || null;
}

// The optional Claude Playbook Pack, sold ON TOP of a paid seat.
export const PACK_PRICE = 99;

// Only these campaigns add the pack to their seat price. The older pack
// campaigns are deliberately absent: for those the slug price above IS the
// pack and the seat itself is free, so adding it again would charge twice.
const PACK_ON_TOP = new Set(['build-like-an-ai-fde', 'ai-for-modern-work-and-careers']);

/** What to charge for a slug, given whether the buyer ticked the pack. */
export function amountFor(program, wantsPack) {
  const seat = priceFor(program);
  if (!seat) return null;
  const slug = String(program || '').toLowerCase();
  const pack = wantsPack && PACK_ON_TOP.has(slug) ? PACK_PRICE : 0;
  return { amount: seat.amount + pack, label: seat.label, pack };
}
