import { useEffect } from 'react';

// Amplifeed OTP lead form — embeds Amplifeed's hosted widget (collects details,
// emails an OTP, verifies, and pushes a verified lead straight to the Amplifeed
// CRM — no backend on our side).
//
// Config comes from env vars (set in Vercel + local .env, NOT committed) so the
// keys aren't hardcoded in the repo. Heads-up: this is a CLIENT-SIDE embed, so
// whatever keys are used are still visible in the browser source — only use
// values Amplifeed confirms are safe to expose publicly.
const AF = {
  sourceKey: import.meta.env.VITE_AMPLIFEED_SOURCE_KEY,
  secret: import.meta.env.VITE_AMPLIFEED_SECRET,
  widgetId: import.meta.env.VITE_AMPLIFEED_WIDGET_ID,
  tokenAuth: import.meta.env.VITE_AMPLIFEED_TOKEN_AUTH,
};

export default function AmplifeedOtpForm({ channels = 'email', fields = 'name,email,phone,company,message' }) {
  const ready = AF.sourceKey && AF.secret && AF.widgetId && AF.tokenAuth;

  useEffect(() => {
    if (!ready) return;
    // Load Amplifeed's embed script once, after the target div is in the DOM.
    if (document.querySelector('script[data-amplifeed-otp]')) return;
    const s = document.createElement('script');
    s.src = 'https://www.amplifeed.tech/embed/amplifeed-otp.js';
    s.async = true;
    s.setAttribute('data-amplifeed-otp', '');
    document.body.appendChild(s);
  }, [ready]);

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
