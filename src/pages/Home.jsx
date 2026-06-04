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
import { PROJECTS } from '../data/projectsData';
import { BrandLogo } from '../components/common/PartnersMarquee';
import HiringRail from '../components/common/HiringRail';

// Hiring-association companies. Each chip tries the local logo file first
// (drop official PNG/SVGs in /public/logos with the names below), then the
// Clearbit logo CDN by domain, then a clean text name.
const HIRING_COMPANIES = [
  { name: 'Ringg AI', domain: 'ringg.ai', logo: '/logos/ringg.png' },
  { name: 'MyGate', domain: 'mygate.com', logo: '/logos/mygate.png' },
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
  { name: 'OpenAI', domain: 'openai.com', logo: '/logos/openai.png' },
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
  { name: 'Flipkart', domain: 'flipkart.com', logo: '/logos/flipkart.png' },
  { name: 'Zolve', domain: 'zolve.com', logo: '/logos/zolve.png' },
  { name: 'NTT Data', domain: 'nttdata.com' },
  { name: 'Equifax', domain: 'equifax.com' },
];
const ENG_BUILDERS = [
  { name: 'Google', domain: 'google.com' },
  { name: 'Fractal', domain: 'fractal.ai' },
  { name: 'Autodesk', domain: 'autodesk.com', logo: '/logos/autodesk.png' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'Samsung', domain: 'samsung.com' },
];

// GenAI toolstack — shown in the home "tech stack" section.
const TECH = [
  { name: 'ChatGPT', logo: '/logos/chatgpt.png' },
  { name: 'Lyzr', logo: '/logos/lyzr.png' },
  { name: 'Claude Code', logo: '/logos/claude.svg' },
  { name: 'Perplexity', logo: '/logos/perplexity.svg' },
  { name: 'Runway', logo: '/logos/runway.png' },
  { name: 'Zapier', logo: '/logos/zapier.png' },
  { name: 'Gemini', logo: '/logos/gemini.png' },
  { name: 'Midjourney', logo: '/logos/midjourney.png' },
  { name: 'Bolt', logo: '/logos/bolt.png' },
  { name: 'ElevenLabs', logo: '/logos/elevenlabs.png' },
  { name: 'n8n', logo: '/logos/n8n.png' },
  { name: 'Pika', logo: '/logos/pika.png' },
  { name: 'HeyGen', logo: '/logos/heygen.png' },
];

