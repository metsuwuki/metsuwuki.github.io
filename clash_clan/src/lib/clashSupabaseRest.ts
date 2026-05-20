import { clashSupabaseUrl, requireClashSupabase } from "./clashSupabaseClient";

const anonKey = import.meta.env.VITE_CLASH_SUPABASE_ANON_KEY ?? "";

export type NetworkDiagnostic = {
  name: string;
  url: string;
  ok: boolean;
  status?: number;
  message: string;
};

export async function readPublicTable<T>(table: string, orderColumn = "created_at", ascending = true): Promise<T[]> {
  const client = requireClashSupabase();
  const { data, error } = await client
    .from(table)
    .select("*")
    .order(orderColumn, { ascending });

  if (error) throw error;
  return (data ?? []) as T[];
}

export async function readRegistrationSetting(): Promise<{ value?: { enabled?: boolean } } | null> {
  const client = requireClashSupabase();
  const { data, error } = await client
    .from("app_settings")
    .select("value")
    .eq("key", "registration_open")
    .maybeSingle();

  if (error) throw error;
  return data as { value?: { enabled?: boolean } } | null;
}

async function testEndpoint(name: string, url: string, headers: HeadersInit = {}): Promise<NetworkDiagnostic> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      credentials: "omit",
      headers,
      mode: "cors"
    });

    return {
      name,
      url,
      ok: response.ok,
      status: response.status,
      message: response.ok ? "OK" : `${response.status} ${response.statusText}`
    };
  } catch (error) {
    return {
      name,
      url,
      ok: false,
      message: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    };
  }
}

async function testSupabaseQuery(name: string, query: () => PromiseLike<{ error: unknown }>): Promise<NetworkDiagnostic> {
  try {
    const result = await query();
    const error = result.error;
    return {
      name,
      url: clashSupabaseUrl || "missing-url",
      ok: !error,
      message: error instanceof Error ? error.message : error ? String(error) : "OK"
    };
  } catch (error) {
    return {
      name,
      url: clashSupabaseUrl || "missing-url",
      ok: false,
      message: error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    };
  }
}

export async function runClashNetworkDiagnostics(): Promise<NetworkDiagnostic[]> {
  if (!clashSupabaseUrl || !anonKey) {
    return [
      {
        name: "env",
        url: clashSupabaseUrl || "missing-url",
        ok: false,
        message: "VITE_CLASH_SUPABASE_URL or VITE_CLASH_SUPABASE_ANON_KEY is missing"
      }
    ];
  }

  const client = requireClashSupabase();

  return Promise.all([
    testEndpoint("auth-settings", `${clashSupabaseUrl}/auth/v1/settings`, {
      apikey: anonKey
    }),
    testSupabaseQuery("settings", () => client.from("app_settings").select("key,value").eq("key", "registration_open").limit(1)),
    testSupabaseQuery("players", () => client.from("players").select("id").limit(1)),
    testSupabaseQuery("blacklist", () => client.from("blacklist").select("id").limit(1))
  ]);
}
