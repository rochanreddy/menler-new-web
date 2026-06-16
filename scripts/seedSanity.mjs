/**
 * One-time content seeding: pushes the site's current hardcoded content into
 * Sanity so the client starts with real content (not blank fields).
 *
 * Usage (PowerShell):
 *   $env:VITE_SANITY_PROJECT_ID="xxxx"; $env:SANITY_WRITE_TOKEN="sk..."; npm run seed
 * or rely on the values already in .env (loaded below).
 *
 * Idempotent: uses createOrReplace with deterministic _ids, so re-running
 * overwrites the seeded docs rather than duplicating them. The write token is
 * an Editor token from sanity.io → API → Tokens. NEVER commit it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { PROJECTS } from '../src/data/projectsData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

// --- load .env (simple parser; avoids adding a dependency) ---
try {
  const env = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env */ }

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing VITE_SANITY_PROJECT_ID and/or SANITY_WRITE_TOKEN. Set them in .env or the shell.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false });

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const rank = (i) => String(i).padStart(6, '0');

const assetCache = new Map();
async function uploadImage(publicPath) {
  if (!publicPath) return null;
  if (assetCache.has(publicPath)) return assetCache.get(publicPath);
  const abs = path.join(PUBLIC, decodeURI(publicPath).replace(/^\//, ''));
  if (!fs.existsSync(abs)) { console.warn('  ! image not found:', abs); return null; }
  const asset = await client.assets.upload('image', fs.createReadStream(abs), { filename: path.basename(abs) });
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  assetCache.set(publicPath, ref);
  return ref;
}

// --- mentors (mirrors MENTORS in src/components/common/MentorsRail.jsx) ---
const MENTORS = [
  { name: 'Anuttam G', role: 'Product Manager', company: 'Flipkart, Ex-BigBasket', img: '/mentors/Anuttam.png' },
  { name: 'Shashank Kumar', role: 'Technical Operations & Analytics Lead', company: 'Equifax', img: '/mentors/Shashank.png' },
  { name: 'Abhinay Kumar', role: 'CTO', company: 'Kernel Theory', img: '/mentors/Abhinay.png' },
  { name: 'Rohit', role: 'CEO-Office · Business Manager at Zolve', company: 'Zolve', img: '/mentors/ROHIT.png' },
  { name: 'Nitin K Sethi', role: 'AI Engineer', company: 'McKinsey', img: '/mentors/Nitin.png' },
  { name: 'Deepak K', role: 'AI Operations Lead', company: 'Testbook', img: '/mentors/Deepak.png' },
  { name: 'Manish Yadav', role: 'AI Service Business Analyst', company: 'Zendesk', img: '/mentors/Manish.png' },
  { name: 'Pranay W', role: 'AI Product Generalist', company: 'Wednesday Solution', img: '/mentors/Pranay.jpeg' },
  { name: 'Salimullah Khan', role: 'AI Product Manager — Digital Solution', company: 'Black Tiger Cement', img: '/mentors/Salimullah.png' },
  { name: 'Jyotiraditya', role: 'AI Growth Manager', company: 'AstroNext', img: '/mentors/Jyotiraditya.png' },
  { name: 'Sachin Roy', role: 'Founder', company: 'Menler', img: '/mentors/Sachin.png' },
];

// --- pricing singletons (mirror the fallbacks in the program pages) ---
const KS_PRICING = {
  pill: 'Entry Programme', name: 'AI Kickstarter',
  tagline: '4 live sessions across 2 weekends — build a real Claude OS and ship 4 portfolio projects.',
  price: '4,999', priceSub: 'incl. all taxes · one-time',
  features: [
    ['4 live sessions across 2 weekends', 'Sat + Sun · 2 hrs each · Bengaluru or online'],
    ['Claude OS hands-on build', 'Projects, Skills, Connectors, Routines — live'],
    ['4 portfolio deliverables', 'AI OS · Research System · Automation · Capstone'],
    ['Demo Day + peer review', 'Present live. Get feedback. Ship something real.'],
    ['Menler AI Kickstarter Certificate', 'LinkedIn-shareable proof of hands-on AI work'],
    ['AI resource library access', 'Prompt packs, templates, and tool guides'],
  ],
  chips: [
    { label: 'Start date', value: 'Jul 12, 2026' }, { label: 'Duration', value: '2 Weekends' },
    { label: 'Sessions', value: '4 Live · 8 hrs' }, { label: 'Format', value: 'Live online' },
  ],
};
const GEN_PRICING = {
  pill: 'Flagship Programme', name: 'AI Generalist Fellowship',
  tagline: '10 weeks · 50 live hours — build a full Claude OS, ship 10+ projects, and earn a Specialist certificate.',
  price: '59,999', origPrice: '79,999', priceSub: 'incl. all taxes · EMI from ₹4,999/mo',
  features: [
    ['50 hrs live instruction over 10 weeks', 'Instructor-led · real questions in real-time'],
    ['Build live projects with mentors', 'Portfolio-ready deliverables every week'],
    ['LMS + community · 1-year access', 'Recordings, resources, and cohort community'],
    ['1:1 doubt-solving sessions', 'Direct mentor access · no question left behind'],
    ['Interview pipeline + placement support', "LinkedIn review · Menler's hiring network"],
    ['Claude Specialist Certification', 'Menler-certified · LinkedIn-shareable'],
  ],
  chips: [
    { label: 'Start date', value: 'Jul 07, 2026' }, { label: 'Duration', value: '10 Weeks' },
    { label: 'Sessions', value: '20 Live · 50 hrs' }, { label: 'Format', value: 'Live online' },
  ],
};

const toFeatures = (arr) => arr.map(([title, detail]) => ({ _type: 'object', _key: slugify(title).slice(0, 30), title, detail }));
const toChips = (arr) => arr.map((c) => ({ _type: 'object', _key: slugify(c.label), label: c.label, value: c.value }));
const pricingDoc = (p) => ({
  _type: 'pricingCard',
  pill: p.pill, name: p.name, tagline: p.tagline, price: p.price, origPrice: p.origPrice, priceSub: p.priceSub,
  features: toFeatures(p.features), chips: toChips(p.chips),
});

async function run() {
  console.log(`Seeding project ${projectId} / ${dataset} ...`);

  // Remove any previous mentor/project docs (old dotted IDs published as drafts).
  console.log('Clearing old mentor/project docs...');
  await client.delete({ query: '*[_type == "mentor"]' });
  await client.delete({ query: '*[_type == "project"]' });

  console.log('Mentors...');
  for (let i = 0; i < MENTORS.length; i++) {
    const m = MENTORS[i];
    const photo = await uploadImage(m.img);
    await client.createOrReplace({
      _id: `mentor-${slugify(m.name)}`,
      _type: 'mentor',
      orderRank: rank(i),
      name: m.name, role: m.role, company: m.company, photo,
    });
    console.log(`  ✓ ${m.name}`);
  }

  console.log('Projects...');
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    const image = await uploadImage(p.image);
    await client.createOrReplace({
      _id: `project-${p.slug}`,
      _type: 'project',
      orderRank: rank(i),
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      image,
      tag: p.tag, tagCls: p.tagCls, desc: p.desc, stack: p.stack, outcome: p.outcome,
      doc: p.doc ? { _type: 'object', ...p.doc } : undefined,
    });
    console.log(`  ✓ ${p.title}`);
  }

  // Page singletons: createIfNotExists so we DON'T overwrite content you've
  // already edited in the Studio (hero copy, pricing, etc.).
  console.log('Page singletons (only if missing)...');
  await client.createIfNotExists({ _id: 'homePage', _type: 'homePage' });
  await client.createIfNotExists({ _id: 'engineeringPage', _type: 'engineeringPage' });
  await client.createIfNotExists({ _id: 'kickstarterPage', _type: 'kickstarterPage', pricing: pricingDoc(KS_PRICING) });
  await client.createIfNotExists({ _id: 'generalistPage', _type: 'generalistPage', pricing: pricingDoc(GEN_PRICING) });
  console.log('  ✓ home / engineering / kickstarter / generalist');

  console.log('\nDone. Open /studio to review, then Publish any changes.');
}

run().catch((e) => { console.error(e); process.exit(1); });
