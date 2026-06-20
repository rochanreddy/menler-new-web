import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Seo from '../components/common/Seo';
import { submitLead } from '../services/leadService';
import { useContent } from '../lib/useContent';

// ── Single-mentor workshop registration landing page (/ai-kickstarter) ──
// Left column scrolls (mentor + workshop details); right column is a STATIC
// (sticky) registration form. Chrome-free (no global nav/footer). Lead → admin
// (source: kickstarter-workshop).
//
// Content is editable in Sanity Studio ("Campaign Landing Page" singleton) so the
// client can swap the mentor photo/details and copy for each campaign. The
// values below are the FALLBACK used until Sanity is populated.
const WORKSHOP = {
  banner: {
    badge: 'Designed for an AI-First Career',
    line1: 'Build Your First',
    line2: 'AI Agent',
    tagline: 'Go from zero to a working agent — live in 2 hours.',
  },
  subtitle: 'A hands-on workshop where you go from zero to a working AI agent — no coding, no jargon. Walk away with something real you built yourself.',
  date: 'Saturday, 12 July 2026',
  time: '5:00 – 7:00 PM IST',
  format: 'Live online · Recording provided',
  price: '499',
  origPrice: '4,999',
  seatsNote: 'Only 40 seats per cohort',
  mentor: {
    name: 'Sachin Roy',
    role: 'Founder, Menler',
    img: '/mentors/Sachin.png',
    bio: 'Sachin has spent the last decade building AI products and training professionals to work alongside AI. He has led teams shipping real Claude-powered systems and has mentored hundreds of learners into AI-native roles.',
    creds: [
      '10+ years building AI & software products',
      'Trained 500+ professionals on practical AI',
      'Built production Claude agents & workflows',
    ],
  },
};

const LEARN = [
  { t: 'How AI agents actually work', d: 'The simple mental model behind agents — prompts, tools, and memory — minus the hype.' },
  { t: 'Build a working agent, live', d: 'Follow along and create a real research/assistant agent step by step on the call.' },
  { t: 'Connect it to real tools', d: 'Wire your agent into the apps you use so it actually does work, not just chats.' },
  { t: 'Ship & show it off', d: 'Leave with a finished build you can put on your CV and show employers.' },
];

const FORYOU = [
  'Students who want an edge in placements & internships',
  'Working professionals who want to use AI in their job',
  'Founders & operators who want to automate real work',
  'Absolute beginners — zero coding or AI experience needed',
];

const GET = [
  { t: 'A real AI agent you built', d: 'Not a demo — a working build that’s yours to keep.' },
  { t: 'Workshop recording', d: 'Rewatch anytime, follow at your own pace.' },
  { t: 'Prompt & tool starter pack', d: 'Templates and resources to keep building after.' },
  { t: 'Certificate of participation', d: 'LinkedIn-shareable proof of hands-on AI work.' },
  { t: 'Live Q&A with the mentor', d: 'Ask anything and get unstuck in real time.' },
  { t: 'Exclusive community access', d: 'Join a network of AI builders and keep learning.' },
];

// Fallback shaped to match the Sanity query result.
const FALLBACK = {
  bannerBadge: WORKSHOP.banner.badge,
  bannerLine1: WORKSHOP.banner.line1,
  bannerLine2: WORKSHOP.banner.line2,
  bannerTagline: WORKSHOP.banner.tagline,
  subtitle: WORKSHOP.subtitle,
  date: WORKSHOP.date,
  time: WORKSHOP.time,
  format: WORKSHOP.format,
  price: WORKSHOP.price,
  origPrice: WORKSHOP.origPrice,
  seatsNote: WORKSHOP.seatsNote,
  themeAccent: '', themeAccentDark: '', bannerFrom: '', bannerTo: '', highlightBg: '', highlightText: '',
  mentorName: WORKSHOP.mentor.name,
  mentorRole: WORKSHOP.mentor.role,
  mentorPhoto: WORKSHOP.mentor.img,
  mentorBio: WORKSHOP.mentor.bio,
  mentorCreds: WORKSHOP.mentor.creds,
  learn: LEARN.map((l) => ({ title: l.t, detail: l.d })),
  forYou: FORYOU,
  get: GET.map((g) => ({ title: g.t, detail: g.d })),
  certificateImage: '',
  certificateNote: 'A Menler Certificate of Participation — shareable on LinkedIn.',
  whatsappUrl: '',
  whatsappText: 'Join our WhatsApp community for updates, resources & support.',
};

// Load the campaign matching the URL slug (defaults to 'ai-kickstarter').
const CAMPAIGN_QUERY = `*[_type == "campaignPage" && slug.current == $slug][0]{
  bannerBadge, bannerLine1, bannerLine2, bannerTagline, subtitle,
  date, time, format, price, origPrice, seatsNote,
  themeAccent, themeAccentDark, bannerFrom, bannerTo, highlightBg, highlightText,
  mentorName, mentorRole, "mentorPhoto": mentorPhoto.asset->url, mentorBio, mentorCreds,
  learn[]{title, detail}, forYou, get[]{title, detail},
  "certificateImage": certificateImage.asset->url, certificateNote, whatsappUrl, whatsappText
}`;

