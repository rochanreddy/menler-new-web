import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import MentorsRail from '../components/common/MentorsRail';
import ProjectModal from '../components/common/ProjectModal';
import { useApply } from '../components/common/ApplyContext';
import HiringJobs from '../components/common/HiringJobs';
import PricingCard from '../components/common/PricingCard';
import { useContent } from '../lib/useContent';
import { GENERALIST_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

// ── Pricing card content ──
const GEN_PRICE_FEATS = [
  ['50 hrs live instruction over 10 weeks', 'Instructor led · real questions in real time'],
  ['Build live projects with mentors', 'Portfolio ready deliverables every week'],
  ['LMS + community · 1-year access', 'Recordings, resources, and cohort community'],
  ['1:1 doubt-solving sessions', 'Direct mentor access · no question left behind'],
  ['Interview pipeline + placement support', "LinkedIn review · Menler's hiring network"],
  ['Claude Specialist Certification', 'Menler-certified · LinkedIn shareable'],
];

// Pricing card content (fallback) + GROQ for the generalistPage singleton.
const GEN_PRICING = {
  pill: 'Flagship Programme',
  name: 'AI Generalist Fellowship',
  tagline: '10 weeks · 50 live hours — build a full Claude OS, ship 10+ projects, and earn a Specialist certificate.',
  price: '59,999',
  origPrice: '79,999',
  priceSub: 'incl. all taxes · EMI from ₹4,999/mo',
  features: GEN_PRICE_FEATS,
  chips: [
    { label: 'Start date', value: 'Aug 07, 2026' },
    { label: 'Duration', value: '10 Weeks' },
    { label: 'Sessions', value: '20 Live · 50 hrs' },
    { label: 'Format', value: 'Live online' },
  ],
};
const GEN_PRICING_QUERY = '*[_type == "generalistPage"][0].pricing{pill, name, tagline, price, origPrice, priceSub, features, chips}';

const CURRICULUM = [
  {
    label: 'Phase 1', weeks: 'Weeks 1–3', title: 'AI Foundations & Claude Mastery',
    modules: [
      { w: 'Week 1 — Understand AI: See the Landscape Clearly', lessons: ['How LLMs work: next token prediction, tokens, parameters, RLHF', 'Key terms: context windows, embeddings, temperature, fine tuning', 'Live 3-way comparison: Claude vs ChatGPT vs Gemini', 'The 6 Gen AI categories text, image, video, audio, code, agents', 'Tool landscape & why Claude leads for generalists'] },
      { w: 'Week 2 — Talk with AI: Claude Mastery', lessons: ['Claude Projects, Skills, Connectors, MCPs & APIs', 'System prompt architecture & best practices', 'Claude Chat vs Cowork vs Code live comparison', 'Schedules, Plugins & Routines', 'Claude for PowerPoint, Word & Excel; Notion as external memory'] },
      { w: 'Week 3 — Think + Create with AI: Prompt Engineering & Creative Studio', lessons: ['16 prompt frameworks (Zero/Few-shot, CoT, ToT, RAG, chaining…)', 'Claude Skills as prompt libraries; Routines for chained sequences', 'How diffusion models work; image prompt architecture', 'AI video, voice (STT/TTS/cloning) & 3D with Claude'] },
    ],
    tools: ['Claude', 'ChatGPT', 'Gemini', 'Perplexity', 'NotebookLM', 'Canva AI', 'ElevenLabs', 'Runway', 'Gamma'],
    projects: ['Project 1 : My Claude OS (configured workspace)', 'Project 2 : AI Media Kit (images, video, audio, deck)'],
  },
  {
    label: 'Phase 2', weeks: 'Weeks 4–6', title: 'Automate, Build & Ship',
    modules: [
      { w: 'Week 4 — Automate with AI: Voice Agents, Routines & Workflows', lessons: ['STT/TTS from scratch; voice cloning', 'Voice-agent deployment (VAPI, Bland, Retell)', 'Claude Routines + MCPs; the agent loop', 'N8N architecture; Claude as the intelligence node; Make & Zapier'] },
      { w: 'Week 5 — Build with AI: Vibecoding & Agentic App Development', lessons: ['How code generation differs from text', 'Vibecoding: describe → generate → test → iterate → ship', 'Claude Code, Cursor, Lovable, Bolt.new & Replit', 'Agentic apps: Claude API + MCP tool calls; capstone scoping'] },
      { w: 'Week 6 — AI Native: Ship It — Demo Day', lessons: ['Capstone build sprint on the full Claude stack', 'Product polish: UX, error handling, MCP reliability', 'Gamma deck + presentation coaching', 'Demo Day & AI Generalist certification'] },
    ],
    tools: ['Claude Code', 'Cursor', 'Lovable', 'Replit', 'Emergent', 'N8N', 'Make', 'Zapier', 'ElevenLabs', 'GitHub', 'Gamma'],
    projects: ['Project 3 : My Automated AI System (voice + automation)', 'Project 4 — Ship It capstone (live app or agent)'],
  },
  {
    label: 'Phase 3', weeks: 'Weeks 7–10', title: 'Domain Specialisation, Capstone & Placement',
    domains: [
      { name: 'Analyst',
        weeks: [
          { w: 'Week 1 — Business Diagnostics', lessons: ['BA lifecycle: problem definition → recommendation', 'KPI design vs KPI reporting', 'Problem framing: 5 Whys, issue tree, MECE', 'The so-what test on every insight'] },
          { w: 'Week 2 — Analytics & Reporting', lessons: ['Dashboards that drive decisions', 'Metric hierarchy: leading vs lagging', 'Data storytelling: SCQA in under 60 seconds', 'Cohort, funnel & segmentation analysis'] },
          { w: 'Week 3 — Automate the Analytics Layer', lessons: ['Operational analytics in Indian qcom', 'Report vs decision system', 'SQL for analysts how Claude changes access', 'Data quality in Indian businesses'] },
          { w: 'Week 4 — Ship the BI OS', lessons: ['AI leverage vs confident wrong answers', 'Verifying hallucinated metrics & benchmarks', 'BI OS architecture the four layers', 'BI OS as a career asset'] },
        ],
        tools: ['Claude', 'Perplexity', 'Google Sheets AI', 'Looker Studio', 'Gamma', 'N8N', 'SQL', 'Notion', 'Slack'],
        projects: ['BI OS diagnosis + analytics + automation, deployed', 'Looker Studio dashboard + board narrative'] },
      { name: 'Finance Operations',
        weeks: [
          { w: 'Week 1 — Financial Analysis & Modelling', lessons: ['Unit economics in consumer & fintech', 'The model a CFO reads in 90 seconds', 'Chain-of-thought for statement analysis', 'Scenario analysis: base / bull / bear'] },
          { w: 'Week 2 — FP&A & Business Partnering', lessons: ['The three real FP&A mandates', 'Budget vs forecast vs reforecast', 'Variance decomposition: volume, rate & mix', 'Driver-based vs line-item modelling'] },
          { w: 'Week 3 — Risk, Fraud & Compliance', lessons: ['Credit risk fundamentals: SMA-0/1/2 & NPA', 'RBI regulatory reporting calendar', 'Financial fraud types & AML / KYC under PMLA', 'Where AI adds genuine leverage in BFSI risk'] },
          { w: 'Week 4 — Ship the Finance OS', lessons: ['What an AI-native finance function looks like', 'The RBI FREE-AI framework (2025)', 'Model risk governance in Indian BFSI', 'Finance OS as an intelligence layer on ERP'] },
        ],
        tools: ['Claude', 'Google Sheets AI', 'Gamma', 'Notion', 'N8N', 'Airtable', 'Excel', 'Slack', 'Replit'],
        projects: ['Finance OS analysis + FP&A + risk & compliance', 'Automated credit-risk & CFO reporting pipeline'] },
      { name: "Founder's Office",
        weeks: [
          { w: 'Week 1 — Strategic Intelligence', lessons: ['CoS / EIR / FO roles vs the job title', 'The three operating modes of a founder', 'Founder psychology & how trust decisions are made', 'AI-native strategic intelligence a founder would use'] },
          { w: 'Week 2 — Founder Communication', lessons: ['Anatomy of an investor update founders actually send', 'Pitch narrative vs pitch deck', 'Stakeholder communication maps', 'Writing for a founder who edits in 90 seconds'] },
          { w: 'Week 3 — Operations Layer', lessons: ['GTM coordination from the FO seat', 'Startup metrics that matter (ARR, NDR, CAC:LTV, burn)', 'Dashboards that trigger decisions, not just report', 'Notion as the operational source of truth'] },
          { w: "Week 4 — Ship the Founder's OS", lessons: ['AI operator vs AI user', 'Agentic workflow architecture', 'Voice-briefing systems for the founder', 'Presenting a systems handover to a founder'] },
        ],
        tools: ['Claude', 'Perplexity', 'NotebookLM', 'Gamma', 'Notion', 'N8N', 'ElevenLabs', 'Slack', 'Replit'],
        projects: ["Founder's OS research + comms + ops, integrated", 'Live voice-briefing system on a real startup'] },
      { name: 'Human Resource',
        weeks: [
          { w: 'Week 1 — Talent Acquisition System', lessons: ['How TA differs across startup, enterprise & GCC', 'JD design that attracts vs repels', 'The iceberg model of competency', 'The ATS problem & offer management'] },
          { w: 'Week 2 — HRBP Execution & PMS', lessons: ['What HRBPs actually own', 'Attrition diagnosis: TTM, push vs pull factors', 'Designing a PMS from scratch', 'OKR vs KRA vs BSC vs MBO'] },
          { w: 'Week 3 — Payroll, Analytics & L&D', lessons: ['Indian payroll complexity: PF, ESI, TDS, PT', 'The statutory compliance calendar', 'HR analytics as a decision layer', 'L&D ROI & content design that sticks'] },
          { w: 'Week 4 — Ship the HR OS', lessons: ['What an AI-native HR function looks like', 'The HR data fragmentation problem', 'AI in hiring — legal exposure (DPDP, Equal Remuneration)', 'Employee relations & grievance management'] },
        ],
        tools: ['Claude', 'Notion', 'Keka', 'Darwinbox', 'N8N', 'Gamma', 'Airtable', 'Slack', 'Gmail'],
        projects: ['HR OS TA + HRBP + payroll + L&D, deployed', 'Automated hiring + offer + compliance command centre'] },
      { name: 'Marketing',
        weeks: [
          { w: 'Week 1 — AI-native GTM Strategy', lessons: ['Marketing strategy vs marketing activity', 'Customer journey — trust is the conversion problem', 'Positioning without the biggest budget', 'GTM motion: product-, sales- or marketing-led'] },
          { w: 'Week 2 — Brand & Content System', lessons: ['Content strategy vs content calendar', 'Storytelling architecture (spine, POV, arc)', 'Platform logic: Instagram, LinkedIn, YouTube, WhatsApp', 'Reach content vs trust content'] },
          { w: 'Week 3 — Growth & Sales', lessons: ['Paid acquisition: ROAS vs CAC vs LTV vs payback', 'CRM thinking (HubSpot vs Zoho)', 'Retention stack: email + WhatsApp + push', 'AI lead qualification & outreach at volume'] },
          { w: 'Week 4 — Ship the Marketing & Sales OS', lessons: ['Where AI creates leverage vs destroys brand', 'Campaign operations as a repeatable system', 'Brand-voice integrity at scale', 'Presenting an AI marketing system to a CMO'] },
        ],
        tools: ['Claude', 'Gamma', 'Canva AI', 'Midjourney', 'HubSpot', 'Meta Ads', 'GA4', 'WhatsApp Business', 'N8N', 'Runway'],
        projects: ['Marketing OS GTM + content + growth, integrated', 'Brand audio + video ad with live CRM pipeline'] },
      { name: 'Product Management',
        weeks: [
          { w: 'Week 1 — Discovery & Problem Framing', lessons: ['What PMs actually do vs the JD', 'JTBD vs feature requests vs user complaints', 'AI-native discovery & user synthesis', "Framing a problem statement that doesn't get ignored"] },
          { w: 'Week 2 — PRDs, Backlogs & Roadmaps', lessons: ['What makes a PRD shippable', 'RICE, ICE, MoSCoW — when each breaks down', 'Roadmaps that survive stakeholder review', 'Saying no with data, not opinion'] },
          { w: 'Week 3 — Product Decisions with Data', lessons: ['North Star vs vanity metrics', 'Funnel thinking (AARRR) as a diagnostic', 'Experiment design without a data team', 'A metrics narrative a CFO reads in 60 seconds'] },
          { w: 'Week 4 — Ship an AI-native Feature', lessons: ["What's different about AI-native products", 'AI UX patterns: graceful degradation, confirmation', 'Writing specs engineering will respect', 'Pitching an AI feature to a founder or investor'] },
        ],
        tools: ['Claude', 'Jira', 'Notion', 'Figma', 'Gamma', 'GA4', 'Mixpanel', 'Lovable', 'Replit'],
        projects: ['PM Case File discovery → PRD → analytics', 'Shipped AI-native prototype + spec + pitch deck'] },
    ],
  },
];

// Hiring section content for the Generalist page only — edit freely, it does
// NOT affect the Engineering / Kickstarter hiring sections.
const GEN_HIRING = {
  sectionStyle: { paddingTop: 48 },
  label: 'Hiring associations & roles',
  title: 'The jobs',
  titleEm: 'AI specialists are landing.',
  sub: "AI adoption is accelerating. Demand for AI Native professionals is accelerating faster.",
  genLabel: 'AI-Native Roles',
  engLabel: 'Domain Roles',
  genRoles: [
    { name: 'AI Specialist', band: '₹12–22L · Domain teams' },
    { name: 'AI Strategist', band: '₹15–28L · Consulting & in-house' },
    { name: 'AI Builder', band: '₹14–26L · AI-first startups' },
    { name: 'AI Systems Specialist', band: '₹16–30L · Platform & automation teams' },
    { name: 'Automation Specialist', band: '₹12–24L · Operations & workflow teams' },
    { name: 'Domain AI Consultant', band: '₹15–30L · Boutique consulting' },
  ],
  engRoles: [
    { name: 'AI Product Manager', band: '₹16–30L · SaaS & platforms' },
    { name: 'AI Program Manager', band: '₹16–28L · Transformation teams' },
    { name: "Founder's Office Associate", band: '₹14–24L · Startups & funds' },
    { name: 'Marketing AI Lead', band: '₹14–25L · Brand & growth teams' },
    { name: 'Operations AI Analyst', band: '₹10–18L · Ops & finance teams' },
    { name: 'Finance AI Analyst', band: '₹12–22L · BFSI & fintech' },
  ],
};

const TRACKS = [
  { name: 'Analyst', role: 'Business intelligence · Data storytelling · AI insights' },
  { name: 'Finance Ops', role: 'Financial intelligence · Workflow automation · Risk controls' },
  { name: "Founder's Office", role: 'Market research · Strategic analysis · Executive decisions' },
  { name: 'Human Resources Ops', role: 'Talent acquisition · People analytics · Workforce intelligence' },
  { name: 'Marketing & Sales', role: 'Growth systems · Customer acquisition · CRM automation' },
  { name: 'Product Management', role: 'User research · PRDs · Product execution' },
];

const PROJECTS = [
  { track: "Founder's office", title: 'CEO weekly briefing agent', meta: 'Week 6 · Skills + MCP · Live deployment', desc: "A Claude Skill that pulls metrics from connected tools, summarises wins/blockers, and publishes a Monday brief to the founder's inbox.", stack: 'Stack: Claude Projects · Skills · Gmail MCP' },
  { track: 'Finance', title: 'Deal-sourcing research agent', meta: 'Week 7 · Cowork · Multi-doc', desc: 'Cowork-driven workflow that screens decks, writes investment memos, and flags red-flags grounded in your fund thesis.', stack: 'Stack: Cowork · Projects · Web search' },
  { track: 'Marketing', title: 'Always-on content engine', meta: 'Week 5 · Skills · Brand voice', desc: 'Brand-trained Claude Skill generating blog, LinkedIn, and ad copy with on-brand tone — drafts ready for review in minutes.', stack: 'Stack: Skills · Style guides · Prompt library' },
  { track: 'Analyst', title: 'Earnings call insight engine', meta: 'Week 8 · Multimodal · Tables', desc: 'Transcript + financials in, structured insight memo out — competitive read, sentiment, and KPI delta in a single Claude run.', stack: 'Stack: Multimodal · Excel · Skills' },
  { track: 'Finance', title: 'Budget variance commentator', meta: 'Week 9 · Excel + Claude · Templates', desc: 'Claude in Excel that reads actual vs. plan, writes management commentary, and drafts the CFO review deck.', stack: 'Stack: Claude in Excel · PPT · Skills' },
  { track: 'Operations', title: 'SOP automation agent', meta: 'Week 6 · MCP · Workflow', desc: 'Turn a messy SOP into a Claude-driven workflow that handles intake, triage, and routing with audit-ready logs.', stack: 'Stack: MCP · Cowork · Slack' },
  { track: 'Technology', title: 'No-code AI app builder', meta: 'Week 10 · Artifacts · Forms', desc: 'Build a working internal tool — input form, Claude reasoning layer, output dashboard — without writing a line of Python.', stack: 'Stack: Artifacts · Projects · Cowork' },
  { track: 'Capstone', title: 'Domain Specialist capstone', meta: 'Weeks 9–10 · Demo Day · Cert', desc: 'A real, deployed automation for a real organisation — judged by industry mentors. Powers your Claude Specialist certification.', stack: 'Outcome: Claude Specialist — [Your domain]', isCap: true },
];


const ROLES = [
  { name: 'AI Specialist — Founder\'s Office', comp: '₹16–28L · Series B+ startups', desc: 'Run Claude-powered briefings, decision memos, and reporting agents directly for the CEO.' },
  { name: 'AI Marketing Lead', comp: '₹14–24L · D2C / SaaS', desc: 'Own content engines, campaign automation, and brand-trained Claude Skills end-to-end.' },
  { name: 'VC AI Analyst', comp: '₹18–32L · India + US funds', desc: 'Source deals, write memos, and run diligence with Claude-driven research workflows.' },
  { name: 'AI Finance Analyst', comp: '₹15–22L · BFSI / listed cos.', desc: 'Earnings analysis, variance commentary, and CFO reporting via Claude in Excel.' },
  { name: 'AI Operations Manager', comp: '₹14–20L · Scale-ups', desc: 'Automate SOPs and intake-triage workflows across customer support and ops.' },
  { name: 'AI Strategy Consultant', comp: '₹18–30L · Consulting / Big 4', desc: 'Lead Claude transformation engagements for enterprise clients across India.' },
];

// Logo per curriculum tool (local file, with text fallback if it fails).
const TOOL_LOGO_SRC = {
  'Claude': '/logos/claude.svg', 'Claude Cowork': '/logos/claude.svg', 'Cowork': '/logos/claude.svg',
  'Claude API': '/logos/claude.svg', 'Projects': '/logos/claude.svg', 'Skills': '/logos/claude.svg',
  'Artifacts': '/logos/claude.svg', 'MCP': '/logos/mcp.svg', 'OpenAI': '/logos/openai.png',
  'Canva': '/logos/canva.png', 'Notion': '/logos/notion.png', 'Make': '/logos/make.png',
  'Zapier': '/logos/zapier.png', 'Airtable': '/logos/airtable.png', 'Typedream': '/logos/typedream.png',
  'n8n': '/logos/n8n.png', 'N8N': '/logos/n8n.png', 'Slack': '/logos/slack.png', 'Gmail': '/logos/gmail.png',
  'Excel': '/logos/excel.png', 'PowerPoint': '/logos/powerpoint.png', 'Buffer': '/logos/buffer.png',
  // Phase 3 domain-track tools (match the exact names used in the data).
  'Perplexity': '/logos/perplexity.svg', 'NotebookLM': '/logos/notebooklm.png', 'Gamma': '/logos/gamma.png',
  'ElevenLabs': '/logos/elevenlabs.png', 'Canva AI': '/logos/canva.png', 'Midjourney': '/logos/midjourney.png',
  'Runway': '/logos/runway.png', 'Lovable': '/logos/lovable-logo.png', 'Emergent': '/logos/emergent.png',
  'Gemini': '/logos/gemini.png', 'Gemini (image)': '/logos/gemini.png', 'ChatGPT': '/logos/chatgpt.png',
  'Claude Code': '/logos/claude_code-removebg-preview.png', 'Cursor': '/logos/cursor.png',
  'SQL': '/logos/sql.svg',
};

// Tools without a local logo file — fall back to the brand's favicon by domain.
const TOOL_DOMAIN = {
  'Replit': 'replit.com', 'HubSpot': 'hubspot.com', 'Meta Ads': 'facebook.com', 'GA4': 'google.com',
  'WhatsApp Business': 'whatsapp.com', 'Google Sheets AI': 'google.com', 'Looker Studio': 'google.com',
  'GitHub': 'github.com', 'Bolt.new': 'bolt.new', 'VAPI': 'vapi.ai',
  'Jira': 'atlassian.com', 'Figma': 'figma.com', 'Mixpanel': 'mixpanel.com', 'Keka': 'keka.com',
  'Darwinbox': 'darwinbox.com', 'Web search': 'google.com', 'Multimodal': 'claude.ai',
};

function ToolChip({ name }) {
  // Prefer a local logo; otherwise fall back to the brand's favicon by domain.
  const local = TOOL_LOGO_SRC[name];
  const domain = TOOL_DOMAIN[name];
  const sources = [
    local,
    domain && `https://logo.clearbit.com/${domain}`,
    domain && `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ].filter(Boolean);
  const [i, setI] = useState(0);
  const src = sources[i];
  return (
    <span className="curric-tool">
      {src && <img className="curric-tool-logo" src={src} alt="" onError={() => setI(i + 1)} />}
      {name}
    </span>
  );
}

export default function Generalist() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', phone: '', track: '' });
  const [done, setDone] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [activeDomain, setActiveDomain] = useState(0);
  const [domainWeek, setDomainWeek] = useState(0);
  const [openWeek, setOpenWeek] = useState(null);
  const weekDetailRef = useRef(null);

  // Select a week. On mobile, the week description stacks below the week list,
  // so scroll it into view (after re-render) — same UX as the phases above.
  const pickWeek = (i, wi) => {
    setOpenWeek(`${i}-${wi}`);
    if (window.matchMedia('(max-width: 760px)').matches) {
      requestAnimationFrame(() => {
        const el = weekDetailRef.current;
        if (!el) return;
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90 });
        else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };
  const openApply = useApply();
  const genPricing = useContent(GEN_PRICING_QUERY, GEN_PRICING);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, program: 'generalist', source: 'generalist-page' }); } catch {}
    setDone(true);
  };

  return (
    <>
      <Seo
        title="Claude AI Generalist Fellowship — No-Code AI Course India | Menler"
        description="A 10-week no-code Claude AI fellowship for non-tech professionals and students. Master AI workflows across marketing, finance, product, HR & ops — with placement support."
        keywords="Claude AI Generalist course, no-code AI fellowship, AI generalist program India, AI fellowship for non-tech, AI workflows, AI-native work, AI upskilling India, AI course India"
        path="/generalist"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Course', name: 'Claude AI Generalist Fellowship', description: '10-week no-code Claude AI fellowship for non-technical professionals — domain AI workflows, real projects and placement support.', provider: { '@type': 'Organization', name: 'Menler', sameAs: 'https://menler.in' } }}
      />
      {/* ── HERO + WHO THIS IS FOR (one screen together) ── */}
      <div className="hero-screen">
      {/* ── HERO ── */}
      <section className="hero hero-big" style={{ padding: '66px clamp(20px, 6vw, 40px) 68px' }}>
        <div className="hero-ring r1" /><div className="hero-ring r2" />
        <div className="hero-inner">
          <p className="hero-eyebrow">Claude AI Generalist Fellowship</p>
          <h1 className="hero-h1">Master Claude AI.<br /><em>Transform your domain.</em></h1>
          <p className="hero-sub">India's only Claude AI Specialist Fellowship.<strong className="hero-tagline" style={{ color: '#EEEDFE', fontWeight: 500 }}>Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ minWidth: 220, textAlign: 'center' }} onClick={openApply}>Apply Now</button>
            <button className="btn-outline" style={{ minWidth: 220, textAlign: 'center' }}>Download Brochure</button>
          </div>
          <div className="hero-stats">
            <div><span className="hero-stat-num">90%</span><span className="hero-stat-lbl">Interview Pipeline<br />Target</span></div>
            <div><span className="hero-stat-num">25+</span><span className="hero-stat-lbl">Hiring<br />Associations</span></div>
            <div><span className="hero-stat-num">20+</span><span className="hero-stat-lbl">AI Builders<br />& Operators</span></div>
            <div><span className="hero-stat-num">10</span><span className="hero-stat-lbl">Weeks Intensive<br />Fellowship</span></div>
            <div><span className="hero-stat-num">6+</span><span className="hero-stat-lbl">Domain<br />Tracks</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: 'var(--parchment)', paddingTop: 24, paddingBottom: 20 }}>
        <p className="section-label">Who this is for</p>
        <h2 className="section-h2">Any background.<br /><em>Any domain. Zero code.</em></h2>
        <p className="section-sub">The AI Native workforce won't be made up of engineers alone.<br />It will be built by professionals across every domain.</p>
        <div className="audience-grid">
          <div className="audience-card"><div className="ava" style={{ background: 'var(--cloud)', color: 'var(--specialist)' }}>1</div><p className="audience-role">Students</p><p className="audience-desc">Any discipline. Enter the job market as AI Native.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FAEEDA', color: '#854F0B' }}>2</div><p className="audience-role">Professionals</p><p className="audience-desc">Tech & non tech. Lead AI in your current role.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FCEBEB', color: '#A32D2D' }}>3</div><p className="audience-role">Business owners</p><p className="audience-desc">Use Claude to run your business smarter.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#E1F5EE', color: '#085041' }}>4</div><p className="audience-role">Founders</p><p className="audience-desc">Build with Claude without an engineering team.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>5</div><p className="audience-role">Career switchers</p><p className="audience-desc">Move into AI adjacent roles with a real credential.</p></div>
        </div>
      </section>
      </div>

      {/* ── CURRICULUM ── */}
      <section className="section curric-section--gen" style={{ background: 'white', paddingTop: 48 }}>
        <p className="section-label">10-week curriculum</p>
        <h2 className="section-h2">From curious<br /><em>to Claude Specialist.</em></h2>
        <p className="section-sub">Three phases, no code just Claude mastery applied to your domain.<br />Pick a phase to open its modules, tools, and projects.</p>
        <div className="curric-acc">
          {CURRICULUM.map((p, i) => {
            const open = activePhase === i;
            return (
              <div className={`curric-acc-item${open ? ' open' : ''}`} key={i}>
                <button className="curric-acc-head" onClick={(e) => {
                  const willOpen = !open;
                  setActivePhase(willOpen ? i : -1);
                  if (willOpen) {
                    const el = e.currentTarget;
                    setTimeout(() => {
                      if (window.__lenis) { window.__lenis.scrollTo(el, { offset: -90 }); return; }
                      const y = el.getBoundingClientRect().top + window.scrollY - 90;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }, 70);
                  }
                }} aria-expanded={open}>
                  <span className="curric-acc-no">{p.label} · {p.weeks}</span>
                  <span className="curric-acc-title">{p.title}</span>
                  <span className="curric-acc-caret">{open ? '▾' : '▸'}</span>
                </button>
                {open && (
                  <div className="curric-acc-body">
                    {i < 2 ? (
                      (() => {
                        const selWeek = (openWeek && openWeek.startsWith(`${i}-`)) ? Number(openWeek.split('-')[1]) : 0;
                        const week = p.modules[selWeek];
                        return (
                      <div className="curric-detail--split curric-detail--triple">
                        <div className="curric-detail-main">
                          <p className="curric-label">Modulesk</p>
                          <ul className="curric-weeks">
                            {p.modules.map((m, wi) => (
                              <li key={m.w} className={`curric-week${selWeek === wi ? ' on' : ''}`}>
                                <button className="curric-week-head" onClick={() => pickWeek(i, wi)} aria-pressed={selWeek === wi}>
                                  <span className="curric-week-title">{m.w}</span>
                                  <span className="curric-week-caret">›</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="curric-detail-mid" ref={weekDetailRef} style={{ scrollMarginTop: 90 }}>
                          <p className="curric-label">Lesson plan</p>
                          <ul className="curric-modules">
                            {week.lessons.map(l => <li key={l}>{l}</li>)}
                          </ul>
                          <p className="curric-label" style={{ marginTop: 28 }}>Project you'll build</p>
                          <ul className="curric-modules">
                            {p.projects.map(pr => <li key={pr}>{pr}</li>)}
                          </ul>
                        </div>
                        <div className="curric-detail-tools">
                          <p className="curric-label">Tool stack</p>
                          <div className="curric-tools">
                            {p.tools.map(t => <ToolChip key={t} name={t} />)}
                          </div>
                        </div>
                      </div>
                        );
                      })()
                    ) : (
                      (() => {
                        const dom = p.domains[activeDomain];
                        const dWeek = dom.weeks[domainWeek] || dom.weeks[0];
                        return (
                      <>
                        <p className="curric-label">Choose a domain track</p>
                        <div className="curric-domains">
                          {p.domains.map((d, di) => (
                            <button
                              key={d.name}
                              className={`curric-domain${activeDomain === di ? ' on' : ''}`}
                              onClick={() => { setActiveDomain(di); setDomainWeek(0); }}
                            >
                              {d.name}<span className="curric-domain-caret">{activeDomain === di ? '▾' : '▸'}</span>
                            </button>
                          ))}
                        </div>
                        <div className="curric-detail--split curric-detail--triple" style={{ marginTop: 22 }}>
                          <div className="curric-detail-main">
                            <p className="curric-label">Modules · week by week</p>
                            <ul className="curric-weeks">
                              {dom.weeks.map((m, wi) => (
                                <li key={m.w} className={`curric-week${domainWeek === wi ? ' on' : ''}`}>
                                  <button className="curric-week-head" onClick={() => setDomainWeek(wi)} aria-pressed={domainWeek === wi}>
                                    <span className="curric-week-title">{m.w}</span>
                                    <span className="curric-week-caret">›</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="curric-detail-mid">
                            <p className="curric-label">Lesson plan</p>
                            <ul className="curric-modules">
                              {dWeek.lessons.map(l => <li key={l}>{l}</li>)}
                            </ul>
                            <p className="curric-label" style={{ marginTop: 28 }}>Project you'll build</p>
                            <ul className="curric-modules">
                              {dom.projects.map(pr => <li key={pr}>{pr}</li>)}
                            </ul>
                          </div>
                          <div className="curric-detail-tools">
                            <p className="curric-label">Tool stack</p>
                            <div className="curric-tools">
                              {dom.tools.map(t => <ToolChip key={t} name={t} />)}
                            </div>
                          </div>
                        </div>
                      </>
                        );
                      })()
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" onClick={openApply}>Download curriculum</button>
        </div>
      </section>

      {/* ── DOMAIN TRACKS ── */}
      <section className="section tracks-dark" style={{ paddingTop: 48 }}>
        <p className="section-label" style={{ color: 'var(--lavender)' }}>Domain tracks</p>
        <h2 className="section-h2" style={{ color: '#EEEDFE' }}>Your Claude skills,<br /><em>applied to your career.</em></h2>
        <p className="section-sub" style={{ color: 'rgba(238,237,254,0.5)' }}>Choose your track in Week 7.<br />Capstone, certification module, and job matching are all domain-specific.</p>
        <div className="tracks-grid">
          {TRACKS.map((t, i) => (
            <div key={i} className="track" style={t.dashed ? { borderStyle: 'dashed' } : {}}>
              <p className="track-name">{t.name}</p>
              <p className="track-role">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEAD FORM (brochure) ── */}
      <section className="mini-lead" style={{ paddingTop: 48 }}>
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>Get the Generalist <em>brochure & syllabus</em>.</h3>
            <p>Syllabus, schedule, fees & scholarships straight to your inbox.</p>
          </div>
          {done ? (
            <div className="mini-lead-success">✓ Brochure on its way.</div>
          ) : (
            <form className="mini-lead-form" onSubmit={handleSubmit}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              <select required aria-label="Track of interest" value={form.track} onChange={e => set('track', e.target.value)}>
                <option value="">Choose a track…</option>
                <option>Founder's Office</option>
                <option>Marketing</option>
                <option>Analyst</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>Technology</option>
                <option>Business owner — custom</option>
                <option>Not sure yet</option>
              </select>
              <button type="submit">Send brochure</button>
            </form>
          )}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail style={{ paddingTop: 48 }} />

      {/* ── HIRING PARTNERS ── */}
      <HiringJobs {...GEN_HIRING} />

      {/* ── PRICING ── */}
      <section className="section kp-section" style={{ background: '#ffffff', paddingTop: 8 }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Pricing</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>One fellowship. <em>Everything in.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 32px' }}>Ten weeks to AI Native mentorship, real projects, certification, and placement support.</p>
        <PricingCard {...genPricing} onCta={openApply} />
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <button className="btn-primary" style={{ minWidth: 220 }} onClick={openApply}>Book a call</button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center', paddingTop: 48 }}>
        <p className="section-label">FAQ</p>
        <h2 className="section-h2">Your questions answered</h2>
        <FaqList items={GENERALIST_FAQS} />
      </section>

      <CtaBanner
        badge="Applications open · 30 seats"
        title="Ready to become a Claude AI Generalist?"
        subtitle={<><span style={{ whiteSpace: 'nowrap' }}>No coding experience.</span> <span style={{ whiteSpace: 'nowrap' }}>Just 10 weeks and real ambition.</span></>}
        buttonText="Apply Now"
        onButtonClick={openApply}
      />

      <Footer />

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
