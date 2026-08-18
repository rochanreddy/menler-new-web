import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Reveal from '../components/common/Reveal';
import AccredSection from '../components/common/AccredSection';
import ToolStack from '../components/common/ToolStack';
import MentorsRail from '../components/common/MentorsRail';
import HiringRail from '../components/common/HiringRail';
import { HIRING_COMPANIES } from '../data/hiringCompanies';
import Seo from '../components/common/Seo';
import PricingCard from '../components/common/PricingCard';
import CampaignRail from '../components/campaign/CampaignRail';
import CampaignDownload from '../components/campaign/CampaignDownload';
import ApplyModal, { ThankYou } from '../components/campaign/CampaignApply';
import '../styles/campaign-landing.css';

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

export default function GeneralistCampaign() {
  const heroRef = useRef(null);
  const [showBar, setShowBar] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  // Set once the application is verified; the confirmation screen replaces the
  // landing page from then on.
  const [applicant, setApplicant] = useState(null);

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

  if (applicant) {
    return (
      <ThankYou
        applicant={applicant}
        programTitle="Claude AI Generalist Fellowship"
        followUp="walk you through the six weeks"
      />
    );
  }

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

      <CampaignRail
        eyebrow="The curriculum"
        title={<>Six weeks. <em>Six builds.</em></>}
        cards={WEEKS}
        label="The 6-week curriculum"
      />

      <CampaignDownload
        program="generalist"
        resource="Generalist Fellowship Curriculum"
        source="campaign-ai-claude-generalist"
        sub="Every week, lesson and build in one PDF — including the domain tracks, tools and certification details."
      />

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

      {applyOpen && (
        <ApplyModal
          onClose={() => setApplyOpen(false)}
          onDone={setApplicant}
          program="Claude AI Generalist"
          source="campaign-ai-claude-generalist"
          label="Apply for the AI Generalist Fellowship"
          noteProgram="fellowship"
        />
      )}

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
