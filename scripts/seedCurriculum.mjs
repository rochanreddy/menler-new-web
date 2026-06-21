/**
 * Seeds the curriculum into Sanity for the Generalist + Kickstarter pages.
 * Uses patch().setIfMissing(...) so it ONLY fills empty fields — re-running
 * never overwrites edits the client has made in Studio.
 *
 * Run: node scripts/seedCurriculum.mjs   (needs VITE_SANITY_PROJECT_ID + SANITY_WRITE_TOKEN in .env)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// --- load .env (simple parser; avoids adding a dependency) ---
try {
  const env = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env */ }

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
  console.error('Missing VITE_SANITY_PROJECT_ID and/or SANITY_WRITE_TOKEN. Set them in .env.');
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false });

// Recursively add a stable _key to every object inside arrays (Sanity needs it).
let kc = 0;
const keyed = (v) => {
  if (Array.isArray(v)) return v.map(keyed);
  if (v && typeof v === 'object') {
    const out = { _key: `k${kc++}` };
    for (const [k, val] of Object.entries(v)) out[k] = keyed(val);
    return out;
  }
  return v;
};

// ─── Kickstarter: 14-day timeline ───
const DAYS = [
  { num: '01', topic: 'The AI Landscape', tool: 'Claude, ChatGPT, Gemini', cap: false },
  { num: '02', topic: 'Claude OS', tool: 'Chat, Cowork, Code', cap: false },
  { num: '03', topic: 'Prompting Fundamentals', tool: 'Prompts', cap: false },
  { num: '04', topic: 'AI Workflow Thinking', tool: 'Claude,Workflow ', cap: false },
  { num: '05', topic: 'Claude Skills', tool: 'Skills', cap: false },
  { num: '06', topic: 'Claude Connectors', tool: 'Connectors & Mcps', cap: false },
  { num: '07', topic: 'Claude Projects', tool: 'Notion AI', cap: false },
  { num: '08', topic: 'Research Intelligence', tool: 'Claude, Perplexity, NotebookLM', cap: false },
  { num: '09', topic: 'AI Creatives', tool: 'Gemini Imagen', cap: false },
  { num: '10', topic: 'Claude Schedules & Routines', tool: 'Cowork,Schedule,Routines', cap: false },
  { num: '11', topic: 'Claude for Data', tool: 'Articrafts, Excel, Doc', cap: false },
  { num: '12', topic: 'External Automation', tool: 'n8n , zapier', cap: false },
  { num: '13', topic: 'Vibe Coding', tool: 'Lovable, Emergent', cap: false },
  { num: '14', topic: 'Capstone Build Sprint', tool: 'Live audience', cap: true },
];

// ─── Kickstarter: course modules ───
const MODULES = [
  { label: 'Module 1', title: 'AI Foundations + Claude OS',
    lessons: ['The AI Landscape : What You Actually Need to Know', 'Claude OS : Three Interfaces, Three Use Cases', 'Prompting Fundamentals : The CLEAR Framwork', 'AI Workflow Thinking  From Task to System'],
    tools: ['Claude', 'ChatGPT', 'Gemini', 'Perplexity'],
    project: 'Personal AI Operating System' },
  { label: 'Module 2', title: 'Claude Power Layers',
    lessons: ['Claude Skills : Teaching Claude to Behave Differently', 'Claude Connectors Claude Inside Your Existing Tools', 'Claude Projects Building a Persistent Intelligence System', 'Research Intelligence Claude + Perplexity + NotebookLM', 'AI Creatives Image, Audio & Video Generation'],
    tools: ['Canva AI', 'Gemini', 'ElevenLabs', 'NotebookLM', 'Runway', 'Claude Skills', 'Claude Routines'],
    project: 'Study planner agent & Content engine' },
  { label: 'Module 3', title: 'Automation Systems',
    lessons: ['Claude Schedules : Time-Triggered Intelligence', 'Claude Routines On Demand Repeatable Workflows', 'Claude for Data Upload, Interrogate, Act', 'External Automation Zapier, n8n & When to Leave Claude'],
    tools: ['n8n', 'Zapier', 'Claude', 'Notion'],
    project: 'Automation Suite' },
  { label: 'Module 4', title: 'Vibe coding & Demo day',
    lessons: ['Vibe Coding : Build Real Things Without Writing Code', 'Capstone Build Sprint Ship in 20 Minutes', 'Demo Day Present, Critique, Level Up', 'AI-Native Career Positioning'],
    tools: ['Claude', 'Emergent', 'Lovable'],
    project: 'AI-Powered Capstone Project' },
];

