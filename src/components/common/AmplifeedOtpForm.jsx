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

export default function AmplifeedOtpForm({ channels = 'email', fields = 'name,email,phone,company,message', onSuccess }) {
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

  // The widget has no redirect/success callback, so when onSuccess is provided we
  // (1) capture the entered fields as the user types, and (2) watch the widget for
  // its "Thank you! We received your details." success state, then hand the data
  // back to the caller (e.g. to route to checkout).
  useEffect(() => {
    if (!ready || typeof onSuccess !== 'function') return;
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

    // Pick the widget's primary action button (avoid resend/edit/back links).
    const pickSubmit = () => {
      const btns = [...root.querySelectorAll('button')].filter((b) => !b.disabled && b.offsetParent !== null);
      const isSecondary = (b) => /resend|edit|change|back|cancel/i.test(b.textContent || '');
      return btns.find((b) => /submit|continue|register|proceed|done/i.test(b.textContent || '') && !isSecondary(b))
        || btns.reverse().find((b) => !isSecondary(b))
        || null;
    };

    const obs = new MutationObserver(() => {
      if (firedRef.current) return;
      // Reached the CRM success state → hand back to the caller (route to checkout).
      if (/received your details/i.test(root.textContent || '')) {
        firedRef.current = true;
        obs.disconnect();
        onSuccess({ ...leadRef.current });
        return;
      }
      // OTP just verified → auto-click submit so the user doesn't have to, which
      // then produces the success state handled above.
      if (!autoSubmittedRef.current && /verified/i.test(root.textContent || '')) {
        const btn = pickSubmit();
        if (btn) {
          autoSubmittedRef.current = true;
          setTimeout(() => btn.click(), 200);
        }
      }
    });
    obs.observe(root, { childList: true, subtree: true, characterData: true });

    return () => { root.removeEventListener('input', capture, true); obs.disconnect(); };
  }, [ready, onSuccess]);

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
