// AI FDE Fellowship curriculum, as the Engineering page shows it.
//
// Taken from "Menler AI FDE Fellowship — Programme Curriculum", the PDF the
// page hands out (public/pdfs/Menler_AI_FDE_Fellowship_Curriculum.pdf). Same
// shape as the Generalist curriculum: one row per two-week case. Each week's
// ten competencies are grouped into a short lesson plan here; the PDF has the
// full list. When the PDF changes, change this file with it.

export const FDE_CASES = [
  {
    label: 'Case 1',
    weeks: 'Weeks 1–2 · BFSI',
    title: 'Complaint Triage for a Bank Grievance Cell',
    modules: [
      {
        w: 'Week 1 — Discover, Frame & Model Basics',
        lessons: [
          'The FDE operating model and lifecycle',
          'Discovery interviews and process mapping',
          'Use-case qualification, baselines and success metrics',
          'How LLMs work, and why they hallucinate',
          'Choosing a model: AI vs ML vs rules',
        ],
      },
      {
        w: 'Week 2 — Model Behaviour, Prompting & Context',
        lessons: [
          'System prompts and structured outputs',
          'Reasoning models, thinking budgets and context',
          'Prompt caching, grounding and citations',
          'Prompt versioning and regression tests',
          'Benchmarking an LLM against a classical baseline',
        ],
      },
    ],
    tools: ['Claude', 'Claude API', 'Claude Code', 'JSON Schema', 'GitHub'],
    projects: [
      'Project 1 : Complaint Triage Engine in three languages',
      'Case Defence 1 : defend it to a client panel',
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
          'The Claude Code workflow: plan, implement, test',
          'Skills, subagents, hooks and plugins',
          'Full-stack apps, and reviewing AI-written code',
          'Schema design, data quality and ingestion',
          'PII and DPDP basics',
        ],
      },
      {
        w: 'Week 4 — Knowledge & Retrieval',
        lessons: [
          'Parsing, OCR and chunking',
          'Embeddings and vector stores',
          'Hybrid search and reranking',
          'Citations, grounded answers and saying "I don’t know"',
          'Agentic RAG and knowledge graphs',
        ],
      },
    ],
    tools: ['Claude Code', 'Postgres', 'pgvector', 'Qdrant', 'Neo4j', 'GitHub'],
    projects: [
      'Project 2 : Cited Farm Advisory Copilot',
      'Case Defence 2 : a retrieval failure and your fix',
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
          'Tool design and the agent loop',
          'Bounded autonomy and human approvals',
          'Building and securing an MCP server',
          'Short- and long-term memory',
          'Computer-use agents for systems without APIs',
        ],
      },
      {
        w: 'Week 6 — Multi-Agent & Enterprise Integration',
        lessons: [
          'Multi-agent patterns and the Claude Agent SDK',
          'WhatsApp and email channels',
          'Webhooks, idempotency and OAuth2',
          'Queues and orchestration with n8n',
          'Legacy systems, rate limits and retries',
        ],
      },
    ],
    tools: ['Claude Agent SDK', 'MCP', 'n8n', 'Claude Code', 'WhatsApp', 'GitHub'],
    projects: [
      'Project 3 : Reconciliation Agent and public MCP server',
      'Case Defence 3 and the mid-point defence',
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
          'Eval design and golden sets',
          'LLM-as-judge and calibration',
          'RAG and agent evals',
          'Eval statistics and CI regression gates',
          'Reporting quality to a client',
        ],
      },
      {
        w: 'Week 8 — Safety, Security & Governance',
        lessons: [
          'Threat modelling with the OWASP LLM Top 10',
          'Prompt injection and red-teaming',
          'Guardrails, PII redaction and access control',
          'DPDP, data residency and audit trails',
          'Risk review and the go / no-go decision',
        ],
      },
    ],
    tools: ['promptfoo', 'Braintrust', 'RAGAS', 'Presidio', 'NeMo Guardrails', 'Claude'],
    projects: [
      'Project 4 : Certified Review Assistant and a go / no-go memo',
      'War room and Case Defence 4',
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
          'Docker, CI/CD and cloud deployment',
          'Safe releases: canary, A/B and rollback',
          'Observability, SLOs and alerting',
          'Cost control and budget guards',
          'Incident response and postmortems',
        ],
      },
      {
        w: 'Week 10 — Economics, Delivery & Ownership',
        lessons: [
          'Model routing and unit economics',
          'ROI proof and the business case',
          'Fine-tune vs RAG vs prompt',
          'SOW, pricing and negotiation',
          'Executive readout and handover',
        ],
      },
    ],
    tools: ['Docker', 'GitHub Actions', 'OpenTelemetry', 'Phoenix', 'Langfuse', 'WhatsApp'],
    projects: [
      'Project 5 : Production NDR Recovery System with an ROI model',
      'Case Defence 5 : a CFO panel',
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
          'Pick a brief, or bring your own client',
          'A 48-hour discovery with a client role',
          'Problem brief, success measures and SOW',
          'Architecture, threat model and eval plan',
          'A first working slice',
        ],
      },
      {
        w: 'Week 12 — Capstone: Build, Harden & Demo Day',
        lessons: [
          'Build against hidden scenarios',
          'Evals, security review and fixes',
          'Deploy with tracing and cost controls',
          'Demo Day: demo and live defence',
          'The 12 graduation questions, answered live',
        ],
      },
    ],
    tools: ['Claude Code', 'Claude API', 'MCP', 'OpenTelemetry', 'GitHub Actions', 'GitHub'],
    projects: [
      'Project 6 : Capstone Engagement, brief to deployed system',
      'Demo Day : live defence and executive readout',
    ],
  },
];

// The two tracks, shown where the Generalist page shows its domain tracks.
export const FDE_TRACKS = [
  { name: 'Builder track', role: 'Direct Claude Code from starter repos · Own the plan, every diff and the tests · Analysts, consultants, product people' },
  { name: 'Engineer track', role: 'Write the core components · Stretch builds: batching, CI, retrievers, connectors, access controls · Working developers' },
];
