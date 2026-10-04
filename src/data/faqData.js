import { PROGRAM_PRICES, formatINR } from './pricing.js';

export const HOME_FAQS = [
  {
    q: 'What programs does Menler offer?',
    a: `Menler runs three live, cohort-based AI programs. The AI Generalist Fellowship is a 10-week no-code course for professionals and students who want to use AI across their work. The Gen AI Kickstarter is a 14-day AI course for complete beginners, priced at ${formatINR(PROGRAM_PRICES.kickstarter.amount)}. The AI Engineering Fellowship is a 12-week program for developers building production AI systems.`,
  },
  {
    q: 'What is Menler Fellowship and how is it different from other AI courses in India?',
    a: "Menler Fellowship is India's only Claude-native AI specialist program. Unlike generic AI courses that survey ChatGPT and prompt-engineering basics, Menler goes deep on a single, market-leading model — Claude — and applies it to seven specific career domains. Every fellow ships a portfolio of domain-specific projects, sits a Claude Specialist certification exam, and is matched to a placed role through Demo Day. The fellowship has two paths: the 10-week Generalist (no coding required) and the 12-week Engineering (Python or JavaScript required) — both leading to a recognised AI Specialist credential.",
  },
  {
    q: 'Who should apply to the Claude AI Generalist program?',
    a: "The Generalist program is built for anyone who works with information, decisions, or people but doesn't write code: students from any discipline, working professionals in non-engineering roles, business owners, founders without an engineering team, and career switchers entering AI-adjacent roles. You don't need Python — you need curiosity, a domain you care about, and the willingness to do real work for 10 weeks.",
  },
  {
    q: 'Who should apply to the Claude AI Engineering program?',
    a: "The Engineering program is built for technical professionals — software engineers, data scientists, ML practitioners, IT engineers, and deep-tech professionals — who already write production code in Python or JavaScript. You'll go from Claude API basics to deployed multi-agent systems, MCP servers, RAG pipelines with evals, and full LLMOps.",
  },
  {
    q: 'Does Menler guarantee placement and what does placement support look like?',
    a: "Placement is the program's primary outcome metric, not a guarantee. Menler operates an active placement cell that maintains a network of 25+ Indian hiring partners, runs Demo Day with live employer attendance, prepares fellows for domain-specific interviews, and continues matching alumni to roles after graduation. Our placement target is 90% of fellows into an active interview pipeline within 90 days of program completion.",
  },
  {
    q: 'What is the Claude Specialist certification?',
    a: 'Claude Specialist is Menler\'s domain-specific career credential, awarded after passing a written exam and a practical capstone review. The credential is issued as "Claude Specialist — [Domain]" — e.g. Claude Specialist — Finance. Engineering fellows earn the Claude Engineer credential via a written exam plus live coding assessment.',
  },
  {
    q: 'Is Menler Fellowship online, in-person, or hybrid?',
    a: "Menler runs an online fellowship. Demo Day is held online. Live sessions happen on India-friendly timezones, and all sessions are recorded.",
  },
  {
    q: 'What is the program fee and are scholarships available?',
    a: "Fellowship fees, payment plans, options are published on the Apply page. Need-based scholarships are available for every batch, including dedicated seats for women in tech, students from tier-2/3 cities, and career switchers from underrepresented backgrounds.",
  },
  {
    q: 'How is Menler different from MBA AI programs or postgraduate diplomas?',
    a: "An MBA AI elective gives you frameworks; a postgraduate diploma gives you a syllabus. Menler gives you a portfolio, a credential, and support. We're 10 to 12 weeks instead of 18–24 months, narrower in scope (Claude, not \"all AI\"), deeper in execution (real shipped projects), and explicitly placement-driven.",
  },
];

