import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  mentorName: WORKSHOP.mentor.name,
  mentorRole: WORKSHOP.mentor.role,
  mentorPhoto: WORKSHOP.mentor.img,
  mentorBio: WORKSHOP.mentor.bio,
  mentorCreds: WORKSHOP.mentor.creds,
  learn: LEARN.map((l) => ({ title: l.t, detail: l.d })),
  forYou: FORYOU,
  get: GET.map((g) => ({ title: g.t, detail: g.d })),
};

const CAMPAIGN_QUERY = `*[_type == "campaignPage"][0]{
  bannerBadge, bannerLine1, bannerLine2, bannerTagline, subtitle,
  date, time, format, price, origPrice, seatsNote,
  mentorName, mentorRole, "mentorPhoto": mentorPhoto.asset->url, mentorBio, mentorCreds,
  learn[]{title, detail}, forYou, get[]{title, detail}
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

  // Sanity-editable content, merged per-field over the fallback.
  const c = useContent(CAMPAIGN_QUERY, FALLBACK);
  const d = {};
  for (const k of Object.keys(FALLBACK)) d[k] = has(c?.[k]) ? c[k] : FALLBACK[k];
  const heading = `${d.bannerLine1} ${d.bannerLine2}`.trim();
  const num = (i) => String(i + 1).padStart(2, '0');

  const register = async (e) => {
    e.preventDefault();
    setErr(false); setBusy(true);
    try {
      await submitLead({ ...form, source: 'kickstarter-workshop', workshop: heading, program: 'Gen AI Kickstarter' });
      setDone(true);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="lp2">
      <Seo title={`${heading} | Menler Workshop`} description={d.subtitle} path="/ai-kickstarter" noindex />

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

          {/* Who it's for */}
          <section className="lp2-block">
            <h2 className="lp2-h2">Who it's <em>for</em></h2>
            <ul className="lp2-for">
              {d.forYou.map((f) => <li key={f}><span className="lp2-check">✓</span>{f}</li>)}
            </ul>
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

          {/* Explore Menler Programs */}
          <div className="lp2-explore">
            <p className="lp2-explore-label">Explore Menler Programs</p>
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
