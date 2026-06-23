import dns from 'dns';

// Common disposable / throwaway email domains. Not exhaustive, but covers the
// bulk of junk signups. Extend as needed.
const DISPOSABLE = new Set([
  'mailinator.com', '10minutemail.com', '10minutemail.net', 'guerrillamail.com',
  'guerrillamail.info', 'guerrillamail.net', 'grr.la', 'sharklasers.com', 'trashmail.com',
  'tempmail.com', 'temp-mail.org', 'tempmailo.com', 'getnada.com', 'nada.email',
  'dispostable.com', 'yopmail.com', 'yopmail.fr', 'yopmail.net', 'fakeinbox.com',
  'maildrop.cc', 'mailnesia.com', 'throwawaymail.com', 'mintemail.com', 'mailcatch.com',
  'mohmal.com', 'emailondeck.com', 'spam4.me', 'tempr.email', 'discard.email', 'tempinbox.com',
  'mvrht.com', '33mail.com', 'anonbox.net', 'burnermail.io', 'spamgourmet.com', 'mytemp.email',
  'moakt.com', '1secmail.com', '1secmail.org', '1secmail.net', 'tmail.ws', 'tmpmail.org',
  'mailpoof.com', 'inboxkitten.com', 'emailfake.com', 'tempmail.plus', 'vomoto.com',
  'trashmail.de', 'wegwerfmail.de', 'getairmail.com', 'fakemail.net', 'mailtemp.net',
]);

// Does the domain accept mail? Prefer MX records; fall back to an A/AAAA record
// (some domains receive mail via the address record). Transient DNS errors fail
// OPEN so real users are never blocked by a temporary lookup glitch.
async function domainAcceptsMail(domain) {
  try {
    const mx = await dns.promises.resolveMx(domain);
    if (mx && mx.length) return true;
  } catch (err) {
    if (err.code !== 'ENOTFOUND' && err.code !== 'ENODATA') return true; // transient → allow
  }
  try {
    await dns.promises.lookup(domain);
    return true;
  } catch {
    return false; // domain doesn't resolve at all → almost certainly fake/typo
  }
}

/**
 * Validate an email is well-formed, not disposable, and on a real mail domain.
 * Returns { ok: true } or { ok: false, reason: <user-facing message> }.
 */
export async function validateEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  const m = /^[^\s@]+@([a-z0-9.-]+\.[a-z]{2,})$/i.exec(e);
  if (!m) return { ok: false, reason: 'Please enter a valid email address.' };
  const domain = m[1].toLowerCase();
  if (DISPOSABLE.has(domain)) {
    return { ok: false, reason: 'Please use a permanent email — temporary/disposable addresses are not accepted.' };
  }
  const deliverable = await domainAcceptsMail(domain);
  if (!deliverable) {
    return { ok: false, reason: "That email domain doesn't seem to exist — please check for a typo." };
  }
  return { ok: true };
}
