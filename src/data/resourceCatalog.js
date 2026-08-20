// Public PDF paths for email attachment delivery.
// Keep in sync with files under public/pdfs/ and public/question_banks/.

export const BROCHURE_PDF = {
  kickstarter: '/pdfs/Menler_AI_Kickstarter.pdf',
  generalist: '/pdfs/Menler_Claude_Gen_brochure.pdf',
  engineering: '/pdfs/Menler_Claude_Gen_brochure.pdf',
};

/** Resolve a brochure PDF from a program slug or display label. */
export function brochurePdfForProgram(program) {
  const key = String(program || '').toLowerCase();
  if (key.includes('kick')) return BROCHURE_PDF.kickstarter;
  if (key.includes('eng')) return BROCHURE_PDF.engineering;
  return BROCHURE_PDF.generalist;
}

export const CHECKOUT_CATALOG = [
  { id: 'prompt-library', title: 'Prompt Library', desc: '100+ tested prompts across business, engineering, and beginner tracks.', price: 499, pdf: '/pdfs/Menler_100_Prompts_Playbook.pdf' },
  { id: 'claude-code', title: 'Claude Code Playbook', desc: 'Build, refactor, and ship real code with Claude in your terminal and editor.', price: 499, pdf: '/pdfs/Menler_Claude_Code_Playbook.pdf' },
  { id: 'claude-chat', title: 'Claude Chat Playbook', desc: 'Everyday prompting — research, writing, analysis, and fast answers.', price: 499, pdf: '/pdfs/Menler_Claude_Chat_Playbook.pdf' },
  { id: 'claude-cowork', title: 'Claude Cowork Playbook', desc: 'Multi-document, multi-step work that turns raw inputs into finished deliverables.', price: 499, pdf: '/pdfs/Menler_Claude_Cowork_Playbook.pdf' },
  { id: 'claude-design', title: 'Claude Design Playbook', desc: 'Generate visuals, mockups, and on-brand design assets with Claude.', price: 499, pdf: '/pdfs/Menler_Claude_Design_Playbook.pdf' },
  { id: 'claude-ms', title: 'Claude in MS', desc: 'Use Claude across Microsoft 365 — Word, Excel, PowerPoint, and Teams.', price: 499, pdf: '/pdfs/Menler_Claude_Microsoft_Playbook.pdf' },
];

// Campaigns that sell their resources as a single paid PACK at checkout, instead
// of the free individual-resource add-ons. Keyed by Sanity campaign slug.
//
// The pack is charged server-side via the SAME slug key in
// server/config/pricing.js — the client never sends the amount, so keep `price`
// here (display only) in sync with the server amount for that slug.
// Registration itself stays free; the pack is an optional paid upsell, and its
// PDFs are only emailed after the payment succeeds.
export const CLAUDE_PLAYBOOK_PACK = {
  price: 99,
  title: 'Complete Claude Playbook Pack',
  desc: 'All 6 Menler Claude playbooks — delivered straight to your inbox.',
  items: CHECKOUT_CATALOG,
};

// EMPTY — the playbooks are free. Every campaign now falls through to the free
// individual add-ons at checkout (tick what you want, ₹0, emailed on submit),
// so nothing reaches Cashfree. The pack machinery above is kept intact: listing
// a slug here again is all it takes to sell a paid pack later, and it must be
// priced under the same slug in server/config/pricing.js to actually charge.
export const RESOURCE_PACKS = {};

// What a PAST order contains, which is not the same question as what we sell
// today. People bought the ₹99 pack under these slugs, and their orders still
// have to be deliverable — an admin pressing Resend on one must still send the
// six playbooks. Emptying RESOURCE_PACKS alone would have answered "no pack for
// this programme" and left paid buyers with nothing.
//
// So: RESOURCE_PACKS drives what checkout SELLS; this drives what delivery can
// SEND. Retiring a pack removes it from the first map only.
export const DELIVERABLE_PACKS = {
  'build-ai-automation-with-claude': CLAUDE_PLAYBOOK_PACK,
  'program-and-ops-with-ai': CLAUDE_PLAYBOOK_PACK,
  'build-claude-skills-and-schedules': CLAUDE_PLAYBOOK_PACK,
  'crack-your-next-high-paying-job-with-ai': CLAUDE_PLAYBOOK_PACK,
  'build-your-first-webapp-with-claude': CLAUDE_PLAYBOOK_PACK,
};

/** The paid resource pack a campaign SELLS at checkout, or null if it has none. */
export function resourcePackFor(campaign) {
  return campaign ? RESOURCE_PACKS[String(campaign).toLowerCase()] || null : null;
}
