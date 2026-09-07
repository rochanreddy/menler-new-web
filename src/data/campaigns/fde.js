/* Content for /campaign/build-like-an-ai-fde.
 *
 * Data only — the design lives in src/pages/campaign/PaidCampaignLayout.jsx,
 * and a Sanity document mapped to this same shape renders identically.
 */
// ── /campaign/build-like-an-ai-fde — the ₹199 AI Forward Deployed
// Engineering masterclass ──
// A faithful build of the reference workshop page, block for block: the sticky
// offer rail, the sticky nav under it, the hero with the session card and the
// reserve form side by side, the itemised bundle, the tool marquee, the
// audience strip, the host collage with the live-session shot, the WhatsApp
// band, the session plan with the price card pinned beside it, the FAQ, and
// the Buy Now bar fixed to the bottom of a phone.
//
// Every word of the content is the AI Forward Deployed Engineering campaign
// (Sanity slug `ai-forward-deployed-engineering`) — its session, its mentor,
// its four learning blocks and the six things a seat includes. This is an
// engineering masterclass, so unlike the earlier no-code build, it does assume
// the room can read and write code.
//
// Only the plumbing is Menler's: the reserve form verifies the phone, creates
// the lead, and hands the registrant to /checkout, which takes the ₹199 through
// Cashfree and confirms the seat. Every CTA on the page scrolls to that form,
// the way every CTA on the reference scrolls to its form.

const SLUG = 'build-like-an-ai-fde';
const TITLE = 'AI Forward Deployed Engineering (FDE)';
const TITLE_LINES = ['AI Forward', 'Deployed Engineering'];
const EYEBROW = 'Live AI Engineering Masterclass';
const TAGLINE = 'Turn real business problems into working AI systems.';
const SUBTITLE = 'Turn real business problems into working AI systems. A live AI engineering masterclass on Claude Code, APIs, AI agents, n8n, GitHub and MCP — recording included, and a working system you keep.';
// The stack the session builds on, shown as capsules straight under the hero
// tagline. Text-only: half of these (APIs, AI agents) are concepts rather than
// products, so a logo row would have holes in it.
const CAPSULES = ['Claude Code', 'APIs', 'AI Agents', 'n8n', 'GitHub', 'MCP', '& more'];

/* ── Edit these ──────────────────────────────────────────────────────────── */
const SESSION = {
  date: 'Thursday, 10 September 2026',   // feeds the calendar event on the confirmation page
  time: '6:00 PM – 8:00 PM IST',
  dateLong: '10 September 2026, Thursday',   // as the banner writes it
  dateShort: 'Thu, 10 Sept',
  timeShort: '6:00 PM IST',
  duration: '2 hours',
  platform: 'Live on Zoom',
  replay: 'Recording included',
};
// `was` is the campaign's own advertised value (origPrice on the Sanity doc),
// so the anchor here and the anchor on /campaign/ai-forward-deployed-engineering
// tell the reader the same number. BUNDLE below sums to exactly this.
const PRICE = { now: 199, was: 1999 };
// The reference carries a countdown in the offer rail but ships with it hidden;
// flip this on and it counts down to the session.
const SHOW_TIMER = false;
/* ────────────────────────────────────────────────────────────────────────── */



const HOST = {
  name: 'Abhinay Kumar',
  badge: 'AI Engineering · FDE Edition',
  role: 'Founder & CTO, Kernel Theory',
  img: '/mentors/Abhinay.webp',
  bio: 'Abhinay Kumar is a software engineer, product builder and entrepreneur with more than ten years building software products and working with engineering teams. He runs Kernel Theory, a consulting company that ships scalable, production-grade products for startups and enterprises — and now builds them with AI.',
  // The campaign's own credLogos, pulled down from Sanity so the page carries
  // no remote image dependency. Two of the three are full-bleed coloured
  // squares, which is why the CSS gives each one a tile.
  creds: [
    { name: 'MyCaptain', logo: '/logos/mycaptain.png' },
    { name: 'KeepWorks Technologies', logo: '/logos/keepworks.jpg' },
    { name: 'AcadGild', logo: '/logos/acadgild.jpg' },
  ],
};

// Facts about the session and claims Menler already makes elsewhere on the site.
const STATS = [
  { n: '1', l: 'Real AI system you build' },
  { n: '3+', l: 'AI workflows you deploy' },
  { n: '0 to 1', l: 'Problem to working solution' },
];
const SOCIAL_STATS = [
  { n: '5000+', l: 'Professionals trained' },
  { n: '25+', l: 'Hiring companies in the network' },
];

