import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { PROJECTS } from '../data/projectsData';
import { submitLead } from '../services/leadService';

const LIBRARY_CARDS = [
  { num: '01', name: 'Prompt Library', desc: 'Curated, searchable prompts by domain — Generalist tracks, Engineering scenarios, and Kickstarter beginners. Every prompt is versioned and tested on Claude Sonnet 4.6.', tags: ['All programs', '120+ prompts'] },
  { num: '02', name: 'Tool setup guides', desc: 'Step-by-step setup for Claude.ai, Claude Desktop, Claude Cowork, Claude Code, Claude in Excel, and MCP server configuration. Screenshots included.', tags: ['All programs', '22 guides'] },
  { num: '03', name: 'Project build docs', desc: 'Full walkthroughs for 8 Generalist + 5 Engineering + 5 Kickstarter projects. From the same instructors who built the program.', tags: ['Generalist', 'Engineering', 'Kickstarter'] },
  { num: '04', name: 'AI stack map', desc: 'A one-page visual of best-in-class AI tools by category — writing, coding, research, design, audio, agents. Updated quarterly.', tags: ['All programs', 'Q2 2026'] },
  { num: '05', name: 'Templates & cheat sheets', desc: 'Prompt-engineering one-pager, MCP server starter, Claude in Excel templates, AI evals checklist, and more. Free PDFs and GitHub repos.', tags: ['All programs', 'Free PDFs'] },
  { num: '06', name: 'AI glossary', desc: 'Plain-English glossary of 100+ AI terms in the Indian context — no academic jargon, no assumed knowledge. Sorted by difficulty.', tags: ['Beginners', '100+ terms'] },
];

const TEMPLATE_CARDS = [
  { title: 'Prompt-engineering one-pager', type: 'PDF', desc: 'The 8 prompt patterns that cover 90% of use cases. Print it. Pin it.' },
  { title: 'MCP server starter', type: 'GitHub', desc: 'Boilerplate MCP server in TypeScript. Clone, rename, and deploy in 20 minutes.' },
  { title: 'Finance Claude templates', type: 'XLSX', desc: 'Excel workbook with 6 pre-built Claude formulas for finance analysis and commentary.' },
  { title: 'AI evals checklist', type: 'PDF', desc: 'A 12-point checklist for testing any Claude pipeline before production deploy.' },
  { title: 'Cowork project template', type: 'Notion', desc: 'Notion template for running a Cowork research project — structure, prompts, outputs.' },
  { title: 'Prompt pattern flashcards', type: 'PDF', desc: '40 double-sided flashcards covering all major prompting patterns. Print or Anki import.' },
];

