/**
 * "We've received your application" — sent when someone applies through any of
 * the apply forms (POST /leads with `apply: true`).
 *
 * This lives here rather than in the CRM on purpose. The acknowledgement used
 * to be an Amplifeed automation, which meant applicants were being thanked by a
 * system nothing in this repo could see, test, or notice the failure of — and
 * it had stopped firing without anything surfacing that. Sending it from the
 * server puts it next to the code that creates the lead, so the two can't drift
 * apart again.
 */
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendMail, isMailConfigured } from './email.js';

const TPL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'emails', 'application-received.html');

// A lead's `section` is whatever the form chose to send, so it is only used as
// the programme name when it is actually one. Anything else (a CTA label, a
// page name) falls back to wording that reads correctly without one.
const PROGRAMMES = [
  'Claude AI Generalist Fellowship',
  'Claude AI Engineering Fellowship',
  'Gen AI Kickstarter',
];

export function programmeFor(lead) {
  const hay = `${lead?.section || ''} ${lead?.program || ''}`.toLowerCase();
  return PROGRAMMES.find((p) => hay.includes(p.toLowerCase()))
    // The campaign pages send the programme without the "Fellowship" suffix.
    || (hay.includes('generalist') ? 'Claude AI Generalist Fellowship' : null)
    || (hay.includes('kickstarter') ? 'Gen AI Kickstarter' : null)
    || (hay.includes('engineering') ? 'Claude AI Engineering Fellowship' : null);
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Build the message. Separate from sending so it can be checked without one. */
export async function renderApplicationEmail(lead) {
  let html;
  try {
    html = await fsp.readFile(TPL, 'utf8');
  } catch {
    return null;
  }

  const first = String(lead.name || '').trim().split(/\s+/)[0] || 'there';
  const programme = programmeFor(lead);

  const intro = programme
    ? `Thanks for applying to the <strong style="font-weight:700;">${esc(programme)}</strong>. Your application is in.`
    : 'Thanks for your interest in Menler. Your application is in.';

  // The closing paragraph points at whichever programme they did not apply to,
  // so it isn't selling them the thing they have already applied for.
  const other = programme === 'Gen AI Kickstarter'
    ? ['the Claude AI Generalist Fellowship', 'https://menler.in/generalist']
    : ['the Gen AI Kickstarter', 'https://menler.in/kickstarter'];
  const programmeLine =
    `If you&rsquo;re also weighing up <a href="${other[1]}" style="color:#534AB7; text-decoration:underline;">${other[0]}</a>, that page has the full breakdown.`;

  html = html
    .replace(/\{\{\s*first_name\s*\}\}/gi, esc(first))
    .replace(/\{\{\s*intro\s*\}\}/gi, intro)
    .replace(/\{\{\s*programme_line\s*\}\}/gi, programmeLine);

  const subject = programme
    ? `Your application to the ${programme}`
    : "We've received your application";

  const text = [
    `Dear ${first},`,
    '',
    programme
      ? `Thanks for applying to the ${programme}. Your application is in.`
      : 'Thanks for your interest in Menler. Your application is in.',
    '',
    'Our admissions team will call you shortly to talk through your background, what you want to build, and which cohort fits. Nothing to prepare — it is a conversation, not an interview.',
    '',
    'In the meantime, the brochure covers the curriculum week by week: https://menler.in/brochure-download',
    '',
    'Want to know where your skills sit right now? Take our AI aptitude test: https://menler.in/aptitude',
    '',
    'Talk soon.',
    '',
    'Menler',
    'Your turning point in the AI era',
  ].join('\n');

  return { subject, html, text, programme: programme || null };
}

/**
 * Fire-and-forget: a mail failure must never fail the lead capture that
 * triggered it, so this resolves either way and reports what happened.
 */
export async function sendApplicationEmail(lead) {
  const to = String(lead?.email || '').trim();
  if (!to) return { sent: 0, reason: 'no email address' };
  if (!isMailConfigured()) return { sent: 0, reason: 'mailer not configured' };

  const msg = await renderApplicationEmail(lead);
  if (!msg) return { sent: 0, reason: 'application-received.html is missing' };

  try {
    await sendMail({ to, subject: msg.subject, text: msg.text, html: msg.html });
    return { sent: 1, to, programme: msg.programme };
  } catch (err) {
    console.error('[apply-email] could not send to', to, '-', err.message);
    return { sent: 0, reason: err.message };
  }
}
