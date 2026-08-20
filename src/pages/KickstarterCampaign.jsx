import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Reveal from '../components/common/Reveal';
import AccredSection from '../components/common/AccredSection';
import { BrandLogo } from '../components/common/PartnersMarquee';
import ToolStack from '../components/common/ToolStack';
import MentorsRail, { MENTORS } from '../components/common/MentorsRail';
import HiringJobs, { DEFAULT_GEN_ROLES, DEFAULT_ENG_ROLES } from '../components/common/HiringJobs';
import { HIRING_COMPANIES } from '../data/hiringCompanies';
import Seo from '../components/common/Seo';
import PricingCard from '../components/common/PricingCard';
import FaqList from '../components/common/FaqList';
import { KICKSTARTER_FAQS } from '../data/faqData';
import CampaignRail from '../components/campaign/CampaignRail';
import TestimonialsColumns from '../components/common/TestimonialsColumns';
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
    <div className="gcamp-kick-banner">
      <section className="lp2-banner">
        <div className="lp2-banner-body">
          <div className="lp2-banner-logo" style={{ marginBottom: '14px' }}>
            <MenlerWordmark size={22} theme="light" />
          </div>
          <span className="lp2-banner-badge">✦⚡ The 14-Day AI Sprint</span>
          <h2 className="lp2-banner-title">
            <mark>Become AI-Fluent</mark>
            <mark>In Just 14 Days</mark>
          </h2>
          <p className="lp2-banner-tag">Two weeks. Real AI advantage.</p>
          <div className="lp2-banner-brand">
            <span className="lp2-banner-credit">By <b>Deepak K</b> — AI Operations Lead, Testbook</span>
          </div>
          <div className="lp2-banner-creds" aria-label="Testbook, MyCaptain, Imarticus">
            <BrandLogo name="Testbook" domain="testbook.com" />
            <BrandLogo name="MyCaptain" logo="/logos/mycaptain.jpg" />
            <BrandLogo name="Imarticus" logo="/logos/imarticus.jpg" />
          </div>
        </div>
        <div className="lp2-banner-photo">
          <img src="/mentors/Deepak.webp" alt="Deepak K" />
        </div>
      </section>
    </div>
  );
}

// Numbers band — the /kickstarter hero stats. Labels are split into two fixed
// lines so all five share the same shape and baseline.
// Largest first. The band reads left to right, so the numbers should descend
// with it — 20+, 14, 10+, 4, 1 — rather than jumping about.
const STATS = [
  { n: '20+', l1: 'AI Builders', l2: '& Operators' },
  { n: '14', l1: 'Days', l2: 'Of curriculum' },
  { n: '10+', l1: 'AI Tools', l2: 'Hands-on' },
  { n: '4', l1: 'Mini-builds', l2: 'You ship' },
  { n: '1', l1: 'Fluency', l2: 'Certificate' },
];

// Plan card — the /kickstarter pricing card, shown WITHOUT a price (admissions
// quotes it on the call), with the start date added as a fourth chip.
const PLAN = {
  pill: 'Entry Programme',
  name: 'AI Kickstarter',
  tagline: 'Turn AI into your career advantage in just 14 days.',
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
    { label: 'Format', value: 'Live Online' },
    { label: 'Starts', value: 'Aug 30, 2026' },
  ],
};

// Hero fact pills.
const FACTS = ['Live Online', 'AI Career Opportunities', 'Capstone Project', 'Certification'];

// "Who this is for" — the five /kickstarter audiences, with the same tints.
const AUDIENCE = [
  { n: 1, t: 'School students', d: 'Class 10–12 who want to be AI fluent before college.', bg: '#FAEEDA', fg: '#854F0B' },
  { n: 2, t: 'College students', d: 'Any discipline. Stand out at internships and placements.', bg: '#E6E3F9', fg: '#534AB7' },
  { n: 3, t: 'Professionals new to AI', d: 'Catch up fast. Without coding. Without overwhelm.', bg: '#DCF0E7', fg: '#1D9E75' },
  { n: 4, t: "Founders' AI hires", d: 'First AI person at a startup? Get the toolkit fast.', bg: '#F9DFDF', fg: '#B0484F' },
];

