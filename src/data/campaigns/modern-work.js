/* Content for /campaign/ai-for-modern-work-and-careers.
 *
 * Data only — the design is src/pages/campaign/PaidCampaignLayout.jsx.
 */
// ── /campaign/ai-for-modern-work-and-careers — the ₹199 AI for Modern Work
// & Careers masterclass ──
// The same build as /campaign/build-like-an-ai-fde, block for block: the sticky
// offer rail, the sticky nav under it, the hero with the session card and the
// reserve form side by side, the itemised bundle, the tool marquee, the
// audience strip, the host banner with the live-session shot, the WhatsApp
// band, the session plan with the price card pinned beside it, the FAQ, and
// the Buy Now bar fixed to the bottom of a phone. It shares that page's
// stylesheet — everything is prefixed .aw- and the palette is Menler's, not
// the FDE campaign's — plus the small .aw-mw block at the end of it for the
// two things this campaign needs and that one didn't (a six-line bundle and
// the mentor's bio).
//
// Every word of the content is the AI for Modern Work & Careers campaign
// (Sanity slug `ai-for-modern-work-and-careers`) — its session, its mentor,
// its four learning blocks and the six things a seat includes. Unlike the FDE
// masterclass, this one assumes no code at all: the tools are Microsoft 365,
// Fireflies, Notion, Claude and Gemini, used the way the room already uses a
// document or a browser.
//
// Only the plumbing is Menler's: the reserve form verifies the phone, creates
// the lead, and hands the registrant to /checkout, which takes the ₹199 through
// Cashfree and confirms the seat. Every CTA on the page scrolls to that form.

const SLUG = 'ai-for-modern-work-and-careers';
const TITLE = 'AI for Modern Work & Careers';
const TITLE_LINES = ['AI for', 'Modern Work & Careers'];
const EYEBROW = 'Live AI Productivity Masterclass';
const TAGLINE = 'Work smarter. Move faster. Become AI-native.';
const SUBTITLE = 'Bring AI into your everyday work, from documents and data to presentations, meetings, research, and career workflows.';
// The stack the session works in, shown as capsules straight under the hero
// tagline. Text-only, to match the FDE build — and because "Microsoft 365" here
// stands for three apps rather than one logo.
const CAPSULES = ['Claude', 'Microsoft 365', 'Excel', 'PowerPoint', 'Fireflies', 'Notion', 'Gemini', '& more'];

/* ── Edit these ──────────────────────────────────────────────────────────── */
const SESSION = {
  date: 'Friday, 11 September 2026',    // feeds the calendar event on the confirmation page
  time: '7:00 PM – 9:00 PM IST',
  dateLong: '11 September 2026, Friday',   // as the banner writes it
  dateShort: 'Fri, 11 Sept',
  timeShort: '7:00 PM IST',
  duration: '2 hours',
  platform: 'Live Online Masterclass',
  replay: 'Recording included',
};
// `was` is the campaign's own advertised value (origPrice on the Sanity doc),
// so the anchor here and the anchor on the Sanity-driven page tell the reader
// the same number. BUNDLE below sums to exactly this.
const PRICE = { now: 199, was: 1999 };
// The FDE build carries a countdown in the offer rail but ships with it hidden;
// flip this on and it counts down to the session.
const SHOW_TIMER = false;
/* ────────────────────────────────────────────────────────────────────────── */

// "0:20" -> 20. The agenda's "N min" labels are measured from the times PLAN
// already carries, so the two can never drift apart.


const HOST = {
  name: 'Deepak Kerkar',
  badge: 'AI for Productivity',
  role: 'AI Program & Ops Manager, Interview Kickstart',
  img: '/mentors/Deepak.webp',
  // The campaign's own credLogos, pulled down from Sanity so the page carries
  // no remote image dependency. All three are white-ground squares, and the
  // CSS gives each one a tile.
  creds: [
    { name: 'Interview Kickstart', logo: '/logos/interview-kickstarter.png' },
    { name: 'MyCaptain', logo: '/logos/mycaptain.png' },
    { name: 'Testbook', logo: '/logos/testbook.png' },
  ],
};

// Facts about the session and claims Menler already makes elsewhere on the site.
const STATS = [
  { n: '4', l: 'Work areas you upgrade' },
  { n: '10+', l: 'AI tools you use live' },
  { n: '0', l: 'Lines of code needed' },
];
const SOCIAL_STATS = [
  { n: '5000+', l: 'Professionals trained' },
  { n: '25+', l: 'Hiring companies in the network' },
];

