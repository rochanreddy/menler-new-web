import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Seo from '../components/common/Seo';
import Footer from '../components/layout/Footer';
import PlaybookModal from '../components/common/PlaybookModal';
import { useContentState } from '../lib/useContent';
import { MENLER_WHATSAPP_URL } from '../data/communityLinks';

// ── /events — Menler masterclasses & events ──────────────────────────────────
// Ticket-style hero → Live events (Join) → Past events (Download resources).
//
// Events are the CAMPAIGN PAGES themselves:
//   • PAST — every campaign shows here automatically (unless "Hide from Events").
//   • LIVE — only campaigns with "Show as a Live event" turned on.
// So a new campaign becomes a past event with no action; you only ever flip the
// Live toggle. The card's title, date, mentor, accent and Join link all come
// from the campaign itself.

const optImg = (url, w) =>
  (url && url.includes('cdn.sanity.io') ? `${url}${url.includes('?') ? '&' : '?'}w=${w}&auto=format&q=72&fit=max` : url);

// Map a raw campaign doc → the shape the cards render. One place, so the query,
// the fallback and the cards never drift.
const toEvent = (c) => ({
  _id: c._id || c.slug,
  status: c.isLiveEvent ? 'live' : 'past',
  title: [c.bannerLine1, c.bannerLine2].filter(Boolean).join(' ') || c.title,
  subtitle: c.bannerTagline || c.subtitle || '',
  tags: c.eventTags || [],
  date: c.date || '', time: c.time || '',
  campaignSlug: c.slug || '',
  accent: c.themeAccent || c.highlightBg || '#534AB7',
  thumbnail: c.eventImage || '',
  mentorName: c.mentorName || '', mentorRole: c.mentorRole || '', mentorPhoto: c.mentorPhoto || '',
  attendees: c.eventAttendees || '',
  resources: c.eventResources || [],
});

// Join always goes to the campaign's own registration page.
const joinTarget = (ev) => (ev.campaignSlug ? `/campaign/${ev.campaignSlug}` : '');

