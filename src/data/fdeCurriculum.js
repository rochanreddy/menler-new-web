// AI FDE Fellowship curriculum, as the Engineering page shows it.
//
// Taken from "Menler AI FDE Fellowship — Programme Curriculum". Six two-week
// case blocks; each week lists the topics of its Saturday (S1) and Sunday (S2)
// sessions. Overview depth on purpose — the full brief, hidden scenarios and
// rubric are for enrolled fellows.

export const FDE_CASES = [
  {
    label: 'Case 1',
    weeks: 'Weeks 1–2 · BFSI',
    title: 'Complaint Triage for a Bank Grievance Cell',
    modules: [
      {
        w: 'Week 1 · Discover, Frame & Model Basics',
        shift: 'Course taker → Problem framer',
        lessons: [
          'FDE operating model and lifecycle',
          'Discovery interviews and process mapping',
          'Use-case qualification: value, feasibility, risk, kill criteria',
          'Success metrics and baselines',
          'LLM mechanics: tokens, context, sampling — and why models hallucinate',
          'Model landscape and selection',
        ],
      },
      {
        w: 'Week 2 · Model Behaviour, Prompting & Context',
        shift: 'Prompt user → Prompt engineer',
        lessons: [
          'System prompts, structured outputs and schema enforcement',
          'Reasoning models and thinking budgets',
          'Context budgeting, prompt caching and batching',
          'Grounding, citations, prompt versioning and regression',
          'Multilingual and Indic model choices',
          'LLM vs classical-baseline benchmark',
        ],
      },
    ],
    projects: [
      'Complaint Triage Engine: classifies, checks and routes complaints in English, Hindi and Hinglish, benchmarked against a classical baseline',
    ],
    tools: ['Claude API', 'Claude Code', 'JSON Schema', 'GitHub'],
  },
  {
    label: 'Case 2',
    weeks: 'Weeks 3–4 · Agriculture',
    title: 'Vetted-Answer Farm Advisory Copilot',
    modules: [
      {
        w: 'Week 3 · Build with Claude Code & Data Foundations',
        shift: 'Prompt engineer → Code director',
        lessons: [
          'Claude Code workflow: CLAUDE.md, plan, implement, test',
          'Extending Claude Code: skills, subagents, hooks, plugins',
          'Full-stack app: UI, API, auth — and reviewing AI-written diffs',
          'Testing: unit, integration, test-first with AI',
          'Schema design, data quality and ingestion',
          'PII classification and DPDP basics',
        ],
      },
      {
        w: 'Week 4 · Knowledge & Retrieval',
        shift: 'Console builder → Retrieval engineer',
        lessons: [
          'Parsing and ingestion: PDF, OCR, tables',
          'Chunking, embeddings and vector stores',
          'Freshness, dedup and conflicting sources',
          'Hybrid search and reranking',
          'Citations, grounded answers and abstaining correctly',
          'Retrieval metrics, agentic RAG and knowledge graphs',
        ],
      },
    ],
    projects: [
      'Cited Farm Advisory Copilot: answers only from vetted documents, cites every claim and says "I don\'t know" when the material is silent',
    ],
    tools: ['Claude Code', 'Postgres', 'pgvector', 'Qdrant', 'Neo4j'],
  },
  {
    label: 'Case 3',
    weeks: 'Weeks 5–6 · SME finance',
    title: 'GST Input-Credit Reconciliation Agent',
    modules: [
      {
        w: 'Week 5 · Agent Architecture & Memory',
        shift: 'Retrieval engineer → Agent designer',
        lessons: [
          'Tool design, schemas and the agent loop',
          'Bounded autonomy and workflow-vs-agent decisions',
          'Human-in-the-loop approvals and failure handling',
          'Building an MCP server, with authorization and tool permissions',
          'Short-term and long-term memory, durable workflows',
          'Computer-use and browser agents for systems without APIs',
        ],
      },
      {
        w: 'Week 6 · Multi-Agent & Enterprise Integration',
        shift: 'Agent designer → Integration engineer',
        lessons: [
          'Multi-agent patterns: router, supervisor, parallel, handoff',
          'Subagents with the Claude Agent SDK, shared state',
          'Channels: WhatsApp and email',
          'REST, webhooks, idempotency, OAuth2 and connectors',
          'Workflow orchestration and queues with n8n',
          'Legacy systems, rate limits, backoff and dead-letter handling',
        ],
      },
    ],
    projects: [
      'Reconciliation Agent behind a public MCP server: matches the purchase register against GSTR-2B, chases suppliers and never makes a credit decision without human approval',
    ],
    tools: ['Claude Agent SDK', 'MCP', 'n8n', 'GitHub'],
  },
  {
    label: 'Case 4',
    weeks: 'Weeks 7–8 · Health insurance',
    title: 'Certify a Health Pre-Authorisation Review Assistant',
    modules: [
      {
        w: 'Week 7 · Evaluation & Quality',
        shift: 'Integration engineer → Evaluator',
        lessons: [
          'Eval design and failure taxonomy',
          'Golden sets with client subject-matter experts',
          'LLM-as-judge: rubric, pairwise, calibration',
          'RAG, agent-trajectory and tool-use evals',
          'Eval statistics: sample size, variance, annotator agreement',
          'CI regression gates and reporting quality to a client',
        ],
      },
      {
        w: 'Week 8 · Safety, Security & Governance',
        shift: 'Evaluator → Risk owner',
        lessons: [
          'Threat modelling with the OWASP LLM Top 10',
          'Prompt injection, direct and indirect',
          'Red-team method and the war room',
          'Guardrails, PII redaction and role-based access',
          'Data residency, retention, DPDP and sector rules',
          'Audit trails, explainability and the security questionnaire',
        ],
      },
    ],
    projects: [
      'Certified Review Assistant: inherit a flawed prototype, evaluate and harden it, then write a go / no-go certification memo',
    ],
    tools: ['promptfoo', 'Braintrust', 'RAGAS', 'Presidio', 'NeMo Guardrails'],
  },
  {
    label: 'Case 5',
    weeks: 'Weeks 9–10 · E-commerce logistics',
    title: 'Recover Failed Deliveries for a D2C Brand',
    modules: [
      {
        w: 'Week 9 · Deploy & Operate',
        shift: 'Risk owner → Operator',
        lessons: [
          'Environments, secrets and config',
          'Docker and CI/CD',
          'Cloud deployment with IAM and networking basics',
          'Release safety: canary, A/B, shadow, rollback',
          'Observability, SLOs, error budgets and alerting',
          'Cost control, incident response and postmortems',
        ],
      },
      {
        w: 'Week 10 · Economics, Delivery & Ownership',
        shift: 'Operator → Owner',
        lessons: [
          'Model selection and routing, unit economics per request',
          'ROI proof and the business case',
          'Fine-tune vs RAG vs prompt decisions, vendor and model risk',
          'SOW, commercials and pricing negotiation',
          'Executive readout, handover and enablement',
          'Legal, IP and licensing awareness',
        ],
      },
    ],
    projects: [
      'Production NDR Recovery System: take an outreach agent from laptop to production and prove its ROI to a CFO panel',
    ],
    tools: ['Docker', 'GitHub Actions', 'OpenTelemetry', 'Phoenix', 'Langfuse'],
  },
  {
    label: 'Case 6',
    weeks: 'Weeks 11–12 · Capstone',
    title: 'Capstone: A Fresh Brief',
    modules: [
      {
        w: 'Week 11 · Capstone — Discover & Design',
        shift: 'Owner → Engagement lead',
        lessons: [
          'Pick a brief: provident-fund claims, court judgments, ONDC grievances — or bring your own client',
          'A 48-hour discovery window with a client role',
          'Problem brief, success measures and an agreed SOW',
          'Architecture with decision records',
          'Threat model, risk register, eval and data plans',
          'A first working slice',
        ],
      },
      {
        w: 'Week 12 · Capstone — Build, Harden & Demo Day',
        shift: 'Engagement lead → AI FDE',
        lessons: [
          'Build against a hidden scenario suite',
          'Run the eval harness and fix the top failures',
          'Security review against the threat model',
          'Deploy with tracing and cost controls',
          'Demo Day: a 15-minute demo and a live defence with a change request',
          'The 12 graduation questions, answered live',
        ],
      },
    ],
    projects: [
      'Capstone Engagement: run the full lifecycle on a fresh brief, from ambiguous problem to a deployed, defended system',
    ],
    tools: ['Claude Code', 'Claude API', 'MCP', 'OpenTelemetry', 'CI'],
  },
];

export const FDE_TRACKS = [
  {
    name: 'Builder track',
    desc: 'You direct Claude Code from starter repositories: write the plan, review every diff, own the tests and defend the outcome. Suited to analysts, consultants and product people.',
  },
  {
    name: 'Engineer track',
    desc: 'You write the core components yourself and take on stretch items: batching, CI regression, retrievers, connectors, webhook receivers, access controls and instrumentation. Suited to working developers.',
  },
];

export const FDE_OUTCOMES = [
  { t: 'A shipped engagement', d: 'Six milestone projects, each defended to a panel, and a capstone taken from ambiguous brief to deployed system.' },
  { t: 'Evidence you can show', d: 'A public MCP server, a go / no-go memo, a pilot postmortem, an ROI model and a written case study.' },
  { t: 'A Scenario Library', d: 'Roughly sixty hidden-scenario tests from the cases, to reuse on your own future builds.' },
  { t: 'A working vocabulary', d: 'Baselines, confidence intervals, SLOs, approvals and handover — spoken to clients and CFOs.' },
  { t: 'Defended judgment', d: 'Answers to twelve hard questions, given live, about a system you designed.' },
  { t: 'A cohort', d: 'Pod-mates, mentors and a network of people who have shipped the same engagements.' },
];