// Everything a seat includes — the campaign's own `get` list. The six sum to
// PRICE.was, so the `Total value` line under them is the real sum rather than
// a number typed twice.
const BUNDLE = [
  { t: 'A real agentic AI system', d: 'Not a demo, but a production-grade build that’s yours to keep.', p: 400 },
  { t: 'Your AI-at-work audit', d: 'Where AI saves you hours in a normal week, and where it wastes them.', p: 200 },
  { t: 'Document, sheet & deck prompt set', d: 'The prompts behind faster Word, Excel and PowerPoint work.', p: 250 },
  { t: 'Prompt & tool starter pack — worth ₹4999/-', d: 'Your ready-to-use toolkit for AI-powered productivity.', p: 400 },
  { t: 'Live Q&A with the mentor', d: 'Ask anything and get unstuck in real time.', p: 250 },
  { t: 'Masterclass recording', d: 'Rewatch anytime, follow at your own pace.', p: 200 },
  { t: 'Mentorship & career opportunities', d: 'Get mentorship, career guidance, and access to relevant job opportunities.', p: 200 },
  { t: 'Exclusive community access', d: 'Join a network of AI builders and keep learning.', p: 99 },
];

// The tools the two hours actually open. Microsoft 365 appears as the suite and
// again as the two apps the session spends longest in, and the two are kept far
// enough apart in the loop that the repeat does not read as a bug.
const TOOLS = [
  { name: 'Claude', logo: '/logos/claude.svg' },
  { name: 'Microsoft 365', logo: '/logos/microsoft.webp' },
  { name: 'Fireflies', logo: '/logos/fireflies.webp' },
  { name: 'Notion', logo: '/logos/notion.webp' },
  { name: 'Gemini', logo: '/logos/gemini.webp' },
  { name: 'Excel', logo: '/logos/excel.webp' },
  { name: 'PowerPoint', logo: '/logos/powerpoint.webp' },
  { name: 'ChatGPT', logo: '/logos/chatgpt.webp' },
  { name: 'NotebookLM', logo: '/logos/notebooklm.webp' },
  { name: 'Perplexity', logo: '/logos/perplexity.svg' },
  { name: 'Gamma', logo: '/logos/gamma.webp' },
  { name: 'Canva', logo: '/logos/canva.webp' },
];

const WORKSHOP_DEMO_SHOT = '/campaign/live-session-demo.png';

const AUDIENCE = [
  ['Working Professionals', 'Cut hours out of documents, decks, email and reporting every week.'],
  ['Managers & Team Leads', 'Run meetings, notes and follow-ups on autopilot so the team moves faster.'],
  ['Operations & HR', 'Turn scattered information into trackers, processes and answers people can use.'],
  ['Students & Job Seekers', 'Build an AI-native research, resume and interview-prep workflow.'],
  ['Founders & Freelancers', 'Do the work of a small team with AI in the loop.'],
  ['Career Switchers', 'Pick up the AI skills employers are already screening for.'],
];

// Two hours, 7:00 to 9:00 — the campaign's four `learn` blocks, with an opening
// frame and a closing build around them.
const PLAN = [
  { t: '0:00', e: '–0:15', title: 'The AI-Native Shift', d: 'Where AI actually saves you hours in a normal working week — and where it quietly wastes them.', keep: 'Your AI-at-work audit', badge: 'SETUP', hot: false },
  { t: '0:15', e: '–0:50', title: 'AI-Powered Microsoft 365', d: 'Use Claude across Word, Excel & PowerPoint to write, analyze, and create faster.', keep: 'Document, sheet & deck prompt set', badge: 'BUILD', hot: true },
  { t: '0:50', e: '–1:00', title: 'Break + Prompt Review', d: 'Look at what the room built so far and fix the prompts that are not landing yet.', keep: '', badge: 'BREAK', hot: false },
  { t: '1:00', e: '–1:25', title: 'AI Meeting Intelligence', d: 'Use Fireflies + AI to capture meetings, extract insights, and automate follow-ups.', keep: 'Meeting-to-action workflow', badge: 'BUILD', hot: true },
  { t: '1:25', e: '–1:45', title: 'AI Knowledge & Productivity', d: 'Use Notion, Claude & Gemini to organize information, research, and manage everyday work.', keep: 'Your AI second brain', badge: 'BUILD', hot: true },
  { t: '1:45', e: '–2:00', title: 'Build Your AI Workflows', d: 'Connect AI tools to streamline research, communication, analysis, and execution — including your own career workflow.', keep: 'Work + career automation plan', badge: 'SHIP', hot: true },
];

