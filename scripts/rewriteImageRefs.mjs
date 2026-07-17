// Rewrites code references from the now-converted raster images to their new
// .webp counterparts. Derives the exact old→new path tokens from the set of
// originals that optimizeImages.mjs deleted (read from `git ls-files --deleted`),
// so only genuinely-converted files are touched. Idempotent.
//
// Run: node scripts/rewriteImageRefs.mjs
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const deleted = execSync('git ls-files --deleted -- public src/assets', { cwd: root, encoding: 'utf8' })
  .split('\n').map((s) => s.trim()).filter((s) => /\.(png|jpe?g)$/i.test(s));

// Build search→replace tokens. Public files are referenced by an absolute
// serving path (/mentors/x.png); src/assets files by an import path ending in
// assets/… . Longest tokens first so we never partially clobber.
const tokens = deleted.map((rel) => {
  const webp = rel.replace(/\.(png|jpe?g)$/i, '.webp');
  const from = rel.startsWith('public/') ? '/' + rel.slice('public/'.length) : rel.slice('src/'.length);
  const to = webp.startsWith('public/') ? '/' + webp.slice('public/'.length) : webp.slice('src/'.length);
  return { from, to };
}).sort((a, b) => b.from.length - a.from.length);

// Files that may reference images.
const exts = new Set(['.jsx', '.js', '.html', '.css', '.mjs']);
const targets = [];
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'dist') continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full);
    else if (exts.has(path.extname(name))) targets.push(full);
  }
};
walk(path.join(root, 'src'));
targets.push(path.join(root, 'index.html'));

let filesChanged = 0, totalRepl = 0;
for (const file of targets) {
  let text = fs.readFileSync(file, 'utf8');
  let count = 0;
  for (const { from, to } of tokens) {
    if (!text.includes(from)) continue;
    text = text.split(from).join(to);
    count++;
  }
  if (count) {
    fs.writeFileSync(file, text);
    filesChanged++; totalRepl += count;
    console.log(`  ${path.relative(root, file).replace(/\\/g, '/')}  (${count} token(s))`);
  }
}
console.log(`\nRewrote ${totalRepl} token type(s) across ${filesChanged} file(s).`);
