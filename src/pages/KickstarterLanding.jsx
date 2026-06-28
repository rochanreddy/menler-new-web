import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Seo from '../components/common/Seo';
import MenlerCommunitySection from '../components/common/MenlerCommunitySection';
import { MENLER_WHATSAPP_URL } from '../data/communityLinks';
import { submitLead } from '../services/leadService';
import { useContent } from '../lib/useContent';
import AmplifeedOtpForm from '../components/common/AmplifeedOtpForm';

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
  whatsappUrl: MENLER_WHATSAPP_URL,
  discordUrl: '',
  facebookUrl: '',
  whatsappText: 'Join our WhatsApp community for updates, resources & support.',
  communityText: 'Updates, resources & support across all our channels.',
};

// Load the campaign matching the URL slug (defaults to 'ai-kickstarter').
const CAMPAIGN_QUERY = `*[_type == "campaignPage" && slug.current == $slug][0]{
  bannerBadge, bannerLine1, bannerLine2, bannerTagline, subtitle,
  date, time, format, price, origPrice, seatsNote,
  themeAccent, themeAccentDark, bannerFrom, bannerTo, highlightBg, highlightText,
  mentorName, mentorRole, "mentorPhoto": mentorPhoto.asset->url, mentorBio, mentorCreds,
  learn[]{title, detail}, forYou, get[]{title, detail},
  "certificateImage": certificateImage.asset->url, certificateNote, whatsappUrl, discordUrl, facebookUrl, whatsappText, communityText
}`;

const has = (v) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0);

const COUNTRY_CODES = [
  { code: '+91', label: 'IN +91' },
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+971', label: 'AE +971' },
  { code: '+65', label: 'SG +65' },
  { code: '+61', label: 'AU +61' },
];

