// AI FDE Fellowship curriculum, as the Engineering page shows it.
//
// Taken from "Menler AI FDE Fellowship — Programme Curriculum" (the PDF the
// brochure form hands out: public/pdfs/Menler_AI_FDE_Fellowship_Curriculum.pdf).
// When the PDF changes, change this file with it — the page and the PDF should
// never disagree.
//
// Shape: six two-week case blocks. Each case carries its brief (context,
// client ask, engagement brief, defence focus) and its two weeks; each week
// carries its objective, identity shift, Saturday (S1) and Sunday (S2)
// sessions, the weekly assignment and the project milestone.

export const FDE_GLANCE = [
  { k: 'Duration', v: '12 weeks, Saturday and Sunday, 2 hours each day. 48 live hours in total.' },
  { k: 'Weekly time', v: '4 live hours plus 7–8 hours of outside work, about 12 hours a week.' },
  { k: 'Format', v: 'Six two-week case blocks. Each block ends in a Case Defence on the second Sunday.' },
  { k: 'Work product', v: '12 weekly assignments feed 6 milestone projects, one per case.' },
  { k: 'Pods', v: 'Pods of five learners. One mentor for every two pods.' },
  { k: 'Tracks', v: 'Builder and Engineer, with identical acceptance criteria.' },
  { k: 'Curriculum', v: '100 competencies, 10 a week, each cleared by an artefact or an oral defence.' },
  { k: 'Grading', v: 'Defence-based. 80 of 100 competencies plus a capstone pass.' },
];

export const FDE_BEFORE_WEEK1 = [
  { k: 'Laptop', v: 'Able to run Docker, with admin rights.' },
  { k: 'Accounts', v: 'GitHub and Claude. API credits for the programme are provided by Menler.' },
  { k: 'Diagnostic', v: 'A short check before the first session confirms that Claude, Claude Code, GitHub and your API key all work.' },
  { k: 'Skills', v: 'Python or JavaScript at reading level. Builder-track learners need not have written production code.' },
];

export const FDE_TRACKS = [
  {
    name: 'Builder track',
    for: 'Analysts, consultants and product people',
    desc: 'You direct Claude Code from starter repositories. You write the plan, review every diff, own the tests and defend the outcome.',
  },
  {
    name: 'Engineer track',
    for: 'Working developers',
    desc: 'You write the core components yourself and take on stretch items: batching, CI regression, retrievers, connectors, webhook receivers, access controls and instrumentation.',
  },
];

export const FDE_ACCOUNTABILITY = [
  { k: 'Own a component', v: 'Every learner owns one component of each build and defends it alone at the Case Defence.' },
  { k: 'Rotating roles', v: 'Pod roles rotate each case, so each learner leads client contact, quality and delivery at least once.' },
  { k: 'Checkpoint repos', v: 'Starting from a Menler checkpoint repository to recover a stalled build caps that case at "Meets".' },
  { k: 'Mentor roleplay', v: 'Mentors play client roles by title (head of grievance, extension officer, finance controller). No company is invented.' },
];

export const FDE_BLOCK = [
  { k: 'Week A', v: 'Frame the problem, learn the concepts the case needs, and build the foundation with your pod. Ends with a project checkpoint.' },
  { k: 'Week B', v: 'Complete the build, test it against evidence, harden it, and prepare the defence.' },
  { k: 'Case Defence', v: 'Second Sunday: 10 minutes walking through the solution, 10 minutes on hidden-scenario results, 10 minutes on a live change request with panel questions.' },
  { k: 'Hidden scenarios', v: 'About 10 test scenarios you have never seen per case. They are graded at the defence, and you keep them as a personal Scenario Library.' },
  { k: 'Progression', v: 'Cases 1–3 are built from scratch. Cases 4–5 hand you a working prototype to make trustworthy and then deployable. Case 6 uses everything on a fresh brief.' },
];

export const FDE_RHYTHM = [
  { k: 'Saturday · S1', v: '2 live hours. Concepts and build for the first five competencies of the week.' },
  { k: 'Sunday · S2', v: '2 live hours. The next five competencies, with the lab or build that closes the week.' },
  { k: 'Weekly assignment', v: '4–8 hours outside, with your pod. Feeds that week’s project milestone.' },
  { k: 'Project milestone', v: 'The slice of the case project due that week. Week A is the foundation, Week B is the finished, defended project.' },
  { k: '1:1 build review', v: '15 minutes with a mentor on your own component.' },
  { k: 'AI clinic', v: '15 minutes to unblock a specific technical problem.' },
  { k: 'Executive summary', v: 'A half-page note for the client each week, so you practise explaining the work to a non-engineer.' },
];

// Shared by every Week B milestone: the sign-off that closes a case.
export const FDE_SIGNOFF = [
  { k: 'Component owner', v: 'The component you own and defend alone.' },
  { k: 'Pod roles', v: 'Client lead · Quality lead · Delivery lead (rotates each case).' },
  { k: 'Mentor sign-off', v: 'Rubric level: Not yet / Meets / Strong / Hire-ready.' },
  { k: 'Portfolio', v: 'Repository, report and defence record added to your public portfolio.' },
];

