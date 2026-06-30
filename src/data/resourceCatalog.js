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
