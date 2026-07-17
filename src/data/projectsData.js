// Portfolio projects shown on the Home page and the /projects pages.
// `slug` is the URL key used by /projects/:slug.

// GROQ to read the same shape from Sanity (used via useContent; PROJECTS below
// is the fallback). Image/deck resolve to URL strings to match the fallback.
export const PROJECTS_QUERY = `*[_type == "project"] | order(orderRank) {
  "slug": slug.current, title, "image": image.asset->url, tag, tagCls, desc, stack, outcome,
  "deck": deck.asset->url, doc
}`;

export const PROJECTS = [
  {
    slug: 'ceo-decision-intelligence-agent', image: '/projects/CEO_Decession.webp',
    tag: "Founder's Office", tagCls: 't-founder', title: 'CEO decision-intelligence agent',
    desc: "Pulls from Slack, Asana, GitHub, finance docs & reports — synthesises a Monday-morning briefing on what changed, what's at risk, and what to decide.",
    stack: ['MCP', 'Cowork', 'Tool use'], outcome: '15-min briefing replaces 90-min catch-up',
    doc: {
      overview: "An always-on chief-of-staff agent that gives the CEO one trustworthy read on the whole company every Monday morning — without anyone manually compiling updates.",
      problem: "Leadership context is scattered across Slack threads, Asana boards, GitHub activity and finance exports. Pulling it together for a weekly review eats 90+ minutes and still misses the signal that matters.",
      howItWorks: ["Connects to Slack, Asana, GitHub and the finance drive through read-only MCP servers.", "Every Sunday night it pulls the week's deltas — shipped work, blocked items, spend and team sentiment.", "Claude synthesises the signals into a ranked briefing: what changed, what's at risk, and what needs a decision.", "The CEO drills from any line straight back to the source message or document."],
      features: ["MCP connectors for Slack, Asana, GitHub and Google Drive", "Risk and decision ranking by urgency and blast radius", "One-tap source drill-down for every claim", "Auto-delivered to email or Slack at 7am Monday"],
      architecture: "Built on Claude with tool use over a set of read-only MCP servers; Cowork orchestrates the weekly run and formats the briefing.",
      results: ["A 15-minute read replaces a 90-minute catch-up", "Zero manual status compilation by the team", "Risks surfaced roughly two days earlier on average"],
    },
  },
  {
    slug: 'deal-flow-triage-agent', image: '/projects/dEAL_fLOW_tRIAGE.webp',
    tag: 'Finance Operations', tagCls: 't-vc', title: 'Deal-flow triage agent',
    desc: 'Ingests pitch decks, founder emails, and public data, then outputs a partner-ready memo on fit, market, traction, and follow-up questions.',
    stack: ['Claude API', 'Tool use', 'RAG'], outcome: 'Cuts initial screening time by 70%',
    doc: {
      overview: "A first-pass analyst that turns an inbox full of pitch decks into partner-ready memos, so the team only spends time on the deals worth a conversation.",
      problem: "Associates burn hours reading every inbound deck and email, and weak signal buries the few companies that actually fit the fund's thesis.",
      howItWorks: ["Ingests pitch decks, founder emails and public data about the company.", "Extracts team, market, traction and the ask into a structured deal profile.", "Scores fit against the fund thesis using RAG over past memos and investment criteria.", "Drafts a partner-ready memo plus the follow-up questions to send the founder."],
      features: ["Deck and email parsing into a structured deal profile", "Thesis-grounded fit score with cited reasoning", "Auto-drafted follow-up question list", "Red-flag detection on traction and market claims"],
      architecture: "Claude API with tool use for data lookups, and a RAG layer over the fund's historical memos and thesis documents.",
      results: ["About 70% less time on initial screening", "A consistent memo format across the whole team", "More thesis-fit deals reach partner review"],
    },
  },
  {
    slug: 'insights-to-prd-pipeline', image: '/projects/Insights_to_PRD.webp',
    tag: 'Product Management', tagCls: 't-pm', title: 'Insights-to-PRD pipeline',
    desc: 'Synthesises user interviews, support tickets, NPS comments, and sales notes into structured product requirement docs and themed opportunity stacks.',
    stack: ['Claude Projects', 'Multimodal', 'Cowork'], outcome: '5× faster discovery → PRD turnaround',
    doc: {
      overview: "A discovery copilot that converts raw user signal into structured product requirements with traceability back to the evidence that justifies each one.",
      problem: "Interviews, tickets, NPS and sales notes pile up faster than any PM can synthesise, so insights get lost and every PRD starts from a blank page.",
      howItWorks: ["Ingests interview transcripts, support tickets, NPS comments and sales notes.", "Clusters them into themed opportunities and recurring pain points.", "Drafts a PRD with problem statement, goals and acceptance criteria.", "Links every requirement back to the user quotes behind it."],
      features: ["Multi source feedback clustering", "Auto generated PRD with acceptance criteria", "Quote level traceability for each requirement", "Themed opportunity stack ranked by frequency"],
      architecture: "Claude Projects for persistent context, multimodal ingestion for documents and screenshots, and Cowork for the drafting workflow.",
      results: ["5× faster discovery-to-PRD turnaround", "Every requirement backed by real evidence", "A shared opportunity backlog the team trusts"],
    },
  },
  {
    slug: 'pmo-status-agent', image: '/projects/pmo_status.webp',
    tag: 'Product Management', tagCls: 't-pjm', title: 'PMO status agent',
    desc: 'Reads sprint boards, code commits, and stand-up notes — drafts the weekly leadership update with risks, slippage, and the asks for next week.',
    stack: ['MCP', 'Cowork', 'Skills'], outcome: 'Saves 6+ hrs/PM/week of status writing',
    doc: {
      overview: "An agent that writes the weekly leadership update for you, grounded in what actually happened across the project tools.",
      problem: "PMs lose hours each week stitching together board status, commits and stand-up notes into a readable executive update.",
      howItWorks: ["Reads sprint boards, code commits and stand-up notes.", "Builds one timeline of progress, blockers and slippage.", "Flags milestones trending late before they actually miss.", "Drafts the leadership update in the team's voice with next week's asks."],
      features: ["Jira, Git and notes unified into one timeline", "Early slippage detection on milestones", "Exec-ready update drafted in your tone", "Highlights the explicit asks for leadership"],
      architecture: "MCP connectors to the project tools, Cowork for the weekly run, and reusable Skills that lock the report format.",
      results: ["6+ hours per PM per week saved on status writing", "Fewer surprise slips at review", "Consistent updates across every project"],
    },
  },
  {
    slug: 'production-rag-pipeline-custom-mcp', image: '/projects/Production_RAG.webp',
    tag: 'Engineering', tagCls: 't-eng', title: 'Production RAG pipeline + custom MCP',
    desc: 'Document ingestion → vector DB → grounded Claude service, with caching, RAGAS evals and a remote MCP exposing internal tools to Claude Desktop.',
    stack: ['Python', 'MCP SDK', 'Claude API'], outcome: '<800ms p95, ship-ready to enterprise',
    doc: {
      overview: "A production-grade retrieval service that grounds Claude in your documents, with the evals and tooling needed to ship it to an enterprise.",
      problem: "Demos are easy; a RAG system that is fast, accurate, evaluated and maintainable in production is not.",
      howItWorks: ["Documents are chunked, embedded and stored in a vector database.", "Queries retrieve and rerank the most relevant context.", "Claude answers grounded in that context, with citations.", "A RAGAS evaluation suite gates every change before deploy."],
      features: ["End-to-end ingestion to vector-store pipeline", "Prompt and response caching for latency and cost", "RAGAS evaluation harness wired into CI", "Remote MCP server exposing internal tools to Claude Desktop"],
      architecture: "Python services, a managed vector database, the MCP SDK for the tool server, and the Claude API for generation.",
      results: ["Under 800ms p95 response time", "Eval-gated deploys catch regressions early", "Ship-ready for enterprise security review"],
    },
  },
  {
    slug: 'research-synthesis-insight-engine', image: '/projects/Research_synthesis.webp',
    tag: 'Analyst', tagCls: 't-analyst', title: 'Research synthesis & insight engine',
    desc: 'Multi source agent across PDFs, web data, and internal reports produces a competitive landscape with citations and contradictions flagged for review.',
    stack: ['Claude API', 'Web search', 'Citations'], outcome: 'Days → hours per research cycle',
    doc: {
      overview: "A research agent that reads across everything and returns a cited, contradiction-aware landscape you can actually defend.",
      problem: "Manual research across PDFs, the web and internal reports takes days, and the findings are hard to trust without sources.",
      howItWorks: ["Fans out across PDFs, web results and internal reports.", "Extracts claims, figures and themes from each source.", "Cross-checks sources and flags contradictions for human review.", "Outputs a competitor and market landscape with citations."],
      features: ["Multi source parallel research", "A citation on every figure and claim", "Automatic contradiction flagging", "Structured landscape table output"],
      architecture: "Claude API with web search and tool use, plus citation tracking maintained across the full source set.",
      results: ["Days to hours per research cycle", "Every number traceable to a source", "Reviewers focus only on flagged conflicts"],
    },
  },
  {
    slug: 'sop-automation-suite', image: '/projects/SOP_Automation.webp',
    tag: 'Human Resource', tagCls: 't-ops', title: 'SOP automation suite',
    desc: 'Replaces six manual checklists with a single audit-ready agent that intakes, triages, and escalates exceptions across customer support and ops.',
    stack: ['Agentic design', 'Cowork', 'MCP'], outcome: 'Reclaims 8–12 hrs/manager/week',
    doc: {
      overview: "A single audit-ready agent that runs the standard operating procedures a team used to handle with a stack of manual checklists.",
      problem: "Ops runs on brittle checklists across support and operations; exceptions slip through and there is no clean audit trail.",
      howItWorks: ["Intakes requests from the support and ops channels.", "Triages each request against the relevant SOP.", "Handles the routine path and escalates exceptions with full context.", "Logs every step for an auditable trail."],
      features: ["One agent replacing six manual checklists", "Rule-based routing to the right owner", "Exception escalation with full context", "Audit log for every action taken"],
      architecture: "An agentic design with Cowork for orchestration and MCP connectors into the support and ops systems.",
      results: ["8–12 hours per manager per week reclaimed", "Fewer dropped exceptions", "A clean audit trail for compliance"],
    },
  },
  {
    slug: 'always-on-content-outreach-engine', image: '/projects/Content_Outreach.webp',
    tag: 'Marketing & Sales', tagCls: 't-marketing', title: 'Always-on content & outreach engine',
    desc: 'Turns one strategic brief into a coordinated multichannel campaign — blog, email, LinkedIn, ads, and sales sequences — with brand voice enforced.',
    stack: ['Prompt patterns', 'Skills', 'MCP'], outcome: '3× output velocity, single-author voice',
    doc: {
      overview: "A campaign engine that expands one strategic brief into a full multichannel sequence — on brand and on schedule.",
      problem: "Turning a single brief into blog, email, social and ads consistently is slow, and brand voice drifts across channels and authors.",
      howItWorks: ["Takes one strategic brief as the input.", "Generates blog, email, LinkedIn and ad variants from it.", "Enforces brand voice with a reusable Skill.", "Schedules the sequence and sets up the A/B tests."],
      features: ["One brief into coordinated multichannel assets", "Brand-voice Skill keeps everything on-tone", "Built-in A/B variant generation", "Scheduling across every channel"],
      architecture: "Prompt patterns plus a brand-voice Skill, with MCP connectors into the publishing and scheduling tools.",
      results: ["3× content output velocity", "A single, consistent author voice", "Faster brief-to-live turnaround"],
    },
  },

  // ── AI-at-Work portfolio projects (grouped by domain on the Library page).
  // Grounded in real survey respondents; outcome lines are operator-portfolio
  // framing, not survey-reported figures. Each carries a full build doc.
  {
    slug: 'retail-support-rag-service', image: '/projects/Retail_support.webp', tag: 'Engineering', tagCls: 't-eng',
    title: 'Retail support RAG service',
    desc: 'Ingests product catalogs, SOPs and past tickets into a vector store, serving a grounded Claude assistant that answers retail ops queries with sources attached.',
    stack: ['Python', 'Claude', 'Pinecone', 'FastAPI', 'Git'], outcome: '~55% fewer escalations to senior engineers',
    doc: {
      overview: "A grounded support assistant that answers retail operations questions from the company's own catalogs, SOPs and ticket history — with sources attached.",
      problem: "Frontline retail staff escalate routine questions to senior engineers because the answers are buried across product catalogs, SOPs and old support tickets.",
      howItWorks: ["Ingests product catalogs, SOPs and resolved tickets, then chunks and embeds them into a Pinecone vector store.", "A FastAPI service retrieves the most relevant context for each incoming query.", "Claude answers grounded in that context and cites the source document.", "Low-confidence or out-of-scope queries are routed to a human with the gathered context attached."],
      features: ["Vector store over catalogs, SOPs and ticket history", "A source citation on every answer", "Confidence-gated escalation to a human", "FastAPI endpoint that drops into existing support tools"],
      architecture: "A Python/FastAPI service with Pinecone for retrieval and the Claude API for grounded generation, versioned in Git.",
      results: ["~55% fewer escalations to senior engineers", "Consistent, sourced answers for frontline staff", "Senior engineering time freed for real work"],
    },
  },
  {
    slug: 'api-doc-summariser-agent', image: '/projects/API_DOC_Summariser.webp', tag: 'Engineering', tagCls: 't-eng',
    title: 'API doc summariser agent',
    desc: 'Crawls internal API references and changelogs, then drafts integration guides and flags breaking changes for downstream engineering teams.',
    stack: ['Claude', 'Python', 'MCP', 'GitHub'], outcome: 'Integration ramp-up cut from days to hours',
    doc: {
      overview: "An agent that keeps integration guides current by reading the source API references and changelogs directly.",
      problem: "Internal API docs drift from the code, and engineers lose days reverse-engineering references and spotting breaking changes by hand.",
      howItWorks: ["Crawls internal API references and changelogs straight from the repos.", "Extracts endpoints, parameters and version deltas into a structured model.", "Drafts a readable integration guide for each consumer team.", "Flags breaking changes and notifies the downstream teams that depend on them."],
      features: ["Automated crawl of references and changelogs", "Auto-drafted integration guides per consumer", "Breaking-change detection with impact notes", "GitHub-native delivery via PRs and issues"],
      architecture: "A Python agent on the Claude API, with MCP connectors into GitHub for source access and delivery.",
      results: ["Integration ramp-up cut from days to hours", "Docs that track the code instead of drifting", "Breaking changes caught before they reach consumers"],
    },
  },
  {
    slug: 'internal-engineering-copilot', image: '/projects/Internal_engineering_copilot.webp', tag: 'Engineering', tagCls: 't-eng',
    title: 'Internal engineering copilot',
    desc: 'An agent over internal repos and docs that scaffolds code, runs retrieval-grounded reviews, and drafts design notes without leaving the IDE.',
    stack: ['Claude CLI', 'Cursor', 'Python', 'RAG'], outcome: 'Design-to-first-PR time down ~40%',
    doc: {
      overview: "An in-IDE copilot grounded in your own repos and docs that scaffolds code, reviews it against internal context, and drafts the design notes.",
      problem: "Generic AI assistants don't know your codebase, so engineers still spend the slow early hours wiring up context, conventions and design before the first PR.",
      howItWorks: ["Indexes internal repos, docs and conventions into a retrieval layer.", "Scaffolds new code that follows the team's existing patterns.", "Runs retrieval-grounded reviews against internal standards.", "Drafts design notes from the change without leaving the editor."],
      features: ["RAG over private repos and docs", "Pattern-aware code scaffolding", "Grounded code review against internal standards", "Auto-drafted design notes in the IDE"],
      architecture: "Claude through the CLI and Cursor, with a Python retrieval layer (RAG) over the internal codebase.",
      results: ["Design-to-first-PR time down ~40%", "New code that matches house conventions", "Less context-loading before real work starts"],
    },
  },
  {
    slug: 'quote-to-order-automation-engine', image: '/projects/Quote_to_order.webp', tag: 'Finance Operations', tagCls: 't-finance', domain: 'Finance Operations',
    title: 'Quote-to-order automation engine',
    desc: 'Reads inbound quotes, validates them against catalog and pricing rules, auto-creates clean orders, and raises Jira stories only for the exceptions.',
    stack: ['Salesforce Agentforce', 'Claude', 'Python'], outcome: '~70% of standard quotes processed untouched',
    doc: {
      overview: "An agent that turns inbound quotes into clean, validated orders automatically, escalating only the ones that genuinely need a human.",
      problem: "Ops teams hand-key every quote into an order, checking catalog and pricing rules line by line — slow, error-prone and hard to scale.",
      howItWorks: ["Reads inbound quotes from email and the CRM.", "Validates each line against the product catalog and pricing rules.", "Auto-creates a clean order for anything that passes validation.", "Raises a Jira story with full context only for the exceptions."],
      features: ["Quote parsing into structured line items", "Catalog and pricing-rule validation", "Straight-through order creation", "Exception-only Jira stories"],
      architecture: "Salesforce Agentforce orchestration with the Claude API for extraction and validation, plus Python services for the catalog and pricing checks.",
      results: ["~70% of standard quotes processed untouched", "Fewer order-entry errors", "Humans focused only on true exceptions"],
    },
  },
  {
    slug: 'requirement-to-dashboard-pipeline', image: '/projects/Requirement_to_dashboard.webp', tag: 'Analytics', tagCls: 't-analyst',
    title: 'Requirement-to-dashboard pipeline',
    desc: 'Turns raw stakeholder notes and source tables into a structured BRD, then scaffolds the BI dashboard spec and a first-pass EDA for review.',
    stack: ['Claude Projects', 'Clay', 'HubSpot', 'BigQuery'], outcome: 'Requirement-to-dashboard cycle roughly halved',
    doc: {
      overview: "A pipeline that converts messy stakeholder notes into a structured BRD and a first-pass dashboard spec ready for review.",
      problem: "Analysts spend the front half of every project translating vague stakeholder notes into requirements and a dashboard plan before any building starts.",
      howItWorks: ["Ingests raw stakeholder notes and the available source tables.", "Structures them into a business requirements document.", "Scaffolds the BI dashboard spec — metrics, dimensions and layout.", "Runs a first-pass exploratory analysis on the source data for review."],
      features: ["Notes-to-BRD structuring", "Auto-scaffolded dashboard spec", "First-pass exploratory data analysis", "Traceability from each metric back to its requirement"],
      architecture: "Claude Projects for persistent context, with connectors to Clay, HubSpot and BigQuery for source data.",
      results: ["Requirement-to-dashboard cycle roughly halved", "Clearer specs before a single chart is built", "Fewer rebuild loops with stakeholders"],
    },
  },
  {
    slug: 'incident-management-auto-sync', image: '/projects/Incident_management.webp', tag: 'Analytics', tagCls: 't-analyst',
    title: 'Incident management auto-sync',
    desc: 'Connects ServiceNow to Google Sheets via API and Apps Script, classifies incidents, and refreshes live dashboards with no analyst input.',
    stack: ['ServiceNow', 'Google Apps Script', 'Gemini', 'Data Studio'], outcome: '~10 hrs/week of manual logging eliminated',
    doc: {
      overview: "A no-touch sync that classifies incidents and keeps live operational dashboards current without any analyst data entry.",
      problem: "Analysts manually export incidents from ServiceNow, categorise them and update dashboards — hours of repetitive logging every week.",
      howItWorks: ["Connects ServiceNow to Google Sheets through its API.", "Classifies each incident by type and severity.", "Apps Script refreshes the working dataset on a schedule.", "Live dashboards update with no analyst input."],
      features: ["ServiceNow-to-Sheets API sync", "Automatic incident classification", "Scheduled refresh via Apps Script", "Always-current operational dashboards"],
      architecture: "A ServiceNow → Google Apps Script integration with Gemini for classification, surfaced through Data Studio dashboards.",
      results: ["~10 hours/week of manual logging eliminated", "Dashboards that are always current", "Consistent incident categorisation"],
    },
  },
  {
    slug: 'ai-job-matching-workflow', image: '/projects/AI_Job_Matching.webp', tag: 'Human Resource', tagCls: 't-ops', domain: 'HR Operations',
    title: 'AI job-matching workflow',
    desc: 'Parses candidate resumes against open roles, scores fit with reasoning, and routes ranked shortlists straight into the recruiter queue.',
    stack: ['Claude', 'Make', 'Lovable'], outcome: 'Shortlisting effort per role down ~80%',
    doc: {
      overview: "A workflow that scores candidates against open roles with reasoning and drops ranked shortlists straight into the recruiter's queue.",
      problem: "Recruiters read every resume against every role by hand, so shortlisting is slow and the reasoning behind each pick is inconsistent.",
      howItWorks: ["Parses incoming resumes into structured candidate profiles.", "Matches each profile against the open role's requirements.", "Scores fit with explicit reasoning for the rank.", "Routes the ranked shortlist into the recruiter queue."],
      features: ["Resume parsing into structured profiles", "Role-by-role fit scoring", "Transparent reasoning for each match", "Auto-built recruiter shortlist"],
      architecture: "Claude for parsing and scoring, orchestrated through Make, with a Lovable-built interface for recruiters.",
      results: ["Shortlisting effort per role down ~80%", "Consistent, explainable ranking", "Recruiters spend time on candidates, not triage"],
    },
  },
  {
    slug: 'account-research-solutioning-agent', image: '/projects/Account_research.webp', tag: 'Marketing & Sales', tagCls: 't-marketing',
    title: 'Account research & solutioning agent',
    desc: 'Gathers public company signals, synthesises an account brief, and drafts a tailored solution narrative plus a first-cut sales deck for the deal team.',
    stack: ['Claude', 'ChatGPT', 'Python'], outcome: 'Pre-meeting prep cut from ~4 hours to 30 mins',
    doc: {
      overview: "A pre-call agent that researches an account, writes the brief, and drafts a tailored solution narrative and first-cut deck for the deal team.",
      problem: "Reps spend hours before every meeting gathering company signals and assembling a relevant pitch, and the quality varies by who's prepping.",
      howItWorks: ["Gathers public signals about the target company.", "Synthesises a structured account brief.", "Drafts a solution narrative tailored to their context.", "Produces a first-cut sales deck for the team to refine."],
      features: ["Automated account research", "Structured pre-call brief", "Tailored solution narrative", "First-draft deck generation"],
      architecture: "Python orchestration across the Claude API and ChatGPT for research and drafting.",
      results: ["Pre-meeting prep cut from ~4 hours to 30 minutes", "Consistent, tailored pitches", "More time in front of customers"],
    },
  },
  {
    slug: 'crm-hygiene-autopilot', image: '/projects/CRM.webp', tag: 'Marketing & Sales', tagCls: 't-marketing',
    title: 'CRM hygiene autopilot',
    desc: 'Captures call and meeting transcripts, summarises outcomes, and updates CRM fields and next-step tasks without any rep data entry.',
    stack: ['Gong', 'Zapier', 'Konnector.io'], outcome: '~5 hrs/week recovered from CRM admin per rep',
    doc: {
      overview: "An autopilot that turns call and meeting transcripts into clean CRM updates and next-step tasks — with no rep data entry.",
      problem: "Reps skip CRM updates because manual logging after every call is tedious, so the pipeline data leaders rely on is stale and incomplete.",
      howItWorks: ["Captures call and meeting transcripts automatically.", "Summarises the outcome and key commitments.", "Updates the relevant CRM fields.", "Creates the next-step follow-up tasks."],
      features: ["Automatic transcript capture", "Outcome summaries per interaction", "Hands-free CRM field updates", "Auto-created follow-up tasks"],
      architecture: "Gong for transcripts, wired through Zapier and Konnector.io into the CRM.",
      results: ["~5 hours/week recovered from CRM admin per rep", "Cleaner, current pipeline data", "Nothing slips between calls"],
    },
  },
  {
    slug: 'end-to-end-seo-content-agent', image: '/projects/End_to_end.webp', tag: 'Product Management', tagCls: 't-pm',
    title: 'End-to-end SEO content agent',
    desc: 'Takes a topic brief, researches and drafts on-brand articles, then publishes straight to the CMS with metadata and internal links in place.',
    stack: ['Claude', 'OpenRouter', 'n8n'], outcome: 'Content output 4× with no added headcount',
    doc: {
      overview: "An agent that takes a topic brief all the way to a published, on-brand article — research, draft, metadata and links included.",
      problem: "SEO content stalls between briefing, drafting and the manual work of formatting, linking and publishing each piece.",
      howItWorks: ["Takes a topic brief as the input.", "Researches the topic and drafts an on-brand article.", "Adds metadata, internal links and SEO structure.", "Publishes straight to the CMS."],
      features: ["Brief-to-draft generation", "Brand-voice adherence", "Automatic metadata and internal linking", "Direct CMS publishing"],
      architecture: "Claude via OpenRouter for generation, orchestrated end-to-end with n8n into the CMS.",
      results: ["Content output 4× with no added headcount", "A consistent on-brand voice", "Publish-ready pieces, not just drafts"],
    },
  },
  {
    slug: 'inbound-email-triage-agent', image: '/projects/Inbound_Email.webp', tag: 'Product Management', tagCls: 't-pm',
    title: 'Inbound email triage agent',
    desc: 'Screens incoming emails, classifies intent, drafts context-aware replies, and queues CRM follow-ups for one-click human approval.',
    stack: ['Claude', 'n8n', 'HubSpot'], outcome: 'First-response handling automated for ~90% of inbound',
    doc: {
      overview: "A triage agent that classifies inbound email, drafts context-aware replies, and queues CRM follow-ups for one-click approval.",
      problem: "Inbound email piles up, and someone has to read, categorise and draft a first response to each one before any real work happens.",
      howItWorks: ["Screens each incoming email and classifies its intent.", "Pulls the relevant context from the CRM.", "Drafts a context-aware reply.", "Queues the reply and follow-up task for one-click human approval."],
      features: ["Intent classification on inbound mail", "Context-aware reply drafting", "CRM follow-up queuing", "Human-in-the-loop approval"],
      architecture: "Claude for classification and drafting, orchestrated with n8n and connected to HubSpot.",
      results: ["First-response handling automated for ~90% of inbound", "Faster replies", "Humans approve instead of compose"],
    },
  },
  {
    slug: 'insight-on-demand-data-agent', image: '/projects/Insights_on_demand.webp', tag: 'Analytics', tagCls: 't-analyst',
    title: 'Insight-on-demand data agent',
    desc: 'Turns plain-English business questions into SQL, runs them against the warehouse, and returns narrated insights and charts for leadership.',
    stack: ['Claude', 'BigQuery', 'Comet'], outcome: "Self-serve analytics for the CEO's office — zero wait",
    doc: {
      overview: "A text-to-insight agent that answers plain-English business questions against the warehouse with narrated results and charts.",
      problem: "Leadership questions queue behind the data team, so simple answers take days and the CEO's office waits on a human for every number.",
      howItWorks: ["Takes a plain-English business question.", "Translates it into SQL against the warehouse.", "Runs the query and validates the result.", "Returns a narrated insight with supporting charts."],
      features: ["Natural-language to SQL", "Governed warehouse access", "Narrated insights, not raw tables", "Auto-generated charts"],
      architecture: "Claude for query generation and narration over BigQuery, with Comet for observability on the runs.",
      results: ["Self-serve analytics for the CEO's office with zero wait", "The data team freed from ad-hoc pulls", "Faster leadership decisions"],
    },
  },
];

// Canonical colour class per domain so the same category always renders the
// same tag colour everywhere — regardless of the (sometimes inconsistent)
// `tagCls` stored on individual projects or coming from Sanity. Keyed by the
// lower-cased `tag` label. Use tagClassFor(tag) at every render site.
const TAG_CLASS_BY_DOMAIN = {
  "founder's office": 't-founder',
  'finance operations': 't-vc',
  'product management': 't-pm',
  'engineering': 't-eng',
  'analyst': 't-analyst',
  'analytics': 't-analyst',
  'human resource': 't-ops',
  'marketing & sales': 't-marketing',
};

export function tagClassFor(project) {
  const tag = (project?.tag || '').trim().toLowerCase();
  return TAG_CLASS_BY_DOMAIN[tag] || project?.tagCls || 't-analyst';
}