export const FDE_CASES = [
  {
    no: 1,
    weeks: 'Weeks 1–2',
    sector: 'BFSI',
    title: 'Complaint Triage for a Bank Grievance Cell',
    project: 'Complaint Triage Engine',
    mode: 'Built from scratch',
    context: 'RBI Integrated Ombudsman Scheme, FY2024-25: complaints reached about 13.34 lakh, up 13.55% from the year before, and 93.07% were resolved. Banks accounted for 2,41,601 complaints (81.53%) at the Ombudsman offices and NBFCs for 14.80%, with loans and advances the top category and credit cards second. Only 62.16% were maintainable; the rest were duplicates, lacked information, were already dealt with, or fell outside RBI’s jurisdiction. A secondary source reports that the RBI Governor said complaints grew about 50% a year over two years while processing capacity grew about 25% (March 2025 remarks). Triage quality is therefore a real bottleneck.',
    ask: 'A grievance cell (head of customer grievance, compliance officer and contact-centre lead, played by mentors) wants every inbound complaint classified, checked for completeness and duplicates, routed, and given a draft first response, in English, Hindi and Hinglish.',
    brief: [
      { k: 'Data kit', v: 'Synthetic complaints in three language styles, with category mix modelled on the public annual-report distribution, plus a sample of prior complaints and policy snippets.' },
      { k: 'Constraints', v: 'The system never closes or rejects a complaint on its own. Every routing decision is explainable. Customer identifiers are masked.' },
      { k: 'Objective', v: 'Ship a triage engine that classifies, checks and routes complaints, and prove it beats a classical baseline.' },
      { k: 'Hidden scenarios', v: 'Examples of the ~10 you will not see: one complaint carrying two issues · abusive Hinglish · a duplicate of an earlier case · a matter outside the regulator’s jurisdiction · missing account details · a customer who pastes an ID number · a message that tries to instruct the triage model.' },
      { k: 'Success', v: 'Schema validity ≥ 99%, per-category F1 with confidence intervals, duplicate and non-maintainable detection reported separately.' },
      { k: 'Curveball', v: 'A new category and Tamil complaints appear mid-block.', hot: true },
      { k: 'Builder / Engineer', v: 'Builder: provided harness and prompt templates. Engineer: adds batching, thinking-budget trade-offs and CI regression.' },
      { k: 'Time', v: '8 live + 15 outside hours.' },
    ],
    defence: 'Why this pilot first, why this model over the baseline, what you would measure in week one live.',
    tools: ['Claude API', 'Claude Code', 'JSON Schema', 'GitHub'],
    weekList: [
      {
        n: 1,
        title: 'Discover, Frame & Model Basics',
        objective: 'Frame Case 1 the way an FDE does: interview the client roles, qualify the candidate uses, set baselines, and learn just enough about how models work to predict where they will fail.',
        shift: ['Course taker', 'Problem framer'],
        sessions: [
          {
            title: 'Discover the Problem — Roles, Workflows & Use-Case Qualification',
            buildsOn: 'Setup bridge: Claude, Claude Code, GitHub and your API key are working before the session starts, checked by a short diagnostic.',
            topics: ['FDE operating model and lifecycle', 'Discovery interviews and process mapping', 'Use-case qualification (value, feasibility, risk, kill criteria)', 'AI vs ML vs rules', 'Success metrics and baselines'],
            claude: 'Claude as research and synthesis partner: summarise the public annual-report data, draft interview guides, and challenge your process map.',
            build: 'Two discovery interviews with mentor-played client roles (head of customer grievance, compliance officer) and a first process map of the complaint workflow.',
            stack: ['Claude', 'GitHub', 'A diagramming tool'],
          },
          {
            title: 'How Models Work — Tokens, Context & Why They Hallucinate',
            buildsOn: 'S1: you know what the client needs. Now you learn what a model can and cannot do reliably.',
            topics: ['LLM mechanics (tokens, context, sampling)', 'How models are trained and why they hallucinate', 'Model landscape and selection', 'Stakeholder mapping and contradictory asks', 'Claude as research and synthesis partner'],
            claude: 'Run the same complaint through three models and compare reasoning, output format and failure behaviour.',
            build: 'Lab: map where a complaint can be misrouted and what each error costs. Qualify 8 candidate uses, pick the first pilot and one thing to reject. Read back a 200-line repo in plain language.',
            stack: ['Claude', 'Claude Code', 'API console'],
          },
        ],
        assignment: {
          title: 'Opportunity Memo & Baselines',
          brief: 'Write the Case 1 Opportunity Memo: the process map, the 8 qualified uses with scores, the pilot you chose, the one use you reject and why, and baselines computed from the public complaint numbers.',
          deliverables: ['PDF or Doc: memo', 'Process map', 'Half-page executive summary for the client'],
          time: '4–5 hrs',
          feeds: 'Week 2: the pilot you chose becomes the triage engine you build and benchmark.',
        },
        milestone: {
          stage: 'Foundation checkpoint',
          due: ['Opportunity Memo with the process map and the 8 qualified uses', 'Chosen pilot, rejected use and written baselines', 'Project repository created with the synthetic complaint set'],
        },
        outcome: 'A framed, defensible pilot with written baselines. You can say why this pilot first, and what you refused to build.',
      },
      {
        n: 2,
        title: 'Model Behaviour, Prompting & Context',
        objective: 'Turn the chosen pilot into a working triage engine and prove it against a classical baseline, using prompts, schemas and context that you control.',
        shift: ['Prompt user', 'Prompt engineer'],
        sessions: [
          {
            title: 'Prompts, Schemas & Reasoning — Making Output Dependable',
            buildsOn: 'Week 1: the pilot and its baselines. Now you make the model produce structured, checkable output.',
            topics: ['System prompts and persona design', 'Structured outputs and schema enforcement', 'Reasoning models and thinking budgets', 'Reasoning patterns (CoT, ReAct, Reflexion)', 'Context budgeting and compaction'],
            claude: 'Claude with JSON-schema output returning category, issue count, maintainability reason, language, missing information, urgency, suggested team and confidence.',
            build: 'Triage engine v0 returning schema-valid JSON on a golden set of synthetic complaints in English, Hindi and Hinglish.',
            stack: ['Claude API', 'JSON Schema', 'Claude Code', 'Git'],
          },
          {
            title: 'Cost, Grounding & Benchmarks — Beating the Baseline',
            buildsOn: 'S1: the engine works. Now you measure it honestly against what the client could do without AI.',
            topics: ['Prompt caching and batching', 'Grounding and citations', 'Prompt versioning and regression', 'Multilingual and Indic model choices', 'LLM vs classical-baseline benchmark'],
            claude: 'Claude as labeller and error analyst. You verify every label it proposes.',
            build: 'Benchmark three models, a TF-IDF baseline and rules on the golden set; report cost per 1,000 complaints and p95 latency. Includes a 90-minute timed take-home.',
            stack: ['Claude API', 'A TF-IDF baseline', 'Git', 'A regression test'],
          },
        ],
        assignment: {
          title: 'Triage Engine & Benchmark Report',
          brief: 'Ship triage engine v0 in a prompt repo with a regression test. Report per-category F1 with confidence intervals, cost per 1,000 complaints and p95 latency, and write the top-10 failure catalogue.',
          deliverables: ['Repo link', 'Benchmark report', 'Half-page executive summary for the client'],
          time: '5–6 hrs',
          feeds: 'Case Defence 1 on Sunday. Week 3 reuses your repo discipline for Case 2.',
        },
        milestone: {
          stage: 'Finished project',
          due: ['Triage engine v0 returning schema-valid JSON', 'Benchmark report: three models, a TF-IDF baseline and rules', 'Prompt repo with a regression test', 'Top-10 failure catalogue'],
          gate: 'Case Defence 1',
        },
        outcome: 'A benchmarked engine and a failure catalogue that tells you exactly what to fix next.',
      },
    ],
  },
  {
    no: 2,
    weeks: 'Weeks 3–4',
    sector: 'Agriculture',
    title: 'Vetted-Answer Farm Advisory Copilot',
    project: 'Cited Farm Advisory Copilot',
    mode: 'Built from scratch',
    context: 'Digital Green and Gooey.AI built Farmer.Chat, a GPT-4-based assistant trained only on trusted, local resources (farmer videos, government extension documents, call-centre transcripts and manuals). It accepts text, audio and images in languages including Hindi, Telugu and Bhojpuri, and was piloted with extension workers before being scaled to farmers. OpenAI’s customer story gives early estimates that it could cut extension cost from $35 to $0.35 per farmer; that is a claim, not a measured result. Wadhwani AI has also explored generative AI for Kisan call centres.',
    ask: 'An agricultural extension programme (programme head and a state extension officer, played by mentors) wants a copilot, first for extension agents and later for farmers. It must answer only from vetted package-of-practices documents, in local languages, with sources, and say "I don’t know" when the material does not cover a question.',
    brief: [
      { k: 'Data kit', v: 'Public-style crop advisories in PDF (some scanned, some conflicting between seasons), synthetic call-centre transcripts, a small video-transcript set, and synthetic farmer profiles.' },
      { k: 'Constraints', v: 'Pesticide and dosage questions must cite a source and point to a human officer. Farmer phone numbers and IDs are protected (DPDP basics). The system must be usable by agents with low-end phones.' },
      { k: 'Objective', v: 'Ship a console and a copilot that answers only from vetted sources, cites every claim and abstains correctly.' },
      { k: 'Hidden scenarios', v: 'Examples of the ~10 you will not see: a Hindi query with spelling variants · two advisories that disagree by season · a question the corpus cannot answer · a dosage question · a farmer who shares an ID number · a stale advisory after an update.' },
      { k: 'Success', v: 'Faithfulness ≥ 90% on answerable questions, ≥ 85% correct abstention, every claim cited.' },
      { k: 'Curveball', v: 'A new advisory replaces an old one and stale answers must disappear within an hour.', hot: true },
      { k: 'Builder / Engineer', v: 'Builder: provided pipeline skeleton. Engineer: writes the retriever and reranker and adds a knowledge-graph path.' },
      { k: 'Time', v: '8 live + 16 outside hours.' },
    ],
    defence: 'Why your chunking and embedding choices, and show one retrieval failure and your fix.',
    tools: ['Claude Code', 'Postgres', 'pgvector', 'Qdrant', 'Neo4j', 'OCR'],
    weekList: [
      {
        n: 3,
        title: 'Build with Claude Code & Data Foundations',
        objective: 'Learn to direct Claude Code like a lead engineer — plan, implement, test and review — and stand up a full-stack console for the farm advisory case on a clean data foundation.',
        shift: ['Prompt engineer', 'Code director'],
        sessions: [
          {
            title: 'Claude Code Workflow — Plan, Implement, Test, Review',
            buildsOn: 'Weeks 1–2: you framed a problem and benchmarked an engine. Now you build full applications around the model.',
            topics: ['Claude Code workflow (CLAUDE.md, plan, implement, test)', 'Extending Claude Code (skills, subagents, hooks, plugins)', 'Full-stack app (UI, API, auth)', 'Git and diff review of AI-written code', 'Testing (unit, integration, test-first with AI)'],
            claude: 'Claude Code as implementer. You write the plan and review every diff before it merges.',
            build: 'Break-it lab: a seeded repo with 5 bugs, a leaked key and one hallucinated dependency. Find them, fix them and write a postmortem.',
            stack: ['Claude Code', 'Git', 'GitHub'],
          },
          {
            title: 'Data Foundations — Schemas, Ingestion, PII & UX',
            buildsOn: 'S1: you can direct and review code. Now the data underneath it has to be trustworthy and protected.',
            topics: ['SQL, schema design, data modelling', 'Data quality and ingestion', 'PII classification and DPDP basics', 'AI UX (confidence, fallbacks, feedback)', 'PRD-lite and SOW-lite'],
            claude: 'Claude drafts schemas, validators and the PRD-lite. You decide what counts as PII.',
            build: 'The extension-agent console: login, document library, question screen, feedback buttons, a Postgres schema with PII tagged, validated ingestion, CI and a deployed URL.',
            stack: ['Postgres', 'Claude Code', 'CI', 'A hosting service'],
          },
        ],
        assignment: {
          title: 'Extension-Agent Console & Seeded-Repo Postmortem',
          brief: 'Deploy the console with a PII-tagged schema and validated ingestion. Write the postmortem of the seeded-repo lab: the 5 bugs, the leaked key and the hallucinated dependency.',
          deliverables: ['Deployed URL', 'Repo link', 'Postmortem', 'Half-page executive summary for the client'],
          time: '6–7 hrs',
          feeds: 'Week 4 adds the retrieval layer and the abstaining copilot inside this console.',
        },
        milestone: {
          stage: 'Foundation checkpoint',
          due: ['Extension-agent console deployed, with login and document library', 'PII-tagged Postgres schema and validated ingestion', 'Seeded-repo postmortem'],
        },
        outcome: 'A deployed console you can extend, and proof that you catch what AI-written code gets wrong.',
      },
      {
        n: 4,
        title: 'Knowledge & Retrieval',
        objective: 'Give the console a knowledge layer that answers only from vetted documents, cites every claim and says "I don’t know" when the corpus is silent.',
        shift: ['Console builder', 'Retrieval engineer'],
        sessions: [
          {
            title: 'Ingest & Index — Parsing, Chunking & Embeddings',
            buildsOn: 'Week 3: the console and a clean schema. Now the messy advisories have to become searchable knowledge.',
            topics: ['Parsing and ingestion (PDF, OCR, tables)', 'Chunking', 'Embeddings and model choice', 'Vector stores and ANN', 'Freshness, dedup and conflicting sources'],
            claude: 'Claude extracts tables and normalises scanned advisories. You sample-check the extraction.',
            build: 'Ingest the messy advisories (some scanned, some conflicting between seasons) into a vector store with source and date metadata.',
            stack: ['pgvector', 'Qdrant', 'An OCR tool', 'Claude'],
          },
          {
            title: 'Retrieve, Cite & Abstain — Hybrid Search, Reranking & Failure Analysis',
            buildsOn: 'S1: the knowledge is indexed. Now answers must be grounded, cited and refused when unsupported.',
            topics: ['Hybrid search and reranking', 'Citations and grounded answers', 'Retrieval metrics and failure analysis', 'Query rewriting and agentic RAG', 'Knowledge graphs'],
            claude: 'Claude generates answers constrained to retrieved passages and refuses when evidence is absent.',
            build: 'Retrieval bake-off (3 chunking strategies × 2 embeddings × reranking on/off, 100 questions), then a 60-minute timed sprint on a new crop’s documents. Ship the cited, abstaining copilot inside the console.',
            stack: ['pgvector', 'Qdrant', 'A reranker', 'Neo4j (optional graph path)'],
          },
        ],
        assignment: {
          title: 'Cited Copilot & Bake-off Report',
          brief: 'Deliver the cited, abstaining copilot, the bake-off report, a PRD-lite and SOW-lite, and a rollout plan that puts extension agents first and farmers second.',
          deliverables: ['Deployed copilot', 'Repo', 'Report', 'Half-page executive summary for the client'],
          time: '6–7 hrs',
          feeds: 'Case Defence 2 on Sunday. Week 5 turns retrieval into one tool among several that an agent can call.',
        },
        milestone: {
          stage: 'Finished project',
          due: ['Cited, abstaining copilot running inside the console', 'Retrieval bake-off report on 100 questions', 'PRD-lite and SOW-lite', 'Rollout plan: extension agents first, farmers second'],
          gate: 'Case Defence 2',
        },
        outcome: 'A copilot that tells you what it knows, where it learned it and when it does not know.',
      },
    ],
  },
  {
    no: 3,
    weeks: 'Weeks 5–6',
    sector: 'SME finance',
    title: 'GST Input-Credit Reconciliation Agent',
    project: 'Reconciliation Agent and Public MCP Server',
    mode: 'Built from scratch',
    context: 'GSTR-2B is a static monthly statement. Mismatches commonly arise when suppliers file GSTR-1 late (pushing credit to the next cycle), report B2B invoices as B2C, or lack a valid IRN, and the fix is to ask suppliers to amend. Reconciliation is best done monthly, before filing GSTR-3B, and a supplier’s credit note reduces the available credit. Credit that goes unreconciled can be lost permanently, so this is a recurring chase-and-verify workload for SME finance teams. GST rules change often, so a chartered accountant reviews this brief before each cohort.',
    ask: 'A finance controller and a chartered accountant (played by mentors) want an agent that reconciles the purchase register against GSTR-2B each month, explains every mismatch, chases suppliers and prepares a review pack. It never files returns and never decides credit eligibility. A human approves every credit decision.',
    brief: [
      { k: 'Data kit', v: 'Synthetic purchase register (spreadsheet export), GSTR-2B-style JSON, a supplier master with contacts, a sandbox ERP, and a WhatsApp and email sandbox.' },
      { k: 'Constraints', v: 'No credit decision without human approval. No return is ever filed by the agent. Every supplier message is logged and sent at most once.' },
      { k: 'Objective', v: 'Ship a reconciliation agent behind a published MCP server, with approval gates and safe integrations.' },
      { k: 'Hidden scenarios', v: 'Examples of the ~10 you will not see: a GSTIN typo · an invoice that lands in next month’s statement · a credit note · a duplicate register line · a supplier who says "already paid" with no proof · a request to "just claim it" · a duplicate webhook.' },
      { k: 'Success', v: 'Zero credit decisions without human approval, zero double-sent supplier messages, mismatch explanations reviewed by the pod’s "accountant".' },
      { k: 'Curveball', v: 'The ERP goes down on filing day.', hot: true },
      { k: 'Builder / Engineer', v: 'Builder: agent scaffold and n8n templates. Engineer: writes the webhook receiver, queue and a connector.' },
      { k: 'Time', v: '8 live + 15 outside hours. Gate: the mid-point defence closes this block.' },
    ],
    defence: 'Why this autonomy boundary, and what happens when a supplier lies.',
    tools: ['Claude Agent SDK', 'MCP', 'n8n', 'REST & OAuth2', 'WhatsApp sandbox', 'GitHub'],
    weekList: [
      {
        n: 5,
        title: 'Agent Architecture & Memory',
        objective: 'Design an agent with typed tools, bounded autonomy and human approvals, and publish its tools as an MCP server.',
        shift: ['Retrieval engineer', 'Agent designer'],
        sessions: [
          {
            title: 'Agent Architecture — Tools, Loops & Autonomy Boundaries',
            buildsOn: 'Week 4: retrieval as a single capability. Now you let a model take actions, within limits you set.',
            topics: ['Tool design and schemas', 'Agent loop and bounded autonomy', 'Workflow vs agent decision', 'Human-in-the-loop approvals', 'Failure handling'],
            claude: 'Claude Agent SDK and tool use: the model proposes, deterministic code executes, a human approves.',
            build: 'Typed tools (load_register, load_2b, match_invoices, explain_mismatch, draft_supplier_message, log_decision), with rules-first matching and the LLM reserved for exceptions.',
            stack: ['Claude Agent SDK', 'Claude API tool use', 'Git'],
          },
          {
            title: 'MCP & Memory — Publishing Your Tools',
            buildsOn: 'S1: the tools exist. Now they become a reusable, permissioned server and the agent gets memory.',
            topics: ['Building an MCP server (2026-07-28 stateless spec)', 'MCP authorization and tool permissions', 'Short-term and long-term memory', 'Durable workflows', 'Computer-use and browser agents for systems without APIs'],
            claude: 'Claude Code scaffolds the server. You write the permission model and the approval gates.',
            build: 'Publish the MCP server on GitHub with approval gates, a kill switch and a trust-boundary diagram with SLAs.',
            stack: ['MCP', 'Claude Code', 'GitHub'],
          },
        ],
        assignment: {
          title: 'Public MCP Server & Trust-Boundary Diagram',
          brief: 'Publish the reconciliation tools as an MCP server with typed schemas, approval gates and a kill switch, and draw the trust-boundary diagram with the SLAs each boundary carries.',
          deliverables: ['GitHub link', 'Diagram', 'Half-page executive summary for the client'],
          time: '6–7 hrs',
          feeds: 'Week 6 adds a supervisor, a supplier-comms agent and a reviewer, and connects them to enterprise systems.',
        },
        milestone: {
          stage: 'Foundation checkpoint',
          due: ['Typed reconciliation tools with rules-first matching', 'MCP server published on GitHub', 'Approval gates, kill switch and trust-boundary diagram'],
        },
        outcome: 'A public MCP server and a clear answer to where the agent stops and a person starts.',
      },
      {
        n: 6,
        title: 'Multi-Agent & Enterprise Integration',
        objective: 'Orchestrate several agents against messy enterprise systems, and make every integration idempotent, observable and safe to retry.',
        shift: ['Agent designer', 'Integration engineer'],
        sessions: [
          {
            title: 'Multi-Agent Patterns — Supervisor, Sub-agents & Shared State',
            buildsOn: 'Week 5: one agent with typed tools. Now several agents with different jobs.',
            topics: ['Multi-agent patterns (router, supervisor, parallel, handoff)', 'Subagents and the Claude Agent SDK', 'Shared state and communication', 'Channels (WhatsApp, email)', 'Integration testing with sandboxes'],
            claude: 'Claude Agent SDK subagents: a matcher, a supplier-comms agent and a reviewer coordinated by a supervisor.',
            build: 'A supervisor with a matcher, a supplier-comms agent and a reviewer, tested against the sandbox ERP and the WhatsApp and email sandboxes.',
            stack: ['Claude Agent SDK', 'MCP', 'Sandboxes'],
          },
          {
            title: 'Enterprise Integration — Webhooks, Queues & Legacy Systems',
            buildsOn: 'S1: the agents coordinate. Now the outside world retries, duplicates and fails.',
            topics: ['REST/GraphQL, webhooks, idempotency', 'OAuth2 and connectors', 'Workflow orchestration and queues (n8n)', 'Legacy systems (SOAP/XML, SQL Server)', 'Rate limits, backoff, dead-letter handling'],
            claude: 'Claude reads an unfamiliar codebase and drafts the audit, but you own the fix plan.',
            build: 'Lab: inherit an undocumented reconciliation script, audit it and write a safe fix plan first. Then build an idempotent webhook receiver and queue for supplier replies, an ERP lookup and a human handoff pack.',
            stack: ['n8n', 'REST', 'OAuth2', 'Sandbox ERP', 'Queue'],
          },
        ],
        assignment: {
          title: 'Supervisor System, Review Pack & Integration Tests',
          brief: 'Deliver the supervisor system, the review pack template, the integration test pack and the runbook. Show that a duplicate webhook cannot double-send a supplier message.',
          deliverables: ['Repo', 'Test pack', 'Runbook', 'Half-page executive summary for the client'],
          time: '6–7 hrs',
          feeds: 'Mid-point defence on Sunday. Week 7 moves from building to judging whether an AI system is good enough.',
        },
        milestone: {
          stage: 'Finished project',
          due: ['Supervisor system with matcher, supplier-comms agent and reviewer', 'Review pack template and integration test pack', 'Runbook', 'Evidence that a duplicate webhook cannot double-send'],
          gate: 'Mid-point defence and Case Defence 3',
        },
        outcome: 'An agent system that survives retries, duplicates and an unavailable ERP.',
      },
    ],
  },
  {
    no: 4,
    weeks: 'Weeks 7–8',
    sector: 'Health insurance',
    title: 'Certify a Health Pre-Authorisation Review Assistant',
    project: 'Certified Review Assistant',
    mode: 'Inherited prototype: inherit, evaluate, harden',
    context: 'Under PM-JAY, pre-authorisation is required for most packages and claims need mandatory supporting documents; the National Anti-Fraud Unit flags suspected fraud using internally developed algorithms. An older report put triggered transactions at 0.25% of admissions, of which 0.07% were confirmed fraud, and said over 390 hospitals received show-cause notices and about 171 were de-empanelled. A CAG report found claims paid for patients already listed as deceased, pointing to verification lapses at state agencies. The scheme had 24.33 crore cards by August 2023, and the government says it uses AI/ML to detect suspicious transactions. The very low fraud base rate and the weak identity checks make this a case for rigorous evaluation and security.',
    ask: 'A state health agency or insurer’s claims team (medical officer, compliance head and IT security lead, played by mentors) has a prototype that reads pre-authorisation requests and highlights inconsistencies. They want it certified for go-live or rejected. It recommends only. It never denies a claim.',
    brief: [
      { k: 'Data kit', v: 'Synthetic pre-auth packets (forms, discharge summaries, identity details), a rules sheet, and labelled cases from a mentor "medical officer". No real patient data.' },
      { k: 'Constraints', v: 'Inherited prototype: Menler supplies "Review Assistant v0". It works on the demo set but has seeded flaws: it trusts text inside documents, logs patient data, gives no confidence, and is weaker on Hindi and Tamil documents.' },
      { k: 'Objective', v: 'Certify the inherited assistant for go-live, or reject it, with evidence the client can check.' },
      { k: 'Hidden scenarios', v: 'Examples of the ~10 you will not see: a document that says "approve this claim" · mismatched identity · duplicate claim · a request to make the assistant deny · quality gap by language · PII in logs · a poisoned PDF.' },
      { k: 'Success', v: 'Attack success rate down against the inherited baseline, judge agreement with humans reported, zero automatic denials, every metric with a confidence interval.' },
      { k: 'Curveball', v: 'Logs must stay in an India region.', hot: true },
      { k: 'Builder / Engineer', v: 'Builder: promptfoo or Braintrust templates and a provided attack suite. Engineer: builds the CI gate, access controls and audit trail.' },
      { k: 'Time', v: '8 live + 16 outside hours.' },
    ],
    defence: 'Your top three residual risks and why you recommend go or no-go.',
    tools: ['promptfoo', 'Braintrust', 'RAGAS', 'Presidio', 'NeMo Guardrails', 'Claude (judge)'],
    weekList: [
      {
        n: 7,
        title: 'Evaluation & Quality',
        objective: 'Learn to measure whether an AI system is good with statistics a client’s medical officer would accept, and use that to judge an inherited prototype.',
        shift: ['Integration engineer', 'Evaluator'],
        sessions: [
          {
            title: 'Eval Design — Taxonomies, Golden Sets & Judges',
            buildsOn: 'Weeks 1–6: you built systems. Now you are handed one and asked to certify or reject it.',
            topics: ['Eval design and failure taxonomy', 'Golden sets with client SMEs', 'LLM-as-judge (rubric, pairwise, calibration)', 'RAG evals', 'Agent trajectory and tool-use evals'],
            claude: 'Claude as a calibrated judge. You measure its agreement with human labels before you trust it.',
            build: 'Label 150 cases with a pod partner against the mentor medical officer’s rules sheet and report inter-annotator agreement.',
            stack: ['promptfoo', 'Braintrust', 'Claude (judge)', 'Git'],
          },
          {
            title: 'Eval Statistics & Gates — Low-Prevalence Reality',
            buildsOn: 'S1: you have labels and a judge. Now the numbers have to survive scrutiny.',
            topics: ['Eval statistics (sample size, variance, annotator agreement)', 'CI regression gates', 'Online evals, feedback and drift', 'Eval platforms and experiment tracking', 'Reporting quality to a client'],
            claude: 'Claude drafts the quality report. You check every figure and every interval.',
            build: 'Eval harness for a low-prevalence problem (precision at a 0.07% base rate, review workload), sliced by language, hospital type and package. Audit a vendor’s "95% accuracy" claim and write the rebuttal.',
            stack: ['promptfoo', 'Braintrust', 'RAGAS', 'CI'],
          },
        ],
        assignment: {
          title: 'Eval Harness, Calibrated Judge & Vendor-Claim Rebuttal',
          brief: 'Deliver the eval harness, the calibrated judge with its human-agreement figure, a quality report with confidence intervals on every metric, and the written rebuttal of the vendor’s accuracy claim.',
          deliverables: ['Repo', 'Report', 'Rebuttal', 'Half-page executive summary for the client'],
          time: '6–7 hrs',
          feeds: 'Week 8: the failures you found become the attack surface you harden.',
        },
        milestone: {
          stage: 'Foundation checkpoint',
          due: ['150 labelled cases and annotator agreement', 'Eval harness for the low-prevalence problem', 'Calibrated judge with its human-agreement figure', 'Vendor-claim rebuttal'],
        },
        outcome: 'A defensible quality verdict, with the uncertainty stated, for a problem where accuracy alone is meaningless.',
      },
      {
        n: 8,
        title: 'Safety, Security & Governance',
        objective: 'Threat-model the inherited assistant, attack it, harden it, and decide with evidence whether it should go live.',
        shift: ['Evaluator', 'Risk owner'],
        sessions: [
          {
            title: 'Threats & Attacks — Injection, Tool Abuse & the War Room',
            buildsOn: 'Week 7: you know how good the prototype is. Now you find out how it breaks under attack.',
            topics: ['Threat modelling (OWASP LLM Top 10)', 'Prompt injection, direct and indirect', 'Red-team method and war room', 'Tool abuse, least privilege, blast radius', 'Bias, fairness, abuse testing'],
            claude: 'Claude as attacker and as defender, in separate sessions with separate instructions.',
            build: 'A 15-threat model and 40 attacks, including instructions hidden in a discharge summary, an identity mismatch and duplicate claims across hospitals.',
            stack: ['Attack suite', 'promptfoo', 'Claude'],
          },
          {
            title: 'Controls & Governance — Guardrails, Access & DPDP',
            buildsOn: 'S1: you have a ranked list of failures. Now you add controls and write the decision.',
            topics: ['Guardrails and PII redaction', 'Identity and permissions (RBAC, permission-aware retrieval)', 'Data residency, retention, DPDP and sector rules', 'Audit trails, lineage, explainability', 'Risk review and security questionnaire'],
            claude: 'Claude drafts the DPDP impact assessment and security questionnaire. You verify against the actual system. DPDP Rules were notified in November 2025, with obligations phasing in over 18 months to about May 2027; breach reporting within 72 hours is among them.',
            build: 'Guardrails, PII-free logs, role-based access, an immutable audit trail and a DPDP impact assessment. War room: pods attack each other’s hardened versions.',
            stack: ['Presidio', 'NeMo Guardrails', 'RBAC', 'Audit log'],
          },
        ],
        assignment: {
          title: 'Hardened Assistant & Go / No-go Certification Memo',
          brief: 'Deliver the hardened assistant, the threat model, the risk register, the completed security questionnaire and a go / no-go certification memo for the client naming your top three residual risks.',
          deliverables: ['Repo', 'Certification memo (PDF)', 'Half-page executive summary for the client'],
          time: '6–7 hrs',
          feeds: 'Case Defence 4 on Sunday. Week 9 takes a different inherited prototype from a laptop to production.',
        },
        milestone: {
          stage: 'Finished project',
          due: ['Hardened assistant with guardrails, RBAC and audit trail', '15-threat model, 40 attacks and risk register', 'Security questionnaire and DPDP impact assessment', 'Go / no-go certification memo'],
          gate: 'War room and Case Defence 4',
        },
        outcome: 'A signed recommendation you can defend, including when the honest answer is no-go.',
      },
    ],
  },
  {
    no: 5,
    weeks: 'Weeks 9–10',
    sector: 'E-commerce logistics',
    title: 'Recover Failed Deliveries for a D2C Brand',
    project: 'Production NDR Recovery System',
    mode: 'Inherited prototype: inherit, deploy, prove ROI',
    context: 'Roughly 60–65% of Indian e-commerce orders are cash on delivery. A failed delivery raises an NDR (non-delivery report), and a common practice is a 24-hour response SLA with escalation after the second failed attempt. Typical RTO rates in India run about 20–30%, though they vary by category, region and payment mix. A logistics vendor claims automated NDR workflows can recover 30–40% of failed deliveries. That is a vendor claim, so learners must measure real lift.',
    ask: 'A D2C brand’s logistics and CX head and its finance lead (played by mentors) want an outreach agent. On an NDR event it contacts the customer on WhatsApp or voice to confirm address, time and COD intent, tells the courier to reattempt, and hands off to a human when needed. They want it live, reliable and proven worth its cost.',
    brief: [
      { k: 'Data kit', v: 'A synthetic NDR event generator (reason codes, COD or prepaid, pincodes, attempt counts), a courier webhook simulator, a WhatsApp sandbox and per-message costs.' },
      { k: 'Constraints', v: 'Inherited prototype: Menler supplies "NDR Outreach v0". It works on a laptop with no monitoring, no cost limits, no opt-out handling and one hard-coded message. WhatsApp opt-in, template approval and opt-out handling apply, and the live pilot needs a consent notice.' },
      { k: 'Objective', v: 'Take the inherited prototype to production and prove incremental recovery and ROI.' },
      { k: 'Hidden scenarios', v: 'Examples of the ~10 you will not see: a customer replies "STOP" · "call me tomorrow" at 11 pm · a cancellation request mid-NDR · an address change after the courier cut-off · template rejection or rate limiting · a 10× festive-season spike · duplicate courier webhooks.' },
      { k: 'Success', v: 'p95 latency within SLO, recovery lift against holdout with a confidence interval, cost per recovered shipment under the margin at risk, opt-outs honoured immediately.' },
      { k: 'Curveball', v: 'The client’s budget is cut by 60%.', hot: true },
      { k: 'Builder / Engineer', v: 'Builder: deploy template and managed hosting. Engineer: writes the pipeline and OpenTelemetry instrumentation.' },
      { k: 'Time', v: '8 live + 16 outside hours.' },
    ],
    defence: 'A CFO panel on every number in your ROI model, and a recorded handover another pod can follow.',
    tools: ['Docker', 'GitHub Actions', 'OpenTelemetry', 'Phoenix', 'Langfuse', 'WhatsApp sandbox'],
    weekList: [
      {
        n: 9,
        title: 'Deploy & Operate',
        objective: 'Take an inherited prototype from a laptop to a monitored, cost-capped, rollback-ready service, and run it against real conversations.',
        shift: ['Risk owner', 'Operator'],
        sessions: [
          {
            title: 'Ship It — Containers, CI/CD & Cloud',
            buildsOn: 'Weeks 7–8: you judged and hardened. Now you make something runnable by someone else, safely.',
            topics: ['Environments, secrets, config', 'Docker', 'CI/CD', 'Cloud deployment with IAM and networking basics', 'Release safety (canary, A/B, shadow, rollback)'],
            claude: 'Claude Code writes the Dockerfile and pipeline. You decide the gates and own the rollback.',
            build: 'Containerise NDR Outreach v0, add CI/CD with eval and security gates, canary a new message variant and roll back in under 5 minutes.',
            stack: ['Docker', 'GitHub Actions', 'A cloud host'],
          },
          {
            title: 'Run It — Observability, SLOs, Cost & Incidents',
            buildsOn: 'S1: the system is deployed. Now you prove you can see it, afford it and fix it.',
            topics: ['Observability (logs, traces, token and latency metrics)', 'SLOs, error budgets, alerting', 'Cost control (caching, batching, routing, budget guards)', 'Incident response and postmortems', 'UAT plan, runbook, operational handoff'],
            claude: 'Claude summarises traces during the incident drill. You make the call.',
            build: 'Dashboards (latency, cost per event, response rate), the 24-hour NDR SLO, budget caps and a kill switch. Live incident drill: provider outage plus a cost spike. Live pilot: one week on a real design-partner store if available; otherwise Menler’s own consented WhatsApp follow-up flows run the same event → message → outcome pipeline.',
            stack: ['OpenTelemetry', 'Phoenix', 'Langfuse', 'WhatsApp sandbox'],
          },
        ],
        assignment: {
          title: 'Deployed Pipeline, Dashboards & Pilot Postmortem',
          brief: 'Deliver the deployed pipeline with CI gates, the latency / cost / response dashboards, the budget caps and kill switch, and a postmortem covering the incident drill and the live pilot.',
          deliverables: ['Deployed URL', 'Dashboards', 'Postmortem', 'Half-page executive summary for the client'],
          time: '6–7 hrs',
          feeds: 'Week 10 turns the pilot data into an ROI argument and a handover.',
        },
        milestone: {
          stage: 'Foundation checkpoint',
          due: ['Containerised pipeline with CI/CD, eval and security gates', 'Latency, cost and response dashboards', 'Budget caps and kill switch', 'Incident drill and live pilot notes'],
        },
        outcome: 'A production system with an SLO, a budget, a rollback and a postmortem.',
      },
      {
        n: 10,
        title: 'Economics, Delivery & Ownership',
        objective: 'Prove that the system pays for itself, negotiate the commercial terms, and hand it over so that another team can run it.',
        shift: ['Operator', 'Owner'],
        sessions: [
          {
            title: 'Economics & Evidence — Unit Costs, Routing & ROI',
            buildsOn: 'Week 9: a running pilot with data. Now you turn data into a business case.',
            topics: ['Model selection matrix and routing', 'Unit economics per request', 'ROI proof and business case', 'Vendor and model risk, and the fine-tune vs RAG vs prompt decision', 'Adoption metrics and change management'],
            claude: 'Claude as spreadsheet and sensitivity-analysis partner. You own every assumption.',
            build: 'An A/B test with a holdout to measure incremental recovery rather than reply rate; an ROI model (cost per recovered shipment vs forward and return shipping cost; best, base, worst cases); a routing recommendation.',
            stack: ['A spreadsheet', 'Claude', 'Experiment notebook'],
          },
          {
            title: 'Delivery & Ownership — SOW, Negotiation & Handover',
            buildsOn: 'S1: the numbers are defensible. Now you commit to terms and make the system someone else’s.',
            topics: ['SOW, commercials, pricing negotiation', 'Executive readout', 'Handover and enablement', 'Account expansion', 'Legal, IP and licensing awareness'],
            claude: 'Claude drafts the SOW and training script. You negotiate and you present.',
            build: 'A phase-2 SOW, a handover pack (runbook, admin guide, recorded 20-minute training), a scored roadmap of 3 next uses, and a negotiation of scope and price with a real SMB owner.',
            stack: ['Claude', 'Screen recorder', 'Docs'],
          },
        ],
        assignment: {
          title: 'ROI Model, SOW & Handover Pack',
          brief: 'Deliver the ROI model, the phase-2 SOW, the executive readout, the handover pack with the recorded training, and one written case study of the engagement.',
          deliverables: ['Pack of documents', 'Recording', 'Half-page executive summary for the client'],
          time: '6–7 hrs',
          feeds: 'Case Defence 5 on Sunday (a CFO panel). Week 11 starts the capstone on a fresh brief.',
        },
        milestone: {
          stage: 'Finished project',
          due: ['A/B test with holdout and ROI model', 'Phase-2 SOW and executive readout', 'Handover pack with recorded 20-minute training', 'Written case study'],
          gate: 'Case Defence 5, a CFO panel',
        },
        outcome: 'A system a client can run, a number a CFO can check, and a contract you negotiated yourself.',
      },
    ],
  },
  {
    no: 6,
    weeks: 'Weeks 11–12',
    sector: 'Capstone',
    title: 'Capstone: A Fresh Brief',
    project: 'Capstone Engagement',
    mode: 'No starter prototype',
    context: 'Pods pick one brief and run the full lifecycle: Discover, Design, Build, Harden, Deliver. There is no starter prototype. The pod agrees scope with a client role inside a 48-hour discovery window, then builds against hidden scenarios.',
    briefs: [
      {
        k: 'Brief A',
        t: 'Member claim-readiness assistant for a provident-fund body',
        d: 'EPFO processed over 5.08 crore claims in FY2024-25, with auto-settled claims roughly doubling to 1.87 crore. Rejection reasons were cut from 44 to 18, and the auto-settlement limit for several advance types rose to Rs 5 lakh. Settlement time fell from about 10 days to 3–4 days, and the main complaint themes were changes to personal details and fund withdrawals. Build: a checker that tells a member why a claim is likely to be rejected (name, date-of-birth, KYC mismatches) and what to fix, plus an exception-triage queue for staff. It explains and routes but never approves or rejects.',
      },
      {
        k: 'Brief B',
        t: 'Judgment research assistant for district-court users',
        d: 'As of 31 December 2025, 4,76,57,328 cases were pending in district and subordinate courts and 63,66,023 in High Courts. SUVAS is an AI tool that translates Supreme Court judgments into regional languages. Build: a retrieval and summary assistant over a public judgments corpus with verified citations only: every case name and quote must exist in the corpus, otherwise the assistant says so. It is a research aid, not legal advice. Check the licence terms of any corpus first.',
      },
      {
        k: 'Brief C',
        t: 'Seller-side grievance copilot for the ONDC network',
        d: 'ONDC’s Issue and Grievance Management framework went live on 1 September 2023 with online dispute resolution. It has three stages: internal resolution, the network participant’s grievance redress officer, then online dispute resolution. A network-policy summary lists a first-level expectation of 2 hours to respond and 24 hours to offer a resolution. An official IGM SDK exists for Node. Build: a copilot that ingests issue events, classifies them, proposes responses inside the 2-hour window, gathers evidence from order and logistics systems, and escalates to the grievance officer.',
      },
      {
        k: 'Brief D',
        t: 'Bring your own client',
        d: 'A real employer or design partner, under confidentiality rules. The same phases, hidden-scenario discipline and defence apply. The pod agrees scope, data access and success measures with the client during the 48-hour discovery window.',
      },
    ],
    brief: [
      { k: 'Definition of done', v: 'The deployed system, runbook and executive readout are delivered and match the agreed SOW.' },
      { k: 'Hidden scenarios', v: 'The hidden scenario suite is passed.' },
      { k: 'Graduation', v: 'The 12 graduation questions are answered live.' },
      { k: 'Time', v: '8 live + 16 outside hours.' },
    ],
    defence: 'The change request is injected by an instructor, and the 12 graduation questions are answered live, followed by the next-build roadmap.',
    tools: ['Claude Code', 'Claude API', 'MCP', 'Eval harness', 'OpenTelemetry', 'CI'],
    weekList: [
      {
        n: 11,
        title: 'Capstone — Discover & Design',
        objective: 'Choose a brief, run a 48-hour discovery with a client role, and leave the week with a design you can be held to.',
        shift: ['Owner', 'Engagement lead'],
        sessions: [
          {
            title: 'Discover — Brief Selection, Client Interviews & Problem Brief',
            buildsOn: 'Weeks 1–10: six skills practised in blocks. Now you do the whole lifecycle on a fresh brief, with a pod.',
            topics: ['Select a capstone brief (A, B, C or bring your own client)', 'Run a 48-hour discovery window', 'Interview client roles and resolve contradictory asks', 'Write the problem brief and success measures', 'Agree scope and the SOW'],
            claude: 'Claude as research partner across the public sources for your brief. You verify every fact.',
            build: 'Kickoff and 48-hour discovery with a mentor-played client. Draft the problem brief and SOW.',
            stack: ['Claude', 'Public sources', 'Docs'],
          },
          {
            title: 'Design — Architecture, Threat Model & First Working Slice',
            buildsOn: 'S1: the problem is agreed. Now you commit to an architecture and show a first slice working.',
            topics: ['Architecture with architecture decision records', 'Threat model and risk register', 'Evaluation plan and hidden-scenario plan', 'Data plan', 'First working slice'],
            claude: 'Claude Code builds the first slice. You defend the architecture.',
            build: 'Design review with a mentor as CTO. Deliver the architecture with ADRs, threat model, eval plan, data plan, risk register and a first working slice. Curveball: a requirement change plus a data-quality problem.',
            stack: ['Claude Code', 'GitHub', 'Everything from Weeks 1–10'],
          },
        ],
        assignment: {
          title: 'Capstone Design Pack',
          brief: 'Deliver the problem brief, SOW, architecture with ADRs, threat model, eval plan, data plan, risk register and first working slice, and show how you handled the curveball.',
          deliverables: ['Design pack', 'Repo', 'Half-page executive summary for the client'],
          time: '7–8 hrs',
          feeds: 'Week 12: you build, harden and defend this design.',
        },
        milestone: {
          stage: 'Foundation checkpoint',
          due: ['Problem brief and SOW', 'Architecture with ADRs, threat model and risk register', 'Eval plan, data plan and hidden-scenario plan', 'First working slice'],
        },
        outcome: 'A design the client agreed to and the pod can be graded against.',
      },
      {
        n: 12,
        title: 'Capstone — Build, Harden & Demo Day',
        objective: 'Build, harden and deliver the capstone, then defend it live on Demo Day against a change request you have not seen.',
        shift: ['Engagement lead', 'AI FDE'],
        sessions: [
          {
            title: 'Build & Harden — Hidden Scenarios, Evals & Security',
            buildsOn: 'Week 11: an agreed design and a first slice. Now it has to survive scenarios you have not seen.',
            topics: ['Build against the hidden scenario suite', 'Run the eval harness and fix the top failures', 'Security review against the threat model', 'Deploy with tracing and cost controls', 'Write the runbook and executive summary'],
            claude: 'Claude Code accelerates the build. You decide what ships.',
            build: 'Build and harden clinic with mentors acting as client, security reviewer and CTO.',
            stack: ['Claude Code', 'Eval harness', 'OpenTelemetry', 'CI'],
          },
          {
            title: 'Demo Day — Demo, Live Defence & Executive Readout',
            buildsOn: 'S1: the system is hardened and deployed. Now you show it and answer for it.',
            topics: ['The 15-minute demo', 'The 15-minute live defence with an instructor-injected change request', 'Executive readout to an industry panel', 'The 12 graduation questions, answered live', 'The next-build roadmap'],
            claude: 'Claude as rehearsal partner for the panel questions. On stage, you answer alone.',
            build: 'Demo Day: 15-minute demo, 15-minute live defence with a change request, and an executive readout to an industry panel.',
            stack: ['Your deployed system', 'Your runbook'],
          },
        ],
        assignment: {
          title: 'Capstone Delivery — Ship, Show, Defend',
          brief: 'Deliver the deployed capstone, the runbook and the executive readout. Acceptance: the Definition of Done is met, the hidden scenario suite is passed and the 12 graduation questions are answered live.',
          deliverables: ['Deployed system', 'Runbook', 'Readout; live Demo Day', 'Half-page executive summary for the client'],
          time: '7–8 hrs',
          feeds: 'Graduation: the portfolio and the Scenario Library you keep.',
        },
        milestone: {
          stage: 'Finished project',
          due: ['Deployed system with tracing and cost controls', 'Runbook and executive readout', 'Hidden scenario suite passed', 'Demo Day and 12 graduation questions answered live'],
          gate: 'Demo Day',
        },
        outcome: 'A defended engagement from ambiguous brief to deployed system.',
      },
    ],
  },
];

