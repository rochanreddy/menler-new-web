import { useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import FaqList from '../components/common/FaqList';
import { submitLead } from '../services/leadService';
import { APTITUDE_QUESTIONS, MAX_SCORE, getRecommendation } from '../data/aptitudeQuestions';
import { CLUSTERS, buildRoadmap } from '../data/aptitudeClusters';
import { APTITUDE_FAQS } from '../data/faqData';

const TRUST_CARDS = [
  { title: 'What it tests', desc: 'AI readiness across three core dimensions: problem-solving, execution ability, and role alignment.' },
  { title: 'How it\'s scored', desc: '0–15 readiness score, broken into sub-scores and benchmarked against real-world performance indicators.' },
  { title: 'What you\'ll receive', desc: 'A personalised readiness report, learning roadmap, and placement-readiness insights.' },
  { title: 'Why it matters', desc: 'Most people don\'t know where they stand with AI. This assessment gives you a clear baseline before you invest time, effort, or money.' },
];

const QB_FILTERS = ['All', 'RAG', 'MCP', 'Agents', 'Evals', 'Tool use', 'Prompts', 'Foundations', 'Senior'];

const QB_QUESTIONS = [
  { company: 'Razorpay', level: 'Senior', topic: 'RAG', q: 'You are building a RAG system for Razorpay\'s internal policy docs. The system gives confident wrong answers. What is the most likely root cause and how do you fix it?', a: 'Likely cause: chunk size too large or lack of re-ranking, causing irrelevant passages to dominate context. Fix: smaller, overlapping chunks + cross-encoder re-ranking + source-grounding evaluation (RAGAS).' },
  { company: 'Sarvam AI', level: 'Foundations', topic: 'Evals', q: 'You have a Claude pipeline that translates English to Hindi. You want to know if it\'s getting better or worse between deployments. How do you set up a basic eval?', a: 'Build a fixed eval set of 50–100 English → gold Hindi pairs. For each deployment, run Claude on all pairs, score with BLEU or LLM-as-judge, track the mean. Regression if score drops >2%.' },
  { company: 'Cred', level: 'Senior', topic: 'Tool use', q: 'You\'re building a Claude agent for CRED\'s member services. The agent needs to look up account balances (read-only) and also flag disputes (write). How do you design the tool schema and what safety guardrails do you implement?', a: 'Separate tools by risk: `get_account_balance` (no confirm) vs `flag_dispute` (confirm step + audit log). Implement tool-use prompts with explicit permission scopes. Never allow irreversible actions without human-in-the-loop.' },
  { company: 'Anthropic', level: 'Senior', topic: 'MCP', q: 'Explain Model Context Protocol. In what situation would you choose to build an MCP server rather than use tool use in the API directly?', a: 'MCP is an open protocol for exposing resources, tools, and prompts to Claude clients (Desktop, Cowork). Use MCP when you need persistent, reusable tools across sessions/users — e.g. an internal Slack MCP that all employees connect. Use API tool use for session-specific, single-app tool calls.' },
  { company: 'Postman', level: 'Foundations', topic: 'Prompts', q: 'Postman wants Claude to generate API documentation from a JSON schema. Write a system prompt for this use case that consistently produces clean, developer-friendly output.', a: 'System: "You are an API documentation writer. Given a JSON schema, produce Markdown docs with: (1) endpoint summary, (2) parameter table, (3) example request, (4) example response, (5) common error codes. Be concise."' },
  { company: 'Browserbase', level: 'Senior', topic: 'Agents', q: 'You\'re building a multi-step web agent using Claude + Browserbase. The agent must log in, navigate a dashboard, and extract structured data. How do you handle state management and what failure modes do you architect for?', a: 'Use a session context object persisted across turns. Plan for: login CAPTCHA (human handoff), navigation state loss (resumable checkpoints), extraction failure (regex + LLM fallback), rate limiting (exponential backoff).' },
];

// Three readiness dimensions, mapped to question ranges.
const DIMENSIONS = [
  { label: 'Problem-solving', from: 0, to: 4 },
  { label: 'Execution ability', from: 4, to: 8 },
  { label: 'Role alignment', from: 8, to: 10 },
];

const blankAnswers = () => Array(APTITUDE_QUESTIONS.length).fill(null);
const INIT = { view: 'landing', cluster: null, setIdx: 0, idx: 0, answers: blankAnswers() };

function reducer(state, action) {
  switch (action.type) {
    case 'PICK_CLUSTER': return { ...state, view: 'sets', cluster: action.cluster };
    case 'PICK_SET': return { ...state, view: 'runner', setIdx: action.setIdx, idx: 0, answers: blankAnswers() };
    case 'SELECT': {
      const answers = [...state.answers];
      answers[state.idx] = action.optIdx;
      return { ...state, answers };
    }
    case 'NEXT':
      return state.idx < APTITUDE_QUESTIONS.length - 1 ? { ...state, idx: state.idx + 1 } : { ...state, view: 'report' };
    case 'BACK':
      return state.idx > 0 ? { ...state, idx: state.idx - 1 } : { ...state, view: 'sets' };
    case 'RETAKE': return { ...state, view: 'runner', idx: 0, answers: blankAnswers() };
    case 'TO_SETS': return { ...state, view: 'sets' };
    case 'TO_CLUSTERS': return { ...INIT };
    default: return state;
  }
}

function calcScore(answers) {
  return answers.reduce((acc, a, i) => (a === null ? acc : acc + APTITUDE_QUESTIONS[i].options[a].s), 0);
}

export default function Aptitude() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const [state, dispatch] = useReducer(reducer, INIT);

  // Keyboard support while taking the test.
  useEffect(() => {
    if (state.view !== 'runner') return;
    const onKey = (e) => {
      const n = APTITUDE_QUESTIONS[state.idx].options.length;
      const sel = state.answers[state.idx];
      if (e.key >= '1' && e.key <= String(n)) { dispatch({ type: 'SELECT', optIdx: Number(e.key) - 1 }); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { dispatch({ type: 'SELECT', optIdx: sel === null ? 0 : Math.min(sel + 1, n - 1) }); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { dispatch({ type: 'SELECT', optIdx: sel === null ? n - 1 : Math.max(sel - 1, 0) }); e.preventDefault(); }
      else if (e.key === 'Enter' && sel !== null) { dispatch({ type: 'NEXT' }); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.view, state.idx, state.answers]);

  const [leadForm, setLeadForm] = useState({ name: '', email: '' });
  const [leadDone, setLeadDone] = useState(false);
  const setL = (k, v) => setLeadForm(f => ({ ...f, [k]: v }));

  // Question-bank filter + filtered download.
  const [qbFilter, setQbFilter] = useState('All');
  const filteredQB = QB_QUESTIONS.filter(q => qbFilter === 'All' || q.topic === qbFilter || q.level === qbFilter);
  const downloadQB = () => {
    if (!filteredQB.length) return;
    const header = `Menler — AI Interview Question Bank\nFilter: ${qbFilter}\nQuestions: ${filteredQB.length}\n\n`;
    const body = filteredQB.map((q, i) =>
      `${i + 1}. [${q.company} · ${q.level} · ${q.topic}]\nQ: ${q.q}\nA: ${q.a}\n`
    ).join('\n');
    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menler-question-bank-${qbFilter.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const saveReport = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...leadForm, cluster: state.cluster, set: state.setIdx + 1, score: calcScore(state.answers), source: 'aptitude-report' }); } catch { /* non-blocking */ }
    setLeadDone(true);
  };

  // ── QUIZ RUNNER ──
  if (state.view === 'runner') {
    const q = APTITUDE_QUESTIONS[state.idx];
    const selected = state.answers[state.idx];
    const pct = (state.idx / APTITUDE_QUESTIONS.length) * 100;
    return (
      <section className="apt-runner">
        <div className="runner-shell">
          <p className="runner-set-tag">{state.cluster} · Set {state.setIdx + 1}</p>
          <div className="runner-progress"><div className="runner-progress-fill" style={{ width: `${pct}%` }} /></div>
          <p className="runner-meta">Question {state.idx + 1} of {APTITUDE_QUESTIONS.length}</p>
          <p className="runner-q">{q.q}</p>
          <div className="runner-options">
            {q.options.map((opt, i) => (
              <button key={i} className={`runner-option${selected === i ? ' sel' : ''}`} aria-pressed={selected === i} onClick={() => dispatch({ type: 'SELECT', optIdx: i })}>
                <span className="runner-option-key" aria-hidden="true">{i + 1}</span>{opt.t}
              </button>
            ))}
          </div>
          <p className="runner-hint">Tip: press <kbd>1</kbd>–<kbd>{q.options.length}</kbd> to choose · <kbd>Enter</kbd> for next</p>
          <div className="runner-actions">
            <button className="runner-btn runner-btn-back" onClick={() => dispatch({ type: 'BACK' })}>Back</button>
            <button className="runner-btn runner-btn-next" disabled={selected === null} onClick={() => dispatch({ type: 'NEXT' })}>{state.idx === APTITUDE_QUESTIONS.length - 1 ? 'See my report' : 'Next'}</button>
          </div>
        </div>
      </section>
    );
  }

  // ── REPORT CARD ──
  if (state.view === 'report') {
    const score = calcScore(state.answers);
    const rec = getRecommendation(score);
    const roadmap = buildRoadmap(rec.program);
    const dims = DIMENSIONS.map(d => {
      const slice = APTITUDE_QUESTIONS.slice(d.from, d.to);
      const max = slice.reduce((a, qq) => a + Math.max(...qq.options.map(o => o.s)), 0);
      const got = state.answers.slice(d.from, d.to).reduce((a, ans, i) => (ans === null ? a : a + slice[i].options[ans].s), 0);
      return { ...d, pct: Math.round((got / max) * 100) };
    });
    return (
      <>
        <section className="apt-runner">
          <div className="runner-shell apt-report">
            <p className="runner-meta">{state.cluster} · Set {state.setIdx + 1} · Your report</p>
            <p className="runner-score">{score}<em>/{MAX_SCORE}</em></p>
            <p className="runner-band">{rec.band}</p>

            <div className="apt-dims">
              {dims.map(d => (
                <div key={d.label} className="apt-dim">
                  <div className="apt-dim-head"><span>{d.label}</span><span>{d.pct}%</span></div>
                  <div className="apt-dim-bar"><div className="apt-dim-fill" style={{ width: `${d.pct}%`, background: rec.color }} /></div>
                </div>
              ))}
            </div>

            {/* Answer sheet — right below the dimension breakdown */}
            <details className="apt-answers">
              <summary>View answer sheet</summary>
              <div className="apt-answers-body">
                {APTITUDE_QUESTIONS.map((qq, i) => {
                  const ans = state.answers[i];
                  const best = qq.options.reduce((bi, o, oi, arr) => (o.s > arr[bi].s ? oi : bi), 0);
                  return (
                    <div key={i} className="apt-answer-item">
                      <p className="apt-answer-q">{i + 1}. {qq.q}</p>
                      <p className="apt-answer-yours">Your answer: {ans === null ? '—' : qq.options[ans].t} <em>({ans === null ? 0 : qq.options[ans].s} pts)</em></p>
                      {ans !== best && <p className="apt-answer-best">Best answer: {qq.options[best].t}</p>}
                    </div>
                  );
                })}
              </div>
            </details>

            <div className="runner-rec" style={{ background: rec.bg }}>
              <p className="runner-rec-label">Recommended pathway</p>
              <p className="runner-rec-name" style={{ color: rec.color }}>{rec.program}</p>
              <p className="runner-rec-desc">{rec.rationale}</p>
              <button className="btn-primary" style={{ background: rec.color, marginTop: 16 }} onClick={() => go(rec.path)}>Explore {rec.program}</button>
            </div>

            {/* Lead magnet — save / email the full report */}
            {leadDone ? (
              <p className="apt-saved">✓ Report saved — check your inbox for your roadmap.</p>
            ) : (
              <form className="apt-lead" onSubmit={saveReport}>
                <p className="apt-lead-label">Save your report &amp; 14-day roadmap</p>
                <div className="apt-lead-row">
                  <input type="text" required placeholder="Your name" value={leadForm.name} onChange={e => setL('name', e.target.value)} />
                  <input type="email" required placeholder="you@email.com" value={leadForm.email} onChange={e => setL('email', e.target.value)} />
                  <button type="submit">Email me the report</button>
                </div>
              </form>
            )}

            {/* 14-day roadmap */}
            <p className="apt-roadmap-label">Your 14-day learning roadmap</p>
            <div className="apt-roadmap">
              {roadmap.map(r => (
                <div key={r.day} className="apt-roadmap-item">
                  <span className="apt-roadmap-day">Day {r.day}</span>
                  <span className="apt-roadmap-focus">{r.focus}</span>
                </div>
              ))}
            </div>

            <div className="apt-report-actions">
              <button className="runner-btn" onClick={() => dispatch({ type: 'RETAKE' })}>Retake this set</button>
              <button className="runner-btn" onClick={() => dispatch({ type: 'TO_CLUSTERS' })}>Choose another cluster</button>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // ── SET PICKER ──
  if (state.view === 'sets') {
    const cluster = CLUSTERS.find(c => c.name === state.cluster) ?? CLUSTERS[0];
    return (
      <>
        <section className="section" style={{ background: 'var(--parchment)', minHeight: '60vh' }}>
          <button className="runner-btn" style={{ color: 'var(--specialist)', marginBottom: 18 }} onClick={() => dispatch({ type: 'TO_CLUSTERS' })}>All clusters</button>
          <p className="section-label">{cluster.name}</p>
          <h2 className="section-h2">Pick a set<br /><em>to begin.</em></h2>
          <p className="section-sub">Five sets, 15 questions each. Choose any — your report and 14-day roadmap come at the end.</p>
          <div className="cluster-grid">
            {cluster.sets.map((s, i) => (
              <div key={i} className="cluster-card">
                <p className="cluster-name">{s.label}</p>
                <p className="cluster-sets">{s.questions.length} questions · ~10 min</p>
                <button className="cluster-btn" onClick={() => dispatch({ type: 'PICK_SET', setIdx: i })}>Start test</button>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // ── LANDING ──
  return (
    <>
      <section className="apt-hero">
        <div className="apt-hero-inner">
          <p className="apt-eyebrow">Free · No signup to start</p>
          <h1 className="apt-h1">Where do you stand<br /><em>on the AI Curve?</em></h1>
          <p className="apt-sub">A 15-question diagnostic that scores your AI readiness, recommends the right AI learning pathway, and gives you a 14-day learning roadmap. Built by operators, not consultants.</p>
          <button className="apt-cta-big" onClick={() => dispatch({ type: 'PICK_CLUSTER', cluster: CLUSTERS[0].name })}>Start the test</button>
          <p className="apt-trust-line">No email required to start. Save your result at the end.</p>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <p className="section-label" style={{ textAlign: 'center' }}>The assessment</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>What this test is<br /><em>and why it matters.</em></h2>
        <div className="apt-trust-grid">
          {TRUST_CARDS.map((t, i) => (
            <div key={i} className="apt-trust-card">
              <span className="apt-trust-num">{String(i + 1).padStart(2, '0')}</span>
              <p className="apt-trust-title">{t.title}</p>
              <p className="apt-trust-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLUSTERS ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">Choose your cluster</p>
        <h2 className="section-h2">Pick a track.<br /><em>Take a set.</em></h2>
        <p className="section-sub">Nine readiness clusters — each with 5 question sets. Start any set and get your report, score, answer sheet, and a 14-day learning roadmap.</p>
        <div className="cluster-grid">
          {CLUSTERS.map((c, i) => (
            <div key={c.name} className="cluster-card">
              <span className="cluster-num">{String(i + 1).padStart(2, '0')}</span>
              <p className="cluster-name">{c.name}</p>
              <p className="cluster-sets">{c.sets.length} sets · 15 questions each</p>
              <button className="cluster-btn" onClick={() => dispatch({ type: 'PICK_CLUSTER', cluster: c.name })}>Start test <span className="cluster-arrow">→</span></button>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUESTION BANK ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">Section 3 · Question bank</p>
        <h2 className="section-h2">AI Interview QB.<br /><em>200+ questions from real loops.</em></h2>
        <p className="section-sub">Asked at top Indian and global companies. Select a topic and get a PDF of the Q&amp;A asked in real interview rounds.</p>
        <div className="qb-filters">
          {QB_FILTERS.map(f => (
            <button
              key={f}
              className={`qb-filter-pill${qbFilter === f ? ' active' : ''}`}
              onClick={() => setQbFilter(f)}
              aria-pressed={qbFilter === f}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="btn-primary" onClick={downloadQB} disabled={!filteredQB.length}>
            Download Question Bank{qbFilter !== 'All' ? ` — ${qbFilter}` : ''} ({filteredQB.length})
          </button>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center' }}>
        <p className="section-label">FAQ</p>
        <h2 className="section-h2">About the Aptitude Test</h2>
        <FaqList items={APTITUDE_FAQS} />
      </section>

      <Footer />
    </>
  );
}
