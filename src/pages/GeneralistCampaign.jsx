import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Reveal from '../components/common/Reveal';
import AccredSection from '../components/common/AccredSection';
import ToolStack from '../components/common/ToolStack';
import MentorsRail from '../components/common/MentorsRail';
import HiringRail from '../components/common/HiringRail';
import { HIRING_COMPANIES } from '../data/hiringCompanies';
import { visibleRaf } from '../lib/visibleRaf';
import Seo from '../components/common/Seo';
import PricingCard from '../components/common/PricingCard';
import { useToast } from '../components/common/Toast';
import { verifyAndDownloadBrochure } from '../lib/brochure';
import { verifySmsOtp, verifyEmailOtp } from '../lib/amplifeedOtp';
import { COUNTRY_CODES } from '../data/countryCodes';
import { submitLead } from '../services/leadService';
import '../styles/generalist-campaign.css';

// ── /campaign/ai-claude-generalist — ad landing page for the Generalist ──
// Chrome-free (no global nav/footer), noindex, mobile-first: ad traffic is
// overwhelmingly on phones; desktop is a widened variant of the same layout.
//
// Order: hero → numbers → accreditation → who it's for → the six-week rail →
// toolstack → mentors → hiring associations → apply. Every band uses the
// shared .gcamp-sec / .gcamp-head shell from the stylesheet so the page keeps
// one rhythm, and a sticky CTA follows the reader once the hero scrolls away.

// Hero art: Deepak (left) and Sridevi (right) framing the Claude mark and the
// fellowship's domain tags — the domains "Transform your domain." refers to.
// Inline SVG so the composition scales as one unit on any phone width.
// The "Master Claude AI." message lives BELOW this card as real HTML text.
const HERO_DOMAINS = [
  { t: 'Marketing', w: 78, r: -3, dx: -8 },
  { t: 'Finance', w: 68, r: 2.5, dx: 10 },
  { t: 'Product', w: 68, r: -2, dx: -6 },
  { t: 'Analyst', w: 64, r: 3, dx: 9 },
  { t: "Founder's Office", w: 104, r: -2.5, dx: 0 },
];

function HeroArt() {
  return (
    <svg
      className="gcamp-heroart"
      viewBox="0 0 360 224"
      role="img"
      aria-label="Mentors Deepak and Sridevi with Claude AI and the fellowship domains: Marketing, Finance, Product, Analyst, Founder's Office"
    >
      <defs>
        <clipPath id="gcamp-ph-l">
          <rect x="14" y="16" width="102" height="156" rx="16" />
        </clipPath>
        <clipPath id="gcamp-ph-r">
          <rect x="244" y="16" width="102" height="156" rx="16" />
        </clipPath>
        <linearGradient id="gcamp-card-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EEEDFE" />
          <stop offset="1" stopColor="#F8F7FE" />
        </linearGradient>
      </defs>

      {/* Card */}
      <rect x="0" y="0" width="360" height="224" rx="22" fill="url(#gcamp-card-bg)" />
      <rect x="0.75" y="0.75" width="358.5" height="222.5" rx="21.25" fill="none" stroke="#AFA9EC" strokeOpacity="0.4" strokeWidth="1.5" />

      {/* Left mentor — Deepak */}
      <image
        href="/mentors/Deepak.webp"
        x="14" y="16" width="102" height="156"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#gcamp-ph-l)"
      />
      <rect x="14" y="16" width="102" height="156" rx="16" fill="none" stroke="#AFA9EC" strokeWidth="1.5" />
      <text x="65" y="196" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="12" fontWeight="600" fill="#26215C">Deepak</text>
      <text x="65" y="210" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9.5" fill="#888780">Mentor</text>

      {/* Right mentor — Sridevi */}
      <image
        href="/mentors/sridevi.png"
        x="244" y="16" width="102" height="156"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#gcamp-ph-r)"
      />
      <rect x="244" y="16" width="102" height="156" rx="16" fill="none" stroke="#AFA9EC" strokeWidth="1.5" />
      <text x="295" y="196" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="12" fontWeight="600" fill="#26215C">Sridevi</text>
      <text x="295" y="210" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9.5" fill="#888780">Mentor</text>

      {/* Centre column — Claude mark over the specialisation domains */}
      <image href="/logos/claude.svg" x="164" y="26" width="32" height="32" />
      <text x="180" y="76" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fontWeight="700" letterSpacing="1.2" fill="#534AB7">CLAUDE AI</text>
      {HERO_DOMAINS.map((d, i) => (
        <g key={d.t} transform={`translate(${180 + d.dx} ${102 + i * 26}) rotate(${d.r})`}>
          <rect x={-d.w / 2} y="-11" width={d.w} height="22" rx="11" fill={i % 2 ? '#26215C' : '#ffffff'} stroke="#AFA9EC" strokeOpacity={i % 2 ? 0 : 0.7} strokeWidth="1" />
          <text x="0" y="3.5" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10.5" fontWeight="600" fill={i % 2 ? '#F1EFE8' : '#26215C'}>{d.t}</text>
        </g>
      ))}
    </svg>
  );
}

