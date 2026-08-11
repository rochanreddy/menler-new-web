import { useState, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Seo from '../components/common/Seo';
import Footer from '../components/layout/Footer';
import MenlerWordmark from '../components/common/MenlerWordmark';
import PlaybookModal from '../components/common/PlaybookModal';
import CtaBanner from '../components/common/CtaBanner';
import { useApply } from '../components/common/ApplyContext';
import { useContentState } from '../lib/useContent';
import { MENLER_WHATSAPP_URL } from '../data/communityLinks';

// ── /events — Menler masterclasses & events ──────────────────────────────────
// Ticket-style hero → Live events (Join) → Past events (Download resources).
//
// Events are the CAMPAIGN PAGES themselves:
//   • PAST — every campaign shows here automatically (unless "Hide from Events").
//   • LIVE — only campaigns with "Show as a Live event" turned on, and only
//     until their date has passed: a stale Live toggle self-corrects, the event
//     slides down into Past on its own the day after it runs.
// So a new campaign becomes a past event with no action; you only ever flip the
// Live toggle. The card's title, date, mentor, accent and Join link all come
// from the campaign itself. With nothing live, the Live section shows a
// "coming soon" poster instead of disappearing.

const optImg = (url, w) =>
  (url && url.includes('cdn.sanity.io') ? `${url}${url.includes('?') ? '&' : '?'}w=${w}&auto=format&q=72&fit=max` : url);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// `date` is a free-text field in Sanity, so each campaign arrives in whatever
// shape its editor typed — "19th Jul, 2026", "01 August 2026, Saturday",
// "Saturday, 25 July 2026" — which is why the cards disagreed with each other.
// Pull the day/month/year out however they're ordered and re-emit one format,
// deriving the weekday from the date itself (so a mistyped day is corrected
// rather than repeated). Anything unparseable is passed through untouched.
const formatEventDate = (raw) => {
  if (!raw) return '';
  const s = String(raw).replace(/(\d{1,2})(st|nd|rd|th)/gi, '$1');
  const year = (s.match(/\b(20\d{2})\b/) || [])[1];
  const month = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
  const day = s.match(/\b(\d{1,2})\b/);
  if (!year || !month || !day) return raw;
  const mi = MONTHS.findIndex((m) => m.toLowerCase().startsWith(month[1].toLowerCase()));
  const d = new Date(Number(year), mi, Number(day[1]));
  if (mi < 0 || Number.isNaN(d.getTime())) return raw;
  return `${String(day[1]).padStart(2, '0')} ${MONTHS[mi]} ${year}, ${WEEKDAYS[d.getDay()]}`;
};

// Sort key for an event: its start, as a timestamp. Both `date` and `time` are
// free text in Sanity, so parse defensively — anything unparseable returns 0 and
// falls to the end of the list rather than scrambling the order around it.
const eventStartMs = (ev) => {
  const s = String(ev.date || '').replace(/(\d{1,2})(st|nd|rd|th)/gi, '$1');
  const year = (s.match(/\b(20\d{2})\b/) || [])[1];
  const month = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
  const day = s.match(/\b(\d{1,2})\b/);
  if (!year || !month || !day) return 0;
  const mi = MONTHS.findIndex((m) => m.toLowerCase().startsWith(month[1].toLowerCase()));
  if (mi < 0) return 0;
  // The START of the range: "7:00 PM – 9:00 PM IST" → 19:00. Two same-day events
  // are only separable by time, which is what puts the 7 PM session above the
  // 11 AM one. A start with no am/pm of its own ("5:00 – 7:00 PM IST") borrows
  // the meridiem from the end of the range.
  const t = String(ev.time || '');
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
const eventIsOver = (ev) => {
  const start = eventStartMs(ev);
  if (!start) return false;
  const dayEnd = new Date(start);
  dayEnd.setHours(24, 0, 0, 0);
  return dayEnd.getTime() <= Date.now();
};

/* ── Card art colour system ───────────────────────────────────────────────────
   Every event card is drawn by the site (see EventArt) in ONE of Menler's three
   brand colours — the same trio the programs use: Specialist purple, Menler
   amber, Placed green. `tint` is the light end of each, for anything sitting ON
   the dark art (the wordmark rule, the tag line) where the full-strength colour
   would be too dark to read. */
const BRAND_ART = [
  { accent: '#534AB7', tint: '#B7AEFF' }, // Specialist purple
  { accent: '#BA7517', tint: '#F0C078' }, // Menler amber
  { accent: '#1D9E75', tint: '#7ADCBB' }, // Placed green
];

// A LIVE card is already wearing the colour it will keep once the session runs
// and it drops into the wall below (see pastTone). A live event's place in the
// past grid is knowable in advance: it joins at the end of the age order, and
// the rail is sorted soonest-first, so the next session to finish takes the
// next age index, the one after it the one after that. Painting that colour now
// means the card doesn't change appearance when it moves — the same card you
// saw at the top of the page is the one you find in the history.
//
// This replaces matching the campaign's own accent. That kept a card and the
// page behind its Join button in one colour family, which was worth something,
// but not as much as a wall that never repaints itself.
const liveTones = (list, pastCount) => list.map((_, i) => pastTone(pastCount + i));

// PAST cards rotate instead. Their button opens a download modal — there's no
// page behind it to match — so what matters is that the grid is evenly spread
// across the three colours, and matching would NOT do that: four of the current
// campaigns share one navy accent, which collapsed the whole wall onto two
// colours with a single green in it.
//
// The rotation runs straight down the columns, so on desktop each column is a
// single colour — purple, green, amber, left to right. Reading a grid one
// column at a time is easier when the column itself is the constant; the eye
// gets a fixed lane per colour instead of re-deciding at every card. The same
// cycle still works when the grid reflows: at 2-up it lands 0,1 / 2,0 / 1,2 and
// stacked it's 0,1,2 — no two cards of one colour ever touch at any width.
const PAST_LANES = [BRAND_ART[0], BRAND_ART[2], BRAND_ART[1]]; // purple · green · amber
//
// The lane is keyed on how OLD the event is, not on where it sits in the grid.
// Counting from the top would mean a masterclass finishing and dropping out of
// Live pushes every card down a slot and repaints the entire wall — the whole
// history changing colour because one new session ended. Counted from the
// oldest event instead, every card that already exists keeps its ageIndex, so
// it keeps its colour for good; only the arriving one takes a new lane.
//
// Subtracting the age (rather than adding it) is what preserves the reading
// direction: display order runs newest → oldest, so a descending lane by age is
// an ascending one down the grid, and a row still reads purple · green · amber
// with each column holding a single colour. ANCHOR sets where that cycle
// starts; it's the ageIndex of the newest past event as the wall stands today,
// so the existing cards keep exactly the colours they have now. Any value ≡ 1
// (mod 3) does the same job — it's a starting point, not a magic number.
const PAST_LANE_ANCHOR = 7;
const pastTone = (ageIndex) =>
  PAST_LANES[(((PAST_LANE_ANCHOR - ageIndex) % PAST_LANES.length) + PAST_LANES.length) % PAST_LANES.length];

// Map a raw campaign doc → the shape the cards render. One place, so the query,
// the fallback and the cards never drift.
const toEvent = (c) => ({
  _id: c._id || c.slug,
  status: c.isLiveEvent ? 'live' : 'past',
  title: [c.bannerLine1, c.bannerLine2].filter(Boolean).join(' ') || c.title,
  subtitle: c.bannerTagline || c.subtitle || '',
  tags: c.eventTags || [],
  date: formatEventDate(c.date), time: c.time || '',
  campaignSlug: c.slug || '',
  // Real banner capture from the campaign's landing page (eventImage in Sanity).
  // When present it IS the card art; the generated panel is the fallback.
  thumbnail: c.eventImage || '',
  mentorName: c.mentorName || '', mentorRole: c.mentorRole || '', mentorPhoto: c.mentorPhoto || '',
  attendees: c.eventAttendees || '',
  resources: c.eventResources || [],
});

// Join always goes to the campaign's own registration page.
const joinTarget = (ev) => (ev.campaignSlug ? `/campaign/${ev.campaignSlug}` : '');

// A PDF uploaded to Sanity is cross-origin, so a normal download link would just
// open it in a tab. Sanity's ?dl= flag sends it as an attachment (forces the
// download) and names the file. Repo-hosted /pdfs/ paths are same-origin and
// download fine as-is.
const downloadUrl = (pdf, title) => {
  if (!pdf) return pdf;
  if (pdf.includes('cdn.sanity.io/files')) {
    const name = `${String(title || 'Menler-resource').replace(/[^\w-]+/g, '-')}.pdf`;
    return `${pdf}${pdf.includes('?') ? '&' : '?'}dl=${name}`;
  }
  return pdf;
};

/* ── Fallback (used until Sanity is populated) — shaped like campaign docs ── */
const FALLBACK = [
  {
    _id: 'f-live-1', slug: 'build-your-portfolio-with-claude', isLiveEvent: true,
    bannerLine1: 'Build Your', bannerLine2: 'Portfolio with Claude',
    bannerTagline: 'Build projects that recruiters actually notice — live, hands-on.',
    eventTags: ['Portfolio Projects', 'Case Studies', 'Personal Brand'],
    date: '25th Jul, 2026', time: '7:00 – 9:00 PM IST',
    mentorName: 'Sridevi Edupuganti', mentorRole: 'Co-Founder, Zenithworks AI', mentorPhoto: '/mentors/sridevi.png',
  },
  {
    _id: 'f-past-1', slug: 'turn-messy-data-into-clear-decisions-with-claude', // no isLiveEvent → Past
    bannerLine1: 'Turn Messy Data', bannerLine2: 'Into Clear Decisions',
    bannerTagline: 'How analysts use Claude to turn raw data into decisions leaders trust.',
    eventTags: ['Claude for Analysts'],
    date: '19th Jul, 2026', time: '2:00 – 3:30 PM IST',
    mentorName: 'Manish Yadav', mentorRole: 'AI Service Business Analyst',
    eventAttendees: '500+',
    eventResources: [{ title: 'Prompt Library', pdf: '/pdfs/Menler_100_Prompts_Playbook.pdf' }],
  },
].map(toEvent);

// Every campaign (except explicitly hidden ones) — Past fills from all of them,
// Live is the ones flagged isLiveEvent.
const EVENTS_QUERY = `*[_type == "campaignPage" && hideFromEvents != true] | order(eventOrder asc, _createdAt desc){
  "_id": _id, "slug": slug.current, title,
  bannerLine1, bannerLine2, bannerTagline, subtitle,
  date, time,
  mentorName, mentorRole, "mentorPhoto": mentorPhoto.asset->url,
  "eventImage": eventImage.asset->url,
  isLiveEvent, eventTags, eventAttendees,
  eventResources[]{ title, "pdf": coalesce(file.asset->url, pdfPath) }
}`;

/* Line icons for the schedule row — same 24px grid / 2px stroke as the rest of
   the site's inline SVGs, inheriting colour via currentColor. */
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

/* A title that spills a single word onto a second line ("…Career / Advantage")
   reads as broken, so a compact PAST card keeps its title on ONE line. CSS can't
   size text to its container, so measure it: step the font down from `max` until
   the title fits. TITLE_MIN is the floor — the CSS ellipsis catches anything
   still too long rather than wrapping. Re-runs on resize, since card width
   drives it.

   LIVE cards get `lines={2}` instead. They're the widest card on the page and
   they carry the longest headlines ("Crack your next High Paying Job with AI"),
   which on one line would have to shrink past the 15px subtitle below them —
   the headline ending up smaller than its own supporting copy. Given two
   balanced lines the same title holds full size, so the live card keeps its
   type hierarchy. The fit then measures HEIGHT against the line budget rather
   than width. */
const TITLE_MAX = 21;       // past cards
const LIVE_TITLE_MAX = 27;  // live cards start larger (see .ev-card--live .ev-title)
const TITLE_MIN = 13;
// 27px is a desktop headline size. On a phone the live card stacks and its
// body is barely 300px wide, where the same title takes two full-bleed lines
// and shoves the pill, subtitle, tags, date and button into one dense block.
// The fit loop only ever shrinks, so the ceiling is what has to come down.
const PHONE_W = 560;
const PHONE_TITLE_MAX = 19;
function FitTitle({ text, max = TITLE_MAX, lines = 1 }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let alive = true;
    const fit = () => {
      if (!alive) return;
      let size = window.innerWidth <= PHONE_W ? Math.min(max, PHONE_TITLE_MAX) : max;
      el.style.fontSize = `${size}px`;
      if (lines > 1) {
        // Wrapped: shrink until the text fits inside `lines` line-boxes. The
        // cap has to lift before measuring, or scrollHeight would be clipped to
        // the previous size's budget and every title would look like it fits.
        const budget = () => (parseFloat(getComputedStyle(el).lineHeight) || size * 1.2) * lines;
        el.style.maxHeight = 'none';
        while (size > TITLE_MIN && el.scrollHeight > budget() + 1) {
          size -= 0.5;
          el.style.fontSize = `${size}px`;
        }
        el.style.maxHeight = `${budget()}px`;
        return;
      }
      // scrollWidth only exceeds clientWidth while the text is nowrap, which is
      // a one-line title's permanent state (see .ev-title in global.css).
      while (size > TITLE_MIN && el.scrollWidth > el.clientWidth) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };
    fit();
    // DM Serif Display is WIDER than the fallback face it swaps in for, so a
    // title measured before the webfont arrives reads as fitting and then
    // overflows once it lands. Measure again once the fonts are actually ready.
    if (document.fonts?.ready) document.fonts.ready.then(fit).catch(() => {});
    // Watch the parent, not the title: re-fitting changes the title's own size,
    // so observing it would feed back into itself. The card width is what matters.
    const ro = el.parentElement ? new ResizeObserver(fit) : null;
    ro?.observe(el.parentElement);
    return () => { alive = false; ro?.disconnect(); };
  }, [text, max, lines]);
  return <h3 className={`ev-title${lines > 1 ? ' ev-title--wrap' : ''}`} ref={ref}>{text}</h3>;
}