export const KICKSTARTER_FAQS = [
  { q: 'What is the Menler Gen AI Kickstarter?', a: "The Gen AI Kickstarter is Menler's 14-day AI course for complete beginners. You get hands-on with 10+ AI tools, complete 4 mini-builds and earn a fluency certificate — designed for students and professionals who are starting from zero." },
  { q: 'How long is the AI Kickstarter and what does it cost?', a: 'It runs for 14 days with live, recorded sessions, and costs ₹4,999. Group discounts are available for 5 or more learners from the same college or company.' },
  { q: 'Who should take the AI Kickstarter?', a: "Anyone new to AI: students, working professionals, business owners and career switchers. If you want a short, practical start before a longer program like the AI Generalist Fellowship, the Kickstarter is built for you." },
  { q: 'What will I learn in the AI Kickstarter?', a: 'Four modules over 14 days: AI foundations and prompting with Claude, ChatGPT and Gemini; Claude Skills, Connectors and Projects, plus research with Perplexity and NotebookLM; automation with Claude Routines, n8n and Zapier; and no-code building with Lovable and Emergent. You finish with a capstone project and present it on Demo Day.' },
  { q: 'Are there any prerequisites?', a: "None. If you can use a smartphone and join a Zoom call, you're ready." },
  { q: 'Will I get a refund if it\'s not a fit?', a: 'Once access to the program has been activated, fees are non-refundable. A full refund will be issued only if course access is not provided.' },
  { q: 'What language is the program in?', a: 'Primary instruction in English. Hindi explanations available on request. Slack is bilingual.' },
  { q: 'Are the sessions recorded?', a: 'Yes — every live class is recorded.' },
  { q: 'What can I do after the Kickstarter?', a: 'Most learners move on to a longer program. Kickstarter alumni get a 30% scholarship to the AI Generalist Fellowship or the AI Engineering Fellowship.' },
  { q: 'Do you offer group discounts?', a: 'Yes — 15% off for groups of 5+ from the same school, college, or company. Email partner@menler.in.' },
  { q: 'Is the certificate recognised?', a: "Yes. Menler certificates are verifiable and backed by industry-recognised standards, including MSME, Skill India, and ISO accreditations. They are designed to signal practical AI capability and portfolio-backed learning." },
];

export const GENERALIST_FAQS = [
  {
    q: 'What is an AI generalist?',
    a: "An AI generalist is someone who uses AI across everyday work — research, writing, analysis, presentations, automation and building simple tools — without needing to code. Instead of specialising in one model or one task, an AI generalist knows which tool fits which job and can turn a business problem into a working AI workflow. Menler's AI Generalist Fellowship trains exactly this role, with Claude at the core.",
  },
  {
    q: 'How do I become an AI generalist?',
    a: "Learn the core skills in order: prompting and context, AI research and writing, AI for documents and presentations, creative and media tools, automation with tools like n8n, Make and Zapier, and no-code building with Lovable and Claude Code. Then apply them to real projects in your own field and build a portfolio. Menler's 10-week AI Generalist Fellowship follows this path, with live sessions, domain tracks and placement support.",
  },
  {
    q: 'Is the AI Generalist course only about Claude?',
    a: 'Claude is the core tool, but the course covers the wider AI stack a generalist uses: ChatGPT, Gemini, Perplexity and NotebookLM for research; Canva, Firefly and ElevenLabs for creative work; n8n, Make and Zapier for automation; and Lovable, Cursor and Claude Code for building — 35+ tools in all.',
  },
  {
    q: 'What is the Menler Generalist program?',
    a: "The Menler Generalist program is the AI Generalist Fellowship: a 10-week, live, no-code course with 20 sessions and 50 hours of instruction. You learn Claude and the wider AI stack, apply it in a domain track such as marketing, finance, product, HR or operations, and graduate with a project portfolio, a Claude Specialist certificate and placement support.",
  },
  {
    q: 'What is the difference between an AI generalist and an AI engineer?',
    a: "An AI generalist applies AI tools to business work — research, content, analysis, automation — without writing code. An AI engineer writes code to build the AI systems themselves: APIs, RAG pipelines, agents and evaluations. Menler teaches both: the AI Generalist Fellowship needs no coding, and the AI Engineering Fellowship requires Python or JavaScript.",
  },
  {
    q: "I'm not a technical person. Can I still succeed in this Fellowship?",
    a: "You don't need coding experience—just the willingness to learn, build, and apply AI to real-world work.",
  },
  {
    q: 'What will I build during the Fellowship?',
    a: "You'll graduate with a portfolio of real AI projects. Every build is designed to demonstrate practical capability within your chosen domain, creating proof of work you can showcase to employers and your professional network.",
  },
  {
    q: 'How much time should I expect to commit each week?',
    a: 'Approximately 8–10 hours per week. This includes live sessions, hands-on assignments, project work, and mentor support. The program is designed for working professionals and ambitious learners.',
  },
  {
    q: 'How does interview preparation and career support work?',
    a: "Career support is integrated throughout the Fellowship. Fellows receive portfolio reviews, interview preparation, hiring-readiness guidance, employer introductions, and access to opportunities through Menler's hiring network.",
  },
  {
    q: 'What is the program fee and are there payment options?',
    a: `The 10-week AI Generalist Fellowship costs ${formatINR(PROGRAM_PRICES.generalist.amount)} including taxes, and EMI plans are available. Scholarship options are shared during the application process and counselling session.`,
  },
  {
    q: 'What is the refund and cancellation policy?',
    a: "Refunds are only applicable if program access has not been provided. Once access to the Fellowship platform, curriculum, or learning resources has been granted, fees become non-refundable and cancellations are not eligible for a refund.",
  },
];

