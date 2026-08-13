/**
 * Fail the build if any code references a PDF that isn't on disk.
 *
 * pdfAttachments() throws when a file is missing, so a deleted or renamed PDF
 * doesn't degrade — it takes down whatever email was meant to carry it, at the
 * moment a real person submits a form. That is exactly how the Kickstarter
 * brochure broke: the file was replaced with a differently-named one and three
 * references kept pointing at the old path.
 *
 *   node scripts/checkPdfs.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

const SEARCH_DIRS = ['src', 'server', 'scripts'];
const SKIP = new Set(['node_modules', 'dist', '.git']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx|mjs|ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const refs = new Map(); // pdf path → files referencing it
for (const file of SEARCH_DIRS.filter((d) => existsSync(join(ROOT, d))).flatMap((d) => walk(join(ROOT, d)))) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/['"`](\/(?:pdfs|question_banks)\/[^'"`]+\.pdf)['"`]/g)) {
    const rel = file.slice(ROOT.length + 1).replace(/\\/g, '/');
    if (!refs.has(m[1])) refs.set(m[1], new Set());
    refs.get(m[1]).add(rel);
  }
}

const missing = [...refs.entries()].filter(([p]) => !existsSync(join(PUBLIC, p.replace(/^\//, ''))));

console.log(`Checked ${refs.size} referenced PDF path(s).`);
if (!missing.length) {
  console.log('✓ Every referenced PDF exists.');
  process.exit(0);
}

console.error(`\n✗ ${missing.length} referenced PDF(s) are missing from public/:\n`);
for (const [p, where] of missing) {
  console.error(`  ${p}`);
  for (const w of where) console.error(`      referenced by ${w}`);
}
console.error('\nEmails carrying these would fail at send time. Fix the path or restore the file.');
process.exit(1);
