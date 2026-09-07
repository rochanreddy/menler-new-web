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

// "0:20" -> 20. The agenda's "N min" labels are measured from the times PLAN
// already carries, so the two can never drift apart.
const clock = (s) => { const [h, m] = String(s).replace(/[^\d:]/g, '').split(':').map(Number); return h * 60 + m; };
const spanOf = (b) => clock(b.e) - clock(b.t);

const OFF = Math.round((1 - PRICE.now / PRICE.was) * 100);
const SAVE = PRICE.was - PRICE.now;
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const pad = (n) => String(n).padStart(2, '0');

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
  { n: '500+', l: 'Professionals trained' },
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

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

/* Google Fonts for the three faces the reference is set in. Injected here rather
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
          <div><i>▤</i><div><b>resources</b><small>Build templates, prompt packs, tool lists</small></div><em>9</em></div>
          <div><i>⌘</i><div><b>projects</b><small>Show what you shipped this week</small></div><em>13</em></div>
          <div><i>◎</i><div><b>deploys</b><small>What broke, what shipped</small></div><em>5</em></div>
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
        <div className="aw-msg"><b>Menler (Admin)</b>New build templates are up — the Claude prompts we use for architecture, debugging and docs. Use, remix, share what lands.<span className="file"><i>PDF</i>Claude Build Templates v2</span><span className="meta">Yesterday · 9:15 AM</span></div>
        <div className="aw-msg"><b>Menler (Admin)</b>Tool drop: the starter repo for Thursday's agentic system. Clone, deploy, break it.<span className="file"><i>ZIP</i>FDE starter · repo</span><span className="meta">Today · 8:02 AM</span></div>
        <div className="aw-msg"><b>Menler (Admin)</b>Next live build: {SESSION.dateShort}, {SESSION.timeShort}. Link goes out an hour before.<span className="meta">Today · 10:30 AM</span></div>
      </div>
    </div>
  );
  return (
    <div className="aw-phone">
      {head}
      <div className="aw-phone-tabs"><span>Community</span><span>Announcements</span><b>Resources</b></div>
      <div className="aw-phone-body" style={{ background: '#fff', padding: 0 }}>
        <div className="aw-list">
          <div><i>PDF</i><div><b>The FDE playbook</b><small>PDF · 1.2 MB</small></div></div>
          <div><i>LNK</i><div><b>Free-plan tool links</b><small>Notion · saved link</small></div></div>
          <div><i>▶</i><div><b>Masterclass recording</b><small>Video · 1h 58m</small></div></div>
          <div><i>♪</i><div><b>Voice note: what to deploy next</b><small>Audio · 4:12</small></div></div>
          <div><i>DOC</i><div><b>FDE loop checklist</b><small>Doc · editable</small></div></div>
        </div>
      </div>
    </div>
  );
}

export default function AgentsWorkshopCampaign() {
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

  // The reference's setToast: one message, five seconds, bottom-right.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  // Every CTA on the page lands on the reserve form, as on the reference.
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
    <div className="aw">
      <Seo
        title={`${TITLE} | Menler`}
        description="Turn real business problems into working AI systems. A live AI engineering masterclass on Claude Code, APIs, AI agents, n8n, GitHub and MCP — recording included, and a working system you keep."
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

      {/* 3 · Hero: headline + session card + reserve form + stats + bundle */}
      <section className="aw-hero" id="top">
        <div className="aw-hero-inner">
          <div className="aw-hero-head">
            <span className="aw-hero-eyebrow">{EYEBROW}</span>
            <h1>Build Like an <em>AI FDE</em></h1>
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

      {/* 3b · The bundle. Lifted out of the hero so the hero holds to one
          screen — it is a priced line-by-line breakdown, which is a section's
          worth of content rather than a hero's. */}
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
        <p className="aw-audience-foot"><span><i>+</i> Anyone who wants to build and ship AI solutions, not just prompt with AI</span></p>
      </section>

      {/* 6 · Who is teaching + the live session */}
      <section className="aw-host" id="host">
        <div className="aw-host-head"><h2>Who is <em className="serif">teaching</em></h2></div>

        <div className="aw-host-row">
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

          <figure className="aw-demo-shot">
            <img
              src={WORKSHOP_DEMO_SHOT}
              alt="A live Menler masterclass with participants on Zoom"
              loading="lazy"
            />
            <span className="aw-demo-badge"><b>300</b> in the room right now</span>
          </figure>
        </div>

        <div className="aw-social">
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
          <p className="aw-cm-lede">Daily tool drops, build templates and session updates — free with your seat, forever.</p>
        </div>
        <div className="aw-cm-shots">
          <figure><Phone kind="groups" /><figcaption><b>Topic groups</b><span>general · resources · projects</span></figcaption></figure>
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
              <div className="aw-tiny-note">Only a few seats for Thursday · Bring a problem to solve</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8b · Why this is engineering, not prompting */}
      <section className="aw-diff">
        <div className="aw-diff-inner">
          <span className="aw-diff-eyebrow">The AI FDE difference</span>
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
