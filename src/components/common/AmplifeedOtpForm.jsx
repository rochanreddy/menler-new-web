import { useEffect, useRef } from 'react';

// Amplifeed OTP lead form — embeds Amplifeed's hosted widget (collects details,
// emails an OTP, verifies, and pushes a verified lead straight to the Amplifeed
// CRM — no backend on our side).
//
// Amplifeed public embed keys. Baked in so the form always works (Vercel wasn't
// injecting the env vars into the build, leaving the widget with no auth →
// "network error"). Env vars still override if present. NOTE: these are
// client-side embed keys and are visible in the browser bundle by design.
const AF = {
  sourceKey: import.meta.env.VITE_AMPLIFEED_SOURCE_KEY || 'S0-1VbVfoh_ydsCFUsu1MXld',
  secret: import.meta.env.VITE_AMPLIFEED_SECRET || 'AYnA2j75Izjd7arD_AiKIDy2',
  widgetId: import.meta.env.VITE_AMPLIFEED_WIDGET_ID || '3666786e5151323537333631',
  tokenAuth: import.meta.env.VITE_AMPLIFEED_TOKEN_AUTH || '517767Ts6KDsui6a3bef4eP1',
};

export default function AmplifeedOtpForm({ channels = 'email', fields = 'name,email,phone,company,message', onSuccess, verifyLabel }) {
  const ready = AF.sourceKey && AF.secret && AF.widgetId && AF.tokenAuth;
  const leadRef = useRef({});
  const firedRef = useRef(false);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (!ready) return;
    // Load Amplifeed's embed script once, after the target div is in the DOM.
    if (document.querySelector('script[data-amplifeed-otp]')) return;
    const s = document.createElement('script');
    s.src = 'https://www.amplifeed.tech/embed/amplifeed-otp.js';
    s.async = true;
    s.setAttribute('data-amplifeed-otp', '');
    // data-base tells the widget where to send the final submit. Without it the
    // widget falls back to a placeholder host and the submit fails ("Network error").
    s.setAttribute('data-base', 'https://www.amplifeed.tech');
    document.body.appendChild(s);
  }, [ready]);

  // The widget has no redirect/callback or label options, so we drive it from the
  // DOM: optionally relabel the primary CTA, capture the entered fields, auto-click
  // the final "Submit" once the OTP is verified, and route onward on success.
  useEffect(() => {
    if (!ready || (typeof onSuccess !== 'function' && !verifyLabel)) return;
    const root = document.getElementById('amplifeed-form');
    if (!root) return;

    const byPlaceholder = (re) =>
      [...root.querySelectorAll('input')].find((i) => re.test(i.placeholder || ''))?.value?.trim() || '';
    const byType = (t) => root.querySelector(`input[type="${t}"]`)?.value?.trim() || '';
    const texts = () => [...root.querySelectorAll('input[type="text"]')];
    const capture = () => {
      leadRef.current = {
        name: byPlaceholder(/name/i) || texts()[0]?.value?.trim() || '',
        email: byType('email') || byPlaceholder(/email/i),
        phone: byType('tel') || byPlaceholder(/phone|mobile/i),
      };
    };
    root.addEventListener('input', capture, true);

    let obs;
    const apply = () => {
      // (1) Relabel the primary verify CTA, e.g. "Verify email" → "Verify to register".
      if (verifyLabel) {
        const cta = [...root.querySelectorAll('button')]
          .find((b) => /^\s*verify\s+(email|mobile|phone)\b/i.test(b.textContent || ''));
        if (cta && cta.textContent.trim() !== verifyLabel) cta.textContent = verifyLabel;
      }
      if (typeof onSuccess !== 'function' || firedRef.current) return;
      // (2) Success state reached → route onward (e.g. to checkout).
      if (/received your details/i.test(root.textContent || '')) {
        firedRef.current = true;
        if (obs) obs.disconnect();
        onSuccess({ ...leadRef.current });
        return;
      }
      // (3) The final "Submit" button only appears once the OTP is verified, so its
      // presence (enabled) is the safe signal to auto-click — no manual click needed.
      if (!autoSubmittedRef.current) {
        const submit = [...root.querySelectorAll('button')]
          .find((b) => /^\s*submit\s*$/i.test(b.textContent || '') && !b.disabled && b.offsetParent !== null);
        if (submit) {
          autoSubmittedRef.current = true;
          setTimeout(() => submit.click(), 500);
        }
      }
    };

    obs = new MutationObserver(apply);
    obs.observe(root, { childList: true, subtree: true, characterData: true });
    apply();

    return () => { root.removeEventListener('input', capture, true); obs.disconnect(); };
  }, [ready, onSuccess, verifyLabel]);

  if (!ready) {
    return import.meta.env.DEV
      ? <p style={{ color: '#888', fontSize: 13, textAlign: 'center' }}>Amplifeed form not configured — set the VITE_AMPLIFEED_* env vars.</p>
      : null;
  }

  return (
    <div
      id="amplifeed-form"
      className="amplifeed-form"
      data-source-key={AF.sourceKey}
      data-secret={AF.secret}
      data-widget-id={AF.widgetId}
      data-token-auth={AF.tokenAuth}
      data-channels={channels}
      data-fields={fields}
    />
  );
}
