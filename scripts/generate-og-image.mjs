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

function buildSvg(avatarBase64) {
  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#120B2A"/>
      <stop offset="0.5" stop-color="#23164A"/>
      <stop offset="1" stop-color="#130D2E"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(960 90) rotate(125) scale(340 260)">
      <stop stop-color="#9B7CFD" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#9B7CFD" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(980 510) rotate(-35) scale(300 220)">
      <stop stop-color="#57A0FF" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#57A0FF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A58CFF" stop-opacity="0.72"/>
      <stop offset="1" stop-color="#6B54D9" stop-opacity="0.4"/>
    </linearGradient>
    <clipPath id="avatarClip">
      <rect x="36" y="56" width="390" height="518" rx="30"/>
    </clipPath>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="960" cy="90" r="360" fill="url(#glowA)"/>
  <circle cx="980" cy="510" r="300" fill="url(#glowB)"/>

  <rect x="24" y="24" width="432" height="582" rx="28" fill="#1A1333" fill-opacity="0.72" stroke="url(#stroke)" stroke-opacity="0.45"/>
  <rect x="36" y="56" width="390" height="518" rx="30" fill="#0D0A19"/>

  <g clip-path="url(#avatarClip)">
    <image href="data:image/jpeg;base64,${avatarBase64}" x="36" y="56" width="390" height="518" preserveAspectRatio="xMidYMid slice"/>
  </g>

  <text x="505" y="262" fill="#F6F3FF" font-size="88" font-family="Segoe UI, Arial, sans-serif" font-weight="800">MetsUwUki</text>
  <text x="505" y="322" fill="#E5E1FF" font-size="42" font-family="Segoe UI, Arial, sans-serif" font-weight="700">Software Developer</text>

  <text x="505" y="392" fill="#C9C4E5" font-size="28" font-family="Segoe UI, Arial, sans-serif" font-weight="500">
    <tspan x="505" dy="0">I build web interfaces and desktop utilities</tspan>
    <tspan x="505" dy="40">with clean logic, polished visuals,</tspan>
    <tspan x="505" dy="40">and practical tools with personality.</tspan>
  </text>
</svg>`;
}

async function main() {
  const avatarBuffer = await fs.readFile(avatarPath);
  const avatarBase64 = avatarBuffer.toString("base64");
  const svg = buildSvg(avatarBase64);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(Buffer.from(svg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.info(`OG banner generated: ${outputPath}`);
}

main().catch((error) => {
  console.error("Failed to generate OG banner", error);
  process.exitCode = 1;
});
