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
  { id: 'prompt-library', title: 'Prompt Library', desc: '100+ tested prompts across business, engineering, and beginner tracks.', price: 499 },
  { id: 'ai-stack-map', title: 'AI stack map', desc: 'Visual guide to the best AI tools by category.', price: 399 },
  { id: 'connector-projects', title: 'Project connectors docs', desc: '10 hands-on project walkthroughs led by the program instructors.', price: 799 },
  { id: 'ai-glossary', title: 'AI glossary', desc: '100+ AI terms explained in simple, beginner-friendly language.', price: 299 },
  { id: 'claude-code', title: 'Claude Code Playbook', desc: 'Build, refactor, and ship real code with Claude in your terminal and editor.', price: 499 },
  { id: 'claude-chat', title: 'Claude Chat Playbook', desc: 'Everyday prompting — research, writing, analysis, and fast answers.', price: 499 },
  { id: 'claude-cowork', title: 'Claude Cowork Playbook', desc: 'Multi-document, multi-step work that turns raw inputs into finished deliverables.', price: 499 },
  { id: 'claude-design', title: 'Claude Design Playbook', desc: 'Generate visuals, mockups, and on-brand design assets with Claude.', price: 499 },
  { id: 'claude-ms', title: 'Claude in MS', desc: 'Use Claude across Microsoft 365 — Word, Excel, PowerPoint, and Teams.', price: 499 },
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
