import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import MentorsRail from '../components/common/MentorsRail';
import ProjectModal from '../components/common/ProjectModal';
import { useApply } from '../components/common/ApplyContext';
import { KICKSTARTER_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

const DAYS = [
  { num: 'Day 01', topic: 'What is AI? How LLMs actually work', tool: 'No tools — just clarity', cap: false },
  { num: 'Day 02', topic: 'Meet Claude. Your first 10 prompts.', tool: 'Claude.ai', cap: false },
  { num: 'Day 03', topic: 'ChatGPT, Gemini, Perplexity — pick your stack', tool: 'ChatGPT · Gemini · Perplexity', cap: false },
  { num: 'Day 04', topic: 'Prompt engineering — 5 patterns that work', tool: 'Claude · ChatGPT', cap: false },
  { num: 'Day 05', topic: 'Build #1: Personal research agent', tool: 'Perplexity · NotebookLM', cap: false },
  { num: 'Day 06', topic: 'Saturday capstone sprint #1', tool: 'Free choice', cap: false },
  { num: 'Day 07', topic: 'Build #2: Study planner agent', tool: 'Claude Projects', cap: false },
  { num: 'Day 08', topic: 'Multimodal AI — image, audio, video', tool: 'Canva AI · Suno', cap: false },
  { num: 'Day 09', topic: 'Build #3: Content engine', tool: 'Claude · Canva AI', cap: false },
  { num: 'Day 10', topic: 'Build #4: Idea validator', tool: 'Claude · Cowork', cap: false },
  { num: 'Day 11', topic: 'Claude Skills + MCP basics', tool: 'Claude Desktop · MCP', cap: false },
  { num: 'Day 12', topic: 'AI safety, ethics, & responsible use', tool: 'Frameworks', cap: false },
  { num: 'Day 13', topic: 'Capstone build day', tool: 'Your stack', cap: false },
  { num: 'Day 14', topic: 'Capstone demo + certificate', tool: 'Live audience', cap: true },
];

// GenAI toolstack — same set/design as the home page (4 / 5 / 4 rows).
const TOOLS = [
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

const PROJECTS = [
  { tag: 'Build 1', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Personal research agent', meta: 'Day 5 · Perplexity + NotebookLM', desc: 'An always-ready research agent that answers your questions across PDFs, links, and YouTube transcripts.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 2', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Study planner agent', meta: 'Day 7 · Claude Projects', desc: 'A daily study assistant tuned to your subjects, exam dates, and learning style.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 3', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Content engine', meta: 'Day 9 · Claude + Canva AI', desc: 'Posts, captions, thumbnails, and scripts on autopilot — in your voice.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 4', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Business idea validator', meta: 'Day 10 · Claude · Cowork', desc: 'Stress-test any idea — market, competition, ICP — in a single Claude run with citations.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 5', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Personal AI workflow', meta: 'Day 11 · Claude Skills', desc: 'Wire Claude into your daily life — calendar, mail, study notes — with one Skill that does the work.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Capstone', tagStyle: { background: '#BA7517', color: 'white' }, title: 'Your AI capstone', meta: 'Day 13–14 · Free choice', desc: 'A real, useful AI project — yours to keep, demo to family, post to LinkedIn. Powers your AI Fluency certificate.', cardStyle: { background: '#FFE9C7', borderColor: 'rgba(186,117,23,0.4)' } },
];

const MODULES = [
  { label: 'Module 1', span: 'Days 1–3', title: 'AI Foundations & Your First Prompts',
    desc: 'Build a strong foundation in AI and learn how tools like Claude, ChatGPT, and modern LLMs actually work. You\'ll understand prompting fundamentals, learn proven prompt frameworks, and discover how to turn everyday tasks into AI-powered workflows. By the end of the module, you\'ll create your first personal AI assistant and research agent.',
    lessons: ['What is AI? How LLMs actually work', 'Meet Claude — your first 10 prompts', 'ChatGPT, Gemini & Perplexity — pick your stack'],
    tools: ['Claude.ai', 'ChatGPT', 'Gemini', 'Perplexity'],
    project: 'Personal AI Operating System' },
  { label: 'Module 2', span: 'Days 4–6', title: 'Prompt Engineering & Research',
    desc: 'Go beyond basic prompting by learning Claude Skills, Connectors, and Projects. You\'ll build a personalized AI workspace that understands your context, connect AI to your existing tools, and create powerful research systems using Claude, Perplexity, and NotebookLM. You\'ll also explore AI-powered image, audio, and content creation workflows.',
    lessons: ['Prompt engineering — 5 patterns that work', 'Build #1: Personal research agent', 'Reading & summarising with NotebookLM'],
    tools: ['Claude', 'ChatGPT', 'NotebookLM', 'Perplexity'],
    project: 'AI Research Intelligence System' },
  { label: 'Module 3', span: 'Days 7–10', title: 'Multimodal AI & No-Code Builds',
    desc: 'Learn how to automate repetitive work using Claude Schedules, Routines, and external automation tools like Zapier and n8n. You\'ll work with real datasets, generate insights from information, and build end-to-end AI workflows that save time and improve productivity without writing code.',
    lessons: ['Multimodal AI — image, audio & video', 'Build #3: Content engine', 'Build #4: Idea validator'],
    tools: ['Canva AI', 'Suno', 'Claude', 'Cowork'],
    project: 'Automation Suite' },
  { label: 'Module 4', span: 'Days 11–14', title: 'Claude Skills, MCP & Capstone',
    desc: 'Bring everything together by building real AI-powered products using modern no-code and AI development tools. You\'ll create a portfolio-ready capstone project, learn AI-native career positioning, present your work on Demo Day, and leave with practical projects that showcase your AI skills to employers and clients.',
    lessons: ['Claude Skills + MCP basics', 'AI safety & responsible use', 'Capstone build & live demo'],
    tools: ['Claude Desktop', 'MCP', 'Claude in Excel', 'Cursor (free)'],
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
  'NotebookLM': '/logos/notebooklm.png',
  'Canva AI': '/logos/canva.png',
  'Suno': '/logos/suno.png',
  'Cursor (free)': '/logos/cursor.png',
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
  const openApply = useApply();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, program: 'kickstarter', source: 'kickstarter-page' }); } catch {}
    setDone(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero" style={{ background: 'linear-gradient(135deg,#1A1647 0%,#854F0B 100%)', padding: '64px 40px 56px' }}>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(250,238,218,0.12)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(250,238,218,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: '#FAEEDA' }}>Gen AI Kickstarter · India · No prerequisites</p>
          <h1 className="hero-h1" style={{ color: '#FFF6E1' }}>14 days. 5 builds.<br /><em style={{ color: '#FAEEDA' }}>AI-fluent.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(255,246,225,0.7)' }}>India's most accessible Gen AI program.<strong style={{ color: '#FFF6E1', fontWeight: 500 }}><br />Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ background: '#BA7517', minWidth: 220, textAlign: 'center' }} onClick={openApply}>Apply Now</button>
            <button className="btn-outline" style={{ color: '#FAEEDA', borderColor: 'rgba(250,238,218,0.5)', minWidth: 220, textAlign: 'center' }}>Download Brochure</button>
          </div>
          <div className="hero-stats" style={{ borderColor: 'rgba(250,238,218,0.2)' }}>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>14</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Days</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>10+</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>AI Tools</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>5</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Mini-builds</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>1</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Fluency Certificate</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: '#FFFBF1' }}>
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
      <section className="timeline-wrap">
        <p className="section-label" style={{ textAlign: 'center', color: '#854F0B' }}>14-day timeline</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>From curious<br /><em>to fluent in two weeks.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', maxWidth: 620, margin: '14px auto 0' }}>Daily 90-minute live session (IST evening) + 30-minute practice. Saturdays = capstone build. Sundays off.</p>
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
      <section className="section" style={{ background: '#FFFBF1' }}>
        <p className="section-label" style={{ color: '#854F0B' }}>Course modules</p>
        <h2 className="section-h2">Four modules.<br /><em>Click to open the plan.</em></h2>
        <p className="section-sub">Each module opens its lesson plan, the tool stack you'll use, and the project you'll build.</p>
        <div className="curric">
          <div className="curric-terms">
            {MODULES.map((m, i) => (
              <button
                key={i}
                className={`curric-term${activeModule === i ? ' on' : ''}`}
                onClick={() => setActiveModule(i)}
              >
                <span className="curric-term-no">{m.label} · {m.span}</span>
                <span className="curric-term-title">{m.title}</span>
              </button>
            ))}
          </div>
          <div className="curric-detail curric-detail--split">
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
      </section>

      {/* ── WHAT YOU BUILD ── */}
      <section className="section" style={{ background: '#FFFBF1' }}>
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
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="section toolstack-section">
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
      <section className="mini-lead">
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
      <MentorsRail />

      {/* ── OUTCOMES ── */}
      <section className="hiring-section outcome-section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Outcome</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>What you leave with<br /><em>after 14 days.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>By the end of the program, you'll be able to research, create, automate, and build with AI confidently while maintaining a portfolio of real-world projects that demonstrate practical AI skills.</p>
        <div className="roles-grid">
          <div className="role-card"><p className="role-name">AI Fluency Certificate</p><p className="role-comp">Issued by Menler</p><p className="role-desc">Verifiable credential. Proof that you're Gen AI fluent — across 10+ tools and 5 builds.</p></div>
          <div className="role-card"><p className="role-name">Portfolio of 5 builds</p><p className="role-comp">Public + shareable</p><p className="role-desc">Five real AI mini-projects on a personal portfolio page. Show in interviews, on LinkedIn, on your CV.</p></div>
          <div className="role-card"><p className="role-name">Internship opportunities</p><p className="role-comp">Top performers</p><p className="role-desc">Standout fellows get matched to internship openings with our hiring partners — real work, real experience, on your CV.</p></div>
          <div className="role-card"><p className="role-name">Scholarship pathway</p><p className="role-comp">Up to 30%</p><p className="role-desc">Top scorers in the Aptitude Test get a 30% scholarship to the 12-week Generalist or Engineering Fellowship.</p></div>
          <div className="role-card"><p className="role-name">Daily-use AI workflows</p><p className="role-comp">Permanent skill lift</p><p className="role-desc">Actual daily habits — not theoretical knowledge. You leave with workflows you'll use forever.</p></div>
          <div className="role-card"><p className="role-name">A community of practice</p><p className="role-comp">India-wide</p><p className="role-desc">Cohort buddies across India. Meet at city meetups, build together, hire each other later.</p></div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section faq-section" style={{ background: 'white' }}>
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
        onButtonClick={() => go('/programs')}
        sectionStyle={{ background: '#854F0B' }}
      />

      <Footer />

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
