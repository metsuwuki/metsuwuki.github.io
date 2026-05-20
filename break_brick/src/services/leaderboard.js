import { createClient } from "@supabase/supabase-js";

const PLAYERS_TABLE = "game_players";
const RESULTS_TABLE = "game_results";
const LEADERBOARD_VIEW = "brick_breaker_leaderboard";
const LOCAL_KEY = "brick-breaker-local-scores";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const cleanNickname = (nickname) => nickname.trim().slice(0, 24);

const normalizeScore = (score) => ({
  id: score.id ?? `${score.nickname}-${score.score ?? score.best_score}-${score.created_at}`,
  nickname: score.nickname,
  score: Number(score.score ?? score.best_score ?? 0),
  best_combo: Number(score.best_combo ?? 0),
  created_at: score.created_at,
  updated_at: score.updated_at ?? score.created_at,
  games_played: Number(score.games_played ?? 0)
});

const sortScores = (scores) =>
  scores.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.best_combo !== b.best_combo) return b.best_combo - a.best_combo;
    return new Date(a.updated_at ?? a.created_at).getTime() - new Date(b.updated_at ?? b.created_at).getTime();
  });

const getLocalScores = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]").map(normalizeScore);
  } catch {
    return [];
  }
};

const setLocalScores = (scores) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(scores.slice(0, 30)));
};

const saveLocalScore = ({ nickname, score, bestCombo, playedAt }) => {
  const scores = getLocalScores();
  const scoreIndex = scores.findIndex((item) => item.nickname.toLowerCase() === nickname.toLowerCase());

  if (scoreIndex >= 0) {
    const current = scores[scoreIndex];
    scores[scoreIndex] = normalizeScore({
      ...current,
      score: Math.max(current.score, score),
      best_combo: Math.max(current.best_combo, bestCombo),
      games_played: current.games_played + 1,
      updated_at: playedAt
    });
  } else {
    scores.push(normalizeScore({
      nickname,
      score,
      best_combo: bestCombo,
      games_played: 1,
      created_at: playedAt,
      updated_at: playedAt
    }));
  }

  setLocalScores(sortScores(scores));
};

async function ensurePlayerId(nickname) {
  const name = cleanNickname(nickname);
  const existing = await supabase
    .from(PLAYERS_TABLE)
    .select("id")
    .ilike("nickname", name)
    .maybeSingle();

  if (existing.data?.id) return existing.data.id;
  if (existing.error) throw existing.error;

  const created = await supabase
    .from(PLAYERS_TABLE)
    .insert({ nickname: name })
    .select("id")
    .single();

  if (!created.error) return created.data.id;

  const retry = await supabase
    .from(PLAYERS_TABLE)
    .select("id")
    .ilike("nickname", name)
    .maybeSingle();

  if (retry.error || !retry.data?.id) throw created.error;
  return retry.data.id;
}

export const isLeaderboardRemote = Boolean(supabase);

export const fetchLeaderboard = async () => {
  const localScores = () => sortScores(getLocalScores()).slice(0, 10);
  if (!supabase) return localScores();

  const { data, error } = await supabase
    .from(LEADERBOARD_VIEW)
    .select("nickname,best_score,best_combo,games_played,created_at")
    .order("best_score", { ascending: false })
    .order("best_combo", { ascending: false })
    .limit(10);

  if (error) return localScores();
  return (data ?? []).map(normalizeScore);
};

export const fetchPersonalLeaderboard = async (nickname) => {
  const name = cleanNickname(nickname);
  if (!name) return [];
  const localScores = () =>
    sortScores(getLocalScores().filter((score) => score.nickname.toLowerCase() === name.toLowerCase()));

  if (!supabase) return localScores();

  const { data, error } = await supabase
    .from(LEADERBOARD_VIEW)
    .select("nickname,best_score,best_combo,games_played,created_at")
    .ilike("nickname", name);

  if (error) return localScores();
  return sortScores((data ?? []).map(normalizeScore));
};

export const isNicknameTaken = async (nickname) => {
  const name = cleanNickname(nickname);
  if (!name) return false;
  const localMatch = () => getLocalScores().some((score) => score.nickname.toLowerCase() === name.toLowerCase());
  if (!supabase) return localMatch();

  const { count, error } = await supabase.from(PLAYERS_TABLE).select("id", { count: "exact", head: true }).ilike("nickname", name);
  if (error) return localMatch();
  return Number(count ?? 0) > 0;
};

export const submitScore = async ({ nickname, score, bestCombo }) => {
  const playedAt = new Date().toISOString();
  const name = cleanNickname(nickname);

  if (!supabase || name.length < 2 || score < 0 || bestCombo < 0) {
    saveLocalScore({ nickname: name, score, bestCombo, playedAt });
    return;
  }

  try {
    const playerId = await ensurePlayerId(name);
    const { error } = await supabase.from(RESULTS_TABLE).insert({
      player_id: playerId,
      game_key: "brick_breaker",
      difficulty: null,
      duration_seconds: null,
      score,
      combo: bestCombo,
      metadata: {},
      created_at: playedAt
    });

    if (!error) return;
  } catch {
    // Fall back to local scores when Supabase is unavailable or not migrated yet.
  }

  saveLocalScore({ nickname: name, score, bestCombo, playedAt });
};
