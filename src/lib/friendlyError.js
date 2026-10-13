// Turn a failure during registration or checkout into what the visitor needs:
// a message that says what happened and what to do, and whether "Try again"
// makes sense. Also reports it, so the team sees failures without waiting for
// someone to complain. Pairs with apiFetch (./apiFetch), whose errors carry a
// `kind` and `status`.
//
// `stage` names where it happened, so both the message and the log are specific:
//   'otp'      verifying the phone / email code
//   'register' saving the registration
//   'order'    starting a payment
//   'payment'  the payment itself (Cashfree)
//   'confirm'  confirming the payment / completing registration afterwards

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const OTP_HINTS = [
  [/cancel|closed|dismiss/i, 'Verification was closed before the code was entered. Tap the button to try again.', true],
  [/invalid|incorrect|wrong|mismatch/i, "That code didn't match. Please try again and enter the latest code you received.", true],
  [/expire/i, 'That code has expired. Please try again to get a new one.', true],
  [/limit|too many|attempt/i, 'Too many verification attempts. Please wait a few minutes before trying again.', false],
  [/not ready|could not load|load the verification/i, "We couldn't load the verification step. Check your connection and try again.", true],
];

/** { message, retry, code } for an error thrown at `stage`. */
export function friendlyError(err, stage) {
  const kind = err?.kind;
  const status = err?.status;
  const raw = String(err?.message || '');

  if (kind === 'network' || /failed to fetch|networkerror|load failed/i.test(raw)) {
    return { code: 'network', retry: true, message: "We couldn't connect to our server. Please check your internet connection and try again." };
  }
  if (kind === 'timeout') {
    return { code: 'timeout', retry: true, message: 'Our server is taking longer than usual to respond. Please wait a few seconds and try again.' };
  }
  if (status === 429) {
    return { code: 'rate_limited', retry: false, message: 'Too many attempts in a short time. Please wait a minute and try again.' };
  }
  if (status >= 500) {
    return { code: `server_${status}`, retry: true, message: 'Something went wrong on our side. Please try again. If it keeps happening, message us on WhatsApp.' };
  }
  if (status >= 400) {
    // Our own validation messages ("Name, a valid email and a 10-digit phone
    // are required.") are already written for the visitor; fixing the form,
    // not retrying it unchanged, is what helps.
    return { code: `client_${status}`, retry: false, message: raw || 'Please check your details and try again.' };
  }

  if (stage === 'otp') {
    for (const [re, message, retry] of OTP_HINTS) if (re.test(raw)) return { code: 'otp', retry, message };
    return { code: 'otp', retry: true, message: "We couldn't verify your number. Please try again." };
  }
  if (stage === 'payment') {
    if (/cancel/i.test(raw)) return { code: 'payment_cancelled', retry: true, message: 'The payment was cancelled, so nothing was charged. You can try again whenever you are ready.' };
    return { code: 'payment_failed', retry: true, message: "The payment didn't go through. Nothing was charged. Please try again, or use a different payment method." };
  }
  if (stage === 'confirm') {
    return { code: 'confirm', retry: true, message: "We couldn't confirm your payment yet. If money was deducted, it will be confirmed automatically and you'll get an email. Otherwise, please try again." };
  }
  return { code: 'unknown', retry: true, message: raw || 'Something went wrong. Please try again.' };
}

/** Log a failure for the team. Fire-and-forget: reporting must never add a second error. */
export function reportError(stage, err, info = {}) {
  try {
    const f = friendlyError(err, stage);
    const body = JSON.stringify({
      stage,
      code: f.code,
      message: String(err?.message || '').slice(0, 300),
      status: err?.status || null,
      campaign: info.campaign || '',
      page: window.location.pathname,
    });
    fetch(`${API_URL}/client-errors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch { /* never let logging break the page */ }
}