// The pitch for why this is a change in how you work rather than a tool tour,
// set between the agenda and the FAQ where the reader has just seen what the
// two hours do.
const DIFFERENCE = {
  eyebrow: 'The AI-native difference',
  lead: 'Most people use AI to answer a question.',
  turn: 'AI-native professionals use it to do the work.',
  loop: ['Capture', 'Draft', 'Analyse', 'Automate', 'Decide'],
  close: 'That’s the shift this masterclass is designed to make.',
};

const FINAL_CTA = {
  head: 'Stop reading about AI at work. Start working with it.',
  sub: 'Become AI-native in 2 hours.',
  cta: 'Reserve your seat',
};

const FAQS = [
  ['Do I need any coding experience?', 'None. Every tool in this masterclass is used the way you already use a document, a spreadsheet or a browser — you type, and AI does the work.'],
  ['Which tools will we actually use?', 'Claude across Microsoft 365 (Word, Excel and PowerPoint), Fireflies for meetings, and Notion, Claude and Gemini for research and knowledge work.'],
  ['Do I need paid AI subscriptions?', 'No. We will show the free plans that cover everything in the session, and flag the few places where a paid plan adds something.'],
  ['Is this only for people in office jobs?', 'No. The workflows apply just as much to students, job seekers, freelancers and founders as they do to salaried roles.'],
  ['What do I walk away with?', 'The prompt and tool starter pack, the workflows you build live, the recording, and a plan for your first week of using them.'],
  ['Will I get a recording?', 'Yes. The masterclass recording is shared after the live session and it is yours to rewatch anytime.'],
  ['How is this different from a YouTube tutorial?', 'You build alongside the mentor on your own work, and you can ask questions live until it actually runs for you.'],
  ['Is there any career support?', 'Yes. Your seat includes mentorship, career guidance and access to relevant job opportunities through the Menler network.'],
];

// The last few things that used to be written straight into the markup.
const ROOT_CLASS = 'aw aw-mw';
const HEADLINE = { pre: 'AI for ', em: 'Modern Work', post: ' & Careers' };
const AUDIENCE_FOOT = 'Anyone who wants AI to do real work for them, not just answer questions';
const TINY_NOTE = '⚡ Limited seats · Live interactive session';
// The WhatsApp mock-ups. Drawn in HTML, so they say what THIS community says.
const COMMUNITY = {
  lede: 'Daily tool drops, prompt packs and session updates — free with your seat, forever.',
  groupsLabel: 'general · resources · workflows',
  groups: [
    { icon: '#', name: 'general', sub: 'Say hi, ask anything', count: 24 },
    { icon: '▤', name: 'resources', sub: 'Prompt packs, tool lists, templates', count: 9 },
    { icon: '⌘', name: 'workflows', sub: 'What you automated this week', count: 13 },
    { icon: '◎', name: 'careers', sub: 'Roles, referrals, resume reviews', count: 5 },
    { icon: '?', name: 'doubts', sub: 'Stuck? Someone is awake.', count: 2 },
  ],
  announcements: [
    { body: 'New prompt pack is up — the Claude prompts we use across Word, Excel and PowerPoint. Use, remix, share what lands.', file: { kind: 'PDF', name: 'Claude in MS 365 · prompt pack' }, meta: 'Yesterday · 9:15 AM' },
    { body: 'Tool drop: the Fireflies → Notion meeting workflow, ready to copy into your own workspace.', file: { kind: 'ZIP', name: 'Meeting-to-action · template' }, meta: 'Today · 8:02 AM' },
    { body: 'Next live session: {when}. Link goes out an hour before.', meta: 'Today · 10:30 AM' },
  ],
  resources: [
    { kind: 'PDF', name: 'Crack your next high-paying job with AI', sub: 'PDF · career guide' },
    { kind: 'LNK', name: 'Free-plan tool links', sub: 'Notion · saved link' },
    { kind: '▶', name: 'Masterclass recording', sub: 'Video · 1h 56m' },
    { kind: '♪', name: 'Voice note: what to automate first', sub: 'Audio · 3:48' },
    { kind: 'DOC', name: 'Weekly AI work checklist', sub: 'Doc · editable' },
  ],
};
export const MODERN_WORK_CONTENT = {
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
