// AI Forward Deployed Engineer (AI FDE) Fellowship — what the course page shows.
//
// Three phases of four weeks, the same rhythm as the Generalist page. Every
// case runs exactly two weeks and ends in a Case Defence, so the phase breaks
// land on case boundaries (after Weeks 4 and 8); a 3-3-3-3 split would cut
// Cases 2 and 5 in half. The week-by-week detail behind these lines is in the
// curriculum PDF (public/pdfs/Menler_AI_FDE_Fellowship_Curriculum.pdf).

export const FDE_PHASES = [
  {
    label: 'Phase 1',
    weeks: 'Weeks 1–4',
    title: 'LLM Foundations, Claude Code & RAG',
    modules: [
      {
        w: 'Week 1 — Discover, Frame & Model Basics',
        lessons: [
          'The FDE operating model',
          'Discovery interviews',
          'Use-case qualification',
          'Tokens, context and why models hallucinate',
          'Includes a guided code walkthrough',
        ],
      },
      {
        w: 'Week 2 — Prompt & Context Engineering',
        lessons: [
          'Structured outputs and schemas',
          'Context control',
          'Benchmarking an LLM against a classical baseline',
        ],
      },
      {
        w: 'Week 3 — Build with Claude Code & Data',
        lessons: [
          'Ship a deployed console',
          'Design a clean data schema',
          'Catch what AI-written code gets wrong',
        ],
      },
      {
        w: 'Week 4 — RAG: Knowledge & Retrieval',
        lessons: [
          'Parsing, chunking and embeddings',
          'Vector databases',
          'Hybrid search and reranking',
          'Citations and abstention',
          'Includes Debug Lab 1',
        ],
      },
    ],
    projects: [
      'Case 01 : Bank Grievance Triage (a complaint triage engine)',
      'Case 02 : Vetted-Answer Farm Copilot (a cited, abstaining RAG copilot)',
    ],
    tools: ['Claude', 'Claude Code', 'Claude API', 'JSON Schema', 'Postgres', 'pgvector', 'Qdrant', 'Neo4j', 'GitHub'],
  },
  {
    label: 'Phase 2',
    weeks: 'Weeks 5–8',
    title: 'AI Agents, MCP, Evals & AI Security',
    modules: [
      {
        w: 'Week 5 — Agent Architecture, MCP & Memory',
        lessons: [
          'Tool design and the agent loop',
          'Bounded autonomy and human-in-the-loop',
          'Publishing your own MCP server',
          'Includes Debug Lab 2',
        ],
      },
      {
        w: 'Week 6 — Multi-Agent & Enterprise Integration',
        lessons: [
          'Supervisor and sub-agents with the Claude Agent SDK',
          'Webhooks, OAuth and queues',
          'Workflows with n8n',
          'Legacy systems',
        ],
      },
      {
        w: 'Week 7 — LLM Evaluation & Quality',
        lessons: [
          'Golden sets',
          'LLM-as-judge',
          'RAG and agent evals',
          'Eval statistics and CI regression gates',
        ],
      },
      {
        w: 'Week 8 — AI Safety, Security & Governance',
        lessons: [
          'OWASP LLM Top 10',
          'Prompt injection and red-teaming',
          'Guardrails and PII redaction',
          'RBAC and DPDP compliance',
        ],
      },
    ],
    projects: [
      'Case 03 : GST Credit Reconciliation (a public MCP server and a multi-agent system)',
      'Case 04 : Health Pre-Authorisation (an eval harness and a go / no-go memo)',
    ],
    tools: ['Claude Agent SDK', 'MCP', 'Claude Code', 'n8n', 'promptfoo', 'Braintrust', 'RAGAS', 'Presidio', 'NeMo Guardrails'],
  },
  {
    label: 'Phase 3',
    weeks: 'Weeks 9–12',
    title: 'Deploy, Prove ROI & Capstone',
    modules: [
      {
        w: 'Week 9 — Deploy & Operate (LLMOps)',
        lessons: [
          'Production deployment',
          'Observability and SLOs',
          'Cost caps and rollback',
          'Postmortems',
        ],
      },
      {
        w: 'Week 10 — Economics, Delivery & Ownership',
        lessons: [
          'Model routing and unit economics',
          'A/B tests with holdouts',
          'ROI models',
          'SOWs, negotiation and handover',
        ],
      },
      {
        w: 'Week 11 — Capstone: Discover & Design',
        lessons: [
          'A 48-hour client discovery',
          'Architecture decision records',
          'Threat model',
          'A first working slice',
        ],
      },
      {
        w: 'Week 12 — Capstone: Build, Harden & Demo Day',
        lessons: [
          'Hidden scenarios',
          'Final evals',
          'A live defence against a change request you haven’t seen',
        ],
      },
    ],
    projects: [
      'Case 05 : Failed-Delivery Recovery (a monitored production system and a CFO-ready ROI model)',
      'Case 06 : Client Capstone (EPFO claims, court judgments, ONDC grievances, or your own client)',
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
  { icon: 'target', tag: 'Weeks 1–10 · 10 a week', num: '100', label: 'Competencies', desc: 'Every skill an AI FDE is hired for, mapped and graded. From prompt design to production ownership, nothing is left to guesswork.' },
  { icon: 'live', tag: 'Sat + Sun · 2 hrs each', num: '48', label: 'Live Hours', desc: 'Real-time, not recorded. Mentors play your client, change requirements mid-week, and you respond the way you would on the job.' },
  { icon: 'calendar', tag: '3 phases of 4 weeks', num: '12', label: 'Weeks', desc: 'One intensive quarter, every Saturday and Sunday. Built to fit around college or a full-time job.' },
  { icon: 'check', tag: 'One every week', num: '12', label: 'Assignments', desc: 'Ship something every single week. Each one is reviewed by a mentor and feeds the next build.' },
  { icon: 'rocket', tag: 'Deployed & defended', num: '6+', label: 'Production-Grade Projects', desc: 'Deployed, evaluated and secured, not demo-ware. The portfolio that gets you shortlisted.' },
  { icon: 'case', tag: 'Banking → D2C', num: '6', label: 'Real Case Studies', desc: 'Banking, agriculture, GST, health insurance, D2C and your capstone. Real time problems, defended, built and shipped live.' },
];
