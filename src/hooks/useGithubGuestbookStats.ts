import { useEffect, useState } from "react";

type UseGithubGuestbookStatsOptions = {
  repo: string;
  label: string;
};

type GuestbookStatsState = {
  uniqueVisitors: number | null;
  posts: number | null;
  loading: boolean;
  error: boolean;
};

type GithubIssue = {
  number: number;
  user?: { login?: string };
};

type GithubComment = {
  user?: { login?: string };
};

const CACHE_TTL_MS = 5 * 60 * 1000;

export function useGithubGuestbookStats({ repo, label }: UseGithubGuestbookStatsOptions): GuestbookStatsState {
  const [state, setState] = useState<GuestbookStatsState>({
    uniqueVisitors: null,
    posts: null,
    loading: true,
    error: false
  });

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const cacheKey = `guestbook-stats:${repo}:${label}`;
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
          const parsed = JSON.parse(cached) as {
            timestamp: number;
            uniqueVisitors: number;
            posts: number;
          };

          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            if (active) {
              setState({
                uniqueVisitors: parsed.uniqueVisitors,
                posts: parsed.posts,
                loading: false,
                error: false
              });
            }
            return;
          }
        }

        const issuesResponse = await fetch(
          `https://api.github.com/repos/${repo}/issues?state=all&labels=${encodeURIComponent(label)}&per_page=20`
        );

        if (!issuesResponse.ok) {
          throw new Error("Failed to fetch guestbook issues");
        }

        const issues = (await issuesResponse.json()) as GithubIssue[];
        const userSet = new Set<string>();
        let posts = 0;

        for (const issue of issues) {
          if (issue.user?.login) {
            userSet.add(issue.user.login);
            posts += 1;
          }

          const commentsResponse = await fetch(
            `https://api.github.com/repos/${repo}/issues/${issue.number}/comments?per_page=100`
          );

          if (!commentsResponse.ok) {
            continue;
          }

          const comments = (await commentsResponse.json()) as GithubComment[];
          posts += comments.length;

          for (const comment of comments) {
            if (comment.user?.login) {
              userSet.add(comment.user.login);
            }
          }
        }

        const result = {
          timestamp: Date.now(),
          uniqueVisitors: userSet.size,
          posts
        };

        sessionStorage.setItem(cacheKey, JSON.stringify(result));

        if (active) {
          setState({
            uniqueVisitors: result.uniqueVisitors,
            posts: result.posts,
            loading: false,
            error: false
          });
        }
      } catch {
        if (active) {
          setState({ uniqueVisitors: null, posts: null, loading: false, error: true });
        }
      }
    }

    void loadStats();

    return () => {
      active = false;
    };
  }, [label, repo]);

  return state;
}