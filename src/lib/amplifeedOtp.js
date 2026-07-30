// Amplifeed OTP helper (per Amplifeed's developer integration guide).
//
// Flow: load the OTP provider library → initSendOTP() shows its own code-entry UI
// and verifies the code → resolves with a short-lived access token. We then submit
// the lead through OUR backend (which saves to Mongo/admin AND forwards to
// Amplifeed with the webhook secret server-side), passing the token along.
//
// ONE widget handles both channels (SMS + Email); we force the channel per call
// with `channel: "sms" | "email"`. widgetId + tokenAuth are PUBLIC client keys
// (safe to expose in front-end code — the webhook SECRET stays on the server).

import { getVerifiedLead, saveVerifiedLead } from './verifiedSession';

// New Amplifeed keys start with wgt_ / otpta_. The retired MSG91 widget ids were
// bare hex with no prefix. Ignore a stale (old-format) env value so production
// can't get stuck on the widget Amplifeed is decommissioning — the new default
// is used whenever the env var is missing or still points at the old widget.
const envWidget = import.meta.env.VITE_AMPLIFEED_WIDGET_ID;
const envToken = import.meta.env.VITE_AMPLIFEED_TOKEN_AUTH;
// Exported so every Amplifeed surface (this helper AND the hosted /join form)
// shares one source of truth for the widget keys.
export const WIDGET_ID = envWidget && envWidget.startsWith('wgt_') ? envWidget : 'wgt_wSs5xDXuN29LToxM2F7pGdTM';
export const TOKEN_AUTH = envToken && envToken.startsWith('otpta_') ? envToken : 'otpta_1juDK90sM71bSmXNY011--pZzgeMiLvf';

// Amplifeed's embed loader. Exposes window.initSendOTP.
const OTP_HOSTS = ['https://www.amplifeed.tech/embed/otp/v1/otp-provider.js'];

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

// success callback: the new widget passes an object whose `.message` is the
// access token; older builds passed the token string directly — accept both.
const tokenFrom = (data) =>
  (data && typeof data === 'object' && data.message) ? data.message : data;

// Send an OTP to `identifier` over `channel` ("sms" | "email"). Resolves with the
// verified access token once the user enters the correct code; rejects on
// failure/cancel.
export function sendOtp(identifier, channel) {
  return new Promise((resolve, reject) => {
    const init = getInit();
    if (!init) {
      reject(new Error('Verification service is not ready. Please try again.'));
      return;
    }
    init({
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      identifier,
      ...(channel ? { channel } : {}),
      success: (data) => resolve(tokenFrom(data)),
      failure: (err) => {
        // Surface Amplifeed's real reason instead of a generic message.
        // eslint-disable-next-line no-console
        console.error('OTP failure:', err);
        const msg =
          (err && (err.message || err.msg || err.error || err.code || err.type ||
            (typeof err === 'string' ? err : ''))) || 'OTP verification failed.';
        reject(new Error(typeof msg === 'string' ? msg : 'OTP verification failed.'));
      },
    });
  });
}

// Verify an EMAIL via OTP and return the CRM fields to spread onto the lead
// payload. "Verify once" — if this email was already verified earlier in the
// session, reuse the stored token instead of prompting for a code again.
export async function verifyEmailOtp(email) {
  const clean = String(email || '').trim();
  const prev = getVerifiedLead();
  if (prev && prev.otp_token && String(prev.email || '').toLowerCase() === clean.toLowerCase()) {
    return { otp_token: prev.otp_token, otp_channel: prev.otp_channel || 'email', otp_identifier: prev.otp_identifier || clean };
  }
  await loadOtpProvider();
  const token = await sendOtp(clean, 'email');
  saveVerifiedLead({ email: clean, otp_token: token, otp_channel: 'email', otp_identifier: clean });
  return { otp_token: token, otp_channel: 'email', otp_identifier: clean };
}

// Verify a PHONE via SMS OTP (replaces the old WhatsApp channel). The identifier
// must be digits only — country code, NO "+" — per the widget (e.g. the +91
// number +91 99999 99999 becomes "919999999999").
export async function verifySmsOtp(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  await loadOtpProvider();
  const token = await sendOtp(digits, 'sms');
  return { otp_token: token, otp_channel: 'sms', otp_identifier: digits };
}

// Back-compat alias: any caller still importing verifyWhatsappOtp now gets SMS.
export const verifyWhatsappOtp = verifySmsOtp;
