import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const VISITOR_KEY = "kagami_visitor_id";
const SESSION_KEY = "kagami_session_id";
const SESSION_STARTED_KEY = "kagami_session_started";
type AnalyticsSummary = { uniqueVisitors: number };

function getStableId(key: string, storage: Storage): string {
  let id = storage.getItem(key);
  if (!id) { id = crypto.randomUUID(); storage.setItem(key, id); }
  return id;
}

function getSessionId(): string {
  const started = Number(sessionStorage.getItem(SESSION_STARTED_KEY));
  if (!started || Date.now() - started > 30 * 60_000) {
    sessionStorage.setItem(SESSION_KEY, crypto.randomUUID());
    sessionStorage.setItem(SESSION_STARTED_KEY, String(Date.now()));
  }
  return getStableId(SESSION_KEY, sessionStorage);
}

export function usePageViews() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function track() {
      try {
        await apiRequest("/api/analytics/visit", { method: "POST", body: JSON.stringify({
          visitorId: getStableId(VISITOR_KEY, localStorage), sessionId: getSessionId(), path: window.location.pathname,
        }) }, controller.signal);
        const summary = await apiRequest<AnalyticsSummary>("/api/analytics/summary", {}, controller.signal);
        setCount(summary.uniqueVisitors);
      } catch { /* Unknown remains null; no invented fallback values. */ }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void track();
    return () => controller.abort();
  }, []);

  return { count, loading };
}
