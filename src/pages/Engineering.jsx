import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import MentorsRail from '../components/common/MentorsRail';
import { useApply } from '../components/common/ApplyContext';
import HiringJobs from '../components/common/HiringJobs';
import { ENGINEERING_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

// Hiring section content for the Engineering page only — edit freely, it does
// NOT affect the Generalist / Kickstarter hiring sections.
const ENG_HIRING = {
  label: 'Hiring associations & roles',
  title: 'The jobs',
  titleEm: 'Claude AI Engineers are landing.',
  sub: 'Companies are hiring engineers who can build and ship Claude-native systems in production.',
  genLabel: 'AI Engineering',
  engLabel: 'Advanced AI Systems',
  genRoles: [
    { name: 'AI Engineer', band: '₹20–40L · Product & AI teams' },
    { name: 'Claude Solutions Engineer', band: '₹22–45L · AI-native startups' },
    { name: 'RAG Engineer', band: '₹22–40L · Knowledge systems teams' },
    { name: 'Agent Engineer', band: '₹24–45L · Agentic AI companies' },
    { name: 'AI Product Engineer', band: '₹20–38L · Product organizations' },
    { name: 'AI Platform Engineer', band: '₹25–48L · Enterprise AI teams' },
  ],
  engRoles: [
    { name: 'LLMOps Engineer', band: '₹22–42L · Production AI teams' },
    { name: 'MCP Platform Engineer', band: '₹25–48L · AI infrastructure teams' },
    { name: 'AI Infrastructure Engineer', band: '₹24–46L · Platform & infra teams' },
    { name: 'AI Research Engineer', band: '₹25–55L · Frontier AI teams' },
    { name: 'Applied AI Scientist', band: '₹30–60L · Research organizations' },
    { name: 'Agentic Systems Engineer', band: '₹28–55L · AI-first companies' },
  ],
};

export default function Engineering() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' });
  const [done, setDone] = useState(false);
  const openApply = useApply();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, program: 'engineering', source: 'engineering-page' }); } catch {}
    setDone(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero" style={{ background: '#085041', paddingTop: 64 }}>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(93,202,165,0.1)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(93,202,165,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: '#5DCAA5' }}>Claude AI Engineering Fellowship · India</p>
          <h1 className="hero-h1" style={{ color: '#E1F5EE' }}>Build Claude AI systems<br /><em style={{ color: '#9FE1CB' }}>that go to production.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(225,245,238,0.55)' }}>India's only Claude AI Engineering Fellowship.<strong style={{ color: '#E1F5EE', fontWeight: 500 }}><br />Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ background: '#1D9E75', minWidth: 220, textAlign: 'center' }} onClick={openApply}>Apply Now</button>
            <button className="btn-outline" style={{ color: '#9FE1CB', borderColor: 'rgba(93,202,165,0.5)', minWidth: 220, textAlign: 'center' }}>Download Brochure</button>
          </div>
          <div className="hero-stats" style={{ borderColor: 'rgba(93,202,165,0.2)' }}>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>90%</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Interview pipeline<br />target</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>25+</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Hiring<br />associations</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>10+</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>AI engineers<br />& Operators</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>12</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Weeks intensive<br />fellowship</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>5+</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Shipped<br />projects</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: '#E1F5EE' }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>Who this is for</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>You already code.<br /><em style={{ color: 'var(--placed)' }}>Now build with Claude.</em></h2>
        <p className="section-sub">The AI-native products of the next decade will be built by engineers who know how to work with AI.</p>
        <div className="audience-grid">
          <div className="audience-card"><div className="ava" style={{ background: '#E1F5EE', color: '#085041' }}>SE</div><p className="audience-role">Software engineers</p><p className="audience-desc">Frontend, backend, fullstack. Build Claude-native apps.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: 'var(--cloud)', color: 'var(--specialist)' }}>DS</div><p className="audience-role">Data scientists</p><p className="audience-desc">RAG pipelines, evals, and agentic data workflows.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FAEEDA', color: '#854F0B' }}>ML</div><p className="audience-role">ML practitioners</p><p className="audience-desc">Fine-tuning, context engineering, LLMOps.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FCEBEB', color: '#A32D2D' }}>IT</div><p className="audience-role">IT engineers</p><p className="audience-desc">MCP servers, integrations, enterprise deployments.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>DT</div><p className="audience-role">Deep tech</p><p className="audience-desc">Systems, infra, and production AI architecture.</p></div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">12-week curriculum</p>
        <h2 className="section-h2">From engineer<br /><em>to Claude Specialist.</em></h2>
        <p className="section-sub">The full Claude engineering stack — API, RAG, MCP, agents, evaluation, LLMOps. Shipped to production.</p>
        <div className="curric curric-eng" style={{ display: 'block' }}>
          <div className="curric-detail curric-soon">
            <p className="curric-soon-title">Coming Soon</p>
            <p className="curric-soon-sub">The full phase-by-phase curriculum breakdown drops soon. Join the waitlist to get it first.</p>
            <button className="btn-primary" style={{ background: '#1D9E75' }} onClick={openApply}>Join the waitlist</button>
          </div>
        </div>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail />

      {/* ── HIRING PARTNERS & ROLES ── */}
      <HiringJobs {...ENG_HIRING} />

      {/* ── LEAD FORM ── */}
      <section className="mini-lead">
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>Get the Engineering <em>brochure & syllabus</em>.</h3>
            <p>Full Claude engineering stack — API, RAG, MCP, agents, evals — plus mentor list, fee structure, and Cohort 01 timeline.</p>
          </div>
          {done ? (
            <div className="mini-lead-success">✓ Brochure on its way.</div>
          ) : (
            <form className="mini-lead-form" onSubmit={handleSubmit}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              <select required aria-label="Current role" value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="">You are…</option>
                <option>Software engineer (backend)</option>
                <option>Software engineer (frontend / fullstack)</option>
                <option>Data scientist</option>
                <option>ML engineer</option>
                <option>IT / DevOps engineer</option>
                <option>Deep tech / systems engineer</option>
                <option>Final-year CS / engineering student</option>
              </select>
              <button type="submit">Send brochure</button>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center' }}>
        <p className="section-label">FAQ</p>
        <h2 className="section-h2">Engineering program FAQ</h2>
        <FaqList items={ENGINEERING_FAQS} />
      </section>

      <CtaBanner
        badge="Applications open · Cohort 01 · 30 seats"
        title="Ready to build Claude-native systems?"
        subtitle="Python required. Ambition mandatory. 12 weeks to production."
        buttonText="Sign up"
        buttonStyle={{ color: 'var(--forest)' }}
        sectionStyle={{ background: 'var(--forest)' }}
        onButtonClick={openApply}
      />

      <Footer />
    </>
  );
}
