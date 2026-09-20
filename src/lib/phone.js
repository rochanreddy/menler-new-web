/**
 * The rules a phone number is held to, kept apart from the control that renders
 * it so that non-component callers — brochure.js and anything after it — can
 * ask the same questions without importing a component.
 */

/** Longest a number can be for a given dialling code. */
export const phoneMaxLength = (countryCode) => (countryCode === '+91' ? 10 : 15);

/** Shortest a number can be before it is worth sending a code to. */
export const phoneMinLength = (countryCode) => (countryCode === '+91' ? 10 : 8);

/**
 * Whether a verification code can actually arrive by text.
 *
 * Our SMS provider only delivers inside India. A number anywhere else never
 * receives the code, so every form asks this before choosing a channel rather
 * than letting the reader wait on a text that cannot come.
 */
export const isSmsReachable = (countryCode) => String(countryCode || '').trim() === '+91';

/** The identifier the OTP widget wants: country code + number, digits only. */
export const phoneDigits = (countryCode, phone) =>
  `${countryCode || ''}${phone || ''}`.replace(/\D/g, '');

/** The shape the CRM stores: dialling code, space, number. */
export const formatPhone = (countryCode, phone) => {
  const national = String(phone || '').replace(/\D/g, '');
  return national ? `${String(countryCode || '+91').trim()} ${national}` : '';
};
