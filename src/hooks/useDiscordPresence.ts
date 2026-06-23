import { useEffect, useState } from "react";
import { discordPresenceFallback } from "../data/siteContent";
import type { Locale } from "../data/siteContent";

type PresenceState = "online" | "idle" | "dnd" | "offline";

type PresenceInfo = {
  available: boolean;
  label: string;
  state: PresenceState;
  displayName: string;
  username: string;
  avatarUrl: string;
  accentColor: string;
  activityName: string;
  activePlatform: string;
};

type DiscordActivity = {
  type?: number;
  name?: string;
};

type LanyardData = {
  discord_status?: PresenceState;
  discord_user?: {
    avatar?: string;
    display_name?: string;
    global_name?: string;
    username?: string;
  };
  activities?: DiscordActivity[];
  active_on_discord_web?: boolean;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
};

function buildAvatarUrl(userId: string, avatarHash: string) {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=160`;
}

function getPlatformLabel(payload: LanyardData): string {
  if (payload.active_on_discord_desktop) return "Desktop";
  if (payload.active_on_discord_mobile) return "Mobile";
  if (payload.active_on_discord_web) return "Web";
  return discordPresenceFallback.activePlatform;
}

function getPrimaryActivity(activities?: DiscordActivity[]): string {
  return activities?.find((activity) => activity.type === 0)?.name ?? discordPresenceFallback.activityName;
}

function getPresenceLabel(state: PresenceState, locale: Locale): string {
  if (locale === "ru") {
    if (state === "online") return "В сети";
    if (state === "idle") return "Неактивен";
    if (state === "dnd") return "Не беспокоить";
    return "Не в сети";
  }

  if (state === "online") return "Online";
  if (state === "idle") return "Idle";
  if (state === "dnd") return "Do not disturb";
  return "Offline";
}

function mapPresence(state: PresenceState, locale: Locale, userId?: string, payload?: LanyardData): PresenceInfo {
  const displayName =
    payload?.discord_user?.display_name ??
    payload?.discord_user?.global_name ??
    discordPresenceFallback.displayName;
  const username = payload?.discord_user?.username ?? discordPresenceFallback.username;
  const avatarHash = payload?.discord_user?.avatar ?? discordPresenceFallback.avatarHash;
  const resolvedUserId = userId ?? "836229144701829140";

  return {
    available: state !== "offline",
    label: getPresenceLabel(state, locale),
    state,
    displayName,
    username,
    avatarUrl: buildAvatarUrl(resolvedUserId, avatarHash),
    accentColor: discordPresenceFallback.accentColor,
    activityName: getPrimaryActivity(payload?.activities),
    activePlatform: payload ? getPlatformLabel(payload) : discordPresenceFallback.activePlatform,
  };
}

export function useDiscordPresence(userId?: string, locale: Locale = "en"): PresenceInfo {
  const [presence, setPresence] = useState<PresenceInfo>(
    mapPresence(discordPresenceFallback.status, locale, userId),
  );

  useEffect(() => {
    if (!userId) {
      setPresence(mapPresence(discordPresenceFallback.status, locale));
      return;
    }

    let cancelled = false;

    const loadPresence = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const payload = (await response.json()) as {
          success?: boolean;
          data?: LanyardData;
        };

        if (!cancelled && payload.success && payload.data?.discord_status) {
          setPresence(mapPresence(payload.data.discord_status, locale, userId, payload.data));
          return;
        }

        if (!cancelled) setPresence(mapPresence(discordPresenceFallback.status, locale, userId));
      } catch {
        if (!cancelled) setPresence(mapPresence(discordPresenceFallback.status, locale, userId));
      }
    };

    void loadPresence();
    const intervalId = window.setInterval(loadPresence, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [locale, userId]);

  return presence;
}
