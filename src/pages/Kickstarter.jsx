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
import { KICKSTARTER_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

const DAYS = [
  { num: '01', topic: 'The AI Landscape', tool: 'Claude, ChatGPT, Gemini', cap: false },
  { num: '02', topic: 'Claude OS', tool: 'Chat, Cowork, Code', cap: false },
  { num: '03', topic: 'Prompting Fundamentals', tool: 'Prompts', cap: false },
  { num: '04', topic: 'AI Workflow Thinking', tool: 'Claude,Workflow ', cap: false },
  { num: '05', topic: 'Claude Skills', tool: 'Skills', cap: false },
  { num: '06', topic: 'Claude Connectors', tool: 'Connectors & Mcps', cap: false },
  { num: '07', topic: 'Claude Projects', tool: 'Notion AI', cap: false },
  { num: '08', topic: 'Research Intelligence', tool: 'Claude, Perplexity, NotebookLM', cap: false },
  { num: '09', topic: 'AI Creatives', tool: 'Gemini Imagen', cap: false },
  { num: '10', topic: 'Claude Schedules & Routines', tool: 'Cowork,Schedule,Routines', cap: false },
  { num: '11', topic: 'Claude for Data', tool: 'Articrafts, Excel, Doc', cap: false },
  { num: '12', topic: 'External Automation', tool: 'n8n , zapier', cap: false },
  { num: '13', topic: 'Vibe Coding', tool: 'Lovable, Emergent', cap: false },
  { num: '14', topic: 'Capstone Build Sprint', tool: 'Live audience', cap: true },
];

// ── Pricing card content ──
const KS_FEATS = [
  ['4 live sessions across 2 weekends', 'Sat + Sun · 2 hrs each · Bengaluru or online'],
  ['Claude OS hands-on build', 'Projects, Skills, Connectors, Routines — live'],
  ['4 portfolio deliverables', 'AI OS · Research System · Automation · Capstone'],
  ['Demo Day + peer review', 'Present live. Get feedback. Ship something real.'],
  ['Menler AI Kickstarter Certificate', 'LinkedIn-shareable proof of hands-on AI work'],
  ['AI resource library access', 'Prompt packs, templates, and tool guides'],
];

// GenAI toolstack — same set/design as the home page (4 / 5 / 4 rows).
const TOOLS = [
  { name: 'Claude', logo: '/logos/claude.svg' },
  { name: 'ChatGPT', logo: '/logos/chatgpt.png' },
  { name: 'Gemini', logo: '/logos/gemini.png' },
  { name: 'Perplexity', logo: '/logos/perplexity.svg' },
  { name: 'NotebookLM', logo: '/logos/google-notebook-lm.png' },
  { name: 'Notion', logo: '/logos/notion.png' },
  { name: 'Canva AI', logo: '/logos/canva.png' },
  { name: 'Zapier', logo: '/logos/zapier.png' },
  { name: 'n8n', logo: '/logos/n8n.png' },
  { name: 'Lovable', logo: '/logos/lovable-logo.png' },
  { name: 'Emergent', logo: '/logos/emergent.png' },
  { name: 'Lyzr', logo: '/logos/lyzr.png' },
  { name: 'HeyGen', logo: '/logos/heygen.png' },
];

const PROJECTS = [
  { tag: 'Build 1', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Personal research agent', meta: 'Day 5 · Perplexity + NotebookLM', desc: 'An always-ready research agent that answers your questions across PDFs, links, and YouTube transcripts.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 2', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Study planner agent', meta: 'Day 7 · Claude Projects', desc: 'A daily study assistant tuned to your subjects, exam dates, and learning style.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 3', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Content engine', meta: 'Day 9 · Claude + Canva AI', desc: 'Posts, captions, thumbnails, and scripts on autopilot — in your voice.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 4', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Automation Suite', meta: 'Day 10 · Claude · Cowork', desc: 'Stress-test any idea — market, competition, ICP — in a single Claude run with citations.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 5', tagStyle: { background: '#BA7517', color: 'white' }, title: 'AI-Powered Capstone Project', meta: 'Day 11 · Claude Skills', desc: 'Wire Claude into your daily life — calendar, mail, study notes — with one Skill that does the work.', cardStyle: { background: '#FFE9C7', borderColor: 'rgba(186,117,23,0.4)' } },
];

const MODULES = [
  { label: 'Module 1', title: 'AI Foundations + Claude OS',
    lessons: ['The AI Landscape — What You Actually Need to Know', 'Claude OS — Three Interfaces, Three Use Cases', 'Prompting Fundamentals — The CLEAR Framwork','AI Workflow Thinking — From Task to System'],
    tools: ['Claude', 'ChatGPT', 'Gemini', 'Perplexity'],
    project: 'Personal AI Operating System' },
  { label: 'Module 2', title: 'Claude Power Layers',
    lessons: ['Claude Skills — Teaching Claude to Behave Differently', 'Claude Connectors — Claude Inside Your Existing Tools', 'Claude Projects — Building a Persistent Intelligence System','Research Intelligence — Claude + Perplexity + NotebookLM', 'AI Creatives — Image, Audio & Video Generation'],
    tools: ['Canva AI', 'Gemini', 'ElevenLabs', 'NotebookLM', 'Runway', 'Claude Skills', 'Claude Routines'],
    project: 'Study planner agent & Content engine' },
  { label: 'Module 3', title: 'Automation Systems',
    lessons: ['Claude Schedules — Time-Triggered Intelligence', 'Claude Routines — On-Demand Repeatable Workflows', 'Claude for Data — Upload, Interrogate, Act','External Automation — Zapier, n8n & When to Leave Claude'],
    tools: ['n8n', 'Zapier', 'Claude', 'Notion'],
    project: 'Automation Suite' },
  { label: 'Module 4',  title: 'Vibe coding & Demo day',
    lessons: ['Vibe Coding — Build Real Things Without Writing Code', 'Capstone Build Sprint — Ship in 20 Minutes', 'Demo Day — Present, Critique, Level Up','AI-Native Career Positioning'],
    tools: ['Claude', 'Emergent', 'Lovable'],
    project: 'AI-Powered Capstone Project' },
];

// Logo per tool used in the module tool stacks (local SVG for Claude/MCP,
// Clearbit CDN for the rest). Falls back to text-only if the image fails.
const TOOL_LOGO_SRC = {
  'Claude.ai': '/logos/claude.svg',
  'Claude': '/logos/claude.svg',
  'Claude Desktop': '/logos/claude.svg',
  'Claude in Excel': '/logos/claude.svg',
  'Cowork': '/logos/claude.svg',
  'MCP': '/logos/mcp.svg',
  'ChatGPT': '/logos/chatgpt.png',
  'Gemini': '/logos/gemini.png',
  'Perplexity': '/logos/perplexity.svg',
  'NotebookLM': '/logos/google-notebook-lm.png',
  'Canva AI': '/logos/canva.png',
  'Suno': '/logos/suno.png',
  'Cursor (free)': '/logos/cursor.png',
  'ElevenLabs': '/logos/elevenlabs.png',
  'Runway': '/logos/runway.png',
  'Claude Skills': '/logos/claude.svg',
  'Claude Routines': '/logos/claude.svg',
  'n8n': '/logos/n8n.png',
  'Zapier': '/logos/zapier.png',
  'Notion': '/logos/notion.png',
  'Emergent': '/logos/emergent.png',
  'Lovable': '/logos/lovable-logo.png',
};

function ToolChip({ name }) {
  const src = TOOL_LOGO_SRC[name];
  const [ok, setOk] = useState(!!src);
  return (
    <span className="curric-tool">
      {ok && <img className="curric-tool-logo" src={src} alt="" onError={() => setOk(false)} />}
      {name}
    </span>
  );
}

export default function Kickstarter() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' });
  const [done, setDone] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [activeModule, setActiveModule] = useState(0);
  const moduleDetailRef = useRef(null);
  const openApply = useApply();

  // Pick a module. On mobile, the detail panel stacks below the module list,
  // so scroll it into view (after the state-driven re-render) to make the
  // open/close behaviour obvious to the user.
  const pickModule = (i) => {
    setActiveModule(i);
    if (window.matchMedia('(max-width: 760px)').matches) {
      requestAnimationFrame(() => {
        const el = moduleDetailRef.current;
        if (!el) return;
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -16 });
        else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, program: 'kickstarter', source: 'kickstarter-page' }); } catch {}
    setDone(true);
  };

  return (
    <>
      <Seo
        title="Gen AI Kickstarter — AI Bootcamp India for Beginners | Menler"
        description="A 14-day beginner AI bootcamp. Get hands-on with 10+ AI tools, build your first AI projects, and become AI-fluent — no prerequisites."
        keywords="AI bootcamp India, beginner AI course, Gen AI Kickstarter, AI tools onboarding, AI upskilling, learn AI India"
        path="/kickstarter"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Course', name: 'Gen AI Kickstarter', description: '14-day beginner AI bootcamp — hands-on with 10+ AI tools and first real AI projects, no prerequisites.', provider: { '@type': 'Organization', name: 'Menler', sameAs: 'https://menler.in' } }}
      />
      {/* ── HERO + WHO THIS IS FOR (one screen together) ── */}
      <div className="hero-screen">
      {/* ── HERO ── */}
      <section className="hero hero-big" style={{ background: 'linear-gradient(135deg,#1A1647 0%,#854F0B 100%)', padding: '66px clamp(22px, 6vw, 40px) 54px' }}>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(250,238,218,0.12)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(250,238,218,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: '#FAEEDA' }}>Gen AI Kickstarter · No prerequisites</p>
          <h1 className="hero-h1" style={{ color: '#FFF6E1' }}>14 days. 4 builds.<br /><em style={{ color: '#FAEEDA' }}>AI-fluent.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(255,246,225,0.7)' }}>India's most accessible Gen AI program.<strong className="hero-tagline" style={{ color: '#FFF6E1', fontWeight: 500 }}>Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ background: '#BA7517', minWidth: 220, textAlign: 'center' }} onClick={openApply}>Apply Now</button>
            <button className="btn-outline" style={{ color: '#FAEEDA', borderColor: 'rgba(250,238,218,0.5)', minWidth: 220, textAlign: 'center' }}>Download Brochure</button>
          </div>
          <div className="hero-stats" style={{ borderColor: 'rgba(250,238,218,0.2)' }}>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>20+</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>AI Builders<br />& Operators</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>10+</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>AI Tools</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>14</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Days</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>4</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Mini-builds</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>1</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Fluency Certificate</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: '#FFFBF1', paddingTop: 24, paddingBottom: 20 }}>
        <p className="section-label" style={{ color: '#854F0B' }}>Who this is for</p>
        <h2 className="section-h2" style={{ color: '#854F0B' }}>Built for the curious.<br /><em style={{ color: '#BA7517' }}>Welcome, beginners.</em></h2>
        <p className="section-sub">No prerequisites. No gatekeeping. If you can use a smartphone, you can do this.</p>
        <div className="audience-grid">
          <div className="audience-card"><div className="ava" style={{ background: '#FAEEDA', color: '#854F0B' }}>1</div><p className="audience-role">School students</p><p className="audience-desc">Class 10–12 who want to be AI-native before college.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: 'var(--cloud)', color: 'var(--specialist)' }}>2</div><p className="audience-role">College students</p><p className="audience-desc">Any discipline. Stand out at internships and placements.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#E1F5EE', color: '#085041' }}>3</div><p className="audience-role">Professionals new to AI</p><p className="audience-desc">Catch up fast. Without coding. Without overwhelm.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FCEBEB', color: '#A32D2D' }}>4</div><p className="audience-role">Founders' AI hires</p><p className="audience-desc">First AI person at a startup? Get the toolkit fast.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>5</div><p className="audience-role">Parents & educators</p><p className="audience-desc">Be the AI guide for your kids and your classroom.</p></div>
        </div>
      </section>
      </div>

      {/* ── TIMELINE ── */}
      <section className="timeline-wrap" style={{ paddingTop: 48 }}>
        <p className="section-label" style={{ textAlign: 'center', color: '#854F0B' }}>14-day timeline</p>
        <h2 className="section-h2" style={{ textAlign: 'center', color: '#854F0B' }}>From curious<br /><em style={{ color: '#BA7517' }}>to fluent in two weeks.</em></h2>
        <div className="timeline-grid">
          {DAYS.map((d, i) => (
            <div key={i} className={`day-card${d.cap ? ' cap' : ''}`}>
              <p className="day-num">{d.num}</p>
              <p className="day-topic">{d.topic}</p>
              <p className="day-tool">{d.tool}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODULES ── */}
      <section className="section" style={{ background: '#FFFBF1', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label" style={{ color: '#854F0B' }}>Course modules</p>
        <h2 className="section-h2" style={{ color: '#854F0B' }}>Four modules.<br /><em style={{ color: '#BA7517' }}>Click to open the plan.</em></h2>
        <p className="section-sub">Each module opens its lesson plan, the tool stack you'll use, and the project you'll build.</p>
        <div className="curric-acc">
          {MODULES.map((m, i) => {
            const open = activeModule === i;
            return (
              <div className={`curric-acc-item${open ? ' open' : ''}`} key={i}>
                <button className="curric-acc-head" onClick={(e) => {
                  const willOpen = !open;
                  setActiveModule(willOpen ? i : -1);
                  if (willOpen) {
                    const el = e.currentTarget;
                    setTimeout(() => {
                      if (window.__lenis) { window.__lenis.scrollTo(el, { offset: -90 }); return; }
                      const y = el.getBoundingClientRect().top + window.scrollY - 90;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }, 70);
                  }
                }} aria-expanded={open}>
                  <span className="curric-acc-no">{m.label} · {m.span}</span>
                  <span className="curric-acc-title">{m.title}</span>
                  <span className="curric-acc-caret">{open ? '▾' : '▸'}</span>
                </button>
                {open && (
                  <div className="curric-acc-body">
                    <div className="curric-detail--split">
                      <div className="curric-detail-main">
                        <p className="curric-week-desc" style={{ marginTop: 0, marginBottom: 28 }}>{m.desc}</p>
                        <p className="curric-label">Lesson plan</p>
                        <ul className="curric-modules">
                          {m.lessons.map(l => <li key={l}>{l}</li>)}
                        </ul>
                        <p className="curric-label" style={{ marginTop: 28 }}>Project you'll build</p>
                        <ul className="curric-modules">
                          <li>{m.project}</li>
                        </ul>
                      </div>
                      <div className="curric-detail-tools">
                        <p className="curric-label">Tool stack</p>
                        <div className="curric-tools">
                          {m.tools.map(t => <ToolChip key={t} name={t} />)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" style={{ background: '#BA7517', minWidth: 200 }} onClick={openApply}>Download curriculum</button>
        </div>
      </section>

      {/* ── WHAT YOU BUILD ── */}
      <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label" style={{ color: '#854F0B' }}>What you'll build</p>
        <h2 className="section-h2" style={{ color: '#854F0B' }}>Four mini-builds.<br /><em style={{ color: '#BA7517' }}>One personal capstone.</em></h2>
        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="proj-card proj-card--clickable"
              style={p.cardStyle}
              role="button"
              tabIndex={0}
              onClick={() => setActiveProject(p)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveProject(p); } }}
            >
              <span className="proj-track" style={p.tagStyle}>{p.tag}</span>
              <p className="proj-name">{p.title}</p>
              <p className="proj-meta">{p.meta}</p>
              <p className="proj-desc">{p.desc}</p>
            </div>
          ))}
          <div
            className="proj-card proj-card--clickable"
            role="button"
            tabIndex={0}
            style={{ background: 'white', borderColor: 'rgba(186,117,23,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => go('/resources')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go('/resources'); } }}
          >
            <button className="btn-primary" style={{ background: '#BA7517', minWidth: 160 }} onClick={() => go('/resources')}>See more</button>
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="section toolstack-section" style={{ paddingTop: 48, paddingBottom: 72 }}>
        <h2 className="toolstack-title">Your GenAI toolstack</h2>
        <p className="toolstack-sub">Get hands-on with AI tools — from your first prompt to your first real project.</p>
        <div className="toolstack-grid">
          {[TOOLS.slice(0, 4), TOOLS.slice(4, 9), TOOLS.slice(9, 13)].map((row, ri) => (
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

      {/* ── LEAD (brochure) ── */}
      <section className="mini-lead" style={{ paddingTop: 48 }}>
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>Get the Kickstarter <em>brochure.</em></h3>
            <p>Syllabus, schedule, fees, scholarships, and ISA options — straight to your inbox.</p>
          </div>
          {done ? (
            <div className="mini-lead-success">✓ Brochure on its way.</div>
          ) : (
            <form className="mini-lead-form" onSubmit={handleSubmit}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              <select required aria-label="You are" value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="">You are…</option>
                <option>School student (Class 10–12)</option>
                <option>College student</option>
                <option>Working professional new to AI</option>
                <option>Founder / first AI hire</option>
                <option>Parent or educator</option>
              </select>
              <button type="submit">Send brochure</button>
            </form>
          )}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail style={{ paddingTop: 48 }} labelStyle={{ color: '#854F0B' }} titleStyle={{ color: '#854F0B' }} />

      {/* ── HIRING PARTNERS & ROLES ── */}
      <HiringJobs label="Internship opportunities" title="The internships" sectionStyle={{ paddingTop: 48 }} labelStyle={{ color: '#854F0B' }} titleStyle={{ color: '#854F0B' }} titleEmStyle={{ color: '#BA7517' }} />

      {/* ── PRICING ── */}
      <section className="section kp-section" style={{ background: '#ffffff', paddingTop: 8 }}>
        <p className="section-label" style={{ textAlign: 'center', color: '#854F0B' }}>Pricing</p>
        <h2 className="section-h2" style={{ textAlign: 'center', color: '#854F0B' }}>One price. <em style={{ color: '#BA7517' }}>Everything in.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 32px' }}>Your hands-on entry into AI — no prerequisites, no hidden fees.</p>

        <PricingCard
          pill="Entry Programme"
          name="AI Kickstarter"
          tagline="4 live sessions across 2 weekends — build a real Claude OS and ship 4 portfolio projects."
          price="4,999"
          priceSub="incl. all taxes · one-time"
          onCta={openApply}
          features={KS_FEATS}
          chips={[
            { label: 'Start date', value: 'Jul 12, 2026' },
            { label: 'Duration', value: '2 Weekends' },
            { label: 'Sessions', value: '4 Live · 8 hrs' },
            { label: 'Format', value: 'Live online' },
          ]}
        />
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <button className="btn-primary" style={{ background: '#BA7517', minWidth: 200 }} onClick={openApply}>Book a call</button>
        </div>
      </section>

      {/* ── OUTCOMES ── */}
      <section className="hiring-section outcome-section" style={{ background: 'var(--parchment)', paddingTop: 48 }}>
        <p className="section-label" style={{ textAlign: 'center', color: '#854F0B' }}>Outcome</p>
        <h2 className="section-h2" style={{ textAlign: 'center', color: '#854F0B' }}>What you leave with<br /><em style={{ color: '#BA7517' }}>after 14 days.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 28px' }}>The first assets of your AI-fluent professional identity</p>
        <div className="roles-grid">
          <div className="role-card"><p className="role-name">AI Fluency Certificate</p><p className="role-comp">Issued by Menler</p><p className="role-desc">Verifiable credential. Proof that you're Gen AI fluent — across 10+ tools and 4 builds.</p></div>
          <div className="role-card"><p className="role-name">Portfolio of 4 builds</p><p className="role-comp">Public + shareable</p><p className="role-desc">Four real AI mini-projects on a personal portfolio page. Show in interviews, on LinkedIn, on your CV.</p></div>
          <div className="role-card"><p className="role-name">Direct access to AI-forward opportunities</p><p className="role-comp">Top performers</p><p className="role-desc">Standout fellows get matched to internship openings with our hiring partners — real work, real experience, on your CV.</p></div>
          <div className="role-card"><p className="role-name">Merit recognized. Potential accelerated</p><p className="role-comp">Up to 30%</p><p className="role-desc">Top scorers in the Aptitude Test get a 30% scholarship to the 12-week Generalist or Engineering Fellowship.</p></div>
          <div className="role-card"><p className="role-name">Practical workflows you'll keep long after the program ends.</p><p className="role-comp">Permanent skill lift</p><p className="role-desc">Actual daily habits — not theoretical knowledge. You leave with workflows you'll use forever.</p></div>
          <div className="role-card"><p className="role-name">A network built around learning, building, and opportunity.</p><p className="role-comp">India-wide</p><p className="role-desc">Cohort buddies across India. Meet at city meetups, build together, hire each other later.</p></div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section faq-section" style={{ background: 'white', textAlign: 'center', paddingTop: 48 }}>
        <p className="section-label" style={{ color: '#854F0B' }}>FAQ</p>
        <h2 className="section-h2" style={{ color: '#854F0B' }}>Common questions.<br /><em style={{ color: '#BA7517' }}>Quick answers.</em></h2>
        <FaqList items={KICKSTARTER_FAQS} />
      </section>

      {/* ── CTA ── */}
      <CtaBanner
        style={{ background: '#854F0B' }}
        badge="Next batch · Rolling enrolments"
        badgeDotColor="#FAEEDA"
        title="Already AI-fluent? See the 12-week Fellowship"
        subtitle="Kickstarter alumni get a 30% scholarship to either Generalist or Engineering tracks."
        buttonText="Apply Now"
        buttonStyle={{ color: '#854F0B' }}
        onButtonClick={openApply}
        sectionStyle={{ background: '#854F0B' }}
      />

      <Footer />

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
