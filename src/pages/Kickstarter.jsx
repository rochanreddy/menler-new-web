import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
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

const TOOLS = ['Claude.ai', 'ChatGPT', 'Gemini', 'Perplexity', 'NotebookLM', 'Claude Desktop', 'Cowork', 'Cursor (free)', 'Canva AI', 'Suno', 'MCP basics', 'Claude in Excel'];

const PROJECTS = [
  { tag: 'Build 1', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Personal research agent', meta: 'Day 5 · Perplexity + NotebookLM', desc: 'An always-ready research agent that answers your questions across PDFs, links, and YouTube transcripts.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 2', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Study planner agent', meta: 'Day 7 · Claude Projects', desc: 'A daily study assistant tuned to your subjects, exam dates, and learning style.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 3', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Content engine', meta: 'Day 9 · Claude + Canva AI', desc: 'Posts, captions, thumbnails, and scripts on autopilot — in your voice.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 4', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Business idea validator', meta: 'Day 10 · Claude · Cowork', desc: 'Stress-test any idea — market, competition, ICP — in a single Claude run with citations.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Build 5', tagStyle: { background: '#FAEEDA', color: '#854F0B' }, title: 'Personal AI workflow', meta: 'Day 11 · Claude Skills', desc: 'Wire Claude into your daily life — calendar, mail, study notes — with one Skill that does the work.', cardStyle: { background: 'white', borderColor: 'rgba(186,117,23,0.18)' } },
  { tag: 'Capstone', tagStyle: { background: '#BA7517', color: 'white' }, title: 'Your AI capstone', meta: 'Day 13–14 · Free choice', desc: 'A real, useful AI project — yours to keep, demo to family, post to LinkedIn. Powers your AI Fluency certificate.', cardStyle: { background: '#FFE9C7', borderColor: 'rgba(186,117,23,0.4)' } },
];

