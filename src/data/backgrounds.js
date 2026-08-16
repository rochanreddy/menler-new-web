/**
 * The one background list, shared by every form that asks.
 *
 * The website form and the campaign form used to carry separate lists, so the
 * same question produced two vocabularies that never overlapped: campaign leads
 * were "graduate" or "working professional (tech)", website leads were "Analyst"
 * or "Finance", and no filter could span both. This is the union of the two,
 * ordered by how people tend to describe themselves — where they are in their
 * career first, then what they actually do.
 *
 * Answers are stored as written. The admin filter groups case-insensitively, so
 * the older lowercase values recorded by the campaign form still match.
 */
export const BACKGROUND_OPTIONS = [
  'Student',
  'Graduate',
  'Working Professional (Tech)',
  'Working Professional (Non-Tech)',
  'Founder / Business Owner',

  'Analyst',
  'Engineering',
  'Finance',
  "Founder's Office",
  'Human Resources (HR)',
  'Operations',
  'Marketing & Sales',
  'Product Management',
  'Program Management',
  'Strategy & Consulting',

  'Other',
];
