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

// Jobs section: both columns stay (AI-Native Roles, Domain Roles), each
// collapsed to its top 3 of GEN_HIRING's 6 with a "+3 more" tile filling the
// grid's last cell — clicking it expands that column in place (HiringJobs'
// genPreview/engPreview props).

// Hero art: Nitin (left) and Sridevi (right) framing the Claude mark and the
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

// Each mentor's accreditation marks — the same credibility cue the masterclass
// banners carry under the mentor credit (.lp2-banner-creds), except here they
// sit inside the card so the hero stays one composition. Real logo files, never
// baked into a screenshot; a brand with no local file falls back to its
// wordmark set as text.
const MENTOR_CREDS = {
  nitin: [
    { name: 'McKinsey & Company', logo: '/logos/mckinsey.webp' },
    { name: 'Rio Tinto', logo: '/logos/rio-tinto.jpg' },
    { name: 'Al Yusr Leasing & Financing', logo: '/logos/al-yusr.jpg' },
  ],
  sridevi: [
    { name: 'Microsoft', logo: '/logos/microsoft.webp' },
    { name: 'IIT Guwahati', logo: '/logos/iitg.png' },
    { name: 'ISB', logo: '/logos/isb.png' },
  ],
};

// The two photo columns. `cx` centres the name, role and credential panel on
// the portrait above them; each mentor's marks live in ONE panel no wider than
// their own column, so the wide gap down the middle keeps the two sets visibly
// separate — a single full-width strip read as if it belonged to both.
const HERO_MENTORS = [
  {
    key: 'nitin', name: 'Nitin K Sethi', role: ['AI Engineer', 'Ex-McKinsey'],
    img: '/mentors/Nitin.webp', clip: 'gcamp-ph-l', x: 14, cx: 65, panelX: 8,
  },
  {
    key: 'sridevi', name: 'Sridevi Edupuganti', role: ['Co-Founder', 'Zenithworks AI'],
    img: '/mentors/sridevi.png', clip: 'gcamp-ph-r', x: 244, cx: 295, panelX: 238,
  },
];

const PANEL_W = 114;
const PANEL_H = 24;
const PANEL_Y = 218;
const SLOT = PANEL_W / 3;

function HeroArt() {
  const credsLabel = HERO_MENTORS
    .map((m) => `${m.name}, ${m.role.join(', ')} (${MENTOR_CREDS[m.key].map((c) => c.name).join(', ')})`)
    .join(' and ');
  return (
    <svg
      className="gcamp-heroart"
      viewBox="0 0 360 258"
      role="img"
      aria-label={`Mentors ${credsLabel} with Claude AI and the fellowship domains: Marketing, Finance, Product, Analyst, Founder's Office`}
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
      <rect x="0" y="0" width="360" height="258" rx="22" fill="url(#gcamp-card-bg)" />
      <rect x="0.75" y="0.75" width="358.5" height="256.5" rx="21.25" fill="none" stroke="#AFA9EC" strokeOpacity="0.4" strokeWidth="1.5" />

      {/* Mentors — portrait, name, role, then the accreditation chips */}
      {HERO_MENTORS.map((m) => (
        <g key={m.key}>
          <image
            href={m.img}
            x={m.x} y="16" width="102" height="156"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${m.clip})`}
          />
          <rect x={m.x} y="16" width="102" height="156" rx="16" fill="none" stroke="#AFA9EC" strokeWidth="1.5" />
          <text x={m.cx} y="186" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="11.5" fontWeight="600" fill="#26215C">{m.name}</text>
          {m.role.map((line, i) => (
            <text key={line} x={m.cx} y={198 + i * 10} textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="8.5" fill="#888780">{line}</text>
          ))}
          <rect x={m.panelX} y={PANEL_Y} width={PANEL_W} height={PANEL_H} rx="8" fill="#ffffff" stroke="#AFA9EC" strokeOpacity="0.55" strokeWidth="1" />
          {MENTOR_CREDS[m.key].map((c, i) => {
            const sx = m.panelX + i * SLOT;
            return (
              <g key={c.name}>
                {i > 0 && <line x1={sx} y1={PANEL_Y + 6} x2={sx} y2={PANEL_Y + PANEL_H - 6} stroke="#AFA9EC" strokeOpacity="0.4" strokeWidth="1" />}
                {c.logo ? (
                  <image
                    href={c.logo}
                    x={sx + 4} y={PANEL_Y + 5} width={SLOT - 8} height={PANEL_H - 10}
                    preserveAspectRatio="xMidYMid meet"
                  />
                ) : (
                  <text x={sx + SLOT / 2} y={PANEL_Y + 15} textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="7.5" fontWeight="700" fill="#26215C">{c.text}</text>
                )}
              </g>
            );
          })}
        </g>
      ))}

      {/* Centre column — Claude mark over the specialisation domains */}
      <image href="/logos/claude.svg" x="166" y="28" width="28" height="28" />
      <text x="180" y="74" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="10" fontWeight="700" letterSpacing="1.2" fill="#534AB7">CLAUDE AI</text>
      {HERO_DOMAINS.map((d, i) => (
        <g key={d.t} transform={`translate(${180 + d.dx} ${96 + i * 25}) rotate(${d.r})`}>
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
    { label: 'Live hours', value: '30 hrs' },
    { label: 'Sessions', value: '18 Live' },
    { label: 'Format', value: 'Live online' },
  ],
};

// Hero fact pills.
const FACTS = ['Live online', 'Mentor-led', 'Capstone Project', 'Certification'];

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
             AI <em>Generalist</em><br></br>Fellowship
          </h1>
        </Reveal>

        <Reveal delay={80}><HeroArt /></Reveal>

        <Reveal delay={140}>
          <p className="gcamp-master">
            India’s First-Ever
            <span> <em>Claude AI</em> Fellowship</span>
          </p>

          <p className="gcamp-sub gcamp-hero-sub">
            Build AI agents that automate 90% of your work, create no-code AI apps, and deploy live projects trained by McKinsey, Flipkart, Adobe & PwC AI builders and leaders.
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
            Build an AI-native portfolio in six weeks.
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

      {/* Who teaches it, what it leads to, and who hires from it — one band.
          They answer the same question, and split apart the reader had to
          scroll past each to reach the next. The roles come before the
          companies: the job is the point, the logos are the proof. */}
      <section className="gcamp-people">
        <Reveal className="gcamp-head">
          <p className="gcamp-eyebrow">Mentors &amp; hiring</p>
          <h2 className="gcamp-h2">The People Behind Menler</h2>
          <p className="gcamp-sub">Who teaches it — and who hires from it.</p>
        </Reveal>
        <MentorsRail bare rows={1} mentors={GEN_MENTORS} />

        {/* showPartners puts the company rail directly under the roles, which
            is where it belongs — this page no longer renders its own copy.
            sub="" because the band's own standfirst sits just above this, and
            a second one-liner there said the same thing twice. */}
        <HiringJobs
          {...GEN_HIRING}
          sectionStyle={{}}
          sub=""
          genPreview={2}
          engPreview={2}
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
          © {new Date().getFullYear()} Menler · An initiative by Meridian Edutech
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
