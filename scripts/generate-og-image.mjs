import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const duoPath = path.join(rootDir, "assets", "duo.jpg");
const outputPath = path.join(rootDir, "public", "og-kagami-duo.png");

function gridLines() {
  return [
    ...Array.from({ length: 16 }, (_, index) => `<line x1="${index * 80}" y1="0" x2="${index * 80}" y2="630"/>`),
    ...Array.from({ length: 9 }, (_, index) => `<line x1="0" y1="${index * 80}" x2="1200" y2="${index * 80}"/>`),
  ].join("");
}

function buildSvg(duoBase64) {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="40" y1="0" x2="1180" y2="630" gradientUnits="userSpaceOnUse"><stop stop-color="#080510"/><stop offset=".52" stop-color="#100819"/><stop offset="1" stop-color="#05040B"/></linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(890 260) rotate(150) scale(610 490)"><stop stop-color="#B02CFF" stop-opacity=".30"/><stop offset="1" stop-color="#B02CFF" stop-opacity="0"/></radialGradient>
    <radialGradient id="pink" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(80 600) rotate(-44) scale(390 250)"><stop stop-color="#FF3DB8" stop-opacity=".17"/><stop offset="1" stop-color="#FF3DB8" stop-opacity="0"/></radialGradient>
    <linearGradient id="shade" x1="530" y1="95" x2="1124" y2="525" gradientUnits="userSpaceOnUse"><stop stop-color="#12091A" stop-opacity=".03"/><stop offset=".66" stop-color="#12091A" stop-opacity="0"/><stop offset="1" stop-color="#09050E" stop-opacity=".62"/></linearGradient>
    <linearGradient id="border" x1="536" y1="74" x2="1152" y2="536" gradientUnits="userSpaceOnUse"><stop stop-color="#F1B9FF" stop-opacity=".64"/><stop offset=".48" stop-color="#A543EE" stop-opacity=".30"/><stop offset="1" stop-color="#6D38B7" stop-opacity=".08"/></linearGradient>
    <linearGradient id="title" x1="68" y1="240" x2="485" y2="352" gradientUnits="userSpaceOnUse"><stop stop-color="#FFFFFF"/><stop offset=".62" stop-color="#F1DFFF"/><stop offset="1" stop-color="#C892F1"/></linearGradient>
    <filter id="shadow" x="470" y="24" width="760" height="560" filterUnits="userSpaceOnUse"><feDropShadow dx="0" dy="28" stdDeviation="28" flood-color="#000" flood-opacity=".58"/></filter>
    <clipPath id="duo"><rect x="530" y="74" width="622" height="414" rx="26"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/><rect width="1200" height="630" fill="url(#glow)"/><rect width="1200" height="630" fill="url(#pink)"/>
  <g stroke="#D9B8F7" stroke-opacity=".045">${gridLines()}</g>
  <path d="M0 508C209 454 305 557 491 517C734 465 867 352 1200 407V630H0V508Z" fill="#8D2DCD" fill-opacity=".055"/>
  <path d="M0 531C216 476 316 580 501 541C745 489 887 381 1200 433" stroke="#DF83FF" stroke-opacity=".10"/>
  <text x="62" y="166" fill="#F1B9FF" fill-opacity=".045" font-size="170" font-family="Arial" font-weight="900">K</text>
  <circle cx="104" cy="86" r="8" fill="#C958FF"/><circle cx="104" cy="86" r="20" stroke="#C958FF" stroke-opacity=".18"/>
  <text x="138" y="92" fill="#D8B6F0" font-size="14" font-family="Segoe UI, Arial" font-weight="700" letter-spacing="4">KAGAMI / NEXUS</text>
  <text x="68" y="246" fill="#B988DB" font-size="13" font-family="Segoe UI, Arial" font-weight="700" letter-spacing="4">DIGITAL PORTFOLIO · 2026</text>
  <text x="64" y="320" fill="url(#title)" font-size="68" font-family="Segoe UI, Arial" font-weight="800" letter-spacing="-2">MetsUwUki</text>
  <text x="68" y="363" fill="#AFA1B9" font-size="21" font-family="Segoe UI, Arial">Software, projects &amp; a shared visual world.</text>
  <g filter="url(#shadow)"><rect x="516" y="60" width="650" height="442" rx="34" fill="#130A1C" stroke="url(#border)" stroke-width="1.5"/><g clip-path="url(#duo)"><image href="data:image/jpeg;base64,${duoBase64}" x="530" y="74" width="622" height="414" preserveAspectRatio="xMidYMid slice"/><rect x="530" y="74" width="622" height="414" fill="url(#shade)"/></g></g>
  <rect x="912" y="447" width="204" height="26" rx="13" fill="#0B0710" fill-opacity=".82" stroke="#D97AFF" stroke-opacity=".42"/>
  <text x="1014" y="464" fill="#E9C8FF" font-size="10" font-family="Segoe UI, Arial" font-weight="700" text-anchor="middle" letter-spacing="2.2">DUAL IDENTITY</text>
  <g font-family="Segoe UI, Arial" font-size="12" font-weight="700" letter-spacing="1.1">
    <rect x="68" y="427" width="116" height="38" rx="19" fill="#B544FF" fill-opacity=".14" stroke="#C65CFF" stroke-opacity=".42"/><text x="126" y="451" fill="#DFB8F8" text-anchor="middle">/METSUKI</text>
    <rect x="194" y="427" width="94" height="38" rx="19" fill="#FF4DC4" fill-opacity=".09" stroke="#FF78D5" stroke-opacity=".30"/><text x="241" y="451" fill="#EAB8DA" text-anchor="middle">/MIKA</text>
    <rect x="298" y="427" width="112" height="38" rx="19" fill="#FFF" fill-opacity=".035" stroke="#FFF" stroke-opacity=".13"/><text x="354" y="451" fill="#B8AABD" text-anchor="middle">/GTA5RP</text>
  </g>
  <line x1="68" y1="548" x2="1132" y2="548" stroke="#DAB5F3" stroke-opacity=".12"/>
  <text x="68" y="584" fill="#817487" font-size="14" font-family="Segoe UI, Arial" font-weight="600" letter-spacing="1.4">METSUWUKI.GITHUB.IO</text>
  <text x="1132" y="584" fill="#9C6DB9" font-size="12" font-family="Segoe UI, Arial" font-weight="700" text-anchor="end" letter-spacing="2.4">TWO WORLDS · ONE NEXUS</text>
</svg>`;
}

async function main() {
  const duoBase64 = (await fs.readFile(duoPath)).toString("base64");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(Buffer.from(buildSvg(duoBase64))).png({ quality: 100, compressionLevel: 7 }).toFile(outputPath);
  console.info(`OG banner generated: ${outputPath}`);
}

main().catch((error) => {
  console.error("Failed to generate OG banner", error);
  process.exitCode = 1;
});