// Numbers band under the hero — dark strip, serif numerals. Labels are split
// into two fixed lines so all five stats share the same shape/baseline.
const STATS = [
  { n: '90%', l1: 'Interview', l2: 'Pipeline Target' },
  { n: '25+', l1: 'Hiring', l2: 'Associations' },
  { n: '20+', l1: 'AI Builders', l2: '& Operators' },
  { n: '6', l1: 'Weeks Intensive', l2: 'Fellowship' },
  { n: '6+', l1: 'Domain', l2: 'Tracks' },
];

// Plan card — the /generalist pricing card, restated for the 6-week cohort and
// shown WITHOUT a price (admissions quotes it on the call).
const PLAN = {
  pill: 'Flagship Programme',
  name: 'AI Generalist Fellowship',
  tagline: '6 weeks · 30 live hours — build a full Claude OS, ship real projects, and earn a Specialist certificate.',
  features: [
    ['30 hrs live instruction over 6 weeks', 'Instructor led · real questions in real time'],
    ['Build live projects with mentors', 'Portfolio ready deliverables every week'],
    ['LMS + community · 1-year access', 'Recordings, resources, and cohort community'],
    ['1:1 doubt-solving sessions', 'Direct mentor access · no question left behind'],
    ['Interview pipeline + placement support', "LinkedIn review · Menler's hiring network"],
    ['Claude Specialist Certification', 'Menler-certified · LinkedIn shareable'],
  ],
  chips: [
    { label: 'Duration', value: '6 Weeks' },
    { label: 'Live hours', value: '30 hrs' },
    { label: 'Sessions', value: '18 Live' },
    { label: 'Format', value: 'Live online' },
  ],
};

// Hero fact pills.
const FACTS = ['6 weeks', 'Live online', 'Mentor-led', 'Certified'];

// "Who this is for" — audience cards with tinted number badges.
const AUDIENCE = [
  { n: 1, t: 'Students', d: 'Any discipline. Enter the job market as AI Native.', bg: '#E6E3F9', fg: '#534AB7' },
  { n: 2, t: 'Professionals', d: 'Tech & non tech. Lead AI in your current role.', bg: '#F7E8C9', fg: '#BA7517' },
  { n: 3, t: 'Business owners', d: 'Use Claude to run your business smarter.', bg: '#F9DFDF', fg: '#B0484F' },
  { n: 4, t: 'Founders', d: 'Build with Claude without an engineering team.', bg: '#DCF0E7', fg: '#1D9E75' },
];