export default function KickstarterLanding() {
  const navigate = useNavigate();
  const go = (p) => { navigate(p); window.scrollTo(0, 0); };
  const [form, setForm] = useState({ name: '', email: '', countryCode: '+91', phone: '', city: '', background: '', otp: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [done, setDone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhoneChange = (val) => {
    const clean = val.replace(/\D/g, '');
    const maxLen = form.countryCode === '+91' ? 10 : 15;
    setForm((f) => ({ ...f, phone: clean.slice(0, maxLen) }));
  };

  const phoneMinLen = form.countryCode === '+91' ? 10 : 8;

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

  // Step 1 — validate fields, then reveal the OTP box.
  const sendOtp = (e) => {
    e.preventDefault();
    if (form.phone.length < phoneMinLen) {
      setErr(`Phone number must be at least ${phoneMinLen} digits.`);
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.city.trim() || !form.background) {
      setErr('Please fill in all fields before verifying.');
      return;
    }
    setErr(null);
    setOtpBusy(true);
    // Simulate a brief "sending" delay for UX then reveal OTP input.
    setTimeout(() => { setOtpBusy(false); setOtpSent(true); }, 800);
  };

  // Step 2 — complete registration with OTP.
  const register = async (e) => {
    e.preventDefault();
    if (!form.otp.trim()) {
      setErr('Please enter the OTP sent to your phone.');
      return;
    }
    setErr(null); setBusy(true);
    try {
      await submitLead({ ...form, phone: `${form.countryCode} ${form.phone}`, source: 'campaign-workshop', campaign: activeSlug, workshop: heading, cta_label: `Register: ${heading}`, section: `Campaign · ${activeSlug}` });
      navigate('/checkout', {
        state: {
          workshop: heading,
          price: d.price,
          name: form.name,
          email: form.email,
          phone: `${form.countryCode} ${form.phone}`,
          city: form.city,
          background: form.background,
          otp: form.otp,
          campaign: activeSlug,
          whatsappUrl: d.whatsappUrl,
          whatsappText: d.whatsappText,
          communityText: d.communityText
        }
      });
    } catch {
      setErr("Couldn't register — please check your connection and try again.");
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
        <span className="lp2-top-tag">Live Workshop<span className="lp2-top-tag-dot" aria-hidden="true" /></span>
      </header>

      <div className="lp2-grid">
        {/* ── LEFT: scrolling content ── */}
        <div className="lp2-main">
          {/* Banner hero */}
          <section className="lp2-banner">
            <div className="lp2-banner-body">
              <div className="lp2-banner-logo" style={{ marginBottom: '14px' }}>
                <MenlerWordmark size={22} theme="light" />
              </div>
              <span className="lp2-banner-badge">✦ {d.bannerBadge}</span>
              <h1 className="lp2-banner-title">
                <mark>{d.bannerLine1}</mark>
                <mark>{d.bannerLine2}</mark>
              </h1>
              <p className="lp2-banner-tag">{d.bannerTagline}</p>
              <div className="lp2-banner-brand">
                <span className="lp2-banner-credit">By <b>{d.mentorName}</b> — {d.mentorRole}</span>
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
                    <span className="lp2-cert-mock-issued">Issued by Menler</span>
                  </div>
                  <p className="lp2-cert-mock-kicker">Certificate of Participation</p>
                  <p className="lp2-cert-mock-to">This is proudly presented to</p>
                  <p className="lp2-cert-mock-name">Your Name</p>
                  <span className="lp2-cert-rule" />
                  <p className="lp2-cert-mock-for">for successfully completing<br /><b>{heading}</b></p>
                  <div className="lp2-cert-foot">
                    <span className="lp2-cert-seal">
                      <span className="lp2-cert-seal-star">★</span>
                      <span className="lp2-cert-seal-txt">MENLER<br />VERIFIED</span>
                    </span>
                    <span className="lp2-cert-sign">
                      <span className="lp2-cert-sign-name">{d.mentorName}</span>
                      <span className="lp2-cert-sign-role">{d.mentorRole}</span>
                    </span>
                  </div>
                </div>
              )}
              {d.certificateNote && <p className="lp2-cert-note">{d.certificateNote}</p>}
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

          <MenlerCommunitySection
            className="lp2-community-wrap"
            whatsappUrl={d.whatsappUrl || MENLER_WHATSAPP_URL}
            communityText={d.communityText}
          />

          {/* Explore Menler Programs */}
          <section className="lp2-block">
            <h2 className="lp2-h2">Explore More <em>Programs</em></h2>
            <div className="lp2-explore">
              <div className="cluster-card cluster-card--kick">
                <p className="cluster-num">For beginners</p>
                <p className="cluster-name">Menler Gen AI Kickstarter</p>
                <p className="cluster-sets">AI fundamentals + your first portfolio in 14 days.</p>
                <button className="cluster-btn" onClick={() => go('/kickstarter')}>Explore Kickstarter</button>
              </div>
              <div className="cluster-card cluster-card--gen">
                <p className="cluster-num">Students &amp; professionals</p>
                <p className="cluster-name">Menler Claude AI Generalist Fellowship</p>
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
                <p className="lp2-form-h">Reserve your seat</p>
                <div className="lp2-price-row">
                  <span className="lp2-price">₹{d.price}</span>
                  {d.origPrice && <span className="lp2-price-orig">₹{d.origPrice}</span>}
                </div>

                {/* Real Amplifeed OTP form — verifies the email and captures the lead in the
                    CRM, then routes to checkout once Amplifeed confirms the submission. */}
                <AmplifeedOtpForm
                  fields="name,email,phone,city"
                  verifyLabel="Verify to register"
                  onSuccess={(lead) => navigate('/checkout', {
                    state: { workshop: heading, price: d.price, name: lead.name, email: lead.email, phone: lead.phone },
                  })}
                />
              </>
            )}
          </div>

          {/* AI Aptitude Test promo */}
          <div className="lp2-apt-card">
            <p className="lp2-apt-eyebrow">Not sure where to start?</p>
            <p className="lp2-apt-title">Check out our AI Aptitude Test</p>
            <p className="lp2-apt-desc">Find your AI fluency in 15 minutes for free.<br />15 questions, One AI pathway and no sign-up</p>
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
