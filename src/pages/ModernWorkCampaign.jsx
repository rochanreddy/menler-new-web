import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenlerWordmark from '../components/common/MenlerWordmark';
import Seo from '../components/common/Seo';
import BackgroundField from '../components/forms/BackgroundField';
import { COUNTRY_CODES } from '../data/countryCodes';
import { MENLER_WHATSAPP_URL } from '../data/communityLinks';
import { submitLead } from '../services/leadService';
import { verifySmsOtp, verifyEmailOtp } from '../lib/amplifeedOtp';
import { parseEventDateTime } from '../lib/calendar';
import '../styles/agents-workshop.css';

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
const clock = (s) => { const [h, m] = String(s).replace(/[^\d:]/g, '').split(':').map(Number); return h * 60 + m; };
const spanOf = (b) => clock(b.e) - clock(b.t);

const OFF = Math.round((1 - PRICE.now / PRICE.was) * 100);
const SAVE = PRICE.was - PRICE.now;
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const pad = (n) => String(n).padStart(2, '0');

const HOST = {
  name: 'Deepak Kerkar',
  badge: 'AI for Productivity',
  role: 'AI Program & Ops Manager, Interview Kickstart',
  img: '/mentors/Deepak.webp',
  bio: 'Deepak Kerkar is an educator and career strategist with over four years in ed-tech. He has led programs at Interview Kickstart and MyCaptain, guiding learners in digital marketing, UI/UX, content writing, and analytics. Beyond teaching, he co-founded The Thali Storie, a thriving cloud kitchen venture.',
  // mentorCreds on the Sanity doc, written out — the banner shows the three
  // marks as logos, and these say what he did at them.
  credLines: [
    'AI Program & Ops Manager, Interview Kickstart',
    '5+ years in Program Ops',
    'Ex-MyCaptain & Testbook',
  ],
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
  { n: '500+', l: 'Professionals trained' },
  { n: '25+', l: 'Hiring companies in the network' },
];

// Everything a seat includes — the campaign's own `get` list. The six sum to
// PRICE.was, so the `Total value` line under them is the real sum rather than
// a number typed twice.
const BUNDLE = [
  { t: 'A real agentic AI system', d: 'Not a demo, but a production-grade build that’s yours to keep.', p: 400 },
  { t: 'Live Q&A with the mentor', d: 'Ask anything and get unstuck in real time.', p: 299 },
  { t: 'Prompt & tool starter pack — worth ₹4999/-', d: 'Your ready-to-use toolkit for AI-powered productivity.', p: 800 },
  { t: 'Masterclass recording', d: 'Rewatch anytime, follow at your own pace.', p: 200 },
  { t: 'Mentorship & career opportunities', d: 'Get mentorship, career guidance, and access to relevant job opportunities.', p: 200 },
  { t: 'Exclusive community access', d: 'Join a network of AI builders and keep learning.', p: 100 },
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

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

/* Google Fonts for the three faces this build is set in. Injected here rather
   than in index.html so the rest of the site does not download them. */
const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap';
function useFonts() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);
}

/* Counts to the session in the rail's HRS : MIN : SEC blocks. */
function Timer({ to }) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(to) - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, new Date(to) - Date.now())), 1000);
    return () => clearInterval(id);
  }, [to]);
  if (left <= 0) return null;
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return (
    <span className="aw-timer" role="timer" aria-label="Time until the session">
      <b>{pad(h)}</b><i>:</i><b>{pad(m)}</b><i>:</i><b>{pad(s)}</b>
    </span>
  );
}