// Everything a seat includes. The eight sum to PRICE.was, so the `Total value`
// line under them is the real sum rather than a number typed twice.
const BUNDLE = [
  { t: 'A Real Agentic AI System', d: 'Not a demo. A production-grade build that is yours to keep.', p: 400 },
  { t: 'AI System Blueprint', d: 'The requirements, workflows and architecture behind what you build.', p: 250 },
  { t: 'The FDE Playbook', d: 'Understand → Design → Build → Integrate → Ship, written down.', p: 250 },
  { t: 'Prompt & tool starter pack — worth ₹4999/-', d: 'Your ready-to-use toolkit for AI-powered productivity.', p: 400 },
  { t: 'Live Q&A with the mentor', d: 'Ask anything and get unstuck in real time.', p: 250 },
  { t: 'Masterclass recording', d: 'Rewatch anytime, follow at your own pace.', p: 200 },
  { t: 'Mentorship & Career Opportunities', d: 'Get mentorship, career guidance, and access to relevant job opportunities.', p: 150 },
  { t: 'Exclusive community access', d: 'Join a network of AI builders and keep learning.', p: 99 },
];

// Claude Code ships only as a wordmark in this repo, which is illegible once
// it is scaled into a chip — so it wears Claude's own starburst, and the two
// are kept far enough apart in the loop that the repeat does not read as a bug.
const TOOLS = [
  { name: 'Claude', logo: '/logos/claude.svg' },
  { name: 'OpenAI', logo: '/logos/openai.webp' },
  { name: 'Cursor', logo: '/logos/cursor.webp' },
  { name: 'Gemini', logo: '/logos/gemini.webp' },
  { name: 'Claude Code', logo: '/logos/claude.svg' },
  { name: 'MCP', logo: '/logos/mcp.svg' },
  { name: 'n8n', logo: '/logos/n8n.webp' },
  { name: 'Lovable', logo: '/logos/lovable-logo.webp' },
  { name: 'Perplexity', logo: '/logos/perplexity.svg' },
  { name: 'Emergent', logo: '/logos/emergent.webp' },
  { name: 'Python', logo: '/logos/python.svg' },
];

const WORKSHOP_DEMO_SHOT = '/campaign/live-session-demo.png';

const AUDIENCE = [
  ['Developers', 'Move beyond coding features and learn to build AI-powered systems.'],
  ['Product & Operations', 'Learn how to turn business problems into working AI solutions.'],
  ['AI/ML Professionals', 'Build practical systems beyond notebooks and experiments.'],
  ['Founders & Builders', 'Prototype and ship AI solutions faster.'],
  ['Students & Career Switchers', 'Build FDE-style projects that demonstrate real-world AI skills.'],
  ['Data & Analytics', 'Turn a messy data problem into a tool the business actually uses.'],
];

// Two hours, tiling 0:00 to 2:00 with no gaps — the session runs 6–8 PM, so
// an agenda that ran to 3:00 was promising an hour the room does not have.
const PLAN = [
  { t: '0:00', e: '–0:20', title: 'Think Like an FDE', d: 'Understand the FDE mindset and how to break messy business problems into buildable AI solutions.', keep: 'FDE problem-solving framework', badge: 'SETUP', hot: false },
  { t: '0:20', e: '–0:50', title: 'Scope the AI System', d: 'Turn a real use case into requirements, workflows, architecture, and an execution plan.', keep: 'AI system blueprint', badge: 'SCOPE', hot: true },
  { t: '0:50', e: '–0:55', title: 'Break + Build Review', d: 'See how the system comes together and what separates a prototype from something usable.', keep: '', badge: 'BREAK', hot: false },
  { t: '0:55', e: '–1:35', title: 'Build With AI', d: 'Use Claude Code, APIs, agents, and tools to build the working system.', keep: 'Your AI system', badge: 'BUILD', hot: true },
  { t: '1:35', e: '–1:50', title: 'Connect & Automate', d: 'Bring in tools, data, APIs, and automation to make the system actually useful.', keep: 'Working AI workflow', badge: 'BUILD', hot: true },
  { t: '1:50', e: '–2:00', title: 'Ship Like an FDE', d: 'Test, improve, document, and package your project for real-world use and your portfolio.', keep: 'FDE project + next-build plan', badge: 'SHIP', hot: true },
];

