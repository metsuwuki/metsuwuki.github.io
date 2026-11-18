import type { Env, JsonRecord } from "../types";

const encoder = new TextEncoder();

export function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const allowed = env.ALLOWED_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : null;
}

export function corsHeaders(request: Request, env: Env): HeadersInit {
  const origin = allowedOrigin(request, env);
  return origin ? {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  } : { Vary: "Origin" };
}

export function json(request: Request, env: Env, data: JsonRecord, status = 200, extra: HeadersInit = {}): Response {
  return Response.json(data, { status, headers: { ...corsHeaders(request, env), ...extra, "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff" } });
}

export function fail(request: Request, env: Env, status: number, code: string, message: string): Response {
  return json(request, env, { ok: false, error: { code, message } }, status);
}

export async function readJson(request: Request, maxBytes = 4096): Promise<JsonRecord> {
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) throw new Error("invalid_content_type");
  const length = Number(request.headers.get("Content-Length") ?? 0);
  if (length > maxBytes) throw new Error("payload_too_large");
  const text = await request.text();
  if (encoder.encode(text).byteLength > maxBytes) throw new Error("payload_too_large");
  const value: unknown = JSON.parse(text);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_json");
  return value as JsonRecord;
}

export async function keyedHash(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ?? "unknown";
}

export async function isAuthorized(request: Request, env: Env): Promise<boolean> {
  const supplied = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!supplied || !env.MODERATION_TOKEN) return false;
  const left = encoder.encode(await keyedHash(supplied, env.HASH_SECRET));
  const right = encoder.encode(await keyedHash(env.MODERATION_TOKEN, env.HASH_SECRET));
  if (left.byteLength !== right.byteLength) return false;
  let difference = 0;
  for (let index = 0; index < left.byteLength; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

export async function verifyTurnstile(token: string, request: Request, env: Env): Promise<boolean> {
  if (env.TURNSTILE_BYPASS === "true") return true;
  if (!token || !env.TURNSTILE_SECRET_KEY) return false;
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);
  body.set("remoteip", clientIp(request));
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  if (!response.ok) return false;
  const result = await response.json<{ success?: boolean }>();
  return result.success === true;
}
