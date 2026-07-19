import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

const smtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

export function isSmtpConfigured() {
  return smtpConfigured;
}

let transporter = null;
if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // Without these, a wrong password or blocked connection hangs for minutes
    // (until the platform gateway kills the request). Fail fast instead.
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

/**
 * Opens a connection and authenticates without sending anything, so a
 * misconfiguration surfaces its real reason (bad password, blocked port,
 * unreachable host) instead of hanging mid-send.
 */
export async function verifySmtp() {
  if (!transporter) {
    return { ok: false, error: 'SMTP is not configured (SMTP_HOST, SMTP_USER or SMTP_PASS is missing on the server).' };
  }
  try {
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || 'SMTP connection failed.' };
  }
}

/**
 * Send an email. When SMTP isn't configured (dev), the message is logged to
 * the server console instead — attachment filenames are listed when present.
 */
export async function sendMail({ to, subject, text, html, attachments = [] }) {
  if (!transporter) {
    console.log('\n──────── EMAIL (dev console — no SMTP configured) ────────');
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    if (attachments.length) {
      console.log(`Attachments: ${attachments.map((a) => a.filename).join(', ')}`);
    }
    console.log(`Body:\n${text}`);
    console.log('──────────────────────────────────────────────────────────────\n');
    return;
  }

  await transporter.sendMail({
    from: MAIL_FROM || 'Menler <no-reply@menler.in>',
    to,
    subject,
    text,
    ...(html ? { html } : {}),
    attachments,
  });
}
