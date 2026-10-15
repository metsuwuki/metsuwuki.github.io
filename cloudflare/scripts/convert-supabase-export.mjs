import { readFile, writeFile } from "node:fs/promises";
import { createHmac } from "node:crypto";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const migrationPath = resolve(root, "cloudflare/migrations/0002_import_legacy.sql");
const escapeSql = (value) => `'${String(value).replaceAll("'", "''")}'`;
const normalizeTime = (value) => value.replace(" ", "T").replace(/\+00$/, "Z");
const hash = (value) => createHmac("sha256", "legacy-import-v1").update(value).digest("hex");

const decode = (match) => match.slice(1).map((value) => value.replaceAll("''", "'"));

const guestbookSql = await readFile(resolve(root, "db/guestbook_rows.sql"), "utf8");
const visitorsSql = await readFile(resolve(root, "db/visitors_rows.sql"), "utf8");
const guestbook = [...guestbookSql.matchAll(/\('((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)'\)/g)].map(decode);
const visitors = [...visitorsSql.matchAll(/\('((?:''|[^'])*)',\s*'((?:''|[^'])*)'\)/g)].map(decode);
if (!guestbook.length || !visitors.length) throw new Error("Expected guestbook and visitor rows in db/*.sql");

const lines = [
  "-- Generated from db/*.sql. Safe to rerun: all inserts use INSERT OR IGNORE.",
  "-- Legacy visitor IDs are one-way hashed during conversion; raw IDs are not imported.",
  "-- No historical page-view events were present, so this migration does not fabricate them.",
];
for (const [id, name, message, createdAt, avatar] of guestbook) {
  lines.push(`INSERT OR IGNORE INTO guestbook (id,name,message,created_at,avatar,status) VALUES (${escapeSql(id)},${escapeSql(name)},${escapeSql(message)},${escapeSql(normalizeTime(createdAt))},${escapeSql(avatar ?? "profile")},'visible');`);
}
for (const [id, lastSeen] of visitors) {
  const timestamp = normalizeTime(lastSeen);
  lines.push(`INSERT OR IGNORE INTO visitors (visitor_hash,first_seen,last_seen) VALUES (${escapeSql(hash(id))},${escapeSql(timestamp)},${escapeSql(timestamp)});`);
}
lines.push("");
await writeFile(migrationPath, lines.join("\n"), "utf8");
console.log(`Wrote ${migrationPath}: ${guestbook.length} guestbook rows, ${visitors.length} visitor rows.`);
