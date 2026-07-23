import { useState, useLayoutEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Seo from '../components/common/Seo';
import MenlerCommunitySection from '../components/common/MenlerCommunitySection';
import { MENLER_WHATSAPP_URL } from '../data/communityLinks';
import { submitLead } from '../services/leadService';
import { useContentState } from '../lib/useContent';
import { verifyWhatsappOtp } from '../lib/amplifeedOtp';

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
  subtitle: 'A hands-on masterclass where you go from zero to a working AI agent — no coding, no jargon. Walk away with something real you built yourself.',
  date: 'Saturday, 25 July 2026',
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
  { t: 'Masterclass recording', d: 'Rewatch anytime, follow at your own pace.' },
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
  bannerTitleSize: '', // px cap for the big title on desktop; blank = default (46)
  showClaudeLogo: false,
  showTrustBar: false,
  bannerTagline: WORKSHOP.banner.tagline,
  subtitle: WORKSHOP.subtitle,
  date: WORKSHOP.date,
  time: WORKSHOP.time,
  eventStart: '', // set per-campaign in Sanity; otherwise derived from date/time
  eventEnd: '',
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
  founderName: 'Sachin Roy',
  founderRole: 'Founder, Menler',
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
  bannerBadge, bannerLine1, bannerLine2, bannerTitleSize, showClaudeLogo, showTrustBar, bannerTagline, subtitle,
  date, time, eventStart, eventEnd, format, price, origPrice, seatsNote,
  themeAccent, themeAccentDark, bannerFrom, bannerTo, highlightBg, highlightText,
  mentorName, mentorRole, "mentorPhoto": mentorPhoto.asset->url, mentorBio, mentorCreds,
  founderName, founderRole,
  learn[]{title, detail}, forYou, get[]{title, detail},
  "certificateImage": certificateImage.asset->url, certificateNote, whatsappUrl, discordUrl, facebookUrl, whatsappText, communityText
}`;

const has = (v) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0);

// Serve right-sized, auto-format (WebP/AVIF) images from Sanity's CDN instead of
// the full-res originals — a big LCP + bandwidth win, especially on mobile.
const optImg = (url, w) => (url && url.includes('cdn.sanity.io') ? `${url}${url.includes('?') ? '&' : '?'}w=${w}&auto=format&q=72&fit=max` : url);

// Company logos shown under the registration form, per campaign (loaded by
// domain via BrandLogo — no local asset needed).
// Sridevi Edupuganti's credentials: Ex-Microsoft · IIT-G · ISB. Shown both in
// the banner (small, under the mentor credit) and in the strip under the form.
const SRIDEVI_CREDS = [
  { name: 'Microsoft', logo: '/logos/microsoft.png' },
  { name: 'IIT Guwahati', logo: '/logos/iitg.png' },
  { name: 'ISB', logo: '/logos/isb.png' },
];

// Logos shown in the strip UNDER the registration form (see .lp2-logostrip).
const CAMPAIGN_LOGOS = {
  'turn-messy-data-into-clear-decisions-with-claude': [
    { name: 'Zendesk', logo: '/logos/Zendesk.png' },
    { name: 'Nutanix', logo: '/logos/nutanix.png' },
    { name: 'LeadSquared', logo: '/logos/lead_squared_new.png' },
  ],
  'build-your-portfolio-with-claude': SRIDEVI_CREDS,
  // The three brands this campaign's mentor operates growth for. Colour marks,
  // so they need the white chip background (not the navy trust bar, which is
  // for white/monochrome wordmarks only).
  'turn-ai-into-your-career-advantage': [
    { name: 'Alkemmy', logo: '/logos/alkemmy.png' },
    { name: 'Brand For You', logo: '/logos/brand_for_you.png' },
    { name: 'AstroNext', logo: '/logos/AstroNext.png' },
  ],
};

// Small credential marks shown IN THE BANNER under the mentor credit. Sized
// separately (see .lp2-banner-creds) from the form strip, which is why this
// is its own map — turn-messy shows its logos only under the form, not here.
const BANNER_CRED_LOGOS = {
  'build-your-portfolio-with-claude': SRIDEVI_CREDS,
};

// One chip in the strip under the form. If the logo file is missing the chip
// removes itself rather than leaving a broken-image icon on a live campaign.
function LogoChip({ name, logo }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <span className="lp2-logochip">
      <img src={logo} alt={name} loading="lazy" onError={() => setFailed(true)} />
    </span>
  );
}

// Auto-fit the big banner title: shrink the font until each highlighted line
// fits on a single line within its box. The CSS size (incl. any Sanity cap)
// is the MAX; this only scales down when a line would otherwise wrap/overflow.
// Re-runs on content change, resize, and once web fonts finish loading.
function useAutoFitTitle(deps) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const fit = () => {
      el.style.fontSize = ''; // reset to the CSS/Sanity size, then measure
      const base = parseFloat(getComputedStyle(el).fontSize) || 40;
      const avail = el.clientWidth;
      let widest = 0;
      el.querySelectorAll('mark').forEach((m) => { widest = Math.max(widest, m.scrollWidth); });
      if (avail > 0 && widest > avail) {
        el.style.fontSize = `${Math.max(18, Math.floor(base * (avail / widest)))}px`;
      }
    };
    const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); };
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(() => {});
    let ro;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(run); ro.observe(el); }
    window.addEventListener('resize', run);
    return () => { cancelAnimationFrame(raf); if (ro) ro.disconnect(); window.removeEventListener('resize', run); };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

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
  const { data: c, loading: contentLoading } = useContentState(CAMPAIGN_QUERY, FALLBACK, { slug: activeSlug });
  const d = {};
  for (const k of Object.keys(FALLBACK)) d[k] = has(c?.[k]) ? c[k] : FALLBACK[k];
  const heading = `${d.bannerLine1} ${d.bannerLine2}`.trim();
  const num = (i) => String(i + 1).padStart(2, '0');

  // Claude logo beside the title + trust bar under the form — Sanity-controlled,
  // and on by default for the Build-with-Claude campaign.
  const showClaudeLogo = d.showClaudeLogo || activeSlug === 'build-with-claude';
  const showTrustBar = d.showTrustBar || ['claude-mastery-for-ai-native-careers', 'build-with-claude'].includes(activeSlug);

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
  // Optional per-campaign cap for the big banner title (px). Lower it if the
  // title wraps to too many lines. Accepts "40" or "40px".
  if (has(d.bannerTitleSize)) themeStyle['--banner-title-max'] = /px$/.test(String(d.bannerTitleSize)) ? d.bannerTitleSize : `${d.bannerTitleSize}px`;

  // Auto-shrink the title so each line fits its box (below the Sanity cap).
  const titleRef = useAutoFitTitle([d.bannerLine1, d.bannerLine2, d.bannerTitleSize, showClaudeLogo, contentLoading]);
  const campaignLogos = CAMPAIGN_LOGOS[activeSlug];
  const bannerCredLogos = BANNER_CRED_LOGOS[activeSlug];

  // Validate → verify the phone via WhatsApp OTP (Amplifeed/MSG91 shows its own
  // code-entry UI) → submit the lead → go straight to checkout.
  const register = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.city.trim() || !form.background) {
      setErr('Please fill in all fields before verifying.');
      return;
    }
    if (form.phone.length < phoneMinLen) {
      setErr(`Phone number must be at least ${phoneMinLen} digits.`);
      return;
    }
    setErr(null);
    setOtpBusy(true);
    try {
      const phone = `${form.countryCode} ${form.phone}`;
      // WhatsApp OTP identifier: country code + number in E.164 (no spaces).
      const phoneE164 = `${form.countryCode}${form.phone}`.replace(/[^\d+]/g, '');
      const otp = await verifyWhatsappOtp(phoneE164);
      setOtpBusy(false);
      setBusy(true);
      const created = await submitLead({
        name: form.name, email: form.email, phone,
        city: form.city, background: form.background,
        ...otp,
        source: 'campaign-workshop', campaign: activeSlug, workshop: heading,
        cta_label: `Register: ${heading}`, section: `Campaign · ${activeSlug}`,
      });
      navigate('/checkout', {
        state: {
          leadId: created?.id,
          workshop: heading,
          eventStart: d.eventStart,
          eventEnd: d.eventEnd,
          eventDate: d.date,
          eventTime: d.time,
          price: d.price,
          name: form.name,
          email: form.email,
          phone,
          city: form.city,
          background: form.background,
          campaign: activeSlug,
          whatsappUrl: d.whatsappUrl,
          whatsappText: d.whatsappText,
          communityText: d.communityText,
        },
      });
    } catch (e2) {
      setOtpBusy(false);
      setBusy(false);
      setErr(e2?.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="lp2" style={themeStyle}>
      <Seo title={`${heading} | Menler Masterclass`} description={d.subtitle} noindex />

      {/* Minimal top bar */}
      <header className="lp2-top">
        <MenlerWordmark size={26} theme="light" />
        <span className="lp2-top-tag"><span className="lp2-top-tag-dot" aria-hidden="true" />Live Masterclass</span>
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
              <h1 className="lp2-banner-title" ref={titleRef}>
                <mark>{d.bannerLine1}</mark>
                {showClaudeLogo ? (
                  <span className="lp2-banner-line2">
                    <mark>{d.bannerLine2}</mark>
                    <img src="/logos/claude.svg" alt="Claude" className="lp2-banner-claude" />
                  </span>
                ) : (
                  <mark>{d.bannerLine2}</mark>
                )}
              </h1>
              <p className="lp2-banner-tag">{d.bannerTagline}</p>
              <div className="lp2-banner-brand">
                {!contentLoading && <span className="lp2-banner-credit">By <b>{d.mentorName}</b> — {d.mentorRole}</span>}
              </div>
              {!contentLoading && bannerCredLogos && (
                <div className="lp2-banner-creds" aria-label={bannerCredLogos.map((l) => l.name).join(', ')}>
                  {bannerCredLogos.map((l) => (
                    <img key={l.name} src={l.logo} alt={l.name} decoding="async" />
                  ))}
                </div>
              )}
            </div>
            <div className="lp2-banner-photo">
              {contentLoading
                ? <div className="lp2-skel lp2-banner-photo-skel" aria-hidden="true" />
                : <img src={optImg(d.mentorPhoto, 820)} alt={d.mentorName} fetchpriority="high" decoding="async" />}
            </div>
            <div className="lp2-banner-strip">
              <span><b>{d.date}</b></span>
              <span className="lp2-strip-dot" />
              <span>{d.time}</span>
            </div>
          </section>

          {/* Mobile-only: registration CTA directly under the banner thumbnail. */}
          <a className="lp2-mobile-cta" href="#register">
            Reserve your seat
            <span className="lp2-mobile-cta-price">₹{d.price}{d.origPrice ? <s> ₹{d.origPrice}</s> : null}</span>
          </a>

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
                <img className="lp2-cert-img" src={optImg(d.certificateImage, 960)} alt="Sample Menler certificate" loading="lazy" decoding="async" />
              ) : (
                <div className="lp2-cert-mock">
                  <div className="lp2-cert-mock-top">
                    <MenlerWordmark size={24} theme="light" />
                    <span className="lp2-cert-seal">
                      <span className="lp2-cert-seal-star">★</span>
                      <span className="lp2-cert-seal-txt">MENLER<br />VERIFIED</span>
                    </span>
                  </div>
                  <p className="lp2-cert-mock-kicker">Certificate of Participation</p>
                  <p className="lp2-cert-mock-to">This is proudly presented to</p>
                  <p className="lp2-cert-mock-name">Your Name</p>
                  <span className="lp2-cert-rule" />
                  <p className="lp2-cert-mock-for">for successfully completing<br /><b>{heading}</b></p>
                  <div className="lp2-cert-foot">
                    <span className="lp2-cert-sign lp2-cert-sign--left">
                      <span className="lp2-cert-sign-name">{d.mentorName}</span>
                      <span className="lp2-cert-sign-role">{d.mentorRole}</span>
                    </span>
                    {has(d.founderName) && (
                      <span className="lp2-cert-sign">
                        <span className="lp2-cert-sign-name">{d.founderName}</span>
                        <span className="lp2-cert-sign-role">{d.founderRole}</span>
                      </span>
                    )}
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
              {contentLoading
                ? <div className="lp2-skel lp2-mentor-img lp2-mentor-img-skel" aria-hidden="true" />
                : <div className={`lp2-mentor-img mentor-${activeSlug}`} role="img" aria-label={d.mentorName} style={{ backgroundImage: `url("${optImg(d.mentorPhoto, 440)}")` }} />}
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

                {/* Our own form — real email OTP via Amplifeed/MSG91, lead saved to our
                    backend (admin + CRM), then straight to checkout. */}
                <form onSubmit={register}>
                  <input className="lp2-input" type="text" required placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} disabled={busy || otpBusy} />
                  <input className="lp2-input" type="email" required placeholder="Email address" value={form.email} onChange={(e) => set('email', e.target.value)} disabled={busy || otpBusy} />
                  <div className="lp2-phone-row">
                    <select
                      className="lp2-input lp2-country-code"
                      value={form.countryCode}
                      onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value, phone: '' }))}
                      disabled={busy || otpBusy}
                      aria-label="Country code"
                    >
                      {COUNTRY_CODES.map(({ code, label }) => (
                        <option key={code} value={code}>{label}</option>
                      ))}
                    </select>
                    <input
                      className="lp2-input lp2-phone-input"
                      type="tel"
                      required
                      placeholder="Phone number"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      disabled={busy || otpBusy}
                    />
                  </div>
                  <input className="lp2-input" type="text" required placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} disabled={busy || otpBusy} />
                  <select
                    className="lp2-input"
                    required
                    style={{ color: form.background ? 'var(--ink)' : 'rgba(38,33,92,0.45)' }}
                    value={form.background}
                    onChange={(e) => set('background', e.target.value)}
                    disabled={busy || otpBusy}
                  >
                    <option value="" disabled hidden>Select background...</option>
                    <option value="student">Student</option>
                    <option value="working professional (tech)">Working Professional (Tech)</option>
                    <option value="working professional (non-tech)">Working Professional (Non-Tech)</option>
                    <option value="graduate">Graduate</option>
                    <option value="business owner">Business Owner</option>
                  </select>
                  <button className="lp2-submit" type="submit" disabled={busy || otpBusy}>
                    {otpBusy ? 'Sending OTP…' : busy ? 'Registering…' : 'Verify to Register'}
                  </button>
                  {err && <p className="lp2-err">{typeof err === 'string' ? err : "Couldn't register — please try again."}</p>}
                </form>
              </>
            )}
          </div>

          {campaignLogos && (
            <div className="lp2-logostrip" aria-label={campaignLogos.map((l) => l.name).join(', ')}>
              {campaignLogos.map((l) => (
                <LogoChip key={l.name} name={l.name} logo={l.logo} />
              ))}
            </div>
          )}

          {/* Trust bar — only on the Claude Mastery campaign. Navy strip with
              the three wordmarks (McKinsey · MIT · UT Austin), reconstructed in
              markup so it needs no image asset. Swap in real logo files later
              by replacing each cell's content with an <img>. */}
          {showTrustBar && (
            <div className="lp2-trustbar" aria-label="Trusted by teams from McKinsey & Company, MIT, and The University of Texas at Austin">
              <span className="lp2-tb-cell lp2-tb-mck">McKinsey<br />&amp; Company</span>
              <span className="lp2-tb-cell lp2-tb-mit"><img src="/logos/mit-white.svg" alt="MIT" /></span>
              <span className="lp2-tb-cell lp2-tb-tex"><img src="/logos/ut-austin-white.svg" alt="The University of Texas at Austin" /></span>
            </div>
          )}
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