// ── The 6-week curriculum — one card per week, lesson plans verbatim from the
// Generalist syllabus. Cards stay OPEN (no accordion); the rail below moves
// them sideways as the page scrolls, so six weeks cost far less page height.
//
// Projects are phase-level on the /generalist page, so every week in a phase
// lists that phase's two projects — weeks 1–3 share one pair, weeks 4–6 the
// other. That also keeps all six cards the same shape.
const PHASE_1_PROJECTS = [
  'Project 1 : My Claude OS (configured workspace)',
  'Project 2 : AI Media Kit (images, video, audio, deck)',
];
const PHASE_2_PROJECTS = [
  'Project 3 : My Automated AI System (voice + automation)',
  'Project 4 : Ship It capstone (live app or agent)',
];
const WEEKS = [
  {
    n: 'Week 1', phase: 'Phase 1 · AI Foundations & Claude Mastery',
    t: 'Understand AI: See the Landscape Clearly',
    lessons: [
      'How LLMs work: next token prediction, tokens, parameters, RLHF',
      'Key terms: context windows, embeddings, temperature, fine tuning',
      'Live 3-way comparison: Claude vs ChatGPT vs Gemini',
      'The 6 Gen AI categories text, image, video, audio, code, agents',
      'Tool landscape & why Claude leads for generalists',
    ],
    projects: PHASE_1_PROJECTS,
  },
  {
    n: 'Week 2', phase: 'Phase 1 · AI Foundations & Claude Mastery',
    t: 'Talk with AI: Claude Mastery',
    lessons: [
      'Claude Projects, Skills, Connectors, MCPs & APIs',
      'System prompt architecture & best practices',
      'Claude Chat vs Cowork vs Code live comparison',
      'Schedules, Plugins & Routines',
      'Claude for PowerPoint, Word & Excel; Notion as external memory',
    ],
    projects: PHASE_1_PROJECTS,
  },
  {
    n: 'Week 3', phase: 'Phase 1 · AI Foundations & Claude Mastery',
    t: 'Think + Create with AI: Prompt Engineering & Creative Studio',
    lessons: [
      '16 prompt frameworks (Zero/Few-shot, CoT, ToT, RAG, chaining…)',
      'Claude Skills as prompt libraries; Routines for chained sequences',
      'How diffusion models work; image prompt architecture',
      'AI video, voice (STT/TTS/cloning) & 3D with Claude',
    ],
    projects: PHASE_1_PROJECTS,
  },
  {
    n: 'Week 4', phase: 'Phase 2 · Automate, Build & Ship',
    t: 'Automate with AI: Voice Agents, Routines & Workflows',
    lessons: [
      'STT/TTS from scratch; voice cloning',
      'Voice-agent deployment (VAPI, Bland, Retell)',
      'Claude Routines + MCPs; the agent loop',
      'N8N architecture; Claude as the intelligence node; Make & Zapier',
    ],
    projects: PHASE_2_PROJECTS,
  },
  {
    n: 'Week 5', phase: 'Phase 2 · Automate, Build & Ship',
    t: 'Build with AI: Vibecoding & Agentic App Development',
    lessons: [
      'How code generation differs from text',
      'Vibecoding: describe → generate → test → iterate → ship',
      'Claude Code, Cursor, Lovable, Bolt.new & Replit',
      'Agentic apps: Claude API + MCP tool calls; capstone scoping',
    ],
    projects: PHASE_2_PROJECTS,
  },
  {
    n: 'Week 6', phase: 'Phase 2 · Automate, Build & Ship',
    t: 'AI Native: Ship It — Demo Day',
    lessons: [
      'Capstone build sprint on the full Claude stack',
      'Product polish: UX, error handling, MCP reliability',
      'Gamma deck + presentation coaching',
      'Demo Day & AI Generalist certification',
    ],
    projects: PHASE_2_PROJECTS,
  },
];

// Each week gets one screen; the first screen is the pin itself, so the
// section reserves 100vh + one TRAVEL_VH block per hand-off after it.
const TRAVEL_VH = 70;

/**
 * Curriculum rail — the six week cards sit side by side and the page's VERTICAL
 * scroll drives them HORIZONTALLY: the section pins while the track slides
 * left, so six weeks cost far less page height than six stacked cards.
 *
 * Reduced-motion (and any browser where the pin can't run) falls back to a
 * plain swipeable, scroll-snapping row — same content, no hijacked scrolling.
 */
