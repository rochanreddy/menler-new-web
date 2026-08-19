import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Reveal from '../components/common/Reveal';
import AccredSection from '../components/common/AccredSection';
import { BrandLogo } from '../components/common/PartnersMarquee';
import ToolStack from '../components/common/ToolStack';
import MentorsRail, { MENTORS } from '../components/common/MentorsRail';
import HiringJobs from '../components/common/HiringJobs';
import HiringRail from '../components/common/HiringRail';
import { HIRING_COMPANIES } from '../data/hiringCompanies';
import Seo from '../components/common/Seo';
import PricingCard from '../components/common/PricingCard';
import CampaignRail from '../components/campaign/CampaignRail';
import ApplyModal, { ThankYou } from '../components/campaign/CampaignApply';
import { getFeaturedMentors } from '../data/featuredMentors';
import { SOCIAL_LINKS, SUPPORT_EMAIL, SUPPORT_MAIL_HREF } from '../data/socialLinks';
import '../styles/campaign-landing.css';

// ── /campaign/ai-kickstarter — ad landing page for the Gen AI Kickstarter ──
// The same page as /campaign/ai-claude-generalist with different content: it
// shares the stylesheet and the rail / apply components, so a fix to one
// lands on both. Chrome-free, noindex, phone-first.
//
// Content comes from /kickstarter: the 14-day syllabus, the four modules, the
// hero numbers, the audiences and the pricing card (shown without a price).

