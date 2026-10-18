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
    oneLiner: 'Learn how models think, build with Claude Code, and ship your first two AI systems.',
    cases: ['01 Bank Grievance Triage', '02 Vetted-Answer Farm Copilot'],
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
        w: 'Week 2 — Prompt Engineering & Context Engineering',
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
    ship: ['A complaint triage engine', 'A cited, abstaining RAG copilot'],
    tools: ['Claude', 'Claude Code', 'Claude API', 'GitHub', 'pgvector', 'Qdrant', 'Neo4j (optional)'],
    gate: 'Case Defence 1 and 2',
  },
  {
    label: 'Phase 2',
    weeks: 'Weeks 5–8',
    title: 'AI Agents, MCP, Evals & AI Security',
    oneLiner: 'Build multi-agent systems, connect them to enterprise software, then learn to certify or reject one.',
    cases: ['03 GST Credit Reconciliation Agent', '04 Health Pre-Authorisation Assistant'],
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
        w: 'Week 6 — Multi-Agent Systems & Enterprise Integration',
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
    ship: ['A public MCP server', 'A multi-agent reconciliation system', 'An eval harness', 'A go / no-go certification memo'],
    tools: ['Claude Agent SDK', 'MCP', 'n8n', 'promptfoo', 'Braintrust', 'RAGAS', 'Presidio', 'NeMo Guardrails'],
    gate: 'Mid-point defence, war room, Case Defence 3 and 4',
  },
  {
    label: 'Phase 3',
    weeks: 'Weeks 9–12',
    title: 'Deploy, Prove ROI & Capstone',
    oneLiner: 'Take AI from laptop to production, prove it pays for itself, then lead a full client engagement.',
    cases: ['05 Failed-Delivery Recovery', '06 Client Capstone'],
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
    ship: ['A monitored production system', 'A CFO-ready ROI model', 'A handover pack', 'Your capstone'],
    briefs: ['EPFO claim-readiness', 'Court-judgment research', 'ONDC seller grievance copilot', 'Bring your own client'],
    // The production and observability stack the deploy weeks use.
    tools: ['Claude Code', 'Docker', 'GitHub Actions', 'OpenTelemetry', 'Langfuse', 'Phoenix'],
    gate: 'Case Defence 5 and Demo Day',
  },
];

// "Who this is for" — five audiences, each with who they are.
export const FDE_AUDIENCE = [
  {
    role: 'Students & fresh graduates',
    desc: 'Start your career with a deployed AI portfolio, not just a degree.',
    who: 'Engineering, BCA, MCA, B.Sc, B.Com, BBA and MBA students and recent grads.',
  },
  {
    role: 'Engineers & developers',
    desc: 'Move from writing features to shipping AI systems in production.',
    who: 'Software, full-stack, QA, DevOps, data, ML and IT services engineers.',
  },
  {
    role: 'Product, design & delivery',
    desc: 'Stop handing AI specs over. Build and ship the solution yourself.',
    who: 'Product managers, designers, program managers, business analysts and tech leads.',
  },
  {
    role: 'Founders & domain experts',
    desc: 'Bring the problem you know best and deploy AI into it, for your own company or your function.',
    who: 'Founders, and finance, operations, consulting, sales, marketing, HR, healthcare and legal professionals.',
  },
  {
    role: 'Freelancers & career switchers',
    desc: 'Turn AI into client work, or move into one of the fastest-growing roles in tech.',
    who: 'Freelancers, consultants, team leads and anyone switching into AI.',
  },
];

// "Program highlights" — where the Generalist page has its domain tracks.
export const FDE_HIGHLIGHTS = [
  { num: '100', label: 'Competencies', desc: 'Every skill an AI FDE is hired for, mapped and graded. From prompt design to production ownership, nothing is left to guesswork.' },
  { num: '48', label: 'Live Hours', desc: 'Real-time, not recorded. Mentors play your client, change requirements mid-week, and you respond the way you would on the job.' },
  { num: '12', label: 'Weeks', desc: 'One intensive quarter, every Saturday and Sunday. Built to fit around college or a full-time job.' },
  { num: '12', label: 'Assignments', desc: 'Ship something every single week. Each one is reviewed by a mentor and feeds the next build.' },
  { num: '6+', label: 'Production-Grade Projects', desc: 'Deployed, evaluated and secured, not demo-ware. The portfolio that gets you shortlisted.' },
  { num: '6', label: 'Real Case Studies', desc: 'Banking, agriculture, GST, health insurance, D2C and your capstone. Real time problems, defended, built and shipped live.' },
];
