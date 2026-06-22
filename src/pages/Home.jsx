import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AccredSection from '../components/common/AccredSection';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import LeadForm from '../components/forms/LeadForm';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import Reveal from '../components/common/Reveal';
import MentorsRail from '../components/common/MentorsRail';
import { useToast } from '../components/common/Toast';
const Hero3D = lazy(() => import('../components/common/Hero3D'));
import { HOME_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';
import { PROJECTS, PROJECTS_QUERY, tagClassFor } from '../data/projectsData';
import { useContent } from '../lib/useContent';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { BrandLogo } from '../components/common/PartnersMarquee';
import HiringRail from '../components/common/HiringRail';
import TestimonialsColumns from '../components/common/TestimonialsColumns';

// Menler community links — set the real Discord / WhatsApp / Facebook URLs here.
const COMMUNITY_LINKS = {
  discord: '#',
  whatsapp: '#',
  facebook: '#',
};

// Hiring-association companies. Each chip tries the local logo file first
// (drop official PNG/SVGs in /public/logos with the names below), then the
// Clearbit logo CDN by domain, then a clean text name d.
const HIRING_COMPANIES = [
  { name: 'Ringg AI', domain: 'ringg.ai', logo: '/logos/ringg.png' },
  { name: 'MyGate', domain: 'mygate.com', logo: '/logos/mygate_new.png' },
  { name: 'Zolve', domain: 'zolve.com', logo: '/logos/zolve.png' },
  { name: 'Instawork', domain: 'instawork.com', logo: '/logos/instawork.png' },
  { name: 'Lyzr', domain: 'lyzr.ai', logo: '/logos/lyzr.png' },
  { name: 'Emergent', domain: 'emergent.sh', logo: '/logos/emergent.png' },
  { name: 'Gushwork', domain: 'gushwork.ai', logo: '/logos/gushwork.png' },
  { name: 'Cars24', domain: 'cars24.com', logo: '/logos/cars24.png' },
  { name: 'Matters', domain: 'matters.ai', logo: '/logos/matters.png' },
  { name: 'Razorpay', domain: 'razorpay.com', logo: '/logos/razorpay.png' },
  { name: 'Figr', domain: 'figr.design', logo: '/logos/figr.png' },
  { name: 'Mercor', domain: 'mercor.com', logo: '/logos/mercor.png' },
  { name: 'Adobe', domain: 'adobe.com', logo: '/logos/adobe.png' },
  { name: 'Sarvam AI', domain: 'sarvam.ai', logo: '/logos/sarvam_ai_logo.png' },
  { name: 'Anthropic', domain: 'anthropic.com', logo: '/logos/anthropic.png' },
  { name: 'PwC', domain: 'pwc.com', logo: '/logos/pwc.png' },
  { name: 'Cognizant', domain: 'cognizant.com', logo: '/logos/cognizant.png' },
  { name: 'Accenture', domain: 'accenture.com', logo: '/logos/accenture.png' },
  { name: 'Flipkart', domain: 'flipkart.com', logo: '/logos/flipkart.png' },
  { name: 'Autodesk', domain: 'autodesk.com', logo: '/logos/autodesk.png' },
  { name: 'AnyDesk', domain: 'anydesk.com', logo: '/logos/anydesk.png' },
  { name: 'MathCo', domain: 'themathcompany.com', logo: '/logos/mathco.png' },
  { name: 'Masai', domain: 'masaischool.com', logo: '/logos/masai.png' },
  { name: 'Scaler', domain: 'scaler.com', logo: '/logos/scaler.png' },
  { name: 'PhysicsWallah', domain: 'pw.live', logo: '/logos/physicswallah.png' },
];

// Small logo shown inside each project's tool-stack pill. Conceptual items
// (RAG, Multimodal, Web search, Citations, Agentic design, Prompt patterns)
// have no logo and render as text only.
const TOOL_LOGO = {
  'Claude API': '/logos/claude.svg',
  'Claude Projects': '/logos/claude.svg',
  'Cowork': '/logos/claude.svg',
  'Skills': '/logos/claude.svg',
  'Tool use': '/logos/claude.svg',
  'MCP': '/logos/mcp.svg',
  'MCP SDK': '/logos/mcp.svg',
  'Python': '/logos/python.svg',
};

// "Builders from" company logos shown on the program cards.
const GEN_BUILDERS = [
  { name: 'Flipkart', domain: 'flipkart.com', logo: '/logos/flipkart-new-logo.png' },
  { name: 'McKinsey', domain: 'mckinsey.com', logo: '/logos/mckinsey.png' },
  { name: 'Black Tiger Cement', domain: 'blacktigercement.com', logo: '/logos/black_tiger_cement.png' },
  { name: 'Zendesk', domain: 'zendesk.com' },
  { name: 'Al Yusr Leasing & Financing', domain: 'alyusr.com' },
];
const ENG_BUILDERS = [
  { name: 'Google', domain: 'google.com' },
  { name: 'Razorpay', domain: 'razorpay.com', logo: '/logos/razorpay.png' },
  { name: 'Autodesk', domain: 'autodesk.com', logo: '/logos/autodesk.png' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'Samsung', domain: 'samsung.com' },
];

// GenAI toolstack — shown in the home "tech stack" section.
const TECH = [
  { name: 'Claude', logo: '/logos/claude.svg' },
  { name: 'Perplexity', logo: '/logos/perplexity.svg' },
  { name: 'NotebookLM', logo: '/logos/google-notebook-lm.png' },
  { name: 'Notion AI', logo: '/logos/notion.png' },
  { name: 'Gamma', logo: '/logos/gamma.png' },
  { name: 'Canva AI', logo: '/logos/canva.png' },
  { name: 'Granola', logo: '/logos/granola_ai.png' },
  { name: 'Fireflies', logo: '/logos/fireflies.png' },
  { name: 'ElevenLabs', logo: '/logos/elevenlabs.png' },
  { name: 'Runway', logo: '/logos/runway.png' },
  { name: 'HeyGen', logo: '/logos/heygen.png' },
  { name: 'n8n', logo: '/logos/n8n.png' },
  { name: 'Zapier', logo: '/logos/zapier.png' },
  { name: 'Lovable', logo: '/logos/lovable-logo.png' },
  { name: 'Emergent', logo: '/logos/emergent.png' },
  { name: 'Lyzr', logo: '/logos/lyzr.png' },
];

const STORIES = [
  { quote: '"We\'re seeing plenty of AI certificates in the market. What\'s rare are candidates who can demonstrate real builds. Menler\'s portfolio-led model makes evaluation significantly easier."', initials: 'TP', name: 'Talent Partner', trans: 'High-Growth SaaS Company', cls: '' },
  { quote: '"What stood out was the portfolio-first approach. Fellows aren\'t just learning concepts; they\'re shipping assets, agents, and workflows that can be reviewed by employers."', initials: 'NS', name: 'Neha Sinha', trans: 'Founder · AI Automation Studio', cls: 'dark' },
  { quote: '"I joined expecting another AI course. Instead, I left with a portfolio I could actually discuss in interviews and a much clearer understanding of how AI is used inside real businesses"', initials: 'BF', name: 'Beta Fellow', trans: 'Cohort 0', cls: 'green' },
  { quote: '"The strongest signal for us is proof of work. Menler\'s focus on projects, reviews, and operator mentorship aligns far better with how modern AI hiring decisions are made."', initials: 'HM', name: 'Hiring Manager', trans: 'AI & Automation Practice', cls: '', avatarStyle: { background: '#FAEEDA', color: '#854F0B' } },
  { quote: '"Most AI programs teach prompts. Menler teaches systems. The curriculum focuses on workflows, evaluation, deployment, and business impact — the things operators actually get measured on."', initials: 'BF', name: 'Arjun Menon', trans: 'AI Product Lead · Enterprise Automation', cls: 'dark' },
  { quote: '"The biggest difference was learning from practitioners who use AI every day. Every session felt connected to actual workflows rather than theory."', initials: 'BF', name: 'Beta Fellow', trans: 'Cohort 0', cls: 'green' },
];

// One toolstack chip. Falls back to text-only if the logo fails to load.
function ToolStackChip({ tool }) {
  const [ok, setOk] = useState(!!tool.logo);
  return (
    <div className="toolstack-chip">
      {ok && <img className="toolstack-logo" src={tool.logo} alt="" aria-hidden="true" onError={() => setOk(false)} />}
      <span className="toolstack-name">{tool.name}</span>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  // Smooth-scroll to a section ref, driving Lenis when it's active (Lenis sets
  // scroll-behavior:auto, so native scrollIntoView would otherwise jump).
  const smoothTo = (el) => {
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth' });
  };
  const interestRef = useRef(null);
  const scrollToInterest = () => smoothTo(interestRef.current);
  const programsRef = useRef(null);
  const scrollToPrograms = () => smoothTo(programsRef.current);
  const location = useLocation();
  useEffect(() => {
    if (location.hash === '#programs') {
      const t = setTimeout(() => smoothTo(programsRef.current), 120);
      return () => clearTimeout(t);
    }
  }, [location]);

  // "What you build" — a curated set of 8 (one per domain) shown on Home only;
  // "Explore more" opens the full library page. Editing this list does NOT change
  // the Library page (it renders the full PROJECTS array).
  // Ordered alphabetically by domain name (the tag shown on each card).
  const HOME_PROJECT_SLUGS = [
    'research-synthesis-insight-engine',   // Data & Business Analysts
    'production-rag-pipeline-custom-mcp',  // Engineering
    'retail-support-rag-service',          // Engineering
    'deal-flow-triage-agent',              // Finance Operations
    'ceo-decision-intelligence-agent',     // Founder's Office
    'ai-job-matching-workflow',            // HR Operations
    'always-on-content-outreach-engine',   // Marketing & Sales
    'pmo-status-agent',                    // Product Management
  ];
  const projects = useContent(PROJECTS_QUERY, PROJECTS);
  // Editable page copy (hero + CTA) from Sanity; each field falls back to the
  // original hardcoded design when not set in the Studio.
  const home = useContent('*[_type == "homePage"][0]{hero, programs, projects, toolstack, ctaBanner}', null);
  const visibleProjects = HOME_PROJECT_SLUGS
    .map(slug => projects.find(p => p.slug === slug))
    .filter(Boolean);

  // "Apply to the Fellowship" opens the lead form in a popup.
  const [showApply, setShowApply] = useState(false);
  useEffect(() => {
    if (!showApply) return;
    const onKey = (e) => { if (e.key === 'Escape') setShowApply(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [showApply]);

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
      <Seo
        title="Menler — AI Learning India · Claude AI Fellowship & Courses"
        description="India's Claude-native AI learning. AI courses & fellowships — Generalist (no-code), Engineering, and the Gen AI Kickstarter. Real projects."
        keywords="AI learning India, AI courses India, AI fellowship India, Claude AI fellowship, AI upskilling India, AI skills training, AI-native work, AI-native workforce, AI careers India, AI jobs future, AI workflows, AI automation workflows, best AI tools, AI productivity tools, large language models explained, enterprise AI transformation, AI adoption, AI bootcamp India"
        path="/"
      />
      {/* ── HERO ── */}
      <section className="hero" aria-label="Hero — Menler Fellowship">
        <div className="hero-ring r1" /><div className="hero-ring r2" /><div className="hero-ring r3" />
        <div className="hero-grid">
        <div className="hero-visual" aria-hidden="true">
          {/* If WebGL/3D fails (e.g. hardware accel disabled), skip it — don't crash the page. */}
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}><Hero3D /></Suspense>
          </ErrorBoundary>
        </div>
        <div className="hero-inner">
          <p className="hero-eyebrow">{home?.hero?.eyebrow || 'Menler Fellowship'}</p>
          {home?.hero?.heading
            ? <h1 className="hero-h1" style={{ whiteSpace: 'pre-line' }}>{home.hero.heading}</h1>
            : <h1 className="hero-h1">Your turning point<br /><em>in the AI era.</em></h1>}
          {home?.hero?.sub
            ? <p className="hero-sub" style={{ whiteSpace: 'pre-line' }}>{home.hero.sub}</p>
            : <p className="hero-sub">India's only Claude AI Specialist Fellowship.<strong style={{ color: '#EEEDFE', fontWeight: 350 }}><br />Learning that ships. Credential that counts. Outcomes that compound.</strong></p>}
          <div className="hero-actions">
            <button className="btn-primary" onClick={scrollToPrograms}>Check Fellowship Program</button>
            <button className="btn-outline" onClick={() => go('/aptitude')}>Take the AI Aptitude Test</button>
          </div>
          <p className="hero-metrics-label">Menler Fellowship · at a glance</p>
          {home?.hero?.stats?.length ? (
            <div className="hero-stats">
              {home.hero.stats.map((s, i) => (
                <div key={i}><span className="hero-stat-num">{s.value}</span><span className="hero-stat-lbl" style={{ whiteSpace: 'pre-line' }}>{s.label}</span></div>
              ))}
            </div>
          ) : (
            <div className="hero-stats">
              <div><span className="hero-stat-num">90%</span><span className="hero-stat-lbl">Interview Pipeline<br />Target</span></div>
              <div><span className="hero-stat-num">25+</span><span className="hero-stat-lbl">Hiring<br />Associations</span></div>
              <div><span className="hero-stat-num">20+</span><span className="hero-stat-lbl">AI Builders<br />& Operators</span></div>
              <div><span className="hero-stat-num">12</span><span className="hero-stat-lbl">Weeks Intensive<br />Fellowship</span></div>
              <div><span className="hero-stat-num">6+</span><span className="hero-stat-lbl">Domain<br />Tracks</span></div>
            </div>
          )}
        </div>
        </div>
      </section>

      {/* ── ACCREDITATION ── */}
      <AccredSection />

      {/* ── PROGRAMS ── */}
      <section className="section prog-section" style={{ background: 'var(--parchment)', paddingTop: 40, paddingBottom: 28 }} ref={programsRef}>
        <p className="section-label">{home?.programs?.label || 'Choose your program'}</p>
        <h2 className="section-h2">{home?.programs?.heading || 'Two Paths, One Outcome'} <br /><em>{home?.programs?.headingEm || 'AI Native You!'}</em></h2>
        {home?.programs?.sub
          ? <p className="section-sub prog-sub-wide" style={{ whiteSpace: 'pre-line' }}>{home.programs.sub}</p>
          : <p className="section-sub prog-sub-wide">Both fellowships lead to a recognised AI Specialist credential and active career support.<br />Pick the one that fits your background.</p>}
        <div className="prog-compare">
          <div className="prog-card gen">
            <span className="prog-card-badge">No coding required</span>
            <p className="prog-card-title">Claude AI Generalist</p>
            <div className="prog-card-desc">
              <p className="prog-card-sub">Master Claude AI, across all domains, get certified and graduate with a domain focused portfolio.</p>
              <p className="prog-card-sub">Analyst · Finance Operations · Founder's Office · HR Operations · Marketing & Sales · Product Management</p>
            </div>
            <p className="prog-card-for">AI Builders from</p>
            <div className="prog-card-logos">
              {GEN_BUILDERS.map(c => <BrandLogo key={c.name} name={c.name} domain={c.domain} logo={c.logo} />)}
            </div>
            <div className="next-batch">
              <div className="nb-info">
                <p className="nb-label">Batch starts</p>
                <p className="nb-when"><strong>August 2026</strong></p>
                <p className="nb-deadline">Applications close by 25 July 2026</p>
              </div>
              <div className="nb-chips">
                <span className="nb-chip">10 Weeks</span>
                <span className="nb-chip">Live Classes</span>
                <span className="nb-chip">Career Development</span>
              </div>
            </div>
            <button className="prog-card-cta" onClick={() => go('/generalist')}>Explore Generalist Program</button>
          </div>
          <div className="prog-card eng">
            <span className="prog-card-badge">Coding experience required</span>
            <p className="prog-card-title">Claude AI Engineering</p>
            <div className="prog-card-desc">
              <p className="prog-card-sub">Master Claude AI, build AI applications, get certified and graduate with a portfolio of AI projects</p>
              <p className="prog-card-sub">AI Agent Engineer · AI Application Developer · AI Consultant · AI Engineer · AI Automation Engineer</p>
            </div>
            <p className="prog-card-for">AI Builders from</p>
            <div className="prog-card-logos">
              {ENG_BUILDERS.map(c => <BrandLogo key={c.name} name={c.name} domain={c.domain} logo={c.logo} />)}
            </div>
            <div className="next-batch">
              <div className="nb-info">
                <p className="nb-label">Batch Starts</p>
                <p className="nb-when"><strong>September 2026</strong></p>
                <p className="nb-deadline">Applications open by 25 July 2026</p>
              </div>
              <div className="nb-chips">
                <span className="nb-chip">12 Weeks</span>
                <span className="nb-chip">Live Classes</span>
                <span className="nb-chip">Career Development</span>
              </div>
            </div>
            <button className="prog-card-cta" onClick={() => go('/engineering')}>Explore Engineering Program</button>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="prog-card-cta" style={{ background: 'var(--ink)', color: '#fff', minWidth: 200, '--beam': '#26215C', '--beam-hot': '#AFA9EC' }} onClick={() => setShowApply(true)}>Book a call</button>
        </div>
      </section>

      {/* ── WHAT YOU BUILD ── */}
      <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label">{home?.projects?.label || 'What you build'}</p>
        <h2 className="section-h2">{home?.projects?.heading || 'Real Projects.'}<br /><em>{home?.projects?.headingEm || 'Across Every Domain.'}</em></h2>
        {home?.projects?.sub
          ? <p className="section-sub proj-build-sub" style={{ whiteSpace: 'pre-line' }}>{home.projects.sub}</p>
          : <p className="section-sub proj-build-sub">Every Menler fellow ships a portfolio of domain specific projects.<br />Not toy demos actual systems built for real use cases.</p>}
        <div className="proj-grid proj-grid--4 proj-grid--home">
          {visibleProjects.map((p, i) => (
            <Reveal
              as="article"
              key={p.slug}
              delay={Math.min(i, 5) * 60}
              className="proj-card proj-card--clickable"
              role="button"
              tabIndex={0}
              onClick={() => go(`/projects/${p.slug}`)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(`/projects/${p.slug}`); } }}
            >
              {p.image && <div className="proj-card-img"><img src={p.image} alt={p.title} loading="lazy" /></div>}
              <span className={`proj-domain-tag ${tagClassFor(p)}`}>{p.tag}</span>
              <h3 className="proj-card-title">{p.title}</h3>
              <p className="proj-card-desc">{p.desc}</p>
              <div className="proj-stack">{p.stack.map(s => (
                <span key={s}>{s}</span>
              ))}</div>
              <p className="proj-outcome">{p.outcome}</p>
              <span className="proj-card-link">View project</span>
            </Reveal>
          ))}
        </div>
        {projects.length > visibleProjects.length && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn-outline" style={{ color: 'var(--specialist)', borderColor: 'rgba(83,74,183,0.5)', minWidth: 200 }} onClick={() => go('/resources#project-builds')}>
              Explore more
            </button>
          </div>
        )}
      </section>

      {/* ── TECH STACK ── */}
      <section className="section toolstack-section" style={{ paddingBottom: 72 }}>
        <h2 className="toolstack-title">{home?.toolstack?.title || 'Your GenAI toolstack'}</h2>
        <p className="toolstack-sub">{home?.toolstack?.sub || 'Get hands on with AI tools from your first prompt to your first real project.'}</p>
        <div className="toolstack-grid">
          {[TECH.slice(0, 5), TECH.slice(5, 11), TECH.slice(11, 16)].map((row, ri) => (
            <div key={ri} className="toolstack-row">
              {row.map(t => <ToolStackChip key={t.name} tool={t} />)}
            </div>
          ))}
        </div>
      </section>

      {/* ── MINI LEAD ── */}
      <section className="mini-lead">
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>Get the Menler fellowship <em>brochure.</em></h3>
            <p>Syllabus, schedule, fees & scholarships straight to your inbox.</p>
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
              <button type="submit">Send brochure</button>
            </form>
          )}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail style={{ paddingTop: 48, paddingBottom: 32 }} />

      {/* ── JOIN OUR COMMUNITY ── */}
      <section className="section" style={{ paddingTop: 8, paddingBottom: 40 }}>
        <div className="lp2-community-wrap">
          <h2 className="lp2-comm-h-out">Join our Menler <em>community</em></h2>
          <div className="lp2-community lp2-community--row">
            <p className="lp2-comm-sub">Updates, resources &amp; support across all our channels.</p>
            <div className="lp2-comm-grid">
            <a className="lp2-comm-card lp2-comm-card--discord" href={COMMUNITY_LINKS.discord} target="_blank" rel="noopener noreferrer" aria-label="Join our Discord">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.371-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.245.197.372.291a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a className="lp2-comm-card lp2-comm-card--whatsapp" href={COMMUNITY_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Join our WhatsApp community">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </a>
            <a className="lp2-comm-card lp2-comm-card--facebook" href={COMMUNITY_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Join us on Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── HIRING PARTNERS & ROLES ── */}
      <section className="section jobs-section" style={{ paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label">Hiring associations &amp; roles</p>
        <h2 className="section-h2">The jobs<br /><em>AI specialists are landing.</em></h2>
        <p className="section-sub section-sub--1line hiring-cat-sub">A new category of professional is emerging: AI Native, Domain, and Outcome driven.<br />Menler is built to develop them.</p>
        <div className="jobs-roles">
          <div className="role-card gen-side">
            <p className="role-card-program">Claude AI Generalist · Open roles</p>
            <div className="role-list">
              <div className="role-row"><p className="role-name">AI Specialist</p><p className="role-band">₹12–22L · Domain teams</p></div>
              <div className="role-row"><p className="role-name">AI Strategist</p><p className="role-band">₹15–28L · Consulting &amp; in-house</p></div>
              <div className="role-row"><p className="role-name">Founder's Office Associate</p><p className="role-band">₹14–24L · Startups &amp; funds</p></div>
              <div className="role-row"><p className="role-name">AI Product Manager </p><p className="role-band">₹14–25L · Brand &amp; growth teams</p></div>
              <div className="role-row"><p className="role-name">Operations AI Analyst</p><p className="role-band">₹10–18L · Ops &amp; finance</p></div>
              <div className="role-row"><p className="role-name">Domain AI Consultant</p><p className="role-band">₹15–30L · Boutique consulting</p></div>
              <div className="role-row"><p className="role-name">Marketing AI Lead</p><p className="role-band">₹16–30L · SaaS &amp; platforms</p></div>
              <div className="role-row"><p className="role-name">Finance AI Analyst</p><p className="role-band">₹12–22L · BFSI &amp; fintech</p></div>
              <div className="role-row"><p className="role-name">Customer Experience AI Lead</p><p className="role-band">₹12–20L · Support &amp; success</p></div>
              <div className="role-row"><p className="role-name">Sales AI Specialist</p><p className="role-band">₹12–24L · Revenue &amp; GTM teams</p></div>
            </div>
          </div>
          <div className="role-card eng-side">
            <p className="role-card-program">Claude AI Engineering · Open roles</p>
            <div className="role-list">
              <div className="role-row"><p className="role-name">Forward Deployed Engineer</p><p className="role-band">₹20–40L · Product, engineering &amp; AI teams</p></div>
              <div className="role-row"><p className="role-name">AI Solutions Engineer</p><p className="role-band">₹22–45L · Enterprise AI &amp; solution delivery teams</p></div>
              <div className="role-row"><p className="role-name">AI Agent Engineer</p><p className="role-band">₹22–40L · Agentic AI, workflow automation &amp; platform teams</p></div>
              <div className="role-row"><p className="role-name">Applied AI Engineer</p><p className="role-band">₹20–40L · AI-native startups &amp; product companies</p></div>
              <div className="role-row"><p className="role-name">LLMOps Engineer</p><p className="role-band">₹22–42L · Production AI, deployment &amp; infrastructure teams</p></div>
              <div className="role-row"><p className="role-name">AI Platform Engineer</p><p className="role-band">₹25–48L · Enterprise AI platforms &amp; developer tooling</p></div>
              <div className="role-row"><p className="role-name">AI Infrastructure Engineer</p><p className="role-band">₹24–46L · Cloud, infrastructure &amp; AI systems teams</p></div>
              <div className="role-row"><p className="role-name">AI Systems Engineer</p><p className="role-band">₹28–55L · Multi-agent systems &amp; AI-first startups</p></div>
              <div className="role-row"><p className="role-name">AI Research Engineer</p><p className="role-band">₹25–55L · Frontier AI labs &amp; research teams</p></div>
              <div className="role-row"><p className="role-name">AI Safety Engineer</p><p className="role-band">₹24–48L · Trust, reliability &amp; AI governance teams</p></div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 18, fontStyle: 'italic', lineHeight: 1.6 }}>*Salary bands sourced from fellowship partner intake. Updated quarterly.</p>
        <div className="partners-strip">
          <p className="partners-label">Hiring associations · 25+ companies</p>
          <HiringRail companies={HIRING_COMPANIES} rows={2} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="prog-card-cta" style={{ background: 'var(--ink)', color: '#fff', minWidth: 200, '--beam': '#26215C', '--beam-hot': '#AFA9EC' }} onClick={() => setShowApply(true)}>Book a call</button>
        </div>
      </section>

      {/* ── WHAT YOU LEAVE WITH ── */}
      <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label">What you leave with</p>
        <h2 className="section-h2">Every fellow graduates<br /><em>with all five.</em></h2>
        <div className="outcomes-grid">
          <div className="outcome dark">
            <span className="outcome-num">01</span>
            <p className="outcome-title">Claude Specialist certification</p>
            <p className="outcome-desc">Domain Specific badge. The Only Claude Native career credential in the AI ecosystem.</p>
          </div>
          <div className="outcome">
            <span className="outcome-num">02</span>
            <p className="outcome-title">Domain project portfolio</p>
            <p className="outcome-desc">Real projects published, documented, and demo-ready by Week 12.</p>
          </div>
          <div className="outcome">
            <span className="outcome-num">03</span>
            <p className="outcome-title">Interview Pipeline in your domain</p>
            <p className="outcome-desc">Matched to employers in your track. Demo Day puts you in front of decision makers.</p>
          </div>
          <div className="outcome purple">
            <span className="outcome-num" style={{ color: 'var(--specialist)' }}>04</span>
            <p className="outcome-title">AI business strategy fluency</p>
            <p className="outcome-desc">Pitch AI investments, design roadmaps, communicate ROI  regardless of seniority or background.</p>
          </div>
          <div className="outcome" style={{ gridColumn: '1/-1', background: 'var(--cloud)' }}>
            <span className="outcome-num" style={{ color: 'var(--specialist)' }}>05</span>
            <p className="outcome-title">The Menler network — your circle for the AI era</p>
            <p className="outcome-desc">Fellows across both programs, across 7 domains. Permanent alumni access. The people who understand where you're going.</p>
          </div>
        </div>
      </section>

      {/* ── WHY MENLER METRICS ── */}
      <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label">Why Menler</p>
        <h2 className="section-h2">Built around outcomes,<br /><em>measured against them.</em></h2>
        <p className="section-sub"> Every technological shift creates a new class of professionals.<br />Menler exists to build the AI Native generation.</p>
        <div className="metrics-strip">
          <Reveal className="metric-tile dark" delay={0}>
            <span className="metric-num">90%</span>
            <p className="metric-label">Interview Pipeline Target</p>
            <p className="metric-desc">Our placement goal every fellow into an active interview pipeline within 90 days, across our domain tracks.</p>
          </Reveal>
          <Reveal className="metric-tile green" delay={70}>
            <span className="metric-num">25+</span>
            <p className="metric-label">Hiring associations</p>
            <p className="metric-desc">Founder's offices, VC-backed startups, marketing agencies, finance teams, and AI native companies actively hiring AI talent. </p>
          </Reveal>
          <Reveal className="metric-tile" delay={140}>
            <span className="metric-num">12</span>
            <p className="metric-label">Weeks to credential</p>
            <p className="metric-desc">AI Fluency. Agentic Building. Domain Specialisation. An operator led path that's faster than a diploma and deeper than a course.</p>
          </Reveal>
          <Reveal className="metric-tile" delay={210}>
            <span className="metric-num">6+</span>
            <p className="metric-label">Domain tracks</p>
            <p className="metric-desc">Analyst · Finance Operations · Founder's Office · HR Operations · Marketing &amp; Sales · Product Management</p>
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
              <li>Get scholarship check</li>
              <li>Book a 1:1 admissions call</li>
              <li>Be the first to hear about upcoming batch dates</li>
            </ul>
          </div>
          <LeadForm />
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <TestimonialsColumns />

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'white', textAlign: 'center' }}>
        <p className="section-label">Common questions</p>
        <h2 className="section-h2">Everything you<br /><em>want to know.</em></h2>
        <FaqList items={HOME_FAQS} />
      </section>

      {/* ── CTA ── */}
      <CtaBanner
        badge={home?.ctaBanner?.badge || 'Applications open · Limited seats per program'}
        title={home?.ctaBanner?.title || 'Your Menler starts here.'}
        subtitle={home?.ctaBanner?.subtitle || <><span style={{ whiteSpace: 'nowrap' }}>Choose your program.</span> <span style={{ whiteSpace: 'nowrap' }}>Build your credential.</span> <span style={{ whiteSpace: 'nowrap' }}>Get placed.</span></>}
        buttonText={home?.ctaBanner?.buttonText || 'Apply to the Fellowship'}
        onButtonClick={() => setShowApply(true)}
      />

      <Footer />

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
