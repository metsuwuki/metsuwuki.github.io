import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest } from "../lib/api";

export interface GuestbookEntry { id: string; name: string; message: string; avatar: string | null; created_at: string; }
type GuestbookPage = { entries: GuestbookEntry[]; nextCursor: string | null };
export type SubmitState = "idle" | "loading" | "success" | "error";

const COOLDOWN_DURATION = 3_600_000;
const LAST_SUBMIT_KEY = "guestbook_last_submit";

export function useGuestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchEntries = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    try {
      const page = await apiRequest<GuestbookPage>("/api/guestbook?limit=20", {}, controller.signal);
      setEntries(page.entries);
      setNextCursor(page.nextCursor);
      setFetchError(null);
    } catch (error) {
      if (!controller.signal.aborted) setFetchError(error instanceof Error ? error.message : "Не удалось загрузить сообщения.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEntries();
    const lastSubmit = Number(localStorage.getItem(LAST_SUBMIT_KEY));
    const endTime = lastSubmit + COOLDOWN_DURATION;
    if (lastSubmit && Date.now() < endTime) setCooldownEnd(endTime);
    return () => controllerRef.current?.abort();
  }, [fetchEntries]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await apiRequest<GuestbookPage>(`/api/guestbook?limit=20&cursor=${encodeURIComponent(nextCursor)}`);
      setEntries((current) => [...current, ...page.entries]);
      setNextCursor(page.nextCursor);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Не удалось загрузить сообщения.");
    } finally { setLoadingMore(false); }
  }, [loadingMore, nextCursor]);

  const postEntry = useCallback(async (name: string, message: string, avatar: string, turnstileToken: string) => {
    setSubmitState("loading");
    setSubmitError(null);
    try {
      const result = await apiRequest<{ entry: GuestbookEntry }>("/api/guestbook", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), message: message.trim(), avatar, turnstileToken }),
      });
      setEntries((current) => [result.entry, ...current]);
      const now = Date.now();
      localStorage.setItem(LAST_SUBMIT_KEY, String(now));
      setCooldownEnd(now + COOLDOWN_DURATION);
      setSubmitState("success");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Не удалось отправить сообщение.");
      setSubmitState("error");
      throw error;
    }
  }, []);

  return { entries, loading, loadingMore, nextCursor, submitState, fetchError, fetchEntries, loadMore, postEntry, cooldownEnd, submitError };
}