/* ── Card art — always drawn by the site, in one of the three brand colours ──
   Every card is generated rather than uploaded, which is what lets the grid be
   colour-arranged at all: an uploaded banner is whatever it is, so a mix of the
   two gave a row of dark screenshots (several of them the SAME screenshot,
   reused across campaigns) next to generated cards. Generated art also stays
   sharp, weighs nothing, and picks up a campaign's title/mentor edits on its
   own. `tone` is the card's slot in the palette — see artTone. */
function EventArt({ ev, tone }) {
  // A real banner capture from the campaign's landing page beats anything we
  // can draw — it's the exact visual the Join button lands on. The generated
  // panel below is the fallback for campaigns with no capture yet.
  if (ev.thumbnail) {
    return <img className="ev-art-img" src={optImg(ev.thumbnail, 1000)} alt={ev.title} loading="lazy" decoding="async" />;
  }
  // Who's teaching it is the strongest thing on the card, so the mentor photo is
  // composited into the art on live and past alike — the live panel just gives
  // it a narrower column (see .ev-card--live .ev-art-face) so the headline keeps
  // room to breathe.
  const withFace = !!ev.mentorPhoto;
  return (
    <div
      className={`ev-art ev-art--gen${withFace ? ' ev-art--face' : ''}`}
      style={{ '--ev-accent': tone.accent, '--ev-tint': tone.tint }}
    >
      <span className="ev-art-dots" aria-hidden="true" />
      <span className="ev-art-glow" aria-hidden="true" />
      <div className="ev-art-top">
        <MenlerWordmark size={17} theme="dark" rule={tone.tint} />
        <span className="ev-art-badge">✦ Masterclass</span>
      </div>
      <span className="ev-art-title"><span>{ev.title}</span></span>
      {ev.tags?.[0] && <span className="ev-art-foot">{ev.tags[0]}</span>}
      {withFace && (
        <img className="ev-art-face" src={optImg(ev.mentorPhoto, 300)} alt={ev.mentorName || ''} loading="lazy" decoding="async" />
      )}
    </div>
  );
}