export default function Resources() {
  const navigate = useNavigate();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const handleNewsletter = async (e) => {
    e.preventDefault();
    try { await submitLead({ email, source: 'resources-newsletter' }); } catch {}
    setDone(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero hero-centered">
        <div className="hero-ring r1" /><div className="hero-ring r2" />
        <div className="hero-inner">
          <p className="hero-eyebrow">Resources · Free · Updated weekly</p>
          <h1 className="hero-h1">The Menler library.<br /><em>Free. Forever.</em></h1>
          <p className="hero-sub">Every guide, prompt, template, and tool walkthrough is maintained and updated weekly by the same instructors who built the Fellowship. No waitlist. No paywall. Just the best free Claude AI resources in India.</p>
        </div>
      </section>

      {/* ── LIBRARY CARDS ── */}
      <section className="res-preview" style={{ background: 'var(--parchment)' }}>
        <div className="preview-shell">
          <p className="section-label">The Menler library</p>
          <h2 className="section-h2">Six resources.<br /><em>All free.</em></h2>
          <div className="res-grid">
            {LIBRARY_CARDS.map((r, i) => (
              <div key={i} className="res-card">
                <p className="res-num">{r.num}</p>
                <p className="res-name">{r.name}</p>
                <p className="res-desc">{r.desc}</p>
                <div className="res-tags">{r.tags.map((t, j) => <span key={j} className="res-tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT BUILDS ── */}
      <section className="res-preview alt" style={{ background: 'var(--parchment)' }}>
        <div className="preview-shell">
          <p className="section-label">Library 03 · Project builds</p>
          <h2 className="section-h2">Every project.<br /><em>One place.</em></h2>
          <p className="section-sub">The full set of fellow-built projects across domains. Open any one for the build doc, stack, and outcome.</p>
          <div className="proj-grid">
            {PROJECTS.map((p) => (
              <article
                key={p.slug}
                className="proj-card proj-card--clickable"
                role="button"
                tabIndex={0}
                onClick={() => go(`/projects/${p.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(`/projects/${p.slug}`); } }}
              >
                {p.image && <div className="proj-card-img"><img src={p.image} alt={p.title} loading="lazy" /></div>}
                <span className={`proj-domain-tag ${p.tagCls}`}>{p.tag}</span>
                <h3 className="proj-card-title">{p.title}</h3>
                <p className="proj-card-desc">{p.desc}</p>
                <div className="proj-stack">{p.stack.map(s => <span key={s}>{s}</span>)}</div>
                <p className="proj-outcome">{p.outcome}</p>
                <span className="proj-card-link">View preview</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section className="res-preview" style={{ background: 'white' }}>
        <div className="preview-shell">
          <p className="section-label">Library 05 · Templates</p>
          <h2 className="section-h2">Six templates.<br /><em>Copy, fork, ship.</em></h2>
          <div className="proj-grid">
            {TEMPLATE_CARDS.map((t, i) => (
              <div key={i} className="proj-card">
                <span className="proj-track">{t.type}</span>
                <p className="proj-name">{t.title}</p>
                <p className="proj-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="mini-lead">
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>The Resources<br /><em>weekly drop.</em></h3>
            <p>One email a week. A new prompt, a new guide, a new template, and one India AI signal. No filler. Maintained by the Menler instructor team.</p>
          </div>
          {done ? (
            <p style={{ color: 'var(--placed)', fontWeight: 500 }}>✓ You're in. Every Friday morning.</p>
          ) : (
            <form className="mini-lead-form" onSubmit={handleNewsletter}>
              <input type="email" required placeholder="you@domain.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <button type="submit">Subscribe to the weekly drop</button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

const QB_CARDS = [
  {
    co: 'Claude', diff: 'Beginner', topic: 'Prompting',
    q: 'What is the primary difference between a "role" and "context" in a Claude prompt?',
    a: 'Role defines who Claude is pretending to be (persona/expertise), while context provides background information about the situation, user, or task. Both shape the response but in different ways — role affects tone and knowledge framing, context affects relevance and specificity.',
  },
  {
    co: 'Claude API', diff: 'Intermediate', topic: 'Tool Use',
    q: 'When using Claude\'s tool_use feature, what happens if Claude decides a tool isn\'t needed for a query?',
    a: 'Claude will simply respond directly without invoking any tools. The stop_reason in the response will be "end_turn" instead of "tool_use". You should always handle both cases in your code.',
  },
  {
    co: 'Claude', diff: 'Advanced', topic: 'Prompting',
    q: 'Describe the "chain-of-draft" prompting pattern and when it outperforms standard chain-of-thought.',
    a: 'Chain-of-draft asks Claude to produce multiple brief draft answers before committing to a final response. It outperforms standard CoT on tasks requiring creative judgment or where the "correct" framing isn\'t obvious upfront — it prevents Claude from committing too early to one reasoning path.',
  },
  {
    co: 'Claude API', diff: 'Intermediate', topic: 'Context',
    q: 'How does the "cache_control" parameter in the Anthropic API reduce costs for repeated context?',
    a: 'Setting cache_control: {type: "ephemeral"} on a content block tells Anthropic to cache that block\'s tokens for up to 5 minutes. Subsequent requests that include the same cached prefix are charged at a significantly reduced input token rate (roughly 90% discount), making it highly efficient for repeated system prompts or large documents.',
  },
];

const PROMPT_TEMPLATES = [
  {
    title: 'The Analyst Brief Template',
    meta: 'Generalist · Finance & Strategy',
    body: `You are a senior analyst at a top consulting firm. Your writing style is precise, insight-first, and executive-readable.

TASK: Analyse [COMPANY/TOPIC] and produce a brief structured as follows:

SITUATION (2-3 sentences): What is happening right now?
INSIGHT (1-2 sentences): The non-obvious observation.
IMPLICATION (2-3 sentences): What this means for [AUDIENCE].
RECOMMENDATION (1-2 bullets): Specific next actions.

Use only facts I provide. Flag uncertainty explicitly. Avoid hedging language. Max 350 words total.

INPUT DATA:
[paste your data here]`,
  },
  {
    title: 'The Domain Expert Role Lock',
    meta: 'Generalist · All tracks',
    body: `You are [EXPERT ROLE — e.g., "a CA with 15 years of tax advisory experience in India"].

Before responding, think through what a real expert in this role would consider before answering. Prioritise practical, contextually relevant advice over generic frameworks.

When you are uncertain, say so explicitly rather than speculating.

My question: [YOUR QUESTION]`,
  },
];

const RESOURCES = [
  { num: '01', name: 'Prompt Architecture Guide', desc: 'The definitive Menler framework for building Claude prompts that work the first time. Covers role, context, format, constraints, and worked examples.', tags: ['Prompting', 'All levels', 'PDF + interactive'] },
  { num: '02', name: 'Claude API Quickstart', desc: 'Get from zero to your first Claude API call in 30 minutes. Python-focused. Covers auth, messages, streaming, and tool use basics.', tags: ['Claude API', 'Engineering', 'Python'] },
  { num: '03', name: 'Domain Track Playbooks', desc: 'Nine playbooks — one per Generalist track. Each contains 10 vetted prompt patterns, 3 workflow templates, and a 30-day starter project.', tags: ['Generalist', 'All tracks', 'Templates'] },
  { num: '04', name: 'MCP Builder\'s Handbook', desc: 'Step-by-step guide to building your first Model Context Protocol server. Includes schema reference, worked examples, and a sample weather + database MCP server.', tags: ['MCP', 'Engineering', 'Advanced'] },
  { num: '05', name: 'India AI Career Guide', desc: 'Salary benchmarks, role descriptions, and hiring trends for AI-augmented roles in India. Updated quarterly with data from our hiring partner network.', tags: ['Career', 'All levels', 'India'] },
  { num: '06', name: 'Evaluation Framework', desc: 'How to measure whether your Claude system is actually working. Covers human eval, automated evals, and cost-performance tradeoffs.', tags: ['Engineering', 'Advanced', 'Evals'] },
];

