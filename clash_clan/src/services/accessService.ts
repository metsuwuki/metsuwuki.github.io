import type { ProfileRecord } from "../types";
import { requireClashSupabase } from "../lib/clashSupabaseClient";

export async function listProfiles(): Promise<ProfileRecord[]> {
  const client = requireClashSupabase();
  const { data, error } = await client.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

async function updateProfile(profileId: string, values: Partial<ProfileRecord>): Promise<ProfileRecord> {
  const client = requireClashSupabase();
  const { data: userData } = await client.auth.getUser();
  const nextValues: Partial<ProfileRecord> = { ...values };

  if ("status" in values) {
    nextValues.approved_at = values.status === "approved" ? new Date().toISOString() : values.approved_at ?? null;
    nextValues.approved_by = values.status === "approved" ? userData.user?.id ?? null : values.approved_by ?? null;
  }

  const { data, error } = await client.from("profiles").update(nextValues).eq("id", profileId).select().single();

  if (error) throw error;
  return data;
}

function isMissingRpc(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("message" in error)) return false;
  return String((error as { message?: unknown }).message ?? "").includes("function") || String((error as { code?: unknown }).code ?? "") === "PGRST202";
}

async function callProfileRpc(name: string, args: Record<string, unknown>): Promise<ProfileRecord> {
  const client = requireClashSupabase();
  const { data, error } = await client.rpc(name, args);
  if (error) throw error;
  return data as ProfileRecord;
}

export async function approveUser(profileId: string): Promise<ProfileRecord> {
  try {
    return await callProfileRpc("approve_profile_as_admin", { profile_id: profileId });
  } catch (error) {
    if (!isMissingRpc(error)) throw error;
    return updateProfile(profileId, { role: "admin", status: "approved", revoked_reason: null });
  }
}

export async function rejectUser(profileId: string): Promise<ProfileRecord> {
  try {
    return await callProfileRpc("reject_profile", { profile_id: profileId });
  } catch (error) {
    if (!isMissingRpc(error)) throw error;
    return updateProfile(profileId, { status: "rejected", approved_at: null, approved_by: null });
  }
}

export async function revokeUser(profileId: string, reason?: string): Promise<ProfileRecord> {
  try {
    return await callProfileRpc("revoke_profile", { profile_id: profileId, reason: reason ?? null });
  } catch (error) {
    if (!isMissingRpc(error)) throw error;
    return updateProfile(profileId, {
      status: "revoked",
      approved_at: null,
      approved_by: null,
      revoked_reason: reason ?? null
    });
  }
}

export async function deleteProfile(profileId: string): Promise<void> {
  const client = requireClashSupabase();
  const { error } = await client.rpc("delete_profile", { profile_id: profileId });
  if (!error) return;
  if (!isMissingRpc(error)) throw error;

  const { error: deleteError } = await client.from("profiles").delete().eq("id", profileId);
  if (deleteError) throw deleteError;
}
