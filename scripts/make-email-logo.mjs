// Renders the REAL Menler wordmark (same markup + CSS as src/components/common/
// MenlerWordmark.jsx and global.css) into transparent PNGs for use in emails,
// where CSS-built logos aren't reliable. Run: node scripts/make-email-logo.mjs
import puppeteer from 'puppeteer';

const WM_CSS = `
  .menler-wm{ display:inline-flex; flex-direction:column; align-items:flex-start; line-height:1; }
  .menler-wm__word{ font-family:'DM Sans',sans-serif; font-weight:900; font-size:1em; letter-spacing:-0.025em; line-height:1; position:relative; display:inline-block; color:inherit; padding-bottom:0.2em; }
  .menler-wm__ruled{ position:relative; }
  .menler-wm__ruled::after{ content:''; position:absolute; left:0; right:0; bottom:0.04em; height:0.0625em; min-height:2px; border-radius:3px; background:var(--menler-rule,#534AB7); }
  .menler-wm__dot{ position:absolute; top:0.06em; right:-0.1em; width:0.175em; height:0.175em; border-radius:50%; }
`;

const page = (word, rule, dot) => `<!doctype html><html><head><meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@900&display=swap" rel="stylesheet" />
<style>html,body{margin:0;padding:0;background:transparent;} #wrap{display:inline-block;padding:14px 18px;} ${WM_CSS}</style>
</head><body><div id="wrap">
  <span class="menler-wm" style="font-size:96px; color:${word}; --menler-rule:${rule};">
    <span class="menler-wm__word"><span class="menler-wm__ruled">menle</span>r<span class="menler-wm__dot" style="background:${dot};"></span></span>
  </span>
</div></body></html>`;

const OUT = [
  // On the dark navy email header: parchment word, brand purple rule, green dot.
  { file: 'public/email-logo.png', word: '#FFFFFF', rule: '#8A7EE8', dot: '#1D9E75' },
  // Light-background variant, for future use.
  { file: 'public/email-logo-dark.png', word: '#26215C', rule: '#534AB7', dot: '#1D9E75' },
];

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
try {
  for (const o of OUT) {
    const p = await browser.newPage();
    await p.setViewport({ width: 900, height: 300, deviceScaleFactor: 3 });
    await p.setContent(page(o.word, o.rule, o.dot), { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 400));
    const el = await p.$('#wrap');
    await el.screenshot({ path: o.file, omitBackground: true });
    const box = await el.boundingBox();
    console.log('✓', o.file, `${Math.round(box.width)}x${Math.round(box.height)} @3x`);
    await p.close();
  }
} finally { await browser.close(); }
