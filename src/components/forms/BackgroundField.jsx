import { useState } from 'react';
import {
  BACKGROUND_GROUPS, WORK_DOMAINS, gradYears,
  needsDomain, needsText, needsCollege, needsYear, needsDetail,
  resolveBackground, detailFor, backgroundComplete,
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
 * Two follow-ups do NOT belong in that string — a student's college and a
 * graduate's year. Those go to `onDetail` as their own named fields, because
 * the admin's background filter groups on distinct values and a college folded
 * into the string would add a filter row per college. A form that doesn't pass
 * `onDetail` still asks the question (the question should read the same on
 * every page) and simply doesn't store the answer. It receives the chosen group
 * as a second argument, so a form carrying its own college question can tell
 * when this field is already asking it and stand down.
 *
 * `className` is passed to each control rather than wrapped in a div of our
 * own: the forms this drops into style their fields differently (.pay-input,
 * plain selects inside .lf-field), and a wrapper would break their layouts.
 */
export default function BackgroundField({
  onChange,
  // Receives { college, graduation_year } — both keys always present, so
  // spreading it clears the one that no longer applies.
  onDetail,
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
  const [detail, setDetail] = useState('');

  const styleFor = (v) => (mutedColor && !v ? { ...style, color: mutedColor } : style);

  const push = (g, d, t, x) => {
    // Only a complete answer is reported. Otherwise "Working Professional"
    // would be stored the moment it's picked, and someone who then abandoned
    // the domain question would be filed under a group nobody chose.
    const done = backgroundComplete(g, d, t, x);
    onChange(done ? resolveBackground(g, d, t) : '');
    // The detail is reported on every keystroke, not only when complete: it is
    // stored in its own field, so a partial college can't corrupt the group the
    // way a partial domain could. Sending it only when `done` would also mean
    // switching group never cleared the previous group's answer.
    onDetail?.(detailFor(g, x), g);
  };

  const pickGroup = (g) => {
    setGroup(g);
    setDomain('');
    setText('');
    setDetail('');
    push(g, '', '', '');
  };

  const pickDomain = (d) => {
    setDomain(d);
    // Keep whatever was typed only while it's still being asked for.
    const t = d === 'Other' ? text : '';
    setText(t);
    push(group, d, t, detail);
  };

  const typeText = (t) => {
    setText(t);
    push(group, domain, t, detail);
  };

  const setFollowUp = (x) => {
    setDetail(x);
    push(group, domain, text, x);
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

      {needsCollege(group) && (
        <input
          className={`${className} bg-followup`.trim()}
          style={style}
          required={required}
          disabled={disabled}
          type="text"
          value={detail}
          onChange={(e) => setFollowUp(e.target.value)}
          placeholder="Your college / university"
          aria-label="Your college or university"
          maxLength={120}
        />
      )}

      {needsYear(group) && (
        <select
          className={`${className} bg-followup`.trim()}
          style={styleFor(detail)}
          required={required}
          disabled={disabled}
          value={detail}
          onChange={(e) => setFollowUp(e.target.value)}
          aria-label="Year you graduated"
        >
          <option value="" disabled hidden>Which year did you graduate?</option>
          {gradYears().map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      )}

      {needsText(group, domain) && !needsDetail(group) && (
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
