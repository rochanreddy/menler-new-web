import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import MentorsRail from '../components/common/MentorsRail';
import ProjectModal from '../components/common/ProjectModal';
import PartnersMarquee from '../components/common/PartnersMarquee';
import { ENGINEERING_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

const PHASES = [
  { cls: 'p1', tag: 'Phase 1 · Weeks 1–4', title: 'Claude API & advanced prompting', items: ['Claude API — full spec mastery', 'Tool use, streaming, structured outputs', 'Prompt caching & cost optimisation', 'Multimodal: text + image + documents', 'Context engineering deep dive', 'Claude on Bedrock & Vertex AI'] },
  { cls: 'p2', tag: 'Phase 2 · Weeks 5–9', title: 'Agentic systems & full stack builds', items: ['RAG pipelines — chunk, embed, retrieve', 'Vector DBs: Pinecone, Chroma, FAISS', 'MCP — build & deploy production servers', 'Claude Code & agent skills', 'Multi-agent systems & Claude Agent SDK', 'Computer use integration'] },
  { cls: 'p3', tag: 'Phase 3 · Weeks 10–12', title: 'Evaluation, LLMOps & deployment', items: ['Evals: RAGAS, LLM-as-judge, custom benchmarks', 'Guardrails, safety, prompt injection defence', 'Observability & monitoring in production', 'Capstone: deployed production AI app', 'Claude Engineer certification exam', 'Demo Day & placement'] },
];

const SHIPPED_PROJECTS = [
  { title: 'Claude API integration', desc: 'Tool use + caching + streaming — deployed API wrapper' },
  { title: 'RAG pipeline', desc: 'Document ingestion → vector DB → grounded answers' },
  { title: 'MCP server', desc: 'Custom tools + resources, remotely deployed' },
  { title: 'Multi-agent system', desc: 'Orchestrator + specialist agents, Claude Agent SDK' },
  { title: 'Capstone app', desc: 'Full-stack production app with evals + observability' },
  { title: 'Claude Engineer cert', desc: 'Written + live coding exam. Domain specialist badge.', isCert: true },
];

const PORTFOLIO_PROJECTS = [
  { track: 'Week 4 · API', title: 'Production Claude API wrapper', meta: 'Tool use · Streaming · Caching', desc: 'Type-safe, retried, observability-ready Claude API client. Cost-optimised with prompt caching, deployed behind a FastAPI gateway.', stack: 'Stack: Python · FastAPI · Anthropic SDK · Redis' },
  { track: 'Week 6 · RAG', title: 'Grounded enterprise RAG pipeline', meta: 'Embeddings · Vector DB · Re-ranking', desc: 'Document ingestion → chunking → vector store → hybrid retrieval → grounded answers with citations and RAGAS evals.', stack: 'Stack: Pinecone · Voyage · Claude · RAGAS' },
  { track: 'Week 7 · MCP', title: 'Production MCP server', meta: 'Tools · Resources · Prompts', desc: 'Custom MCP server with 8+ tools and resources, deployed to Cloudflare Workers, connected to Claude Desktop and Cowork.', stack: 'Stack: TypeScript · MCP SDK · Workers · OAuth' },
  { track: 'Week 9 · Agents', title: 'Multi-agent research system', meta: 'Orchestrator · Specialists · SDK', desc: 'Lead agent that plans, delegates to specialist Claude sub-agents, runs in parallel, and writes a final research report.', stack: 'Stack: Claude Agent SDK · Python · LangFuse' },
  { track: 'Weeks 10–12 · Capstone', title: 'Full-stack production Claude app', meta: 'UI · Evals · Observability · Deploy', desc: 'End-to-end Claude application — frontend, agent backend, MCP integrations, evals dashboard, monitoring, and CI/CD.', stack: 'Stack: Next.js · Claude · Postgres · Sentry · Braintrust' },
  { track: 'Cert', title: 'Claude Engineer certification', meta: 'Written + live coding · Domain badge', desc: '3-hour written exam plus a live build session reviewed by senior Claude engineers. Earn the Claude Engineer — [Specialty] badge.', stack: 'Outcome: Claude Engineer — [Your specialty]', isCert: true },
];


const ROLES = [
  { name: 'AI Engineer (Claude)', comp: '₹22–42L · Scale-ups', desc: 'Build production Claude features — RAG, agents, tool use — across the full backend stack.' },
  { name: 'Applied AI Engineer', comp: '₹26–48L · Series B+ AI cos', desc: 'Own Claude integration end-to-end: prompt design, evals, latency, cost, deployment.' },
  { name: 'MCP / Integrations Engineer', comp: '₹24–40L · Enterprise SaaS', desc: 'Design and ship MCP servers connecting Claude to internal systems and partner APIs.' },
  { name: 'Agentic Systems Engineer', comp: '₹28–55L · AI-first startups', desc: 'Architect multi-agent systems with the Claude Agent SDK, orchestration, and safety rails.' },
  { name: 'LLMOps / Evals Engineer', comp: '₹24–44L · Regulated industries', desc: 'Build eval pipelines, observability, guardrails, and continuous regression for Claude in prod.' },
  { name: 'Founding AI Engineer', comp: '₹30–60L + ESOPs · Pre-seed/seed', desc: 'Be the first Claude engineer at an AI-native startup. Lead the entire AI stack from day one.' },
];

export default function Engineering() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' });
  const [done, setDone] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, program: 'engineering', source: 'engineering-page' }); } catch {}
    setDone(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero" style={{ background: '#085041' }}>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(93,202,165,0.1)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(93,202,165,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: '#5DCAA5' }}>Claude AI Engineering Fellowship · India</p>
          <h1 className="hero-h1" style={{ color: '#E1F5EE' }}>Build Claude AI systems<br /><em style={{ color: '#9FE1CB' }}>that go to production.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(225,245,238,0.55)' }}>India's 1st Claude AI Engineering Fellowship.<strong style={{ color: '#E1F5EE', fontWeight: 500 }}><br />Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ background: '#1D9E75' }} onClick={() => go('/scholarship')}>Apply Now</button>
            <button className="btn-outline" style={{ color: '#9FE1CB', borderColor: 'rgba(93,202,165,0.5)' }}>Download Brochure</button>
          </div>
          <div className="hero-stats" style={{ borderColor: 'rgba(93,202,165,0.2)' }}>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>90%</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Interview pipeline<br />target</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>25+</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Hiring<br />associations</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>20+</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>AI Builders<br />/ Operators</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>12</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Weeks intensive<br />fellowship</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>5+</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Shipped<br />projects</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: '#E1F5EE' }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>Who this is for</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>You already code.<br /><em style={{ color: 'var(--placed)' }}>Now build with Claude.</em></h2>
        <p className="section-sub">Designed for engineers and technical professionals who want to master the full Claude engineering stack — not just use AI, but build with it at production depth.</p>
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
        <div className="curric curric-eng">
          <div className="curric-terms">
            {PHASES.map((p, i) => (
              <button
                key={i}
                className={`curric-term${activePhase === i ? ' on' : ''}`}
                onClick={() => setActivePhase(i)}
              >
                <span className="curric-term-no">{p.tag}</span>
                <span className="curric-term-title">{p.title}</span>
              </button>
            ))}
          </div>
          <div className="curric-detail curric-soon">
            <p className="curric-soon-title">Coming Soon</p>
            <p className="curric-soon-sub">The full phase-by-phase breakdown for {PHASES[activePhase].tag.split(' · ')[0]} drops soon. Join the waitlist to get it first.</p>
            <button className="btn-primary" style={{ background: '#1D9E75' }} onClick={() => go('/scholarship')}>Join the waitlist →</button>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU'LL SHIP ── */}
      <section className="section" style={{ background: '#085041' }}>
        <p className="section-label" style={{ color: '#5DCAA5' }}>What you'll ship</p>
        <h2 className="section-h2" style={{ color: '#E1F5EE' }}>5 production-grade<br /><em style={{ color: '#9FE1CB' }}>Claude projects.</em></h2>
        <p className="section-sub" style={{ color: 'rgba(225,245,238,0.55)' }}>Not demos. Not notebooks. Deployed, documented, evaluated systems you can show to any engineering team.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 32 }}>
          {SHIPPED_PROJECTS.map((p, i) => (
            <div key={i} style={p.isCert ? { background: 'rgba(29,158,117,0.2)', border: '0.5px solid rgba(93,202,165,0.35)', borderRadius: 10, padding: 16 } : { background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(93,202,165,0.2)', borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: p.isCert ? '#9FE1CB' : '#E1F5EE', marginBottom: 4 }}>{p.title}</p>
              <p style={{ fontSize: 12, color: p.isCert ? 'rgba(159,225,203,0.6)' : 'rgba(225,245,238,0.5)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PORTFOLIO PROJECTS ── */}
      <section className="section proj-eng" style={{ background: '#062B22' }}>
        <p className="section-label" style={{ color: '#5DCAA5' }}>Portfolio projects</p>
        <h2 className="section-h2" style={{ color: '#E1F5EE' }}>Five shipped systems.<br /><em style={{ color: '#9FE1CB' }}>Reviewed by senior engineers.</em></h2>
        <p className="section-sub" style={{ color: 'rgba(225,245,238,0.55)' }}>Each project goes through code review, evaluation, and a live demo. Push to your GitHub. Show in any AI engineering interview.</p>
        <div className="proj-grid">
          {PORTFOLIO_PROJECTS.map((p, i) => (
            <div
              key={i}
              className="proj-card proj-card--clickable"
              style={p.isCert ? { background: 'rgba(29,158,117,0.18)', borderColor: 'rgba(93,202,165,0.35)' } : {}}
              role="button"
              tabIndex={0}
              onClick={() => setActiveProject(p)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveProject(p); } }}
            >
              <span className="proj-track" style={p.isCert ? { background: 'var(--placed)', color: 'white' } : {}}>{p.track}</span>
              <p className="proj-name">{p.title}</p>
              <p className="proj-meta">{p.meta}</p>
              <p className="proj-desc">{p.desc}</p>
              <p className="proj-stack">{p.stack}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HIRING PARTNERS ── */}
      <section className="hiring-section dark">
        <p className="section-label" style={{ color: '#5DCAA5', textAlign: 'center' }}>Hiring partners</p>
        <h2 className="section-h2" style={{ color: '#E1F5EE', textAlign: 'center' }}>Where Claude AI Engineers<br /><em style={{ color: '#9FE1CB' }}>get placed.</em></h2>
        <p className="section-sub" style={{ color: 'rgba(225,245,238,0.55)', textAlign: 'center' }}>25+ partner companies hiring AI engineers, applied scientists, and infra engineers — direct pipeline from Demo Day onward.</p>
        <PartnersMarquee />
        <div className="roles-grid">
          {ROLES.map((r, i) => (
            <div key={i} className="role-card">
              <p className="role-name">{r.name}</p>
              <p className="role-comp">{r.comp}</p>
              <p className="role-desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUCCESS STORY ── */}
      <section className="prog-story dark">
        <p className="section-label" style={{ color: '#5DCAA5', textAlign: 'center' }}>Engineering alumni</p>
        <h2 className="section-h2" style={{ color: '#E1F5EE', textAlign: 'center' }}>From backend dev<br /><em style={{ color: '#9FE1CB' }}>to founding AI engineer.</em></h2>
        <article className="story-card-prog">
          <div className="story-portrait">K</div>
          <div>
            <p className="story-quote">"I joined as a Spring Boot dev with zero LLM experience. The capstone — a multi-agent research system on the Claude Agent SDK — got me four offers. I picked the YC-backed one as founding AI engineer."</p>
            <p className="story-meta-line"><strong>Karan Iyer</strong> · Founding AI Engineer at Loomwise (YC F25) · Engineering Cohort 01</p>
            <div className="story-stats">
              <div><p>4</p><p>Offers</p></div>
              <div><p>₹38L</p><p>Base + ESOPs</p></div>
              <div><p>11 wks</p><p>To placement</p></div>
            </div>
          </div>
        </article>
      </section>

      {/* ── LEAD FORM ── */}
      <section className="prog-lead dark">
        <div className="prog-lead-inner">
          <div className="prog-lead-copy">
            <h3>Get the Engineering <em>brochure & syllabus</em>.</h3>
            <p>Full Claude engineering stack — API, RAG, MCP, agents, evals — plus mentor list, fee structure, and Cohort 01 timeline.</p>
          </div>
          {done ? (
            <p style={{ color: '#9FE1CB', fontWeight: 500 }}>✓ Brochure on its way.</p>
          ) : (
            <form className="prog-lead-form" onSubmit={handleSubmit}>
              <label>Full name</label>
              <input type="text" required placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
              <div className="row2">
                <div><label>Email</label><input type="email" required placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" /></div>
                <div><label>WhatsApp</label><input type="tel" required placeholder="+91 …" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" /></div>
              </div>
              <label>Current role</label>
              <select required value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="">Choose your background</option>
                <option>Software engineer (backend)</option>
                <option>Software engineer (frontend / fullstack)</option>
                <option>Data scientist</option>
                <option>ML engineer</option>
                <option>IT / DevOps engineer</option>
                <option>Deep tech / systems engineer</option>
                <option>Final-year CS / engineering student</option>
              </select>
              <button type="submit">Send Engineering brochure →</button>
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

      <MentorsRail />

      <CtaBanner
        badge="Applications open · Cohort 01 · 30 seats"
        title="Ready to build Claude-native systems?"
        subtitle="Python required. Ambition mandatory. 12 weeks to production."
        buttonText="Sign up"
        buttonStyle={{ color: 'var(--forest)' }}
        sectionStyle={{ background: 'var(--forest)' }}
        onButtonClick={() => go('/scholarship')}
      />

      <Footer />

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
