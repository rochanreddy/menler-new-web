/**
 * The one background question, shared by every form on the site.
 *
 * Every form used to ask this its own way — one offered "Working professional",
 * another "Working Professional (Tech)", a third "Career transition", a fourth
 * "Parent or educator". The same person answered differently depending on which
 * page they landed on, so no report could span them and the admin filter listed
 * a dozen near-duplicates.
 *
 * It's now one short list of where someone is in their career, with the detail
 * asked only when it applies: a working professional is asked their domain, a
 * student their college, a graduate their year, and anyone who doesn't fit
 * types their own. Two levels rather than one flat list of sixteen, because the
 * flat list made "Student" and "Program Management" look like answers to the
 * same question when they aren't.
 */
export const BACKGROUND_GROUPS = [
  'Student',
  'Graduate',
  'Working Professional',
  'Founder / Business Owner',
  'Other',
];

/**
 * Domains shown once someone says they work. Same list the Generalist
 * enrolment has always used for its domain track, so a lead and a buyer
 * describe their work with the same words.
 */
export const WORK_DOMAINS = [
  'Analyst',
  'Engineering',
  'Finance',
  "Founder's Office",
  'Human Resources (HR)',
  'Marketing & Sales',
  'Operations',
  'Product Management',
  'Program Management',
  'Strategy & Consulting',
  'Other',
];

/**
 * Years offered to a graduate, newest first, then an "Earlier" catch-all so the
 * list stays short instead of running back to the 1990s. Computed from today
 * rather than hard-coded, so it doesn't silently go stale every January.
 */
export function gradYears(now = new Date()) {
  const y = now.getFullYear();
  return [...Array(10)].map((_, i) => String(y - i)).concat('Earlier');
}

/** Groups that ask a follow-up, and which kind. */
export const needsDomain = (group) => group === 'Working Professional';
export const needsText = (group, domain) => group === 'Other' || (needsDomain(group) && domain === 'Other');
export const needsCollege = (group) => group === 'Student';
export const needsYear = (group) => group === 'Graduate';
/** Whether this group asks for a detail stored OUTSIDE the background string. */
export const needsDetail = (group) => needsCollege(group) || needsYear(group);

/**
 * One string for storage, so the whole site keeps writing to the single
 * `background` field the admin panel, its filter and the CSV already read.
 *
 * "Working Professional (Finance)" matches the shape of the values already in
 * the database ("Working Professional (Tech)"), so old and new rows sort and
 * filter together instead of forming two vocabularies again.
 *
 * College and graduation year are deliberately NOT folded in here. The admin
 * background filter is built by grouping on distinct values, so a college in
 * this string would add one filter row per college and bury the five groups it
 * exists to offer. They travel as their own fields instead (see detailFor).
 */
export function resolveBackground(group, domain, text) {
  const typed = String(text || '').trim();
  if (!group) return '';
  if (group === 'Other') return typed;
  if (!needsDomain(group)) return group;
  const detail = domain === 'Other' ? typed : String(domain || '').trim();
  return detail ? `${group} (${detail})` : group;
}

/**
 * The follow-up answer as its own named field, keyed by which group asked.
 * Always returns both keys so a form can spread it and have the irrelevant one
 * cleared — otherwise a student who switched to graduate would submit a college
 * alongside their year.
 */
export function detailFor(group, detail) {
  const v = String(detail || '').trim();
  return {
    college: needsCollege(group) ? v : '',
    graduation_year: needsYear(group) ? v : '',
  };
}

/** True once the answer is complete enough to submit. */
export function backgroundComplete(group, domain, text, detail) {
  if (!group) return false;
  if (group === 'Other') return Boolean(String(text || '').trim());
  if (needsDetail(group)) return Boolean(String(detail || '').trim());
  if (!needsDomain(group)) return true;
  if (!domain) return false;
  return domain !== 'Other' || Boolean(String(text || '').trim());
}

/**
 * Flat list, kept for anything that wants every answer in one array.
 * Not what the forms render any more — they use the two-step field.
 */
export const BACKGROUND_OPTIONS = [
  ...BACKGROUND_GROUPS.filter((g) => g !== 'Other' && g !== 'Working Professional'),
  ...WORK_DOMAINS.filter((d) => d !== 'Other').map((d) => `Working Professional (${d})`),
  'Other',
];
