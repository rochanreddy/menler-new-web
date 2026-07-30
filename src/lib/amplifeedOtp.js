// Amplifeed / MSG91 OTP helper (per Amplifeed's developer integration guide).
//
// Flow: load the OTP provider library → initSendOTP() shows its own code-entry UI
// and verifies the code → resolves with a short-lived token. We then submit the
// lead through OUR backend (which saves to Mongo/admin AND forwards to Amplifeed
// with the webhook secret server-side), passing the token along for the CRM.
//
// widgetId + tokenAuth are client-side OTP widget keys (safe to expose, required
// in the browser). The webhook SECRET is NOT here — it stays on the server.

import { getVerifiedLead, saveVerifiedLead } from './verifiedSession';

const WIDGET_ID = import.meta.env.VITE_AMPLIFEED_WIDGET_ID || '3666786e5151323537333631';
// MSG91 WhatsApp OTP widget (delivers the code over WhatsApp to the phone).
const WA_WIDGET_ID = import.meta.env.VITE_AMPLIFEED_WA_WIDGET_ID || '366761674d78303532383739';
const TOKEN_AUTH = import.meta.env.VITE_AMPLIFEED_TOKEN_AUTH || '517767Ts6KDsui6a3bef4eP1';

// The OTP provider is MSG91 (Amplifeed's documented verify.amplifeed.tech host
// 404s, so we load MSG91 directly — same script the Amplifeed embed widget uses).
const OTP_HOSTS = [
  'https://verify.msg91.com/otp-provider.js',
  'https://verify.phone91.com/otp-provider.js',
];

const getInit = () =>
  (typeof window !== 'undefined' && (window.initSendOTP || window.initSendOtp)) || null;

let loadPromise;

// Load otp-provider.js once, trying each host in turn.
export function loadOtpProvider() {
  if (getInit()) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    let i = 0;
    const tryNext = () => {
      if (i >= OTP_HOSTS.length) {
        reject(new Error('Could not load the verification service.'));
        return;
      }
      const s = document.createElement('script');
      s.src = OTP_HOSTS[i++];
      s.async = true;
      s.onload = () => resolve();
      s.onerror = tryNext;
      document.body.appendChild(s);
    };
    tryNext();
  });
  return loadPromise;
}

// Convenience: verify an EMAIL via OTP and return the CRM fields to spread onto
// the lead payload. The site uses email verification only — there is no SMS /
// mobile OTP path.
//
// "Verify once" — if this email was already verified earlier in the session,
// reuse the stored token instead of prompting for a code again (so downloading
// more PDFs / submitting other forms doesn't re-ask for verification).
export async function verifyEmailOtp(email) {
  const clean = String(email || '').trim();
  const prev = getVerifiedLead();
  if (prev && prev.otp_token && String(prev.email || '').toLowerCase() === clean.toLowerCase()) {
    return { otp_token: prev.otp_token, otp_channel: prev.otp_channel || 'email', otp_identifier: prev.otp_identifier || clean };
  }
  await loadOtpProvider();
  const token = await sendOtp(email);
  saveVerifiedLead({ email: clean, otp_token: token, otp_channel: 'email', otp_identifier: clean });
  return { otp_token: token, otp_channel: 'email', otp_identifier: email };
}

// Convenience: verify a PHONE via WhatsApp OTP (code delivered over WhatsApp).
// `phone` must include the country code, e.g. "+919876543210" or "919876543210".
export async function verifyWhatsappOtp(phone) {
  const clean = String(phone || '').trim();
  await loadOtpProvider();
  const token = await sendOtp(clean, WA_WIDGET_ID);
  return { otp_token: token, otp_channel: 'whatsapp', otp_identifier: clean };
}

// Send an OTP to `identifier` (an email for the email widget, or a phone with
// country code for the WhatsApp widget). Resolves with the verified token once
// the user enters the correct code in the provider's UI; rejects on failure/cancel.
export function sendOtp(identifier, widgetId = WIDGET_ID) {
  return new Promise((resolve, reject) => {
    const init = getInit();
    if (!init) {
      reject(new Error('Verification service is not ready. Please try again.'));
      return;
    }
    init({
      widgetId,
      tokenAuth: TOKEN_AUTH,
      identifier,
      success: (token) => resolve(token),
      failure: (err) => {
        // Surface MSG91's real reason instead of a generic message.
        // eslint-disable-next-line no-console
        console.error('OTP failure:', err);
        const msg =
          (err && (err.message || err.msg || err.error || err.type ||
            (typeof err === 'string' ? err : ''))) || 'OTP verification failed.';
        reject(new Error(typeof msg === 'string' ? msg : 'OTP verification failed.'));
      },
    });
  });
}
