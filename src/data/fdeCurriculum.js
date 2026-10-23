// AI Forward Deployed Engineer (AI FDE) Fellowship — what the course page shows.
//
// Three phases of four weeks, the same rhythm as the Generalist page. Every
// case runs exactly two weeks and ends in a Case Defence, so the phase breaks
// land on case boundaries (after Weeks 4 and 8); a 3-3-3-3 split would cut
// Cases 2 and 5 in half. Week titles follow the curriculum PDF; each week
// lists six of its ten topics in the PDF's wording, plus the three labs in
// Weeks 1, 4 and 5.

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
          'AI vs ML vs rules',
          'Success metrics and baselines',
          'How models are trained and why they hallucinate',
          'Model landscape and selection',
          'Lab: Guided Code Walkthrough',
        ],
      },
      {
        w: 'Week 2 — Model Behaviour, Prompting & Context',
        lessons: [
          'System prompts and persona design',
          'Structured outputs and schema enforcement',
          'Reasoning models and thinking budgets',
          'Prompt caching and batching',
          'Grounding and citations',
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
          'SQL, schema design, data modelling',
          'PII classification and DPDP basics',
        ],
      },
      {
        w: 'Week 4 — Knowledge & Retrieval',
        lessons: [
          'Parsing and ingestion (PDF, OCR, tables)',
          'Chunking and embeddings',
          'Vector stores and ANN',
          'Hybrid search and reranking',
          'Citations and grounded answers',
          'Query rewriting and agentic RAG',
          'Lab: Find Where the AI Application Failed (1 of 2)',
        ],
      },
    ],
    projects: [
      'Bank Complaint Triage Engine',
      'Cited Farm Advisory Copilot',
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
          'Human-in-the-loop approvals',
          'Building an MCP server (2026-07-28 stateless spec)',
          'Short-term and long-term memory',
          'Durable workflows',
          'Lab: Find Where the AI Application Failed (2 of 2)',
        ],
      },
      {
        w: 'Week 6 — Multi-Agent & Enterprise Integration',
        lessons: [
          'Multi-agent patterns (router, supervisor, parallel, handoff)',
          'Subagents and the Claude Agent SDK',
          'Channels (WhatsApp, email)',
          'REST/GraphQL, webhooks, idempotency',
          'Workflow orchestration and queues (n8n)',
          'Rate limits, backoff, dead-letter handling',
        ],
      },
      {
        w: 'Week 7 — Evaluation & Quality',
        lessons: [
          'Eval design and failure taxonomy',
          'Golden sets with client SMEs',
          'LLM-as-judge (rubric, pairwise, calibration)',
          'RAG and agent evals',
          'CI regression gates',
          'Reporting quality to a client',
        ],
      },
      {
        w: 'Week 8 — Safety, Security & Governance',
        lessons: [
          'Threat modelling (OWASP LLM Top 10)',
          'Prompt injection, direct and indirect',
          'Red-team method and war room',
          'Guardrails and PII redaction',
          'Identity and permissions (RBAC)',
          'Data residency, retention and DPDP',
        ],
      },
    ],
    projects: [
      'GST Agent & MCP Server',
      'Health Pre-Auth Assistant',
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
          'Docker and CI/CD',
          'Cloud deployment with IAM and networking basics',
          'Release safety (canary, A/B, shadow, rollback)',
          'Observability (logs, traces, token and latency metrics)',
          'SLOs, error budgets, alerting',
          'Incident response and postmortems',
        ],
      },
      {
        w: 'Week 10 — Economics, Delivery & Ownership',
        lessons: [
          'Model selection matrix and routing',
          'Unit economics per request',
          'ROI proof and business case',
          'SOW, commercials, pricing negotiation',
          'Executive readout',
          'Handover and enablement',
        ],
      },
      {
        w: 'Week 11 — Capstone: Discover & Design',
        lessons: [
          'Select a capstone brief (or bring your own client)',
          'Run a 48-hour discovery window',
          'Write the problem brief and success measures',
          'Architecture with architecture decision records',
          'Threat model and risk register',
          'First working slice',
        ],
      },
      {
        w: 'Week 12 — Capstone: Build, Harden & Demo Day',
        lessons: [
          'Build against the hidden scenario suite',
          'Run the eval harness and fix the top failures',
          'Deploy with tracing and cost controls',
          'The 15-minute demo',
          'The live defence against an unseen change request',
          'The 12 graduation questions, answered live',
        ],
      },
    ],
    projects: [
      'Delivery Recovery System',
      'Real-Client Capstone',
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
  { num: '100', label: 'Engineering Competencies', icon: 'target', role: 'Every skill an AI FDE needs, assessed one by one.' },
  { num: '48', label: 'Live Hours', icon: 'live', role: 'Live weekend sessions led by industry mentors.' },
  { num: '12', label: 'Weeks Intensive', icon: 'calendar', role: 'A focused programme that fits around work or college.' },
  { num: '12', label: 'Weekly Assignments', icon: 'check', role: 'One hands-on assignment a week, reviewed by a mentor.' },
  { num: '6', label: 'Production-Grade Projects', icon: 'rocket', role: 'Real systems you build, deploy and add to your portfolio.' },
  { num: '6', label: 'Real Case Studies', icon: 'case', role: 'Real problems from banking, farming, finance, health and retail.' },
];

