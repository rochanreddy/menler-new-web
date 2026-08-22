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

/* ── Local development only: skip the widget ──────────────────────────────
 *
 * Amplifeed's widget requires a Cloudflare Turnstile pass before it will send
 * anything, and its /send call fails on a dev machine — which makes the whole
 * apply flow untestable locally even though nothing downstream of it is broken.
 * With this on, verification resolves at once with a token that is obviously
 * not real, so the rest of the flow can be exercised.
 *
 * It cannot reach production. `import.meta.env.DEV` is false in every build, so
 * Vite drops this branch out of the bundle entirely — the string below does not
 * exist in dist/. On top of that it has to be asked for by name in a local .env
 * (which is gitignored), so it can't be switched on by accident either.
 */
const DEV_BYPASS = import.meta.env.VITE_OTP_DEV_BYPASS === '1';

// Every use is written as `import.meta.env.DEV && DEV_BYPASS` rather than
// folding DEV into the constant above. Vite replaces import.meta.env.DEV with a
// literal false when building, so each guard collapses to `false && …`, esbuild
// drops the branch, and this function goes with it for want of a caller. Hide
// the check behind a helper and the minifier can no longer prove that, so the
// token string ships. Verified by grepping dist/ after a build.
const devToken = (channel, identifier) => {
  // eslint-disable-next-line no-console
  console.warn(`[otp] dev bypass — no ${channel} code sent to ${identifier}. Local only.`);
  // Deliberately unmistakable: if this ever appears on a lead, it was not a
  // verified applicant and the record should be read as a local test.
  return { otp_token: 'DEV-BYPASS-NOT-VERIFIED', otp_channel: channel, otp_identifier: identifier };
};

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

// The widget's own "Use <channel> instead" link calls retryOtp against the SAME
// identifier it was opened with. When that identifier is a phone number, the
// switch asks the API to email a phone number: it answers RESEND_TOO_SOON while
// the cooldown is running, and fails outright after it. The link cannot work as
// shipped, on any campaign.
//
// So we rebind it. The visitor has already typed an email address into the form
// above; the link now closes the widget and reopens it against that address,
// which is a verification that can actually be delivered.
//
// Everything here is defensive: the widget is a third party's markup, and if any
// piece of it moves, the watcher simply never matches and the link behaves as it
// did before.
const CHANNEL_LABELS = { sms: 'phone number', email: 'email', whatsapp: 'WhatsApp number', voice: 'phone number' };
const HOST_SELECTOR = '#amplifeed-otp-host';

const otpShadow = () => {
  const host = typeof document !== 'undefined' && document.querySelector(HOST_SELECTOR);
  return (host && host.shadowRoot) || null;
};

// Their closeModal() also clears the countdown timer, so click their button
// rather than removing the host ourselves.
function closeOtpWidget() {
  try {
    const btn = otpShadow()?.querySelector('button.close');
    if (btn) btn.click();
  } catch { /* widget already gone */ }
}

// Paste and SMS autofill both drop everything after the first digit. Their six
// boxes are maxLength=1 and share one input handler:
//
//   var v = input.value.replace(/\D/g, ''); input.value = v.slice(0, 1)
//
// so any value longer than a single character is cut down to its first. And
// autocomplete="one-time-code" sits on box 0 alone, which is where the phone
// puts the whole code — straight into the box that throws five sixths of it
// away. One cause, both symptoms.
//
// Fixed by listening on the shadow root in the CAPTURE phase, so we see the
// event before the box does and can stop it reaching that handler, then
// spreading the digits across the row ourselves. Their verify reads the boxes
// back out of the DOM (readCode()), so setting values is all that is needed —
// there is no internal state to keep in step.
function spreadDigits(root, target, rawValue) {
  const boxes = Array.from(root.querySelectorAll('input.digit'));
  if (!boxes.length) return false;
  const digits = String(rawValue || '').replace(/\D/g, '');
  if (digits.length < 2) return false;
  // A full-length code fills from the start wherever it was dropped; a partial
  // one continues from the box it landed in.
  const at = boxes.indexOf(target);
  const begin = digits.length >= boxes.length || at < 0 ? 0 : at;
  for (let i = 0; begin + i < boxes.length; i++) boxes[begin + i].value = digits[i] || '';
  const lastFilled = Math.min(begin + digits.length, boxes.length) - 1;
  const focusTarget = boxes[lastFilled + 1] || boxes[lastFilled];
  if (focusTarget && focusTarget.focus) focusTarget.focus();
  return true;
}

