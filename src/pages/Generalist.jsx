import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import { GENERALIST_FAQS } from '../data/faqData';
import { submitLead } from '../services/leadService';

const PHASES = [
  { cls: 'p1', tag: 'Phase 1 · Weeks 1–4', title: 'AI fluency & Claude foundations', items: ['How AI & LLMs work (no code)', 'Claude.ai — features & workflows', 'Prompt engineering — all patterns', 'Multimodal prompting', 'AI safety & responsible use', 'AI aptitude assessment #1'] },
  { cls: 'p2', tag: 'Phase 2 · Weeks 5–9', title: 'Agentic workflows & real builds', items: ['Agentic thinking & workflow design', 'Claude Cowork & Projects', 'MCP — connecting Claude to tools', 'Claude in Excel, PPT, Docs', 'Domain automation sprint', 'Live project build with cohort'] },
  { cls: 'p3', tag: 'Phase 3 · Weeks 10–12', title: 'Strategy, portfolio & placement', items: ['AI business strategy & ROI', 'Domain capstone project', 'Portfolio & personal brand', 'Claude Specialist exam', 'Demo Day — live audience', 'Job matching & placement'] },
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

const MENTORS = [
  { initials: 'PR', style: { background: 'var(--cloud)', color: 'var(--specialist)' }, name: 'Priya Raman', role: 'VP Strategy · Series-C SaaS', bio: 'Runs Claude-powered ops at a 400-person company. Mentors the Founder\'s Office and Operations tracks.', tags: "Founder's Office · Operations" },
  { initials: 'AK', style: { background: '#FAEEDA', color: '#854F0B' }, name: 'Aman Kapoor', role: 'Principal · Mid-market VC fund', bio: "Built one of India's first Claude-driven deal-sourcing workflows. Leads the Venture Capital track.", tags: 'Venture Capital · Analyst' },
  { initials: 'SM', style: { background: '#FCEBEB', color: '#A32D2D' }, name: 'Sneha Menon', role: 'Marketing Director · D2C unicorn', bio: 'Cut content production cost 70% with Claude. Mentors brand voice, content engines, and campaign workflows.', tags: 'Marketing' },
  { initials: 'RT', style: { background: '#E1F5EE', color: '#085041' }, name: 'Rohit Tandon', role: 'FP&A Lead · Listed Indian co.', bio: '"Claude in Excel for Finance" author. Mentors finance, audit, and reporting tracks with hands-on workflows.', tags: 'Finance · Analyst' },
];

const PARTNERS = ['Razorpay', 'Zerodha', 'Cred', 'PhonePe', 'Meesho', 'Swiggy', 'Lightspeed', 'Sequoia', 'Accel', 'Nykaa', 'boAt', 'Lenskart', '+ 13 more'];

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
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...form, program: 'generalist', source: 'generalist-page' }); } catch {}
    setDone(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero hero-centered">
        <div className="hero-ring r1" /><div className="hero-ring r2" />
        <div className="hero-inner">
          <p className="hero-eyebrow">Claude AI Generalist Fellowship · India · No coding required</p>
          <h1 className="hero-h1">Master Claude AI.<br /><em>Transform your domain.</em></h1>
          <p className="hero-sub">India's first <strong style={{ color: '#EEEDFE', fontWeight: 500 }}>no-code Claude AI specialist program</strong>. A 12-week fellowship for students, working professionals, founders, business owners, and career switchers — across seven domain tracks: Founder's Office, Venture Capital, Marketing, Analyst, Finance, Operations, and Technology. Graduate as a certified Claude Specialist with a domain portfolio and a placed role.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => go('/scholarship')}>Sign up</button>
            <button className="btn-ghost">Download brochure →</button>
          </div>
          <div className="hero-stats">
            <div><span className="hero-stat-num">12</span><span className="hero-stat-lbl">Weeks</span></div>
            <div><span className="hero-stat-num">0</span><span className="hero-stat-lbl">Coding needed</span></div>
            <div><span className="hero-stat-num">7</span><span className="hero-stat-lbl">Domain tracks</span></div>
            <div><span className="hero-stat-num">1</span><span className="hero-stat-lbl">Specialist cert</span></div>
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
        <p className="section-sub">Three phases, no code — just Claude mastery applied to your domain.</p>
        <div className="phases">
          {PHASES.map((p, i) => (
            <div key={i} className={`phase ${p.cls}`}>
              <p className="phase-tag">{p.tag}</p>
              <p className="phase-title">{p.title}</p>
              <ul className="phase-items">{p.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
            </div>
          ))}
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
            <div key={i} className="proj-card" style={p.isCap ? { background: 'var(--cloud)', borderColor: 'rgba(83,74,183,0.25)' } : {}}>
              <span className="proj-track" style={p.isCap ? { background: 'var(--specialist)', color: 'white' } : {}}>{p.track}</span>
              <p className="proj-name">{p.title}</p>
              <p className="proj-meta">{p.meta}</p>
              <p className="proj-desc">{p.desc}</p>
              <p className="proj-stack">{p.stack}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MENTORS ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">Generalist mentors</p>
        <h2 className="section-h2">Domain leaders.<br /><em>Not lecturers.</em></h2>
        <p className="section-sub">Operators and founders who use Claude in their day job — guiding you through your domain track, capstone, and placement.</p>
        <div className="mentors-grid">
          {MENTORS.map((m, i) => (
            <article key={i} className="mentor-card">
              <div className="mentor-portrait" style={m.style}>{m.initials}</div>
              <p className="mentor-name">{m.name}</p>
              <p className="mentor-role">{m.role}</p>
              <p className="mentor-bio">{m.bio}</p>
              <p className="mentor-tags">{m.tags}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── HIRING PARTNERS ── */}
      <section className="hiring-section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Hiring partners</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>Where Claude AI Generalists<br /><em>get hired.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center' }}>25+ partner companies hiring across our 7 domain tracks. Direct pipeline from Demo Day → interview → offer.</p>
        <div className="partners-strip">
          {PARTNERS.map(p => <span key={p} className="partner-chip">{p}</span>)}
        </div>
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

      <CtaBanner
        badge="Applications open · Cohort 01 · 30 seats"
        title="Ready to become a Claude AI Generalist?"
        subtitle="No coding experience. Just 12 weeks and real ambition."
        buttonText="Sign up"
        onButtonClick={() => go('/scholarship')}
      />

      <Footer />
    </>
  );
}
