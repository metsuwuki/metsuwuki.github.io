import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export type NeonFlowScore = {
  nickname: string;
  difficulty: string;
  best_score: number;
  best_time_seconds: number;
  best_moves: number;
  games_played: number;
};

type LeaderboardState = {
  scores: NeonFlowScore[];
  gamesPlayed: number;
  isLoading: boolean;
  error: string | null;
};

type SharedGameStats = {
  neon_flow_games_played?: number;
};

const LOCAL_KEY = "neon-flow-local-scores";

function normalizeScore(score: NeonFlowScore): NeonFlowScore {
  return {
    ...score,
    best_score: Number(score.best_score ?? 0),
    best_time_seconds: Number(score.best_time_seconds ?? 0),
    best_moves: Number(score.best_moves ?? 0),
    games_played: Number(score.games_played ?? 0)
  };
}

function getLocalScores(difficulty: string): NeonFlowScore[] {
  if (typeof window === "undefined") return [];

  try {
    return (JSON.parse(window.localStorage.getItem(LOCAL_KEY) || "[]") as NeonFlowScore[])
      .filter((score) => score.difficulty === difficulty)
      .map(normalizeScore)
      .sort((a, b) => b.best_score - a.best_score || a.best_time_seconds - b.best_time_seconds || a.best_moves - b.best_moves);
  } catch {
    return [];
  }
}

function getLocalState(limit: number, difficulty: string): LeaderboardState {
  const scores = getLocalScores(difficulty);

  return {
    scores: scores.slice(0, limit),
    gamesPlayed: scores.reduce((total, score) => total + Number(score.games_played ?? 0), 0),
    isLoading: false,
    error: null
  };
}

export function useNeonFlowLeaderboard(limit = 10, difficulty = "easy"): LeaderboardState {
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
          .from("neon_flow_leaderboard")
          .select("nickname,difficulty,best_score,best_time_seconds,best_moves,games_played")
          .eq("difficulty", difficulty)
          .order("best_score", { ascending: false })
          .order("best_time_seconds", { ascending: true })
          .limit(limit),
        supabase
          .from("player_global_stats")
          .select("neon_flow_games_played")
      ]);

      if (!isMounted) return;

      const { data, error } = leaderboardResponse;

      if (error) {
        setState({ ...getLocalState(limit, difficulty), error: error.message });
        return;
      }

      const scores = ((data ?? []) as NeonFlowScore[]).map(normalizeScore);

      setState({
        scores,
        gamesPlayed: statsResponse.error
          ? scores.reduce((total, score) => total + Number(score.games_played ?? 0), 0)
          : ((statsResponse.data ?? []) as SharedGameStats[]).reduce(
              (total, score) => total + Number(score.neon_flow_games_played ?? 0),
              0
            ),
        isLoading: false,
        error: null
      });
    }

    loadScores().catch((error: unknown) => {
      if (!isMounted) return;
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