function enhanceOtpDigits() {
  if (typeof MutationObserver === 'undefined') return () => {};
  let root = null;
  const isDigit = (el) => el && el.classList && el.classList.contains('digit');

  const onPaste = (e) => {
    if (!isDigit(e.target) || !root) return;
    const cb = e.clipboardData || window.clipboardData;
    const text = cb && cb.getData ? cb.getData('text') : '';
    if (String(text).replace(/\D/g, '').length < 2) return;
    e.preventDefault();
    e.stopPropagation();
    spreadDigits(root, e.target, text);
  };

  // Autofill, and any keyboard that commits more than one character at once.
  const onInput = (e) => {
    if (!isDigit(e.target) || !root) return;
    if (String(e.target.value || '').replace(/\D/g, '').length < 2) return;
    e.stopPropagation();
    spreadDigits(root, e.target, e.target.value);
  };

  const attach = () => {
    const sh = otpShadow();
    if (!sh || sh === root) return;
    root = sh;
    sh.addEventListener('paste', onPaste, true);
    sh.addEventListener('input', onInput, true);
    // maxLength=1 makes the browser truncate a paste or an autofill before any
    // script sees it. Widen the boxes so the whole code can land; it is put
    // back to one digit per box the moment it does.
    sh.querySelectorAll('input.digit').forEach((b, _i, all) => { b.maxLength = all.length; });
  };

  const obs = new MutationObserver(attach);
  try { obs.observe(document.body, { childList: true, subtree: true }); } catch { /* no body yet */ }
  attach();
  const poll = setInterval(attach, 300);
  return () => {
    clearInterval(poll);
    obs.disconnect();
    if (root) {
      root.removeEventListener('paste', onPaste, true);
      root.removeEventListener('input', onInput, true);
    }
  };
}

// Watch the widget's shadow root for the switch link and hand it a new handler.
// Returns a stop function.
function watchForSwitchLink(channel, onSwitch) {
  if (typeof MutationObserver === 'undefined') return () => {};
  const wanted = `use ${CHANNEL_LABELS[channel] || channel} instead`;
  let patched = false;
  const tryPatch = () => {
    if (patched) return;
    const root = otpShadow();
    if (!root) return;
    const link = Array.from(root.querySelectorAll('button.link'))
      .find((b) => (b.textContent || '').trim().toLowerCase() === wanted);
    if (!link) return;
    patched = true;
    // Cloning drops the widget's own listener; ours is the only one left.
    const fresh = link.cloneNode(true);
    link.replaceWith(fresh);
    fresh.addEventListener('click', (e) => { e.preventDefault(); onSwitch(); });
  };
  const obs = new MutationObserver(tryPatch);
  try {
    obs.observe(document.body, { childList: true, subtree: true });
  } catch { /* no body yet */ }
  tryPatch();
  const poll = setInterval(tryPatch, 300);
  return () => { clearInterval(poll); obs.disconnect(); };
}

// Open the widget for one identifier on one channel. Resolves with the token,
// the channel it was actually verified on, and the identifier used — the last
// two matter because the visitor may have switched channels mid-flow, and the
// lead must record what really happened.
export function sendOtpFull(identifier, channel, alt) {
  return new Promise((resolve, reject) => {
    const init = getInit();
    if (!init) {
      reject(new Error('Verification service is not ready. Please try again.'));
      return;
    }
    let stop = () => {};
    const stopDigits = enhanceOtpDigits();
    const done = (fn) => (v) => { stop(); stopDigits(); fn(v); };
    const ok = done(resolve);
    const bad = done(reject);

    init({
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      identifier,
      ...(channel ? { channel } : {}),
      success: (data) => ok({ token: tokenFrom(data), channel, identifier }),
      failure: (err) => {
        // Surface Amplifeed's real reason instead of a generic message.
        // eslint-disable-next-line no-console
        console.error('OTP failure:', err);
        const msg =
          (err && (err.message || err.msg || err.error || err.code || err.type ||
            (typeof err === 'string' ? err : ''))) || 'OTP verification failed.';
        bad(new Error(typeof msg === 'string' ? msg : 'OTP verification failed.'));
      },
    });

    if (alt && alt.identifier) {
      stop = watchForSwitchLink(alt.channel, () => {
        stop();
        closeOtpWidget();
        // Reopen on the other channel, offering the way back as its own switch.
        sendOtpFull(alt.identifier, alt.channel, { channel, identifier })
          .then(resolve, reject);
      });
    }
  });
}

// Send an OTP to `identifier` over `channel` ("sms" | "email"). Resolves with the
// verified access token once the user enters the correct code; rejects on
// failure/cancel.
export function sendOtp(identifier, channel) {
  return sendOtpFull(identifier, channel).then((r) => r.token);
}

// Verify an EMAIL via OTP and return the CRM fields to spread onto the lead
// payload. "Verify once" — if this email was already verified earlier in the
// session, reuse the stored token instead of prompting for a code again.
export async function verifyEmailOtp(email) {
  const clean = String(email || '').trim();
  if (import.meta.env.DEV && DEV_BYPASS) return devToken('email', clean);
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
//
// Pass `email` to make the widget's "Use email instead" link work: without it
// that link retries the phone number over email and always fails.
export async function verifySmsOtp(phone, { email } = {}) {
  const digits = String(phone || '').replace(/\D/g, '');
  const clean = String(email || '').trim();
  if (import.meta.env.DEV && DEV_BYPASS) return devToken('sms', digits);
  await loadOtpProvider();
  const r = await sendOtpFull(digits, 'sms', clean ? { channel: 'email', identifier: clean } : null);
  // If they switched, the lead must say email — not the sms we opened with.
  if (r.channel === 'email') {
    saveVerifiedLead({ email: r.identifier, otp_token: r.token, otp_channel: 'email', otp_identifier: r.identifier });
    return { otp_token: r.token, otp_channel: 'email', otp_identifier: r.identifier };
  }
  return { otp_token: r.token, otp_channel: 'sms', otp_identifier: digits };
}

// Back-compat alias: any caller still importing verifyWhatsappOtp now gets SMS.
export const verifyWhatsappOtp = verifySmsOtp;