/* ── Fallback (used until Sanity is populated) — shaped like campaign docs ── */
const FALLBACK = [
  {
    _id: 'f-live-1', slug: 'build-your-portfolio-with-claude', isLiveEvent: true,
    bannerLine1: 'Build Your', bannerLine2: 'Portfolio with Claude',
    bannerTagline: 'Build projects that recruiters actually notice — live, hands-on.',
    eventTags: ['Portfolio Projects', 'Case Studies', 'Personal Brand'],
    date: '25th Jul, 2026', time: '7:00 – 9:00 PM IST', themeAccent: '#2563EB',
    mentorName: 'Sridevi Edupuganti', mentorRole: 'Co-Founder, Zenithworks AI', mentorPhoto: '/mentors/sridevi.png',
  },
  {
    _id: 'f-past-1', slug: 'turn-messy-data-into-clear-decisions-with-claude', // no isLiveEvent → Past
    bannerLine1: 'Turn Messy Data', bannerLine2: 'Into Clear Decisions',
    bannerTagline: 'How analysts use Claude to turn raw data into decisions leaders trust.',
    eventTags: ['Claude for Analysts'],
    date: '19th Jul, 2026', time: '2:00 – 3:30 PM IST', themeAccent: '#1D9E75',
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
  date, time, themeAccent, highlightBg,
  mentorName, mentorRole, "mentorPhoto": mentorPhoto.asset->url,
  "eventImage": eventImage.asset->url,
  isLiveEvent, eventTags, eventAttendees, eventResources[]{ title, pdf }
}`;

/* ── Auto-generated card art (no image upload needed) ────────────────────── */
function EventArt({ ev }) {
  const accent = ev.accent || '#534AB7';
  // Uploaded thumbnails are full campaign banners (wide). Render them as a real
  // <img> at natural aspect — full width, never cropped, responsive — rather
  // than a fixed-ratio background that would crop the sides.
  if (ev.thumbnail) {
    return <img className="ev-art-img" src={optImg(ev.thumbnail, 1000)} alt={ev.title} loading="lazy" decoding="async" />;
  }
  return (
    <div className={`ev-art ev-art--gen${ev.mentorPhoto ? ' ev-art--face' : ''}`} style={{ '--ev-accent': accent }}>
      <span className="ev-art-brand">menler<i /></span>
      <span className="ev-art-title">{ev.title}</span>
      {ev.mentorPhoto && (
        <img className="ev-art-face" src={optImg(ev.mentorPhoto, 240)} alt={ev.mentorName || ''} loading="lazy" decoding="async" />
      )}
    </div>
  );
}

function Host({ ev }) {
  if (!ev.mentorName) return <span />;
  return (
    <span className="ev-host">
      {ev.mentorPhoto
        ? <img className="ev-host-face" src={optImg(ev.mentorPhoto, 96)} alt={ev.mentorName} loading="lazy" decoding="async" />
        : <span className="ev-host-face ev-host-face--ph" aria-hidden="true">{ev.mentorName.charAt(0)}</span>}
      <span>
        <b>{ev.mentorName}</b>
        {ev.mentorRole && <i>{ev.mentorRole}</i>}
      </span>
    </span>
  );
}

export default function Events() {
  const navigate = useNavigate();
  const { data } = useContentState(EVENTS_QUERY, FALLBACK);
  const [resource, setResource] = useState(null); // PlaybookModal item

  // Sanity returns raw campaign docs; the fallback is already mapped. Normalise
  // by running anything that still looks like a campaign doc through toEvent.
  const events = (data || []).map((e) => (e && e.status ? e : toEvent(e)));
  const live = events.filter((e) => e.status !== 'past');
  const past = events.filter((e) => e.status === 'past');

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

      {/* ── HERO — ticket style ── */}
      <section className="ev-hero">
        <span className="ev-ticket ev-ticket--l" aria-hidden="true" />
        <span className="ev-ticket ev-ticket--r" aria-hidden="true" />
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

      {/* ── LIVE EVENTS ── */}
      {live.length > 0 && (
        <section className="section ev-section">
          <p className="section-label">Happening now</p>
          <h2 className="section-h2">Live <em>events</em></h2>
          <div className="ev-grid ev-grid--live">
            {live.map((ev) => (
              <article className={`ev-card ev-card--live${ev.thumbnail ? ' ev-card--live-banner' : ''}`} key={ev._id}>
                <EventArt ev={ev} />
                <div className="ev-body">
                  <span className="ev-live-dot">● Live masterclass</span>
                  <h3 className="ev-title">{ev.title}</h3>
                  {ev.subtitle && <p className="ev-sub">{ev.subtitle}</p>}
                  {ev.tags?.length > 0 && (
                    <div className="ev-tags">{ev.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  )}
                  {(ev.date || ev.time) && (
                    <p className="ev-when">{[ev.date, ev.time].filter(Boolean).join(' · ')}</p>
                  )}
                  <div className="ev-foot">
                    <Host ev={ev} />
                    {joinTarget(ev) && (
                      <button className="ev-join" onClick={() => join(ev)}>Join masterclass →</button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── PAST EVENTS ── */}
      {past.length > 0 && (
        <section className="section ev-section ev-section--past">
          <p className="section-label">Catch up</p>
          <h2 className="section-h2">Past <em>events</em></h2>
          <div className="ev-grid">
            {past.map((ev) => (
              <article className="ev-card ev-card--past" key={ev._id}>
                <EventArt ev={ev} />
                <div className="ev-body">
                  <h3 className="ev-title">{ev.title}</h3>
                  {ev.subtitle && <p className="ev-sub">{ev.subtitle}</p>}
                  {ev.tags?.length > 0 && (
                    <div className="ev-tags">{ev.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  )}
                  <div className="ev-meta">
                    {(ev.date || ev.time) && <span>{[ev.date, ev.time].filter(Boolean).join(' · ')}</span>}
                    {ev.attendees && <span className="ev-attend">{ev.attendees} attendees</span>}
                  </div>
                  <div className="ev-foot">
                    <Host ev={ev} />
                    {ev.resources?.length > 0 && (
                      <button
                        className="ev-download"
                        onClick={() => setResource({
                          title: ev.resources[0].title || `${ev.title} — resources`,
                          desc: `Free resources from "${ev.title}".`,
                          badge: 'Event resource',
                          pdf: ev.resources[0].pdf,
                          source: 'event-resource',
                          section: `Event · ${ev.title}`,
                        })}
                      >
                        ↓ Download resources
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <Footer />

      {/* Name/email gate → downloads the PDF + captures the lead. */}
      <PlaybookModal item={resource} onClose={() => setResource(null)} />
    </div>
  );
}
