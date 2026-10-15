import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
if (!databaseId || !/^[a-f0-9-]{20,}$/i.test(databaseId)) {
  throw new Error("CLOUDFLARE_D1_DATABASE_ID GitHub environment variable is missing or invalid.");
}

const configPath = resolve("cloudflare/wrangler.jsonc");
const config = readFileSync(configPath, "utf8");
if (!config.includes("REPLACE_WITH_D1_DATABASE_ID")) {
  throw new Error("Expected D1 placeholder was not found in cloudflare/wrangler.jsonc.");
}

writeFileSync(configPath, config.replace("REPLACE_WITH_D1_DATABASE_ID", databaseId), "utf8");
console.log("Configured the production D1 binding for this CI run.");