export const FDE_WEIGHTS = [
  { k: 'Builds', v: 30 },
  { k: 'Technical understanding', v: 20 },
  { k: 'Evaluation and security', v: 15 },
  { k: 'FDE execution', v: 15 },
  { k: 'Production readiness', v: 10 },
  { k: 'Capstone presentation', v: 10 },
];

export const FDE_RUBRIC = [
  { k: 'Not yet', v: 'The work does not meet the acceptance criteria, or you cannot explain it. Resubmit and defend again.' },
  { k: 'Meets', v: 'The criteria are met and you can explain your component. A case started from a checkpoint repo is capped here.' },
  { k: 'Strong', v: 'The criteria are met with evidence, and you handle the live change request and hidden scenarios with sound reasoning.' },
  { k: 'Hire-ready', v: 'You could run this engagement with a client tomorrow: the numbers are defensible and the trade-offs are your own.' },
];

export const FDE_GATES = [
  { k: 'Case Defences', v: 'End of every two-week block, Cases 1 to 5.' },
  { k: 'Mid-point defence', v: 'Closes Case 3, at Week 6.' },
  { k: 'War room', v: 'Case 4: pods attack each other’s hardened assistants.' },
  { k: 'Incident drill', v: 'Case 5: a live provider outage plus a cost spike.' },
  { k: 'Demo Day', v: 'Capstone: demo, live defence and executive readout.' },
];

