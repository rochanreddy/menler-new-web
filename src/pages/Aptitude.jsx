import { useState, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import FaqList from '../components/common/FaqList';
import { submitLead } from '../services/leadService';
import { APTITUDE_QUESTIONS, MAX_SCORE, getRecommendation } from '../data/aptitudeQuestions';
import { APTITUDE_FAQS } from '../data/faqData';

const TRUST_CARDS = [
  { title: 'What it tests', desc: 'AI readiness, problem-solving, prompt instinct, and role-fit across 4 sub-scores.' },
  { title: 'How it\'s scored', desc: '0–100 scaled score. Calibrated against Meridian placement outcomes — not a generic AI benchmark.' },
  { title: 'What you get', desc: 'Personalised score + program recommendation + placement-readiness gauge + 10-day AI roadmap.' },
  { title: 'Social proof', desc: '28,000+ Indians have taken the Meridian Aptitude Test. 12% went on to a Meridian program.' },
];

const QB_QUESTIONS = [
  { company: 'Razorpay', level: 'Senior', topic: 'RAG', q: 'You are building a RAG system for Razorpay\'s internal policy docs. The system gives confident wrong answers. What is the most likely root cause and how do you fix it?', a: 'Likely cause: chunk size too large or lack of re-ranking, causing irrelevant passages to dominate context. Fix: smaller, overlapping chunks + cross-encoder re-ranking + source-grounding evaluation (RAGAS).' },
  { company: 'Sarvam AI', level: 'Foundations', topic: 'Evals', q: 'You have a Claude pipeline that translates English to Hindi. You want to know if it\'s getting better or worse between deployments. How do you set up a basic eval?', a: 'Build a fixed eval set of 50–100 English → gold Hindi pairs. For each deployment, run Claude on all pairs, score with BLEU or LLM-as-judge, track the mean. Regression if score drops >2%.' },
  { company: 'Cred', level: 'Senior', topic: 'Tool use', q: 'You\'re building a Claude agent for CRED\'s member services. The agent needs to look up account balances (read-only) and also flag disputes (write). How do you design the tool schema and what safety guardrails do you implement?', a: 'Separate tools by risk: `get_account_balance` (no confirm) vs `flag_dispute` (confirm step + audit log). Implement tool-use prompts with explicit permission scopes. Never allow irreversible actions without human-in-the-loop.' },
  { company: 'Anthropic', level: 'Senior', topic: 'MCP', q: 'Explain Model Context Protocol. In what situation would you choose to build an MCP server rather than use tool use in the API directly?', a: 'MCP is an open protocol for exposing resources, tools, and prompts to Claude clients (Desktop, Cowork). Use MCP when you need persistent, reusable tools across sessions/users — e.g. an internal Slack MCP that all employees connect. Use API tool use for session-specific, single-app tool calls.' },
  { company: 'Postman', level: 'Foundations', topic: 'Prompts', q: 'Postman wants Claude to generate API documentation from a JSON schema. Write a system prompt for this use case that consistently produces clean, developer-friendly output.', a: 'System: "You are an API documentation writer. Given a JSON schema, produce Markdown docs with: (1) endpoint summary, (2) parameter table (name, type, required, description), (3) example request, (4) example response, (5) common error codes. Be concise. Use no filler prose."' },
  { company: 'Browserbase', level: 'Senior', topic: 'Agents', q: 'You\'re building a multi-step web agent using Claude + Browserbase. The agent must log in, navigate a dashboard, and extract structured data. How do you handle state management and what failure modes do you architect for?', a: 'Use a session context object persisted across turns. Plan for: login CAPTCHA (fallback to human handoff), navigation state loss (resumable checkpoints), extraction failure (regex + LLM fallback), rate limiting (exponential backoff). Add LangFuse spans for each browser action.' },
];

const GROUP_SIZES = ['Under 10 (free)', '10–50', '50–200', '200+'];

const INIT = { view: 'landing', idx: 0, answers: Array(APTITUDE_QUESTIONS.length).fill(null) };
const STORAGE_KEY = 'meridian-aptitude-progress';

// Resume an in-progress test after a refresh; completed/landing start fresh.
function loadInit() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.view === 'runner' && Array.isArray(saved.answers) && saved.answers.length === APTITUDE_QUESTIONS.length) {
      return { view: 'runner', idx: Math.min(saved.idx ?? 0, APTITUDE_QUESTIONS.length - 1), answers: saved.answers };
    }
  } catch { /* ignore malformed storage */ }
  return INIT;
}

