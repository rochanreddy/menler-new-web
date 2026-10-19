// AI Forward Deployed Engineer (AI FDE) Fellowship — what the course page shows.
//
// Three phases of four weeks, the same rhythm as the Generalist page. Every
// case runs exactly two weeks and ends in a Case Defence, so the phase breaks
// land on case boundaries (after Weeks 4 and 8); a 3-3-3-3 split would cut
// Cases 2 and 5 in half. Week titles and topics follow the curriculum PDF
// word for word: ten topics a week (C001–C100, then K01–K20 for the
// capstone), plus the three labs in Weeks 1, 4 and 5.

export const FDE_PHASES = [
  {
    label: 'Phase 1',
    weeks: 'Weeks 1–4',
    title: 'LLM Foundations, Claude Code & RAG',
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
          'Lab: Guided Code Walkthrough',
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
          'Lab: Find Where the AI Application Failed (1 of 2)',
        ],
      },
    ],
    projects: [
      'Case 01 : Complaint Triage Engine (a bank grievance cell, in English, Hindi and Hinglish)',
      'Case 02 : Cited Farm Advisory Copilot (answers only from vetted advisories, cites every claim)',
    ],
    tools: ['Claude', 'Claude Code', 'Claude API', 'JSON Schema', 'Postgres', 'pgvector', 'Qdrant', 'Neo4j', 'GitHub'],
  },
  {
    label: 'Phase 2',
    weeks: 'Weeks 5–8',
    title: 'AI Agents, MCP, Evals & AI Security',
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
          'Lab: Find Where the AI Application Failed (2 of 2)',
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
    projects: [
      'Case 03 : GST Reconciliation Agent and Public MCP Server (human approves every credit decision)',
      'Case 04 : Certified Health Pre-Authorisation Assistant (evaluate, harden, go / no-go memo)',
    ],
    tools: ['Claude Agent SDK', 'MCP', 'Claude Code', 'n8n', 'promptfoo', 'Braintrust', 'RAGAS', 'Presidio', 'NeMo Guardrails'],
  },
  {
    label: 'Phase 3',
    weeks: 'Weeks 9–12',
    title: 'Deploy, Prove ROI & Capstone',
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
      {
        w: 'Week 11 — Capstone: Discover & Design',
        lessons: [
          'Select a capstone brief (A, B, C or bring your own client)',
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
    projects: [
      'Case 05 : Production NDR Recovery System (failed D2C deliveries, a CFO-checked ROI model)',
      'Case 06 : Capstone Engagement (EPFO claims, court judgments, ONDC grievances, or your own client)',
    ],
    // The production and observability stack the deploy weeks use.
    tools: ['Claude Code', 'Docker', 'GitHub Actions', 'OpenTelemetry', 'Langfuse', 'Phoenix'],
  },
];

// "Who this is for" — five audiences, one line each, like the Generalist cards.
export const FDE_AUDIENCE = [
  {
    role: 'Students & fresh graduates',
    desc: 'Start your career with a deployed AI portfolio.',
  },
  {
    role: 'Engineers & developers',
    desc: 'Go from writing features to shipping AI systems.',
  },
  {
    role: 'Product, design & delivery',
    desc: 'Stop handing AI specs over. Ship it yourself.',
  },
  {
    role: 'Founders & domain experts',
    desc: 'Deploy AI into the problem you know best.',
  },
  {
    role: 'Freelancers & career switchers',
    desc: 'Turn AI into client work or a new career.',
  },
];

// "Program highlights" — where the Generalist page has its domain tracks.
export const FDE_HIGHLIGHTS = [
  { num: '100', label: 'Graded Competencies', icon: 'target', role: 'Every skill FDE hiring managers test for, graded until you nail it.' },
  { num: '48', label: 'Live Hours', icon: 'live', role: 'No recordings. Mentors play your client and change the brief.' },
  { num: '12', label: 'Weeks Intensive', icon: 'calendar', role: 'Prompt to production in one quarter, on weekends.' },
  { num: '12', label: 'Weekly Assignments', icon: 'check', role: 'Ship every week. Get reviewed. Build on it the next.' },
  { num: '6+', label: 'Production-Grade Projects', icon: 'rocket', role: 'Deployed, evaluated and secured. Proof, not demos.' },
  { num: '6', label: 'Real Case Studies', icon: 'case', role: 'Banking, GST, health, D2C. Real briefs you defend live.' },
];