// ─── Generalist: full curriculum (phases → weeks/domains) ───
const CURRICULUM = [
  {
    label: 'Phase 1', weeks: 'Weeks 1–3', title: 'AI Foundations & Claude Mastery',
    modules: [
      { w: 'Week 1 — Understand AI: See the Landscape Clearly', lessons: ['How LLMs work: next token prediction, tokens, parameters, RLHF', 'Key terms: context windows, embeddings, temperature, fine tuning', 'Live 3-way comparison: Claude vs ChatGPT vs Gemini', 'The 6 Gen AI categories text, image, video, audio, code, agents', 'Tool landscape & why Claude leads for generalists'] },
      { w: 'Week 2 — Talk with AI: Claude Mastery', lessons: ['Claude Projects, Skills, Connectors, MCPs & APIs', 'System prompt architecture & best practices', 'Claude Chat vs Cowork vs Code live comparison', 'Schedules, Plugins & Routines', 'Claude for PowerPoint, Word & Excel; Notion as external memory'] },
      { w: 'Week 3 — Think + Create with AI: Prompt Engineering & Creative Studio', lessons: ['16 prompt frameworks (Zero/Few-shot, CoT, ToT, RAG, chaining…)', 'Claude Skills as prompt libraries; Routines for chained sequences', 'How diffusion models work; image prompt architecture', 'AI video, voice (STT/TTS/cloning) & 3D with Claude'] },
    ],
    tools: ['Claude', 'ChatGPT', 'Gemini', 'Perplexity', 'NotebookLM', 'Canva AI', 'ElevenLabs', 'Runway', 'Gamma'],
    projects: ['Project 1 : My Claude OS (configured workspace)', 'Project 2 : AI Media Kit (images, video, audio, deck)'],
  },
  {
    label: 'Phase 2', weeks: 'Weeks 4–6', title: 'Automate, Build & Ship',
    modules: [
      { w: 'Week 4 — Automate with AI: Voice Agents, Routines & Workflows', lessons: ['STT/TTS from scratch; voice cloning', 'Voice-agent deployment (VAPI, Bland, Retell)', 'Claude Routines + MCPs; the agent loop', 'N8N architecture; Claude as the intelligence node; Make & Zapier'] },
      { w: 'Week 5 — Build with AI: Vibecoding & Agentic App Development', lessons: ['How code generation differs from text', 'Vibecoding: describe → generate → test → iterate → ship', 'Claude Code, Cursor, Lovable, Bolt.new & Replit', 'Agentic apps: Claude API + MCP tool calls; capstone scoping'] },
      { w: 'Week 6 — AI Native: Ship It — Demo Day', lessons: ['Capstone build sprint on the full Claude stack', 'Product polish: UX, error handling, MCP reliability', 'Gamma deck + presentation coaching', 'Demo Day & AI Generalist certification'] },
    ],
    tools: ['Claude Code', 'Cursor', 'Lovable', 'Replit', 'Emergent', 'N8N', 'Make', 'Zapier', 'ElevenLabs', 'GitHub', 'Gamma'],
    projects: ['Project 3 : My Automated AI System (voice + automation)', 'Project 4 : Ship It capstone (live app or agent)'],
  },
  {
    label: 'Phase 3', weeks: 'Weeks 7–10', title: 'Domain Specialisation, Capstone & Placement',
    domains: [
      { name: 'Analyst',
        weeks: [
          { w: 'Week 1 — Business Diagnostics', lessons: ['BA lifecycle: problem definition → recommendation', 'KPI design vs KPI reporting', 'Problem framing: 5 Whys, issue tree, MECE', 'The so-what test on every insight'] },
          { w: 'Week 2 — Analytics & Reporting', lessons: ['Dashboards that drive decisions', 'Metric hierarchy: leading vs lagging', 'Data storytelling: SCQA in under 60 seconds', 'Cohort, funnel & segmentation analysis'] },
          { w: 'Week 3 — Automate the Analytics Layer', lessons: ['Operational analytics in Indian qcom', 'Report vs decision system', 'SQL for analysts how Claude changes access', 'Data quality in Indian businesses'] },
          { w: 'Week 4 — Ship the BI OS', lessons: ['AI leverage vs confident wrong answers', 'Verifying hallucinated metrics & benchmarks', 'BI OS architecture the four layers', 'BI OS as a career asset'] },
        ],
        tools: ['Claude', 'Perplexity', 'Google Sheets AI', 'Looker Studio', 'Gamma', 'N8N', 'SQL', 'Notion', 'Slack'],
        projects: ['BI OS diagnosis + analytics + automation, deployed', 'Looker Studio dashboard + board narrative'] },
      { name: 'Finance Operations',
        weeks: [
          { w: 'Week 1 — Financial Analysis & Modelling', lessons: ['Unit economics in consumer & fintech', 'The model a CFO reads in 90 seconds', 'Chain-of-thought for statement analysis', 'Scenario analysis: base / bull / bear'] },
          { w: 'Week 2 — FP&A & Business Partnering', lessons: ['The three real FP&A mandates', 'Budget vs forecast vs reforecast', 'Variance decomposition: volume, rate & mix', 'Driver-based vs line-item modelling'] },
          { w: 'Week 3 — Risk, Fraud & Compliance', lessons: ['Credit risk fundamentals: SMA-0/1/2 & NPA', 'RBI regulatory reporting calendar', 'Financial fraud types & AML / KYC under PMLA', 'Where AI adds genuine leverage in BFSI risk'] },
          { w: 'Week 4 — Ship the Finance OS', lessons: ['What an AI-native finance function looks like', 'The RBI FREE-AI framework (2025)', 'Model risk governance in Indian BFSI', 'Finance OS as an intelligence layer on ERP'] },
        ],
        tools: ['Claude', 'Google Sheets AI', 'Gamma', 'Notion', 'N8N', 'Airtable', 'Excel', 'Slack', 'Replit'],
        projects: ['Finance OS analysis + FP&A + risk & compliance', 'Automated credit-risk & CFO reporting pipeline'] },
      { name: "Founder's Office",
        weeks: [
          { w: 'Week 1 — Strategic Intelligence', lessons: ['CoS / EIR / FO roles vs the job title', 'The three operating modes of a founder', 'Founder psychology & how trust decisions are made', 'AI-native strategic intelligence a founder would use'] },
          { w: 'Week 2 — Founder Communication', lessons: ['Anatomy of an investor update founders actually send', 'Pitch narrative vs pitch deck', 'Stakeholder communication maps', 'Writing for a founder who edits in 90 seconds'] },
          { w: 'Week 3 — Operations Layer', lessons: ['GTM coordination from the FO seat', 'Startup metrics that matter (ARR, NDR, CAC:LTV, burn)', 'Dashboards that trigger decisions, not just report', 'Notion as the operational source of truth'] },
          { w: "Week 4 — Ship the Founder's OS", lessons: ['AI operator vs AI user', 'Agentic workflow architecture', 'Voice-briefing systems for the founder', 'Presenting a systems handover to a founder'] },
        ],
        tools: ['Claude', 'Perplexity', 'NotebookLM', 'Gamma', 'Notion', 'N8N', 'ElevenLabs', 'Slack', 'Replit'],
        projects: ["Founder's OS research + comms + ops, integrated", 'Live voice-briefing system on a real startup'] },
      { name: 'Human Resource',
        weeks: [
          { w: 'Week 1 — Talent Acquisition System', lessons: ['How TA differs across startup, enterprise & GCC', 'JD design that attracts vs repels', 'The iceberg model of competency', 'The ATS problem & offer management'] },
          { w: 'Week 2 — HRBP Execution & PMS', lessons: ['What HRBPs actually own', 'Attrition diagnosis: TTM, push vs pull factors', 'Designing a PMS from scratch', 'OKR vs KRA vs BSC vs MBO'] },
          { w: 'Week 3 — Payroll, Analytics & L&D', lessons: ['Indian payroll complexity: PF, ESI, TDS, PT', 'The statutory compliance calendar', 'HR analytics as a decision layer', 'L&D ROI & content design that sticks'] },
          { w: 'Week 4 — Ship the HR OS', lessons: ['What an AI-native HR function looks like', 'The HR data fragmentation problem', 'AI in hiring — legal exposure (DPDP, Equal Remuneration)', 'Employee relations & grievance management'] },
        ],
        tools: ['Claude', 'Notion', 'Keka', 'Darwinbox', 'N8N', 'Gamma', 'Airtable', 'Slack', 'Gmail'],
        projects: ['HR OS TA + HRBP + payroll + L&D, deployed', 'Automated hiring + offer + compliance command centre'] },
      { name: 'Marketing',
        weeks: [
          { w: 'Week 1 — AI-native GTM Strategy', lessons: ['Marketing strategy vs marketing activity', 'Customer journey — trust is the conversion problem', 'Positioning without the biggest budget', 'GTM motion: product-, sales- or marketing-led'] },
          { w: 'Week 2 — Brand & Content System', lessons: ['Content strategy vs content calendar', 'Storytelling architecture (spine, POV, arc)', 'Platform logic: Instagram, LinkedIn, YouTube, WhatsApp', 'Reach content vs trust content'] },
          { w: 'Week 3 — Growth & Sales', lessons: ['Paid acquisition: ROAS vs CAC vs LTV vs payback', 'CRM thinking (HubSpot vs Zoho)', 'Retention stack: email + WhatsApp + push', 'AI lead qualification & outreach at volume'] },
          { w: 'Week 4 — Ship the Marketing & Sales OS', lessons: ['Where AI creates leverage vs destroys brand', 'Campaign operations as a repeatable system', 'Brand-voice integrity at scale', 'Presenting an AI marketing system to a CMO'] },
        ],
        tools: ['Claude', 'Gamma', 'Canva AI', 'Midjourney', 'HubSpot', 'Meta Ads', 'GA4', 'WhatsApp Business', 'N8N', 'Runway'],
        projects: ['Marketing OS GTM + content + growth, integrated', 'Brand audio + video ad with live CRM pipeline'] },
      { name: 'Product Management',
        weeks: [
          { w: 'Week 1 — Discovery & Problem Framing', lessons: ['What PMs actually do vs the JD', 'JTBD vs feature requests vs user complaints', 'AI-native discovery & user synthesis', "Framing a problem statement that doesn't get ignored"] },
          { w: 'Week 2 — PRDs, Backlogs & Roadmaps', lessons: ['What makes a PRD shippable', 'RICE, ICE, MoSCoW — when each breaks down', 'Roadmaps that survive stakeholder review', 'Saying no with data, not opinion'] },
          { w: 'Week 3 — Product Decisions with Data', lessons: ['North Star vs vanity metrics', 'Funnel thinking (AARRR) as a diagnostic', 'Experiment design without a data team', 'A metrics narrative a CFO reads in 60 seconds'] },
          { w: 'Week 4 — Ship an AI-native Feature', lessons: ["What's different about AI-native products", 'AI UX patterns: graceful degradation, confirmation', 'Writing specs engineering will respect', 'Pitching an AI feature to a founder or investor'] },
        ],
        tools: ['Claude', 'Jira', 'Notion', 'Figma', 'Gamma', 'GA4', 'Mixpanel', 'Lovable', 'Replit'],
        projects: ['PM Case File discovery → PRD → analytics', 'Shipped AI-native prototype + spec + pitch deck'] },
    ],
  },
];

