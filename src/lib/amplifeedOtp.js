// Amplifeed / MSG91 OTP helper (per Amplifeed's developer integration guide).
//
// Flow: load the OTP provider library → initSendOTP() shows its own code-entry UI
// and verifies the code → resolves with a short-lived token. We then submit the
// lead through OUR backend (which saves to Mongo/admin AND forwards to Amplifeed
// with the webhook secret server-side), passing the token along for the CRM.
//
// widgetId + tokenAuth are client-side OTP widget keys (safe to expose, required
// in the browser). The webhook SECRET is NOT here — it stays on the server.

const WIDGET_ID = import.meta.env.VITE_AMPLIFEED_WIDGET_ID || '3666786e5151323537333631';
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

// Send an OTP to `identifier` (an email address for email OTP, or a full phone
// number with country code for SMS). Resolves with the verified token once the
// user enters the correct code in the provider's UI; rejects on failure/cancel.
export function sendOtp(identifier) {
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
      success: (token) => resolve(token),
      failure: (err) => reject(err instanceof Error ? err : new Error('OTP verification failed.')),
    });
  });
}