function CurriculumRail() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const n = WEEKS.length;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setPinned(true);
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let last = -1;
    return visibleRaf(wrap, () => {
      const rect = wrap.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      // 0 → first week fully in view, 1 → last week fully in view.
      const p = Math.min(1, Math.max(0, -rect.top / travel));
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      track.style.transform = `translate3d(-${(p * (n - 1) * 100) / n}%, 0, 0)`;
      setActive(Math.round(p * (n - 1)));
    });
  }, [n]);

  return (
    <section
      className={`gcamp-curric${pinned ? ' is-pinned' : ''}`}
      ref={wrapRef}
      style={pinned ? { height: `calc(100vh + ${(n - 1) * TRAVEL_VH}vh)` } : undefined}
      aria-label="The 6-week curriculum"
    >
      <div className="gcamp-curric-sticky">
        <div className="gcamp-curric-head">
          <p className="gcamp-eyebrow">The curriculum</p>
          <h2 className="gcamp-h2">Six weeks. <em>Six builds.</em></h2>
          <p className="gcamp-curric-count">
            {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </p>
        </div>

        <div className="gcamp-curric-track" ref={trackRef} style={{ width: `${n * 100}%` }}>
          {WEEKS.map((w) => (
            <article className="gcamp-wcard" key={w.n} style={{ width: `${100 / n}%` }}>
              <div className="gcamp-wcard-in">
                <div className="gcamp-wcard-top">
                  <span className="gcamp-wcard-n">{w.n}</span>
                  <span className="gcamp-wcard-phase">{w.phase}</span>
                </div>
                <h3 className="gcamp-wcard-t">{w.t}</h3>

                <p className="gcamp-wcard-h">Lesson plan</p>
                <ul className="gcamp-wcard-list">
                  {w.lessons.map((l) => <li key={l}>{l}</li>)}
                </ul>

                {w.projects && (
                  <>
                    <p className="gcamp-wcard-h">
                      {w.projects.length > 1 ? "Projects you'll build" : "Project you'll build"}
                    </p>
                    <ul className="gcamp-wcard-list gcamp-wcard-list--proj">
                      {w.projects.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="gcamp-curric-dots" aria-hidden="true">
          {WEEKS.map((w, i) => (
            <span className={`gcamp-dot${i === active ? ' is-on' : ''}`} key={w.n} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Curriculum download — verifies the email by OTP, hands over the brochure PDF
 * as an on-site download, and records the lead in the background. Same helper
 * the /generalist page uses, so the file and CRM fields stay in one place.
 */
function CurriculumDownload() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyAndDownloadBrochure({
        email: email.trim(),
        program: 'generalist',
        resource: 'Generalist Fellowship Curriculum',
        source: 'campaign-ai-claude-generalist',
        cta_label: 'Download curriculum',
        section: 'Curriculum',
      });
      setDone(true);
      toast.success('Curriculum downloaded — check your downloads folder.');
    } catch {
      toast.error("Couldn't send that just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="gcamp-sec gcamp-dl">
      <Reveal className="gcamp-dl-card">
        <div className="gcamp-dl-txt">
          <p className="gcamp-eyebrow">Full syllabus</p>
          <h2 className="gcamp-h2">Take the curriculum with you.</h2>
          <p className="gcamp-sub">
            Every week, lesson and build in one PDF — including the domain
            tracks, tools and certification details.
          </p>
        </div>

        {done ? (
          <p className="gcamp-dl-done">
            Sent — your curriculum PDF has been downloaded.
          </p>
        ) : (
          <form className="gcamp-dl-form" onSubmit={handleSubmit}>
            <input
              required
              type="email"
              aria-label="Email address"
              placeholder="Your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="gcamp-cta" disabled={loading}>
              {loading ? 'Verifying…' : 'Download curriculum'}
            </button>
            <p className="gcamp-dl-note">PDF · no spam, we verify your email once.</p>
          </form>
        )}
      </Reveal>
    </section>
  );
}

/**
 * Apply form — verifies the email by OTP, records the lead, then hands the
 * visitor somewhere useful instead of a dead end: upcoming events and the
 * resource library, both open to them while admissions gets in touch.
 */
/* The form, in a dialog over the page.
 *
 * Escape and a click on the backdrop close it, and the page behind stays put
 * while it is open. body{overflow:hidden} alone is not enough on this site —
 * Lenis drives scrolling from wheel events and keeps going regardless, so it
 * has to be stopped explicitly, and the panel carries data-lenis-prevent so
 * the wheel still reaches its own scrollbar. */
function ApplyModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [onClose]);

  return (
    <div className="gcamp-modal-back" onClick={onClose} role="presentation" data-lenis-prevent>
      <div
        className="gcamp-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Apply for the AI Generalist Fellowship"
      >
        <button type="button" className="gcamp-modal-x" onClick={onClose} aria-label="Close">×</button>
        <ApplyForm />
      </div>
    </div>
  );
}

/* Admissions form → one-time code → thank-you.
 *
 * The code goes by SMS to Indian numbers and by email to everyone else. That
 * split is not a preference: the SMS gateway only delivers to +91, so an
 * international applicant sending themselves an SMS code would wait for one
 * that never arrives. Email reaches all of them, which is why the address is
 * required rather than optional. */
function ApplyForm() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', countryCode: '+91', phone: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const indian = form.countryCode === '+91';
  const minLen = indian ? 10 : 8;

  const onPhone = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, indian ? 10 : 15);
    set('phone', digits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.phone.length < minLen) {
      setErr(`Enter a valid ${indian ? '10-digit ' : ''}phone number.`);
      return;
    }
    setLoading(true);
    try {
      const digits = `${form.countryCode}${form.phone}`.replace(/\D/g, '');
      const otp = indian
        ? await verifySmsOtp(digits)
        : await verifyEmailOtp(form.email.trim());
      await submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: `${form.countryCode} ${form.phone}`,
        program: 'Claude AI Generalist',
        ...otp,
        source: 'campaign-ai-claude-generalist',
        cta_label: 'Apply Now',
        section: 'Campaign apply',
      });
      setDone(true);
      toast.success("You're verified — our admissions team will call you shortly.");
    } catch (e2) {
      setErr(e2?.message || "Couldn't verify that just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="gcamp-done">
        <span className="gcamp-done-tick" aria-hidden="true">✓</span>
        <p className="gcamp-done-t">You're on the list.</p>
        <p className="gcamp-done-d">
          Admissions will call you shortly. Until then, these are already open
          to you.
        </p>
        <div className="gcamp-done-links">
          <Link className="gcamp-cta gcamp-cta--light" to="/events">Upcoming events</Link>
          <Link className="gcamp-cta gcamp-cta--light" to="/resources">Resource library</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="gcamp-formcard-t">Request a callback</p>
      <p className="gcamp-formcard-d">Takes under a minute.</p>
      <form className="gcamp-applyform" onSubmit={handleSubmit}>
        <input
          required
          type="text"
          aria-label="Full name"
          placeholder="Full name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          disabled={loading}
        />
        <input
          required
          type="email"
          aria-label="Email address"
          placeholder="Email address"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          disabled={loading}
        />
        <div className="gcamp-phonerow">
          <select
            className="gcamp-dial"
            aria-label="Country code"
            value={form.countryCode}
            onChange={(e) => { set('countryCode', e.target.value); set('phone', ''); }}
            disabled={loading}
          >
            {COUNTRY_CODES.map(({ code, label }) => (
              <option key={label} value={code}>{label}</option>
            ))}
          </select>
          <input
            required
            type="tel"
            inputMode="numeric"
            aria-label="Phone number"
            placeholder={indian ? '10-digit mobile' : 'Phone number'}
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => onPhone(e.target.value)}
            disabled={loading}
          />
        </div>
        {/* Said before they submit, not after — someone abroad who expects an
            SMS will otherwise sit waiting for one that cannot arrive. */}
        <p className="gcamp-formnote gcamp-formnote--tight">
          {indian
            ? "We'll text a one-time code to this number."
            : "We'll email your one-time code — SMS only works for Indian numbers."}
        </p>
        {err && <p className="gcamp-formerr">{err}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying…' : 'Apply Now'}
        </button>
      </form>
      <p className="gcamp-formnote">
        We'll only contact you about this fellowship. No spam, ever.
      </p>
    </>
  );
}

export default function GeneralistCampaign() {
  const heroRef = useRef(null);
  const [showBar, setShowBar] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  // The sticky CTA only appears once the hero (and its own button) is gone.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([e]) => setShowBar(!e.isIntersecting),
      { rootMargin: '-70px 0px 0px 0px' },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const openApply = () => setApplyOpen(true);

  return (
    <div className="gcamp">
      <Seo
        title="Claude AI Generalist Fellowship | Menler"
        description="Master Claude AI. Transform your domain. The Menler AI Generalist Fellowship — six weeks, live and mentor-led."
        noindex
      />

      <header className="gcamp-top">
        <MenlerWordmark />
        <span className="gcamp-top-tag">
          <span className="gcamp-top-dot" aria-hidden="true" />
          Admissions open
        </span>
      </header>

      <section className="gcamp-hero" ref={heroRef}>
        <Reveal>
          <span className="gcamp-badge">Flagship fellowship</span>
          <h1 className="gcamp-title">
            Claude AI <em>Generalist</em> Fellowship
          </h1>
        </Reveal>

        <Reveal delay={80}><HeroArt /></Reveal>

        <Reveal delay={140}>
          <p className="gcamp-master">
            Master <em>Claude AI.</em>
            <span>Transform your domain.</span>
          </p>

          <div className="gcamp-facts">
            {FACTS.map((f) => <span className="gcamp-fact" key={f}>{f}</span>)}
          </div>

          <button type="button" className="gcamp-cta" onClick={openApply}>
            Apply Now
          </button>
          <p className="gcamp-cta-note">Limited seats · Talk to admissions first</p>
        </Reveal>
      </section>

      <section className="gcamp-stats" aria-label="Programme numbers">
        <div className="gcamp-stats-row">
          {STATS.map((s) => (
            <div className="gcamp-stat" key={s.l1}>
              <span className="gcamp-stat-n">{s.n}</span>
              <span className="gcamp-stat-l">{s.l1}<br />{s.l2}</span>
            </div>
          ))}
        </div>
      </section>

      <AccredSection marquee />

      <section className="gcamp-sec gcamp-sec--parchment">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">Who this is for</p>
          <h2 className="gcamp-h2">
            Any background.
            <em>Any domain. Zero code.</em>
          </h2>
          <p className="gcamp-sub">
            The AI Native workforce won't be made up of engineers alone.
            It will be built by professionals across every domain.
          </p>
        </Reveal>
        <div className="gcamp-who-grid">
          {AUDIENCE.map((a, i) => (
            <Reveal className="gcamp-who-card" key={a.t} delay={i * 70}>
              <span className="gcamp-who-num" style={{ background: a.bg, color: a.fg }}>{a.n}</span>
              <div>
                <h3 className="gcamp-who-t">{a.t}</h3>
                <p className="gcamp-who-d">{a.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CurriculumRail />

      <CurriculumDownload />

      <ToolStack sub="Get hands on with every tool in the fellowship — from your first prompt to your first shipped build." />

      <MentorsRail />

      <section className="gcamp-hiring">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">Where our fellows land</p>
          <h2 className="gcamp-h2">Hiring associations.</h2>
          <p className="gcamp-sub">
            Founder's offices, VC-backed startups, agencies and AI-native teams
            actively hiring people who can operate with AI.
          </p>
        </Reveal>
        <div className="partners-strip">
          <p className="partners-label">Hiring associations · 25+ companies</p>
          <HiringRail companies={HIRING_COMPANIES} rows={2} />
        </div>
      </section>

      <section className="gcamp-sec gcamp-plan">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">What's included</p>
          <h2 className="gcamp-h2">One fellowship. <em>Everything in it.</em></h2>
        </Reveal>
        <Reveal delay={80}>
          <PricingCard {...PLAN} ctaLabel="Apply Now" onCta={openApply} />
        </Reveal>
      </section>

      {applyOpen && <ApplyModal onClose={() => setApplyOpen(false)} />}

      <footer className="gcamp-foot">
        <MenlerWordmark theme="dark" size={20} />
        <div className="gcamp-foot-links">
          <Link to="/policy/privacy">Privacy</Link>
          <Link to="/policy/terms">Terms</Link>
          <Link to="/policy/refund">Refunds</Link>
        </div>
        <p className="gcamp-foot-copy">
          © {new Date().getFullYear()} Menler · An initiative by Meridian Edutech
        </p>
      </footer>

      <div className={`gcamp-bar${showBar ? ' is-on' : ''}`}>
        <div className="gcamp-bar-txt">
          <p className="gcamp-bar-t">Claude AI Generalist</p>
          <p className="gcamp-bar-d">6 weeks · Live · Limited seats</p>
        </div>
        <button type="button" className="gcamp-cta" onClick={openApply}>
          Apply Now
        </button>
      </div>
    </div>
  );
}
