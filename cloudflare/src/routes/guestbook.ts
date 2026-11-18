import type { Env } from "../types";
import { checkRateLimit } from "../services/database";
import { validateGuestbook } from "../services/moderation";
import { clientIp, fail, json, keyedHash, readJson, verifyTurnstile } from "../services/security";

type Entry = { id: string; name: string; message: string; avatar: string; created_at: string };
type GuestbookProfile = "metsuki" | "mika";

export function parseGuestbookProfile(value: unknown): GuestbookProfile | null {
  if (value == null || value === "") return "metsuki";
  return value === "metsuki" || value === "mika" ? value : null;
}

export async function listGuestbook(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 20) || 20));
  const cursor = url.searchParams.get("cursor");
  const profile = parseGuestbookProfile(url.searchParams.get("profile"));
  if (!profile) return fail(request, env, 400, "invalid_profile", "Некорректный профиль гостевой книги.");
  let cursorTime = "9999-12-31T23:59:59.999Z";
  let cursorId = "~";
  if (cursor) {
    try {
      const parsed = JSON.parse(atob(cursor.replace(/-/g, "+").replace(/_/g, "/"))) as { t?: string; id?: string };
      if (parsed.t && parsed.id) { cursorTime = parsed.t; cursorId = parsed.id; }
    } catch { return fail(request, env, 400, "invalid_cursor", "Некорректный курсор."); }
  }
  const result = await env.DB.prepare(`SELECT id, name, message, avatar, created_at FROM guestbook
    WHERE profile = ?1 AND status = 'visible' AND (created_at < ?2 OR (created_at = ?2 AND id < ?3))
    ORDER BY created_at DESC, id DESC LIMIT ?4`).bind(profile, cursorTime, cursorId, limit + 1).all<Entry>();
  const hasMore = result.results.length > limit;
  const entries = result.results.slice(0, limit);
  const last = entries.at(-1);
  const nextCursor = hasMore && last ? btoa(JSON.stringify({ t: last.created_at, id: last.id })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : null;
  return json(request, env, { ok: true, data: { entries, nextCursor } }, 200, { "Cache-Control": "public, max-age=30" });
}

export async function createGuestbookEntry(request: Request, env: Env): Promise<Response> {
  let body;
  try { body = await readJson(request, 4096); }
  catch (error) {
    const code = error instanceof Error ? error.message : "invalid_request";
    return fail(request, env, code === "payload_too_large" ? 413 : 400, code, "Некорректный запрос.");
  }
  const validated = validateGuestbook(body.name, body.message, body.avatar);
  if ("error" in validated) return fail(request, env, 422, "validation_failed", validated.error);
  const profile = parseGuestbookProfile(body.profile);
  if (!profile) return fail(request, env, 422, "validation_failed", "Некорректный профиль гостевой книги.");
  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  if (!(await verifyTurnstile(token, request, env))) return fail(request, env, 403, "turnstile_failed", "Проверка защиты от ботов не пройдена.");

  const ipHash = await keyedHash(clientIp(request), env.HASH_SECRET);
  if (!(await checkRateLimit(env.DB, ipHash, "guestbook", 1, 3600))) {
    return fail(request, env, 429, "rate_limit_exceeded", "Можно отправить только одно сообщение в час.");
  }
  const entry: Entry = { id: crypto.randomUUID(), name: validated.name, message: validated.message, avatar: validated.avatar, created_at: new Date().toISOString() };
  await env.DB.prepare(`INSERT INTO guestbook (id, name, message, avatar, created_at, status, submitter_hash, profile)
    VALUES (?1, ?2, ?3, ?4, ?5, 'visible', ?6, ?7)`).bind(entry.id, entry.name, entry.message, entry.avatar, entry.created_at, ipHash, profile).run();
  return json(request, env, { ok: true, data: { entry } }, 201, { "Cache-Control": "no-store" });
}