/* Shown in the Live section when nothing is live: the same horizontal card and
   generated dark-art panel as a real live event, recast as a "coming soon"
   poster, with the WhatsApp community as the notify channel. */
function ComingSoonCard() {
  return (
    <article className="ev-card ev-card--live ev-card--soon">
      <div className="ev-art ev-art--gen" style={{ '--ev-accent': BRAND_ART[0].accent, '--ev-tint': BRAND_ART[0].tint }}>
        <span className="ev-art-dots" aria-hidden="true" />
        <span className="ev-art-glow" aria-hidden="true" />
        <div className="ev-art-top">
          <MenlerWordmark size={17} theme="dark" rule={BRAND_ART[0].tint} />
          <span className="ev-art-badge">✦ Masterclass</span>
        </div>
        <span className="ev-art-title"><span>Coming Soon</span></span>
        <span className="ev-art-foot">The next live session is in the works</span>
      </div>
      <div className="ev-body">
        <span className="ev-soon-dot">Coming soon</span>
        <FitTitle text="Our next masterclass is brewing" max={LIVE_TITLE_MAX} lines={2} />
        <p className="ev-sub">
          We&rsquo;re lining up the next live session with someone shipping real AI work.
          Join the community and you&rsquo;ll be the first to know when seats open.
        </p>
        <div className="ev-foot">
          <a className="ev-join" href={MENLER_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Get notified first<span className="ev-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Events() {
  const navigate = useNavigate();
  const openApply = useApply();
  const { data } = useContentState(EVENTS_QUERY, FALLBACK);
  const [resource, setResource] = useState(null); // PlaybookModal item

  // Sanity returns raw campaign docs; the fallback is already mapped. Normalise
  // by running anything that still looks like a campaign doc through toEvent.
  const events = (data || []).map((e) => (e && e.status ? e : toEvent(e)));
  // A finished event is Past regardless of its Live toggle (see eventIsOver).
  // With more than one session live, the soonest one leads — the CMS order is
  // creation order, which would just as easily put next month's class above
  // this Friday's. Anything with an unparseable date sorts to 0 and leads;
  // that's the same "can't judge it, surface it" stance eventIsOver takes.
  const live = events
    .filter((e) => e.status !== 'past' && !eventIsOver(e))
    .sort((a, b) => eventStartMs(a) - eventStartMs(b));
  // Past events read newest-first, so the most recent masterclass leads the grid
  // and same-day sessions fall in reverse time order. Array.sort is stable, so
  // anything with no parseable date keeps the CMS order from EVENTS_QUERY.
  const past = events
    .filter((e) => e.status === 'past' || eventIsOver(e))
    .sort((a, b) => eventStartMs(b) - eventStartMs(a));

  // Past events grow over time — show two full rows, then reveal a row at a
  // time in place (the grid is 3-up on desktop, so these stay flush).
  const PAST_INITIAL = 6;
  const PAST_STEP = 3;
  const [pastShown, setPastShown] = useState(PAST_INITIAL);
  const pastVisible = past.slice(0, pastShown);

  // Live cards borrow the lane each event will hold once it joins the wall.
  const liveArt = liveTones(live, past.length);

  // Programs block links out to the other pages — land at the top, not mid-page.
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const join = (ev) => {
    const t = joinTarget(ev);
    if (!t) return;
    if (t.startsWith('http')) window.open(t, '_blank', 'noopener');
    else navigate(t);
  };

  return (
    <div className="ev">
      <Seo
        title="AI Events & Masterclasses | Menler"
        description="Live Menler masterclasses on Claude, AI and career growth — plus past sessions with free downloadable resources."
        path="/events"
      />

      {/* ── HERO ── */}
      <section className="ev-hero">
        <div className="hero-ring r1" /><div className="hero-ring r2" /><div className="hero-ring rl1" />
        <div className="ev-hero-in">
          <span className="ev-hero-eyebrow">✦ Menler Events</span>
          <h1 className="ev-hero-h1">Expert AI Masterclasses<br /><em>on Claude, Careers & Building</em></h1>
          <p className="ev-hero-sub">
            Live, hands-on sessions with people shipping real AI work — practical skills,
            portfolio-worthy builds, and honest answers. No fluff.
          </p>
          <a className="ev-hero-cta" href={MENLER_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.3-.9-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.4 2.6 1.6.2.1.4.1.6-.1l.7-.9c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.5.4.1.2.1.9-.1 1.5Z" /></svg>
            Join WhatsApp Community
          </a>
        </div>
      </section>

      {/* ── LIVE EVENTS (coming-soon poster when nothing is live) ── */}
      <section className="section ev-section ev-section--live">
        <p className="section-label">{live.length > 0 ? 'Happening now' : 'Up next'}</p>
        <h2 className="section-h2">Live <em>events</em></h2>
        <div className="ev-grid ev-grid--live">
          {live.length === 0 && <ComingSoonCard />}
          {live.map((ev, i) => (
            <article className="ev-card ev-card--live" key={ev._id}>
              <EventArt ev={ev} tone={liveArt[i]} />
              <div className="ev-body">
                <span className="ev-live-dot">● Live masterclass</span>
                <FitTitle text={ev.title} max={LIVE_TITLE_MAX} lines={2} />
                {ev.subtitle && <p className="ev-sub">{ev.subtitle}</p>}
                {ev.tags?.length > 0 && (
                  <div className="ev-tags">{ev.tags.map((t) => <span key={t}>{t}</span>)}</div>
                )}
                {(ev.date || ev.time) && (
                  <p className="ev-when">
                    {ev.date && <span className="ev-when-item"><CalendarIcon />{ev.date}</span>}
                    {ev.time && <span className="ev-when-item"><ClockIcon />{ev.time}</span>}
                  </p>
                )}
                <div className="ev-foot">
                  {joinTarget(ev) && (
                    <button className="ev-join" onClick={() => join(ev)}>
                      Join masterclass<span className="ev-arrow" aria-hidden="true">↗</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── PAST EVENTS ── */}
      {past.length > 0 && (
        <section className="section ev-section ev-section--past">
          <p className="section-label">Catch up</p>
          <h2 className="section-h2">Past <em>events</em></h2>
          <div className="ev-grid ev-grid--past">
            {pastVisible.map((ev, i) => (
              <article className="ev-card ev-card--past" key={ev._id}>
                {/* Oldest event is 0, so an event's lane never moves once set. */}
                <EventArt ev={ev} tone={pastTone(past.length - 1 - i)} />
                <div className="ev-body">
                  <FitTitle text={ev.title} />
                  {ev.subtitle && <p className="ev-sub">{ev.subtitle}</p>}
                  {ev.tags?.length > 0 && (
                    <div className="ev-tags">{ev.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  )}
                  {(ev.date || ev.time || ev.attendees) && (
                    <div className="ev-when">
                      {ev.date && <span className="ev-when-item"><CalendarIcon />{ev.date}</span>}
                      {ev.time && <span className="ev-when-item"><ClockIcon />{ev.time}</span>}
                      {ev.attendees && <span className="ev-attend">{ev.attendees} attendees</span>}
                    </div>
                  )}
                  <div className="ev-foot">
                    <button
                      className="ev-download"
                      onClick={() => {
                        const r = ev.resources?.[0];
                        setResource({
                          title: r?.title || `${ev.title} — resources`,
                          desc: `Free resources from "${ev.title}".`,
                          badge: 'Event resource',
                          pdf: r?.pdf ? downloadUrl(r.pdf, r.title || ev.title) : '',
                          source: 'event-resource',
                          section: `Event · ${ev.title}`,
                        });
                      }}
                    >
                      Access Now<span className="ev-arrow" aria-hidden="true">↗</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {past.length > pastShown && (
            <div className="ev-more">
              <button className="ev-more-btn" onClick={() => setPastShown((n) => n + PAST_STEP)}>
                Show more <span>({past.length - pastShown} more)</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* ── EXPLORE MENLER PROGRAMS (same block as /aptitude) ── */}
      <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Explore More Programs</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>Continue your <em>AI journey.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>Ready to go beyond a single session? Explore the Menler programs designed to help you<br />build capability, portfolio, and career momentum.</p>
        <div className="cluster-grid" style={{ marginTop: 28 }}>
          <div className="cluster-card cluster-card--kick">
            <p className="cluster-num">For beginners &amp; explorers</p>
            <p className="cluster-name">Menler Gen AI Kickstarter</p>
            <p className="cluster-sets">Learn AI fundamentals, build your first portfolio, and become AI fluent in just 14 days.</p>
            <button className="cluster-btn" onClick={() => go('/kickstarter')}>Explore Kickstarter</button>
          </div>
          <div className="cluster-card cluster-card--gen">
            <p className="cluster-num">College students &amp; professionals</p>
            <p className="cluster-name">Menler Claude AI Generalist Fellowship</p>
            <p className="cluster-sets">Apply AI across business functions. Drive real-world impact through smarter execution.</p>
            <button className="cluster-btn" onClick={() => go('/generalist')}>Explore Fellowship</button>
          </div>
          <div className="cluster-card cluster-card--eng">
            <p className="cluster-num">Engineers &amp; technical builders</p>
            <p className="cluster-name">Menler AI Engineering Fellowship</p>
            <p className="cluster-sets">Build production-grade AI systems, agents, RAG applications, MCP integrations, and AI infrastructure.</p>
            <button className="cluster-btn" onClick={() => go('/engineering')}>Explore Engineering</button>
          </div>
        </div>
      </section>

      {/* Same banner as /generalist. ctaLabel marks it as the Events placement so
          the lead is attributable; source/section stay identical so it routes
          exactly like the Generalist page's own Apply. */}
      <CtaBanner
        badge="Applications open · 30 seats"
        title="Ready to become a Claude AI Generalist?"
        subtitle={<><span style={{ whiteSpace: 'nowrap' }}>No coding experience.</span> <span style={{ whiteSpace: 'nowrap' }}>Just 10 weeks and real ambition.</span></>}
        buttonText="Apply Now"
        onButtonClick={() => openApply({
          ctaLabel: 'Apply · Events',
          source: 'generalist-lead',
          section: 'Claude AI Generalist Fellowship',
        })}
      />

      <Footer />

      {/* Name/email gate → downloads the PDF + captures the lead. */}
      <PlaybookModal item={resource} onClose={() => setResource(null)} />
    </div>
  );
}
