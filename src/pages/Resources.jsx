import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Seo from '../components/common/Seo';
import PlaybookModal from '../components/common/PlaybookModal';
import { PROJECTS, tagClassFor } from '../data/projectsData';
import { submitLead } from '../services/leadService';

const LIBRARY_CARDS = [
  { num: '01', name: 'Prompt Library', desc: '100+ tested prompts across business, engineering, and beginner tracks.', tags: ['All programs', '100+ prompts'], pdf: '/pdfs/Menler_100_Prompts_Playbook.pdf' },
  { num: '02', name: 'AI stack map', desc: 'Visual guide to the best AI tools by category.', tags: ['All programs', 'Upto 2026'], pdf: '/pdfs/Menler_AI_Stack_Map.pdf' },
  { num: '03', name: 'Project connectors docs', desc: '10 hands-on project walkthroughs led by the program instructors.', tags: ['Generalist', 'Engineering', 'Kickstarter'], tagsNowrap: true, pdf: '/pdfs/Menler_Connector_Projects.pdf' },
  { num: '04', name: 'AI glossary', desc: '100+ AI terms explained in simple, beginner-friendly language.', tags: ['Beginners', '100+ terms'], pdf: '/pdfs/Menler_AI_Glossary_AtoZ.pdf' },
];

const TEMPLATE_CARDS = [
  { title: 'Prompt-engineering one-pager', type: 'PDF', desc: 'The 8 prompt patterns that cover 90% of use cases. Print it. Pin it.' },
  { title: 'MCP server starter', type: 'GitHub', desc: 'Boilerplate MCP server in TypeScript. Clone, rename, and deploy in 20 minutes.' },
  { title: 'Finance Claude templates', type: 'XLSX', desc: 'Excel workbook with 6 pre-built Claude formulas for finance analysis and commentary.' },
  { title: 'AI evals checklist', type: 'PDF', desc: 'A 12-point checklist for testing any Claude pipeline before production deploy.' },
  { title: 'Cowork project template', type: 'Notion', desc: 'Notion template for running a Cowork research project — structure, prompts, outputs.' },
  { title: 'Prompt pattern flashcards', type: 'PDF', desc: '40 double-sided flashcards covering all major prompting patterns. Print or Anki import.' },
];

const PLAYBOOK = [
  { logo: '/logos/claude_code-removebg-preview.png', thumb: 'Ship faster with Claude', badge: 'Claude Code', cat: 'Engineering', title: 'Claude Code Playbook', desc: 'Build, refactor, and ship real code with Claude in your terminal and editor.', pdf: '/pdfs/Menler_Claude_Code_Playbook.pdf' },
  { logo: '/logos/claude.svg', thumb: 'Your Claude Chat OS', badge: 'Claude Chat', cat: 'Generalist', title: 'Claude Chat Playbook', desc: 'Everyday prompting — research, writing, analysis, and fast answers.', pdf: '/pdfs/Menler_Claude_Chat_Playbook.pdf' },
  { logo: '/logos/claude_cowork.png', thumb: 'Multi-Step AI Workflows', badge: 'Claude Cowork', cat: 'Workflows', title: 'Claude Cowork Playbook', desc: 'Multi-document, multi-step work that turns raw inputs into finished deliverables.', pdf: '/pdfs/Menler_Claude_Cowork_Playbook.pdf' },
  { logo: '/logos/claude_design.png', thumb: 'Design Faster with Claude', badge: 'Claude Design', cat: 'Design', title: 'Claude Design Playbook', desc: 'Generate visuals, mockups, and on-brand design assets with Claude.', pdf: '/pdfs/Menler_Claude_Design_Playbook.pdf' },
  { logo: '/logos/claude.svg', ms: '/logos/microsoft.png', thumb: 'Microsoft 365 Workflows', badge: 'Claude MS', cat: 'Microsoft 365', title: 'Claude in MS', desc: 'Use Claude across Microsoft 365 — Word, Excel, PowerPoint, and Teams.', pdf: '/pdfs/Menler_Claude_Microsoft_Playbook.pdf' },
];

// Group every project's tag class into a small set of filterable domains for
// the Project builds filter. Keeps near-duplicate tag labels under one chip.
const PROJECT_DOMAIN_MAP = {
  't-eng': 'engineering',
  't-tech': 'engineering',
  't-analyst': 'analytics',
  't-ops': 'founders office', // default fallback for t-ops
  't-marketing': 'marketing and sales',
  't-finance': 'marketing and sales',
  't-pm': 'product',
  't-pjm': 'product',
  't-founder': 'founders office',
  't-vc': 'finance operation',
};

