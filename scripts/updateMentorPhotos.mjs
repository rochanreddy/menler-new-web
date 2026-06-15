/**
 * Updates ONLY the mentor photos in Sanity from /public/mentors, without
 * touching name/role/company (so any Studio text edits are preserved).
 *
 * Usage: set SANITY_WRITE_TOKEN (+ VITE_SANITY_PROJECT_ID) in .env, then:
 *   npm run update-photos
 * Revoke the token afterward.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

try {
  const env = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env */ }

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) { console.error('Missing VITE_SANITY_PROJECT_ID and/or SANITY_WRITE_TOKEN in .env'); process.exit(1); }

const client = createClient({ projectId, dataset: process.env.VITE_SANITY_DATASET || 'production', apiVersion: '2025-01-01', token, useCdn: false });
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// name → image (must match the seed's mentor names so the doc IDs line up).
const MENTORS = [
  { name: 'Anuttam G', img: '/mentors/Anuttam.png' },
  { name: 'Shashank Kumar', img: '/mentors/Shashank.png' },
  { name: 'Abhinay Kumar', img: '/mentors/Abhinay.png' },
  { name: 'Rohit', img: '/mentors/ROHIT.png' },
  { name: 'Nitin K Sethi', img: '/mentors/Nitin.png' },
  { name: 'Deepak K', img: '/mentors/Deepak.png' },
  { name: 'Manish Yadav', img: '/mentors/Manish.png' },
  { name: 'Pranay W', img: '/mentors/Pranay.jpeg' },
  { name: 'Salimullah Khan', img: '/mentors/Salimullah.png' },
  { name: 'Sachin Roy', img: '/mentors/Sachin.png' },
];

async function run() {
  console.log(`Updating mentor photos in ${projectId}/production ...`);
  for (const m of MENTORS) {
    const abs = path.join(PUBLIC, m.img.replace(/^\//, ''));
    if (!fs.existsSync(abs)) { console.warn(`  ! missing ${abs}`); continue; }
    const asset = await client.assets.upload('image', fs.createReadStream(abs), { filename: path.basename(abs) });
    const id = `mentor-${slugify(m.name)}`;
    await client.patch(id).set({ photo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }).commit();
    console.log(`  ✓ ${m.name}`);
  }
  console.log('\nDone. Reload the site (CDN may take a few seconds).');
}
run().catch((e) => { console.error(e.message || e); process.exit(1); });
