export type ClanRecord = {
  key: ClanKey;
  name: string;
  image: string;
};

export type ClanKey = "ukraine" | "raybojniki";

export type PlayerRole = "leader" | "coLeader" | "member";

export type AccountType = "main" | "twink";

export type PlayerRecord = {
  id: string;
  clan_key?: ClanKey;
  home_clan_key: ClanKey;
  current_clan_key: ClanKey;
  player_tag: string;
  nickname: string;
  town_hall_level: number;
  role: PlayerRole;
  war_ready: boolean;
  account_type: AccountType;
  main_player_id: string | null;
  joined_home_clan_at: string | null;
  home_clan_timer_paused: boolean;
  home_clan_timer_paused_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PlayerWithRelations = PlayerRecord & {
  alt_count: number;
  main_nickname: string | null;
};

export type BlacklistRecord = {
  id: string;
  player_tag: string;
  nickname: string;
  town_hall_level: number;
  reason: string | null;
  created_by: string | null;
  created_at: string;
};

export type ProfileRole = "owner" | "admin";

export type ProfileStatus = "pending" | "approved" | "rejected" | "revoked";

export type ProfileRecord = {
  id: string;
  email: string | null;
  username: string | null;
  role: ProfileRole;
  status: ProfileStatus;
  clash_tag: string | null;
  nickname: string | null;
  clash_name: string | null;
  townhall_level: number | null;
  access_requested_at: string;
  last_login_at: string | null;
  revoked_reason: string | null;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
};

export type RegistrationStatus = {
  enabled: boolean;
};

export type ClanRulesSettings = {
  content: string;
  version: string;
  updated_at?: string;
};

export type ViewMode = "viewer" | "admin" | "owner";

export type Toast = {
  type: "success" | "error" | "info";
  message: string;
};
