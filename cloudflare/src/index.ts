import { analyticsSummary, recordVisit } from "./routes/analytics";
import { moderateGuestbook } from "./routes/admin";
import { createGuestbookEntry, listGuestbook } from "./routes/guestbook";
import type { Env } from "./types";
import { allowedOrigin, corsHeaders, fail, json } from "./services/security";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      if (!allowedOrigin(request, env)) return fail(request, env, 403, "origin_denied", "Origin не разрешён.");
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }
    if (request.headers.get("Origin") && !allowedOrigin(request, env)) return fail(request, env, 403, "origin_denied", "Origin не разрешён.");
    try {
      if (url.pathname === "/api/health" && request.method === "GET") {
        const database = await env.DB.prepare("SELECT 1 AS connected").first<{ connected: number }>();
        return json(request, env, { ok: true, data: { service: "kagami-nexus-api", database: database?.connected === 1 ? "connected" : "unavailable" } });
      }
      if (url.pathname === "/api/analytics/visit" && request.method === "POST") return recordVisit(request, env);
      if (url.pathname === "/api/analytics/summary" && request.method === "GET") return analyticsSummary(request, env);
      if (url.pathname === "/api/guestbook" && request.method === "GET") return listGuestbook(request, env);
      if (url.pathname === "/api/guestbook" && request.method === "POST") return createGuestbookEntry(request, env);
      const adminMatch = url.pathname.match(/^\/api\/admin\/guestbook(?:\/([^/]+))?$/);
      if (adminMatch) return moderateGuestbook(request, env, adminMatch[1]);
      return fail(request, env, 404, "not_found", "Маршрут не найден.");
    } catch (error) {
      console.error("Unhandled API error", error);
      return fail(request, env, 500, "internal_error", "Внутренняя ошибка сервиса.");
    }
  },
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    const cutoff = Math.floor(Date.now() / 1000) - 172800;
    await env.DB.prepare("DELETE FROM rate_limits WHERE bucket_start < ?1").bind(cutoff).run();
  },
} satisfies ExportedHandler<Env>;
