import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import MentorsRail from '../components/common/MentorsRail';
import ProjectModal from '../components/common/ProjectModal';
import { useApply } from '../components/common/ApplyContext';
import HiringJobs from '../components/common/HiringJobs';
import { GENERALIST_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

const CURRICULUM = [
  {
    label: 'Phase 1', weeks: 'Weeks 1–4', title: 'AI fluency & Claude foundations',
    modules: [
      { w: 'Week 1 — AI & LLM Foundations', d: 'Learn how modern AI works, how Large Language Models generate responses, and why prompting matters. Understand key concepts like tokens, context windows, embeddings, and the current AI ecosystem. By the end of the week, you\'ll have a strong foundation for working with AI tools confidently.' },
      { w: 'Week 2 — Claude Mastery & Prompt Engineering', d: 'Master Claude\'s core features and learn how to communicate effectively with AI. You\'ll create reusable prompt systems, organize AI workspaces, and learn techniques that consistently produce high-quality results for work, study, and projects.' },
      { w: 'Week 3 — Advanced Prompting & AI Productivity', d: 'Explore advanced prompting frameworks, research workflows, and AI-powered productivity systems. Learn how to use AI for content creation, research, note-taking, meeting summaries, and knowledge management while building your own personal AI workflow.' },
      { w: 'Week 4 — AI Creativity & No-Code Building', d: 'Learn to create images, videos, audio, presentations, and simple applications using AI. Explore creative AI tools and build real projects without coding, turning ideas into usable products and media assets.' },
    ],
    tools: ['Make', 'OpenAI', 'Canva', 'Zapier', 'Typedream', 'Airtable', 'Claude', 'Notion'],
    projects: ['Personal AI assistant', 'No-code landing page', 'First automation workflow'],
  },
  {
    label: 'Phase 2', weeks: 'Weeks 5–8', title: 'Agentic workflows & real builds',
    modules: [
      { w: 'Week 5 — AI Agents & Automation', d: 'Understand how AI agents work and learn to automate repetitive tasks. Connect different tools and services together to create workflows that can collect information, make decisions, and perform actions automatically.' },
      { w: 'Week 6 — Voice AI & Intelligent Systems', d: 'Build voice-enabled AI experiences using speech recognition and voice generation technologies. Learn how conversational AI systems work and create assistants that can listen, respond, and perform tasks through voice interactions.' },
      { w: 'Week 7 — AI App Development', d: 'Use AI-assisted development tools to build web applications faster. Learn how to turn ideas into functional products, connect databases and APIs, and create real-world AI-powered applications with minimal coding.' },
      { w: 'Week 8 — Capstone Project & Product Launch', d: 'Bring everything together by building and launching a complete AI-powered project. Focus on product refinement, deployment, presentation skills, and creating a portfolio-worthy solution that demonstrates your AI capabilities.' },
    ],
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

// Hiring section content for the Generalist page only — edit freely, it does
// NOT affect the Engineering / Kickstarter hiring sections.
const GEN_HIRING = {
  sectionStyle: { paddingTop: 40 },
  label: 'Hiring associations & roles',
  title: 'The jobs',
  titleEm: 'AI specialists are landing.',
  sub: "AI adoption is accelerating. Demand for AI-native professionals is accelerating faster.",
  genLabel: 'Domain roles',
  engLabel: 'AI-native roles',
  genRoles: [
    { name: 'AI Strategist', band: '₹15–28L · Consulting & in-house' },
    { name: 'AI Product Manager', band: '₹16–30L · SaaS & platforms' },
    { name: 'Domain AI Consultant', band: '₹15–30L · Boutique consulting' },
    { name: 'Automation Specialist', band: '₹12–24L · Ops & workflow teams' },
    { name: 'AI Program Manager', band: '₹16–28L · Transformation teams' },
    { name: 'Prompt / Workflow Lead', band: '₹14–26L · AI-first startups' },
  ],
  engRoles: [
    { name: 'AI Specialist', band: '₹12–22L · Domain teams' },
    { name: "Founder's Office Associate", band: '₹14–24L · Startups & funds' },
    { name: 'Marketing AI Lead', band: '₹14–25L · Brand & growth teams' },
    { name: 'Operations AI Analyst', band: '₹10–18L · Ops & finance' },
    { name: 'Finance AI Analyst', band: '₹12–22L · BFSI & fintech' },
    { name: 'Customer Experience AI Lead', band: '₹12–20L · Support & success' },
  ],
};

const TRACKS = [
  { name: "Founder's Office", role: 'Decision intelligence · Exec briefings' },
  { name: 'Product Management', role: 'Discovery · PRDs · Roadmaps' },
  { name: 'Finance & Operations', role: 'financial analysis · risk management  · process automation' },
  { name: 'Marketing & Sales', role: 'Content engines · GTM · CRM' },
  { name: 'HR Operations', role: 'recruitment operation · employee experience · payroll automation' },
  { name: 'Business Analysis', role: 'data storytelling · decision  · intelligent' },
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

// Logo per curriculum tool (local file, with text fallback if it fails).
const TOOL_LOGO_SRC = {
  'Claude': '/logos/claude.svg', 'Claude Cowork': '/logos/claude.svg', 'Cowork': '/logos/claude.svg',
  'Claude API': '/logos/claude.svg', 'Projects': '/logos/claude.svg', 'Skills': '/logos/claude.svg',
  'Artifacts': '/logos/claude.svg', 'MCP': '/logos/mcp.svg', 'OpenAI': '/logos/openai.png',
  'Canva': '/logos/canva.png', 'Notion': '/logos/notion.png', 'Make': '/logos/make.png',
  'Zapier': '/logos/zapier.png', 'Airtable': '/logos/airtable.png', 'Typedream': '/logos/typedream.png',
  'n8n': '/logos/n8n.png', 'Slack': '/logos/slack.png', 'Gmail': '/logos/gmail.png',
  'Excel': '/logos/excel.png', 'PowerPoint': '/logos/powerpoint.png', 'Buffer': '/logos/buffer.png',
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

export default function Generalist() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', phone: '', track: '' });
  const [done, setDone] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [activeDomain, setActiveDomain] = useState(0);
  const [openWeek, setOpenWeek] = useState(null);
  const openApply = useApply();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, program: 'generalist', source: 'generalist-page' }); } catch {}
    setDone(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero" style={{ paddingTop: 64 }}>
        <div className="hero-ring r1" /><div className="hero-ring r2" />
        <div className="hero-inner">
          <p className="hero-eyebrow">Claude AI Generalist Fellowship · India</p>
          <h1 className="hero-h1">Master Claude AI.<br /><em>Transform your domain.</em></h1>
          <p className="hero-sub">India's Only Claude AI Specialist Fellowship.<strong style={{ color: '#EEEDFE', fontWeight: 500 }}><br />Learning that ships. Credential that counts. Outcomes that compound.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ minWidth: 220, textAlign: 'center' }} onClick={openApply}>Apply Now</button>
            <button className="btn-outline" style={{ minWidth: 220, textAlign: 'center' }}>Download Brochure</button>
          </div>
          <div className="hero-stats hero-stats-6">
            <div><span className="hero-stat-num">90%</span><span className="hero-stat-lbl">Interview pipeline<br />target</span></div>
            <div><span className="hero-stat-num">25+</span><span className="hero-stat-lbl">Hiring<br />associations</span></div>
            <div><span className="hero-stat-num">20+</span><span className="hero-stat-lbl">AI Builders<br />& Operators</span></div>
            <div><span className="hero-stat-num">12</span><span className="hero-stat-lbl">Weeks intensive<br />fellowship</span></div>
            <div><span className="hero-stat-num">7+</span><span className="hero-stat-lbl">Domain<br />tracks</span></div>
            <div><span className="hero-stat-num">5+</span><span className="hero-stat-lbl">Shipped<br />projects</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: 'var(--parchment)', paddingTop: 40 }}>
        <p className="section-label">Who this is for</p>
        <h2 className="section-h2">Any background.<br /><em>Any domain. Zero code.</em></h2>
        <p className="section-sub">The AI-native workforce won't be made up of engineers alone. It will be built by professionals across every domain.</p>
        <div className="audience-grid">
          <div className="audience-card"><div className="ava" style={{ background: 'var(--cloud)', color: 'var(--specialist)' }}>ST</div><p className="audience-role">Students</p><p className="audience-desc">Any discipline. Enter the job market as AI-native.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FAEEDA', color: '#854F0B' }}>WP</div><p className="audience-role">Professionals</p><p className="audience-desc">Tech & non-tech. Lead AI in your current role.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FCEBEB', color: '#A32D2D' }}>BO</div><p className="audience-role">Business owners</p><p className="audience-desc">Use Claude to run your business smarter.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#E1F5EE', color: '#085041' }}>FO</div><p className="audience-role">Founders</p><p className="audience-desc">Build with Claude without an engineering team.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>CS</div><p className="audience-role">Career switchers</p><p className="audience-desc">Move into AI-adjacent roles with a real credential.</p></div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section className="section" style={{ background: 'white', paddingTop: 40 }}>
        <p className="section-label">12-week curriculum</p>
        <h2 className="section-h2">From curious<br /><em>to Claude Specialist.</em></h2>
        <p className="section-sub">Three phases, no code — just Claude mastery applied to your domain. Pick a phase to open its modules, tools, and projects.</p>
        <div className="curric-acc">
          {CURRICULUM.map((p, i) => {
            const open = activePhase === i;
            return (
              <div className={`curric-acc-item${open ? ' open' : ''}`} key={i}>
                <button className="curric-acc-head" onClick={(e) => {
                  const willOpen = !open;
                  setActivePhase(willOpen ? i : -1);
                  if (willOpen) {
                    const el = e.currentTarget;
                    setTimeout(() => {
                      const y = el.getBoundingClientRect().top + window.scrollY - 90;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }, 70);
                  }
                }} aria-expanded={open}>
                  <span className="curric-acc-no">{p.label} · {p.weeks}</span>
                  <span className="curric-acc-title">{p.title}</span>
                  <span className="curric-acc-caret">{open ? '▾' : '▸'}</span>
                </button>
                {open && (
                  <div className="curric-acc-body">
                    {i < 2 ? (
                      (() => {
                        const selWeek = (openWeek && openWeek.startsWith(`${i}-`)) ? Number(openWeek.split('-')[1]) : 0;
                        const week = p.modules[selWeek];
                        return (
                      <div className="curric-detail--split">
                        <div className="curric-detail-main">
                          <p className="curric-label">Modules · week by week</p>
                          <ul className="curric-weeks">
                            {p.modules.map((m, wi) => (
                              <li key={m.w} className={`curric-week${selWeek === wi ? ' on' : ''}`}>
                                <button className="curric-week-head" onClick={() => setOpenWeek(`${i}-${wi}`)} aria-pressed={selWeek === wi}>
                                  <span className="curric-week-title">{m.w}</span>
                                  <span className="curric-week-caret">›</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="curric-detail-tools">
                          <p className="curric-label">{week.w}</p>
                          <p className="curric-week-desc">{week.d}</p>
                          <p className="curric-label" style={{ marginTop: 26 }}>Projects you'll build</p>
                          <ul className="curric-modules">
                            {p.projects.map(pr => <li key={pr}>{pr}</li>)}
                          </ul>
                          <p className="curric-label" style={{ marginTop: 26 }}>Tools</p>
                          <div className="curric-tools">
                            {p.tools.map(t => <ToolChip key={t} name={t} />)}
                          </div>
                        </div>
                      </div>
                        );
                      })()
                    ) : (
                      <>
                        <p className="curric-label">Choose a domain track</p>
                        <div className="curric-domains">
                          {p.domains.map((d, di) => (
                            <button
                              key={d.name}
                              className={`curric-domain${activeDomain === di ? ' on' : ''}`}
                              onClick={() => setActiveDomain(di)}
                            >
                              {d.name}<span className="curric-domain-caret">{activeDomain === di ? '▾' : '▸'}</span>
                            </button>
                          ))}
                        </div>
                        <div className="curric-detail--split" style={{ marginTop: 22 }}>
                          <div className="curric-detail-main">
                            <p className="curric-label">Modules · {p.domains[activeDomain].name}</p>
                            <ul className="curric-modules">
                              {p.domains[activeDomain].modules.map(m => <li key={m}>{m}</li>)}
                            </ul>
                            <p className="curric-label" style={{ marginTop: 24 }}>Projects you'll build</p>
                            <ul className="curric-modules">
                              {p.domains[activeDomain].projects.map(pr => <li key={pr}>{pr}</li>)}
                            </ul>
                          </div>
                          <div className="curric-detail-tools">
                            <p className="curric-label">Tools</p>
                            <div className="curric-tools">
                              {p.domains[activeDomain].tools.map(t => <ToolChip key={t} name={t} />)}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" onClick={openApply}>Download curriculum</button>
        </div>
      </section>

      {/* ── DOMAIN TRACKS ── */}
      <section className="section tracks-dark" style={{ paddingTop: 40 }}>
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

      {/* ── LEAD FORM (brochure) ── */}
      <section className="mini-lead" style={{ paddingTop: 40 }}>
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>Get the Generalist <em>brochure & syllabus</em>.</h3>
            <p>Full 12-week curriculum, mentor list, fee structure, scholarships, and Cohort 01 timeline — straight to your inbox.</p>
          </div>
          {done ? (
            <div className="mini-lead-success">✓ Brochure on its way.</div>
          ) : (
            <form className="mini-lead-form" onSubmit={handleSubmit}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              <select required aria-label="Track of interest" value={form.track} onChange={e => set('track', e.target.value)}>
                <option value="">Choose a track…</option>
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
              <button type="submit">Send brochure</button>
            </form>
          )}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail style={{ paddingTop: 40 }} />

      {/* ── HIRING PARTNERS ── */}
      <HiringJobs {...GEN_HIRING} />

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center', paddingTop: 40 }}>
        <p className="section-label">FAQ</p>
        <h2 className="section-h2">Your questions answered</h2>
        <FaqList items={GENERALIST_FAQS} />
      </section>

      <CtaBanner
        badge="Applications open · Cohort 01 · 30 seats"
        title="Ready to become a Claude AI Generalist?"
        subtitle="No coding experience. Just 12 weeks and real ambition."
        buttonText="Sign up"
        onButtonClick={openApply}
      />

      <Footer />

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
