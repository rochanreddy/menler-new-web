// AI FDE Fellowship curriculum, as the Engineering page shows it.
//
// Taken from "Menler AI FDE Fellowship — Programme Curriculum", the PDF the
// page hands out (public/pdfs/Menler_AI_FDE_Fellowship_Curriculum.pdf). Same
// shape as the Generalist curriculum: one row per two-week case, each week's
// lessons are the ten competencies of its Saturday (S1) and Sunday (S2)
// sessions, then the case's project and defence. When the PDF changes, change
// this file with it.

export const FDE_CASES = [
  {
    label: 'Case 1',
    weeks: 'Weeks 1–2 · BFSI',
    title: 'Complaint Triage for a Bank Grievance Cell',
    modules: [
      {
        w: 'Week 1 — Discover, Frame & Model Basics',
        lessons: [
          'FDE operating model and lifecycle',
          'Discovery interviews and process mapping',
          'Use-case qualification (value, feasibility, risk, kill criteria)',
          'AI vs ML vs rules',
          'Success metrics and baselines',
          'LLM mechanics (tokens, context, sampling)',
          'How models are trained and why they hallucinate',
          'Model landscape and selection',
          'Stakeholder mapping and contradictory asks',
          'Claude as research and synthesis partner',
        ],
      },
      {
        w: 'Week 2 — Model Behaviour, Prompting & Context',
        lessons: [
          'System prompts and persona design',
          'Structured outputs and schema enforcement',
          'Reasoning models and thinking budgets',
          'Reasoning patterns (CoT, ReAct, Reflexion)',
          'Context budgeting and compaction',
          'Prompt caching and batching',
          'Grounding and citations',
          'Prompt versioning and regression',
          'Multilingual and Indic model choices',
          'LLM vs classical-baseline benchmark',
        ],
      },
    ],
    tools: ['Claude', 'Claude API', 'Claude Code', 'JSON Schema', 'GitHub'],
    projects: [
      'Project 1 : Complaint Triage Engine (classifies, checks and routes complaints in English, Hindi and Hinglish, benchmarked against a classical baseline)',
      'Case Defence 1 : why this pilot first, why this model over the baseline, what you would measure in week one live',
    ],
  },
  {
    label: 'Case 2',
    weeks: 'Weeks 3–4 · Agriculture',
    title: 'Vetted-Answer Farm Advisory Copilot',
    modules: [
      {
        w: 'Week 3 — Build with Claude Code & Data Foundations',
        lessons: [
          'Claude Code workflow (CLAUDE.md, plan, implement, test)',
          'Extending Claude Code (skills, subagents, hooks, plugins)',
          'Full-stack app (UI, API, auth)',
          'Git and diff review of AI-written code',
          'Testing (unit, integration, test-first with AI)',
          'SQL, schema design, data modelling',
          'Data quality and ingestion',
          'PII classification and DPDP basics',
          'AI UX (confidence, fallbacks, feedback)',
          'PRD-lite and SOW-lite',
        ],
      },
      {
        w: 'Week 4 — Knowledge & Retrieval',
        lessons: [
          'Parsing and ingestion (PDF, OCR, tables)',
          'Chunking',
          'Embeddings and model choice',
          'Vector stores and ANN',
          'Freshness, dedup and conflicting sources',
          'Hybrid search and reranking',
          'Citations and grounded answers',
          'Retrieval metrics and failure analysis',
          'Query rewriting and agentic RAG',
          'Knowledge graphs',
        ],
      },
    ],
    tools: ['Claude Code', 'Postgres', 'pgvector', 'Qdrant', 'Neo4j', 'GitHub'],
    projects: [
      'Project 2 : Cited Farm Advisory Copilot (answers only from vetted documents, cites every claim and says "I don’t know" when the material is silent)',
      'Case Defence 2 : why your chunking and embedding choices, with one retrieval failure and your fix',
    ],
  },
  {
    label: 'Case 3',
    weeks: 'Weeks 5–6 · SME finance',
    title: 'GST Input-Credit Reconciliation Agent',
    modules: [
      {
        w: 'Week 5 — Agent Architecture & Memory',
        lessons: [
          'Tool design and schemas',
          'Agent loop and bounded autonomy',
          'Workflow vs agent decision',
          'Human-in-the-loop approvals',
          'Failure handling',
          'Building an MCP server (2026-07-28 stateless spec)',
          'MCP authorization and tool permissions',
          'Short-term and long-term memory',
          'Durable workflows',
          'Computer-use and browser agents for systems without APIs',
        ],
      },
      {
        w: 'Week 6 — Multi-Agent & Enterprise Integration',
        lessons: [
          'Multi-agent patterns (router, supervisor, parallel, handoff)',
          'Subagents and the Claude Agent SDK',
          'Shared state and communication',
          'Channels (WhatsApp, email)',
          'Integration testing with sandboxes',
          'REST/GraphQL, webhooks, idempotency',
          'OAuth2 and connectors',
          'Workflow orchestration and queues (n8n)',
          'Legacy systems (SOAP/XML, SQL Server)',
          'Rate limits, backoff, dead-letter handling',
        ],
      },
    ],
    tools: ['Claude Agent SDK', 'MCP', 'n8n', 'Claude Code', 'WhatsApp', 'GitHub'],
    projects: [
      'Project 3 : Reconciliation Agent and Public MCP Server (reconciles the purchase register against GSTR-2B, chases suppliers, and never makes a credit decision without human approval)',
      'Case Defence 3 and the mid-point defence : why this autonomy boundary, and what happens when a supplier lies',
    ],
  },
  {
    label: 'Case 4',
    weeks: 'Weeks 7–8 · Health insurance',
    title: 'Certify a Health Pre-Authorisation Review Assistant',
    modules: [
      {
        w: 'Week 7 — Evaluation & Quality',
        lessons: [
          'Eval design and failure taxonomy',
          'Golden sets with client SMEs',
          'LLM-as-judge (rubric, pairwise, calibration)',
          'RAG evals',
          'Agent trajectory and tool-use evals',
          'Eval statistics (sample size, variance, annotator agreement)',
          'CI regression gates',
          'Online evals, feedback and drift',
          'Eval platforms and experiment tracking',
          'Reporting quality to a client',
        ],
      },
      {
        w: 'Week 8 — Safety, Security & Governance',
        lessons: [
          'Threat modelling (OWASP LLM Top 10)',
          'Prompt injection, direct and indirect',
          'Red-team method and war room',
          'Tool abuse, least privilege, blast radius',
          'Bias, fairness, abuse testing',
          'Guardrails and PII redaction',
          'Identity and permissions (RBAC, permission-aware retrieval)',
          'Data residency, retention, DPDP and sector rules',
          'Audit trails, lineage, explainability',
          'Risk review and security questionnaire',
        ],
      },
    ],
    tools: ['promptfoo', 'Braintrust', 'RAGAS', 'Presidio', 'NeMo Guardrails', 'Claude'],
    projects: [
      'Project 4 : Certified Review Assistant (inherit a flawed prototype, evaluate and harden it, then write a go / no-go certification memo)',
      'War room and Case Defence 4 : your top three residual risks and why you recommend go or no-go',
    ],
  },
  {
    label: 'Case 5',
    weeks: 'Weeks 9–10 · E-commerce logistics',
    title: 'Recover Failed Deliveries for a D2C Brand',
    modules: [
      {
        w: 'Week 9 — Deploy & Operate',
        lessons: [
          'Environments, secrets, config',
          'Docker',
          'CI/CD',
          'Cloud deployment with IAM and networking basics',
          'Release safety (canary, A/B, shadow, rollback)',
          'Observability (logs, traces, token and latency metrics)',
          'SLOs, error budgets, alerting',
          'Cost control (caching, batching, routing, budget guards)',
          'Incident response and postmortems',
          'UAT plan, runbook, operational handoff',
        ],
      },
      {
        w: 'Week 10 — Economics, Delivery & Ownership',
        lessons: [
          'Model selection matrix and routing',
          'Unit economics per request',
          'ROI proof and business case',
          'Vendor and model risk, and the fine-tune vs RAG vs prompt decision',
          'Adoption metrics and change management',
          'SOW, commercials, pricing negotiation',
          'Executive readout',
          'Handover and enablement',
          'Account expansion',
          'Legal, IP and licensing awareness',
        ],
      },
    ],
    tools: ['Docker', 'GitHub Actions', 'OpenTelemetry', 'Phoenix', 'Langfuse', 'WhatsApp'],
    projects: [
      'Project 5 : Production NDR Recovery System (take an outreach agent from laptop to production and prove incremental recovery and ROI)',
      'Case Defence 5 : a CFO panel on every number in your ROI model, and a recorded handover another pod can follow',
    ],
  },
  {
    label: 'Case 6',
    weeks: 'Weeks 11–12 · Capstone',
    title: 'Capstone: A Fresh Brief',
    modules: [
      {
        w: 'Week 11 — Capstone: Discover & Design',
        lessons: [
          'Select a capstone brief: provident-fund claims, court judgments, ONDC grievances, or bring your own client',
          'Run a 48-hour discovery window',
          'Interview client roles and resolve contradictory asks',
          'Write the problem brief and success measures',
          'Agree scope and the SOW',
          'Architecture with architecture decision records',
          'Threat model and risk register',
          'Evaluation plan and hidden-scenario plan',
          'Data plan',
          'First working slice',
        ],
      },
      {
        w: 'Week 12 — Capstone: Build, Harden & Demo Day',
        lessons: [
          'Build against the hidden scenario suite',
          'Run the eval harness and fix the top failures',
          'Security review against the threat model',
          'Deploy with tracing and cost controls',
          'Write the runbook and executive summary',
          'The 15-minute demo',
          'The 15-minute live defence with an instructor-injected change request',
          'Executive readout to an industry panel',
          'The 12 graduation questions, answered live',
          'The next-build roadmap',
        ],
      },
    ],
    tools: ['Claude Code', 'Claude API', 'MCP', 'OpenTelemetry', 'GitHub Actions', 'GitHub'],
    projects: [
      'Project 6 : Capstone Engagement (the full lifecycle on a fresh brief, from ambiguous problem to a deployed, defended system)',
      'Demo Day : a 15-minute demo, a live defence with a change request, and an executive readout to an industry panel',
    ],
  },
];

// The two tracks, shown where the Generalist page shows its domain tracks.
export const FDE_TRACKS = [
  { name: 'Builder track', role: 'Direct Claude Code from starter repos · Own the plan, every diff and the tests · Analysts, consultants, product people' },
  { name: 'Engineer track', role: 'Write the core components · Stretch builds: batching, CI, retrievers, connectors, access controls · Working developers' },
];