// Hero art — a real HTML banner (not an SVG card): Deepak's photo bleeding
// off the edge, a badge, a two-line highlighted headline and his mentor
// credit, in the same visual grammar as the masterclass banners
// (see .lp2-banner in global.css) but recoloured to this page's amber
// accent. This is the ad's hook, so the copy carries the weight — kept to
// the same "outcome in N days" shape the masterclass banners use.
function HeroArt() {
  return (
    <div className="kick-hero-banner">
      <div className="kick-hero-banner-body">
        <div className="kick-hero-banner-logo"><MenlerWordmark size={16} /></div>
        <span className="kick-hero-banner-badge">✦⚡ THE 14-DAY AI SPRINT</span>
        <h2 className="kick-hero-banner-title">
          <mark>Become AI-Fluent</mark>
          <mark>In Just 14 Days</mark>
        </h2>
        <p className="kick-hero-banner-tag">Two weeks. Real AI advantage.</p>
        <p className="kick-hero-banner-credit">By <b>Deepak K</b> — AI Operations Lead, Testbook</p>
        <div className="kick-hero-banner-creds" aria-label="Testbook, MyCaptain, Imarticus">
          <BrandLogo name="Testbook" domain="testbook.com" />
          <BrandLogo name="MyCaptain" logo="/logos/mycaptain.jpg" />
          <BrandLogo name="Imarticus" logo="/logos/imarticus.jpg" />
        </div>
      </div>
      <div className="kick-hero-banner-photo">
        <img src="/mentors/Deepak.webp" alt="Deepak K" />
      </div>
    </div>
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
  
  features: [
    ['4 live sessions across 2 weekends', 'Sat + Sun · 2 hrs each · Bengaluru or online'],
    ['Claude OS hands-on build', 'Projects, Skills, Connectors, Routines — live'],
    ['4 portfolio deliverables', 'AI OS · Research System · Automation · Capstone'],
    ['Demo Day + peer review', 'Present live. Get feedback. Ship something real.'],
    ['Menler AI Kickstarter Certificate', 'LinkedIn-shareable proof of hands-on AI work'],
    ['AI resource library access', 'Prompt packs, templates, and tool guides'],
  ],
  chips: [
    { label: 'Duration', value: '2 Weeks' },
    { label: 'Sessions', value: '4 · 8 hrs' },
    { label: 'Format', value: 'Live online' },
    { label: 'Starts', value: 'Aug 30, 2026' },
  ],
};

// Hero fact pills.
const FACTS = [  'Live online','Cap Stone Project', 'Certification'];

// "Who this is for" — the five /kickstarter audiences, with the same tints.
const AUDIENCE = [
  { n: 1, t: 'School students', d: 'Class 10–12 who want to be AI fluent before college.', bg: '#FAEEDA', fg: '#854F0B' },
  { n: 2, t: 'College students', d: 'Any discipline. Stand out at internships and placements.', bg: '#E6E3F9', fg: '#534AB7' },
  { n: 3, t: 'Professionals new to AI', d: 'Catch up fast. Without coding. Without overwhelm.', bg: '#DCF0E7', fg: '#1D9E75' },
  { n: 4, t: "Founders' AI hires", d: 'First AI person at a startup? Get the toolkit fast.', bg: '#F9DFDF', fg: '#B0484F' },
  { n: 5, t: 'Parents & educators', d: 'Be the AI guide for your kids and your classroom.', bg: '#EDECE6', fg: '#5F5E5A' },
];

// ── The syllabus — one card per module, lessons verbatim from /kickstarter.
// Four modules over two weekends: two live sessions each weekend. The first
// module of each weekend carries the weekend badge + name; the second just
// shows its own module number, so the weekend isn't repeated on every card
// (same pattern as the Fellowship's phase badges).
const MODULES = [
  {
    n: 'Weekend 1', phase: 'Live sessions',
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
    n: 'Module 2',
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
    n: 'Weekend 2', phase: 'Live sessions',
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
    n: 'Module 4',
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
// the Fellowship's, so the shared stack takes this list. Same gap as the
// Fellowship's list had: 15 tools on a 4-per-row grid leaves the last row
// three wide. Midjourney fills it — image generation was the one category
// missing here too, and it already has a logo in /public/logos.
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
  { name: 'Midjourney', logo: '/logos/midjourney.webp' },
];

// One curated row of mentors, not the full roster — see
// src/data/featuredMentors.js for the shared lineup (also used by the
// Generalist campaign page).
const KICK_MENTORS = getFeaturedMentors(MENTORS);

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
          <span className="gcamp-badge">NO coding required</span>
          <h1 className="gcamp-title">
             AI <em>Kickstarter</em>
          </h1>
        </Reveal>

        <Reveal delay={80}><HeroArt /></Reveal>

        <Reveal delay={140}>
          <p className="gcamp-master">
            14 days. <em>4 builds.</em>
            <span>Your turning point in AI-era .</span>
          </p>

          <p className="gcamp-sub gcamp-hero-sub">
            Build real AI fluency in just two weeks — hands-on projects, mentor-led, taught by AI leaders and builders shaping the industry today.
          </p>

          <div className="gcamp-facts">
            {FACTS.map((f) => <span className="gcamp-fact" key={f}>{f}</span>)}
          </div>

          <button type="button" className="gcamp-cta" onClick={openApply}>
            Apply Now
          </button>
          <p className="gcamp-cta-note">Limited seats · Apply Now</p>
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

      <ToolStack
        tools={KS_TOOLS}
        sub="Get hands on with every tool in the programme — from your first prompt to your first shipped build."
      />

      <MentorsRail rows={1} mentors={KICK_MENTORS} labelStyle={{ color: '#854F0B' }} titleStyle={{ color: '#854F0B' }} />

      <HiringJobs
        label="Internship opportunities"
        title="The internships"
        titleEm="AI fluent are landing."
        genPreview={3}
        engPreview={3}
        labelStyle={{ color: '#854F0B' }}
        titleStyle={{ color: '#854F0B' }}
        titleEmStyle={{ color: '#BA7517' }}
        showPartners={false}
      />

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
        <MenlerWordmark theme="dark" size={20} tagline />
        <p className="gcamp-foot-desc">AI learning, built for the people doing the work.</p>
        <div className="gcamp-foot-social">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              className="gcamp-foot-social-link"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Menler on ${s.label}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.path} /></svg>
            </a>
          ))}
        </div>
        <a className="gcamp-foot-support" href={SUPPORT_MAIL_HREF} target="_blank" rel="noopener noreferrer">
          <svg className="gcamp-foot-support-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
          </svg>
          {SUPPORT_EMAIL}
        </a>

        <div className="gcamp-foot-links">
          <Link to="/policy/privacy">Privacy</Link>
          <Link to="/policy/terms">Terms</Link>
          <Link to="/policy/refund">Refunds</Link>
        </div>
        <p className="gcamp-foot-copy">
          © {new Date().getFullYear()} Menler Learning Systems pvt ltd
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
