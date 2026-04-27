// Render SVG marketing assets to PNG.
// Usage: node scripts/render-images.mjs
// Requires: npm install --no-save sharp

import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

const targets = [
  // LinkedIn Featured section + general OG
  { svg: 'linkedin-featured.svg', png: 'linkedin-featured.png', w: 1200, h: 627, density: 300 },
  { svg: 'linkedin-featured.svg', png: 'linkedin-featured@2x.png', w: 2400, h: 1254, density: 600 },
  // Original og-image (Twitter/Facebook/general)
  { svg: 'og-image.svg', png: 'og-image.png', w: 1200, h: 630, density: 300 },
];

for (const t of targets) {
  try {
    const svg = readFileSync(join(PUBLIC, t.svg));
    const info = await sharp(svg, { density: t.density })
      .resize(t.w, t.h)
      .png({ quality: 95, compressionLevel: 9 })
      .toFile(join(PUBLIC, t.png));
    console.log(`\u2713 ${t.png}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.error(`\u2717 ${t.png}: ${err.message}`);
    process.exitCode = 1;
  }
}
