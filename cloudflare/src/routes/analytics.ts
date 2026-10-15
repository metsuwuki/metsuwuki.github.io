import type { Env } from "../types";
import { checkRateLimit } from "../services/database";
import { clientIp, fail, json, keyedHash, readJson } from "../services/security";

const ID_PATTERN = /^[a-f0-9-]{20,64}$/i;

export async function recordVisit(request: Request, env: Env): Promise<Response> {
  let body;
  try { body = await readJson(request, 2048); }
  catch { return fail(request, env, 400, "invalid_request", "Некорректный JSON-запрос."); }
  const visitorId = typeof body.visitorId === "string" ? body.visitorId : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  const path = typeof body.path === "string" ? body.path.slice(0, 160) : "/";
  if (!ID_PATTERN.test(visitorId) || !ID_PATTERN.test(sessionId) || !path.startsWith("/")) {
    return fail(request, env, 422, "validation_failed", "Некорректные данные посещения.");
  }
  const ipHash = await keyedHash(clientIp(request), env.HASH_SECRET);
  if (!(await checkRateLimit(env.DB, ipHash, "analytics", 60, 3600))) {
    return fail(request, env, 429, "rate_limit_exceeded", "Слишком много запросов.");
  }

  const visitorHash = await keyedHash(visitorId, env.HASH_SECRET);
  const sessionHash = await keyedHash(sessionId, env.HASH_SECRET);
  const now = new Date();
  const timestamp = now.toISOString();
  const bucket = Math.floor(now.getTime() / 1_800_000);
  const dedupKey = await keyedHash(`${sessionHash}:${path}:${bucket}`, env.HASH_SECRET);

  await env.DB.batch([
    env.DB.prepare(`INSERT INTO visitors (visitor_hash, first_seen, last_seen) VALUES (?1, ?2, ?2)
      ON CONFLICT(visitor_hash) DO UPDATE SET last_seen = excluded.last_seen`).bind(visitorHash, timestamp),
    env.DB.prepare(`INSERT INTO sessions (session_hash, visitor_hash, first_seen, last_seen) VALUES (?1, ?2, ?3, ?3)
      ON CONFLICT(session_hash) DO UPDATE SET last_seen = excluded.last_seen`).bind(sessionHash, visitorHash, timestamp),
    env.DB.prepare(`INSERT OR IGNORE INTO page_views (dedup_key, visitor_hash, session_hash, path, occurred_at)
      VALUES (?1, ?2, ?3, ?4, ?5)`).bind(dedupKey, visitorHash, sessionHash, path, timestamp),
  ]);
  return json(request, env, { ok: true, data: { accepted: true } }, 202, { "Cache-Control": "no-store" });
}

export async function analyticsSummary(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const days = Math.min(90, Math.max(7, Number(url.searchParams.get("days") ?? 30) || 30));
  const since = new Date(Date.now() - (days - 1) * 86_400_000);
  since.setUTCHours(0, 0, 0, 0);
  const [totals, recent, daily] = await Promise.all([
    env.DB.prepare(`SELECT
      (SELECT COUNT(*) FROM page_views) AS total_page_views,
      (SELECT COUNT(*) FROM visitors) AS unique_visitors`).first<{ total_page_views: number; unique_visitors: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM sessions WHERE first_seen >= ?1").bind(since.toISOString()).first<{ count: number }>(),
    env.DB.prepare(`SELECT substr(occurred_at, 1, 10) AS date, COUNT(*) AS page_views,
      COUNT(DISTINCT visitor_hash) AS unique_visitors FROM page_views
      WHERE occurred_at >= ?1 GROUP BY date ORDER BY date ASC`).bind(since.toISOString()).all<{ date: string; page_views: number; unique_visitors: number }>(),
  ]);
  return json(request, env, { ok: true, data: {
    totalPageViews: totals?.total_page_views ?? 0,
    uniqueVisitors: totals?.unique_visitors ?? 0,
    recentSessions: recent?.count ?? 0,
    daily: daily.results.map((row) => ({ date: row.date, pageViews: row.page_views, uniqueVisitors: row.unique_visitors })),
    semantics: {
      pageView: "One accepted path view per browser session per 30-minute window.",
      session: "A browser session identifier refreshed after 30 minutes of inactivity.",
      uniqueVisitor: "A pseudonymous browser identifier, HMAC-hashed before storage.",
      returningVisit: "A known pseudonymous visitor observed in a later session.",
    },
  } }, 200, { "Cache-Control": "public, max-age=60" });
}
