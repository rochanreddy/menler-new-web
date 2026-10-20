import crypto from 'crypto';

/* ── Refund approval by SMS code ─────────────────────────────────────────────
 *
 * A refund sends real money back, and the admin panel may be run by employees,
 * so every refund needs a one-time code texted to the owner's phone. The phone
 * number lives here on the server and nowhere in the browser: whoever is
 * logged in cannot point the code at their own phone.
 *
 * The code goes through Amplifeed, the same OTP service the site's forms use.
 * Amplifeed has no server-side "is this token real?" call, so the browser's
 * widget flow cannot be trusted on its own (anyone can call the refund API
 * without it). Instead the server makes both calls itself:
 *
 *   send   — identifier = the approver's phone, chosen here. Amplifeed asks
 *            for a Cloudflare captcha on every send; the admin's browser
 *            solves it and hands us the token, nothing else.
 *   verify — the reqId Amplifeed returned never leaves the server; the browser
 *            only holds an opaque approval id and types the code.
 *
 * An approval is tied to one order, one amount and one reason, and is used
 * once. Pending approvals live in memory: a server restart drops them, and
 * the admin simply sends a new code.
 */

const API_BASE = (process.env.AMPLIFEED_API_BASE || 'https://www.amplifeed.tech').replace(/\/$/, '');
// The same public widget keys the site's forms use (src/lib/amplifeedOtp.js).
const WIDGET_ID = process.env.AMPLIFEED_WIDGET_ID || 'wgt_wSs5xDXuN29LToxM2F7pGdTM';
const TOKEN_AUTH = process.env.AMPLIFEED_TOKEN_AUTH || 'otpta_1juDK90sM71bSmXNY011--pZzgeMiLvf';
// Amplifeed only answers requests from the widget's allowed sites.
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://menler.in';

// Who approves refunds: digits with the country code. Override with
// REFUND_APPROVER_PHONE on the server to hand approval to someone else.
const APPROVER_PHONE = String(process.env.REFUND_APPROVER_PHONE || '919774396955').replace(/\D/g, '');

const TTL_MS = 10 * 60 * 1000; // Amplifeed's codes expire after 10 minutes.
const pending = new Map(); // approvalId → { reqId, orderId, amount, note, expires }

function sweep() {
  const now = Date.now();
  for (const [id, a] of pending) if (a.expires < now) pending.delete(id);
}

/** "+91 97743 •••55" — enough to recognise the phone, not to read it out. */
export function maskedApproverPhone() {
  const local = APPROVER_PHONE.slice(-10);
  const cc = APPROVER_PHONE.slice(0, -10) || '91';
  return `+${cc} ${local.slice(0, 5)} •••${local.slice(-2)}`;
}

async function amplifeed(path, body) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: SITE_ORIGIN, Referer: `${SITE_ORIGIN}/admin` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    const err = new Error('The SMS service did not answer. Try again in a moment.');
    err.status = 502;
    throw err;
  }
  let data = null;
  try { data = await res.json(); } catch { /* not JSON */ }
  return { ok: res.ok, status: res.status, data: data || {} };
}

const SEND_ERRORS = {
  CAPTCHA_REQUIRED: 'Complete the security check first.',
  CAPTCHA_FAILED: 'The security check expired. Tick it again, then send the code.',
  RESEND_TOO_SOON: 'A code was sent a moment ago. Wait a few seconds before sending another.',
  DOMAIN_NOT_ALLOWED: 'The SMS service refused this server. Check SITE_ORIGIN on the API server.',
};

/**
 * Text a code to the approver for refunding `amount` on `orderId`.
 * Returns the approval id the browser sends back with the code.
 */
export async function sendRefundCode({ orderId, amount, note, captchaToken }) {
  sweep();
  if (!captchaToken) {
    const err = new Error(SEND_ERRORS.CAPTCHA_REQUIRED);
    err.status = 400;
    throw err;
  }
  const r = await amplifeed('/api/verify/v1/send', {
    widgetKey: WIDGET_ID,
    tokenAuth: TOKEN_AUTH,
    identifier: APPROVER_PHONE,
    channel: 'sms',
    captchaToken: String(captchaToken),
  });
  if (!r.ok || !r.data.reqId) {
    const code = String(r.data.error || r.data.code || 'SEND_FAILED');
    console.error('refund approval: send failed', r.status, code);
    const err = new Error(SEND_ERRORS[code] || `Could not send the code (${code}).`);
    err.status = r.status >= 500 ? 502 : 400;
    throw err;
  }
  // A new code replaces any earlier one for the same order.
  for (const [id, a] of pending) if (a.orderId === String(orderId)) pending.delete(id);
  const approvalId = crypto.randomBytes(18).toString('base64url');
  pending.set(approvalId, {
    reqId: String(r.data.reqId), orderId: String(orderId), amount, note, expires: Date.now() + TTL_MS,
  });
  return { approvalId, phone: maskedApproverPhone(), resendAfter: Number(r.data.resendAfter) || 30 };
}

/**
 * Check the code for an approval. Resolves with { amount, note } — the terms
 * the code was sent for — and spends the approval. Throws with a message the
 * admin can act on otherwise.
 */
export async function verifyRefundCode({ approvalId, orderId, otp }) {
  sweep();
  const a = pending.get(String(approvalId || ''));
  if (!a || a.orderId !== String(orderId)) {
    const err = new Error('This code has expired. Send a new one.');
    err.status = 400;
    err.expired = true;
    throw err;
  }
  const code = String(otp || '').replace(/\D/g, '');
  if (!code) {
    const err = new Error('Enter the code sent to the phone.');
    err.status = 400;
    throw err;
  }
  const r = await amplifeed('/api/verify/v1/verify', { reqId: a.reqId, otp: code });
  if (!r.ok || r.data.verified !== true) {
    const left = r.data.attemptsRemaining;
    const reason = String(r.data.error || r.data.code || '');
    if (/EXPIRED|NOT_FOUND|MAX|LOCK/i.test(reason) || left === 0) {
      pending.delete(approvalId);
      const err = new Error('This code can no longer be used. Send a new one.');
      err.status = 400;
      err.expired = true;
      throw err;
    }
    const err = new Error(`That code is not right.${Number.isFinite(left) ? ` ${left} ${left === 1 ? 'try' : 'tries'} left.` : ''}`);
    err.status = 400;
    throw err;
  }
  pending.delete(approvalId);
  return { amount: a.amount, note: a.note };
}
