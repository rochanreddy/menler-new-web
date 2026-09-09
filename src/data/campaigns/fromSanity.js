/* Turn a Sanity campaignPage document into the object PaidCampaignLayout wants.
 *
 * The design asks for 26 things; a document should not have to spell out all
 * 26. Most come from fields the campaign schema already had — `learn` becomes
 * the agenda, `get` becomes the bundle, `forYou` becomes the audience strip,
 * the mentor and banner fields carry across as they are. Only five things had
 * no home and were added to the schema: the capsules, the three stats, a price
 * on each bundle row, timings on each agenda row, and the FAQs.
 *
 * Everything else falls back to the defaults below, so a new campaign renders
 * a complete page from the day it is created and can be refined later.
 */

import { MENLER_WHATSAPP_URL } from '../communityLinks';
import { sessionFrom } from './session';

/* ── Defaults ─────────────────────────────────────────────────────────────
   Written to be true of any Menler masterclass, not of one campaign. A
   document that sets its own value always wins. */

const DEFAULT_TOOLS = [
  { name: 'Claude', logo: '/logos/claude.svg' },
  { name: 'ChatGPT', logo: '/logos/chatgpt.webp' },
  { name: 'Gemini', logo: '/logos/gemini.webp' },
  { name: 'Perplexity', logo: '/logos/perplexity.svg' },
  { name: 'n8n', logo: '/logos/n8n.webp' },
  { name: 'Notion AI', logo: '/logos/notion.webp' },
  { name: 'NotebookLM', logo: '/logos/notebooklm.webp' },
  { name: 'Canva', logo: '/logos/canva.webp' },
  { name: 'Gamma', logo: '/logos/gamma.webp' },
  { name: 'Lovable', logo: '/logos/lovable-logo.webp' },
];

const DEFAULT_COMMUNITY = {
  lede: 'Daily tool drops, prompt packs and session updates — free with your seat, forever.',
  groupsLabel: 'general · resources · projects',
  groups: [
    { icon: '#', name: 'general', sub: 'Say hi, ask anything', count: 24 },
    { icon: '▤', name: 'resources', sub: 'Prompt packs, tool lists, templates', count: 9 },
    { icon: '⌘', name: 'projects', sub: 'Show what you built this week', count: 13 },
    { icon: '◎', name: 'careers', sub: 'Roles, referrals, resume reviews', count: 5 },
    { icon: '?', name: 'doubts', sub: 'Stuck? Someone is awake.', count: 2 },
  ],
  announcements: [
    { body: 'New prompt pack is up. Use, remix, share what lands.', file: { kind: 'PDF', name: 'Menler prompt pack' }, meta: 'Yesterday · 9:15 AM' },
    { body: 'Tool drop: this week’s workflow, ready to copy into your own workspace.', file: { kind: 'ZIP', name: 'Workflow · template' }, meta: 'Today · 8:02 AM' },
    { body: 'Next live session: {when}. Link goes out an hour before.', meta: 'Today · 10:30 AM' },
  ],
  resources: [
    { kind: 'PDF', name: 'Session playbook', sub: 'PDF · 1.2 MB' },
    { kind: 'LNK', name: 'Free-plan tool links', sub: 'Notion · saved link' },
    { kind: '▶', name: 'Masterclass recording', sub: 'Video · 2h' },
    { kind: '♪', name: 'Voice note: what to do first', sub: 'Audio · 4:12' },
    { kind: 'DOC', name: 'Weekly checklist', sub: 'Doc · editable' },
  ],
};

const DEFAULT_SOCIAL_STATS = [
  { n: '5000+', l: 'Professionals trained' },
  { n: '25+', l: 'Hiring companies in the network' },
];

