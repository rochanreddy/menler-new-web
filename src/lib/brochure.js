// On-site brochure delivery: verify the reader, then download the brochure PDF
// directly in the browser (no email). The lead is recorded in the background so
// the download always happens once verification succeeds.
//
// The program → PDF map mirrors the server (server/routes/leads.js).

import { verifyEmailOtp, verifySmsOtp } from './amplifeedOtp';
import { formatPhone, isSmsReachable, phoneDigits, phoneMinLength } from './phone';
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
// THE CODE GOES BY SMS, EXCEPT WHERE SMS CANNOT REACH. Our provider only
// delivers inside India, so a non-+91 number would never receive one and the
// download would dead-end with nothing on screen to explain it. Those are
// verified by email instead — the same proof of a real person, and the same
// split the Kickstarter and campaign forms already make. The number is still
// collected and still reaches the CRM either way.
export async function verifyAndDownloadBrochure(payload) {
  const email = String(payload.email || '').trim();
  const code = String(payload.countryCode || '+91').trim();
  // The SMS identifier is country code + number, digits only, no "+".
  const digits = phoneDigits(code, payload.phone);

  // A form that collects no number at all still has to work: without this it
  // would text the bare country code and the reader would wait on nothing.
  const smsReady =
    isSmsReachable(code) &&
    String(payload.phone || '').replace(/\D/g, '').length >= phoneMinLength(code);

  const otp = smsReady
    // `email` makes the widget's "use email instead" link work; without it that
    // link retries the phone number over email and always fails.
    ? await verifySmsOtp(digits, { email })
    : await verifyEmailOtp(email);

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
