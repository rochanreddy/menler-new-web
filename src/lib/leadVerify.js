/**
 * One place that decides how a lead proves they are real.
 *
 * THE CODE GOES BY SMS, EXCEPT WHERE SMS CANNOT REACH. Our provider only
 * delivers inside India, so a number anywhere else would never receive one and
 * the form would dead-end with nothing on screen to explain it. Those are
 * verified by email instead — the same proof of a real person.
 *
 * Every brochure and resource download routes through here rather than calling
 * the widget directly, because the rule is easy to get subtly wrong: the
 * identifier is country code + number with no "+", the fallback has to be
 * silent-safe, and a form that collects no usable number at all still has to
 * work. Getting it wrong once means a reader waits on a text that never comes.
 */

import { verifyEmailOtp, verifySmsOtp } from './amplifeedOtp';
import { isSmsReachable, phoneDigits, phoneMinLength } from './phone';

/**
 * Verify a lead and report which channel was used.
 *
 * Returns the widget's own result object, so callers can spread it into the
 * lead they submit exactly as they did when this was a bare OTP call.
 */
export async function verifyLeadIdentity({ email, countryCode, phone }) {
  const mail = String(email || '').trim();
  const code = String(countryCode || '+91').trim();
  const national = String(phone || '').replace(/\D/g, '');

  // A form that collects no number at all still has to work: without this it
  // would text the bare country code and the reader would wait on nothing.
  const smsReady = isSmsReachable(code) && national.length >= phoneMinLength(code);

  if (!smsReady) return verifyEmailOtp(mail);

  // `email` makes the widget's "use email instead" link work; without it that
  // link retries the phone number over email and always fails.
  return verifySmsOtp(phoneDigits(code, national), { email: mail });
}