// The pitch for why this is engineering rather than prompting, set between the
// agenda and the FAQ where the reader has just seen what the three hours do.
const DIFFERENCE = {
  eyebrow: 'The AI FDE difference',
  lead: 'Most AI learning teaches you how to use AI.',
  turn: 'FDEs learn how to solve problems with AI.',
  loop: ['Understand', 'Design', 'Build', 'Integrate', 'Ship'],
  close: 'That’s the skill this masterclass is designed to teach.',
};

const FINAL_CTA = {
  head: 'Stop learning AI. Start shipping with AI.',
  sub: 'Build your first AI FDE system in 2 hours.',
  cta: 'Reserve your seat',
};

const FAQS = [
  ['Do I need coding experience?', 'Basic coding familiarity is helpful, but the session is designed around AI-assisted development and practical building.'],
  ['What will I actually build?', 'You will build a functional AI-powered system based on a real-world use case — not just follow slides or watch a demo.'],
  ['Is this an AI/ML course?', 'No. The focus is on AI engineering, agents, integrations, workflows, and shipping real solutions.'],
  ['Do I need paid AI tools?', 'We will explain the tools used and alternatives where possible. Some advanced features may require paid accounts.'],
  ['What do I walk away with?', 'A working AI build, reusable resources, the FDE framework, the recording, and a clear roadmap for your next project.'],
  ['Is this suitable for beginners?', 'Yes, if you are comfortable with basic technology and are willing to build along.'],
  ['Will I get a recording?', 'Yes. The masterclass recording will be available after the live session.'],
  ['Can I use the project in my portfolio?', 'Absolutely. The goal is to help you build something you can show, explain, and ship.'],
];


// The last few things that used to be written straight into the markup.
const ROOT_CLASS = 'aw';
const HEADLINE = { pre: 'Build Like an ', em: 'AI FDE', post: '' };
const AUDIENCE_FOOT = 'Anyone who wants to build and ship AI solutions, not just prompt with AI';
const TINY_NOTE = 'Only a few seats for Thursday · Bring a problem to solve';
// The WhatsApp mock-ups. Drawn in HTML, so they say what THIS community says.
const COMMUNITY = {
  lede: 'Daily tool drops, build templates and session updates — free with your seat, forever.',
  groupsLabel: 'general · resources · projects',
  groups: [
    { icon: '#', name: 'general', sub: 'Say hi, ask anything', count: 24 },
    { icon: '▤', name: 'resources', sub: 'Build templates, prompt packs, tool lists', count: 9 },
    { icon: '⌘', name: 'projects', sub: 'Show what you shipped this week', count: 13 },
    { icon: '◎', name: 'deploys', sub: 'What broke, what shipped', count: 5 },
    { icon: '?', name: 'doubts', sub: 'Stuck? Someone is awake.', count: 2 },
  ],
  announcements: [
    { body: 'New build templates are up — the Claude prompts we use for architecture, debugging and docs. Use, remix, share what lands.', file: { kind: 'PDF', name: 'Claude Build Templates v2' }, meta: 'Yesterday · 9:15 AM' },
    { body: "Tool drop: the starter repo for Thursday's agentic system. Clone, deploy, break it.", file: { kind: 'ZIP', name: 'FDE starter · repo' }, meta: 'Today · 8:02 AM' },
    { body: 'Next live build: {when}. Link goes out an hour before.', meta: 'Today · 10:30 AM' },
  ],
  resources: [
    { kind: 'PDF', name: 'The FDE playbook', sub: 'PDF · 1.2 MB' },
    { kind: 'LNK', name: 'Free-plan tool links', sub: 'Notion · saved link' },
    { kind: '▶', name: 'Masterclass recording', sub: 'Video · 1h 58m' },
    { kind: '♪', name: 'Voice note: what to deploy next', sub: 'Audio · 4:12' },
    { kind: 'DOC', name: 'FDE loop checklist', sub: 'Doc · editable' },
  ],
};
export const FDE_CONTENT = {
  SLUG,
  ROOT_CLASS,
  HEADLINE,
  AUDIENCE_FOOT,
  TINY_NOTE,
  COMMUNITY,
  SUBTITLE,
  TITLE,
  TITLE_LINES,
  EYEBROW,
  TAGLINE,
  CAPSULES,
  SESSION,
  PRICE,
  SHOW_TIMER,
  HOST,
  STATS,
  SOCIAL_STATS,
  BUNDLE,
  TOOLS,
  WORKSHOP_DEMO_SHOT,
  AUDIENCE,
  PLAN,
  DIFFERENCE,
  FINAL_CTA,
  FAQS,
};
