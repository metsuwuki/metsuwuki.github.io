import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && key);

// Fallback to a no-op client when env vars are unavailable in CI.
export const supabase = createClient(
  url ?? "https://placeholder.supabase.co",
  key ?? "placeholder"
);
