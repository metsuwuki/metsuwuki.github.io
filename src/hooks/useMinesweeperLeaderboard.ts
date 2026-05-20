import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export type MinesweeperScore = {
  id: string | number;
  nickname: string;
  difficulty: string;
  time_seconds: number;
  best_seconds?: number;
  created_at: string;
  updated_at?: string;
  games_played?: number;
};

type LeaderboardState = {
  scores: MinesweeperScore[];
  gamesPlayed: number;
  isLoading: boolean;
  error: string | null;
};

type SharedGameStats = {
  id: string | number;
  nickname: string;
  total_games_played?: number;
  minesweeper_games_played?: number;
  minesweeper_easy_best_seconds?: number | null;
  minesweeper_medium_best_seconds?: number | null;
  minesweeper_hard_best_seconds?: number | null;
  created_at: string;
  updated_at?: string;
};

const difficultyRank: Record<string, number> = {
  hard: 0,
  medium: 1,
  easy: 2
};

const LOCAL_KEY = "minesweeper-local-scores";

function normalizeScore(score: MinesweeperScore): MinesweeperScore {
  return {
    ...score,
    id: score.id ?? `${score.nickname}-${score.difficulty}-${score.time_seconds ?? score.best_seconds}-${score.created_at}`,
    time_seconds: Number(score.time_seconds ?? score.best_seconds),
    games_played: Number(score.games_played ?? 1)
  };
}

function sortScores(scores: MinesweeperScore[]): MinesweeperScore[] {
  return [...scores].sort((a, b) => {
    const difficultyDiff = (difficultyRank[a.difficulty] ?? 99) - (difficultyRank[b.difficulty] ?? 99);
    if (difficultyDiff !== 0) return difficultyDiff;
    if (a.time_seconds !== b.time_seconds) return a.time_seconds - b.time_seconds;
    return new Date(a.updated_at ?? a.created_at).getTime() - new Date(b.updated_at ?? b.created_at).getTime();
  });
}

function getLocalScores(): MinesweeperScore[] {
  if (typeof window === "undefined") return [];

  try {
    return (JSON.parse(window.localStorage.getItem(LOCAL_KEY) || "[]") as MinesweeperScore[]).map(normalizeScore);
  } catch {
    return [];
  }
}

function getLocalState(limit: number, difficulty: string): LeaderboardState {
  const localScores = getLocalScores();
  const visibleScores = difficulty === "all"
    ? localScores
    : localScores.filter((score) => score.difficulty === difficulty);

  return {
    scores: sortScores(visibleScores).slice(0, limit),
    gamesPlayed: localScores.reduce((total, score) => total + Number(score.games_played ?? 0), 0),
    isLoading: false,
    error: null
  };
}

export function useMinesweeperLeaderboard(limit = 10, difficulty = "all"): LeaderboardState {
  const [state, setState] = useState<LeaderboardState>({
    scores: [],
    gamesPlayed: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    async function loadScores() {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      if (!isSupabaseConfigured) {
        if (isMounted) setState(getLocalState(limit, difficulty));
        return;
      }

      const [leaderboardResponse, statsResponse] = await Promise.all([
        supabase
          .from("minesweeper_leaderboard")
          .select("nickname,difficulty,best_seconds,games_played,created_at")
          .limit(200),
        supabase
          .from("player_global_stats")
          .select("minesweeper_games_played")
      ]);

      if (!isMounted) {
        return;
      }

      const { data, error } = leaderboardResponse;

      if (error) {
        setState({ ...getLocalState(limit, difficulty), error: error.message });
        return;
      }

      const normalizedScores = ((data ?? []) as MinesweeperScore[]).map(normalizeScore);
      const visibleScores = difficulty === "all"
        ? normalizedScores
        : normalizedScores.filter((score) => score.difficulty === difficulty);

      setState({
        scores: sortScores(visibleScores).slice(0, limit),
        gamesPlayed: statsResponse.error
          ? normalizedScores.reduce((total, score) => total + Number(score.games_played ?? 0), 0)
          : ((statsResponse.data ?? []) as SharedGameStats[]).reduce((total, score) => total + Number(score.minesweeper_games_played ?? 0), 0),
        isLoading: false,
        error: null
      });
    }

    loadScores().catch((error: unknown) => {
      if (!isMounted) {
        return;
      }

      setState({
        ...getLocalState(limit, difficulty),
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown leaderboard error"
      });
    });

    return () => {
      isMounted = false;
    };
  }, [difficulty, limit]);

  return state;
}
