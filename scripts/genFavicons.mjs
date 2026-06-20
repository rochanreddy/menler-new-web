import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';

const svg = fs.readFileSync('public/favicon.svg');
const png = (size) => sharp(svg, { density: 512 }).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png();

const files = { 'favicon-32.png': 32, 'favicon-16.png': 16, 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512 };
for (const [name, size] of Object.entries(files)) {
  await png(size).toFile('public/' + name);
  console.log('  ✓ public/' + name);
}
const ico = await pngToIco([
  await png(16).toBuffer(),
  await png(32).toBuffer(),
  await png(48).toBuffer(),
]);
fs.writeFileSync('public/favicon.ico', ico);
console.log('  ✓ public/favicon.ico');
