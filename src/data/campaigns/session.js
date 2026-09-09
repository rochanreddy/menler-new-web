// One moment, five ways of writing it.
//
// The paid layout prints the session date in four different shapes — the banner
// wants "16 September 2026, Wednesday", the sticky bar wants "Wed, 16 Sept",
// the WhatsApp mock-ups want the short pair, and the calendar event wants
// something Date can parse — so a campaign cannot just carry one string.
//
// Deriving them here means an admin types the date once in Sanity and every
// place it appears follows. The alternative was four more fields on the
// document, each an opportunity to disagree with the others.

const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
// "Sept", not "Sep" — the campaign pages have always written it that way.
const MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/* Pulls the day/month/year out of a date written any way round — "16 September
   2026, wednesday" and "Wednesday, 16 September 2026" both land here. The
   weekday the admin typed is ignored on purpose: the date itself decides which
   day of the week it was, so a typo in one cannot contradict the other. */
function parseDate(value) {
  const m = clean(value).match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!m) return null;
  const month = MONTHS_SHORT.indexOf(m[2].slice(0, 3).toLowerCase());
  if (month < 0) return null;
  const d = new Date(+m[3], month, +m[1]);
  return Number.isNaN(d.getTime()) ? null : d;
}

/* "7:00 PM – 9:00 PM IST" -> "7:00 PM IST". The zone sits at the end of the
   whole range, so taking the first half alone drops it. */
function shortTime(time) {
  const full = clean(time);
  if (!full) return '';
  const head = full.split(/[–—-]/)[0].trim();
  const zone = full.match(/\b([A-Z]{2,4})\s*$/);
  if (!zone || head.includes(zone[1])) return head;
  return `${head} ${zone[1]}`;
}

/**
 * Merge a Sanity document's `date` / `time` into a session block.
 *
 * `base` supplies the parts that are not about when it starts — duration,
 * platform, replay — and stands in whole if the document says nothing, so a
 * page keeps working when Sanity is empty, unreachable, or not yet configured.
 */
export function sessionFrom(doc, base) {
  const date = clean(doc?.date);
  const time = clean(doc?.time) || base.time;
  if (!date) return base;

  const d = parseDate(date);
  // An unparseable date is still the admin's intent, so show it rather than
  // silently keeping a stale one — just without the derived short forms.
  if (!d) return { ...base, date, dateLong: date, time, timeShort: shortTime(time) };

  const day = d.getDate();
  const long = `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  const weekday = DAYS[d.getDay()];

  return {
    ...base,
    // Weekday first — this is the one parseEventDateTime reads for the
    // "Add to calendar" button on the confirmation page.
    date: `${weekday}, ${long}`,
    dateLong: `${long}, ${weekday}`,
    dateShort: `${weekday.slice(0, 3)}, ${day} ${MONTHS_ABBR[d.getMonth()]}`,
    time,
    timeShort: shortTime(time),
  };
}

export default sessionFrom;
