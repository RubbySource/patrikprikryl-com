// Regenerates public/og-image.png from a programmatic SVG.
// Requires `sharp` (kept out of package.json to avoid bloating production
// builds — install on demand): `npm install --no-save sharp` then `npm run og:generate`.

const path = require('path');
const sharp = require('sharp');

const WIDTH = 1200;
const HEIGHT = 630;
const TITLE = 'Patrik Přikryl';
const SUBTITLE = 'AI Project Manager · Škoda Auto';
const URL = 'patrikprikryl.com';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
    <style>
      .title    { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 104px; fill: #f8fafc; letter-spacing: -2px; }
      .subtitle { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 38px; fill: #94a3b8; letter-spacing: 0.5px; }
      .url      { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 24px; fill: #64748b; letter-spacing: 2px; }
      .mark     { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 28px; fill: #38bdf8; letter-spacing: 4px; }
    </style>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <line x1="80" y1="120" x2="160" y2="120" stroke="#38bdf8" stroke-width="3"/>
  <text x="80" y="100" class="mark">PP</text>

  <text x="80" y="340" class="title">${TITLE}</text>
  <text x="80" y="400" class="subtitle">${SUBTITLE}</text>

  <line x1="80" y1="540" x2="1120" y2="540" stroke="#1e293b" stroke-width="1"/>
  <text x="80" y="580" class="url">${URL.toUpperCase()}</text>
</svg>`;

const outPng = path.join(__dirname, '..', 'public', 'og-image.png');

sharp(Buffer.from(svg))
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(outPng)
  .then((info) => {
    console.log(`Wrote ${outPng} (${info.width}x${info.height}, ${info.size} bytes)`);
  })
  .catch((err) => {
    console.error('Failed to generate OG image:', err);
    process.exit(1);
  });
