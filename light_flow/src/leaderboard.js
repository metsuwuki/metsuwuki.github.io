import { createClient } from "@supabase/supabase-js";

const PLAYERS_TABLE = "game_players";
const RESULTS_TABLE = "game_results";
const LEADERBOARD_VIEW = "neon_flow_leaderboard";
const LOCAL_KEY = "neon-flow-local-scores";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const cleanNickname = (nickname) => nickname.trim().slice(0, 24);

function localScores() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocal(score) {
  const scores = [...localScores(), score]
    .sort((a, b) => b.best_score - a.best_score || a.best_time_seconds - b.best_time_seconds || a.best_moves - b.best_moves)
    .slice(0, 40);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(scores));
}

async function ensurePlayerId(nickname) {
  const name = cleanNickname(nickname);
  const existing = await supabase.from(PLAYERS_TABLE).select("id").ilike("nickname", name).maybeSingle();
  if (existing.data?.id) return existing.data.id;
  if (existing.error) throw existing.error;

  const created = await supabase.from(PLAYERS_TABLE).insert({ nickname: name }).select("id").single();
  if (!created.error) return created.data.id;

  const retry = await supabase.from(PLAYERS_TABLE).select("id").ilike("nickname", name).maybeSingle();
  if (retry.error || !retry.data?.id) throw created.error;
  return retry.data.id;
}

export const isLeaderboardRemote = Boolean(supabase);

export async function fetchLeaderboard(difficulty = "easy") {
  const fallback = () => localScores().filter((score) => score.difficulty === difficulty).slice(0, 10);
  if (!supabase) return fallback();

  const { data, error } = await supabase
    .from(LEADERBOARD_VIEW)
    .select("nickname,difficulty,best_score,best_time_seconds,best_moves,games_played")
    .eq("difficulty", difficulty)
    .order("best_score", { ascending: false })
    .order("best_time_seconds", { ascending: true })
    .limit(10);

  if (error) return fallback();
  return data ?? [];
}

export async function submitScore({ nickname, difficulty, score, durationSeconds, moves, gridSize, lampsTotal, lampsLit }) {
  const name = cleanNickname(nickname);
  const localScore = {
    nickname: name,
    difficulty,
    best_score: score,
    best_time_seconds: durationSeconds,
    best_moves: moves,
    games_played: 1
  };

  if (!supabase || name.length < 2) {
    saveLocal(localScore);
    return;
  }

  try {
    const playerId = await ensurePlayerId(name);
    const { error } = await supabase.from(RESULTS_TABLE).insert({
      player_id: playerId,
      game_key: "neon_flow",
      difficulty,
      score,
      duration_seconds: durationSeconds,
      combo: null,
      metadata: {
        moves,
        gridSize,
        lampsTotal,
        lampsLit
      }
    });

    if (!error) return;
  } catch {
    // Keep the game playable when Supabase is unavailable.
  }

  saveLocal(localScore);
}
