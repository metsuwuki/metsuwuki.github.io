import type { AccountType, BlacklistRecord, ClanKey, PlayerRecord, PlayerRole, PlayerWithRelations } from "../types";
import { requireClashSupabase } from "../lib/clashSupabaseClient";
import { readPublicTable } from "../lib/clashSupabaseRest";
import { normalizeClashTag } from "../utils/tags";

export type PlayerInput = {
  homeClanKey: ClanKey;
  currentClanKey: ClanKey;
  nickname: string;
  playerTag: string;
  role: PlayerRole;
  townHallLevel: number;
  accountType: AccountType;
  mainPlayerId: string | null;
  joinedHomeClanAt: string | null;
};

export type BlacklistInput = {
  nickname: string;
  playerTag: string;
  townHallLevel: number;
  reason?: string;
};

export async function getPlayers(): Promise<PlayerRecord[]> {
  try {
    return await readPublicTable<PlayerRecord>("players", "created_at", true);
  } catch {
    const client = requireClashSupabase();
    const { data, error } = await client.from("players").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }
}

export async function getPlayersWithRelations(): Promise<PlayerWithRelations[]> {
  return withPlayerRelations(await getPlayers());
}

export async function getBlacklist(): Promise<BlacklistRecord[]> {
  try {
    return await readPublicTable<BlacklistRecord>("blacklist", "created_at", false);
  } catch {
    const client = requireClashSupabase();
    const { data, error } = await client.from("blacklist").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
}

export async function createPlayer(input: PlayerInput): Promise<PlayerRecord> {
  const client = requireClashSupabase();
  const { data: userData } = await client.auth.getUser();
  await validatePlayerInput(input);
  const { data, error } = await client
    .from("players")
    .insert(toPlayerRow(input, userData.user?.id ?? null))
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePlayer(playerId: string, input: PlayerInput): Promise<PlayerRecord> {
  const client = requireClashSupabase();
  await validatePlayerInput(input, playerId);
  const { data, error } = await client
    .from("players")
    .update({
      ...toPlayerRow(input),
      updated_at: new Date().toISOString()
    })
    .eq("id", playerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function movePlayerToClan(playerId: string, currentClanKey: ClanKey): Promise<PlayerRecord> {
  const client = requireClashSupabase();
  const { data: player, error: loadError } = await client
    .from("players")
    .select("home_clan_key,current_clan_key,home_clan_timer_paused_at")
    .eq("id", playerId)
    .single();
  if (loadError) throw loadError;

  const isAwayFromHome = player.home_clan_key !== currentClanKey;
  const pauseStartedAt = isAwayFromHome ? player.home_clan_timer_paused_at ?? new Date().toISOString() : null;
  const { data, error } = await client
    .from("players")
    .update({
      current_clan_key: currentClanKey,
      home_clan_timer_paused: isAwayFromHome,
      home_clan_timer_paused_at: pauseStartedAt,
      updated_at: new Date().toISOString()
    })
    .eq("id", playerId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export const movePlayer = movePlayerToClan;

export async function setWarReady(playerId: string, warReady: boolean): Promise<PlayerRecord> {
  const client = requireClashSupabase();
  const { data, error } = await client
    .from("players")
    .update({ war_ready: warReady, updated_at: new Date().toISOString() })
    .eq("id", playerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const updatePlayerWarReady = setWarReady;

export async function deletePlayer(playerId: string): Promise<void> {
  const client = requireClashSupabase();
  const { error } = await client.from("players").delete().eq("id", playerId);
  if (error) throw error;
}

export async function addPlayerToBlacklist(input: BlacklistInput): Promise<BlacklistRecord> {
  const client = requireClashSupabase();
  const { data: userData } = await client.auth.getUser();
  const { data, error } = await client
    .from("blacklist")
    .insert({
      player_tag: normalizeClashTag(input.playerTag),
      nickname: input.nickname.trim(),
      town_hall_level: input.townHallLevel,
      reason: input.reason?.trim() || null,
      created_by: userData.user?.id ?? null
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function validatePlayerInput(input: PlayerInput, playerId?: string) {
  const nickname = input.nickname.trim();
  const playerTag = normalizeClashTag(input.playerTag);
  if (!nickname) throw new Error("Nickname is required.");
  if (!playerTag) throw new Error("Player tag is required.");
  if (!input.homeClanKey || !input.currentClanKey) throw new Error("Home clan and current clan are required.");
  if (input.accountType === "main" && input.mainPlayerId) throw new Error("Main account cannot reference another main account.");
  if (input.accountType === "twink") {
    if (!input.mainPlayerId) throw new Error("Twink account requires a main account.");
    if (input.mainPlayerId === playerId) throw new Error("Twink account cannot reference itself.");
    const client = requireClashSupabase();
    if (playerId) {
      const { data: childTwinks, error: childError } = await client.from("players").select("id").eq("main_player_id", playerId).limit(1);
      if (childError) throw childError;
      if ((childTwinks?.length ?? 0) > 0) throw new Error("Main account with twinks cannot be converted to a twink.");
    }
    const { data, error } = await client.from("players").select("id,account_type").eq("id", input.mainPlayerId).single();
    if (error) throw error;
    if (!data || data.account_type !== "main") throw new Error("Twink account can reference only a main account.");
  }
}

function toPlayerRow(input: PlayerInput, createdBy?: string | null) {
  const awayFromHome = input.homeClanKey !== input.currentClanKey;
  return {
    clan_key: input.currentClanKey,
    home_clan_key: input.homeClanKey,
    current_clan_key: input.currentClanKey,
    account_type: input.accountType,
    main_player_id: input.accountType === "twink" ? input.mainPlayerId : null,
    joined_home_clan_at: input.joinedHomeClanAt || null,
    home_clan_timer_paused: awayFromHome,
    home_clan_timer_paused_at: awayFromHome ? new Date().toISOString() : null,
    player_tag: normalizeClashTag(input.playerTag),
    nickname: input.nickname.trim(),
    town_hall_level: input.townHallLevel,
    role: input.role,
    ...(createdBy !== undefined ? { created_by: createdBy } : {})
  };
}

function withPlayerRelations(players: PlayerRecord[]): PlayerWithRelations[] {
  const byId = new Map(players.map((player) => [player.id, player]));
  const altCounts = players.reduce<Record<string, number>>((accumulator, player) => {
    if (player.account_type === "twink" && player.main_player_id) {
      accumulator[player.main_player_id] = (accumulator[player.main_player_id] ?? 0) + 1;
    }
    return accumulator;
  }, {});

  return players.map((player) => ({
    ...player,
    alt_count: altCounts[player.id] ?? 0,
    main_nickname: player.main_player_id ? byId.get(player.main_player_id)?.nickname ?? null : null
  }));
}
