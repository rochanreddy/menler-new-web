import { useEffect } from 'react';

// Amplifeed OTP lead form — embeds Amplifeed's hosted widget (collects details,
// emails an OTP, verifies, and pushes a verified lead straight to the Amplifeed
// CRM — no backend on our side).
//
// Amplifeed embed keys. These are baked in so the form always works (no env
// setup needed); env vars override them if set. Heads-up: this is a CLIENT-SIDE
// embed, so these keys are visible in the browser source by design — they are
// Amplifeed's public embed keys for this widget.
const AF = {
  sourceKey: import.meta.env.VITE_AMPLIFEED_SOURCE_KEY || 'S0-1VbVfoh_ydsCFUsu1MXld',
  secret: import.meta.env.VITE_AMPLIFEED_SECRET || 'AYnA2j75Izjd7arD_AiKIDy2',
  widgetId: import.meta.env.VITE_AMPLIFEED_WIDGET_ID || '3666786e5151323537333631',
  tokenAuth: import.meta.env.VITE_AMPLIFEED_TOKEN_AUTH || '517767Ts6KDsui6a3bef4eP1',
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
