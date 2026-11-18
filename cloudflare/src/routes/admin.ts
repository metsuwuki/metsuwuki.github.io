import type { Env } from "../types";
import { fail, isAuthorized, json, readJson } from "../services/security";

export async function moderateGuestbook(request: Request, env: Env, id?: string): Promise<Response> {
  if (!(await isAuthorized(request, env))) return fail(request, env, 401, "unauthorized", "Требуется авторизация модератора.");
  if (request.method === "GET") {
    const rows = await env.DB.prepare("SELECT id, name, message, avatar, created_at, status, profile FROM guestbook ORDER BY created_at DESC LIMIT 100").all();
    return json(request, env, { ok: true, data: { entries: rows.results } }, 200, { "Cache-Control": "no-store" });
  }
  if (!id) return fail(request, env, 400, "missing_id", "Не указан идентификатор сообщения.");
  if (request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM guestbook WHERE id = ?1").bind(id).run();
    return json(request, env, { ok: true, data: { deleted: true } });
  }
  if (request.method === "PATCH") {
    let body;
    try { body = await readJson(request, 512); } catch { return fail(request, env, 400, "invalid_request", "Некорректный запрос."); }
    if (body.status !== "visible" && body.status !== "hidden") return fail(request, env, 422, "validation_failed", "Недопустимый статус.");
    await env.DB.prepare("UPDATE guestbook SET status = ?1 WHERE id = ?2").bind(body.status, id).run();
    return json(request, env, { ok: true, data: { updated: true } });
  }
  return fail(request, env, 405, "method_not_allowed", "Метод не поддерживается.");
}
