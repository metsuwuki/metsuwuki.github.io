import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const VISITOR_KEY = "metsuki_visitor_id";

function getOrCreateVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function usePageViews() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function track() {
      try {
        const visitorId = getOrCreateVisitorId();

        await supabase.from("visitors").upsert(
          { id: visitorId, last_seen: new Date().toISOString() },
          { onConflict: "id" }
        );

        const { count: total } = await supabase
          .from("visitors")
          .select("id", { count: "exact", head: true });

        if (active) {
          setCount(total ?? 0);
          setLoading(false);
        }
      } catch {
        if (active) setLoading(false);
      }
    }

    track();
    return () => { active = false; };
  }, []);

  return { count, loading };
}