const PROJECT_FILTERS = [
  'All',
  'analytics',
  'engineering',
  'finance operation',
  'founders office',
  'human resource',
  'marketing and sales',
  'product'
];

// A project's filter domain: explicit overrides win, else mapped by tag class.
const projectDomain = (p) => {
  const tag = (p.tag || '').toLowerCase();
  const domain = (p.domain || '').toLowerCase();

  if (domain.includes('hr') || tag.includes('hr') || tag.includes('human')) {
    return 'human resource';
  }
  if (domain.includes('finance') || tag.includes('finance') || tag.includes('venture') || tag.includes('vc')) {
    return 'finance operation';
  }
  return PROJECT_DOMAIN_MAP[p.tagCls] || 'founders office';
};

export default function Resources() {
  const navigate = useNavigate();
  const location = useLocation();
  const go = (path) => { navigate(path); window.scrollTo(0, 0); };

  // When arriving with #project-builds (e.g. Home's "Explore more"), scroll to
  // that section. The slight delay lets App's ScrollToTop finish jumping to top
  // first, so we land on the section rather than getting yanked back up.
  useEffect(() => {
    if (location.hash !== '#project-builds') return;
    const el = document.getElementById('project-builds');
    if (!el) return;
    const t = setTimeout(() => {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -70 });
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 140);
    return () => clearTimeout(t);
  }, [location.hash, location.pathname]);
  const [pbItem, setPbItem] = useState(null);
  const [projFilter, setProjFilter] = useState('All');
  // Mobile-only: collapse the project grid to the first few cards until "See more".
  const [projExpanded, setProjExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const visibleProjects = projFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => projectDomain(p) === projFilter);
  const handleNewsletter = async (e) => {
    e.preventDefault();
    try { await submitLead({ email, source: 'resources-newsletter' }); } catch {}
    setDone(true);
  };

  return (
    <>
      <Seo
        title="AI Learning Resources — Prompts, Templates & Guides | Menler"
        description="Free AI learning resources: a Claude prompt library, AI stack map, templates, cheat sheets and an AI glossary. The knowledge layer for the AI-native workforce."
        keywords="AI learning resources, free AI resources, AI question bank, AI prompts library, Claude prompts, AI project ideas, AI capstone projects, AI tool setup guide, AI tools ecosystem, AI stack map, AI cheat sheets, AI templates, AI glossary, AI terms explained , Agentic AI explained, agentic AI workflows , AI careers India, AI jobs future , Enterprise AI transformation, enterprise AI use cases , AI workflows, AI automation workflows , AI upskilling India, AI skills training , AI-native work, AI-native workforce , Large language models explained, LLM tools , Best AI tools, AI productivity tools , AI transformation strategy, AI adoption"
        path="/resources"
      />
      {/* ── HERO ── */}
      <section className="hero hero-centered" style={{ paddingTop: 56 }}>
        <div className="hero-ring r1" /><div className="hero-ring r2" /><div className="hero-ring rl1" />
        <div className="hero-inner">
          <h1 className="hero-h1">The Menler library.<br /><em>Free. Forever.</em></h1>
          <p className="hero-sub" style={{ maxWidth: 'none' }}>The knowledge layer for the AI-native workforce.<br />Guides, prompts, templates, and frameworks designed for real-world execution.</p>
        </div>
      </section>
      {/* ── CLAUDE PLAYBOOK ── */}
      <section className="res-preview" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
        <div className="preview-shell">
          <p className="section-label">Claude Playbook</p>
          <h2 className="section-h2">Master every<br /><em>Claude surface.</em></h2>
          <div className="playbook-grid">
            {PLAYBOOK.map((p, i) => (
              <div key={i} className="pb-card" role="button" tabIndex={0} onClick={() => setPbItem(p)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPbItem(p); } }}>
                <div className="pb-thumb">
                  <span className="pb-badge">{p.badge}</span>
                  <h3 className="pb-thumb-title">{p.thumb}</h3>
                </div>
                <div className="pb-logos">
                  <img className="pb-logo" src={p.logo} alt="" aria-hidden="true" />
                  {p.ms && <img className="pb-logo" src={p.ms} alt="" aria-hidden="true" />}
                </div>
                <div className="pb-body">
                  <span className="pb-cat">{p.cat}</span>
                  <p className="pb-title">{p.title}</p>
                  <p className="pb-sub">{p.desc}</p>
                  <button className="pb-btn" onClick={(e) => { e.stopPropagation(); setPbItem(p); }}>Access Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── LIBRARY CARDS ── */}
      <section className="res-preview" style={{ background: 'var(--parchment)', paddingBottom: 32 }}>
        <div className="preview-shell">
          <p className="section-label">The Menler library</p>
          <h2 className="section-h2">Knowledge Layer.<br /><em>Learn free</em></h2>
          <div className="res-grid res-grid--4">
            {LIBRARY_CARDS.map((r, i) => {
              const open = () => setPbItem({ badge: 'Free resource', title: r.name, desc: r.desc, pdf: r.pdf });
              return (
                <div key={i} className="res-card" role="button" tabIndex={0} onClick={open}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}>
                  <p className="res-num">{r.num}</p>
                  <p className="res-name">{r.name}</p>
                  <p className="res-desc">{r.desc}</p>
                  <div className={`res-tags${r.tagsNowrap ? ' res-tags--nowrap' : ''}`}>{r.tags.map((t, j) => <span key={j} className="res-tag">{t}</span>)}</div>
                  <button className="res-btn" onClick={(e) => { e.stopPropagation(); open(); }}>Access Now</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ── PROJECT BUILDS ── */}
      <section id="project-builds" className="res-preview alt" style={{ background: 'white' }}>
        <div className="preview-shell">
          <p className="section-label">Project builds</p>
          <h2 className="section-h2">Every project.<br /><em>One place.</em></h2>
          <p className="section-sub" style={{ maxWidth: 'none' }}>The full set of fellow-built projects across domains. Open any one for the build doc, stack, and outcome.</p>
          <div className="proj-filters" role="group" aria-label="Filter projects by domain">
            {PROJECT_FILTERS.map((f) => (
              <button
                key={f}
                className={`proj-filter${projFilter === f ? ' on' : ''}`}
                onClick={() => { setProjFilter(f); setProjExpanded(false); }}
                aria-pressed={projFilter === f}
              >
                {f === 'All' ? 'All' : f.split(' ').map(w => w === 'and' ? 'and' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
          <div className={`proj-grid proj-grid--4 proj-grid--library${projExpanded ? '' : ' proj-grid--collapsed'}`}>
            {visibleProjects.map((p) => (
              <article
                key={p.slug}
                className="proj-card proj-card--clickable proj-card--library"
                role="button"
                tabIndex={0}
                onClick={() => go(`/projects/${p.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(`/projects/${p.slug}`); } }}
              >
                {p.image && <div className="proj-card-img"><img src={p.image} alt={p.title} loading="lazy" /></div>}
                <span className={`proj-domain-tag ${tagClassFor(p)}`}>{p.tag}</span>
                <h3 className="proj-card-title">{p.title}</h3>
                <div className="proj-stack">{p.stack.map(s => <span key={s}>{s}</span>)}</div>
                <p className="proj-outcome">{p.outcome}</p>
                <span className="proj-card-link">View preview</span>
              </article>
            ))}
          </div>
          {!projExpanded && visibleProjects.length > 4 && (
            <button className="proj-see-more" onClick={() => setProjExpanded(true)}>
              See more projects
            </button>
          )}
        </div>
      </section>

      {/* ── TEMPLATES ── */}

      {/* ── NEWSLETTER ── */}
      <section className="mini-lead">
        <div className="mini-lead-inner">
          <div className="mini-lead-copy">
            <h3>The Resources<br /><em>weekly drop.</em></h3>
            <p>One email a week. A new prompt, a new guide, a new template, and one India AI signal. No filler.</p>
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

      {/* ── EXPLORE MENLER PROGRAMS ── */}
      <section className="section" style={{ background: 'white', paddingTop: 48, paddingBottom: 32 }}>
        <p className="section-label" style={{ textAlign: 'center' }}>Explore Menler Programs</p>
        <h2 className="section-h2" style={{ textAlign: 'center' }}>Continue your <em>AI journey.</em></h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>Ready to go beyond assessment? Explore the Menler programs designed to help you<br />build capability, portfolio, and career momentum.</p>
        <div className="cluster-grid" style={{ marginTop: 28 }}>
          <div className="cluster-card cluster-card--kick">
            <p className="cluster-num">For beginners &amp; explorers</p>
            <p className="cluster-name">Menler AI Kickstarter</p>
            <p className="cluster-sets">Learn AI fundamentals, build your first portfolio, and become AI fluent in just 14 days.</p>
            <button className="cluster-btn" onClick={() => go('/kickstarter')}>Explore Kickstarter</button>
          </div>
          <div className="cluster-card cluster-card--gen">
            <p className="cluster-num">College students &amp; professionals</p>
            <p className="cluster-name">Menler AI Generalist Fellowship</p>
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

      <PlaybookModal item={pbItem} onClose={() => setPbItem(null)} />

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