function reducer(state, action) {
  switch (action.type) {
    case 'START': return { ...INIT, view: 'runner' };
    case 'SELECT': {
      const answers = [...state.answers];
      answers[state.idx] = action.optIdx;
      return { ...state, answers };
    }
    case 'NEXT':
      if (state.idx < APTITUDE_QUESTIONS.length - 1) return { ...state, idx: state.idx + 1 };
      return { ...state, view: 'result' };
    case 'BACK':
      if (state.idx > 0) return { ...state, idx: state.idx - 1 };
      return { ...state, view: 'landing' };
    default: return state;
  }
}

function calcScore(answers) {
  return answers.reduce((acc, a, i) => {
    if (a === null) return acc;
    return acc + APTITUDE_QUESTIONS[i].options[a].s;
  }, 0);
}

export default function Aptitude() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const [state, dispatch] = useReducer(reducer, undefined, loadInit);

  // Persist in-progress test so a refresh resumes where the user left off.
  useEffect(() => {
    try {
      if (state.view === 'runner') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ view: 'runner', idx: state.idx, answers: state.answers }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* storage may be unavailable */ }
  }, [state]);

  // Keyboard support while taking the test: 1–N select, ↑/↓ move, Enter advances.
  useEffect(() => {
    if (state.view !== 'runner') return;
    const onKey = (e) => {
      const n = APTITUDE_QUESTIONS[state.idx].options.length;
      const sel = state.answers[state.idx];
      if (e.key >= '1' && e.key <= String(n)) {
        dispatch({ type: 'SELECT', optIdx: Number(e.key) - 1 }); e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        dispatch({ type: 'SELECT', optIdx: sel === null ? 0 : Math.min(sel + 1, n - 1) }); e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        dispatch({ type: 'SELECT', optIdx: sel === null ? n - 1 : Math.max(sel - 1, 0) }); e.preventDefault();
      } else if (e.key === 'Enter') {
        if (document.activeElement?.classList?.contains('runner-option')) return; // let the focused option select
        if (sel !== null) { dispatch({ type: 'NEXT' }); e.preventDefault(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.view, state.idx, state.answers]);

  const [bundleForm, setBundleForm] = useState({ org: '', contact: '', email: '', size: '' });
  const [bundleDone, setBundleDone] = useState(false);
  const setB = (k, v) => setBundleForm(f => ({ ...f, [k]: v }));
  const handleBundle = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...bundleForm, source: 'aptitude-bundle' }); } catch {}
    setBundleDone(true);
  };

  if (state.view === 'runner') {
    const q = APTITUDE_QUESTIONS[state.idx];
    const selected = state.answers[state.idx];
    const pct = ((state.idx) / APTITUDE_QUESTIONS.length) * 100;
    return (
      <section className="apt-runner">
        <div className="runner-shell">
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
            <button className="runner-btn runner-btn-back" onClick={() => dispatch({ type: 'BACK' })}>← Back</button>
            <button className="runner-btn runner-btn-next" disabled={selected === null} onClick={() => dispatch({ type: 'NEXT' })}>{state.idx === APTITUDE_QUESTIONS.length - 1 ? 'See my result →' : 'Next →'}</button>
          </div>
        </div>
      </section>
    );
  }

  if (state.view === 'result') {
    const score = calcScore(state.answers);
    const rec = getRecommendation(score);
    return (
      <>
        <section className="apt-runner">
          <div className="runner-shell">
            <div className="runner-result">
              <p className="runner-meta">Your AI Aptitude Score</p>
              <p className="runner-score">{score}<em>/{MAX_SCORE}</em></p>
              <p className="runner-band">{rec.band}</p>
              <div className="runner-rec" style={{ background: rec.bg }}>
                <p className="runner-rec-label">Recommended program</p>
                <p className="runner-rec-name" style={{ color: rec.color }}>{rec.program}</p>
                <p className="runner-rec-desc">{rec.desc}</p>
                <button className="btn-primary" style={{ background: rec.color, marginTop: 16 }} onClick={() => go(rec.path)}>
                  Explore {rec.program} →
                </button>
              </div>
              <button className="runner-btn" style={{ marginTop: 12, color: 'var(--specialist)' }} onClick={() => dispatch({ type: 'START' })}>Retake test</button>
            </div>
          </div>
        </section>
        <section className="section" style={{ background: 'var(--parchment)', textAlign: 'center' }}>
          <p className="section-label">FAQ</p>
          <h2 className="section-h2">About the test</h2>
          <FaqList items={APTITUDE_FAQS} />
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
          <p className="apt-eyebrow">Free · 12 minutes · No signup to start</p>
          <h1 className="apt-h1">Where do you stand<br /><em>on the AI curve?</em></h1>
          <p className="apt-sub">A 10-question diagnostic that scores your AI readiness across four dimensions — fluency, tool instinct, workflow thinking, and domain fit. Used by 28,000+ Indians to benchmark where they really are on the AI adoption curve — and what to do next.</p>
          <button className="apt-cta-big" onClick={() => dispatch({ type: 'START' })}>Start the test (free, 12 min) →</button>
          <p className="apt-trust-line">No email required to start. Save your result at the end.</p>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="apt-trust-grid">
          {TRUST_CARDS.map((t, i) => (
            <div key={i} className="apt-trust-card">
              <p className="apt-trust-title">{t.title}</p>
              <p className="apt-trust-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAMS / BUNDLE ── */}
      <section className="section" style={{ background: 'var(--parchment)' }}>
        <p className="section-label">For teams & institutions</p>
        <h2 className="section-h2">Run the test<br /><em>for your organisation.</em></h2>
        <p className="section-sub">Benchmark your team, class, or cohort on AI readiness. Get an aggregated report and track score over time.</p>
        <div className="qualify-grid" style={{ marginBottom: 40 }}>
          <div className="qualify-card"><p className="qualify-title">Schools & colleges</p><p className="qualify-desc">Benchmark your batch for AI readiness. Useful for placement prep, hackathons, and curriculum design.</p></div>
          <div className="qualify-card"><p className="qualify-title">Companies</p><p className="qualify-desc">Know which teams are AI-ready before you roll out Claude tools. Benchmark pre/post training.</p></div>
          <div className="qualify-card"><p className="qualify-title">Bootcamps & accelerators</p><p className="qualify-desc">Use the Aptitude Test as an intake filter or post-cohort progress tracker.</p></div>
        </div>
        {bundleDone ? (
          <p style={{ textAlign: 'center', color: 'var(--placed)', fontWeight: 500 }}>✓ We'll reach out to confirm your bundle details.</p>
        ) : (
          <form className="prog-lead-form" style={{ maxWidth: 560, margin: '0 auto' }} onSubmit={handleBundle}>
            <label>Organisation name</label>
            <input type="text" required placeholder="Your company / school" value={bundleForm.org} onChange={e => setB('org', e.target.value)} />
            <div className="row2">
              <div><label>Contact name</label><input type="text" required placeholder="Full name" value={bundleForm.contact} onChange={e => setB('contact', e.target.value)} /></div>
              <div><label>Work email</label><input type="email" required placeholder="you@org.com" value={bundleForm.email} onChange={e => setB('email', e.target.value)} /></div>
            </div>
            <label>Group size</label>
            <select required value={bundleForm.size} onChange={e => setB('size', e.target.value)}>
              <option value="">Choose size</option>
              {GROUP_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
            <button type="submit">Request organisation bundle →</button>
          </form>
        )}
      </section>

      {/* ── QUESTION BANK ── */}
      <section className="section" style={{ background: 'white' }}>
        <p className="section-label">AI Interview Question Bank</p>
        <h2 className="section-h2">200+ questions.<br /><em>Sourced from real hiring rounds.</em></h2>
        <p className="section-sub">Every question in the Meridian QB is sourced from real AI interview rounds at India's fastest-growing companies. Filterable by company, role, topic, and difficulty.</p>
        <div className="qb-filters">
          {['Role: AI Engineer', 'Role: AI Generalist', 'Role: Prompt Engineer', 'Role: AI PM', 'Topic: RAG', 'MCP', 'Agents', 'Evals', 'Difficulty: Foundations', 'Senior'].map(f => (
            <span key={f} className="qb-filter-pill">{f}</span>
          ))}
        </div>
        <div className="qb-grid">
          {QB_QUESTIONS.map((q, i) => (
            <details key={i} className="qb-card">
              <summary>
                <span className="qb-company">{q.company}</span>
                <span className="qb-level">{q.level}</span>
                <span className="qb-topic">{q.topic}</span>
                <p className="qb-question">{q.q}</p>
              </summary>
              <div className="qb-answer"><p>{q.a}</p></div>
            </details>
          ))}
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

