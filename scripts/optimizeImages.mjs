// One-off image optimizer: converts raster images (png/jpg/jpeg) under the
// listed directories to resized WebP, deletes the originals, and writes a
// manifest of old→new paths + byte savings (scripts/optimizeImages.manifest.json)
// so code references can be rewritten deterministically.
//
// Run: node scripts/optimizeImages.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Per-directory rules. `max` is the longest-edge cap (px); photos never need
// more than ~2× their on-screen size. `quality` tuned per content type.
const RULES = [
  { dir: 'public/mentors', max: 600, quality: 80 },      // shown in ≤360×300 cards
  { dir: 'public/projects', max: 800, quality: 78 },     // 16:9 card thumbnails
  { dir: 'public/logos', max: 400, quality: 88 },        // small logos, keep edges crisp
  { dir: 'public/agri_section', max: 400, quality: 88 },
  { dir: 'src/assets', max: 900, quality: 82, shallow: true },
  { dir: 'src/assets/logos', max: 400, quality: 88 },
];

// Never touch these — social/share and favicon assets that need PNG.
const SKIP = new Set(['og-image.png', 'icon-512.png', 'favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png']);

const manifest = [];
let totalOld = 0, totalNew = 0;

for (const rule of RULES) {
  const abs = path.join(root, rule.dir);
  if (!fs.existsSync(abs)) continue;
  for (const name of fs.readdirSync(abs)) {
    const full = path.join(abs, name);
    if (!fs.statSync(full).isFile()) continue;
    if (!/\.(png|jpe?g)$/i.test(name)) continue;
    if (SKIP.has(name)) continue;

    const oldSize = fs.statSync(full).size;
    let meta;
    try {
      meta = await sharp(full).metadata();
    } catch {
      console.log(`  SKIP (unsupported/ICO): ${path.relative(root, full).replace(/\\/g, '/')}`);
      continue;
    }
    const resize = meta.width > rule.max || meta.height > rule.max
      ? { width: Math.min(meta.width, rule.max), height: Math.min(meta.height, rule.max), fit: 'inside' }
      : null;

    const outName = name.replace(/\.(png|jpe?g)$/i, '.webp');
    const outFull = path.join(abs, outName);
    let pipeline = sharp(full);
    if (resize) pipeline = pipeline.resize(resize);
    await pipeline.webp({ quality: rule.quality, effort: 6 }).toFile(outFull);

    const newSize = fs.statSync(outFull).size;
    // Delete the original raster now that the WebP exists.
    if (outName !== name) fs.unlinkSync(full);

    totalOld += oldSize; totalNew += newSize;
    const rel = (p) => path.relative(root, p).replace(/\\/g, '/');
    manifest.push({ old: '/' + rel(full).replace(/^public\//, ''), oldFsPath: rel(full), newFsPath: rel(outFull), oldSize, newSize });
    console.log(`${(oldSize / 1024).toFixed(0).padStart(6)}KB → ${(newSize / 1024).toFixed(0).padStart(5)}KB  ${rel(outFull)}`);
  }
}

fs.writeFileSync(path.join(root, 'scripts/optimizeImages.manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\nTotal: ${(totalOld / 1048576).toFixed(2)}MB → ${(totalNew / 1048576).toFixed(2)}MB  (saved ${((totalOld - totalNew) / 1048576).toFixed(2)}MB, ${(100 * (1 - totalNew / totalOld)).toFixed(1)}%)`);
console.log(`Files converted: ${manifest.length}`);
