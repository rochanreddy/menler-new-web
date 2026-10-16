import { useState } from 'react';
import {
  FDE_ACCOUNTABILITY, FDE_BEFORE_WEEK1, FDE_BLOCK, FDE_CASES, FDE_COMPETENCIES, FDE_EXPECT,
  FDE_GATES, FDE_GLANCE, FDE_GRAD_QUESTIONS, FDE_GROUND_RULES, FDE_OUTCOMES, FDE_RHYTHM,
  FDE_RUBRIC, FDE_SIGNOFF, FDE_TOOLKIT, FDE_TRACKS, FDE_WEIGHTS,
} from '../data/fdeCurriculum';
import { useNavigate } from 'react-router-dom';
import FaqList from '../components/common/FaqList';
import CtaBanner from '../components/common/CtaBanner';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import MentorsRail from '../components/common/MentorsRail';
import { useApply } from '../components/common/ApplyContext';
import HiringJobs from '../components/common/HiringJobs';
import { ENGINEERING_FAQS } from '../data/faqData';
import { verifyAndDownloadBrochure } from '../lib/brochure';
import PhoneField from '../components/forms/PhoneField';
import { isSmsReachable, phoneMinLength } from '../lib/phone';
import BackgroundField from '../components/forms/BackgroundField';

// Hiring section content for the Engineering page only — edit freely, it does
// NOT affect the Generalist / Kickstarter hiring sections.
const ENG_HIRING = {
  label: 'Hiring associations & roles',
  title: 'The jobs',
  titleEm: 'AI FDEs are landing.',
  labelStyle: { color: 'var(--forest)' },
  titleStyle: { color: 'var(--forest)' },
  titleEmStyle: { color: 'var(--placed)' },
  sub: 'Companies are hiring engineers who can sit with a client, own an AI system end to end and defend it in production.',
  genLabel: 'AI Engineering',
  engLabel: 'Advanced AI Systems',
  genRoles: [
    { name: 'AI Engineer', band: '₹20–40L · Product & AI teams' },
    { name: 'Solutions Engineer', band: '₹22–45L · AI Native startups' },
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

const pad = (n) => String(n).padStart(2, '0');

/* A label / value list, the shape most of the curriculum PDF is written in. */
function KvList({ rows, className = '' }) {
  return (
    <dl className={`fde-kv ${className}`}>
      {rows.map((r) => (
        <div className={`fde-kv-row${r.hot ? ' hot' : ''}`} key={r.k}>
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* One live session: Saturday (S1) or Sunday (S2). */
function Session({ s, i }) {
  return (
    <div className="fde-session">
      <div className="fde-session-head">
        <span className="fde-session-tag">S{i + 1}</span>
        <span className="fde-session-when">{i === 0 ? 'Saturday' : 'Sunday'} · 2 hrs</span>
      </div>
      <h4 className="fde-session-title">{s.title}</h4>
      <p className="fde-session-builds"><b>Builds on</b>{s.buildsOn}</p>
      <p className="fde-mini-label">Topics</p>
      <ul className="fde-dots">{s.topics.map((t) => <li key={t}>{t}</li>)}</ul>
      <p className="fde-mini-label">Claude in use</p>
      <p className="fde-session-p">{s.claude}</p>
      <div className="fde-session-build">
        <p className="fde-mini-label">Build</p>
        <p className="fde-session-p">{s.build}</p>
      </div>
      <div className="fde-chips">{s.stack.map((t) => <span className="fde-chip" key={t}>{t}</span>)}</div>
    </div>
  );
}

/* One week of a case: objective, both sessions, assignment and milestone. */
function WeekPanel({ c, w }) {
  const finished = Boolean(w.milestone.gate);
  return (
    <div className="fde-week">
      <div className="fde-week-objective">
        <div>
          <p className="fde-mini-label">Week {w.n} objective</p>
          <p className="fde-week-obj-text">{w.objective}</p>
        </div>
        <div className="fde-shift">
          <p className="fde-mini-label">Identity shift</p>
          <p className="fde-shift-text">{w.shift[0]} <span>→</span> {w.shift[1]}</p>
        </div>
      </div>

      <div className="fde-sessions">
        {w.sessions.map((s, i) => <Session s={s} i={i} key={s.title} />)}
      </div>

      <div className="fde-work">
        <div className="fde-work-card fde-work-card--assign">
          <p className="fde-work-kicker">Weekly assignment · {w.assignment.time}</p>
          <h4>{w.assignment.title}</h4>
          <p className="fde-session-p">{w.assignment.brief}</p>
          <p className="fde-mini-label">Deliverables</p>
          <ul className="fde-dots">{w.assignment.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
          <p className="fde-work-foot"><b>Assessed by</b> Mentor review in your 15-minute 1:1, checked against the week&rsquo;s ten competencies.</p>
          <p className="fde-work-foot"><b>Feeds into</b> {w.assignment.feeds}</p>
        </div>
        <div className="fde-work-card fde-work-card--milestone">
          <p className="fde-work-kicker">Project {c.no} milestone · {w.milestone.stage}</p>
          <h4>{c.project}</h4>
          <p className="fde-mini-label">Due this week</p>
          <ul className="fde-dots">{w.milestone.due.map((d) => <li key={d}>{d}</li>)}</ul>
          {finished && (
            <>
              <p className="fde-gate">Gate: {w.milestone.gate}</p>
              <KvList rows={FDE_SIGNOFF} className="fde-kv--tight" />
            </>
          )}
        </div>
      </div>

      <p className="fde-outcome"><b>Week outcome</b>{w.outcome}</p>
    </div>
  );
}

/* The case itself: why it matters, what the client wants, the brief and the defence. */
function CaseBrief({ c }) {
  return (
    <div className="fde-brief">
      <div className="fde-brief-top">
        <div>
          <p className="fde-mini-label">{c.no === 6 ? 'How the capstone works' : 'The real-world context'}</p>
          <p className="fde-context">{c.context}</p>
        </div>
        {c.ask && (
          <div className="fde-ask">
            <p className="fde-mini-label">The client ask</p>
            <p>{c.ask}</p>
          </div>
        )}
      </div>

      {c.briefs && (
        <div className="fde-capstone-briefs">
          {c.briefs.map((b) => (
            <div className="fde-capstone-brief" key={b.k}>
              <p className="fde-work-kicker">{b.k}</p>
              <h4>{b.t}</h4>
              <p>{b.d}</p>
            </div>
          ))}
        </div>
      )}

      <p className="fde-mini-label" style={{ marginTop: 26 }}>{c.no === 6 ? 'Acceptance' : 'Engagement brief'}</p>
      <KvList rows={c.brief} className="fde-kv--dark" />

      <div className="fde-defence">
        <p className="fde-mini-label">{c.no === 6 ? 'Demo Day · Week 12 Sunday' : 'Case Defence · second Sunday'}</p>
        <p className="fde-defence-q">Why did you build it this way, and what happens when it breaks?</p>
        {c.no === 6 ? (
          <div className="fde-defence-bar" aria-label="Demo Day">
            <span>15 min · demo</span>
            <span>15 min · live defence with a change request</span>
            <span>Executive readout · industry panel</span>
          </div>
        ) : (
          <div className="fde-defence-bar" aria-label="Thirty-minute defence">
            <span>10 min · solution walk-through</span>
            <span>10 min · hidden-scenario results</span>
            <span>10 min · live change request &amp; panel Q&amp;A</span>
          </div>
        )}
        <p className="fde-defence-focus"><b>Focus:</b> {c.defence}</p>
      </div>

      <div className="fde-chips fde-chips--case">
        {c.tools.map((t) => <span className="fde-chip" key={t}>{t}</span>)}
      </div>
    </div>
  );
}

export default function Engineering() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  const [form, setForm] = useState({ name: '', email: '', countryCode: '+91', phone: '', background: '', college: '', graduation_year: '' });
  const [done, setDone] = useState(false);
  // Curriculum: which case is open (-1 = none) and which tab of it is shown —
  // 'brief' for the case, or 0 / 1 for its two weeks.
  const [openCase, setOpenCase] = useState(0);
  const [tab, setTab] = useState('brief');
  const scrollTo = (el, offset = -90) => {
    if (!el) return;
    if (window.__lenis) { window.__lenis.scrollTo(el, { offset }); return; }
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
  };
  const toggleCase = (i, el) => {
    const willOpen = openCase !== i;
    setOpenCase(willOpen ? i : -1);
    setTab('brief');
    if (willOpen) setTimeout(() => scrollTo(el), 70);
  };
  // From the 12-week map: open that week's case on that week.
  const jumpToWeek = (n) => {
    const ci = Math.ceil(n / 2) - 1;
    setOpenCase(ci);
    setTab((n - 1) % 2);
    setTimeout(() => scrollTo(document.getElementById(`fde-case-${ci + 1}`)), 70);
  };
  const [openComp, setOpenComp] = useState(-1);

  const openApply = useApply();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  // BackgroundField asks a student their college and a graduate their year.
  // Those ride in their own fields, not in the background string, so spread
  // the reported object — it always carries both keys, which is what clears
  // the stale one when someone switches group.
  const setDetail = (d) => setForm((f) => ({ ...f, ...d }));
  const handleBrochure = async (e) => {
    e.preventDefault();
    try {
      await verifyAndDownloadBrochure({
        name: form.name,
        email: form.email,
        countryCode: form.countryCode,
        phone: form.phone,
        program: 'engineering',
        background: form.background,
        college: form.college, graduation_year: form.graduation_year,
        resource: 'Menler AI FDE Fellowship Curriculum',
        source: 'engineering-page',
        cta_label: 'Brochure: AI FDE',
        section: 'AI FDE Fellowship',
      });
      setDone(true);
    } catch { /* keep form open for retry */ }
  };

  const weeks = FDE_CASES.flatMap((c) => c.weekList.map((w) => ({ ...w, caseNo: c.no })));

  return (
    <>
      {/* The Course, FAQ and breadcrumb structured data is baked into the HTML by
          scripts/prerender.mjs — a second Course added here would be a thinner
          duplicate, with no price or schedule. */}
      <Seo
        title="AI FDE Fellowship — Forward Deployed AI Engineer Program India | Menler"
        description="A 12-week AI Forward Deployed Engineer fellowship. Six real-world cases, built with Claude and defended to a client panel — from first interview to handover."
        keywords="AI FDE fellowship, forward deployed engineer, forward deployed AI engineer course India, AI engineering fellowship, Claude AI engineering, Claude Agent SDK, MCP, RAG, AI evaluation, AI deployment, AI specialist program India"
        path="/engineering"
      />
      {/* ── HERO + WHO THIS IS FOR (one screen together) ── */}
      <div className="hero-screen">
      {/* ── HERO ── */}
      <section className="hero hero-big" style={{ background: '#085041', padding: '66px clamp(20px, 6vw, 40px) 54px' }}>
        <div className="hero-ring r1" style={{ borderColor: 'rgba(93,202,165,0.1)' }} />
        <div className="hero-ring r2" style={{ borderColor: 'rgba(93,202,165,0.08)' }} />
        <div className="hero-inner">
          <p className="hero-eyebrow" style={{ color: '#5DCAA5' }}>AI FDE Fellowship · Next cohort · Bengaluru, India</p>
          <h1 className="hero-h1" style={{ color: '#E1F5EE' }}>Twelve weeks. Six real-world cases.<br /><em style={{ color: '#9FE1CB' }}>Defended, not just delivered.</em></h1>
          <p className="hero-sub" style={{ color: 'rgba(225,245,238,0.55)' }}>Train as a Forward Deployed AI Engineer: sit with a client, understand a messy operational problem and own the solution from first interview to handover.<strong className="hero-tagline" style={{ color: '#E1F5EE', fontWeight: 500 }}>Graded on whether you can defend what you built to a panel that plays the client.</strong></p>
          <div className="hero-actions">
            <button className="btn-primary" style={{ background: '#1D9E75', minWidth: 220, textAlign: 'center' }} onClick={openApply}>Apply Now</button>
            <button className="btn-outline" style={{ color: '#9FE1CB', borderColor: 'rgba(93,202,165,0.5)', minWidth: 220, textAlign: 'center' }} onClick={() => scrollTo(document.getElementById('fde-brochure'))}>Download the Curriculum</button>
          </div>
          <button className="btn-ghost fde-hero-link" onClick={() => go('/aptitude')}>Not sure you&rsquo;re ready? Take the AI Aptitude Test →</button>
          <div className="hero-stats" style={{ borderColor: 'rgba(93,202,165,0.2)' }}>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>12</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Weeks<br />Sat + Sun</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>6</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Real-world<br />cases</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>12</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Weekly<br />assignments</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>6</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Milestone<br />projects</span></div>
            <div><span className="hero-stat-num" style={{ color: '#E1F5EE' }}>100</span><span className="hero-stat-lbl" style={{ color: '#5DCAA5' }}>Competencies<br />cleared</span></div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="section" style={{ background: '#E1F5EE', paddingTop: 24, paddingBottom: 20 }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>Who this is for</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Built for people who will be<br /><em style={{ color: 'var(--placed)' }}>questioned on their decisions, and want to be.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>Engineers, analysts, consultants and technical product people who want to deliver AI systems to real clients, and early-career graduates ready to work at that standard. You should be comfortable reading code and working in a terminal, and willing to defend your decisions in front of a panel.</p>
        <div className="audience-grid">
          <div className="audience-card"><div className="ava" style={{ background: '#E1F5EE', color: '#085041' }}>1</div><p className="audience-role">Engineers</p><p className="audience-desc">Write the core components and take on the stretch builds.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: 'var(--cloud)', color: 'var(--specialist)' }}>2</div><p className="audience-role">Analysts</p><p className="audience-desc">Direct Claude Code, own the tests and defend the numbers.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FAEEDA', color: '#854F0B' }}>3</div><p className="audience-role">Consultants</p><p className="audience-desc">Run discovery, frame the problem and own the client.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#FCEBEB', color: '#A32D2D' }}>4</div><p className="audience-role">Technical product people</p><p className="audience-desc">Turn a messy operational problem into a shipped system.</p></div>
          <div className="audience-card"><div className="ava" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>5</div><p className="audience-role">Early-career graduates</p><p className="audience-desc">Ready to work at a client-facing standard from week one.</p></div>
        </div>
      </section>
      </div>

      {/* ── AT A GLANCE ── */}
      <section className="section fde-sec">
        <p className="section-label" style={{ color: 'var(--forest)' }}>The programme</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>A fellowship for people who deliver AI<br /><em style={{ color: 'var(--placed)' }}>to real clients, and are graded on defending it.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>You do not learn tools in isolation. You work through six real-world engagements, each built from a public problem in an Indian industry, and you are graded on whether you can defend what you built to a panel that plays the client.</p>
        <div className="fde-glance">
          {FDE_GLANCE.map((g) => (
            <div className="fde-glance-card" key={g.k}>
              <p className="fde-glance-k">{g.k}</p>
              <p className="fde-glance-v">{g.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TWO TRACKS + BEFORE WEEK 1 + ACCOUNTABILITY ── */}
      <section className="section fde-sec fde-sec--mint">
        <p className="section-label" style={{ color: 'var(--forest)' }}>Two tracks, one standard</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Builder or Engineer.<br /><em style={{ color: 'var(--placed)' }}>Same bar, same defence.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>Both tracks meet the same acceptance criteria and face the same Case Defence.</p>
        <div className="fde-tracks">
          {FDE_TRACKS.map((t, i) => (
            <div className="fde-track" key={t.name}>
              <span className="fde-track-no">{pad(i + 1)}</span>
              <h3>{t.name}</h3>
              <p className="fde-track-for">{t.for}</p>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="fde-two-col">
          <div className="fde-panel">
            <h3 className="fde-panel-title">Before Week 1</h3>
            <KvList rows={FDE_BEFORE_WEEK1} />
          </div>
          <div className="fde-panel">
            <h3 className="fde-panel-title">Accountability: nobody hides in the pod</h3>
            <KvList rows={FDE_ACCOUNTABILITY} />
          </div>
        </div>
      </section>

      {/* ── HOW A CASE BLOCK WORKS ── */}
      <section className="section fde-sec">
        <p className="section-label" style={{ color: 'var(--forest)' }}>The method</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>How a case block works.<br /><em style={{ color: 'var(--placed)' }}>Two weeks, one project, one defence.</em></h2>
        <div className="fde-flow">
          {FDE_BLOCK.slice(0, 3).map((b, i) => (
            <div className={`fde-flow-step${i === 2 ? ' fde-flow-step--defence' : ''}`} key={b.k}>
              <p className="fde-flow-k">{b.k}</p>
              <p className="fde-flow-v">{b.v}</p>
            </div>
          ))}
        </div>
        <div className="fde-two-col">
          <div className="fde-panel">
            <h3 className="fde-panel-title">Hidden scenarios &amp; progression</h3>
            <KvList rows={FDE_BLOCK.slice(3)} />
          </div>
          <div className="fde-panel">
            <h3 className="fde-panel-title">The weekly rhythm</h3>
            <KvList rows={FDE_RHYTHM} />
          </div>
        </div>
      </section>

      {/* ── 12-WEEK TRANSFORMATION MAP ── */}
      <section className="section fde-sec fde-sec--mint">
        <p className="section-label" style={{ color: 'var(--forest)' }}>The journey</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>12-week transformation map.<br /><em style={{ color: 'var(--placed)' }}>One theme and one identity shift a week.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>Every week ends with an assignment and a project milestone. Tap a week to open it in the curriculum.</p>
        <div className="fde-map">
          {weeks.map((w) => (
            <button className="fde-map-card" key={w.n} onClick={() => jumpToWeek(w.n)}>
              <span className="fde-map-no">{pad(w.n)}</span>
              <span className="fde-map-body">
                <span className="fde-map-title">{w.title}</span>
                <span className="fde-map-shift">{w.shift[0]} → {w.shift[1]}</span>
              </span>
              <span className="fde-map-case">Case {w.caseNo}</span>
            </button>
          ))}
        </div>
        <p className="fde-arc">Frame the problem. Build the system. Prove it works. Defend it to the client.</p>
      </section>

      {/* ── CURRICULUM ── one row per two-week case; open it for the brief and
          each week's sessions, assignment and milestone (src/data/fdeCurriculum.js). */}
      <section className="section curric-section--fde fde-curric" style={{ background: 'white' }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>Full curriculum</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Six cases. Twelve weeks.<br /><em style={{ color: 'var(--placed)' }}>Every session, assignment and defence.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>Cases 1–3 are built from scratch. Cases 4–5 hand you a working prototype to make trustworthy and then deployable. Case 6 uses everything on a fresh brief.</p>
        <div className="curric-acc">
          {FDE_CASES.map((c, i) => {
            const open = openCase === i;
            return (
              <div className={`curric-acc-item${open ? ' open' : ''}`} key={c.no} id={`fde-case-${c.no}`}>
                <button className="curric-acc-head" onClick={(e) => toggleCase(i, e.currentTarget)} aria-expanded={open}>
                  <span className="curric-acc-no">Case {c.no} · {c.weeks} · {c.sector}</span>
                  <span className="curric-acc-title">{c.title}</span>
                  <span className="curric-acc-caret">{open ? '▾' : '▸'}</span>
                </button>
                {open && (
                  <div className="curric-acc-body">
                    <p className="fde-case-project">Project {c.no}: <b>{c.project}</b> · {c.mode}</p>
                    <div className="fde-tabs" role="tablist">
                      <button role="tab" aria-selected={tab === 'brief'} className={tab === 'brief' ? 'on' : ''} onClick={() => setTab('brief')}>{c.no === 6 ? 'The briefs' : 'The case'}</button>
                      {c.weekList.map((w, wi) => (
                        <button role="tab" key={w.n} aria-selected={tab === wi} className={tab === wi ? 'on' : ''} onClick={() => setTab(wi)}>
                          Week {w.n}<span> · {wi === 0 ? 'A' : 'B'}</span>
                        </button>
                      ))}
                    </div>
                    {tab === 'brief' ? <CaseBrief c={c} /> : <WeekPanel c={c} w={c.weekList[tab]} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── ASSESSMENT & GRADING ── */}
      <section className="section fde-sec fde-sec--mint">
        <p className="section-label" style={{ color: 'var(--forest)' }}>The standard</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Graded by defence.<br /><em style={{ color: 'var(--placed)' }}>Show it, explain it, extend it live.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>You clear a competency by showing an artefact you built or by explaining and extending it live. You need 80 of 100 competencies and a capstone pass to graduate.</p>
        <div className="fde-two-col">
          <div className="fde-panel">
            <h3 className="fde-panel-title">Score weights</h3>
            <div className="fde-weights">
              {FDE_WEIGHTS.map((w) => (
                <div className="fde-weight" key={w.k}>
                  <span className="fde-weight-k">{w.k}</span>
                  <span className="fde-weight-bar"><span style={{ width: `${(w.v / 30) * 100}%` }} /></span>
                  <span className="fde-weight-v">{w.v}%</span>
                </div>
              ))}
            </div>
            <h3 className="fde-panel-title" style={{ marginTop: 28 }}>The gates</h3>
            <KvList rows={FDE_GATES} />
          </div>
          <div className="fde-panel">
            <h3 className="fde-panel-title">Four-level rubric</h3>
            <div className="fde-rubric">
              {FDE_RUBRIC.map((r, i) => (
                <div className={`fde-rubric-row lvl${i}`} key={r.k}>
                  <span className="fde-rubric-k">{r.k}</span>
                  <p>{r.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <h3 className="fde-sub-h">The 12 graduation questions, answered live</h3>
        <ol className="fde-questions">
          {FDE_GRAD_QUESTIONS.map((q, i) => (
            <li key={q}><span>{pad(i + 1)}</span>{q}</li>
          ))}
        </ol>
      </section>

      {/* ── THE 100 COMPETENCIES ── */}
      <section className="section fde-sec">
        <p className="section-label" style={{ color: 'var(--forest)' }}>The register</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>The 100 competencies.<br /><em style={{ color: 'var(--placed)' }}>Ten a week, five per session.</em></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>Each one is cleared by an artefact or an oral defence. Weeks 11 and 12 are the capstone, cleared at Demo Day.</p>
        <div className="fde-comp">
          {FDE_COMPETENCIES.map((w, i) => {
            const open = openComp === i;
            return (
              <div className={`fde-comp-item${open ? ' open' : ''}`} key={w.n}>
                <button className="fde-comp-head" onClick={() => setOpenComp(open ? -1 : i)} aria-expanded={open}>
                  <span className="fde-comp-wk">Week {pad(w.n)}</span>
                  <span className="fde-comp-title">{w.title}</span>
                  <span className="fde-comp-range">C{pad(i * 10 + 1)}–C{pad(i * 10 + 10)}</span>
                  <span className="fde-comp-caret">{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div className="fde-comp-body">
                    {[0, 1].map((s) => (
                      <div key={s}>
                        <p className="fde-mini-label">{s === 0 ? 'S1 · Saturday' : 'S2 · Sunday'}</p>
                        <ol className="fde-comp-list">
                          {w.items.slice(s * 5, s * 5 + 5).map((t, j) => (
                            <li key={t}><span>C{pad(i * 10 + s * 5 + j + 1)}</span>{t}</li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TOOLKIT ── */}
      <section className="section fde-sec fde-sec--mint">
        <p className="section-label" style={{ color: 'var(--forest)' }}>The toolkit</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Every tool across the twelve weeks,<br /><em style={{ color: 'var(--placed)' }}>grouped by the job it does.</em></h2>
        <div className="fde-toolkit">
          {FDE_TOOLKIT.map((g) => (
            <div className="fde-panel" key={g.group}>
              <h3 className="fde-panel-title">{g.group}</h3>
              <ul className="fde-tool-list">
                {g.items.map((t) => (
                  <li key={t.t}>
                    <div className="fde-tool-top"><b>{t.t}</b><span>{t.wk}</span></div>
                    <p>{t.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── GROUND RULES ── */}
      <section className="section fde-sec">
        <p className="section-label" style={{ color: 'var(--forest)' }}>The guardrails</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>Data, ethics &amp; ground rules.<br /><em style={{ color: 'var(--placed)' }}>Safe, honest and independent.</em></h2>
        <div className="fde-two-col fde-two-col--wide">
          <div className="fde-panel">
            <h3 className="fde-panel-title">How we keep every case safe</h3>
            <KvList rows={FDE_GROUND_RULES} />
          </div>
          <div className="fde-panel">
            <h3 className="fde-panel-title">What we expect from you</h3>
            <KvList rows={FDE_EXPECT} />
          </div>
        </div>
      </section>

      {/* ── WHAT YOU LEAVE WITH ── */}
      <section className="section" style={{ background: '#E1F5EE' }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>The outcome</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>What you leave with.<br /><em style={{ color: 'var(--placed)' }}>Evidence, judgment and a cohort.</em></h2>
        <div className="audience-grid fde-outcomes">
          {FDE_OUTCOMES.map((o, i) => (
            <div className="audience-card" key={o.t}>
              <div className="ava" style={{ background: 'white', color: '#085041' }}>{i + 1}</div>
              <p className="audience-role">{o.t}</p>
              <p className="audience-desc">{o.d}</p>
            </div>
          ))}
        </div>
        <blockquote className="fde-promise">
          <p className="fde-mini-label">The promise</p>
          You will leave not just knowing how AI systems work, but having been held accountable for one, from the first client interview to the last defence.
        </blockquote>
      </section>

      {/* ── MENTORS ── */}
      <MentorsRail labelStyle={{ color: 'var(--forest)' }} titleStyle={{ color: 'var(--forest)' }} />

      {/* ── HIRING PARTNERS & ROLES ── */}
      <HiringJobs {...ENG_HIRING} subStyle={{ maxWidth: 'none' }} />

      {/* ── LEAD FORM ── */}
      <section className="mini-lead" id="fde-brochure">
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3 style={{ color: 'var(--forest)' }}>Get the full AI FDE <em style={{ color: 'var(--placed)' }}>curriculum PDF</em>.</h3>
            <p>All 47 pages: every case, session, assignment and the grading rubric. Verify your number and download it instantly.</p>
          </div>
          {done ? (
            <div className="mini-lead-success">✓ Curriculum downloading.</div>
          ) : (
            <form className="mini-lead-form" onSubmit={handleBrochure}>
              <input type="email" required aria-label="Email address" placeholder="you@domain.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
              <PhoneField countryCode={form.countryCode} phone={form.phone} onCountryCode={(v) => set('countryCode', v)} onPhone={(v) => set('phone', v)} />
              <BackgroundField label="You are…" onChange={(v) => set('background', v)} onDetail={setDetail} />
              <button type="submit">Verify &amp; Download</button>
              {!isSmsReachable(form.countryCode) && form.phone.length >= phoneMinLength(form.countryCode) && (
                <p className="mini-lead-hint">We can only text Indian numbers — your code will arrive by email.</p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center' }}>
        <p className="section-label" style={{ color: 'var(--forest)' }}>FAQ</p>
        <h2 className="section-h2" style={{ color: 'var(--forest)' }}>AI FDE Fellowship FAQ</h2>
        <FaqList items={ENGINEERING_FAQS} />
      </section>

      <CtaBanner
        badge="Applications open · 30 seats"
        title="Ready to deliver AI to real clients?"
        subtitle="Twelve weeks. Six cases. Every one defended."
        buttonText="Apply Now"
        buttonStyle={{ color: 'var(--forest)' }}
        sectionStyle={{ background: 'var(--forest)' }}
        onButtonClick={openApply}
      />

      <Footer />
    </>
  );
}