/* Three WhatsApp screens, drawn in HTML. Pass `shot` to use a real one. */
function Phone({ kind, shot }) {
  if (shot) return <img className="aw-phone" src={shot} alt="" loading="lazy" style={{ display: 'block', width: '100%' }} />;
  const head = (
    <>
      <div className="aw-phone-top"><span>9:41</span><span>●●● ⌁ ▮</span></div>
      <div className="aw-phone-head"><i>M</i><div><b>Menler AI Community</b><small>Community · members</small></div></div>
    </>
  );
  if (kind === 'groups') return (
    <div className="aw-phone">
      {head}
      <div className="aw-phone-tabs"><b>Community</b><span>Announcements</span><span>Groups</span></div>
      <div className="aw-phone-body" style={{ background: '#fff', padding: 0 }}>
        <div className="aw-list">
          <div><i>#</i><div><b>general</b><small>Say hi, ask anything</small></div><em>24</em></div>
          <div><i>▤</i><div><b>resources</b><small>Prompt packs, tool lists, templates</small></div><em>9</em></div>
          <div><i>⌘</i><div><b>workflows</b><small>What you automated this week</small></div><em>13</em></div>
          <div><i>◎</i><div><b>careers</b><small>Roles, referrals, resume reviews</small></div><em>5</em></div>
          <div><i>?</i><div><b>doubts</b><small>Stuck? Someone is awake.</small></div><em>2</em></div>
        </div>
      </div>
    </div>
  );
  if (kind === 'announcements') return (
    <div className="aw-phone">
      {head}
      <div className="aw-phone-tabs"><span>Community</span><b>Announcements</b><span>Groups</span></div>
      <div className="aw-phone-body">
        <div className="aw-msg"><b>Menler (Admin)</b>New prompt pack is up — the Claude prompts we use across Word, Excel and PowerPoint. Use, remix, share what lands.<span className="file"><i>PDF</i>Claude in MS 365 · prompt pack</span><span className="meta">Yesterday · 9:15 AM</span></div>
        <div className="aw-msg"><b>Menler (Admin)</b>Tool drop: the Fireflies → Notion meeting workflow, ready to copy into your own workspace.<span className="file"><i>ZIP</i>Meeting-to-action · template</span><span className="meta">Today · 8:02 AM</span></div>
        <div className="aw-msg"><b>Menler (Admin)</b>Next live session: {SESSION.dateShort}, {SESSION.timeShort}. Link goes out an hour before.<span className="meta">Today · 10:30 AM</span></div>
      </div>
    </div>
  );
  return (
    <div className="aw-phone">
      {head}
      <div className="aw-phone-tabs"><span>Community</span><span>Announcements</span><b>Resources</b></div>
      <div className="aw-phone-body" style={{ background: '#fff', padding: 0 }}>
        <div className="aw-list">
          <div><i>PDF</i><div><b>Crack your next high-paying job with AI</b><small>PDF · career guide</small></div></div>
          <div><i>LNK</i><div><b>Free-plan tool links</b><small>Notion · saved link</small></div></div>
          <div><i>▶</i><div><b>Masterclass recording</b><small>Video · 1h 56m</small></div></div>
          <div><i>♪</i><div><b>Voice note: what to automate first</b><small>Audio · 3:48</small></div></div>
          <div><i>DOC</i><div><b>Weekly AI work checklist</b><small>Doc · editable</small></div></div>
        </div>
      </div>
    </div>
  );
}