const STORIES = [
  { quote: '"We\'re seeing plenty of AI certificates in the market. What\'s rare are candidates who can demonstrate real builds. Menler\'s portfolio-led model makes evaluation significantly easier."', initials: 'TP', name: 'Talent Partner', trans: 'High-Growth SaaS Company', cls: '' },
  { quote: '"What stood out was the portfolio-first approach. Fellows aren\'t just learning concepts; they\'re shipping assets, agents, and workflows that can be reviewed by employers."', initials: 'NS', name: 'Neha Sinha', trans: 'Founder · AI Automation Studio', cls: 'dark' },
  { quote: '"I joined expecting another AI course. Instead, I left with a portfolio I could actually discuss in interviews and a much clearer understanding of how AI is used inside real businesses"', initials: 'BF', name: 'Beta Fellow', trans: 'Cohort 0', cls: 'green' },
  { quote: '"The strongest signal for us is proof of work. Menler\'s focus on projects, reviews, and operator mentorship aligns far better with how modern AI hiring decisions are made."', initials: 'HM', name: 'Hiring Manager', trans: 'AI & Automation Practice', cls: '', avatarStyle: { background: '#FAEEDA', color: '#854F0B' } },
  { quote: '"Most AI programs teach prompts. Menler teaches systems. The curriculum focuses on workflows, evaluation, deployment, and business impact — the things operators actually get measured on."', initials: 'BF', name: 'Arjun Menon', trans: 'AI Product Lead · Enterprise Automation', cls: 'dark' },
  { quote: '"The biggest difference was learning from practitioners who use AI every day. Every session felt connected to actual workflows rather than theory."', initials: 'BF', name: 'Beta Fellow', trans: 'Cohort 0', cls: 'green' },
];

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const interestRef = useRef(null);
  const scrollToInterest = () => interestRef.current?.scrollIntoView({ behavior: 'smooth' });

  // "What you build" — show a subset; "Explore more" opens the full library page.
  const PROJECTS_PREVIEW = 6;
  const visibleProjects = PROJECTS.slice(0, PROJECTS_PREVIEW);

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
          <p className="hero-sub">India's 1st Claude AI Specialist Fellowship.<strong style={{ color: '#EEEDFE', fontWeight: 350 }}><br />Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => go('/programs')}>Check Fellowship Program</button>
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
        <h2 className="section-h2">Two Paths, One Outcome <br /><em>AI Native You!</em></h2>
        <p className="section-sub">Both fellowships lead to a recognised AI Specialist credential and active Interview support. Pick the one that fits your background — or talk to our Career Advisor and let us help you decide.</p>
        <div className="prog-compare">
          <div className="prog-card gen">
            <span className="prog-card-badge">No coding required</span>
            <p className="prog-card-title">Claude AI Generalist</p>
            <p className="prog-card-sub">India's first no-code Claude AI specialist program. Master Claude across your domain — Founder's Office, VC, Marketing, Analyst, Finance, Operations, Technology — and graduate as a certified AI Specialist with a domain portfolio.</p>
            <p className="prog-card-for">Builders from</p>
            <div className="prog-card-logos">
              {GEN_BUILDERS.map(c => <BrandLogo key={c.name} name={c.name} domain={c.domain} logo={c.logo} />)}
            </div>
            <div className="next-batch">
              <p className="nb-label">Batch starts</p>
              <p className="nb-when"><strong>August 2026</strong>  ·  12 weeks  ·  Online</p>
              <p className="nb-deadline">Applications close 25 July 2026</p>
            </div>
            <button className="prog-card-cta" onClick={() => go('/generalist')}>Explore Generalist Program</button>
          </div>
          <div className="prog-card eng">
            <span className="prog-card-badge">Coding experience required</span>
            <p className="prog-card-title">Claude AI Engineering</p>
            <p className="prog-card-sub">India's most rigorous Claude AI engineering certification. Build the full Claude stack — API, RAG, MCP, multi-agent systems, computer use, evals, and deployed AI apps — and earn the AI Engineer credential.</p>
            <p className="prog-card-for">Builders from</p>
            <div className="prog-card-logos">
              {ENG_BUILDERS.map(c => <BrandLogo key={c.name} name={c.name} domain={c.domain} logo={c.logo} />)}
            </div>
            <div className="next-batch">
              <p className="nb-label">Upcoming batch</p>
              <p className="nb-when"><strong>September 2026</strong>  ·  12 weeks  ·  Intensive</p>
              <p className="nb-deadline">Applications open July 2026</p>
            </div>
            <button className="prog-card-cta" onClick={() => go('/engineering')}>Explore Engineering Program</button>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" style={{ background: 'var(--ink)', color: '#fff', border: 'none', minWidth: 200 }} onClick={scrollToInterest}>Book a call</button>
        </div>
      </section>

      {/* ── WHAT YOU BUILD ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">What you build</p>
        <h2 className="section-h2">Real Projects.<br /><em>Across Every Domain.</em></h2>
        <p className="section-sub">Every Menler fellow ships a portfolio of domain-specific projects.<br />Not toy demos — actual systems built for real use cases. Check TOP projects across roles.</p>
        <div className="proj-grid">
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
              <span className={`proj-domain-tag ${p.tagCls}`}>{p.tag}</span>
              <h3 className="proj-card-title">{p.title}</h3>
              <p className="proj-card-desc">{p.desc}</p>
              <div className="proj-stack">{p.stack.map(s => (
                <span key={s}>{TOOL_LOGO[s] && <img className="tool-logo" src={TOOL_LOGO[s]} alt="" aria-hidden="true" />}{s}</span>
              ))}</div>
              <p className="proj-outcome">{p.outcome}</p>
              <span className="proj-card-link">View preview</span>
            </Reveal>
          ))}
        </div>
        {PROJECTS.length > PROJECTS_PREVIEW && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn-outline" style={{ color: 'var(--specialist)', borderColor: 'rgba(83,74,183,0.5)', minWidth: 200 }} onClick={() => go('/resources')}>
              Explore more
            </button>
          </div>
        )}
      </section>

      {/* ── TECH STACK ── */}
      <section className="section toolstack-section">
        <h2 className="toolstack-title">Your GenAI toolstack</h2>
        <p className="toolstack-sub">Get hands-on with AI tools — from your first prompt to your first real project.</p>
        <div className="toolstack-grid">
          {[TECH.slice(0, 4), TECH.slice(4, 9), TECH.slice(9, 13)].map((row, ri) => (
            <div key={ri} className="toolstack-row">
              {row.map(t => (
                <div key={t.name} className="toolstack-chip">
                  <img className="toolstack-logo" src={t.logo} alt="" aria-hidden="true" />
                  <span className="toolstack-name">{t.name}</span>
                </div>
              ))}
            </div>
          ))}
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
              <button type="submit">Send brochure</button>
            </form>
          )}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail />

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
              <div className="role-row"><p className="role-name">AI Product Manager</p><p className="role-band">₹16–30L · SaaS &amp; platforms</p></div>
              <div className="role-row"><p className="role-name">Finance AI Analyst</p><p className="role-band">₹12–22L · BFSI &amp; fintech</p></div>
              <div className="role-row"><p className="role-name">Customer Experience AI Lead</p><p className="role-band">₹12–20L · Support &amp; success</p></div>
              <div className="role-row"><p className="role-name">Sales AI Specialist</p><p className="role-band">₹12–24L · Revenue &amp; GTM teams</p></div>
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
              <div className="role-row"><p className="role-name">Agentic Systems Engineer</p><p className="role-band">₹28–55L · AI-first startups</p></div>
              <div className="role-row"><p className="role-name">Applied AI Scientist</p><p className="role-band">₹30–60L · Research teams</p></div>
              <div className="role-row"><p className="role-name">AI Infrastructure Engineer</p><p className="role-band">₹24–46L · Platform &amp; infra</p></div>
              <div className="role-row"><p className="role-name">Evals &amp; Safety Engineer</p><p className="role-band">₹24–48L · Trust &amp; reliability</p></div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 18, fontStyle: 'italic', lineHeight: 1.6 }}>Salary bands sourced from fellowship partner intake. Updated quarterly.</p>
        <div className="partners-strip">
          <p className="partners-label">Hiring associations · India · 25+ companies</p>
          <HiringRail companies={HIRING_COMPANIES} rows={2} />
        </div>
      </section>

      {/* ── WHAT YOU LEAVE WITH ── */}
      <section className="section" style={{ background: 'white' }}>
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
