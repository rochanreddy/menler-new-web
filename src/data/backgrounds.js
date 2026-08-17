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
 * asked only when it applies: a working professional is asked their domain, and
 * anyone who doesn't fit types their own. Two levels rather than one flat list
 * of sixteen, because the flat list made "Student" and "Program Management"
 * look like answers to the same question when they aren't.
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

/** Groups that ask a follow-up, and which kind. */
export const needsDomain = (group) => group === 'Working Professional';
export const needsText = (group, domain) => group === 'Other' || (needsDomain(group) && domain === 'Other');

/**
 * One string for storage, so the whole site keeps writing to the single
 * `background` field the admin panel, its filter and the CSV already read.
 *
 * "Working Professional (Finance)" matches the shape of the values already in
 * the database ("Working Professional (Tech)"), so old and new rows sort and
 * filter together instead of forming two vocabularies again.
 */
export function resolveBackground(group, domain, text) {
  const typed = String(text || '').trim();
  if (!group) return '';
  if (group === 'Other') return typed;
  if (!needsDomain(group)) return group;
  const detail = domain === 'Other' ? typed : String(domain || '').trim();
  return detail ? `${group} (${detail})` : group;
}

/** True once the answer is complete enough to submit. */
export function backgroundComplete(group, domain, text) {
  if (!group) return false;
  if (group === 'Other') return Boolean(String(text || '').trim());
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