export const FDE_GRAD_QUESTIONS = [
  'What problem are you solving, and why does it need AI?',
  'Why this model and this architecture?',
  'Why RAG and not fine-tuning?',
  'Why an agent and not a plain workflow?',
  'How did you evaluate it, and how reliable is that number?',
  'What happens when it fails?',
  'How did you secure it?',
  'What does it cost per request?',
  'How do you trace and monitor it?',
  'How would you hand it over?',
  'What does the client do on day 30?',
  'What would you build next?',
];

// The competency register: C01–C100 are the ten taught weeks, ten each.
// Weeks 11–12 are the capstone, cleared at Demo Day rather than numbered
// (see the week's S1/S2 topics above).
export const FDE_COMPETENCIES = FDE_CASES
  .flatMap((c) => c.weekList)
  .filter((w) => w.n <= 10)
  .map((w) => ({
    n: w.n,
    title: w.title,
    items: w.sessions.flatMap((s) => s.topics),
  }));

export const FDE_TOOLKIT = [
  {
    group: 'Claude platform',
    items: [
      { t: 'Claude API', d: 'Structured output, tool use, caching and batching. The model behind every build.', wk: 'Wk 2–12' },
      { t: 'Claude Code', d: 'Directs plan, implement, test and review; extended with skills, subagents, hooks and plugins.', wk: 'Wk 1–12' },
      { t: 'Claude Agent SDK', d: 'Builds agents and subagents with typed tools and bounded autonomy.', wk: 'Wk 5–6' },
      { t: 'MCP', d: 'Publishes your tools as a permissioned server any compatible client can use (2026-07-28 spec).', wk: 'Wk 5–6' },
    ],
  },
  {
    group: 'Data & retrieval',
    items: [
      { t: 'Postgres + pgvector', d: 'Relational schema, PII tagging and vector search in one place.', wk: 'Wk 3–4' },
      { t: 'Qdrant', d: 'A dedicated vector store for comparison against pgvector in the retrieval bake-off.', wk: 'Wk 4' },
      { t: 'Neo4j', d: 'Optional graph path for linked knowledge in the farm advisory case.', wk: 'Wk 4' },
      { t: 'OCR tooling', d: 'Turns scanned advisories into text, with sample checks on accuracy.', wk: 'Wk 4' },
    ],
  },
  {
    group: 'Orchestration & integration',
    items: [
      { t: 'n8n', d: 'Workflow automation for queues, webhooks and supplier follow-ups.', wk: 'Wk 6' },
      { t: 'REST, webhooks, OAuth2', d: 'The connective tissue to enterprise systems, with idempotency and retries.', wk: 'Wk 6, 9' },
      { t: 'WhatsApp / email sandboxes', d: 'Safe channels for outreach agents before anything reaches a real customer.', wk: 'Wk 6, 9' },
    ],
  },
  {
    group: 'Evaluation & safety',
    items: [
      { t: 'promptfoo · Braintrust', d: 'Regression suites, experiment tracking and CI gates.', wk: 'Wk 2, 7–8' },
      { t: 'RAGAS', d: 'Metrics for retrieval and grounded answers.', wk: 'Wk 7' },
      { t: 'Presidio', d: 'Detects and redacts personal data before it reaches logs.', wk: 'Wk 8' },
      { t: 'NeMo Guardrails', d: 'Policy rails on inputs, outputs and tool calls.', wk: 'Wk 8' },
    ],
  },
  {
    group: 'Delivery & operations',
    items: [
      { t: 'Docker · GitHub Actions', d: 'Containers and pipelines with eval and security gates before release.', wk: 'Wk 9' },
      { t: 'OpenTelemetry', d: 'Traces, token counts and latency across the whole system.', wk: 'Wk 9, 12' },
      { t: 'Phoenix · Langfuse', d: 'Trace review and cost monitoring for LLM calls.', wk: 'Wk 9' },
      { t: 'Cloud host', d: 'IAM, networking basics and a deployed environment with a rollback.', wk: 'Wk 3, 9' },
    ],
  },
  {
    group: 'Collaboration',
    items: [
      { t: 'GitHub', d: 'Repos, pull requests and diff review of AI-written code.', wk: 'Wk 1–12' },
      { t: 'Docs and spreadsheets', d: 'Memos, SOWs, ROI models and executive summaries.', wk: 'Wk 1–12' },
    ],
  },
];

