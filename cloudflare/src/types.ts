export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  HASH_SECRET: string;
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_BYPASS?: string;
  MODERATION_TOKEN: string;
}

export type JsonRecord = Record<string, unknown>;
