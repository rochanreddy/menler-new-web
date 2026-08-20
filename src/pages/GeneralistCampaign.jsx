import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Reveal from '../components/common/Reveal';
import AccredSection from '../components/common/AccredSection';
import ToolStack, { TECH } from '../components/common/ToolStack';
import MentorsRail, { MENTORS } from '../components/common/MentorsRail';
import HiringJobs from '../components/common/HiringJobs';
import { HIRING_COMPANIES } from '../data/hiringCompanies';
import Seo from '../components/common/Seo';
import PricingCard from '../components/common/PricingCard';
import FaqList from '../components/common/FaqList';
import { GENERALIST_FAQS } from '../data/faqData';
import CampaignRail from '../components/campaign/CampaignRail';
import ApplyModal, { ThankYou } from '../components/campaign/CampaignApply';
import { GEN_HIRING } from '../data/genHiring';
import { SOCIAL_LINKS, SUPPORT_EMAIL, SUPPORT_MAIL_HREF } from '../data/socialLinks';
import { getFeaturedMentors } from '../data/featuredMentors';
import '../styles/campaign-landing.css';

// ── /campaign/ai-claude-generalist — ad landing page for the Generalist ──
// Chrome-free (no global nav/footer), noindex, mobile-first: ad traffic is
// overwhelmingly on phones; desktop is a widened variant of the same layout.
//
// Order: hero → numbers → accreditation → who it's for → the six-week rail →
// toolstack → mentors → jobs/salary bands → hiring associations → apply.
// Every band uses the shared .gcamp-sec / .gcamp-head shell from the
// stylesheet so the page keeps one rhythm, and a sticky CTA follows the
// reader once the hero scrolls away.

// The shared toolstack (TECH) is 15 tools, which on this page's 4-per-row
// grid leaves the last row three wide with an empty fourth slot. Midjourney
// fills it — it's the one high-demand category (image generation) the shared
// list doesn't otherwise cover, and it already has a logo in /public/logos.
// Local to this page only; the shared TECH list (Home, Kickstarter) is untouched.
const GEN_TOOLS = [...TECH, { name: 'Midjourney', logo: '/logos/midjourney.webp' }];

// This page shows one curated row of mentors, not the full roster — see
// src/data/featuredMentors.js for the shared lineup (also used by the
// Kickstarter campaign page).
const GEN_MENTORS = getFeaturedMentors(MENTORS);

// Jobs section: ONE list under the "AI-Native Roles" heading, not two columns.
// Two headings on an ad landing page made the reader sort the roles into
// buckets before reading any of them, and "Domain Roles" was a distinction
// only we could see. So the second group is dropped as a *heading* — its roles
// stay, merged into one list that opens with two AI-native roles and three
// from the old domain set. That five is what shows; "& many more" expands the
// same box to all twelve, the remaining roles from both lists in order.
const GEN_ROLES_TOP = [...GEN_HIRING.genRoles.slice(0, 2), ...GEN_HIRING.engRoles.slice(0, 3)];
const GEN_ROLES = [...GEN_ROLES_TOP, ...GEN_HIRING.genRoles.slice(2), ...GEN_HIRING.engRoles.slice(3)];

// Hero art: the finished composition, exported as one image — Nitin and
// Sridevi either side of the Claude mark, the fellowship domains between them,
// and both mentors' credentials on the navy strip beneath. It was built here as
// inline SVG (portrait masks, bottom scrim, credential strip, domain pills);
// the artwork is authored outside the codebase now, so the page just places it.
// The "Master Claude AI." message still lives BELOW this card as real HTML.
//
// The export carries no alpha and its four corners are black behind the card's
// own rounded edge, so .gcamp-heroart clips the img to that radius — 29px of a
// 1482×1061 export. Re-export it with transparency and the clip can come off.
//
// width/height are the export's own, so the box is reserved before it loads and
// the hero doesn't jump; fetchPriority high because this is the hero's LCP.
function HeroArt() {
  return (
    <img
      className="gcamp-heroart"
      src="/campign_genralist.png"
      width="1482"
      height="1061"
      alt="Nitin K Sethi, AI Engineer, Ex-McKinsey and MIT mentor, and Sridevi Edupuganti, AI Generalist, Ex-Microsoft and ISB EE mentor, either side of the Claude AI mark and the fellowship domains: Marketing, Finance, Product, Analyst, Founder's Office and HR Operations. Accredited by McKinsey & Company, MIT, The University of Texas at Austin, Microsoft, IIT Guwahati and ISB."
      fetchPriority="high"
      decoding="async"
    />
  );
}

// Numbers band under the hero — dark strip, serif numerals. Labels are split
// into two fixed lines so all five stats share the same shape/baseline.
const STATS = [
  { n: '90%', l1: 'Interview', l2: 'Pipeline Target' },
  { n: '25+', l1: 'Hiring', l2: 'Associations' },
  { n: '20+', l1: 'AI Builders', l2: '& Operators' },
  { n: '6+', l1: 'Domain', l2: 'Tracks' },
  { n: '6', l1: 'Weeks Intensive', l2: 'Fellowship' },
];