// The next batch. The course page shows the label; the build bakes the ISO
// date into the Course structured data, so search and answer engines read the
// same date the page does. Change it here and both follow.
export const FDE_START = { iso: '2026-11-14', label: 'November 14, 2026' };

// The page's title, description and keywords — used by the page (<Seo>) and by
// scripts/prerender.mjs, so the static HTML and the live page say the same.
// The address is /ai-engineering, so the title leads with "AI Engineering Course";
// "AI FDE" and "Forward Deployed Engineer" stay as the programme's name.
export const FDE_SEO = {
  title: 'AI Engineering Course in India | AI FDE Fellowship | Menler',
  description:
    'Live 12-week AI engineering course: build RAG, AI agents and MCP servers with Claude on 6 real Indian cases, deploy them to production and become an AI FDE.',
  keywords: [
    'AI engineering course', 'AI engineering course India', 'AI engineering course online', 'AI engineer course',
    'AI engineering certification', 'AI engineering bootcamp', 'AI engineer course with placement',
    'AI engineer course for working professionals', 'AI engineer course for freshers', 'weekend AI course',
    'generative AI course', 'generative AI engineering course', 'gen AI course India', 'LLM engineering course', 'LLM course',
    'agentic AI course', 'AI agents course', 'multi-agent systems course', 'RAG course', 'retrieval augmented generation course',
    'MCP server course', 'Model Context Protocol course', 'Claude course', 'Claude Code course', 'Claude API course',
    'prompt engineering course', 'context engineering', 'LLMOps course', 'AI evaluation', 'AI security course',
    'forward deployed engineer course', 'AI forward deployed engineer', 'FDE course India', 'forward deployed engineer vs AI engineer',
    'how to become an AI engineer', 'AI engineer roadmap 2026', 'how to become a forward deployed engineer',
    'AI course Bangalore', 'AI course Hyderabad', 'AI course Pune', 'AI course Chennai', 'AI course Mumbai', 'AI course Delhi',
  ].join(', '),
};

// "AI engineering course guide" — the section between Pricing and the FAQ.
// Plain answers to what people search before they buy an AI engineering course
// (what it is, the skills, the roadmap, time, certification, where), plus a
// role comparison. The page shows it, and the build writes it into the
// static HTML, so search engines and answer engines read the same words.
export const FDE_GUIDE = {
  blocks: [
    {
      h: 'What is an AI engineering course?',
      p: 'A course in building applications on large language models (LLMs), rather than training models. You learn RAG, AI agents and MCP, and take every build to production.',
    },
    {
      h: 'Skills you will learn',
      chips: [
        'Generative AI', 'Large language models (LLMs)', 'Prompt & context engineering', 'Structured outputs',
        'RAG pipelines', 'Embeddings & vector databases', 'Hybrid search & reranking', 'AI agents', 'Agentic AI',
        'Multi-agent systems', 'MCP servers', 'Claude API', 'Claude Code', 'Claude Agent SDK', 'LLM evaluation',
        'AI security & guardrails', 'LLMOps & deployment', 'Full-stack AI apps', 'SQL & data modelling', 'DPDP & PII basics',
      ],
      wide: true,
    },
    {
      h: 'Your AI engineer roadmap, in 12 weeks',
      p: 'Weeks 1–4: LLM foundations, Claude Code and RAG. Weeks 5–8: AI agents, MCP, evaluation and security. Weeks 9–12: deployment and a client capstone.',
    },
    {
      h: 'For working professionals, freshers and career switchers',
      p: 'Live weekend classes, about 12 hours a week, designed to fit around a full-time job or college. Basic coding helps; Week 1 covers the essentials.',
    },
    {
      h: 'Certification, portfolio and placement support',
      p: 'Earn the Menler AI FDE Certification and graduate with six deployed projects. Placement support includes mock interviews, portfolio reviews and referrals.',
    },
    {
      h: 'Live online, anywhere in India',
      p: 'Join live from Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR or anywhere in India. Small pods of five with mentors, and recordings for a year.',
      wide: true,
    },
  ],
  compare: {
    head: ['', 'AI Engineer', 'Forward Deployed Engineer', 'ML Engineer'],
    rows: [
      ['What they build', 'LLM apps, RAG systems and AI agents', 'The same, deployed inside a client’s business', 'Trained models and data pipelines'],
      ['Measured on', 'The system and its code', 'The client outcome and its ROI', 'Model accuracy'],
      ['Core skills', 'Prompting, RAG, agents, evals', 'All of that, plus discovery, deployment and adoption', 'Statistics, model training, MLOps'],
      ['In this course', 'Yes, all of it', 'Yes, the heart of the course', 'The fundamentals, in Week 1'],
    ],
  },
};