// ── The syllabus — one card per module, lessons verbatim from /kickstarter.
// Four modules over two weekends, numbered straight through 1-4. No subtitle
// line on the badge row: it appeared on only the two modules that open a
// weekend, so those two cards started their title lower than the other two and
// the heading moved as you swiped. Same reason the Fellowship dropped its
// phase badges.
const MODULES = [
  {
    n: 'Module 1',
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
    n: 'Module 3',
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

// Internships: ONE list under one heading, not two columns. Same reasoning as
// the Fellowship page — two headings on an ad landing page made the reader
// sort the roles into buckets before reading any of them, and "non tech" vs
// "tech" was a distinction only we could see. The second group is dropped as a
// *heading*; its roles stay, merged in. The first five show; "& many more"
// expands the same box to all twelve.
const KICK_ROLES_TOP = [...DEFAULT_GEN_ROLES.slice(0, 2), ...DEFAULT_ENG_ROLES.slice(0, 3)];
const KICK_ROLES = [...KICK_ROLES_TOP, ...DEFAULT_GEN_ROLES.slice(2), ...DEFAULT_ENG_ROLES.slice(3)];

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
            <span>Your turning point in <b>the AI era</b>.</span>
          </p>

          <p className="gcamp-sub gcamp-hero-sub">
            Build real AI fluency in two weeks — hands-on and mentor-led.
          </p>

          <div className="gcamp-facts">
            {FACTS.map((f) => <span className="gcamp-fact" key={f}>{f}</span>)}
          </div>

          <button type="button" className="gcamp-cta" onClick={openApply}>
            Apply Now
          </button>
          <p className="gcamp-cta-note">Limited seats</p>
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

      {/* Who teaches it — its own white band, the same as the Fellowship page.
          Sharing one parchment band with the internships below it ran two
          different claims together; the change of ground is what tells the
          reader the second one has started. */}
      <section className="gcamp-mentors">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">Mentors</p>
          <h2 className="gcamp-h2">The People Behind Menler</h2>
          <p className="gcamp-sub">AI Leaders who shape what you learn and how you grow.</p>
        </Reveal>
        <MentorsRail bare rows={1} mentors={KICK_MENTORS} />
      </section>

      {/* What it leads to, and who hires from it. The roles come before the
          companies: the internship is the point, the logos are the proof.
          showPartners puts the company rail directly under the roles. */}
      <section className="gcamp-people gcamp-people--jobs">
        <HiringJobs
          label="Internship opportunities"
          title="The internships"
          titleEm="AI fluent are landing."
          sub="Menler Kickstarter prepares learners to contribute from day one."
          genLabel="AI-Native Internships"
          genRoles={KICK_ROLES}
          genPreview={KICK_ROLES_TOP.length}
          engRoles={[]}
          singleBox
          labelStyle={{ color: '#854F0B' }}
          titleStyle={{ color: '#854F0B' }}
          titleEmStyle={{ color: '#BA7517' }}
          companies={HIRING_COMPANIES}
          partnersLabel="Hiring associations · 25+ companies"
          footnote="Stipend ranges sourced from internship partner intake. Updated quarterly."
        />
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

      {/* Social proof between the price and the questions — same placement as
          the Fellowship page; the home page's section verbatim. */}
      <TestimonialsColumns />

      {/* The questions that stop someone applying, answered where they stop. */}
      <section className="gcamp-sec gcamp-faq">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">Before you apply</p>
          <h2 className="gcamp-h2">Questions, <em>answered.</em></h2>
        </Reveal>
        <Reveal delay={80}>
          <FaqList items={KICKSTARTER_FAQS} />
        </Reveal>
      </section>

      {applyOpen && (
        <ApplyModal
          onClose={() => setApplyOpen(false)}
          onDone={setApplicant}
          program="Gen AI Kickstarter"
          source="campaign-ai-kickstarter"
          section="Gen AI Kickstarter"
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