export default function ModernWorkCampaign() {
  useFonts();
  const navigate = useNavigate();
  const formRef = useRef(null);
  // Same shape as the other campaign forms, so a registrant from this page is
  // indistinguishable from one from /campaign/:slug in the admin and in the
  // lead store. college / graduation_year are set by BackgroundField, not typed.
  const [form, setForm] = useState({ name: '', email: '', countryCode: '+91', phone: '', city: '', college: '', graduation_year: '', background: '' });
  const [otpBusy, setOtpBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  // BackgroundField hands back { college, graduation_year } with both keys
  // always present, so spreading clears whichever no longer applies.
  const setDetail = (d) => setForm((f) => ({ ...f, ...d }));
  const indian = form.countryCode === '+91';
  const phoneMin = indian ? 10 : 8;
  const handlePhone = (v) => set('phone', v.replace(/\D/g, '').slice(0, indian ? 10 : 15));
  const ev = parseEventDateTime(SESSION.date, SESSION.time);

  // One message, five seconds, bottom-right.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  // Every CTA on the page lands on the reserve form.
  const toForm = (e) => {
    if (e) e.preventDefault();
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => formRef.current?.elements?.name?.focus(), 350);
  };

  // Validate → verify the phone (SMS inside India, email elsewhere) → create the
  // lead → /checkout, which takes the ₹199 and confirms.
  const register = async (e) => {
    e.preventDefault();
    // City is optional — useful for cohort planning, never a reason to block a
    // signup. Background is required, and BackgroundField reports '' until its
    // follow-up is answered, so a half-filled answer cannot get through.
    if (!form.name.trim() || !form.email.trim()) { setErr('Please fill in your name and email.'); return; }
    if (form.phone.length < phoneMin) { setErr(`Phone number must be at least ${phoneMin} digits.`); return; }
    if (!form.background) { setErr('Please tell us your background.'); return; }
    setErr('');
    setOtpBusy(true);
    setToast(indian ? 'Verifying your number…' : 'Emailing your code…');
    try {
      const phone = `${form.countryCode} ${form.phone}`;
      const phoneDigits = `${form.countryCode}${form.phone}`.replace(/\D/g, '');
      const otp = indian
        ? await verifySmsOtp(phoneDigits, { email: form.email.trim() })
        : await verifyEmailOtp(form.email.trim());
      setOtpBusy(false);
      setBusy(true);
      setToast('Secure Cashfree checkout opens on the next step.');
      const created = await submitLead({
        name: form.name, email: form.email, phone,
        ...otp,
        city: form.city, background: form.background,
        ...(form.college.trim() ? { college: form.college.trim() } : {}),
        ...(form.graduation_year ? { graduation_year: form.graduation_year } : {}),
        source: 'campaign-workshop', campaign: SLUG, workshop: TITLE,
        cta_label: `Book seat: ${TITLE}`, section: `Campaign · ${SLUG}`,
      });
      navigate('/checkout', {
        state: {
          leadId: created?.id,
          workshop: TITLE,
          eventStart: ev?.start, eventEnd: ev?.end,
          eventDate: SESSION.date, eventTime: SESSION.time,
          city: form.city,
          background: form.background,
          price: String(PRICE.now),
          name: form.name, email: form.email, phone,
          campaign: SLUG,
          whatsappUrl: MENLER_WHATSAPP_URL,
          communityText: 'Daily tool drops, prompt packs and workshop updates — free with your seat, forever.',
          showCommunity: true,
        },
      });
    } catch (e2) {
      setOtpBusy(false);
      setBusy(false);
      setErr(e2?.message || 'Verification failed. Please try again.');
      setToast(e2?.message || 'Verification failed. Please try again.');
    }
  };

  const pending = busy || otpBusy;
  const whenLine = `${SESSION.dateShort} · ${SESSION.timeShort}`;

  return (
    <div className="aw aw-mw">
      <Seo
        title={`${TITLE} | Menler`}
        description={SUBTITLE}
        noindex
      />

      {/* 1 · Offer rail, sticky */}
      <div className="aw-rail">
        <div className="aw-rail-timer">
          <strong>{OFF}% OFF</strong>
          <span>· Introductory offer</span>
          {SHOW_TIMER && ev?.start && <Timer to={ev.start} />}
        </div>
        <button type="button" className="aw-rail-cta" onClick={toForm}>Claim {inr(PRICE.now)} <b>→</b></button>
      </div>

      {/* 2 · Nav, sticky under the rail */}
      <nav className="aw-nav" aria-label="Page">
        <MenlerWordmark size={26} theme="light" />
        <div className="aw-nav-links">
          <a href="#learn">What you’ll learn</a>
          <a href="#host">Your host</a>
          <a href="#faq">FAQs</a>
        </div>
        <button type="button" className="aw-nav-cta" onClick={toForm}>Join for {inr(PRICE.now)} <span>↗</span></button>
      </nav>

      {/* 3 · Hero: headline + session card + reserve form + stats */}
      <section className="aw-hero" id="top">
        <div className="aw-hero-inner">
          <div className="aw-hero-head">
            <span className="aw-hero-eyebrow">{EYEBROW}</span>
            <h1>AI for <em>Modern Work</em> &amp; Careers</h1>
            <p className="aw-hero-tagline">{TAGLINE}</p>
            <ul className="aw-caps">
              {CAPSULES.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>

          <div className="aw-when">
            <div className="aw-when-date">
              <small>LIVE SESSION</small>
              <b>{SESSION.dateShort}</b>
              <span>{SESSION.timeShort}</span>
            </div>
            <ul className="aw-when-meta">
              <li><i>◷</i><span>{SESSION.duration}</span></li>
              <li><i>▣</i><span>{SESSION.platform}</span></li>
              <li><i>↺</i><span>{SESSION.replay}</span></li>
            </ul>
          </div>

          <form className="aw-form" id="reserve" ref={formRef} onSubmit={register} noValidate>
            <div className="aw-form-head"><b>Reserve your seat</b><span>{whenLine}</span></div>
            <div className="aw-fields">
              <label className="aw-field"><span>Full name</span>
                <input type="text" name="name" autoComplete="name" placeholder="Your name" required value={form.name} onChange={(e) => set('name', e.target.value)} disabled={pending} />
              </label>
              <label className="aw-field"><span>Email</span>
                <input type="email" name="email" autoComplete="email" placeholder="you@email.com" required value={form.email} onChange={(e) => set('email', e.target.value)} disabled={pending} />
              </label>
              <div className="aw-field aw-field-phone"><span>Phone (WhatsApp)</span>
                <div className="aw-phonerow">
                  <select aria-label="Country code" value={form.countryCode} onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value, phone: '' }))} disabled={pending}>
                    {COUNTRY_CODES.map(({ code, label }) => <option key={label} value={code}>{label}</option>)}
                  </select>
                  <input type="tel" name="phone" autoComplete="tel" inputMode="numeric" placeholder={indian ? '10-digit number' : 'Phone number'} required value={form.phone} onChange={(e) => handlePhone(e.target.value)} disabled={pending} aria-invalid={err && form.phone.length < phoneMin ? 'true' : undefined} />
                </div>
              </div>
              <label className="aw-field aw-field-city"><span>City <i>optional</i></span>
                <input type="text" name="city" autoComplete="address-level2" placeholder="Where you are" value={form.city} onChange={(e) => set('city', e.target.value)} disabled={pending} />
              </label>
              <div className="aw-field aw-field-bg"><span>Background</span>
                <BackgroundField
                  className="aw-bg-input"
                  label="Select background…"
                  mutedColor="#9c978f"
                  disabled={pending}
                  onChange={(v) => set('background', v)}
                  onDetail={setDetail}
                />
              </div>
            </div>
            <button className="aw-buy" type="submit" disabled={pending}>
              {otpBusy ? (indian ? 'Sending your OTP…' : 'Emailing your code…') : busy ? 'One moment…' : <>Book my seat — {inr(PRICE.now)} <span>↗</span></>}
            </button>
            <div className="aw-buy-meta"><s>{inr(PRICE.was)}</s><b>{OFF}% OFF</b><em>Today’s price</em></div>
            <p className="aw-form-note" data-state={err ? 'error' : undefined}>
              {err || 'Seat details and the WhatsApp invite go to your email.'}
            </p>
          </form>

          <div className="aw-stats">
            {STATS.map((s) => <div key={s.l}><b>{s.n}</b><small>{s.l}</small></div>)}
          </div>

        </div>
      </section>

      {/* 3b · The bundle. Kept out of the hero so the hero holds to one screen —
          it is a priced line-by-line breakdown, which is a section's worth of
          content rather than a hero's. */}
      <section className="aw-stackband">
        <div className="aw-stack">
          <div className="aw-stack-head"><small>EVERYTHING YOU GET</small><b>The full bundle</b></div>
          <ul className="aw-stack-list">
            {BUNDLE.map((b, i) => (
              <li key={b.t}><span className="si">{pad(i + 1)}</span><b>{b.t}</b><em>{b.d}</em><i>{inr(b.p)}</i></li>
            ))}
          </ul>
          <div className="aw-stack-total"><span>Total value</span><s>{inr(PRICE.was)}</s></div>
          <div className="aw-stack-price">
            <div><small>Your price today</small><b>{inr(PRICE.now)}</b></div>
            <span className="aw-stack-save">Save {inr(SAVE)} · {OFF}% off</span>
          </div>
          <p className="aw-stack-note">Pay once · Seat confirmed right away · Nothing more to buy</p>
        </div>
      </section>

      {/* 4 · Tool marquee — two identical sets so the loop is seamless */}
      <section className="aw-marquee" aria-label="AI tools covered">
        <div className="aw-marquee-track">
          {[0, 1].map((k) => (
            <div className="aw-marquee-set" key={k} aria-hidden={k === 1 || undefined}>
              {TOOLS.map((t) => <span key={t.name}><img src={t.logo} alt="" loading="lazy" />{t.name}</span>)}
            </div>
          ))}
        </div>
      </section>

      {/* 5 · Who this is for */}
      <section className="aw-audience">
        <div className="aw-audience-head"><h3>Who this is <em className="serif">for</em></h3></div>
        <ul className="aw-audience-rows">
          {AUDIENCE.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}
        </ul>
        <p className="aw-audience-foot"><span><i>+</i> Anyone who wants AI to do real work for them, not just answer questions</span></p>
      </section>

      {/* 6 · Who is teaching + the live session */}
      <section className="aw-host" id="host">
        <div className="aw-host-head"><h2>Who is <em className="serif">teaching</em></h2></div>

        <div className="aw-hostbanner">
          <div className="aw-hb-copy">
            <span className="aw-hb-wm"><MenlerWordmark size={26} theme="light" /></span>
            <span className="aw-hb-badge"><i>✦</i>{HOST.badge}</span>
            <h3 className="aw-hb-title">{TITLE_LINES.map((l) => <span key={l}>{l}</span>)}</h3>
            <p className="aw-hb-tagline">{TAGLINE}</p>
            <p className="aw-hb-by">By <b>{HOST.name}</b> — {HOST.role}</p>
            <ul className="aw-hb-creds">
              {HOST.creds.map((c) => (
                <li key={c.name}><img src={c.logo} alt={c.name} title={c.name} loading="lazy" /></li>
              ))}
            </ul>
          </div>
          <div className="aw-hb-photo">
            <img src={HOST.img} alt={`${HOST.name}, ${HOST.role}`} loading="lazy" />
          </div>
          <div className="aw-hb-when">
            <span><i>🗓</i>{SESSION.dateLong}</span>
            <span className="dot">●</span>
            <span className="time">{SESSION.time}</span>
          </div>
        </div>

        {/* The banner names him; this says what he has done. */}
        <div className="aw-hostbio">
          <p>{HOST.bio}</p>
          <ul>{HOST.credLines.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>

        <div className="aw-social">
          <figure className="aw-demo-shot">
            <img
              src={WORKSHOP_DEMO_SHOT}
              alt="A live Menler masterclass with participants on Zoom"
              loading="lazy"
            />
            <span className="aw-demo-badge"><b>300</b> in the room right now</span>
          </figure>
          <div className="aw-social-stats">
            {SOCIAL_STATS.map((s) => <div key={s.l}><b>{s.n}</b><span>{s.l}</span></div>)}
          </div>
        </div>
      </section>

      {/* 7 · The WhatsApp community */}
      <section className="aw-community">
        <div className="aw-cm-head">
          <span className="aw-cm-badge">{WA_ICON}Menler’s AI community on WhatsApp</span>
          <h2>The <em className="serif">WhatsApp community</em> you get access to</h2>
          <p className="aw-cm-lede">Daily tool drops, prompt packs and session updates — free with your seat, forever.</p>
        </div>
        <div className="aw-cm-shots">
          <figure><Phone kind="groups" /><figcaption><b>Topic groups</b><span>general · resources · workflows</span></figcaption></figure>
          <figure className="mid"><Phone kind="announcements" /><figcaption><b>Announcements</b><span>Prompt packs &amp; tool drops</span></figcaption></figure>
          <figure><Phone kind="resources" /><figcaption><b>Resources</b><span>Files, links, voice notes</span></figcaption></figure>
        </div>
        <div className="aw-cm-foot">
          <a className="aw-cm-cta" href={MENLER_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{WA_ICON}Join the community<span>→</span></a>
          <ul className="aw-cm-stats">
            <li><b>Daily</b><span>Tool drops</span></li>
            <li><b>Free</b><span>With your seat</span></li>
            <li><b>Forever</b><span>Once you’re in</span></li>
          </ul>
        </div>
      </section>

      {/* 8 · The two hours, with the price card pinned beside it */}
      <section className="aw-plan" id="learn">
        <div className="aw-pb-head">
          <h2>What happens in the <em className="serif">2 hours</em></h2>
          <p>Every block ends with something you keep.</p>
        </div>
        <div className="aw-pb-grid">
          <ol className="aw-pb-plan">
            {PLAN.map((b, i) => {
              const len = spanOf(b);
              return (
                <li key={b.title} className={b.hot ? 'hot' : undefined}>
                  <div className="aw-pt-when">
                    <span className="aw-pt-time">{b.t}<i>{b.e}</i></span>
                    <span className="aw-pt-len">{len} min</span>
                  </div>
                  <div className="aw-pt-rail" aria-hidden="true"><span className="aw-pt-node" /></div>
                  <div className="aw-pt-card">
                    <div className="aw-pt-top">
                      <span className="aw-pt-no">{pad(i + 1)}</span>
                      <b>{b.title}</b>
                      <span className={`aw-pt-badge${b.hot ? '' : ' ghost'}`}>{b.badge}</span>
                    </div>
                    <em>{b.d}</em>
                    {b.keep && <span className="aw-pt-take"><i>✓</i>You keep: {b.keep}</span>}
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="aw-pb-buy" id="checkout">
            <div className="aw-price-card">
              <div className="aw-price-label">{TITLE}</div>
              <div className="aw-price-anchor"><s>{inr(PRICE.was)}</s><b>{OFF}% OFF</b></div>
              <div className="aw-price"><span>₹</span>{PRICE.now}</div>
              <p>Opening price · Pay once</p>
              <button type="button" className="aw-buy" onClick={toForm}>Book my seat for {inr(PRICE.now)} <span>↗</span></button>
              <small>🔒 Safe payment · Seat confirmed right away</small>
              <div className="aw-tiny-note">⚡ Limited seats · Live interactive session</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8b · Why this is a change in how you work, not a tool tour */}
      <section className="aw-diff">
        <div className="aw-diff-inner">
          <span className="aw-diff-eyebrow">The AI-native difference</span>
          <p className="aw-diff-lead">{DIFFERENCE.lead}</p>
          <p className="aw-diff-turn">{DIFFERENCE.turn}</p>
          <ol className="aw-diff-loop">
            {DIFFERENCE.loop.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className="aw-diff-close">{DIFFERENCE.close}</p>
        </div>
      </section>

      {/* 9 · FAQ */}
      <section className="aw-faq" id="faq">
        <h2><em className="serif">FAQ</em></h2>
        <div className="aw-faq-list">
          {FAQS.map(([q, a], i) => (
            <details key={q} open={i === 0 || undefined}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 9b · The closing ask */}
      <section className="aw-final">
        <h2>{FINAL_CTA.head}</h2>
        <p>{FINAL_CTA.sub}</p>
        <button type="button" className="aw-final-cta" onClick={toForm}>
          {FINAL_CTA.cta} <span aria-hidden="true">→</span>
        </button>
        <small>{SESSION.dateLong} · {SESSION.time} · {SESSION.replay}</small>
      </section>

      {/* 10 · Footer */}
      <footer className="aw-foot">
        <span className="aw-brand"><MenlerWordmark size={22} theme="dark" /></span>
        <span>Make AI work for you.</span>
        <span>© {new Date().getFullYear()} · Built for everyone.</span>
      </footer>

      {/* 11 · Fixed: Buy Now on phones, and the toast */}
      <div className="aw-mobile-cta">
        <a href="#reserve" onClick={toForm}>Buy Now — {inr(PRICE.now)}</a>
      </div>
      <div className={`aw-toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
