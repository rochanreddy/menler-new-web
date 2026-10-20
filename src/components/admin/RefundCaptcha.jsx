import { useEffect, useRef, useState } from 'react';
import { WIDGET_ID } from '../../lib/amplifeedOtp';

/* The security check Amplifeed asks for before it texts a refund approval
   code (see server/utils/refundApproval.js). Cloudflare Turnstile, with the
   site key from our Amplifeed widget's settings, so it is the same check the
   site's forms already pass. Each token works once: remount (change `key`)
   to get a fresh one for the next send. */

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const WIDGET_URL = `https://www.amplifeed.tech/api/verify/v1/widget/${encodeURIComponent(WIDGET_ID)}`;

let scriptPromise;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = TURNSTILE_SRC;
      s.async = true;
      s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('no turnstile')));
      s.onerror = () => { scriptPromise = null; reject(new Error('blocked')); };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

let siteKeyPromise;
function loadSiteKey() {
  if (!siteKeyPromise) {
    siteKeyPromise = fetch(WIDGET_URL, { credentials: 'omit' })
      .then((r) => r.json())
      .then((w) => w.captchaSiteKey || '')
      .catch(() => { siteKeyPromise = null; return ''; });
  }
  return siteKeyPromise;
}

export default function RefundCaptcha({ onToken }) {
  const box = useRef(null);
  const [error, setError] = useState('');
  const tokenCb = useRef(onToken);
  useEffect(() => { tokenCb.current = onToken; }, [onToken]);

  useEffect(() => {
    let widgetId = null;
    let gone = false;
    Promise.all([loadTurnstile(), loadSiteKey()])
      .then(([ts, siteKey]) => {
        if (gone || !box.current) return;
        if (!siteKey) { setError('Could not load the security check. Reload the page and try again.'); return; }
        widgetId = ts.render(box.current, {
          sitekey: siteKey,
          callback: (t) => tokenCb.current(t),
          'expired-callback': () => tokenCb.current(''),
          'error-callback': () => { tokenCb.current(''); setError('The security check failed. Reload the page and try again.'); },
        });
      })
      .catch(() => setError('Could not load the security check. Check the connection, or turn off an ad blocker for this page.'));
    return () => {
      gone = true;
      if (widgetId !== null) try { window.turnstile?.remove(widgetId); } catch { /* already gone */ }
    };
  }, []);

  return (
    <div className="admin-refund-captcha">
      <div ref={box} />
      {error && <div className="admin-note admin-note--bad">{error}</div>}
    </div>
  );
}
