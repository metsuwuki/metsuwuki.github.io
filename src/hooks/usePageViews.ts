import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const VISITOR_KEY = "metsuki_visitor_id";
const ANALYTICS_DAYS = 30;

export type PageViewPoint = {
  date: string;
  label: string;
  value: number;
};

function getOrCreateVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function buildEmptySeries(): PageViewPoint[] {
  const formatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  const today = new Date();

  return Array.from({ length: ANALYTICS_DAYS }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (ANALYTICS_DAYS - 1 - index));
    const key = date.toISOString().slice(0, 10);

    return {
      date: key,
      label: formatter.format(date),
      value: 0,
    };
  });
}

function aggregateMonthlyVisitors(rows: Array<{ last_seen: string | null }>): PageViewPoint[] {
  const series = buildEmptySeries();
  const counts = new Map(series.map((point) => [point.date, 0]));

  for (const row of rows) {
    if (!row.last_seen) continue;
    const date = new Date(row.last_seen);
    if (Number.isNaN(date.getTime())) continue;

    const key = date.toISOString().slice(0, 10);
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return series.map((point) => ({
    ...point,
    value: counts.get(point.date) ?? 0,
  }));
}

export function usePageViews() {
  const [count, setCount] = useState<number | null>(null);
  const [monthlySeries, setMonthlySeries] = useState<PageViewPoint[]>(() => buildEmptySeries());
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

        const since = new Date();
        since.setHours(0, 0, 0, 0);
        since.setDate(since.getDate() - (ANALYTICS_DAYS - 1));

        const { data: monthlyVisitors } = await supabase
          .from("visitors")
          .select("last_seen")
          .gte("last_seen", since.toISOString());

        if (active) {
          setCount(total ?? 0);
          setMonthlySeries(aggregateMonthlyVisitors(monthlyVisitors ?? []));
          setLoading(false);
        }
      } catch {
        if (active) setLoading(false);
      }
    }

    track();
    return () => { active = false; };
  }, []);

  return { count, monthlySeries, loading };
}