async function run() {
  console.log(`Seeding curriculum into ${projectId} / ${dataset} ...`);

  await client.createIfNotExists({ _id: 'kickstarterPage', _type: 'kickstarterPage' });
  await client.createIfNotExists({ _id: 'generalistPage', _type: 'generalistPage' });

  await client.patch('kickstarterPage')
    .setIfMissing({ days: keyed(DAYS), modules: keyed(MODULES) })
    .commit();
  console.log('  ✓ Kickstarter: days + modules');

  await client.patch('generalistPage')
    .setIfMissing({ curriculum: keyed(CURRICULUM) })
    .commit();
  console.log('  ✓ Generalist: curriculum (phases + domains)');

  // The Studio edits the DRAFT when one exists. If a draft is present (from prior
  // edits) it won't have the new fields, so mirror them in — only if the draft
  // already exists (never create one, or it would shadow the published doc).
  const ksDraft = await client.getDocument('drafts.kickstarterPage');
  if (ksDraft) {
    await client.patch('drafts.kickstarterPage').setIfMissing({ days: keyed(DAYS), modules: keyed(MODULES) }).commit();
    console.log('  ✓ Kickstarter draft: days + modules');
  }
  const genDraft = await client.getDocument('drafts.generalistPage');
  if (genDraft) {
    await client.patch('drafts.generalistPage').setIfMissing({ curriculum: keyed(CURRICULUM) }).commit();
    console.log('  ✓ Generalist draft: curriculum');
  }

  console.log('Done. Refresh the Studio → Kickstarter / Generalist pages.');
}

run().catch((e) => { console.error(e); process.exit(1); });
