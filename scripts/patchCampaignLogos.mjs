/**
 * Patch credential logos onto a campaign page in Sanity.
 * Usage: node scripts/patchCampaignLogos.mjs [slug]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

try {
  const env = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env */ }

const slug = process.argv[2] || 'create-your-portfolio-with-claude';
const token = process.env.SANITY_WRITE_TOKEN;
const projectId = process.env.VITE_SANITY_PROJECT_ID || 'f3b732bt';

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN in .env');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2025-01-01',
  token,
  useCdn: false,
});

const SRIDEVI_LOGOS = [
  { _type: 'object', _key: 'ms', name: 'Microsoft', logoPath: '/logos/microsoft.png' },
  { _type: 'object', _key: 'iitg', name: 'IIT Guwahati', logoPath: '/logos/iitg.png' },
  { _type: 'object', _key: 'isb', name: 'ISB', logoPath: '/logos/isb.png' },
];

const doc = await client.fetch(
  '*[_type == "campaignPage" && slug.current == $slug][0]{ _id, title, credLogos, showCredLogosInBanner }',
  { slug },
);

if (!doc?._id) {
  console.error(`No campaign found for slug: ${slug}`);
  process.exit(1);
}

await client.patch(doc._id).set({
  credLogos: SRIDEVI_LOGOS,
  showCredLogosInBanner: true,
}).commit();

console.log(`✓ Updated "${doc.title}" (${slug}) with credential logos.`);
