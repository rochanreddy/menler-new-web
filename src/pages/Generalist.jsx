import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import MentorsRail from '../components/common/MentorsRail';
import ProjectModal from '../components/common/ProjectModal';
import PartnersMarquee from '../components/common/PartnersMarquee';
import { GENERALIST_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

const CURRICULUM = [
  {
    label: 'Phase 1', weeks: 'Weeks 1–4', title: 'AI fluency & Claude foundations',
    modules: ['Week 1 — How AI & LLMs work (no code)', 'Week 2 — Claude.ai features & prompt engineering', 'Week 3 — Multimodal prompting & Claude Projects', 'Week 4 — No-code app building & deployment'],
    tools: ['Make', 'OpenAI', 'Canva', 'Zapier', 'Typedream', 'Airtable', 'Claude', 'Notion'],
    projects: ['Personal AI assistant', 'No-code landing page', 'First automation workflow'],
  },
  {
    label: 'Phase 2', weeks: 'Weeks 5–8', title: 'Agentic workflows & real builds',
    modules: ['Week 5 — Agentic thinking & workflow design', 'Week 6 — Claude Cowork & Projects', 'Week 7 — MCP: connecting Claude to tools', 'Week 8 — Claude in Excel, PPT & Docs'],
    tools: ['Claude Cowork', 'MCP', 'Make', 'Zapier', 'n8n', 'Slack', 'Gmail', 'Excel'],
    projects: ['Domain automation agent', 'Multi-tool MCP workflow', 'Live cohort build'],
  },
  {
    label: 'Phase 3', weeks: 'Weeks 9–12', title: 'Domain specialisation, capstone & placement',
    domains: [
      { name: "Founder's Office", modules: ['Decision-intelligence agent', 'Weekly briefing automation', 'Exec reporting'], tools: ['Claude', 'MCP', 'Slack', 'Notion'], projects: ['CEO weekly briefing agent'] },
      { name: 'Venture Capital', modules: ['Deal sourcing', 'Memo writing', 'Thesis-grounded screening'], tools: ['Cowork', 'Web search', 'Projects'], projects: ['Deal-flow triage agent'] },
      { name: 'Marketing', modules: ['Brand-voice Skill', 'Content engine', 'Campaign automation'], tools: ['Skills', 'Canva', 'Buffer'], projects: ['Always-on content engine'] },
      { name: 'Analyst', modules: ['Research synthesis', 'Insight memos', 'Multimodal tables'], tools: ['Claude API', 'Web search', 'Excel'], projects: ['Research insight engine'] },
      { name: 'Finance', modules: ['Budget variance', 'Claude in Excel', 'CFO decks'], tools: ['Excel', 'Claude', 'PowerPoint'], projects: ['Budget variance commentator'] },
      { name: 'Operations', modules: ['SOP automation', 'Triage & routing', 'Audit logs'], tools: ['MCP', 'Cowork', 'Slack'], projects: ['SOP automation agent'] },
      { name: 'Technology', modules: ['No-code app builder', 'Artifacts', 'Internal tools'], tools: ['Artifacts', 'Projects', 'Cowork'], projects: ['No-code internal tool'] },
    ],
  },
];

const TRACKS = [
  { name: "Founder's office", role: 'Decision intelligence · Reporting agents' },
  { name: 'Venture capital', role: 'Deal sourcing · Due diligence' },
  { name: 'Marketing', role: 'Content engines · Campaign automation' },
  { name: 'Analyst', role: 'Research agents · Insight automation' },
  { name: 'Finance', role: 'Earnings analysis · Risk summaries' },
  { name: 'Operations', role: 'SOP automation · Workflow agents' },
  { name: 'Technology', role: 'No-code AI tools · Automation' },
  { name: 'Business owners', role: 'Custom 2-domain · Your business', dashed: true },
];

const PROJECTS = [
  { track: "Founder's office", title: 'CEO weekly briefing agent', meta: 'Week 6 · Skills + MCP · Live deployment', desc: "A Claude Skill that pulls metrics from connected tools, summarises wins/blockers, and publishes a Monday brief to the founder's inbox.", stack: 'Stack: Claude Projects · Skills · Gmail MCP' },
  { track: 'Venture capital', title: 'Deal-sourcing research agent', meta: 'Week 7 · Cowork · Multi-doc', desc: 'Cowork-driven workflow that screens decks, writes investment memos, and flags red-flags grounded in your fund thesis.', stack: 'Stack: Cowork · Projects · Web search' },
  { track: 'Marketing', title: 'Always-on content engine', meta: 'Week 5 · Skills · Brand voice', desc: 'Brand-trained Claude Skill generating blog, LinkedIn, and ad copy with on-brand tone — drafts ready for review in minutes.', stack: 'Stack: Skills · Style guides · Prompt library' },
  { track: 'Analyst', title: 'Earnings call insight engine', meta: 'Week 8 · Multimodal · Tables', desc: 'Transcript + financials in, structured insight memo out — competitive read, sentiment, and KPI delta in a single Claude run.', stack: 'Stack: Multimodal · Excel · Skills' },
  { track: 'Finance', title: 'Budget variance commentator', meta: 'Week 9 · Excel + Claude · Templates', desc: 'Claude in Excel that reads actual vs. plan, writes management commentary, and drafts the CFO review deck.', stack: 'Stack: Claude in Excel · PPT · Skills' },
  { track: 'Operations', title: 'SOP automation agent', meta: 'Week 6 · MCP · Workflow', desc: 'Turn a messy SOP into a Claude-driven workflow that handles intake, triage, and routing with audit-ready logs.', stack: 'Stack: MCP · Cowork · Slack' },
  { track: 'Technology', title: 'No-code AI app builder', meta: 'Week 10 · Artifacts · Forms', desc: 'Build a working internal tool — input form, Claude reasoning layer, output dashboard — without writing a line of Python.', stack: 'Stack: Artifacts · Projects · Cowork' },
  { track: 'Capstone', title: 'Domain Specialist capstone', meta: 'Weeks 11–12 · Demo Day · Cert', desc: 'A real, deployed automation for a real organisation — judged by industry mentors. Powers your Claude Specialist certification.', stack: 'Outcome: Claude Specialist — [Your domain]', isCap: true },
];


const ROLES = [
  { name: 'AI Specialist — Founder\'s Office', comp: '₹16–28L · Series B+ startups', desc: 'Run Claude-powered briefings, decision memos, and reporting agents directly for the CEO.' },
  { name: 'AI Marketing Lead', comp: '₹14–24L · D2C / SaaS', desc: 'Own content engines, campaign automation, and brand-trained Claude Skills end-to-end.' },
  { name: 'VC AI Analyst', comp: '₹18–32L · India + US funds', desc: 'Source deals, write memos, and run diligence with Claude-driven research workflows.' },
  { name: 'AI Finance Analyst', comp: '₹15–22L · BFSI / listed cos.', desc: 'Earnings analysis, variance commentary, and CFO reporting via Claude in Excel.' },
  { name: 'AI Operations Manager', comp: '₹14–20L · Scale-ups', desc: 'Automate SOPs and intake-triage workflows across customer support and ops.' },
  { name: 'AI Strategy Consultant', comp: '₹18–30L · Consulting / Big 4', desc: 'Lead Claude transformation engagements for enterprise clients across India.' },
];

export default function Generalist() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', phone: '', track: '' });
  const [done, setDone] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [activeDomain, setActiveDomain] = useState(0);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, program: 'generalist', source: 'generalist-page' }); } catch {}
    setDone(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-ring r1" /><div className="hero-ring r2" />
        <div className="hero-inner">
          <p className="hero-eyebrow">Claude AI Generalist Fellowship · India</p>
          <h1 className="hero-h1">Master Claude AI.<br /><em>Transform your domain.</em></h1>
          <p className="hero-sub">India's 1st Claude AI Specialist Fellowship.<strong style={{ color: '#EEEDFE', fontWeight: 500 }}><br />Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => go('/scholarship')}>Apply Now</button>
            <button className="btn-outline">Download Brochure</button>
          </div>
          <div className="hero-stats">
            <div><span className="hero-stat-num">90%</span><span className="hero-stat-lbl">Interview pipeline<br />target</span></div>
            <div><span className="hero-stat-num">25+</span><span className="hero-stat-lbl">Hiring<br />associations</span></div>
            <div><span className="hero-stat-num">20+</span><span className="hero-stat-lbl">AI Builders<br />/ Operators</span></div>
            <div><span className="hero-stat-num">12</span><span className="hero-stat-lbl">Weeks intensive<br />fellowship</span></div>
            <div><span className="hero-stat-num">7+</span><span className="hero-stat-lbl">Domain<br />tracks</span></div>
            <div><span className="hero-stat-num">5+</span><span className="hero-stat-lbl">Shipped<br />projects</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Who this is for</p>
        <h2 className="section-h2">Any background.<br /><em>Any domain. Zero code.</em></h2>
        <p className="section-sub">If you work with information, decisions, or people — Claude can make you dramatically more effective. No Python required.</p>
        <div className="audience-grid">
          <div className="audience-card"><div className="ava" style={{ background: 'var(--cloud)', color: 'var(--specialist)' }}>ST</div><p className="audience-role">Students</p><p className="audience-desc">Any discipline. Enter the job market as AI-native.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FAEEDA', color: '#854F0B' }}>WP</div><p className="audience-role">Professionals</p><p className="audience-desc">Tech & non-tech. Lead AI in your current role.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FCEBEB', color: '#A32D2D' }}>BO</div><p className="audience-role">Business owners</p><p className="audience-desc">Use Claude to run your business smarter.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#E1F5EE', color: '#085041' }}>FO</div><p className="audience-role">Founders</p><p className="audience-desc">Build with Claude without an engineering team.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>CS</div><p className="audience-role">Career switchers</p><p className="audience-desc">Move into AI-adjacent roles with a real credential.</p></div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">12-week curriculum</p>
        <h2 className="section-h2">From curious<br /><em>to Claude Specialist.</em></h2>
        <p className="section-sub">Three phases, no code — just Claude mastery applied to your domain. Pick a phase to open its modules, tools, and projects.</p>
        <div className="curric">
          <div className="curric-terms">
            {CURRICULUM.map((p, i) => (
              <button
                key={i}
                className={`curric-term${activePhase === i ? ' on' : ''}`}
                onClick={() => setActivePhase(i)}
              >
                <span className="curric-term-no">{p.label} · {p.weeks}</span>
                <span className="curric-term-title">{p.title}</span>
              </button>
            ))}
          </div>

          <div className="curric-detail">
            {activePhase < 2 ? (
              <>
                <p className="curric-label">Modules · week by week</p>
                <ul className="curric-modules">
                  {CURRICULUM[activePhase].modules.map(m => <li key={m}>{m}</li>)}
                </ul>
                <p className="curric-label" style={{ marginTop: 28 }}>Tools</p>
                <div className="curric-tools">
                  {CURRICULUM[activePhase].tools.map(t => <span key={t} className="curric-tool">{t}</span>)}
                </div>
                <p className="curric-label" style={{ marginTop: 28 }}>Projects you'll build</p>
                <ul className="curric-modules">
                  {CURRICULUM[activePhase].projects.map(pr => <li key={pr}>{pr}</li>)}
                </ul>
              </>
            ) : (
              <>
                <p className="curric-label">Domain tracks</p>
                <div className="curric-domains">
                  {CURRICULUM[2].domains.map((d, di) => (
                    <button
                      key={d.name}
                      className={`curric-domain${activeDomain === di ? ' on' : ''}`}
                      onClick={() => setActiveDomain(di)}
                    >
                      {d.name}<span className="curric-domain-caret">{activeDomain === di ? '▾' : '▸'}</span>
                    </button>
                  ))}
                </div>
                <p className="curric-label" style={{ marginTop: 24 }}>Modules · {CURRICULUM[2].domains[activeDomain].name}</p>
                <ul className="curric-modules">
                  {CURRICULUM[2].domains[activeDomain].modules.map(m => <li key={m}>{m}</li>)}
                </ul>
                <p className="curric-label" style={{ marginTop: 24 }}>Tools</p>
                <div className="curric-tools">
                  {CURRICULUM[2].domains[activeDomain].tools.map(t => <span key={t} className="curric-tool">{t}</span>)}
                </div>
                <p className="curric-label" style={{ marginTop: 24 }}>Projects you'll build</p>
                <ul className="curric-modules">
                  {CURRICULUM[2].domains[activeDomain].projects.map(pr => <li key={pr}>{pr}</li>)}
                </ul>
              </>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" onClick={() => go('/scholarship')}>Download curriculum →</button>
        </div>
      </section>

      {/* ── DOMAIN TRACKS ── */}
      <section className="section tracks-dark">
        <p className="section-label" style={{ color: 'var(--lavender)' }}>Domain tracks</p>
        <h2 className="section-h2" style={{ color: '#EEEDFE' }}>Your Claude skills,<br /><em>applied to your career.</em></h2>
        <p className="section-sub" style={{ color: 'rgba(238,237,254,0.5)' }}>Choose your track in Week 8. Capstone, certification module, and job matching are all domain-specific.</p>
        <div className="tracks-grid">
          {TRACKS.map((t, i) => (
            <div key={i} className="track" style={t.dashed ? { borderStyle: 'dashed' } : {}}>
              <p className="track-name">{t.name}</p>
              <p className="track-role">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PORTFOLIO PROJECTS ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">What you'll build</p>
        <h2 className="section-h2">Eight no-code Claude builds.<br /><em>One certification portfolio.</em></h2>
        <p className="section-sub">Real domain projects you'll ship from your Claude account — no code, just structured prompting, Claude Skills, MCPs, and Cowork.</p>
        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="proj-card proj-card--clickable"
              style={p.isCap ? { background: 'var(--cloud)', borderColor: 'rgba(83,74,183,0.25)' } : {}}
              role="button"
              tabIndex={0}
              onClick={() => setActiveProject(p)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveProject(p); } }}
            >
              <span className="proj-track" style={p.isCap ? { background: 'var(--specialist)', color: 'white' } : {}}>{p.track}</span>
              <p className="proj-name">{p.title}</p>
              <p className="proj-meta">{p.meta}</p>
              <p className="proj-desc">{p.desc}</p>
              <p className="proj-stack">{p.stack}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HIRING PARTNERS ── */}
      <section className="hiring-section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Hiring partners</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>Where Claude AI Generalists<br /><em>get hired.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center' }}>25+ partner companies hiring across our 7 domain tracks. Direct pipeline from Demo Day → interview → offer.</p>
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
      <section className="prog-story">
        <p className="section-label" style={{ textAlign: 'center' }}>Generalist alumni</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>From career switcher<br /><em>to Claude Specialist.</em></h2>
        <article className="story-card-prog">
          <div className="story-portrait">A</div>
          <div>
            <p className="story-quote">"Six months ago I was a marketing manager drowning in content briefs. Today I run a four-person Claude-native content team for a Series-C D2C brand — at 2.4× my old salary."</p>
            <p className="story-meta-line"><strong>Anjali Verma</strong> · Marketing Lead at Lyra Brands · Generalist Cohort 01 · Marketing track</p>
            <div className="story-stats">
              <div><p>2.4×</p><p>Salary lift</p></div>
              <div><p>₹22L</p><p>New offer</p></div>
              <div><p>9 wks</p><p>To placement</p></div>
            </div>
          </div>
        </article>
      </section>

      {/* ── LEAD FORM ── */}
      <section className="prog-lead">
        <div className="prog-lead-inner">
          <div className="prog-lead-copy">
            <h3>Get the Generalist <em>brochure & syllabus</em>.</h3>
            <p>Full 12-week curriculum, mentor list, fee structure, scholarships, and Cohort 01 timeline. Sent to your inbox in under a minute.</p>
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
              <label>Track of interest</label>
              <select required value={form.track} onChange={e => set('track', e.target.value)}>
                <option value="">Choose a domain track</option>
                <option>Founder's Office</option>
                <option>Venture Capital</option>
                <option>Marketing</option>
                <option>Analyst</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>Technology</option>
                <option>Business owner — custom</option>
                <option>Not sure yet</option>
              </select>
              <button type="submit">Send Generalist brochure →</button>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center' }}>
        <p className="section-label">FAQ</p>
        <h2 className="section-h2">Your questions answered</h2>
        <FaqList items={GENERALIST_FAQS} />
      </section>

      <MentorsRail />

      <CtaBanner
        badge="Applications open · Cohort 01 · 30 seats"
        title="Ready to become a Claude AI Generalist?"
        subtitle="No coding experience. Just 12 weeks and real ambition."
        buttonText="Sign up"
        onButtonClick={() => go('/scholarship')}
      />

      <Footer />

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