const DEFAULT_DEMO_SHOT = '/campaign/live-session-demo.png';

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const clean = (v) => (typeof v === 'string' ? v.trim() : v);
const list = (v) => (Array.isArray(v) && v.length ? v : null);
const money = (v) => {
  const n = Number(String(v ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
};

/* "AI for Modern Work & Careers" with line 1 highlighted becomes
   pre + <em>line1</em> + post. A document that gives both banner lines gets
   the second line as the plain half, which is how both current pages read. */
const headlineFrom = (d) => {
  const l1 = clean(d.bannerLine1) || '';
  const l2 = clean(d.bannerLine2) || '';
  if (l1 && l2) return { pre: '', em: l1, post: ` ${l2}` };
  return { pre: '', em: l1 || clean(d.title) || '', post: '' };
};

/* The agenda. A row without timings still renders — it just has no clock. */
const planFrom = (d) => {
  const rows = list(d.learn);
  if (!rows) return [];
  return rows.map((r, i) => ({
    t: clean(r.start) || '',
    e: clean(r.end) ? `–${String(r.end).replace(/^[–-]\s*/, '')}` : '',
    title: clean(r.title) || '',
    d: clean(r.detail) || '',
    keep: clean(r.keep) || '',
    badge: clean(r.badge) || (i === 0 ? 'SETUP' : 'BUILD'),
    hot: r.badge ? !['BREAK', 'Q&A'].includes(String(r.badge).toUpperCase()) : i > 0,
  }));
};

/* The bundle. Prices are what make the "total value" line honest, so a row
   without one contributes nothing rather than a guessed number. */
const bundleFrom = (d) => {
  const rows = list(d.get);
  if (!rows) return [];
  return rows.map((r) => ({ t: clean(r.title) || '', d: clean(r.detail) || '', p: money(r.price) }));
};

/* "Who this is for". The schema's original `forYou` is a plain list of
   strings; the paid design wants a label and a line. "Label — detail" splits;
   anything else becomes a label on its own. */
const audienceFrom = (d) => {
  const rows = list(d.audience);
  if (rows) return rows.map((r) => [clean(r.title) || '', clean(r.detail) || '']);
  const bullets = list(d.forYou);
  if (!bullets) return [];
  return bullets.map((b) => {
    const m = String(b).split(/\s+[—–-]\s+/);
    return m.length > 1 ? [m[0].trim(), m.slice(1).join(' — ').trim()] : [String(b).trim(), ''];
  });
};

/** A Sanity campaignPage → the shape PaidCampaignLayout renders. */
export function contentFromSanity(d) {
  if (!d) return null;
  const slug = d.slug?.current || d.slug || '';
  const now = money(d.price);
  const was = money(d.origPrice);

  return {
    SLUG: slug,
    TITLE: clean(d.title) || '',
    TITLE_LINES: [clean(d.bannerLine1), clean(d.bannerLine2)].filter(Boolean),
    EYEBROW: clean(d.bannerBadge) || 'Live Masterclass',
    TAGLINE: clean(d.bannerTagline) || '',
    SUBTITLE: clean(d.subtitle) || clean(d.bannerTagline) || '',
    HEADLINE: headlineFrom(d),
    CAPSULES: list(d.capsules) || [],
    // Only the two paid pages carry a theme class of their own; a Sanity
    // campaign uses the base one.
    ROOT_CLASS: 'aw',

    // The short forms used to come from splitting the date on its comma and the
    // time on its dash, which only read correctly when the admin happened to
    // type "Fri, 11 Sept …" — any other order put the whole date in the sticky
    // bar, and the dash split dropped the timezone off the time. sessionFrom
    // works it out from the date itself instead.
    SESSION: sessionFrom(d, {
      date: '',
      time: '',
      dateLong: '',
      dateShort: '',
      timeShort: '',
      duration: clean(d.duration) || '2 hours',
      platform: clean(d.format) || 'Live Online Masterclass',
      replay: 'Recording included',
    }),
    // A paid page needs both halves of the anchor. Without an original price
    // there is no discount to show, so the anchor falls back to the price.
    PRICE: { now: now || 0, was: was || now || 0 },
    SHOW_TIMER: false,

    HOST: {
      name: clean(d.mentorName) || '',
      badge: clean(d.bannerBadge) || 'Live Masterclass',
      role: clean(d.mentorRole) || '',
      img: d.mentorPhoto || '',
      creds: (list(d.credLogos) || []).map((c) => ({ name: c.name || '', logo: c.image || c.logoPath || '' })).filter((c) => c.logo),
    },

    STATS: (list(d.stats) || []).map((s) => ({ n: clean(s.value) || '', l: clean(s.label) || '' })),
    SOCIAL_STATS: DEFAULT_SOCIAL_STATS,
    BUNDLE: bundleFrom(d),
    TOOLS: list(d.tools)?.map((t) => ({ name: t.name, logo: t.logoPath })) || DEFAULT_TOOLS,
    WORKSHOP_DEMO_SHOT: d.eventImage || DEFAULT_DEMO_SHOT,
    AUDIENCE: audienceFrom(d),
    AUDIENCE_FOOT: clean(d.audienceFoot) || 'Anyone who wants AI to do real work for them',
    PLAN: planFrom(d),
    TINY_NOTE: clean(d.seatsNote) || '⚡ Limited seats · Live interactive session',

    DIFFERENCE: d.difference?.turn
      ? {
        eyebrow: clean(d.difference.eyebrow) || 'The difference',
        lead: clean(d.difference.lead) || '',
        turn: clean(d.difference.turn) || '',
        loop: list(d.difference.loop) || [],
        close: clean(d.difference.close) || '',
      }
      : null,

    FINAL_CTA: {
      head: clean(d.finalCtaHead) || 'Stop reading about AI. Start working with it.',
      sub: clean(d.finalCtaSub) || `Your seat is ${now ? `₹${now}` : 'waiting'}.`,
      cta: 'Reserve your seat',
    },

    FAQS: (list(d.faqs) || []).map((f) => [clean(f.q) || '', clean(f.a) || '']),
    COMMUNITY: {
      ...DEFAULT_COMMUNITY,
      lede: clean(d.whatsappText) || DEFAULT_COMMUNITY.lede,
    },
    WHATSAPP_URL: clean(d.whatsappUrl) || MENLER_WHATSAPP_URL,
  };
}

export default contentFromSanity;
