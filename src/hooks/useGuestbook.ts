import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  avatar: string | null;
  created_at: string;
}

export type SubmitState = "idle" | "loading" | "success" | "error";

const COOLDOWN_DURATION = 3600000;
const LAST_SUBMIT_KEY = "guestbook_last_submit";

export function useGuestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("guestbook")
      .select("id, name, message, avatar, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setFetchError("Could not load guestbook messages.");
      setLoading(false);
      return;
    }

    setEntries(data ?? []);
    setFetchError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();

    const lastSubmit = localStorage.getItem(LAST_SUBMIT_KEY);
    if (!lastSubmit) return;

    const lastSubmitTime = parseInt(lastSubmit, 10);
    const endTime = lastSubmitTime + COOLDOWN_DURATION;

    if (Date.now() < endTime) {
      setCooldownEnd(endTime);
    }
  }, [fetchEntries]);

  useEffect(() => {
    if (!cooldownEnd || submitError || Date.now() >= cooldownEnd) return;

    setSubmitState("success");
    const timer = setTimeout(() => {
      setSubmitState("idle");
    }, 3000);

    return () => clearTimeout(timer);
  }, [cooldownEnd, submitError]);

  const postEntry = useCallback(
    async (name: string, message: string, avatar: string) => {
      setSubmitState("loading");
      setSubmitError(null);

      try {
        const insertPayload = {
          name: name.trim(),
          message: message.trim(),
          avatar,
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("guestbook").insert([insertPayload]);

        if (error) {
          throw error;
        }

        const now = Date.now();
        localStorage.setItem(LAST_SUBMIT_KEY, String(now));
        setCooldownEnd(now + COOLDOWN_DURATION);

        await fetchEntries();
        setSubmitState("success");
      } catch (error: unknown) {
        console.error("Error posting entry:", error);
        const message = error instanceof Error ? error.message : "Could not send the message.";
        setSubmitError(message);
        setSubmitState("error");
      }
    },
    [fetchEntries],
  );

  return { entries, loading, submitState, fetchError, postEntry, cooldownEnd, submitError };
}
