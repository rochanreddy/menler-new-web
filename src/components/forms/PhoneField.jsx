import { COUNTRY_CODES } from '../../data/countryCodes';
import { phoneMaxLength } from '../../lib/phone';

/**
 * Dialling code + number, as one control.
 *
 * Every form on the site that takes a phone number had rolled its own copy of
 * this pair — the select, the digits-only filter, and the length cap that
 * differs for +91. This is that pair, once, so the brochure bars on Home,
 * Generalist and Engineering cannot drift apart from each other.
 *
 * The number is filtered to digits on the way in rather than validated on the
 * way out: the verification identifier is digits with no "+" or spaces, and the
 * value typed is the value sent. The rules themselves live in lib/phone, so
 * brochure.js can ask the same questions without importing a component.
 */
export default function PhoneField({
  countryCode = '+91',
  phone = '',
  onCountryCode,
  onPhone,
  disabled = false,
  required = true,
  className = '',
}) {
  return (
    <span className={`phone-field ${className}`.trim()}>
      <select
        className="phone-field-code"
        aria-label="Country dialling code"
        value={countryCode}
        disabled={disabled}
        onChange={(e) => onCountryCode(e.target.value)}
      >
        {COUNTRY_CODES.map(({ code, label }) => (
          <option key={label} value={code}>{label}</option>
        ))}
      </select>
      <input
        className="phone-field-number"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        required={required}
        disabled={disabled}
        aria-label="Phone number"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => onPhone(e.target.value.replace(/\D/g, '').slice(0, phoneMaxLength(countryCode)))}
      />
    </span>
  );
}
