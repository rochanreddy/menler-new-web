import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccredSection from '../components/common/AccredSection';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import LeadForm from '../components/forms/LeadForm';
import Footer from '../components/layout/Footer';
import Reveal from '../components/common/Reveal';
import MentorsRail from '../components/common/MentorsRail';
import { useToast } from '../components/common/Toast';
import { HOME_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

const PROJECTS = [
  {
    tag: "Founder's Office", tagCls: 't-founder', title: 'CEO decision-intelligence agent',
    desc: "Pulls from Slack, Asana, GitHub, finance docs & reports — synthesises a Monday-morning briefing on what changed, what's at risk, and what to decide.",
    stack: ['MCP', 'Cowork', 'Tool use'], outcome: '15-min briefing replaces 90-min catch-up',
    doc: {
      overview: "An always-on chief-of-staff agent that gives the CEO one trustworthy read on the whole company every Monday morning — without anyone manually compiling updates.",
      problem: "Leadership context is scattered across Slack threads, Asana boards, GitHub activity and finance exports. Pulling it together for a weekly review eats 90+ minutes and still misses the signal that matters.",
      howItWorks: ["Connects to Slack, Asana, GitHub and the finance drive through read-only MCP servers.", "Every Sunday night it pulls the week's deltas — shipped work, blocked items, spend and team sentiment.", "Claude synthesises the signals into a ranked briefing: what changed, what's at risk, and what needs a decision.", "The CEO drills from any line straight back to the source message or document."],
      features: ["MCP connectors for Slack, Asana, GitHub and Google Drive", "Risk and decision ranking by urgency and blast radius", "One-tap source drill-down for every claim", "Auto-delivered to email or Slack at 7am Monday"],
      architecture: "Built on Claude with tool use over a set of read-only MCP servers; Cowork orchestrates the weekly run and formats the briefing.",
      results: ["A 15-minute read replaces a 90-minute catch-up", "Zero manual status compilation by the team", "Risks surfaced roughly two days earlier on average"],
    },
  },
  {
    tag: 'VC', tagCls: 't-vc', title: 'Deal-flow triage agent',
    desc: 'Ingests pitch decks, founder emails, and public data — outputs a partner-ready memo on fit, market, traction, and follow-up questions.',
    stack: ['Claude API', 'Tool use', 'RAG'], outcome: 'Cuts initial screening time by 70%',
    doc: {
      overview: "A first-pass analyst that turns an inbox full of pitch decks into partner-ready memos, so the team only spends time on the deals worth a conversation.",
      problem: "Associates burn hours reading every inbound deck and email, and weak signal buries the few companies that actually fit the fund's thesis.",
      howItWorks: ["Ingests pitch decks, founder emails and public data about the company.", "Extracts team, market, traction and the ask into a structured deal profile.", "Scores fit against the fund thesis using RAG over past memos and investment criteria.", "Drafts a partner-ready memo plus the follow-up questions to send the founder."],
      features: ["Deck and email parsing into a structured deal profile", "Thesis-grounded fit score with cited reasoning", "Auto-drafted follow-up question list", "Red-flag detection on traction and market claims"],
      architecture: "Claude API with tool use for data lookups, and a RAG layer over the fund's historical memos and thesis documents.",
      results: ["About 70% less time on initial screening", "A consistent memo format across the whole team", "More thesis-fit deals reach partner review"],
    },
  },
  {
    tag: 'Product Management', tagCls: 't-pm', title: 'Insights-to-PRD pipeline',
    desc: 'Synthesises user interviews, support tickets, NPS comments, and sales notes into structured product requirement docs and themed opportunity stacks.',
    stack: ['Claude Projects', 'Multimodal', 'Cowork'], outcome: '5× faster discovery → PRD turnaround',
    doc: {
      overview: "A discovery copilot that converts raw user signal into structured product requirements — with traceability back to the evidence that justifies each one.",
      problem: "Interviews, tickets, NPS and sales notes pile up faster than any PM can synthesise, so insights get lost and every PRD starts from a blank page.",
      howItWorks: ["Ingests interview transcripts, support tickets, NPS comments and sales notes.", "Clusters them into themed opportunities and recurring pain points.", "Drafts a PRD with problem statement, goals and acceptance criteria.", "Links every requirement back to the user quotes behind it."],
      features: ["Multi-source feedback clustering", "Auto-generated PRD with acceptance criteria", "Quote-level traceability for each requirement", "Themed opportunity stack ranked by frequency"],
      architecture: "Claude Projects for persistent context, multimodal ingestion for documents and screenshots, and Cowork for the drafting workflow.",
      results: ["5× faster discovery-to-PRD turnaround", "Every requirement backed by real evidence", "A shared opportunity backlog the team trusts"],
    },
  },
  {
    tag: 'Project Management', tagCls: 't-pjm', title: 'PMO status agent',
    desc: 'Reads sprint boards, code commits, and stand-up notes — drafts the weekly leadership update with risks, slippage, and the asks for next week.',
    stack: ['MCP', 'Cowork', 'Skills'], outcome: 'Saves 6+ hrs/PM/week of status writing',
    doc: {
      overview: "An agent that writes the weekly leadership update for you, grounded in what actually happened across the project tools.",
      problem: "PMs lose hours each week stitching together board status, commits and stand-up notes into a readable executive update.",
      howItWorks: ["Reads sprint boards, code commits and stand-up notes.", "Builds one timeline of progress, blockers and slippage.", "Flags milestones trending late before they actually miss.", "Drafts the leadership update in the team's voice with next week's asks."],
      features: ["Jira, Git and notes unified into one timeline", "Early slippage detection on milestones", "Exec-ready update drafted in your tone", "Highlights the explicit asks for leadership"],
      architecture: "MCP connectors to the project tools, Cowork for the weekly run, and reusable Skills that lock the report format.",
      results: ["6+ hours per PM per week saved on status writing", "Fewer surprise slips at review", "Consistent updates across every project"],
    },
  },
  {
    tag: 'Engineering', tagCls: 't-eng', title: 'Production RAG pipeline + custom MCP',
    desc: 'Document ingestion → vector DB → grounded Claude service, with caching, RAGAS evals and a remote MCP exposing internal tools to Claude Desktop.',
    stack: ['Python', 'MCP SDK', 'Claude API'], outcome: '<800ms p95, ship-ready to enterprise',
    doc: {
      overview: "A production-grade retrieval service that grounds Claude in your documents, with the evals and tooling needed to ship it to an enterprise.",
      problem: "Demos are easy; a RAG system that is fast, accurate, evaluated and maintainable in production is not.",
      howItWorks: ["Documents are chunked, embedded and stored in a vector database.", "Queries retrieve and rerank the most relevant context.", "Claude answers grounded in that context, with citations.", "A RAGAS evaluation suite gates every change before deploy."],
      features: ["End-to-end ingestion to vector-store pipeline", "Prompt and response caching for latency and cost", "RAGAS evaluation harness wired into CI", "Remote MCP server exposing internal tools to Claude Desktop"],
      architecture: "Python services, a managed vector database, the MCP SDK for the tool server, and the Claude API for generation.",
      results: ["Under 800ms p95 response time", "Eval-gated deploys catch regressions early", "Ship-ready for enterprise security review"],
    },
  },
  {
    tag: 'Data & Business Analysts', tagCls: 't-analyst', title: 'Research synthesis & insight engine',
    desc: 'Multi-source agent across PDFs, web data, and internal reports — produces a competitive landscape with citations and contradictions flagged for review.',
    stack: ['Claude API', 'Web search', 'Citations'], outcome: 'Days → hours per research cycle',
    doc: {
      overview: "A research agent that reads across everything and returns a cited, contradiction-aware landscape you can actually defend.",
      problem: "Manual research across PDFs, the web and internal reports takes days, and the findings are hard to trust without sources.",
      howItWorks: ["Fans out across PDFs, web results and internal reports.", "Extracts claims, figures and themes from each source.", "Cross-checks sources and flags contradictions for human review.", "Outputs a competitor and market landscape with citations."],
      features: ["Multi-source parallel research", "A citation on every figure and claim", "Automatic contradiction flagging", "Structured landscape table output"],
      architecture: "Claude API with web search and tool use, plus citation tracking maintained across the full source set.",
      results: ["Days to hours per research cycle", "Every number traceable to a source", "Reviewers focus only on flagged conflicts"],
    },
  },
  {
    tag: 'Strategists & Operations', tagCls: 't-ops', title: 'SOP automation suite',
    desc: 'Replaces six manual checklists with a single audit-ready agent that intakes, triages, and escalates exceptions across customer support and ops.',
    stack: ['Agentic design', 'Cowork', 'MCP'], outcome: 'Reclaims 8–12 hrs/manager/week',
    doc: {
      overview: "A single audit-ready agent that runs the standard operating procedures a team used to handle with a stack of manual checklists.",
      problem: "Ops runs on brittle checklists across support and operations; exceptions slip through and there is no clean audit trail.",
      howItWorks: ["Intakes requests from the support and ops channels.", "Triages each request against the relevant SOP.", "Handles the routine path and escalates exceptions with full context.", "Logs every step for an auditable trail."],
      features: ["One agent replacing six manual checklists", "Rule-based routing to the right owner", "Exception escalation with full context", "Audit log for every action taken"],
      architecture: "An agentic design with Cowork for orchestration and MCP connectors into the support and ops systems.",
      results: ["8–12 hours per manager per week reclaimed", "Fewer dropped exceptions", "A clean audit trail for compliance"],
    },
  },
  {
    tag: 'Marketing & Sales', tagCls: 't-marketing', title: 'Always-on content & outreach engine',
    desc: 'Turns one strategic brief into a coordinated multichannel campaign — blog, email, LinkedIn, ads, and sales sequences — with brand voice enforced.',
    stack: ['Prompt patterns', 'Skills', 'MCP'], outcome: '3× output velocity, single-author voice',
    doc: {
      overview: "A campaign engine that expands one strategic brief into a full multichannel sequence — on brand and on schedule.",
      problem: "Turning a single brief into blog, email, social and ads consistently is slow, and brand voice drifts across channels and authors.",
      howItWorks: ["Takes one strategic brief as the input.", "Generates blog, email, LinkedIn and ad variants from it.", "Enforces brand voice with a reusable Skill.", "Schedules the sequence and sets up the A/B tests."],
      features: ["One brief into coordinated multichannel assets", "Brand-voice Skill keeps everything on-tone", "Built-in A/B variant generation", "Scheduling across every channel"],
      architecture: "Prompt patterns plus a brand-voice Skill, with MCP connectors into the publishing and scheduling tools.",
      results: ["3× content output velocity", "A single, consistent author voice", "Faster brief-to-live turnaround"],
    },
  },
];

const STORIES = [
  { quote: '"Most AI programs teach prompts. Menler teaches systems. The curriculum focuses on workflows, evaluation, deployment, and business impact — the things operators actually get measured on."', initials: 'AM', name: 'Arjun Menon', trans: 'AI Product Lead · Enterprise Automation', cls: '' },
  { quote: '"What stood out was the portfolio-first approach. Fellows aren\'t just learning concepts; they\'re shipping assets, agents, and workflows that can be reviewed by employers."', initials: 'NS', name: 'Neha Sinha', trans: 'Founder · AI Automation Studio', cls: 'dark' },
  { quote: '"We\'re seeing plenty of AI certificates in the market. What\'s rare are candidates who can demonstrate real builds. Menler\'s portfolio-led model makes evaluation significantly easier."', initials: 'TP', name: 'Talent Partner', trans: 'High-Growth SaaS Company', cls: 'green' },
  { quote: '"The strongest signal for us is proof of work. Menler\'s focus on projects, reviews, and operator mentorship aligns far better with how modern AI hiring decisions are made."', initials: 'HM', name: 'Hiring Manager', trans: 'AI & Automation Practice', cls: '', avatarStyle: { background: '#FAEEDA', color: '#854F0B' } },
  { quote: '"I joined expecting another AI course. Instead, I left with a portfolio I could actually discuss in interviews and a much clearer understanding of how AI is used inside real businesses."', initials: 'BF', name: 'Beta Fellow', trans: 'Cohort 0', cls: 'dark' },
  { quote: '"The biggest difference was learning from practitioners who use AI every day. Every session felt connected to actual workflows rather than theory."', initials: 'BF', name: 'Beta Fellow', trans: 'Cohort 0', cls: 'green' },
];

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const interestRef = useRef(null);
  const scrollToInterest = () => interestRef.current?.scrollIntoView({ behavior: 'smooth' });

  // "Apply to the Fellowship" opens the lead form in a popup.
  const [showApply, setShowApply] = useState(false);
  useEffect(() => {
    if (!showApply) return;
    const onKey = (e) => { if (e.key === 'Escape') setShowApply(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [showApply]);

  // Clicking a project card opens its preview.
  const [activeProject, setActiveProject] = useState(null);
  useEffect(() => {
    if (!activeProject) return;
    const onKey = (e) => { if (e.key === 'Escape') setActiveProject(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [activeProject]);

  const [miniEmail, setMiniEmail] = useState('');
  const [miniProgram, setMiniProgram] = useState('');
  const [miniDone, setMiniDone] = useState(false);
  const handleMiniLead = async (e) => {
    e.preventDefault();
    try {
      await submitLead({ email: miniEmail, program: miniProgram, source: 'mini-lead' });
      setMiniDone(true);
      toast.success('Brochure on its way — check your inbox.');
    } catch {
      toast.error("Couldn't send the brochure just now. Please try again.");
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero" aria-label="Hero — Menler Fellowship">
        <div className="hero-ring r1" /><div className="hero-ring r2" /><div className="hero-ring r3" />
        <div className="hero-grid">
        <div className="hero-visual" aria-hidden="true">
          <svg viewBox="-56 -56 592 592" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="meridianGlow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#AFA9EC" stopOpacity="0.55"/>
                <stop offset="60%" stopColor="#534AB7" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#26215C" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="meridianArc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EEEDFE"/>
                <stop offset="100%" stopColor="#AFA9EC"/>
              </linearGradient>
            </defs>
            <circle className="hero-glow" cx="240" cy="240" r="220" fill="url(#meridianGlow)"/>
            <circle cx="240" cy="240" r="180" stroke="rgba(238,237,254,0.22)" strokeWidth="0.8" fill="none"/>
            <circle cx="240" cy="240" r="135" stroke="rgba(238,237,254,0.32)" strokeWidth="0.8" fill="none"/>
            <circle cx="240" cy="240" r="92" stroke="rgba(238,237,254,0.46)" strokeWidth="1" fill="none"/>
            <g className="hero-moon">
              <path d="M240 148 a92 92 0 0 1 0 184" fill="rgba(38,33,92,0.78)" />
              <path d="M240 148 a92 92 0 0 0 0 184" fill="rgba(175,169,236,0.95)" />
            </g>
            <circle cx="240" cy="240" r="92" stroke="url(#meridianArc)" strokeWidth="1.5" fill="none"/>
            <g className="hero-orbit-dots" stroke="#EEEDFE" strokeWidth="0.6" fill="#EEEDFE">
              <circle cx="240" cy="60" r="3.4"/>
              <circle cx="420" cy="240" r="3.4"/>
              <circle cx="240" cy="420" r="3.4"/>
              <circle cx="60"  cy="240" r="3.4"/>
              <circle cx="367" cy="113" r="2.8" opacity="0.75"/>
              <circle cx="367" cy="367" r="2.8" opacity="0.75"/>
              <circle cx="113" cy="113" r="2.8" opacity="0.75"/>
              <circle cx="113" cy="367" r="2.8" opacity="0.75"/>
            </g>
            <g className="hero-labels" fontFamily="DM Sans, sans-serif" fontSize="9.5" fill="rgba(238,237,254,0.7)" letterSpacing="1.2">
              <text className="hero-label" x="240" y="46" textAnchor="middle">FOUNDER&apos;S OFFICE</text>
              <text className="hero-label" x="437" y="244" textAnchor="end">VC</text>
              <text className="hero-label" x="240" y="448" textAnchor="middle">ENGINEERING</text>
              <text className="hero-label" x="42"  y="244" textAnchor="start">MARKETING</text>
            </g>
          </svg>
        </div>
        <div className="hero-inner">
          <p className="hero-eyebrow">Menler Fellowship · India</p>
          <h1 className="hero-h1">Your turning point<br /><em>in an AI era.</em></h1>
          <p className="hero-sub">India's 1st Claude AI Specialist Fellowship.<strong style={{ color: '#EEEDFE', fontWeight: 500 }}><br />Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setShowApply(true)}>Check Fellowship Program</button>
            <button className="btn-outline" onClick={() => go('/aptitude')}>Take the AI Aptitude Test</button>
          </div>
          <p className="hero-metrics-label">Menler Fellowship · at a glance</p>
          <div className="hero-stats">
            <div><span className="hero-stat-num">90%</span><span className="hero-stat-lbl">Interview pipeline<br />target</span></div>
            <div><span className="hero-stat-num">25+</span><span className="hero-stat-lbl">Hiring<br />associations</span></div>
            <div><span className="hero-stat-num">20+</span><span className="hero-stat-lbl">AI Builders<br />/ Operators</span></div>
            <div><span className="hero-stat-num">12</span><span className="hero-stat-lbl">Weeks intensive<br />fellowship</span></div>
            <div><span className="hero-stat-num">7+</span><span className="hero-stat-lbl">Domain<br />tracks</span></div>
          </div>
        </div>
        </div>
      </section>

      {/* ── ACCREDITATION ── */}
      <AccredSection />

      {/* ── PROGRAMS ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Choose your program</p>
        <h2 className="section-h2">Two Paths, One Outcome —<br /><em>AI Native You!</em></h2>
        <p className="section-sub">Both fellowships lead to a recognised AI Specialist credential and active Interview support. Pick the one that fits your background — or talk to our Career Advisor and let us help you decide.</p>
        <div className="prog-compare">
          <div className="prog-card gen">
            <span className="prog-card-badge">No coding required</span>
            <p className="prog-card-title">Claude AI Generalist</p>
            <p className="prog-card-sub">India's first no-code Claude AI specialist program. Master Claude across your domain — Founder's Office, VC, Marketing, Analyst, Finance, Operations, Technology — and graduate as a certified AI Specialist with a domain portfolio.</p>
            <p className="prog-card-for">Builders from</p>
            <p className="prog-card-builders">Flipkart · Zolve · NTT Data · Equifax</p>
            <div className="next-batch">
              <p className="nb-label">Batch starts</p>
              <p className="nb-when"><strong>August 2026</strong>  ·  12 weeks  ·  Online</p>
              <p className="nb-deadline">Applications close 25 July 2026</p>
            </div>
            <button className="prog-card-cta" onClick={() => go('/generalist')}>Explore Generalist Program →</button>
          </div>
          <div className="prog-card eng">
            <span className="prog-card-badge">Coding experience required</span>
            <p className="prog-card-title">Claude AI Engineering</p>
            <p className="prog-card-sub">India's most rigorous Claude AI engineering certification. Build the full Claude stack — API, RAG, MCP, multi-agent systems, computer use, evals, and deployed AI apps — and earn the AI Engineer credential.</p>
            <p className="prog-card-for">Builders from</p>
            <p className="prog-card-builders">Google · Fractal · Autodesk · Microsoft · Samsung</p>
            <div className="next-batch">
              <p className="nb-label">Upcoming batch</p>
              <p className="nb-when"><strong>September 2026</strong>  ·  12 weeks  ·  Intensive</p>
              <p className="nb-deadline">Applications open July 2026</p>
            </div>
            <button className="prog-card-cta" onClick={() => go('/engineering')}>Explore Engineering Program →</button>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'rgba(38,33,92,0.7)' }}>
          <button className="btn-link" onClick={scrollToInterest} style={{ color: 'var(--specialist)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Book a call →</button>
        </p>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail />

      {/* ── WHAT YOU BUILD ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">What you build</p>
        <h2 className="section-h2">Real Projects.<br /><em>Across Every Domain.</em></h2>
        <p className="section-sub">Every Menler fellow ships a portfolio of domain-specific projects.<br />Not toy demos — actual systems built for real use cases. Check TOP projects across roles.</p>
        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <Reveal
              as="article"
              key={i}
              delay={Math.min(i, 5) * 60}
              className="proj-card proj-card--clickable"
              role="button"
              tabIndex={0}
              onClick={() => setActiveProject(p)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveProject(p); } }}
            >
              <span className={`proj-domain-tag ${p.tagCls}`}>{p.tag}</span>
              <h3 className="proj-card-title">{p.title}</h3>
              <p className="proj-card-desc">{p.desc}</p>
              <div className="proj-stack">{p.stack.map(s => <span key={s}>{s}</span>)}</div>
              <p className="proj-outcome">{p.outcome}</p>
              <span className="proj-card-link">View preview →</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU LEAVE WITH ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">What you leave with</p>
        <h2 className="section-h2">Every fellow graduates<br /><em>with all five.</em></h2>
        <div className="outcomes-grid">
          <div className="outcome dark">
            <span className="outcome-num">01</span>
            <p className="outcome-title">Claude Specialist certification</p>
            <p className="outcome-desc">Domain-specific badge.<br />The first Claude-native career credential in the AI ecosystem.</p>
          </div>
          <div className="outcome">
            <span className="outcome-num">02</span>
            <p className="outcome-title">Domain project portfolio</p>
            <p className="outcome-desc">Real projects — published, documented, and demo-ready by Week 12.</p>
          </div>
          <div className="outcome">
            <span className="outcome-num">03</span>
            <p className="outcome-title">Interview pipeline in your domain</p>
            <p className="outcome-desc">Matched to employers in your track. Demo Day puts you in front of decision-makers.</p>
          </div>
          <div className="outcome purple">
            <span className="outcome-num" style={{ color: 'var(--specialist)' }}>04</span>
            <p className="outcome-title">AI business strategy fluency</p>
            <p className="outcome-desc">Pitch AI investments, design roadmaps, communicate ROI — regardless of seniority or background.</p>
          </div>
          <div className="outcome" style={{ gridColumn: '1/-1', background: 'var(--cloud)' }}>
            <span className="outcome-num" style={{ color: 'var(--specialist)' }}>05</span>
            <p className="outcome-title">The Menler network — your circle for the AI era</p>
            <p className="outcome-desc">Fellows across both programs, across 7 domains. Permanent alumni access. The people who understand where you're going.</p>
          </div>
        </div>
      </section>

      {/* ── MINI LEAD ── */}
      <section className="mini-lead">
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>Get the MENLER fellowship <em>brochure.</em></h3>
            <p>Syllabus, schedule, fees, scholarships, and ISA options — straight to your inbox.</p>
          </div>
          {miniDone ? (
            <div className="mini-lead-success">✓ Brochure on its way.</div>
          ) : (
            <form className="mini-lead-form" onSubmit={handleMiniLead}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={miniEmail} onChange={e => setMiniEmail(e.target.value)} autoComplete="email" />
              <select required aria-label="Program of interest" value={miniProgram} onChange={e => setMiniProgram(e.target.value)}>
                <option value="">Program</option>
                <option>Generalist</option>
                <option>Engineering</option>
                <option>Not sure</option>
              </select>
              <button type="submit">Send brochure →</button>
            </form>
          )}
        </div>
      </section>

      {/* ── HIRING PARTNERS & ROLES ── */}
      <section className="section jobs-section">
        <p className="section-label">Hiring associations &amp; roles</p>
        <h2 className="section-h2">The jobs<br /><em>AI specialists are landing.</em></h2>
        <p className="section-sub">India's AI hiring market is splitting in two: companies buying generic AI and companies hiring people who can actually deploy Claude inside a domain. Menler fellows are built for the second list.</p>
        <div className="jobs-roles">
          <div className="role-card gen-side">
            <p className="role-card-program">Claude AI Generalist · Open roles</p>
            <div className="role-list">
              <div className="role-row"><p className="role-name">AI Specialist</p><p className="role-band">₹12–22L · Domain teams</p></div>
              <div className="role-row"><p className="role-name">AI Strategist</p><p className="role-band">₹15–28L · Consulting &amp; in-house</p></div>
              <div className="role-row"><p className="role-name">Founder's Office Associate</p><p className="role-band">₹14–24L · Startups &amp; funds</p></div>
              <div className="role-row"><p className="role-name">Marketing AI Lead</p><p className="role-band">₹14–25L · Brand &amp; growth teams</p></div>
              <div className="role-row"><p className="role-name">Operations AI Analyst</p><p className="role-band">₹10–18L · Ops &amp; finance</p></div>
              <div className="role-row"><p className="role-name">Domain AI Consultant</p><p className="role-band">₹15–30L · Boutique consulting</p></div>
            </div>
          </div>
          <div className="role-card eng-side">
            <p className="role-card-program">Claude AI Engineering · Placement roles</p>
            <div className="role-list">
              <div className="role-row"><p className="role-name">Claude Solutions Engineer</p><p className="role-band">₹22–45L · AI-native startups</p></div>
              <div className="role-row"><p className="role-name">AI Engineer / Applied AI</p><p className="role-band">₹20–40L · Product teams</p></div>
              <div className="role-row"><p className="role-name">RAG / Agent Engineer</p><p className="role-band">₹22–40L · Platform teams</p></div>
              <div className="role-row"><p className="role-name">MCP Platform Engineer</p><p className="role-band">₹25–48L · Infra &amp; enterprise AI</p></div>
              <div className="role-row"><p className="role-name">LLMOps Engineer</p><p className="role-band">₹22–42L · Production AI</p></div>
              <div className="role-row"><p className="role-name">AI Research Engineer</p><p className="role-band">₹25–55L · Frontier teams</p></div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 18, fontStyle: 'italic', lineHeight: 1.6 }}>Salary bands sourced from fellowship partner intake. Updated quarterly.</p>
        <div className="partners-strip">
          <p className="partners-label">Hiring associations · India · 25+ companies</p>
          <div className="partners-logos">
            {['AI-native startup', 'Top-tier VC', "Founder's office", 'Growth-stage SaaS', 'Marketing agency', 'Boutique fund', 'FinTech', 'Enterprise AI', '+ logos coming soon'].map(p => (
              <span key={p} className="partner-logo">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY MENLER METRICS ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">Why Menler</p>
        <h2 className="section-h2">Built around outcomes,<br /><em>measured against them.</em></h2>
        <p className="section-sub">India's AI training ecosystem is full of certificates that don't translate to careers. Menler is engineered backwards from real-time use cases across domains in the workplace — every week, every assignment, every project, every track decision is mapped to a hireable skill in a real domain.</p>
        <div className="metrics-strip">
          <Reveal className="metric-tile dark" delay={0}>
            <span className="metric-num">90%</span>
            <p className="metric-label">Interview pipeline target</p>
            <p className="metric-desc">Our placement goal — every fellow into an active interview pipeline within 90 days, across our domain tracks.</p>
          </Reveal>
          <Reveal className="metric-tile green" delay={70}>
            <span className="metric-num">25+</span>
            <p className="metric-label">Hiring associations</p>
            <p className="metric-desc">Founder's offices, VC firms, marketing agencies, finance teams, AI-native startups — actively recruiting AI Specialists.</p>
          </Reveal>
          <Reveal className="metric-tile" delay={140}>
            <span className="metric-num">12</span>
            <p className="metric-label">Weeks to credential</p>
            <p className="metric-desc">Three phases: AI fluency, Agentic Build, Domain Specialisation — then Project &amp; Interview pipeline. Faster than a postgraduate diploma. Deeper than a course.</p>
          </Reveal>
          <Reveal className="metric-tile" delay={210}>
            <span className="metric-num">7+</span>
            <p className="metric-label">Domain tracks</p>
            <p className="metric-desc">Founder's Office · VC · Product · Project Mgmt · Engineering · Data &amp; Business Analysts · Strategists &amp; Ops · Marketing &amp; Sales.</p>
          </Reveal>
        </div>
      </section>

      {/* ── LEAD FORM ── */}
      <section className="lead-section" id="interest" ref={interestRef}>
        <div className="lead-grid">
          <div className="lead-copy">
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--lavender)', marginBottom: 14 }}>Apply to the Fellowship · Limited seats</p>
            <h2>Tell us where you<br /><em>want to go.</em></h2>
            <p>Limited seats per cohort across our Generalist and Engineering programs. Share a few details and our admissions team will reach out within 48 hours with the right next step: brochure, scholarship eligibility, or a fast-track to the application.</p>
            <ul>
              <li>Receive the fellowship brochure &amp; syllabus</li>
              <li>Get scholarship &amp; ISA eligibility check</li>
              <li>Book a 1:1 admissions call</li>
              <li>Be the first to hear about upcoming batch dates</li>
            </ul>
          </div>
          <LeadForm />
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Voices · Fellows &amp; Advisors</p>
        <h2 className="section-h2">Why<br /><em>chose Menler.</em></h2>
        <p className="section-sub">These quotes are from our beta fellows and advisory voices — AI operators, builders, curriculum reviewers, and hiring associations.</p>
        <div className="stories-grid" style={{ marginTop: 28 }}>
          {STORIES.map((s, i) => (
            <Reveal as="article" key={i} delay={Math.min(i, 5) * 60} className={`story-card${s.cls ? ` ${s.cls}` : ''}`}>
              <p className="story-quote">{s.quote}</p>
              <div className="story-meta">
                <div className="story-avatar" style={s.avatarStyle}>{s.initials}</div>
                <div>
                  <p className="story-name">{s.name}</p>
                  <p className="story-transition">{s.trans}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="stories-disclaimer">Quotes shown are anonymised excerpts from Menler beta participants and advisory partners. Named placement stories will be published post Demo Day.</p>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'white', textAlign: 'center' }}>
        <p className="section-label">Common questions</p>
        <h2 className="section-h2">Everything you<br /><em>want to know.</em></h2>
        <FaqList items={HOME_FAQS} />
      </section>

      {/* ── CTA ── */}
      <CtaBanner
        badge="Applications open · Limited seats per program"
        title="Your Menler starts here."
        subtitle="Choose your program. Build your credential. Get placed."
        buttonText="Apply to the Fellowship"
        onButtonClick={() => setShowApply(true)}
      />

      <Footer />

      {/* ── PROJECT PREVIEW POPUP ── */}
      {activeProject && (
        <div className="proj-modal-overlay" onClick={() => setActiveProject(null)}>
          <div className="proj-modal" role="dialog" aria-modal="true" aria-label={activeProject.title} onClick={(e) => e.stopPropagation()}>
            <button className="apply-modal-close" onClick={() => setActiveProject(null)} aria-label="Close">×</button>
            <span className={`proj-domain-tag ${activeProject.tagCls}`}>{activeProject.tag}</span>
            <h3 className="proj-modal-title">{activeProject.title}</h3>
            <p className="proj-modal-desc">{activeProject.desc}</p>

            <div className="proj-doc">
              <p className="proj-doc-lead">{activeProject.doc.overview}</p>

              <h4 className="proj-doc-h">The problem</h4>
              <p className="proj-doc-p">{activeProject.doc.problem}</p>

              <h4 className="proj-doc-h">How it works</h4>
              <ol className="proj-doc-steps">
                {activeProject.doc.howItWorks.map((s, j) => <li key={j}>{s}</li>)}
              </ol>

              <h4 className="proj-doc-h">Key features</h4>
              <ul className="proj-doc-list">
                {activeProject.doc.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>

              <h4 className="proj-doc-h">Architecture</h4>
              <p className="proj-doc-p">{activeProject.doc.architecture}</p>
              <div className="proj-stack" style={{ marginTop: 10 }}>{activeProject.stack.map(s => <span key={s}>{s}</span>)}</div>

              <h4 className="proj-doc-h">Results &amp; impact</h4>
              <ul className="proj-doc-list">
                {activeProject.doc.results.map((r, j) => <li key={j}>{r}</li>)}
              </ul>
              <p className="proj-outcome" style={{ marginTop: 12 }}>{activeProject.outcome}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── APPLY POPUP ── */}
      {showApply && (
        <div className="apply-modal-overlay" onClick={() => setShowApply(false)}>
          <div className="apply-modal" role="dialog" aria-modal="true" aria-label="Express interest" onClick={(e) => e.stopPropagation()}>
            <button className="apply-modal-close" onClick={() => setShowApply(false)} aria-label="Close">×</button>
            <div className="apply-modal-media" aria-hidden="true" />
            <div className="apply-modal-form">
              <LeadForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