export const FDE_GROUND_RULES = [
  { k: 'Synthetic data', v: 'All case data is synthetic. No real taxpayer, patient, farmer, customer or citizen data is used in any case.' },
  { k: 'Independent briefs', v: 'Briefs are Menler-authored from public information. No engagement with, or endorsement by, any named body is implied.' },
  { k: 'Recommend, never decide', v: 'Systems in the health, tax and claims cases recommend and explain. They never deny claims, file returns or decide eligibility. A human decides.' },
  { k: 'Messaging consent', v: 'Case 5 needs WhatsApp opt-in, template approval, immediate opt-out handling and a consent notice for any live pilot.' },
  { k: 'Licensing', v: 'The court-judgments capstone brief requires a licence check on the corpus before any data is used.' },
  { k: 'Time-sensitive rules', v: 'GST rules change often and a chartered accountant reviews Case 3 before each cohort. DPDP obligations phase in to about May 2027.' },
  { k: 'Verified sources', v: 'Statistics from vendors or secondary sources are labelled as claims, and you are taught to measure them, not trust them.' },
];

export const FDE_EXPECT = [
  { k: 'Ownership', v: 'Own your component and be able to defend every line of it.' },
  { k: 'Honesty', v: 'Say "I don’t know" in the system and in the room when that is the honest answer.' },
  { k: 'Data care', v: 'Never paste real client or personal data into a prompt.' },
  { k: 'Disclosure', v: 'Disclose where Claude wrote code you did not review.' },
  { k: 'Client respect', v: 'Treat mentor-played clients as real clients.' },
];

export const FDE_OUTCOMES = [
  { t: 'A shipped engagement', d: 'Six milestone projects, each defended to a panel, and a capstone taken from ambiguous brief to deployed system.' },
  { t: 'Evidence you can show', d: 'A public MCP server, a go / no-go memo, a pilot postmortem, an ROI model and a written case study.' },
  { t: 'A Scenario Library', d: 'Roughly sixty hidden-scenario tests from the cases, to reuse on your own future builds.' },
  { t: 'A working vocabulary', d: 'The language of baselines, confidence intervals, SLOs, approvals and handover, spoken to clients and CFOs.' },
  { t: 'Defended judgment', d: 'Answers to twelve hard questions, given live, about a system you designed.' },
  { t: 'A cohort', d: 'Pod-mates, mentors and a network of people who have shipped the same engagements.' },
];
