import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const clashSupabaseUrl = import.meta.env.VITE_CLASH_SUPABASE_URL ?? "";
const clashSupabaseKey = import.meta.env.VITE_CLASH_SUPABASE_ANON_KEY ?? "";
const storageKey = "clash-clan-auth";

export const clashSupabaseHost = clashSupabaseUrl ? new URL(clashSupabaseUrl).host : "";

export const clashSupabaseMissingEnvVars = [
  clashSupabaseUrl ? "" : "VITE_CLASH_SUPABASE_URL",
  clashSupabaseKey ? "" : "VITE_CLASH_SUPABASE_ANON_KEY"
].filter(Boolean);
const hasClashSupabaseClientConfig = Boolean(clashSupabaseUrl && clashSupabaseKey);

export const isClashSupabaseConfigured = clashSupabaseMissingEnvVars.length === 0;

export const clashSupabase: SupabaseClient | null = hasClashSupabaseClientConfig
  ? createClient(clashSupabaseUrl, clashSupabaseKey, {
      auth: {
        storageKey
      }
    })
  : null;

export function requireClashSupabase(): SupabaseClient {
  if (!clashSupabase) {
    throw new Error(`Clash Supabase env variables are missing: ${clashSupabaseMissingEnvVars.join(", ")}`);
  }

  return clashSupabase;
}

export async function checkClashSupabaseConnection(): Promise<boolean> {
  if (!clashSupabase) {
    console.warn("Clash Supabase health-check skipped: env variables are missing", clashSupabaseMissingEnvVars);
    return false;
  }

  const { error } = await clashSupabase
    .from("app_settings")
    .select("key,value")
    .eq("key", "registration_open")
    .maybeSingle();

  if (error) {
    console.warn("Clash Supabase health-check failed:", error);
    return false;
  }

  return true;
}

export async function clearClashSupabaseSession(): Promise<void> {
  if (clashSupabase) {
    await clashSupabase.auth.signOut().catch(() => undefined);
  }

  if (typeof window === "undefined") {
    return;
  }

  const projectRef = clashSupabaseHost.split(".")[0];
  const keys = [
    storageKey,
    `${storageKey}-code-verifier`,
    projectRef ? `sb-${projectRef}-auth-token` : "",
    projectRef ? `sb-${projectRef}-auth-token-code-verifier` : ""
  ].filter(Boolean);

  keys.forEach((key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  });
}
