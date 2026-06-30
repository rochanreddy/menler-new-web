import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AccredSection from '../components/common/AccredSection';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import LeadForm from '../components/forms/LeadForm';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import Reveal from '../components/common/Reveal';
import MentorsRail from '../components/common/MentorsRail';
import MenlerCommunitySection from '../components/common/MenlerCommunitySection';
import { useToast } from '../components/common/Toast';
const Hero3D = lazy(() => import('../components/common/Hero3D'));
import { HOME_FAQS } from '../data/faqData';
import { verifyAndDownloadBrochure } from '../lib/brochure';
import { PROJECTS, PROJECTS_QUERY, tagClassFor } from '../data/projectsData';
import { useContent } from '../lib/useContent';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { BrandLogo } from '../components/common/PartnersMarquee';
import HiringRail from '../components/common/HiringRail';
import TestimonialsColumns from '../components/common/TestimonialsColumns';

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
      await verifyAndDownloadBrochure({
        email: miniEmail,
        program: miniProgram || 'generalist',
        resource: `${miniProgram || 'Menler'} Brochure`,
        source: 'mini-lead',
        cta_label: 'Home mini-lead brochure',
        section: miniProgram || 'Home',
      });
      setMiniDone(true);
      toast.success('Verified — your brochure is downloading.');
    } catch {
      toast.error("Couldn't verify just now. Please try again.");
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
          <button className="prog-card-cta" style={{ background: 'var(--ink)', color: '#fff', minWidth: 200, '--beam': '#26215C', '--beam-hot': '#AFA9EC' }} onClick={() => setShowApply(true)}>Book a Call</button>
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
            <p>Syllabus, schedule, fees & scholarships — verify your email and download it instantly.</p>
          </div>
          {miniDone ? (
            <div className="mini-lead-success">✓ Brochure downloading.</div>
          ) : (
            <form className="mini-lead-form" onSubmit={handleMiniLead}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={miniEmail} onChange={e => setMiniEmail(e.target.value)} autoComplete="email" />
              <select required aria-label="Program of interest" value={miniProgram} onChange={e => setMiniProgram(e.target.value)}>
                <option value="">Program</option>
                <option>Generalist</option>
                <option>Engineering</option>
                <option>Not sure</option>
              </select>
              <button type="submit">Verify & Download</button>
            </form>
          )}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail style={{ paddingTop: 48, paddingBottom: 32 }} />

      <MenlerCommunitySection className="menler-community--page" />

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
          <button className="prog-card-cta" style={{ background: 'var(--ink)', color: '#fff', minWidth: 200, '--beam': '#26215C', '--beam-hot': '#AFA9EC' }} onClick={() => setShowApply(true)}>Book a Call</button>
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
            <div className="apply-modal-media apply-modal-media--logo">
              <MenlerWordmark size={46} theme="dark" tagline />
            </div>
            <div className="apply-modal-form">
              <LeadForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
