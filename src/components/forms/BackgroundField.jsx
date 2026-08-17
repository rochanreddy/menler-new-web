import { useState } from 'react';
import {
  BACKGROUND_GROUPS, WORK_DOMAINS,
  needsDomain, needsText, resolveBackground, backgroundComplete,
} from '../../data/backgrounds';

/**
 * The background question, everywhere it's asked.
 *
 * Owns its own two or three inputs and hands the parent a single resolved
 * string, because every form on the site stores this in one `background` field
 * and none of them should have to know that "Working Professional" has a
 * second half. `onChange` receives '' until the answer is complete, so a
 * half-filled follow-up can't be submitted as a bare "Working Professional".
 *
 * `className` is passed to each control rather than wrapped in a div of our
 * own: the forms this drops into style their fields differently (.pay-input,
 * plain selects inside .lf-field), and a wrapper would break their layouts.
 */
export default function BackgroundField({
  onChange,
  className = '',
  required = true,
  label = 'Select background…',
  style,
  id,
  disabled = false,
  // Some forms grey the placeholder until something is picked. Passed in
  // rather than assumed, because each form's palette differs.
  mutedColor,
}) {
  const [group, setGroup] = useState('');
  const [domain, setDomain] = useState('');
  const [text, setText] = useState('');

  const styleFor = (v) => (mutedColor && !v ? { ...style, color: mutedColor } : style);

  const push = (g, d, t) => {
    // Only a complete answer is reported. Otherwise "Working Professional"
    // would be stored the moment it's picked, and someone who then abandoned
    // the domain question would be filed under a group nobody chose.
    onChange(backgroundComplete(g, d, t) ? resolveBackground(g, d, t) : '');
  };

  const pickGroup = (g) => {
    setGroup(g);
    setDomain('');
    setText('');
    push(g, '', '');
  };

  const pickDomain = (d) => {
    setDomain(d);
    // Keep whatever was typed only while it's still being asked for.
    const t = d === 'Other' ? text : '';
    setText(t);
    push(group, d, t);
  };

  const typeText = (t) => {
    setText(t);
    push(group, domain, t);
  };

  return (
    <>
      <select
        id={id}
        className={className}
        style={styleFor(group)}
        required={required}
        disabled={disabled}
        value={group}
        onChange={(e) => pickGroup(e.target.value)}
      >
        <option value="" disabled hidden>{label}</option>
        {BACKGROUND_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>

      {needsDomain(group) && (
        <select
          className={`${className} bg-followup`.trim()}
          style={styleFor(domain)}
          required={required}
          disabled={disabled}
          value={domain}
          onChange={(e) => pickDomain(e.target.value)}
          aria-label="Your domain"
        >
          <option value="" disabled hidden>Which domain?</option>
          {WORK_DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      )}

      {needsText(group, domain) && (
        <input
          className={`${className} bg-followup`.trim()}
          style={style}
          required={required}
          disabled={disabled}
          type="text"
          value={text}
          onChange={(e) => typeText(e.target.value)}
          placeholder={group === 'Other' ? 'Tell us your background' : 'Type your domain'}
          aria-label="Your background"
          maxLength={80}
        />
      )}
    </>
  );
}
