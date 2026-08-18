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

// ── /campaign/ai-kickstarter — ad landing page for the Gen AI Kickstarter ──
// The same page as /campaign/ai-claude-generalist with different content: it
// shares the stylesheet and the rail / download / apply components, so a fix
// to one lands on both. Chrome-free, noindex, phone-first.
//
// Content comes from /kickstarter: the 14-day syllabus, the four modules, the
// hero numbers, the audiences and the pricing card (shown without a price).

// Hero art — the same composition as the Fellowship's: a mentor either side of
// the Claude mark, with the programme's own tags stacked down the middle. Here
// the tags are the Claude OS modules rather than the Fellowship's domains.
// Swap the two mentors by editing HERO_MENTORS.
const HERO_MENTORS = [
  { name: 'Deepak', img: '/mentors/Deepak.webp', x: 14, cx: 65, clip: 'kcamp-ph-l' },
  { name: 'Sridevi', img: '/mentors/sridevi.png', x: 244, cx: 295, clip: 'kcamp-ph-r' },
];

const HERO_MODULES = [
  { t: 'Foundations', w: 84, r: -3, dx: -8 },
  { t: 'Power Layers', w: 88, r: 2.5, dx: 10 },
  { t: 'Automation', w: 82, r: -2, dx: -6 },
  { t: 'Vibe Coding', w: 82, r: 3, dx: 9 },
  { t: 'Demo Day', w: 74, r: -2.5, dx: 0 },
];

