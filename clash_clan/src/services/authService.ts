import type { User } from "@supabase/supabase-js";
import type { ProfileRecord } from "../types";
import { requireClashSupabase } from "../lib/clashSupabaseClient";
import { getRegistrationStatus } from "./settingsService";
import { isLikelyClashTag, normalizeClashTag } from "../utils/tags";

export type SignUpInput = {
  email: string;
  password: string;
  playerTag: string;
};

export async function signUp(input: SignUpInput): Promise<{ user: User | null }> {
  const registration = await getRegistrationStatus();

  if (!registration.enabled) {
    throw new Error("Registration requests are currently closed.");
  }

  if (input.password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const playerTag = normalizeClashTag(input.playerTag);
  if (!isLikelyClashTag(playerTag)) {
    throw new Error("Player tag looks invalid.");
  }

  const client = requireClashSupabase();
  const { data, error } = await client.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        clash_tag: playerTag,
      }
    }
  });

  if (error) throw error;
  return { user: data.user };
}

export async function signIn(email: string, password: string): Promise<void> {
  const client = requireClashSupabase();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await updateLastLogin();
}

export async function signOut(): Promise<void> {
  const client = requireClashSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function updatePassword(newPassword: string): Promise<void> {
  const client = requireClashSupabase();
  const { error } = await client.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function sendPasswordReset(email: string): Promise<void> {
  const client = requireClashSupabase();
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/clash_clan`
  });
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const client = requireClashSupabase();
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getMyProfile(): Promise<ProfileRecord | null> {
  const client = requireClashSupabase();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await client.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getMyProfile();
  return Boolean(profile?.status === "approved" && (profile.role === "owner" || profile.role === "admin"));
}

export async function isApprovedManager(): Promise<boolean> {
  return isAdmin();
}

export async function updateLastLogin(): Promise<void> {
  const client = requireClashSupabase();
  const { error } = await client.rpc("update_own_last_login");
  if (error) throw error;
}