const has = (v) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0);

export default function KickstarterLanding() {
  const navigate = useNavigate();
  const go = (p) => { navigate(p); window.scrollTo(0, 0); };
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Sanity-editable content for this slug, merged per-field over the fallback.
  const { slug } = useParams();
  const activeSlug = slug || 'ai-kickstarter';
  const c = useContent(CAMPAIGN_QUERY, FALLBACK, { slug: activeSlug });
  const d = {};
  for (const k of Object.keys(FALLBACK)) d[k] = has(c?.[k]) ? c[k] : FALLBACK[k];
  const heading = `${d.bannerLine1} ${d.bannerLine2}`.trim();
  const num = (i) => String(i + 1).padStart(2, '0');

  // Per-campaign colour theme — only set a CSS var when the client provided a
  // value, otherwise the default (amber) theme from the stylesheet applies.
  const themeStyle = {};
  const setVar = (name, val) => { if (has(val)) themeStyle[name] = val; };
  setVar('--a', d.themeAccent);
  setVar('--a-dark', d.themeAccentDark);
  setVar('--banner-from', d.bannerFrom);
  setVar('--cream', d.bannerFrom);
  setVar('--banner-to', d.bannerTo);
  setVar('--hl-bg', d.highlightBg);
  setVar('--hl-text', d.highlightText);

  const register = async (e) => {
    e.preventDefault();
    setErr(false); setBusy(true);
    try {
      await submitLead({ ...form, source: 'campaign-workshop', campaign: activeSlug, workshop: heading });
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="lp2" style={themeStyle}>
      <Seo title={`${heading} | Menler Workshop`} description={d.subtitle} noindex />

      {/* Minimal top bar */}
      <header className="lp2-top">
        <MenlerWordmark size={26} theme="light" />
        <span className="lp2-top-tag">Live Workshop</span>
      </header>

      <div className="lp2-grid">
        {/* ── LEFT: scrolling content ── */}
        <div className="lp2-main">
          {/* Banner hero */}
          <section className="lp2-banner">
            <div className="lp2-banner-body">
              <span className="lp2-banner-badge">✦ {d.bannerBadge}</span>
              <h1 className="lp2-banner-title">
                <mark>{d.bannerLine1}</mark>
                <mark>{d.bannerLine2}</mark>
              </h1>
              <p className="lp2-banner-tag">{d.bannerTagline}</p>
              <div className="lp2-banner-brand">
                <span className="lp2-banner-brandmark">
                  <MenlerWordmark size={20} theme="light" />
                  <b className="lp2-banner-mc">MASTERCLASS</b>
                </span>
                <span className="lp2-banner-credit"><span className="lp2-banner-free">Free Guidance</span>By <b>{d.mentorName}</b> — {d.mentorRole}</span>
              </div>
            </div>
            <div className="lp2-banner-photo"><img src={d.mentorPhoto} alt={d.mentorName} /></div>
            <div className="lp2-banner-strip">
              <span><b>{d.date}</b></span>
              <span className="lp2-strip-dot" />
              <span>{d.time}</span>
            </div>
          </section>

          <p className="lp2-subtitle" style={{ marginTop: 26 }}>{d.subtitle}</p>

          {/* What you'll learn */}
          <section className="lp2-block">
            <h2 className="lp2-h2">What you'll <em>learn &amp; build</em></h2>
            <div className="lp2-learn">
              {d.learn.map((l, i) => (
                <div key={i} className="lp2-learn-item">
                  <span className="lp2-learn-n">{num(i)}</span>
                  <div>
                    <p className="lp2-learn-t">{l.title}</p>
                    <p className="lp2-learn-d">{l.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What you get */}
          <section className="lp2-block">
            <h2 className="lp2-h2">What you <em>get</em></h2>
            <div className="lp2-get">
              {d.get.map((g, i) => (
                <div key={i} className="lp2-get-card">
                  <p className="lp2-get-t">{g.title}</p>
                  <p className="lp2-get-d">{g.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sample certificate */}
          <section className="lp2-block">
            <h2 className="lp2-h2">Sample <em>certificate</em></h2>
            <div className="lp2-cert">
              {d.certificateImage ? (
                <img className="lp2-cert-img" src={d.certificateImage} alt="Sample Menler certificate" />
              ) : (
                <div className="lp2-cert-mock">
                  <div className="lp2-cert-mock-top">
                    <MenlerWordmark size={24} theme="light" />
                    <span className="lp2-cert-mock-seal">★</span>
                  </div>
                  <p className="lp2-cert-mock-kicker">Certificate of Participation</p>
                  <p className="lp2-cert-mock-to">This certifies that</p>
                  <p className="lp2-cert-mock-name">Your Name</p>
                  <p className="lp2-cert-mock-for">has successfully completed<br /><b>{heading}</b></p>
                  <p className="lp2-cert-mock-sign">{d.mentorName} · {d.mentorRole}</p>
                </div>
              )}
              {d.certificateNote && <p className="lp2-cert-note">{d.certificateNote}</p>}
            </div>
          </section>

          {/* Join WhatsApp community bar */}
          <a className="lp2-wa" href={d.whatsappUrl || '#'} target="_blank" rel="noopener noreferrer">
            <span className="lp2-wa-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </span>
            <span className="lp2-wa-text">{d.whatsappText}</span>
            <span className="lp2-wa-btn">Join now</span>
          </a>

          {/* About your mentor */}
          <section className="lp2-block">
            <h2 className="lp2-h2">About your <em>mentor</em></h2>
            <div className="lp2-mentor">
              <img className="lp2-mentor-img" src={d.mentorPhoto} alt={d.mentorName} />
              <div className="lp2-mentor-info">
                <p className="lp2-mentor-name">{d.mentorName}</p>
                <p className="lp2-mentor-role">{d.mentorRole}</p>
                <p className="lp2-mentor-bio">{d.mentorBio}</p>
                <ul className="lp2-mentor-creds">
                  {d.mentorCreds.map((cr) => <li key={cr}>{cr}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <div className="lp2-quote">
            “The best time to become AI-native is today, not someday. In two hours,
            you'll build something you didn't think you could.”
            <span>— {d.mentorName}, {d.mentorRole}</span>
          </div>

          {/* Explore Menler Programs */}
          <section className="lp2-block">
            <h2 className="lp2-h2">Explore Menler <em>Programs</em></h2>
            <div className="lp2-explore">
              <div className="cluster-card cluster-card--kick">
                <p className="cluster-num">For beginners</p>
                <p className="cluster-name">Menler AI Kickstarter</p>
                <p className="cluster-sets">AI fundamentals + your first portfolio in 14 days.</p>
                <button className="cluster-btn" onClick={() => go('/kickstarter')}>Explore Kickstarter</button>
              </div>
              <div className="cluster-card cluster-card--gen">
                <p className="cluster-num">Students &amp; professionals</p>
                <p className="cluster-name">Menler AI Generalist Fellowship</p>
                <p className="cluster-sets">Apply AI across business — 10-week fellowship.</p>
                <button className="cluster-btn" onClick={() => go('/generalist')}>Explore Fellowship</button>
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT: sticky registration form ── */}
        <aside className="lp2-aside" id="register">
          <div className="lp2-form-card">
            {done ? (
              <div className="lp2-success">
                <div className="lp2-success-tick">✓</div>
                <p className="lp2-success-h">You're registered!</p>
                <p className="lp2-success-p">We've got your spot. Joining details and the calendar invite are on their way to <b>{form.email}</b>.</p>
              </div>
            ) : (
              <>
                <div className="lp2-price-row">
                  <span className="lp2-price">₹{d.price}</span>
                  {d.origPrice && <span className="lp2-price-orig">₹{d.origPrice}</span>}
                </div>
                <p className="lp2-form-h">Reserve your seat</p>
                <form onSubmit={register}>
                  <input className="lp2-input" type="text" required placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                  <input className="lp2-input" type="email" required placeholder="Email address" value={form.email} onChange={(e) => set('email', e.target.value)} />
                  <input className="lp2-input" type="tel" required placeholder="Phone number" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                  <button className="lp2-submit" type="submit" disabled={busy}>{busy ? 'Reserving…' : 'Register now'}</button>
                  {err && <p className="lp2-err">Couldn't register — please check your connection and try again.</p>}
                </form>
              </>
            )}
          </div>

          {/* AI Aptitude Test promo */}
          <div className="lp2-apt-card">
            <p className="lp2-apt-eyebrow">Not sure where to start?</p>
            <p className="lp2-apt-title">Check out our AI Aptitude Test</p>
            <p className="lp2-apt-desc">Find your AI level in 5 minutes and get a personalised program recommendation — free.</p>
            <button className="lp2-apt-btn" onClick={() => go('/aptitude')}>Take the Aptitude Test →</button>
          </div>
        </aside>
      </div>

      {/* Mobile sticky CTA → jumps to the form */}
      <a className="lp2-stickybar" href="#register">
        <span><b>₹{d.price}</b> · {d.seatsNote}</span>
        <span className="lp2-stickybar-btn">Register</span>
      </a>

      <footer className="lp2-foot">
        <span>© 2026 Menler Learning Systems pvt ltd</span>
        <a href="mailto:support@menler.in">support@menler.in</a>
      </footer>
    </div>
  );
}
