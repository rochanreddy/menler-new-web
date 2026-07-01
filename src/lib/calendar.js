// Build "Add to calendar" links (Google, Outlook) and .ics content from an
// event — no API or login needed. The calendar app then handles reminders.
//
// event: { title, start, end, details, location }
//   start / end : anything Date can parse (ISO with timezone recommended).

// → "YYYYMMDDTHHMMSSZ" (UTC), the format Google / Outlook / iCal all accept.
function toUtcStamp(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// Default 1-hour block when no end time is given.
function resolveEnd(start, end) {
  if (end) return end;
  const d = new Date(start);
  return Number.isNaN(d.getTime()) ? start : new Date(d.getTime() + 60 * 60 * 1000);
}

export function googleCalendarUrl({ title, start, end, details = '', location = '' }) {
  const s = toUtcStamp(start);
  const e = toUtcStamp(resolveEnd(start, end));
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'Event',
    dates: `${s}/${e}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl({ title, start, end, details = '', location = '' }) {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title || 'Event',
    startdt: new Date(start).toISOString(),
    enddt: new Date(resolveEnd(start, end)).toISOString(),
    body: details,
    location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// A downloadable .ics (Apple Calendar, Outlook desktop, etc.) with a reminder
// alarm 30 minutes before the event.
export function icsContent({ title, start, end, details = '', location = '' }) {
  const esc = (v) => String(v).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const uid = `${toUtcStamp(start)}-${Math.abs(hashCode(title || 'event'))}@menler.in`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Menler//Add to Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(resolveEnd(start, end))}`,
    `SUMMARY:${esc(title || 'Event')}`,
    details ? `DESCRIPTION:${esc(details)}` : '',
    location ? `LOCATION:${esc(location)}` : '',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(title || 'Event')}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
}

// Trigger a browser download of the .ics file.
export function downloadIcs(event, filename = 'event.ics') {
  const blob = new Blob([icsContent(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// Parse the campaign's display strings — e.g. date "8 July 2026, Wednesday" and
// time "7:00 PM – 8:00 PM IST" — into { start, end } ISO datetimes so the
// calendar always matches what's shown on the page. Assumes IST (+05:30).
// Returns null if it can't parse (button then simply won't show).
export function parseEventDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;

  const dm = String(dateStr).match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!dm) return null;
  const day = +dm[1];
  const month = MONTHS.indexOf(dm[2].slice(0, 3).toLowerCase());
  const year = +dm[3];
  if (month < 0) return null;

  const tokens = [...String(timeStr).matchAll(/(\d{1,2})(?::(\d{2}))?(?:\s*([ap])\.?m\.?)?/gi)]
    .map((t) => ({ h: +t[1], m: +(t[2] || 0), ap: t[3] ? t[3].toLowerCase() : null }))
    .filter((t) => t.h >= 1 && t.h <= 24);
  if (!tokens.length) return null;

  // A time without its own AM/PM inherits the last explicit one — e.g. the
  // "5:00" in "5:00 – 7:00 PM" is treated as 5 PM.
  const lastAp = [...tokens].reverse().find((t) => t.ap)?.ap || 'p';
  const to24 = (t) => { const ap = t.ap || lastAp; let hh = t.h % 12; if (ap === 'p') hh += 12; return [hh, t.m]; };

  const [sh, sm] = to24(tokens[0]);
  let eh, em;
  if (tokens[1]) { [eh, em] = to24(tokens[1]); }
  else { eh = (sh + 1) % 24; em = sm; }

  const pad = (n) => String(n).padStart(2, '0');
  const iso = (h, m) => `${year}-${pad(month + 1)}-${pad(day)}T${pad(h)}:${pad(m)}:00+05:30`;
  return { start: iso(sh, sm), end: iso(eh, em) };
}
