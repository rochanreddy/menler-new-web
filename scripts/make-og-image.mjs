// Generates public/og-image.png (1200×630) — the social share preview image.
// Run once with `node scripts/make-og-image.mjs`; the PNG is committed so the
// production build doesn't need sharp. Re-run to regenerate after copy/brand tweaks.

import sharp from 'sharp';

const W = 1200, H = 630;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#26215C"/>
      <stop offset="55%" stop-color="#4434A6"/>
      <stop offset="100%" stop-color="#5A3FD6"/>
    </linearGradient>
    <radialGradient id="glow" cx="100%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- decorative rings -->
  <circle cx="1010" cy="150" r="220" fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="2"/>
  <circle cx="1010" cy="150" r="320" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>

  <g font-family="Segoe UI, Helvetica, Arial, sans-serif">
    <text x="90" y="250" fill="#ffffff" font-size="120" font-weight="800" letter-spacing="-3">Menler</text>
    <text x="92" y="330" fill="#C9BDFF" font-size="40" font-weight="600">India's Claude-native AI learning</text>
    <text x="92" y="392" fill="#E7E3FF" font-size="30" font-weight="400" opacity="0.92">AI fellowships · real projects · placement support</text>
    <text x="92" y="560" fill="#ffffff" font-size="28" font-weight="700" opacity="0.85">menler.in</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('✓ Wrote public/og-image.png (1200×630)');
