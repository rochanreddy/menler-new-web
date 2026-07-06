// Display prices for paid programs. The SERVER (server/config/pricing.js) is the
// authoritative source for what's actually charged — keep these two in sync.
export const PROGRAM_PRICES = {
  kickstarter: { amount: 4999, label: 'Gen AI Kickstarter' },
  generalist: { amount: 59999, label: 'Claude AI Generalist Fellowship' },
};

export const formatINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
