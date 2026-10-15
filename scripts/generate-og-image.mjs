import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const avatarPath = path.join(rootDir, "metsuki.jpg");
const outputPath = path.join(rootDir, "public", "og-banner.png");

function vLines() {
  return Array.from({ length: 31 }, (_, i) =>
    `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="630" stroke="#a89fc8" stroke-width="0.8"/>`
  ).join("");
}

function hLines() {
  return Array.from({ length: 17 }, (_, i) =>
    `<line x1="0" y1="${i * 40}" x2="1200" y2="${i * 40}" stroke="#a89fc8" stroke-width="0.8"/>`
  ).join("");
}

function decorDots() {
  return Array.from({ length: 48 }, (_, i) => {
    const col = i % 8;
    const row = Math.floor(i / 8);
    const x = 518 + col * 74;
    const y = 74 + row * 60;
    return `<circle cx="${x}" cy="${y}" r="1.4" fill="#8fe7ea"/>`;
  }).join("");
}

function buildSvg(avatarBase64) {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0"   stop-color="#06040f"/>
      <stop offset="0.5" stop-color="#0b0a1a"/>
      <stop offset="1"   stop-color="#04030d"/>
    </linearGradient>
    <radialGradient id="glowCyan" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1080 -30) rotate(140) scale(420 300)">
      <stop stop-color="#00d4ff" stop-opacity="0.18"/>
      <stop offset="1"  stop-color="#00d4ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 520) rotate(-40) scale(380 260)">
      <stop stop-color="#7c4dff" stop-opacity="0.22"/>
      <stop offset="1"  stop-color="#7c4dff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowPink" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1150 630) rotate(-120) scale(280 200)">
      <stop stop-color="#ff1f71" stop-opacity="0.12"/>
      <stop offset="1"  stop-color="#ff1f71" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardStroke" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#8fe7ea" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="#7c4dff" stop-opacity="0.42"/>
      <stop offset="1"   stop-color="#00d4ff" stop-opacity="0.28"/>
    </linearGradient>
    <linearGradient id="sepLine" x1="512" y1="0" x2="970" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8fe7ea" stop-opacity="0.7"/>
      <stop offset="1"  stop-color="#7c4dff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="avatarFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="#0b0a1a" stop-opacity="0"/>
      <stop offset="1"    stop-color="#0b0a1a" stop-opacity="0.75"/>
    </linearGradient>
    <clipPath id="avatarClip">
      <rect x="44" y="48" width="388" height="534" rx="22"/>
    </clipPath>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="1080" cy="-30" rx="420" ry="320" fill="url(#glowCyan)"/>
  <ellipse cx="200"  cy="520" rx="380" ry="280" fill="url(#glowViolet)"/>
  <ellipse cx="1150" cy="660" rx="280" ry="200" fill="url(#glowPink)"/>

  <g opacity="0.042">${vLines()}${hLines()}</g>

  <g opacity="0.055">${decorDots()}</g>

  <rect x="32" y="32" width="416" height="566" rx="24" fill="#0e0c20" fill-opacity="0.88" stroke="url(#cardStroke)" stroke-width="1.5"/>
  <rect x="44" y="48" width="388" height="534" rx="22" fill="#0a0818"/>
  <g clip-path="url(#avatarClip)">
    <image href="data:image/jpeg;base64,${avatarBase64}" x="44" y="48" width="388" height="534" preserveAspectRatio="xMidYMid slice"/>
    <rect x="44" y="48" width="388" height="534" rx="22" fill="url(#avatarFade)"/>
  </g>

  <text x="512" y="246" fill="#8fe7ea" font-size="13" font-family="Segoe UI, Inter, Arial, sans-serif" font-weight="700" letter-spacing="5">SOFTWARE DEVELOPER</text>
  <rect x="512" y="264" width="460" height="1.5" rx="1" fill="url(#sepLine)"/>

  <text x="510" y="340" fill="#f0eeff" font-size="80" font-family="Segoe UI, Inter, Arial, sans-serif" font-weight="800" letter-spacing="-1">MetsUwUki</text>

  <text fill="#a89fc8" font-size="22" font-family="Segoe UI, Inter, Arial, sans-serif" font-weight="400">
    <tspan x="512" y="392">Web interfaces &amp; desktop utilities</tspan>
    <tspan x="512" dy="34">Clean logic, polished visuals, personality.</tspan>
  </text>

  <rect x="512" y="472" width="122" height="32" rx="16" fill="#7c4dff" fill-opacity="0.18" stroke="#7c4dff" stroke-opacity="0.38" stroke-width="1"/>
  <text x="573" y="493" fill="#a58bff" font-size="13" font-family="Segoe UI, Inter, Arial, sans-serif" font-weight="600" text-anchor="middle">TypeScript</text>

  <rect x="644" y="472" width="86" height="32" rx="16" fill="#00d4ff" fill-opacity="0.1" stroke="#00d4ff" stroke-opacity="0.28" stroke-width="1"/>
  <text x="687" y="493" fill="#8fe7ea" font-size="13" font-family="Segoe UI, Inter, Arial, sans-serif" font-weight="600" text-anchor="middle">React</text>

  <rect x="740" y="472" width="76" height="32" rx="16" fill="#ff6e3a" fill-opacity="0.12" stroke="#ff6e3a" stroke-opacity="0.28" stroke-width="1"/>
  <text x="778" y="493" fill="#ffb08a" font-size="13" font-family="Segoe UI, Inter, Arial, sans-serif" font-weight="600" text-anchor="middle">Rust</text>

  <text x="512" y="572" fill="#a89fc8" fill-opacity="0.45" font-size="15" font-family="Segoe UI, Inter, Arial, sans-serif" font-weight="500" letter-spacing="1.5">metsuwuki.github.io</text>

  <circle cx="1168" cy="46" r="5"  fill="#00d4ff" fill-opacity="0.6"/>
  <circle cx="1168" cy="46" r="14" fill="#00d4ff" fill-opacity="0.09"/>
  <circle cx="44"   cy="608" r="3" fill="#7c4dff" fill-opacity="0.55"/>
  <circle cx="60"   cy="608" r="3" fill="#7c4dff" fill-opacity="0.3"/>
  <circle cx="76"   cy="608" r="3" fill="#7c4dff" fill-opacity="0.15"/>
</svg>`;
}

async function main() {
  const avatarBuffer = await fs.readFile(avatarPath);
  const avatarBase64 = avatarBuffer.toString("base64");
  const svg = buildSvg(avatarBase64);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(Buffer.from(svg))
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(outputPath);

  console.info(`OG banner generated: ${outputPath}`);
}

main().catch((error) => {
  console.error("Failed to generate OG banner", error);
  process.exitCode = 1;
});
