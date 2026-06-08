import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import MentorsRail from '../components/common/MentorsRail';
import ProjectModal from '../components/common/ProjectModal';
import { useApply } from '../components/common/ApplyContext';
import HiringJobs from '../components/common/HiringJobs';
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
      {/* ── HERO ── */}
      <section className="hero" style={{ background: 'linear-gradient(135deg,#1A1647 0%,#854F0B 100%)', padding: '64px clamp(22px, 6vw, 40px) 56px' }}>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(250,238,218,0.12)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(250,238,218,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: '#FAEEDA' }}>Gen AI Kickstarter · India · No prerequisites</p>
          <h1 className="hero-h1" style={{ color: '#FFF6E1' }}>14 days. 4 builds.<br /><em style={{ color: '#FAEEDA' }}>AI-fluent.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(255,246,225,0.7)' }}>India's most accessible Gen AI program.<strong style={{ color: '#FFF6E1', fontWeight: 500 }}><br />Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ background: '#BA7517', minWidth: 220, textAlign: 'center' }} onClick={openApply}>Apply Now</button>
            <button className="btn-outline" style={{ color: '#FAEEDA', borderColor: 'rgba(250,238,218,0.5)', minWidth: 220, textAlign: 'center' }}>Download Brochure</button>
          </div>
          <div className="hero-stats" style={{ borderColor: 'rgba(250,238,218,0.2)' }}>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>14</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Days</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>10+</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>AI Tools</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>4</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Mini-builds</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>1</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Fluency Certificate</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: '#FFFBF1', paddingTop: 48 }}>
        <p className="section-label" style={{ color: '#854F0B' }}>Who this is for</p>
        <h2 className="section-h2">Built for the curious.<br /><em>Welcome, beginners.</em></h2>
        <p className="section-sub">No prerequisites. No gatekeeping. If you can use a smartphone, you can do this.</p>
        <div className="audience-grid">
          <div className="audience-card"><div className="ava" style={{ background: '#FAEEDA', color: '#854F0B' }}>SS</div><p className="audience-role">School students</p><p className="audience-desc">Class 10–12 who want to be AI-native before college.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: 'var(--cloud)', color: 'var(--specialist)' }}>CS</div><p className="audience-role">College students</p><p className="audience-desc">Any discipline. Stand out at internships and placements.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#E1F5EE', color: '#085041' }}>WP</div><p className="audience-role">Professionals new to AI</p><p className="audience-desc">Catch up fast. Without coding. Without overwhelm.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FCEBEB', color: '#A32D2D' }}>FH</div><p className="audience-role">Founders' AI hires</p><p className="audience-desc">First AI person at a startup? Get the toolkit fast.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>PE</div><p className="audience-role">Parents & educators</p><p className="audience-desc">Be the AI guide for your kids and your classroom.</p></div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="timeline-wrap" style={{ paddingTop: 48 }}>
        <p className="section-label" style={{ textAlign: 'center', color: '#854F0B' }}>14-day timeline</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>From curious<br /><em>to fluent in two weeks.</em></h2>
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
        <h2 className="section-h2">Four modules.<br /><em>Click to open the plan.</em></h2>
        <p className="section-sub">Each module opens its lesson plan, the tool stack you'll use, and the project you'll build.</p>
        <div className="curric">
          <div className="curric-terms">
            {MODULES.map((m, i) => (
              <button
                key={i}
                className={`curric-term${activeModule === i ? ' on' : ''}`}
                onClick={() => pickModule(i)}
              >
                <span className="curric-term-no">{m.label} · {m.span}</span>
                <span className="curric-term-title">{m.title}</span>
              </button>
            ))}
          </div>
          <div className="curric-detail curric-detail--split" ref={moduleDetailRef} style={{ scrollMarginTop: 16 }}>
            <div className="curric-detail-main">
              <p className="curric-week-desc" style={{ marginTop: 0, marginBottom: 28 }}>{MODULES[activeModule].desc}</p>
              <p className="curric-label">Lesson plan</p>
              <ul className="curric-modules">
                {MODULES[activeModule].lessons.map(l => <li key={l}>{l}</li>)}
              </ul>
              <p className="curric-label" style={{ marginTop: 28 }}>Project you'll build</p>
              <ul className="curric-modules">
                <li>{MODULES[activeModule].project}</li>
              </ul>
            </div>
            <div className="curric-detail-tools">
              <p className="curric-label">Tool stack</p>
              <div className="curric-tools">
                {MODULES[activeModule].tools.map(t => <ToolChip key={t} name={t} />)}
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" style={{ background: '#BA7517', minWidth: 200 }} onClick={openApply}>Download curriculum</button>
        </div>
      </section>

      {/* ── WHAT YOU BUILD ── */}
      <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label" style={{ color: '#854F0B' }}>What you'll build</p>
        <h2 className="section-h2">Five mini-builds.<br /><em>One personal capstone.</em></h2>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button className="btn-primary" style={{ background: '#BA7517', minWidth: 160 }} onClick={() => go('/resources')}>See more</button>
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="section toolstack-section" style={{ paddingTop: 48 }}>
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
            <p>Full 14-day schedule, mentor list, fee tiers, scholarships, and next batch dates — straight to your inbox.</p>
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
      <MentorsRail style={{ paddingTop: 48 }} />

      {/* ── HIRING PARTNERS & ROLES ── */}
      <HiringJobs sectionStyle={{ paddingTop: 48 }} />
      <div style={{ textAlign: 'center', padding: '0 clamp(22px, 6vw, 40px) 56px', background: '#ffffff' }}>
        <button className="btn-primary" style={{ background: '#BA7517', minWidth: 200 }} onClick={openApply}>Book a call</button>
      </div>

      {/* ── OUTCOMES ── */}
      <section className="hiring-section outcome-section" style={{ background: 'var(--parchment)', paddingTop: 48 }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Outcome</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>What you leave with<br /><em>after 14 days.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>The first assests of your AI-fluent professional identity</p>
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
        <p className="section-label">FAQ</p>
        <h2 className="section-h2">Common questions.<br /><em>Quick answers.</em></h2>
        <FaqList items={KICKSTARTER_FAQS} />
      </section>

      {/* ── CTA ── */}
      <CtaBanner
        style={{ background: '#854F0B' }}
        badge="Next batch · Rolling enrolments"
        badgeDotColor="#FAEEDA"
        title="Already AI-fluent? See the 12-week Fellowship"
        subtitle="Kickstarter alumni get a 30% scholarship to either Generalist or Engineering tracks."
        buttonText="Explore the Fellowship"
        buttonStyle={{ color: '#854F0B' }}
        onButtonClick={() => { navigate('/#programs'); window.scrollTo(0, 0); }}
        sectionStyle={{ background: '#854F0B' }}
      />

      <Footer />

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
