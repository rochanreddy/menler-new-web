// Whether a masterclass campaign is still taking registrations. Shared by
// /events (which sorts finished sessions into Past) and the campaign pages
// themselves (which stop showing the form once the session has run), so the
// two can never disagree about what "over" means.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// Sort key for an event: its start, as a timestamp. Both `date` and `time` are
// free text in Sanity, so parse defensively — anything unparseable returns 0 and
// falls to the end of the list rather than scrambling the order around it.
export const eventStartMs = (ev) => {
  const s = String(ev?.date || '').replace(/(\d{1,2})(st|nd|rd|th)/gi, '$1');
  const year = (s.match(/\b(20\d{2})\b/) || [])[1];
  const month = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
  const day = s.match(/\b(\d{1,2})\b/);
  if (!year || !month || !day) return 0;
  const mi = MONTHS.indexOf(month[1].toLowerCase());
  if (mi < 0) return 0;
  // The START of the range: "7:00 PM – 9:00 PM IST" → 19:00. Two same-day events
  // are only separable by time, which is what puts the 7 PM session above the
  // 11 AM one. A start with no am/pm of its own ("5:00 – 7:00 PM IST") borrows
  // the meridiem from the end of the range.
  const t = String(ev?.time || '');
  const start = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  let h = 0;
  let min = 0;
  if (start) {
    h = Number(start[1]);
    min = Number(start[2] || 0);
    const mer = (start[3] || (t.match(/(am|pm)/i) || [])[1] || '').toLowerCase();
    if (mer === 'pm' && h < 12) h += 12;
    if (mer === 'am' && h === 12) h = 0;
  }
  return new Date(Number(year), mi, Number(day[1]), h, min).getTime();
};

// A "live" event stops being live once its day is over — kept live through the
// whole day (a 7 PM session is still upcoming at noon), demoted from midnight
// after. An unparseable date can't be judged, so the Live toggle stands.
export const eventIsOver = (ev) => {
  const start = eventStartMs(ev);
  if (!start) return false;
  const dayEnd = new Date(start);
  dayEnd.setHours(24, 0, 0, 0);
  return dayEnd.getTime() <= Date.now();
};

// Campaigns that were announced but never ran. They are not past events — there
// is no session to catch up on — so /events leaves them out entirely, and their
// URL shows the closed notice whatever date the document still carries.
export const CANCELLED_CAMPAIGNS = new Set(['ai-for-modern-work-and-careers']);

// A campaign page stops taking registrations once its session has run (or was
// called off). `session` is anything with the campaign's `date` and `time`.
export const campaignIsClosed = (slug, session) =>
  CANCELLED_CAMPAIGNS.has(slug) || eventIsOver(session);
