// Display prices for paid programs. The SERVER (server/config/pricing.js) is the
// authoritative source for what's actually charged — keep these two in sync.
export const PROGRAM_PRICES = {
  kickstarter: { amount: 4999, label: 'Gen AI Kickstarter' },
  generalist: { amount: 59999, label: 'Claude AI Generalist Fellowship' },
  // NOTE: 'build-ai-automation-with-claude' registration is FREE. Its ₹99 is now
  // charged as an optional resource PACK at checkout (see RESOURCE_PACKS in
  // resourceCatalog.js), still priced by that slug in server/config/pricing.js.
  // Internal gateway test — a live ₹5 charge via /pay-test. Remove after testing.
  test: { amount: 5, label: 'Payment Gateway Test' },
};

export const formatINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
