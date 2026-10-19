import { Router } from 'express';
import crypto from 'crypto';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { notify } from '../utils/notify.js';

const router = Router();

/* ZeptoMail bounce webhook → an alert under the admin bell.
 *
 * Set up in ZeptoMail (Mail Agents → Webhooks) with the URL
 *   <API>/webhooks/zeptomail?key=<ZEPTO_WEBHOOK_KEY>
 * and the hard-bounce and soft-bounce events. The key in the URL is the only
 * thing that proves the call came from ZeptoMail, so the endpoint stays off
 * (404) until ZEPTO_WEBHOOK_KEY is set.
 *
 * The payload is read defensively — whatever its exact shape, every address it
 * names becomes one alert — so a format change degrades to a vaguer alert
 * rather than a missed one. */
const keyOk = (given) => {
  const want = process.env.ZEPTO_WEBHOOK_KEY || '';
  if (!want || !given) return false;
  const a = Buffer.from(String(given));
  const b = Buffer.from(want);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

function firstString(obj, keys) {
  if (!obj || typeof obj !== 'object') return '';
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (keys.includes(k) && typeof v === 'string' && v) return v;
    if (v && typeof v === 'object') {
      const found = firstString(v, keys);
      if (found) return found;
    }
  }
  return '';
}

router.post('/zeptomail', (req, res) => {
  if (!process.env.ZEPTO_WEBHOOK_KEY) return res.status(404).end();
  if (!keyOk(req.query.key)) return res.status(401).json({ error: 'Invalid key' });

  const body = req.body || {};
  const event = [].concat(body.event_name || body.event || 'bounce').join(', ');
  const messages = [].concat(body.event_message || body.data || body);

  for (const msg of messages) {
    const subject = firstString(msg, ['subject']);
    const reason = firstString(msg, ['reason', 'bounced_reason', 'diagnostic_message', 'description']);
    const from = firstString(msg, ['from', 'sender']).toLowerCase();
    const addresses = [...new Set((JSON.stringify(msg).match(EMAIL_RE) || []).map((a) => a.toLowerCase()))]
      .filter((a) => a !== from && !/menler\.in$/.test(a));
    const requestId = firstString(msg, ['request_id', 'message_id', 'email_reference']);
    for (const to of addresses.length ? addresses : ['unknown address']) {
      notify({
        kind: 'email_bounced',
        key: `bounce:${requestId || subject}:${to}`,
        title: /soft/i.test(event) ? 'Email soft-bounced' : 'Email bounced',
        detail: `${subject ? `"${subject}" to ` : ''}${to}${reason ? ` · ${reason}` : ''}`,
        meta: { to, subject, event },
      });
    }
  }
  res.json({ ok: true });
});

export default router;