export const ENGINEERING_FAQS = [
  {
    q: 'Who is this Fellowship designed for?',
    a: 'This Fellowship is built for engineers and technical professionals. Prior coding experience is required. The program is designed for software engineers, data scientists, ML practitioners, platform engineers, and technical builders looking to specialize in AI Engineering.',
  },
  {
    q: 'What will I build during the Fellowship?',
    a: "You'll build production-grade AI systems. From RAG pipelines and agentic workflows to MCP integrations, evaluations, deployment, and AI infrastructure, every project is designed to reflect how modern AI products are built in industry.",
  },
  {
    q: 'How technical is the program?',
    a: "You'll work with code, APIs, frameworks, deployment workflows, and production engineering practices used by AI-native companies.",
  },
  {
    q: 'How much time should I expect to commit each week?',
    a: 'Approximately 10–12 hours per week. This includes live sessions, engineering assignments, capstone development, code reviews, and project implementation.',
  },
  {
    q: 'Who teaches the Fellowship?',
    a: 'AI Engineers in production today. Every mentor has hands-on experience deploying AI systems, working with LLM infrastructure, building AI products, or leading AI engineering initiatives inside startups and enterprises.',
  },
  {
    q: 'Will I receive interview opportunities and career support?',
    a: "Yes. Fellows receive portfolio reviews, technical interview preparation, resume optimization, hiring association introductions, and access to AI Engineering opportunities through Menler's employer network.",
  },
  {
    q: 'What is the refund and cancellation policy?',
    a: 'Refunds are only applicable if Fellowship access has not been provided. Once access to the platform, curriculum, recordings, or learning resources has been granted, fees become non-refundable and cancellations are not eligible for a refund.',
  },
  {
    q: 'What is the program fee and are there payment options?',
    a: 'Flexible payment plans are available. Program fees, payment schedules, and available scholarship opportunities are shared during the application process and counselling session.',
  },
];

export const APTITUDE_FAQS = [
  {
    q: 'Is this a real assessment or just a quiz?',
    a: "It's a 10-question ai aptitude test built by our curriculum team. The score is not pass/fail — it's a signal to help you choose the right entry point and gives you a personalised 10-day learning roadmap.",
  },
  {
    q: 'How long does it take?',
    a: 'About 10 minutes. There is no time limit. No email required to start.',
  },
  {
    q: 'Does my score affect my application?',
    a: "The test result is not part of the admissions process. It's a self-assessment tool. That said, top 10% scorers qualify for an Aptitude Test scholarship of up to 30% off.",
  },
  {
    q: 'How many people have taken this test?',
    a: '1000+ Indians have taken the AI Aptitude Test. 12% went on to a Menler program.',
  },
];
