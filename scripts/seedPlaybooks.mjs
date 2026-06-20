/**
 * Safe, standalone seeder for checkout playbooks/catalogs ONLY.
 * Unlike seedSanity.mjs it does NOT delete or touch mentors/projects/pages —
 * it just createIfNotExists the starter playbooks (idempotent, deterministic IDs).
 *
 * Run: node scripts/seedPlaybooks.mjs   (needs VITE_SANITY_PROJECT_ID + SANITY_WRITE_TOKEN in .env)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

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
  console.error('Missing VITE_SANITY_PROJECT_ID and/or SANITY_WRITE_TOKEN. Set them in .env.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false });
const rank = (i) => String(i).padStart(6, '0');

const PLAYBOOKS = [
  { id: 'prompts', title: '100+ AI Prompts Playbook', desc: 'Tested prompts across business, engineering & beginner tracks.', price: 499 },
  { id: 'agents', title: 'AI Agent Build Templates', desc: 'Ready-to-use agent blueprints, MCP recipes & workflows.', price: 799 },
  { id: 'domain', title: 'Domain Track Playbooks (×9)', desc: 'One deep-dive playbook per Generalist domain track.', price: 999 },
  { id: 'tools', title: 'GenAI Toolstack Starter Kit', desc: 'Setup guides & cheat-sheets for the full Menler toolstack.', price: 399 },
];

async function run() {
  console.log(`Seeding playbooks into ${projectId} / ${dataset} ...`);
  for (let i = 0; i < PLAYBOOKS.length; i++) {
    const pb = PLAYBOOKS[i];
    await client.createIfNotExists({
      _id: `playbook-${pb.id}`,
      _type: 'playbook',
      orderRank: rank(i),
      title: pb.title, desc: pb.desc, price: pb.price, active: true,
    });
    console.log(`  ✓ ${pb.title}`);
  }
  console.log('Done. Refresh the Studio → Playbooks / Catalogs.');
}

run().catch((e) => { console.error(e); process.exit(1); });