// Plan card — the /generalist pricing card, restated for the 6-week cohort and
// shown WITHOUT a price (admissions quotes it on the call).
const PLAN = {
  pill: 'Flagship Programme',
  name: 'AI Generalist Fellowship',
  tagline: 'Build an AI-native portfolio in just 6 weeks.',
  features: [
    ['30 hrs live instruction over 6 weeks', 'Instructor led · real questions in real time'],
    ['Build live projects with mentors', 'Portfolio ready deliverables every week'],
    ['LMS + community', 'Recordings, resources, and cohort community'],
    ['1:1 doubt-solving sessions', 'Direct mentor access · no question left behind'],
    ['Interview pipeline + placement support', "LinkedIn review · Menler's hiring network"],
    ['Claude Specialist Certification', 'Menler-certified · LinkedIn shareable'],
  ],
  chips: [
    { label: 'Duration', value: '6 Weeks' },
    { label: 'Live hours', value: '30 hours' },
    { label: 'Format', value: 'Live Online' },
    { label: 'Projects', value: '5+ Builds' },
  ],
};

// Hero fact pills.
const FACTS = ['Live Online', 'AI Career Opportunities', 'Capstone Project', 'Certification'];

/* The offer, written once. It sits beside every Apply button — the hero, the
   plan card and the sticky bar — and a figure repeated in three places is a
   figure that gets changed in two. */
const SCHOLARSHIP = 'Up to 40% scholarship';

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
//
// The phase only needs announcing once per phase, so the first week of each
// carries the phase badge + name ("Phase 1 · AI Foundations & Claude Mastery")
// instead of "Week 1"; every other week in that phase just shows its own
// number with no phase text repeated alongside it.
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
    n: 'Week 1',
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
    n: 'Week 2',
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
    n: 'Week 3',
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
    n: 'Week 4',
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
    n: 'Week 5',
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
    n: 'Week 6',
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
          <span className="gcamp-badge">No Coding required</span>
          <h1 className="gcamp-title">
            AI <em>Generalist</em> Fellowship
          </h1>
        </Reveal>

        <Reveal delay={80}><HeroArt /></Reveal>

        <Reveal delay={140}>
          <p className="gcamp-master">
            India’s Only
            <span> <em>Claude AI</em> Fellowship</span>
          </p>

          <p className="gcamp-sub gcamp-hero-sub">
           Automate your work with AI, build AI-powered solutions, and solve real-world problems across tech, non-tech, business, and every major 
           function trained by AI experts from McKinsey, Microsoft, Adobe, Flipkart and more.
          </p>

          <div className="gcamp-facts">
            {FACTS.map((f) => <span className="gcamp-fact" key={f}>{f}</span>)}
          </div>

          <button type="button" className="gcamp-cta" onClick={openApply}>
            Apply Now
          </button>
          <p className="gcamp-cta-note">
            <span className="gcamp-schol">{SCHOLARSHIP}</span>
            Limited seats
          </p>
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
            Build an AI-native portfolio in just six weeks.
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

      <ToolStack
        tools={GEN_TOOLS}
        sub="Get hands on with every tool in the fellowship — from your first prompt to your first shipped build."
      />

      {/* Who teaches it — its own white band. Sharing one parchment band with
          the jobs below it ran two different claims together; the change of
          ground is what tells the reader the second one has started. */}
      <section className="gcamp-mentors">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">Mentors </p>
          <h2 className="gcamp-h2">The People Behind Menler</h2>
          <p className="gcamp-sub"> AI Leaders who shape what you learn and how you grow.</p>
        </Reveal>
        <MentorsRail bare rows={1} mentors={GEN_MENTORS} />
      </section>

      {/* What it leads to, and who hires from it. The roles come before the
          companies: the job is the point, the logos are the proof.
          showPartners puts the company rail directly under the roles, which
          is where it belongs — this page no longer renders its own copy. */}
      <section className="gcamp-people gcamp-people--jobs">
        <HiringJobs
          {...GEN_HIRING}
          sectionStyle={{}}
          /* Straight to the claim that carries the section. "AI adoption is
             accelerating" is the premise everyone already grants; the demand
             line is the one that argues for the fellowship. Page-local so
             /generalist keeps the fuller two-sentence version. */
          sub="Demand for AI Native professionals is accelerating faster."
          genRoles={GEN_ROLES}
          genPreview={GEN_ROLES_TOP.length}
          engRoles={[]}
          singleBox
          companies={HIRING_COMPANIES}
          partnersLabel="Hiring associations · 25+ companies"
        />
      </section>

      <section className="gcamp-sec gcamp-plan">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">What's included</p>
          <h2 className="gcamp-h2">One fellowship. <em>Everything in it.</em></h2>
        </Reveal>
        <Reveal delay={80}>
          <PricingCard {...PLAN} ctaLabel="Apply Now" ctaNote={SCHOLARSHIP} onCta={openApply} />
        </Reveal>
      </section>

      {/* The questions that stop someone applying, answered where they stop —
          right after the price card, not below the footer. */}
      <section className="gcamp-sec gcamp-faq">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">Before you apply</p>
          <h2 className="gcamp-h2">Questions, <em>answered.</em></h2>
        </Reveal>
        <Reveal delay={80}>
          <FaqList items={GENERALIST_FAQS} />
        </Reveal>
      </section>

      {applyOpen && (
        <ApplyModal
          onClose={() => setApplyOpen(false)}
          onDone={setApplicant}
          program="Claude AI Generalist"
          source="campaign-ai-claude-generalist"
          section="Claude AI Generalist Fellowship"
          label="Apply for the AI Generalist Fellowship"
          noteProgram="fellowship"
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
          <p className="gcamp-bar-t">Claude AI Generalist</p>
          <p className="gcamp-bar-d"><span className="gcamp-schol">{SCHOLARSHIP}</span></p>
        </div>
        <button type="button" className="gcamp-cta" onClick={openApply}>
          Apply Now
        </button>
      </div>
    </div>
  );
}
