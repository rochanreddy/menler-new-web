// Public PDF paths for email attachment delivery.
// Keep in sync with files under public/pdfs/ and public/question_banks/.

export const BROCHURE_PDF = {
  kickstarter: '/pdfs/1_updated_Menler AI Kickstarter Brochure_2026.pdf',
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
export const RESOURCE_PACKS = {
  'build-ai-automation-with-claude': {
    price: 99,
    title: 'Complete Claude Playbook Pack',
    desc: 'All 6 Menler Claude playbooks — delivered straight to your inbox.',
    items: CHECKOUT_CATALOG,
  },
};

/** The paid resource pack for a campaign slug, or null if it has none. */
export function resourcePackFor(campaign) {
  return campaign ? RESOURCE_PACKS[String(campaign).toLowerCase()] || null : null;
}
