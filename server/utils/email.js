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
  });
}

/**
 * Send an email. When SMTP isn't configured (dev), the message is logged to
 * the server console instead — attachment filenames are listed when present.
 */
export async function sendMail({ to, subject, text, attachments = [] }) {
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
    attachments,
  });
}
