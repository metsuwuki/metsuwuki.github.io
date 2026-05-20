import type { ClanRulesSettings, RegistrationStatus } from "../types";
import { requireClashSupabase } from "../lib/clashSupabaseClient";
import { readRegistrationSetting } from "../lib/clashSupabaseRest";

const REGISTRATION_KEY = "registration_open";
const CLAN_RULES_KEY = "clan_rules";

export async function getRegistrationStatus(): Promise<RegistrationStatus> {
  try {
    const data = await readRegistrationSetting();
    const value = data?.value as Partial<RegistrationStatus> | null | undefined;
    return { enabled: value?.enabled !== false };
  } catch {
    const client = requireClashSupabase();
    const { data, error } = await client.from("app_settings").select("value").eq("key", REGISTRATION_KEY).maybeSingle();

    if (error) throw error;
    const value = data?.value as Partial<RegistrationStatus> | null | undefined;
    return { enabled: value?.enabled !== false };
  }
}

export async function setRegistrationOpen(enabled: boolean): Promise<RegistrationStatus> {
  const client = requireClashSupabase();
  const { data: userData } = await client.auth.getUser();
  const { data, error } = await client
    .from("app_settings")
    .upsert({
      key: REGISTRATION_KEY,
      value: { enabled },
      updated_at: new Date().toISOString(),
      updated_by: userData.user?.id ?? null
    })
    .select("value")
    .single();

  if (error) throw error;
  return data.value as RegistrationStatus;
}

export async function getClanRulesSettings(defaultRules: ClanRulesSettings): Promise<ClanRulesSettings> {
  const client = requireClashSupabase();
  const { data, error } = await client.from("app_settings").select("value,updated_at").eq("key", CLAN_RULES_KEY).maybeSingle();

  if (error) throw error;

  const value = data?.value as Partial<ClanRulesSettings> | null | undefined;
  return {
    content: typeof value?.content === "string" && value.content.trim() ? value.content : defaultRules.content,
    version: typeof value?.version === "string" && value.version ? value.version : defaultRules.version,
    updated_at: data?.updated_at ?? value?.updated_at ?? defaultRules.updated_at
  };
}

export async function saveClanRules(content: string): Promise<ClanRulesSettings> {
  const client = requireClashSupabase();
  const { data: userData } = await client.auth.getUser();
  const nextRules: ClanRulesSettings = {
    content,
    version: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  const { data, error } = await client
    .from("app_settings")
    .upsert({
      key: CLAN_RULES_KEY,
      value: nextRules,
      updated_at: nextRules.updated_at,
      updated_by: userData.user?.id ?? null
    })
    .select("value")
    .single();

  if (error) throw error;
  return data.value as ClanRulesSettings;
}
