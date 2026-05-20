import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export type BrickBreakerScore = {
  id: string | number;
  nickname: string;
  score: number;
  best_score?: number;
  best_combo?: number;
  created_at: string;
  updated_at?: string;
  games_played?: number;
};

type LeaderboardState = {
  scores: BrickBreakerScore[];
  gamesPlayed: number;
  isLoading: boolean;
  error: string | null;
};

const LOCAL_KEY = "brick-breaker-local-scores";

function normalizeScore(score: BrickBreakerScore): BrickBreakerScore {
  return {
    ...score,
    id: score.id ?? `${score.nickname}-${score.score ?? score.best_score}-${score.created_at}`,
    score: Number(score.score ?? score.best_score ?? 0),
    best_combo: Number(score.best_combo ?? 0),
    games_played: Number(score.games_played ?? 1)
  };
}

function sortScores(scores: BrickBreakerScore[]): BrickBreakerScore[] {
  return [...scores].sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if ((a.best_combo ?? 0) !== (b.best_combo ?? 0)) return (b.best_combo ?? 0) - (a.best_combo ?? 0);
    return new Date(a.updated_at ?? a.created_at).getTime() - new Date(b.updated_at ?? b.created_at).getTime();
  });
}

function getLocalScores(): BrickBreakerScore[] {
  if (typeof window === "undefined") return [];

  try {
    return (JSON.parse(window.localStorage.getItem(LOCAL_KEY) || "[]") as BrickBreakerScore[]).map(normalizeScore);
  } catch {
    return [];
  }
}

function getLocalState(limit: number): LeaderboardState {
  const scores = getLocalScores();

  return {
    scores: sortScores(scores).slice(0, limit),
    gamesPlayed: scores.reduce((total, score) => total + Number(score.games_played ?? 0), 0),
    isLoading: false,
    error: null
  };
}

export function useBrickBreakerLeaderboard(limit = 10): LeaderboardState {
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
        if (isMounted) setState(getLocalState(limit));
        return;
      }

      const [leaderboardResponse, statsResponse] = await Promise.all([
        supabase
          .from("brick_breaker_leaderboard")
          .select("nickname,best_score,best_combo,games_played,created_at")
          .limit(200),
        supabase
          .from("player_global_stats")
          .select("brick_breaker_games_played")
      ]);

      if (!isMounted) return;

      const { data, error } = leaderboardResponse;

      if (error) {
        setState({ ...getLocalState(limit), error: error.message });
        return;
      }

      const normalizedScores = ((data ?? []) as BrickBreakerScore[])
        .filter((score) => Number(score.score ?? 0) > 0 || Number(score.games_played ?? 0) > 0)
        .map(normalizeScore);
      setState({
        scores: sortScores(normalizedScores).slice(0, limit),
        gamesPlayed: statsResponse.error
          ? normalizedScores.reduce((total, score) => total + Number(score.games_played ?? 0), 0)
          : ((statsResponse.data ?? []) as Array<{ brick_breaker_games_played?: number }>).reduce(
              (total, score) => total + Number(score.brick_breaker_games_played ?? 0),
              0
            ),
        isLoading: false,
        error: null
      });
    }

    loadScores().catch((error: unknown) => {
      if (!isMounted) return;
      setState({
        ...getLocalState(limit),
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown leaderboard error"
      });
    });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return state;
}
