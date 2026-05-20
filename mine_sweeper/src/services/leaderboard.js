import { createClient } from '@supabase/supabase-js';

const PLAYERS_TABLE = 'game_players';
const RESULTS_TABLE = 'game_results';
const LEADERBOARD_VIEW = 'minesweeper_leaderboard';
const LOCAL_KEY = 'minesweeper-local-scores';
const DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const DIFFICULTY_RANK = {
  hard: 0,
  medium: 1,
  easy: 2,
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const cleanNickname = (nickname) => nickname.trim().slice(0, 24);

const normalizeScore = (score) => ({
  id: score.id ?? `${score.nickname}-${score.difficulty}-${score.time_seconds ?? score.best_seconds}-${score.created_at}`,
  nickname: score.nickname,
  difficulty: score.difficulty,
  time_seconds: Number(score.time_seconds ?? score.best_seconds),
  created_at: score.created_at,
  updated_at: score.updated_at ?? score.created_at,
  games_played: Number(score.games_played ?? 1),
});

const sortScores = (scores) =>
  scores.sort((a, b) => {
    const difficultyDiff = (DIFFICULTY_RANK[a.difficulty] ?? 99) - (DIFFICULTY_RANK[b.difficulty] ?? 99);
    if (difficultyDiff !== 0) return difficultyDiff;
    if (a.time_seconds !== b.time_seconds) return a.time_seconds - b.time_seconds;
    return new Date(a.updated_at ?? a.created_at).getTime() - new Date(b.updated_at ?? b.created_at).getTime();
  });

const getLocalScores = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]').map(normalizeScore);
  } catch {
    return [];
  }
};

const setLocalScores = (scores) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(scores.slice(0, 30)));
};

const saveLocalScore = ({ nickname, difficulty, timeSeconds, playedAt }) => {
  const scores = getLocalScores();
  const scoreIndex = scores.findIndex(
    (item) => item.nickname.toLowerCase() === nickname.toLowerCase() && item.difficulty === difficulty
  );

  if (scoreIndex >= 0) {
    const current = scores[scoreIndex];
    scores[scoreIndex] = normalizeScore({
      ...current,
      time_seconds: Math.min(current.time_seconds, timeSeconds),
      games_played: current.games_played + 1,
      updated_at: playedAt,
    });
  } else {
    scores.push(normalizeScore({
      nickname,
      difficulty,
      time_seconds: timeSeconds,
      games_played: 1,
      created_at: playedAt,
      updated_at: playedAt,
    }));
  }

  setLocalScores(sortScores(scores));
};

async function ensurePlayerId(nickname) {
  const name = cleanNickname(nickname);
  const existing = await supabase
    .from(PLAYERS_TABLE)
    .select('id')
    .ilike('nickname', name)
    .maybeSingle();

  if (existing.data?.id) return existing.data.id;
  if (existing.error) throw existing.error;

  const created = await supabase
    .from(PLAYERS_TABLE)
    .insert({ nickname: name })
    .select('id')
    .single();

  if (!created.error) return created.data.id;

  const retry = await supabase
    .from(PLAYERS_TABLE)
    .select('id')
    .ilike('nickname', name)
    .maybeSingle();

  if (retry.error || !retry.data?.id) throw created.error;
  return retry.data.id;
}

export const isLeaderboardRemote = Boolean(supabase);

export const fetchLeaderboard = async (difficulty) => {
  const localScores = () =>
    getLocalScores()
      .filter((score) => score.difficulty === difficulty)
      .sort((a, b) => a.time_seconds - b.time_seconds)
      .slice(0, 10);

  if (!supabase || !DIFFICULTIES.has(difficulty)) return localScores();

  const { data, error } = await supabase
    .from(LEADERBOARD_VIEW)
    .select('nickname,difficulty,best_seconds,games_played,created_at')
    .eq('difficulty', difficulty)
    .order('best_seconds', { ascending: true })
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
    .select('nickname,difficulty,best_seconds,games_played,created_at')
    .ilike('nickname', name);

  if (error) return localScores();
  return sortScores((data ?? []).map(normalizeScore));
};

export const isNicknameTaken = async (nickname) => {
  const name = cleanNickname(nickname);
  if (!name) return false;

  const localMatch = () =>
    getLocalScores().some((score) => score.nickname.toLowerCase() === name.toLowerCase());

  if (!supabase) return localMatch();

  const { count, error } = await supabase
    .from(PLAYERS_TABLE)
    .select('id', { count: 'exact', head: true })
    .ilike('nickname', name);

  if (error) return localMatch();
  return Number(count ?? 0) > 0;
};

export const submitScore = async ({ nickname, difficulty, timeSeconds }) => {
  const playedAt = new Date().toISOString();
  const name = cleanNickname(nickname);

  if (!supabase || !DIFFICULTIES.has(difficulty) || timeSeconds < 0 || name.length < 2) {
    saveLocalScore({ nickname: name, difficulty, timeSeconds, playedAt });
    return;
  }

  try {
    const playerId = await ensurePlayerId(name);
    const { error } = await supabase.from(RESULTS_TABLE).insert({
      player_id: playerId,
      game_key: 'minesweeper',
      difficulty,
      duration_seconds: timeSeconds,
      score: null,
      combo: null,
      metadata: {},
      created_at: playedAt,
    });

    if (!error) return;
  } catch {
    // Fall back to local scores when Supabase is unavailable or not migrated yet.
  }

  saveLocalScore({ nickname: name, difficulty, timeSeconds, playedAt });
};
