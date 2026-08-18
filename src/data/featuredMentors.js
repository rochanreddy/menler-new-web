// The curated mentor row shown on the campaign ad pages (one row, not the
// full two-row roster) — shared by /campaign/ai-claude-generalist and
// /campaign/ai-kickstarter so the lineup and its order only live in one
// place. Sridevi isn't in MentorsRail's own MENTORS list (she's normally
// only shown in the campaign hero cards), so her entry lives here too, using
// the same photo/credit as the hero.
export const SRIDEVI_MENTOR = { name: 'Sridevi Edupuganti', role: 'Co-Founder', company: 'Zenithworks AI', img: '/mentors/sridevi.png' };

export const FEATURED_MENTOR_NAMES = ['Nitin K Sethi', 'Sachin Roy', 'Sridevi Edupuganti', 'Deepak K', 'Anuttam G', 'Shashank Kumar', 'Manish Yadav'];

// `mentors` is MentorsRail's MENTORS export — passed in rather than imported
// here to avoid this data file depending on a component module.
export function getFeaturedMentors(mentors) {
  const byName = { ...Object.fromEntries(mentors.map((m) => [m.name, m])), [SRIDEVI_MENTOR.name]: SRIDEVI_MENTOR };
  return FEATURED_MENTOR_NAMES.map((n) => byName[n]);
}
