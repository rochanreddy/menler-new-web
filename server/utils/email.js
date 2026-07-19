import { createRequire } from 'node:module';
import nodemailer from 'nodemailer';
import { JWT } from 'google-auth-library';

// MailComposer builds a correct RFC-822 MIME message (with attachments) without
// sending it — we reuse it to hand a raw message to the Gmail API.
const require = createRequire(import.meta.url);
const MailComposer = require('nodemailer/lib/mail-composer');

const {
  RESEND_API_KEY,
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
  GOOGLE_SA_KEY, GMAIL_SENDER,
  MAIL_FROM, MAIL_REPLY_TO,
} = process.env;

const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.send';
const FROM = MAIL_FROM || (GMAIL_SENDER ? `Menler <${GMAIL_SENDER}>` : 'Menler <no-reply@menler.in>');
const REPLY_TO = MAIL_REPLY_TO || '';

/* ── Transport selection ──────────────────────────────────────────────────────
 * Resend (HTTPS API) is preferred because platforms like Render block outbound
 * SMTP — HTTPS on 443 is never blocked, and it needs no Google org access.
 * Gmail API (also HTTPS) and SMTP remain as alternates; with none configured,
 * mail logs to the console (dev).
 * ─────────────────────────────────────────────────────────────────────────── */

const resendConfigured = Boolean(RESEND_API_KEY);
const gmailConfigured = Boolean(GOOGLE_SA_KEY && GMAIL_SENDER);
const smtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

export function isMailConfigured() {
  return resendConfigured || gmailConfigured || smtpConfigured;
}
// Back-compat name used elsewhere.
export const isSmtpConfigured = isMailConfigured;

function mailMode() {
  if (resendConfigured) return 'resend';
  if (gmailConfigured) return 'gmail-api';
  if (smtpConfigured) return 'smtp';
  return 'console';
}

/* ── Resend (HTTPS API) ────────────────────────────────────────────────────── */

async function resendFetch(path, init = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    return await fetch(`https://api.resend.com${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function resendSend(message) {
  const attachments = (message.attachments || []).map((a) => ({
    filename: a.filename,
    content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : Buffer.from(a.content).toString('base64'),
  }));
  const res = await resendFetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      from: message.from,
      to: [message.to],
      subject: message.subject,
      ...(message.text ? { text: message.text } : {}),
      ...(message.html ? { html: message.html } : {}),
      ...(REPLY_TO ? { reply_to: REPLY_TO } : {}),
      ...(attachments.length ? { attachments } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${body.slice(0, 300)}`);
  }
}

/* ── Gmail API ─────────────────────────────────────────────────────────────── */

let jwtClient = null;
let jwtInitError = null;
if (gmailConfigured) {
  try {
    // The key may be stored raw JSON or base64-encoded (safer for env vars).
    let raw = GOOGLE_SA_KEY.trim();
    if (!raw.startsWith('{')) raw = Buffer.from(raw, 'base64').toString('utf8');
    const key = JSON.parse(raw);
    jwtClient = new JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: [GMAIL_SCOPE],
      subject: GMAIL_SENDER, // impersonate the sending mailbox (domain-wide delegation)
    });
  } catch (err) {
    jwtInitError = `GOOGLE_SA_KEY is not valid JSON / base64 JSON: ${err.message}`;
  }
}

async function buildRaw(message) {
  const compiled = new MailComposer({ ...message, from: message.from || FROM }).compile();
  const buf = await compiled.build();
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function gmailSend(message) {
  if (jwtInitError) throw new Error(jwtInitError);
  const { token } = await jwtClient.getAccessToken();
  if (!token) throw new Error('Could not obtain a Gmail access token.');

  const raw = await buildRaw(message);
  const url = `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(GMAIL_SENDER)}/messages/send`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Gmail API ${res.status}: ${body.slice(0, 300)}`);
    }
  } finally {
    clearTimeout(timer);
  }
}

/* ── SMTP ──────────────────────────────────────────────────────────────────── */

let transporter = null;
if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // Fail fast instead of hanging until the platform gateway kills the request.
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

/* ── Public API ────────────────────────────────────────────────────────────── */

/**
 * Confirms the mail transport actually works — without sending anything — so a
 * misconfiguration (bad key, missing domain-wide delegation, blocked SMTP)
 * surfaces its real reason instead of hanging mid-send.
 */
export async function verifyMailer() {
  const mode = mailMode();
  if (mode === 'console') {
    return { ok: false, mode, error: 'No email transport is configured (set RESEND_API_KEY, or Gmail/SMTP credentials).' };
  }
  if (mode === 'resend') {
    try {
      // Lists domains — a cheap authenticated call that validates the API key.
      const res = await resendFetch('/domains');
      if (res.ok) return { ok: true, mode };
      const body = await res.text().catch(() => '');
      return { ok: false, mode, error: `Resend rejected the API key (${res.status}). ${body.slice(0, 200)}` };
    } catch (err) {
      return { ok: false, mode, error: err?.message || 'Could not reach Resend.' };
    }
  }
  if (mode === 'gmail-api') {
    if (jwtInitError) return { ok: false, mode, error: jwtInitError };
    try {
      await jwtClient.authorize(); // mints a token; throws the real Google error if creds/delegation are wrong
      return { ok: true, mode };
    } catch (err) {
      return { ok: false, mode, error: err?.response?.data?.error_description || err?.message || 'Gmail authorization failed.' };
    }
  }
  try {
    await transporter.verify();
    return { ok: true, mode };
  } catch (err) {
    return { ok: false, mode, error: err?.message || 'SMTP connection failed.' };
  }
}
// Back-compat name.
export const verifySmtp = verifyMailer;

/**
 * Send an email. Routes through the Gmail API when configured, else SMTP; with
 * neither, logs to the console (dev).
 */
export async function sendMail({ to, subject, text, html, attachments = [] }) {
  const mode = mailMode();

  if (mode === 'console') {
    console.log('\n──────── EMAIL (dev console — no transport configured) ────────');
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    if (attachments.length) console.log(`Attachments: ${attachments.map((a) => a.filename).join(', ')}`);
    console.log(`Body:\n${text}`);
    console.log('────────────────────────────────────────────────────────────────\n');
    return;
  }

  const message = {
    from: FROM, to, subject, text,
    ...(html ? { html } : {}),
    ...(REPLY_TO ? { replyTo: REPLY_TO } : {}),
    attachments,
  };
  if (mode === 'resend') return resendSend(message);
  if (mode === 'gmail-api') return gmailSend(message);
  return transporter.sendMail(message);
}
