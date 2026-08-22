/**
 * Qualifying questions, asked after the one-time code is verified.
 *
 * They come after verification rather than before on purpose: the applicant is
 * already captured by then, so anyone who abandons here is still a lead with a
 * verified phone number. Asking first would trade admissions data for
 * applications, which is the wrong way round.
 *
 * `key` is what admissions reads in the CRM, so treat these as stable — they
 * are the column names, not just ids.
 */
export const GENERALIST_QUALIFY = [
  {
    key: 'outcome',
    label: 'Which outcome matters most to you?',
    options: [
      'Move into an AI role',
      'Use AI to grow in my current role',
      'Build AI products or systems',
      'Grow my business with AI',
      'Explore before deciding',
    ],
  },
  {
    key: 'timeline',
    label: 'When are you realistically planning to become AI Native?',
    options: [
      'Immediately',
      'Next available cohort',
      'Within 1–2 months',
      'Just researching',
    ],
  },
  {
    key: 'funding',
    label: 'How do you expect to fund the fellowship?',
    options: [
      'Self-funded',
      'Employer-sponsored',
      'Need a scholarship or payment plan',
      'Parents',
    ],
  },
];
