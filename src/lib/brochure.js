// On-site brochure delivery: verify the email via OTP, then download the
// brochure PDF directly in the browser (no email). The lead is recorded in the
// background so the download always happens once verification succeeds.
//
// The program → PDF map mirrors the server (server/routes/leads.js).

import { verifyEmailOtp } from './amplifeedOtp';
import { downloadFile } from './download';
import { submitLead } from '../services/leadService';

const BROCHURE_PDFS = {
  kickstarter: '/pdfs/1_updated_Menler AI Kickstarter Brochure_2026.pdf',
  generalist: '/pdfs/Menler_Claude_Gen_brochure.pdf',
  engineering: '/pdfs/Menler_Claude_Gen_brochure.pdf',
};

export function brochurePdfForProgram(program) {
  const key = String(program || '').toLowerCase();
  if (key.includes('kick')) return BROCHURE_PDFS.kickstarter;
  if (key.includes('eng')) return BROCHURE_PDFS.engineering;
  return BROCHURE_PDFS.generalist;
}

// Verify the email, then hand the brochure over as an on-site download.
// `payload` carries email, program, and CRM fields (resource/source/cta_label/…).
export async function verifyAndDownloadBrochure(payload) {
  const otp = await verifyEmailOtp(String(payload.email || '').trim());
  const pdf = brochurePdfForProgram(payload.program);
  const base = (payload.resource || 'Menler Brochure').replace(/[^\w\s&-]/g, '').trim();
  downloadFile(pdf, `${base}.pdf`);
  submitLead({ ...payload, ...otp, pdf, source: payload.source || 'brochure', cta_label: payload.cta_label || 'Brochure' }).catch(() => {});
}
