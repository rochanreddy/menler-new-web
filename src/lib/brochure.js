// On-site brochure delivery: verify the reader, then download the brochure PDF
// directly in the browser (no email). The lead is recorded in the background so
// the download always happens once verification succeeds.
//
// The program → PDF map mirrors the server (server/routes/leads.js).

import { verifyLeadIdentity } from './leadVerify';
import { formatPhone } from './phone';
import { downloadFile } from './download';
import { submitLead } from '../services/leadService';

const BROCHURE_PDFS = {
  kickstarter: '/pdfs/Menler_AI_Kickstarter.pdf',
  generalist: '/pdfs/Menler_Claude_Gen_brochure.pdf',
  engineering: '/pdfs/Menler_Claude_Gen_brochure.pdf',
};

export function brochurePdfForProgram(program) {
  const key = String(program || '').toLowerCase();
  if (key.includes('kick')) return BROCHURE_PDFS.kickstarter;
  if (key.includes('eng')) return BROCHURE_PDFS.engineering;
  return BROCHURE_PDFS.generalist;
}

// Verify, then hand the brochure over as an on-site download.
// `payload` carries email, countryCode + phone, program, and the CRM fields
// (resource/source/cta_label/…).
//
// The code goes by SMS where SMS can reach, and by email where it cannot —
// see lib/leadVerify, which every download on the site shares.
export async function verifyAndDownloadBrochure(payload) {
  const email = String(payload.email || '').trim();
  const code = String(payload.countryCode || '+91').trim();

  const otp = await verifyLeadIdentity({ email, countryCode: code, phone: payload.phone });

  const pdf = brochurePdfForProgram(payload.program);
  const base = (payload.resource || 'Menler Brochure').replace(/[^\w\s&-]/g, '').trim();
  downloadFile(pdf, `${base}.pdf`);
  submitLead({
    ...payload,
    email,
    // Stored the way the rest of the site stores it: dialling code, space, number.
    phone: formatPhone(code, payload.phone),
    ...otp,
    pdf,
    source: payload.source || 'brochure',
    cta_label: payload.cta_label || 'Brochure',
  }).catch(() => {});
}