export default function Kickstarter() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' });
  const [done, setDone] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, program: 'kickstarter', source: 'kickstarter-page' }); } catch {}
    setDone(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero hero-centered" style={{ background: 'linear-gradient(135deg,#1A1647 0%,#854F0B 100%)', padding: '64px 40px 56px' }}>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(250,238,218,0.12)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(250,238,218,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: '#FAEEDA' }}>Gen AI Kickstarter · India · No prerequisites</p>
          <h1 className="hero-h1" style={{ color: '#FFF6E1' }}>14 days. 5 builds.<br /><em style={{ color: '#FAEEDA' }}>AI-fluent.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(255,246,225,0.7)' }}>India's most accessible Gen AI program. Built for school students, college students, working professionals new to AI, founders' first AI hires, and anyone who wants to go from curious to fluent in 14 days. Daily live sessions, hands-on practice, five mini-projects, one capstone, one certificate.</p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ background: '#BA7517' }} onClick={() => go('/scholarship')}>Sign up</button>
            <button className="btn-ghost" style={{ color: '#FAEEDA' }}>Download brochure →</button>
          </div>
          <div className="hero-stats" style={{ borderColor: 'rgba(250,238,218,0.2)' }}>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>14</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Days</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>10+</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Tools</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>5</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Mini-builds</span></div>
            <div><span className="hero-stat-num" style={{ color: '#FFF6E1' }}>1</span><span className="hero-stat-lbl" style={{ color: '#FAEEDA' }}>Fluency cert</span></div>
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

      {/* ── TOOLS ── */}
      <section className="section" style={{ background: '#1A1647' }}>
        <p className="section-label" style={{ color: '#FAEEDA', textAlign: 'center' }}>Tools you'll learn</p>
        <h2 className="section-h2" style={{ color: '#FFF6E1', textAlign: 'center' }}>A real Gen AI toolkit.<br /><em style={{ color: '#FAEEDA' }}>Free tiers wherever possible.</em></h2>
        <div className="tools-strip">
          {TOOLS.map(t => <span key={t} className="tool-pill">{t}</span>)}
        </div>
      </section>

      {/* ── WHAT YOU BUILD ── */}
      <section className="section" style={{ background: '#FFFBF1' }}>
        <p className="section-label" style={{ color: '#854F0B' }}>What you'll build</p>
        <h2 className="section-h2">Five mini-builds.<br /><em>One personal capstone.</em></h2>
        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <div key={i} className="proj-card" style={p.cardStyle}>
              <span className="proj-track" style={p.tagStyle}>{p.tag}</span>
              <p className="proj-name">{p.title}</p>
              <p className="proj-meta">{p.meta}</p>
              <p className="proj-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">Mentors</p>
        <h2 className="section-h2">Operators, in plain English.<br /><em>No jargon. Ever.</em></h2>
        <p className="section-sub">Instructors who use AI in real jobs and explain it the way you'd want a friend to.</p>
        <div className="mentors-grid">
          <article className="mentor-card">
            <div className="mentor-portrait" style={{ background: '#FAEEDA', color: '#854F0B' }}>DM</div>
            <p className="mentor-name">Dev Mehta</p>
            <p className="mentor-role">AI educator · ex-Byju's product</p>
            <p className="mentor-bio">Taught AI to 12,000+ students. Specialises in making the first 14 days click for non-technical learners.</p>
            <p className="mentor-tags">Lead instructor</p>
          </article>
          <article className="mentor-card">
            <div className="mentor-portrait" style={{ background: 'var(--cloud)', color: 'var(--specialist)' }}>RA</div>
            <p className="mentor-name">Riya Agarwal</p>
            <p className="mentor-role">Founder · Boutique AI agency</p>
            <p className="mentor-bio">Built a profitable agency with Claude as her co-founder. Mentors content, marketing, and small-business builds.</p>
            <p className="mentor-tags">Practice mentor</p>
          </article>
          <article className="mentor-card">
            <div className="mentor-portrait" style={{ background: '#E1F5EE', color: '#085041' }}>JN</div>
            <p className="mentor-name">Jaideep Nair</p>
            <p className="mentor-role">CS faculty · IIIT Hyderabad</p>
            <p className="mentor-bio">Demystifies how LLMs actually work — without a single equation. Mentors school + college students.</p>
            <p className="mentor-tags">Faculty mentor</p>
          </article>
        </div>
      </section>

      {/* ── OUTCOMES ── */}
      <section className="hiring-section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Outcome</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>What you leave with<br /><em>after 14 days.</em></h2>
        <div className="roles-grid">
          <div className="role-card"><p className="role-name">AI Fluency Certificate</p><p className="role-comp">Issued by Meridian</p><p className="role-desc">Verifiable credential. Proof that you're Gen AI fluent — across 10+ tools and 5 builds.</p></div>
          <div className="role-card"><p className="role-name">Portfolio of 5 builds</p><p className="role-comp">Public + shareable</p><p className="role-desc">Five real AI mini-projects on a personal portfolio page. Show in interviews, on LinkedIn, on your CV.</p></div>
          <div className="role-card"><p className="role-name">Discord community</p><p className="role-comp">Lifetime access</p><p className="role-desc">Stay in the room with 1000+ Kickstarter alumni. Weekly drops, alumni-only AMAs, build challenges.</p></div>
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

      {/* ── LEAD ── */}
      <section className="prog-lead">
        <div className="prog-lead-inner">
          <div className="prog-lead-copy">
            <h3>Get the Kickstarter <em>brochure</em>.</h3>
            <p>Full 14-day schedule, mentor list, fee tiers (school / college / professional), scholarships, and next batch dates.</p>
          </div>
          {done ? (
            <p style={{ color: 'var(--placed)', fontWeight: 500 }}>✓ Brochure on its way.</p>
          ) : (
            <form className="prog-lead-form" onSubmit={handleSubmit}>
              <label>Full name</label>
              <input type="text" required placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
              <div className="row2">
                <div><label>Email</label><input type="email" required placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" /></div>
                <div><label>WhatsApp</label><input type="tel" required placeholder="+91 …" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" /></div>
              </div>
              <label>You are…</label>
              <select required value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="">Pick the closest fit</option>
                <option>School student (Class 10–12)</option>
                <option>College student</option>
                <option>Working professional new to AI</option>
                <option>Founder / first AI hire</option>
                <option>Parent or educator</option>
              </select>
              <button type="submit">Send Kickstarter brochure →</button>
            </form>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBanner
        style={{ background: '#854F0B' }}
        badge="Next batch · Rolling enrolments"
        badgeDotColor="#FAEEDA"
        title="Already AI-fluent? See the 12-week Fellowship →"
        subtitle="Kickstarter alumni get a 30% scholarship to either Generalist or Engineering tracks."
        buttonText="Explore the Fellowship"
        buttonStyle={{ color: '#854F0B' }}
        onButtonClick={() => go('/programs')}
        sectionStyle={{ background: '#854F0B' }}
      />

      <Footer />
    </>
  );
}
