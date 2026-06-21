import { useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import FaqList from '../components/common/FaqList';
import { submitLead } from '../services/leadService';
import { getRecommendation, maxScoreForQuestions } from '../data/aptitudeQuestions';
import { CLUSTERS, buildRoadmap, getSetQuestions, getAllAboutAIQuestions } from '../data/aptitudeClusters';
import { getGeneralistSession } from '../data/generalistAptitude';
import { getStudentSession } from '../data/studentAptitude';
import { getProductSession } from '../data/productAptitude';
import { getMarketingSession } from '../data/marketingAptitude';
import { getHrSession } from '../data/hrAptitude';
import { getFoundersSession } from '../data/foundersAptitude';
import { getFinanceSession } from '../data/financeAptitude';
import { getAnalystsSession } from '../data/analystsAptitude';
import { getEngineeringSession } from '../data/engineeringAptitude';
import { APTITUDE_FAQS } from '../data/faqData';

const TRUST_CARDS = [
  { title: 'What it tests', desc: 'AI readiness across three core dimensions: problem-solving, execution ability, and role alignment.' },
  { title: 'How it\'s scored', desc: '0–15 readiness score, broken into sub-scores and benchmarked against real-world performance indicators.' },
  { title: 'What you\'ll receive', desc: 'A personalised readiness report, learning roadmap, and placement-readiness insights.' },
  { title: 'Why it matters', desc: 'Most people dont know where they stand with AI. This assessment gives you a clear baseline before you invest resources.' },
];

// Question-bank topics → downloadable PDF (in /public/question_banks).
// `label` = pill display name; `name` = short name shown on the download button.
// `pdf: null` = not uploaded yet; the pill shows but download is disabled.
const QB_BANKS = [
  { label: 'All about AI', name: 'All', pdf: '/question_banks/Menler_All_About_AI_Question_Bank.pdf' },
  { label: 'Agentic AI', name: 'Agentic AI', pdf: '/question_banks/Menler_Agentic_AI_Question_Bank.pdf' },
  { label: 'AI Agent Workflows', name: 'AI Agents', pdf: '/question_banks/Menler_AI_Agents_Workflows_Question_Bank.pdf' },
  { label: 'AI Engineering Thinking', name: 'Engineering', pdf: '/question_banks/Menler_AI_Engineering_Thinking_Question_Bank.pdf' },
  { label: 'AI Judgement', name: 'Evals', pdf: '/question_banks/Menler_AI_Judgment_Question_Bank.pdf' },
  { label: 'AI Network Infrastructure', name: 'MCPs & Connectors', pdf: '/question_banks/Menler_AI_Networks_Infrastructure_Question_Bank.pdf' },
  { label: 'AI Tools Ecosystem', name: 'AI Tools', pdf: '/question_banks/Menler_AI_Tools_Ecosystem_Question_Bank.pdf' },
  { label: 'LLM Fundamentals', name: 'LLMs', pdf: '/question_banks/Menler_LLM_Fundamentals_Question_Bank.pdf' },
  { label: 'Prompt Engineering', name: 'Prompts', pdf: '/question_banks/Menler_Prompt_Engineering_Question_Bank.pdf' },
  { label: 'RAG Knowledge Systems', name: 'RAG', pdf: '/question_banks/Menler_RAG_Knowledge_Systems_Question_Bank.pdf' },
];

const QB_QUESTIONS = [
  { company: 'Razorpay', level: 'Senior', topic: 'RAG', q: 'You are building a RAG system for Razorpay\'s internal policy docs. The system gives confident wrong answers. What is the most likely root cause and how do you fix it?', a: 'Likely cause: chunk size too large or lack of re-ranking, causing irrelevant passages to dominate context. Fix: smaller, overlapping chunks + cross-encoder re-ranking + source-grounding evaluation (RAGAS).' },
  { company: 'Sarvam AI', level: 'Foundations', topic: 'Evals', q: 'You have a Claude pipeline that translates English to Hindi. You want to know if it\'s getting better or worse between deployments. How do you set up a basic eval?', a: 'Build a fixed eval set of 50–100 English → gold Hindi pairs. For each deployment, run Claude on all pairs, score with BLEU or LLM-as-judge, track the mean. Regression if score drops >2%.' },
  { company: 'Cred', level: 'Senior', topic: 'Tool use', q: 'You\'re building a Claude agent for CRED\'s member services. The agent needs to look up account balances (read-only) and also flag disputes (write). How do you design the tool schema and what safety guardrails do you implement?', a: 'Separate tools by risk: `get_account_balance` (no confirm) vs `flag_dispute` (confirm step + audit log). Implement tool-use prompts with explicit permission scopes. Never allow irreversible actions without human-in-the-loop.' },
  { company: 'Anthropic', level: 'Senior', topic: 'MCP', q: 'Explain Model Context Protocol. In what situation would you choose to build an MCP server rather than use tool use in the API directly?', a: 'MCP is an open protocol for exposing resources, tools, and prompts to Claude clients (Desktop, Cowork). Use MCP when you need persistent, reusable tools across sessions/users — e.g. an internal Slack MCP that all employees connect. Use API tool use for session-specific, single-app tool calls.' },
  { company: 'Postman', level: 'Foundations', topic: 'Prompts', q: 'Postman wants Claude to generate API documentation from a JSON schema. Write a system prompt for this use case that consistently produces clean, developer-friendly output.', a: 'System: "You are an API documentation writer. Given a JSON schema, produce Markdown docs with: (1) endpoint summary, (2) parameter table, (3) example request, (4) example response, (5) common error codes. Be concise."' },
  { company: 'Browserbase', level: 'Senior', topic: 'Agents', q: 'You\'re building a multi-step web agent using Claude + Browserbase. The agent must log in, navigate a dashboard, and extract structured data. How do you handle state management and what failure modes do you architect for?', a: 'Use a session context object persisted across turns. Plan for: login CAPTCHA (human handoff), navigation state loss (resumable checkpoints), extraction failure (regex + LLM fallback), rate limiting (exponential backoff).' },
];

// Three readiness dimensions, mapped to question ranges.
function buildDimensions(length) {
  const size = Math.floor(length / 3);
  return [
    { label: 'Problem-solving', from: 0, to: size },
    { label: 'Execution ability', from: size, to: size * 2 },
    { label: 'Role alignment', from: size * 2, to: length },
  ];
}

const blankArr = (len, fill) => Array(len).fill(fill);
const INIT = { view: 'landing', cluster: null, setIdx: 0, idx: 0, questions: [], answers: [], marked: [] };

// Domains shown in the "Choose your domain" pop-up (after Start the test).
// Per-domain question PDFs are wired in as they're provided.
const EXAM_DOMAINS = [
  { name: 'Student', getQuestions: () => getStudentSession(15) },
  { name: 'Generalist', getQuestions: () => getGeneralistSession(15) },
  { name: 'Engineer', getQuestions: () => getEngineeringSession(15) },
  { name: 'Analysts', getQuestions: () => getAnalystsSession(15) },
  { name: 'Finance', getQuestions: () => getFinanceSession(15) },
  { name: "Founder's Office", getQuestions: () => getFoundersSession(15) },
  { name: 'HR', getQuestions: () => getHrSession(15) },
  { name: 'Marketing & Sales', getQuestions: () => getMarketingSession(15) },
  { name: 'PM', getQuestions: () => getProductSession(15) },
];

function reducer(state, action) {
  switch (action.type) {
    case 'PICK_CLUSTER': return { ...state, view: 'sets', cluster: action.cluster };
    case 'START_TEST': {
      // Skip the set picker — drop straight into the runner. Use explicit
      // questions when provided (e.g. the mixed "All About AI" test),
      // otherwise pull the given domain's set (default = first set).
      const setIdx = action.setIdx ?? 0;
      const questions = action.questions ?? getSetQuestions(action.cluster, setIdx);
      return {
        ...state,
        view: 'runner',
        cluster: action.cluster,
        setIdx,
        idx: 0,
        questions,
        answers: blankArr(questions.length, null),
        marked: blankArr(questions.length, false),
      };
    }
    case 'PICK_SET': {
      const questions = getSetQuestions(state.cluster, action.setIdx);
      return {
        ...state,
        view: 'runner',
        setIdx: action.setIdx,
        idx: 0,
        questions,
        answers: blankArr(questions.length, null),
        marked: blankArr(questions.length, false),
      };
    }
    case 'SELECT': {
      const answers = [...state.answers];
      answers[state.idx] = action.optIdx;
      return { ...state, answers };
    }
    case 'CLEAR': {
      const answers = [...state.answers];
      answers[state.idx] = null;
      return { ...state, answers };
    }
    case 'TOGGLE_REVIEW': {
      const marked = [...state.marked];
      marked[state.idx] = !marked[state.idx];
      return { ...state, marked };
    }
    case 'GOTO': return { ...state, idx: action.idx };
    case 'NEXT':
      return state.idx < state.questions.length - 1 ? { ...state, idx: state.idx + 1 } : { ...state, view: 'report' };
    case 'BACK':
      return state.idx > 0 ? { ...state, idx: state.idx - 1 } : { ...state, view: 'sets' };
    case 'SUBMIT': return { ...state, view: 'report' };
    case 'RETAKE': return {
      ...state,
      view: 'runner',
      idx: 0,
      answers: blankArr(state.questions.length, null),
      marked: blankArr(state.questions.length, false),
    };
    case 'TO_SETS': return { ...state, view: 'sets' };
    case 'TO_CLUSTERS': return { ...INIT };
    default: return state;
  }
}

// The "correct" option is the highest-scoring one for that question.
const bestIdx = (q) => q.options.reduce((bi, o, oi, arr) => (o.s > arr[bi].s ? oi : bi), 0);

// Each question is worth exactly 1 mark (correct answer = 1, otherwise 0).
function calcScore(answers, questions) {
  return answers.reduce((acc, a, i) => (a !== null && a === bestIdx(questions[i]) ? acc + 1 : acc), 0);
}

export default function Aptitude() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const [state, dispatch] = useReducer(reducer, INIT);

  // "Choose your domain" pop-up (opens when the hero "Start the test" is clicked).
  const [domainOpen, setDomainOpen] = useState(false);
  const [chosenDomain, setChosenDomain] = useState(null);
  const [exitConfirm, setExitConfirm] = useState(false);
  const startChosenDomain = () => {
    if (!chosenDomain) return;
    if (chosenDomain.getQuestions) dispatch({ type: 'START_TEST', cluster: chosenDomain.name, questions: chosenDomain.getQuestions() });
    else if (chosenDomain.mixed) dispatch({ type: 'START_TEST', cluster: 'All About AI', questions: getAllAboutAIQuestions(15) });
    else dispatch({ type: 'START_TEST', cluster: chosenDomain.name });
    setDomainOpen(false);
  };

  // Jump to the top of the page whenever the view changes (landing → sets → runner → report).
  // Jump to the top on every view change. Use Lenis if it's running (plain
  // window.scrollTo is ignored while Lenis owns the scroll), else native.
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [state.view]);

  // 15-minute countdown for the test runner. Resets when a new set starts.
  const TEST_SECONDS = 15 * 60;
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (state.view !== 'runner') return;
    setElapsed(0);
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [state.view, state.setIdx]);
  // Auto-submit when time runs out.
  useEffect(() => {
    if (state.view === 'runner' && elapsed >= TEST_SECONDS) dispatch({ type: 'SUBMIT' });
  }, [elapsed, state.view, TEST_SECONDS]);

  // Keyboard support while taking the test.
  useEffect(() => {
    if (state.view !== 'runner') return;
    const onKey = (e) => {
      const n = state.questions[state.idx].options.length;
      const sel = state.answers[state.idx];
      if (e.key >= '1' && e.key <= String(n)) { dispatch({ type: 'SELECT', optIdx: Number(e.key) - 1 }); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { dispatch({ type: 'SELECT', optIdx: sel === null ? 0 : Math.min(sel + 1, n - 1) }); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { dispatch({ type: 'SELECT', optIdx: sel === null ? n - 1 : Math.max(sel - 1, 0) }); e.preventDefault(); }
      else if (e.key === 'Enter' && sel !== null) { dispatch({ type: 'NEXT' }); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.view, state.idx, state.answers, state.questions]);

  const [leadForm, setLeadForm] = useState({ name: '', email: '' });
  const [leadDone, setLeadDone] = useState(false);
  const setL = (k, v) => setLeadForm(f => ({ ...f, [k]: v }));

  // Answer sheet is gated behind a short form: click "View answer sheet" → fill
  // the form → the sheet is revealed.
  const [sheetFormOpen, setSheetFormOpen] = useState(false); // form is showing
  const [sheetUnlocked, setSheetUnlocked] = useState(false); // sheet is revealed
  const [sheetForm, setSheetForm] = useState({ name: '', email: '', phone: '' });
  const [sheetBusy, setSheetBusy] = useState(false);
  const [sheetErr, setSheetErr] = useState(false);
  const setS = (k, v) => setSheetForm(f => ({ ...f, [k]: v }));
  // Only reveal the sheet AFTER the lead is saved — so the data always reaches
  // the admin panel. If the save fails, show an error and let them retry.
  const unlockSheet = async (e) => {
    e.preventDefault();
    setSheetErr(false); setSheetBusy(true);
    try {
      await submitLead({ ...sheetForm, cluster: state.cluster, set: state.setIdx + 1, score: calcScore(state.answers, state.questions), source: 'aptitude-answer-sheet' });
      setSheetUnlocked(true);
    } catch {
      setSheetErr(true);
    } finally {
      setSheetBusy(false);
    }
  };

  // Question-bank topic selector + per-topic PDF download (gated behind a form).
  const [qbFilter, setQbFilter] = useState('All');
  const qbBank = QB_BANKS.find(b => b.name === qbFilter) || QB_BANKS[0];
  const [qbFormOpen, setQbFormOpen] = useState(false);
  const [qbForm, setQbForm] = useState({ name: '', email: '', phone: '' });
  const [qbBusy, setQbBusy] = useState(false);
  const [qbErr, setQbErr] = useState(false);
  const setQ = (k, v) => setQbForm(f => ({ ...f, [k]: v }));
  const doDownloadQB = () => {
    if (!qbBank.pdf) return;
    const a = document.createElement('a');
    a.href = encodeURI(qbBank.pdf);
    a.download = '';
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  // Save the lead first, then download — so the data always reaches the admin.
  const submitQB = async (e) => {
    e.preventDefault();
    setQbErr(false); setQbBusy(true);
    try {
      await submitLead({ ...qbForm, topic: qbBank.name, source: 'aptitude-question-bank' });
      setQbFormOpen(false);
      doDownloadQB();
    } catch {
      setQbErr(true);
    } finally {
      setQbBusy(false);
    }
  };
  const saveReport = async (e) => {
    e.preventDefault();
    try { await submitLead({ ...leadForm, cluster: state.cluster, set: state.setIdx + 1, score: calcScore(state.answers, state.questions), source: 'aptitude-report' }); } catch { /* non-blocking */ }
    setLeadDone(true);
  };

  // ── QUIZ RUNNER ──
  if (state.view === 'runner') {
    const q = state.questions[state.idx];
    const selected = state.answers[state.idx];
    const total = state.questions.length;
    const answeredCount = state.answers.filter(a => a !== null).length;
    const markedCount = state.marked.filter(Boolean).length;
    const pct = (answeredCount / total) * 100;
    const remaining = Math.max(0, TEST_SECONDS - elapsed);
    const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
    const ss = String(remaining % 60).padStart(2, '0');
    const lowTime = remaining <= 60;
    return (
      <section className="apt-runner apt-runner--exam">
        {exitConfirm && (
          <div className="apt-modal-overlay" onClick={() => setExitConfirm(false)}>
            <div className="apt-modal apt-modal--confirm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <h2 className="apt-modal-h">Exit the test?</h2>
              <p className="apt-modal-sub">Your progress won't be saved — you'll have to start this test again.</p>
              <div className="apt-confirm-actions">
                <button className="apt-confirm-cancel" onClick={() => setExitConfirm(false)}>Cancel</button>
                <button className="apt-confirm-exit" onClick={() => { setExitConfirm(false); dispatch({ type: 'TO_CLUSTERS' }); }}>Exit test</button>
              </div>
            </div>
          </div>
        )}
        <div className="runner-layout">
          <div className="runner-main">
            <div className="runner-topbar">
              <button className="runner-btn runner-exit" onClick={() => setExitConfirm(true)}>← Exit</button>
              {/* Compact timer shown beside Exit on mobile only (the aside timer is hidden there). */}
              <div className={`runner-timer runner-timer--inline${lowTime ? ' low' : ''}`}>
                <span className="runner-timer-label">Time left</span>
                <span className="runner-timer-val">{mm}:{ss}</span>
              </div>
            </div>
            <p className="runner-set-tag">{state.cluster}</p>
            <div className="runner-progress"><div className="runner-progress-fill" style={{ width: `${pct}%` }} /></div>
            <p className="runner-meta">Question {state.idx + 1} of {total} · {answeredCount} answered</p>
            <p className="runner-q">{q.q}</p>
            <div className="runner-options">
              {q.options.map((opt, i) => (
                <button key={i} className={`runner-option${selected === i ? ' sel' : ''}`} aria-pressed={selected === i} onClick={() => dispatch({ type: 'SELECT', optIdx: i })}>
                  <span className="runner-option-key" aria-hidden="true">{i + 1}</span>{opt.t}
                </button>
              ))}
            </div>
            <div className="runner-actions">
              {state.idx === total - 1
                ? <button className="runner-btn runner-btn-next" onClick={() => dispatch({ type: 'SUBMIT' })}>Submit test</button>
                : <button className="runner-btn runner-btn-next" onClick={() => dispatch({ type: 'NEXT' })}>Next →</button>}
              <p className="runner-hint">Tip: press <kbd>1</kbd>–<kbd>{q.options.length}</kbd> to choose · <kbd>Enter</kbd> for next</p>
              <div className="runner-actions-row">
                <button className="runner-btn runner-btn-back" disabled={state.idx === 0} onClick={() => dispatch({ type: 'BACK' })}>← Prev</button>
                <button className="runner-btn-ghost" disabled={selected === null} onClick={() => dispatch({ type: 'CLEAR' })}>Clear</button>
                <button className={`runner-btn-ghost${state.marked[state.idx] ? ' on' : ''}`} onClick={() => dispatch({ type: 'TOGGLE_REVIEW' })}>{state.marked[state.idx] ? '★ Marked' : '☆ Mark'}</button>
              </div>
            </div>
          </div>

          <aside className="runner-nav">
            <div className={`runner-timer${lowTime ? ' low' : ''}`}>
              <span className="runner-timer-label">Time left</span>
              <span className="runner-timer-val">{mm}:{ss}</span>
            </div>
            <p className="runner-nav-title">Questions</p>
            <div className="runner-nav-grid">
              {state.questions.map((_, i) => {
                const ans = state.answers[i] !== null;
                const mk = state.marked[i];
                const cur = i === state.idx;
                const cls = cur ? 'cur' : mk ? 'mark' : ans ? 'done' : 'todo';
                return <button key={i} className={`runner-dot ${cls}`} onClick={() => dispatch({ type: 'GOTO', idx: i })} aria-label={`Go to question ${i + 1}`}>{i + 1}</button>;
              })}
            </div>
            <div className="runner-legend">
              <span><i className="lg done" /> Answered · {answeredCount}</span>
              <span><i className="lg mark" /> Marked · {markedCount}</span>
              <span><i className="lg todo" /> Left · {total - answeredCount}</span>
            </div>
            <button className="runner-submit" onClick={() => dispatch({ type: 'SUBMIT' })}>Submit test</button>
            <p className="runner-nav-note">Answers save as you go. Mark any question to revisit it before you submit.</p>
          </aside>
        </div>
      </section>
    );
  }

  // ── REPORT CARD ──
  if (state.view === 'report') {
    const { questions } = state;
    const maxScore = maxScoreForQuestions(questions);
    const score = calcScore(state.answers, questions);
    const rec = getRecommendation(score, maxScore);
    const roadmap = buildRoadmap(rec.program);
    const dims = buildDimensions(questions.length).map(d => {
      const slice = questions.slice(d.from, d.to);
      const max = slice.length; // 1 mark per question
      const got = state.answers.slice(d.from, d.to).reduce((a, ans, i) => (ans !== null && ans === bestIdx(slice[i]) ? a + 1 : a), 0);
      return { ...d, pct: Math.round((got / max) * 100) };
    });
    return (
      <>
        <section className="apt-runner">
          <div className="runner-shell apt-report">
            <p className="runner-meta">Set {state.setIdx + 1} · {state.cluster} · Your report</p>
            <p className="runner-score">{score}<em>/{maxScore}</em></p>
            <p className="runner-band">{rec.band}</p>

            <div className="apt-dims">
              {dims.map(d => (
                <div key={d.label} className="apt-dim">
                  <div className="apt-dim-head"><span>{d.label}</span><span>{d.pct}%</span></div>
                  <div className="apt-dim-bar"><div className="apt-dim-fill" style={{ width: `${d.pct}%`, background: rec.color }} /></div>
                </div>
              ))}
            </div>

            {/* Answer sheet — gated behind a short form */}
            <div className="apt-answers">
              {!sheetUnlocked && !sheetFormOpen && (
                <button type="button" className="apt-answers-toggle" onClick={() => setSheetFormOpen(true)}>View answer sheet</button>
              )}
              {!sheetUnlocked && sheetFormOpen && (
                <form className="apt-sheet-gate" onSubmit={unlockSheet}>
                  <p className="apt-lead-label">Enter your details to view the answer sheet</p>
                  <div className="apt-lead-row">
                    <input type="text" required placeholder="Your name" value={sheetForm.name} onChange={e => setS('name', e.target.value)} />
                    <input type="email" required placeholder="you@email.com" value={sheetForm.email} onChange={e => setS('email', e.target.value)} />
                    <input type="tel" required placeholder="Phone number" value={sheetForm.phone} onChange={e => setS('phone', e.target.value)} />
                    <button type="submit" disabled={sheetBusy}>{sheetBusy ? 'Saving…' : 'View answer sheet'}</button>
                  </div>
                  {sheetErr && <p className="apt-gate-err">Couldn't submit — please check your connection and try again.</p>}
                </form>
              )}
              {sheetUnlocked && (
              <div className="apt-answers-body">
                {(() => {
                  const correctCount = questions.reduce((acc, qq, i) => {
                    const ci = qq.options.reduce((bi, o, oi, arr) => (o.s > arr[bi].s ? oi : bi), 0);
                    return acc + (state.answers[i] === ci ? 1 : 0);
                  }, 0);
                  return <p className="apt-answer-tally">{correctCount} / {questions.length} correct</p>;
                })()}
                {questions.map((qq, i) => {
                  const ans = state.answers[i];
                  const correct = qq.options.reduce((bi, o, oi, arr) => (o.s > arr[bi].s ? oi : bi), 0);
                  const unanswered = ans === null;
                  const isCorrect = !unanswered && ans === correct;
                  return (
                    <div key={i} className={`apt-qcard${isCorrect ? ' is-correct' : ' is-wrong'}`}>
                      <div className="apt-qcard-body">
                        <p className="apt-qcard-num">Question {i + 1}</p>
                        <p className="apt-qcard-q">{qq.q}</p>
                        <p className={`apt-qcard-status ${isCorrect ? 'ok' : 'no'}`}>
                          {unanswered ? 'Not answered' : isCorrect ? 'Correct' : 'Incorrect'}
                        </p>
                        <div className="apt-qcard-opts" role="list">
                          {qq.options.map((o, oi) => {
                            const isPick = ans === oi;
                            const isKey = oi === correct;
                            const tone = isKey ? 'key' : isPick ? 'wrong' : '';
                            return (
                              <div key={oi} className={`apt-opt-row ${tone}`} role="listitem">
                                <span className="apt-opt-box" aria-hidden="true">
                                  {isPick && (isKey ? '✓' : '✕')}
                                </span>
                                <span className="apt-opt-pill">{o.t}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {qq.explanation && (
                        <details className="apt-qcard-exp">
                          <summary>
                            <span>Explanation</span>
                            <svg className="apt-exp-chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </summary>
                          <p>{qq.explanation}</p>
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
              )}
            </div>

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
        <section className="section" style={{ background: 'var(--parchment)', minHeight: '60vh', paddingTop: 48, textAlign: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            <button className="runner-btn-ghost" style={{ marginBottom: 22 }} onClick={() => dispatch({ type: 'TO_CLUSTERS' })}>← Back to tracks</button>
          </div>
          <p className="apt-track-badge">{cluster.name}</p>
          <h2 className="section-h2">Pick a set<br /><em>to begin.</em></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Five sets, 15 questions each. Choose any — your report and 14-day roadmap come at the end.</p>
          <div className="cluster-grid cluster-grid--sets">
            {cluster.sets.map((s, i) => (
              <div key={i} className="cluster-card">
                <p className="cluster-name">{s.label} · {cluster.name}</p>
                <p className="cluster-sets">{s.questions.length} questions · ~15 min</p>
                <button className="cluster-btn" onClick={() => dispatch({ type: 'PICK_SET', setIdx: i })}>Start test</button>
              </div>
            ))}
          </div>
        </section>

        {/* ── EXPLORE MENLER PROGRAMS ── */}
        <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
          <p className="section-label" style={{ textAlign: 'center' }}>Explore Menler Programs</p>
          <h2 className="section-h2" style={{ textAlign: 'center' }}>Continue your <em>AI journey.</em></h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>Ready to go beyond assessment? Explore the Menler programs designed to help you<br />build capability, portfolio, and career momentum.</p>
          <div className="cluster-grid" style={{ marginTop: 28 }}>
            <div className="cluster-card cluster-card--kick">
              <p className="cluster-num">For beginners &amp; explorers</p>
              <p className="cluster-name">Menler Gen AI Kickstarter</p>
              <p className="cluster-sets">Learn AI fundamentals, build your first portfolio, and become AI fluent in just 14 days.</p>
              <button className="cluster-btn" onClick={() => go('/kickstarter')}>Explore Kickstarter</button>
            </div>
            <div className="cluster-card cluster-card--gen">
              <p className="cluster-num">College students &amp; professionals</p>
              <p className="cluster-name">Menler Claude AI Generalist Fellowship</p>
              <p className="cluster-sets">Apply AI across business functions. Drive real-world impact through smarter execution.</p>
              <button className="cluster-btn" onClick={() => go('/generalist')}>Explore Fellowship</button>
            </div>
            <div className="cluster-card cluster-card--eng">
              <p className="cluster-num">Engineers &amp; technical builders</p>
              <p className="cluster-name">Menler AI Engineering Fellowship</p>
              <p className="cluster-sets">Build production-grade AI systems, agents, RAG applications, MCP integrations, and AI infrastructure.</p>
              <button className="cluster-btn" onClick={() => go('/engineering')}>Explore Engineering</button>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // ── LANDING ──
  return (
    <>
      <Seo
        title="AI Aptitude Test — Free AI Readiness Assessment | Menler"
        description="Take the free AI Aptitude Test — a 15-question AI readiness assessment. Get a personalised score, learning roadmap and a downloadable question bank. No signup to start."
        keywords="AI aptitude test, AI readiness test, AI test, AI assessment, free AI test, AI generalist mock test, AI engineering mock test, AI workflow aptitude test, AI beginner assessment test, Claude API engineering test, agentic AI engineering test, AI skills assessment, AI career test"
        path="/aptitude"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Quiz', name: 'AI Aptitude Test', about: 'AI readiness assessment', educationalLevel: 'Beginner to Advanced', provider: { '@type': 'Organization', name: 'Menler', sameAs: 'https://menler.in' } }}
      />
      <section className="apt-hero">
        <div className="apt-hero-ring-left" aria-hidden="true" />
        <div className="apt-hero-inner">
          <p className="apt-eyebrow">Free · No signup to start</p>
          <h1 className="apt-h1">Where do you stand<br /><em>on the AI Curve?</em></h1>
          <p className="apt-sub">A 15 question AI Aptitude Test designed to assess your AI readiness<br />and recommend the most relevant learning pathway for your goals.</p>
          <button className="apt-cta-big" onClick={() => { setChosenDomain(null); setDomainOpen(true); }}>Start the test</button>
        </div>
      </section>

      {domainOpen && (
        <div className="apt-modal-overlay" onClick={() => setDomainOpen(false)}>
          <div className="apt-modal" role="dialog" aria-modal="true" aria-labelledby="apt-dm-h" onClick={(e) => e.stopPropagation()}>
            <button className="apt-modal-x" onClick={() => setDomainOpen(false)} aria-label="Close">×</button>
            <h2 className="apt-modal-h" id="apt-dm-h">Choose your domain</h2>
            <p className="apt-modal-sub">Pick the domain you'd like to be tested on.</p>
            <div className="apt-modal-grid">
              {EXAM_DOMAINS.map((d) => {
                const on = chosenDomain?.name === d.name;
                return (
                  <button key={d.name} type="button" className={`apt-dm-card${on ? ' on' : ''}`} onClick={() => setChosenDomain(d)} aria-pressed={on}>
                    <span className="apt-dm-radio" aria-hidden="true" />
                    <span className="apt-dm-text">
                      <span className="apt-dm-name">{d.name}</span>
                      {d.sub && <span className="apt-dm-sub">{d.sub}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            <button className="apt-modal-start" disabled={!chosenDomain} onClick={startChosenDomain}>Start the test →</button>
          </div>
        </div>
      )}

      <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 0 }}>
        <p className="section-label" style={{ textAlign: 'center' }}>The assessment</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>What this test is<br /><em>and why it matters.</em></h2>
        <div className="apt-trust-grid">
          {TRUST_CARDS.map((t, i) => (
            <div key={i} className="apt-trust-card">
              <div className="apt-trust-head">
                <span className="apt-trust-num">{String(i + 1).padStart(2, '0')}</span>
                <p className="apt-trust-title">{t.title}</p>
              </div>
              <p className="apt-trust-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLUSTERS ── */}
      <section className="section" style={{ background: 'var(--parchment)', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label">Choose your cluster</p>
        <h2 className="section-h2">Pick a track.<br /><em>Take a set.</em></h2>
        <p className="section-sub">Every track benchmarks a different AI capability from agentic thinking to engineering workflows.</p>
        <div className="cluster-grid">
          {CLUSTERS.map((c, i) => (
            <div key={c.name} className="cluster-card">
              <span className="cluster-num">{String(i + 1).padStart(2, '0')}</span>
              <p className="cluster-name">{c.name}</p>
              <p className="cluster-sets">{c.sets.length} sets · 15 questions each</p>
              <button className="cluster-btn" onClick={() => dispatch({ type: 'PICK_CLUSTER', cluster: c.name })}>Take test</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUESTION BANK ── */}
      <section className="section" style={{ background: 'white', paddingBottom: 32 }}>
        <p className="section-label">Question bank</p>
        <h2 className="section-h2">AI Interview QB.<br /><em>Questions from real loops.</em></h2>
        <p className="section-sub qb-sub">Asked at top Indian and global companies.<br />Select a topic and get a PDF of the Q&amp;A asked in real interview rounds.</p>
        <div className="qb-filters">
          {QB_BANKS.map(b => (
            <button
              key={b.name}
              className={`qb-filter-pill${qbFilter === b.name ? ' active' : ''}`}
              onClick={() => setQbFilter(b.name)}
              aria-pressed={qbFilter === b.name}
            >
              {b.name}
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          {!qbFormOpen ? (
            <button className="btn-primary" onClick={() => qbBank.pdf && setQbFormOpen(true)} disabled={!qbBank.pdf}>
              {qbBank.pdf ? `Download Question Bank — ${qbBank.name}` : `${qbBank.name} — coming soon`}
            </button>
          ) : (
            <form className="apt-lead" style={{ maxWidth: 540, margin: '0 auto', textAlign: 'left' }} onSubmit={submitQB}>
              <p className="apt-lead-label">Enter your details to download the {qbBank.name} question bank</p>
              <div className="apt-lead-row apt-lead-row--col">
                <input type="text" required placeholder="Your name" value={qbForm.name} onChange={e => setQ('name', e.target.value)} />
                <input type="email" required placeholder="you@email.com" value={qbForm.email} onChange={e => setQ('email', e.target.value)} />
                <input type="tel" required placeholder="Phone number" value={qbForm.phone} onChange={e => setQ('phone', e.target.value)} />
                <button type="submit" disabled={qbBusy}>{qbBusy ? 'Saving…' : 'Download PDF'}</button>
              </div>
              {qbErr && <p className="apt-gate-err">Couldn't submit — please check your connection and try again.</p>}
            </form>
          )}
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(38,33,92,0.12)', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── EXPLORE MENLER PROGRAMS ── */}
      <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Explore Menler Programs</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>Continue your <em>AI journey.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>Ready to go beyond assessment? Explore the Menler programs designed to help you<br />build capability, portfolio, and career momentum.</p>
        <div className="cluster-grid" style={{ marginTop: 28 }}>
          <div className="cluster-card cluster-card--kick">
            <p className="cluster-num">For beginners &amp; explorers</p>
            <p className="cluster-name">Menler Gen AI Kickstarter</p>
            <p className="cluster-sets">Learn AI fundamentals, build your first portfolio, and become AI fluent in just 14 days.</p>
            <button className="cluster-btn" onClick={() => go('/kickstarter')}>Explore Kickstarter</button>
          </div>
          <div className="cluster-card cluster-card--gen">
            <p className="cluster-num">College students &amp; professionals</p>
            <p className="cluster-name">Menler Claude AI Generalist Fellowship</p>
            <p className="cluster-sets">Apply AI across business functions. Drive real-world impact through smarter execution.</p>
            <button className="cluster-btn" onClick={() => go('/generalist')}>Explore Fellowship</button>
          </div>
          <div className="cluster-card cluster-card--eng">
            <p className="cluster-num">Engineers &amp; technical builders</p>
            <p className="cluster-name">Menler AI Engineering Fellowship</p>
            <p className="cluster-sets">Build production-grade AI systems, agents, RAG applications, MCP integrations, and AI infrastructure.</p>
            <button className="cluster-btn" onClick={() => go('/engineering')}>Explore Engineering</button>
          </div>
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
