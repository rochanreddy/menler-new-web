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

let loadPromise;

// Load otp-provider.js once, with the documented fallback host.
export function loadOtpProvider() {
  if (typeof window !== 'undefined' && window.initSendOTP) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    const inject = (src, onFail) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = onFail;
      document.body.appendChild(s);
    };
    inject('https://verify.amplifeed.tech/otp-provider.js', () =>
      inject('https://verify2.amplifeed.tech/otp-provider.js', () =>
        reject(new Error('Could not load the verification service.'))));
  });
  return loadPromise;
}

// Send an OTP to `identifier` (an email address for email OTP, or a full phone
// number with country code for SMS). Resolves with the verified token once the
// user enters the correct code in the provider's UI; rejects on failure/cancel.
export function sendOtp(identifier) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.initSendOTP) {
      reject(new Error('Verification service is not ready. Please try again.'));
      return;
    }
    window.initSendOTP({
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      identifier,
      success: (token) => resolve(token),
      failure: (err) => reject(err instanceof Error ? err : new Error('OTP verification failed.')),
    });
  });
}
