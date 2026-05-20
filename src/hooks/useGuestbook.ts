import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export type SubmitState = "idle" | "loading" | "success" | "error";

const COOLDOWN_DURATION = 3600000; // 1 час в миллисекундах
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
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setFetchError("Не удалось загрузить сообщения.");
    } else {
      setEntries(data ?? []);
      setFetchError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
    
    // Проверяем, есть ли активный cooldown
    const lastSubmit = localStorage.getItem(LAST_SUBMIT_KEY);
    if (lastSubmit) {
      const lastSubmitTime = parseInt(lastSubmit, 10);
      const now = Date.now();
      const endTime = lastSubmitTime + COOLDOWN_DURATION;
      
      if (now < endTime) {
        setCooldownEnd(endTime);
      }
    }
  }, [fetchEntries]);

  // Отслеживаем окончание cooldown и показываем сообщение об успехе на 3 сек
  useEffect(() => {
    if (!cooldownEnd) return;

    const now = Date.now();
    if (now < cooldownEnd) {
      // Если нет ошибки - это успешная отправка, показываем "success" на 3 сек
      if (!submitError) {
        setSubmitState("success");
        const timer = setTimeout(() => {
          setSubmitState("idle");
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [cooldownEnd]);

    const postEntry = useCallback(
      async (name: string, message: string) => {
        setSubmitState("loading");
        setSubmitError(null);

        try {
          const { error } = await supabase
            .from("guestbook")
            .insert([
              {
                name: name.trim(),
                message: message.trim(),
                created_at: new Date().toISOString(),
              },
            ]);

          if (error) {
            throw error;
          }

          const now = Date.now();
          localStorage.setItem(LAST_SUBMIT_KEY, String(now));

          const endTime = now + COOLDOWN_DURATION;
          setCooldownEnd(endTime);

          await fetchEntries();
          setSubmitState("success");
        } catch (error: any) {
          console.error("Error posting entry:", error);
          setSubmitError(error?.message || "Ошибка при отправке сообщения");
          setSubmitState("error");
        }
      },
    [fetchEntries]
  );

  return { entries, loading, submitState, fetchError, postEntry, cooldownEnd, submitError };
}