function HeroArt() {
  return (
    <svg
      className="gcamp-heroart"
      viewBox="0 0 360 224"
      role="img"
      aria-label="Mentors Deepak and Sridevi with Claude OS and the Kickstarter modules: Foundations, Power Layers, Automation, Vibe Coding, Demo Day"
    >
      <defs>
        {HERO_MENTORS.map((m) => (
          <clipPath id={m.clip} key={m.clip}>
            <rect x={m.x} y="16" width="102" height="156" rx="16" />
          </clipPath>
        ))}
        <linearGradient id="kcamp-card-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EEEDFE" />
          <stop offset="1" stopColor="#F8F7FE" />
        </linearGradient>
      </defs>

      {/* Card */}
      <rect x="0" y="0" width="360" height="224" rx="22" fill="url(#kcamp-card-bg)" />
      <rect x="0.75" y="0.75" width="358.5" height="222.5" rx="21.25" fill="none" stroke="#AFA9EC" strokeOpacity="0.4" strokeWidth="1.5" />

      {/* A mentor either side */}
      {HERO_MENTORS.map((m) => (
        <g key={m.name}>
          <image
            href={m.img}
            x={m.x} y="16" width="102" height="156"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${m.clip})`}
          />
          <rect x={m.x} y="16" width="102" height="156" rx="16" fill="none" stroke="#AFA9EC" strokeWidth="1.5" />
          <text x={m.cx} y="196" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="12" fontWeight="600" fill="#26215C">{m.name}</text>
          <text x={m.cx} y="210" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="9.5" fill="#888780">Mentor</text>
        </g>
      ))}

      {/* Centre column — Claude mark over the Kickstarter modules */}
      <image href="/logos/claude.svg" x="164" y="26" width="32" height="32" />
      <text x="180" y="76" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fontWeight="700" letterSpacing="1.2" fill="#BA7517">CLAUDE OS</text>
      {HERO_MODULES.map((m, i) => (
        <g key={m.t} transform={`translate(${180 + m.dx} ${102 + i * 26}) rotate(${m.r})`}>
          <rect x={-m.w / 2} y="-11" width={m.w} height="22" rx="11" fill={i % 2 ? '#26215C' : '#ffffff'} stroke="#AFA9EC" strokeOpacity={i % 2 ? 0 : 0.7} strokeWidth="1" />
          <text x="0" y="3.5" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10.5" fontWeight="600" fill={i % 2 ? '#F1EFE8' : '#26215C'}>{m.t}</text>
        </g>
      ))}
    </svg>
  );
}

// Numbers band — the /kickstarter hero stats. Labels are split into two fixed
// lines so all five share the same shape and baseline.
const STATS = [
  { n: '14', l1: 'Days', l2: 'Of curriculum' },
  { n: '4', l1: 'Mini-builds', l2: 'You ship' },
  { n: '10+', l1: 'AI Tools', l2: 'Hands-on' },
  { n: '20+', l1: 'AI Builders', l2: '& Operators' },
  { n: '1', l1: 'Fluency', l2: 'Certificate' },
];

// Plan card — the /kickstarter pricing card, shown WITHOUT a price (admissions
// quotes it on the call), with the start date added as a fourth chip.
const PLAN = {
  pill: 'Entry Programme',
  name: 'AI Kickstarter',
  tagline: '4 live sessions across 2 weekends — build a real Claude OS and ship 4 portfolio projects.',
  features: [
    ['4 live sessions across 2 weekends', 'Sat + Sun · 2 hrs each · Bengaluru or online'],
    ['Claude OS hands-on build', 'Projects, Skills, Connectors, Routines — live'],
    ['4 portfolio deliverables', 'AI OS · Research System · Automation · Capstone'],
    ['Demo Day + peer review', 'Present live. Get feedback. Ship something real.'],
    ['Menler AI Kickstarter Certificate', 'LinkedIn-shareable proof of hands-on AI work'],
    ['AI resource library access', 'Prompt packs, templates, and tool guides'],
  ],
  chips: [
    { label: 'Duration', value: '2 Weekends' },
    { label: 'Sessions', value: '4 Live · 8 hrs' },
    { label: 'Format', value: 'Live online' },
    { label: 'Starts', value: 'August 30, 2026' },
  ],
};

// Hero fact pills.
const FACTS = ['14 days', '4 live sessions', 'Live online', 'No prerequisites'];

// "Who this is for" — the five /kickstarter audiences, with the same tints.
const AUDIENCE = [
  { n: 1, t: 'School students', d: 'Class 10–12 who want to be AI fluent before college.', bg: '#FAEEDA', fg: '#854F0B' },
  { n: 2, t: 'College students', d: 'Any discipline. Stand out at internships and placements.', bg: '#E6E3F9', fg: '#534AB7' },
  { n: 3, t: 'Professionals new to AI', d: 'Catch up fast. Without coding. Without overwhelm.', bg: '#DCF0E7', fg: '#1D9E75' },
  { n: 4, t: "Founders' AI hires", d: 'First AI person at a startup? Get the toolkit fast.', bg: '#F9DFDF', fg: '#B0484F' },
  { n: 5, t: 'Parents & educators', d: 'Be the AI guide for your kids and your classroom.', bg: '#EDECE6', fg: '#5F5E5A' },
];

// ── The syllabus — one card per module, lessons verbatim from /kickstarter.
// Four modules over two weekends: two live sessions each weekend.
const MODULES = [
  {
    n: 'Module 1', phase: 'Weekend 1 · Live',
    t: 'AI Foundations + Claude OS',
    lessons: [
      'The AI Landscape : what you actually need to know',
      'Claude OS : three interfaces, three use cases',
      'Prompting Fundamentals : the CLEAR framework',
      'AI Workflow Thinking : from task to system',
    ],
    projects: ['Build 1 : Personal AI Operating System'],
  },
  {
    n: 'Module 2', phase: 'Weekend 1 · Live',
    t: 'Claude Power Layers',
    lessons: [
      'Claude Skills : teaching Claude to behave differently',
      'Claude Connectors : Claude inside your existing tools',
      'Claude Projects : building a persistent intelligence system',
      'Research Intelligence : Claude + Perplexity + NotebookLM',
      'AI Creatives : image, audio & video generation',
    ],
    projects: ['Build 2 : Study planner agent', 'Build 3 : Content engine'],
  },
  {
    n: 'Module 3', phase: 'Weekend 2 · Live',
    t: 'Automation Systems',
    lessons: [
      'Claude Schedules : time-triggered intelligence',
      'Claude Routines : on-demand, repeatable workflows',
      'Claude for Data : upload, interrogate, act',
      'External Automation : Zapier, n8n & when to leave Claude',
    ],
    projects: ['Build 4 : Automation Suite'],
  },
  {
    n: 'Module 4', phase: 'Weekend 2 · Live',
    t: 'Vibe Coding & Demo Day',
    lessons: [
      'Vibe Coding : build real things without writing code',
      'Capstone Build Sprint : ship in 20 minutes',
      'Demo Day : present, critique, level up',
      'AI-Native Career Positioning',
    ],
    projects: ['Build 5 : AI-Powered Capstone Project'],
  },
];

// The tools taught on this programme (from /kickstarter) — a different set to
// the Fellowship's, so the shared stack takes this list.
const KS_TOOLS = [
  { name: 'Claude', logo: '/logos/claude.svg' },
  { name: 'ChatGPT', logo: '/logos/chatgpt.webp' },
  { name: 'Gemini', logo: '/logos/gemini.webp' },
  { name: 'Perplexity', logo: '/logos/perplexity.svg' },
  { name: 'NotebookLM', logo: '/logos/google-notebook-lm.webp' },
  { name: 'Notion', logo: '/logos/notion.webp' },
  { name: 'Canva AI', logo: '/logos/canva.webp' },
  { name: 'ElevenLabs', logo: '/logos/elevenlabs.png' },
  { name: 'Runway', logo: '/logos/runway.webp' },
  { name: 'HeyGen', logo: '/logos/heygen.webp' },
  { name: 'Zapier', logo: '/logos/zapier.webp' },
  { name: 'n8n', logo: '/logos/n8n.webp' },
  { name: 'Lovable', logo: '/logos/lovable-logo.webp' },
  { name: 'Emergent', logo: '/logos/emergent.webp' },
  { name: 'Lyzr', logo: '/logos/lyzr.webp' },
];

export default function KickstarterCampaign() {
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
        programTitle="Gen AI Kickstarter"
        followUp="walk you through the two weekends"
        theme="gcamp--kick"
      />
    );
  }

  return (
    <div className="gcamp gcamp--kick">
      <Seo
        title="Gen AI Kickstarter | Menler"
        description="14 days. 4 builds. AI-fluent. India's most accessible Gen AI programme — live, hands-on, and no prerequisites."
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
          <span className="gcamp-badge">Entry programme</span>
          <h1 className="gcamp-title">
            Gen AI <em>Kickstarter</em>
          </h1>
        </Reveal>

        <Reveal delay={80}><HeroArt /></Reveal>

        <Reveal delay={140}>
          <p className="gcamp-master">
            14 days. <em>4 builds.</em>
            <span>AI-fluent — no coding required.</span>
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
            <em>Zero code. Zero jargon.</em>
          </h2>
          <p className="gcamp-sub">
            Built for people starting from scratch. If you can use a browser,
            you can finish this programme with something you built yourself.
          </p>
        </Reveal>
        <div className="gcamp-who-grid gcamp-who-grid--5">
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
        eyebrow="The syllabus"
        title={<>Four modules. <em>Four builds and a capstone.</em></>}
        cards={MODULES}
        label="The Kickstarter syllabus"
      />

      <CampaignDownload
        program="kickstarter"
        resource="AI Kickstarter Curriculum"
        source="campaign-ai-kickstarter"
        sub="All 14 days, every lesson and build in one PDF — including the tools, the projects and the certificate."
      />

      <ToolStack
        tools={KS_TOOLS}
        sub="Get hands on with every tool in the programme — from your first prompt to your first shipped build."
      />

      <MentorsRail labelStyle={{ color: '#854F0B' }} titleStyle={{ color: '#854F0B' }} />

      <section className="gcamp-hiring">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">The network behind it</p>
          <h2 className="gcamp-h2">Hiring associations.</h2>
          <p className="gcamp-sub">
            Menler's mentors and hiring network come from founder's offices,
            VC-backed startups, agencies and AI-native teams.
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
          <h2 className="gcamp-h2">One programme. <em>Everything in it.</em></h2>
        </Reveal>
        <Reveal delay={80}>
          <PricingCard {...PLAN} ctaLabel="Apply Now" onCta={openApply} />
        </Reveal>
      </section>

      {applyOpen && (
        <ApplyModal
          onClose={() => setApplyOpen(false)}
          onDone={setApplicant}
          program="Gen AI Kickstarter"
          source="campaign-ai-kickstarter"
          label="Apply for the Gen AI Kickstarter"
          noteProgram="programme"
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
          <p className="gcamp-bar-t">Gen AI Kickstarter</p>
          <p className="gcamp-bar-d">14 days · Live · Limited seats</p>
        </div>
        <button type="button" className="gcamp-cta" onClick={openApply}>
          Apply Now
        </button>
      </div>
    </div>
  );
}
