export function getSupabaseErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const message = "message" in error ? String((error as { message?: unknown }).message ?? "") : "";
    const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
    const details = "details" in error ? String((error as { details?: unknown }).details ?? "") : "";
    const status = "status" in error ? Number((error as { status?: unknown }).status) : getStatusFromMessage(message);

    if (status === 401 || status === 403) {
      return "Supabase 401/403: key/RLS/GRANT problem.";
    }

    if (status === 404) {
      return "Supabase 404: wrong table/project URL.";
    }

    if (
      code === "42P01" ||
      message.includes("relation") && message.includes("does not exist") ||
      message.includes("Could not find the table") ||
      message.includes("schema cache")
    ) {
      return "Supabase tables are missing or schema cache is stale. Run clash_clan/supabase/schema.sql in Supabase SQL Editor, then refresh the page.";
    }

    if (code === "42501" || message.toLowerCase().includes("row-level security")) {
      return "Supabase RLS blocked this request. Check policies from clash_clan/supabase/schema.sql.";
    }

    if (message.includes("Failed to fetch")) {
      return "Failed to fetch: browser/network/CORS.";
    }

    if (message || details) {
      return [message, details].filter(Boolean).join(" ");
    }
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
}

function getStatusFromMessage(message: string): number | null {
  const match = message.match(/\b(?:REST|HTTP)\s+(\d{3})\b|^\s*(\d{3})\b/);
  const status = match?.[1] ?? match?.[2];
  return status ? Number(status) : null;
}

export function isSupabaseFetchError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "message" in error &&
      String((error as { message?: unknown }).message ?? "").includes("Failed to fetch")
  );
}

export function getErrorDebugDetails(error: unknown): string {
  const details: string[] = [];

  if (error && typeof error === "object") {
    if ("name" in error) {
      details.push(`name=${String((error as { name?: unknown }).name ?? "")}`);
    }

    if ("message" in error) {
      details.push(`message=${String((error as { message?: unknown }).message ?? "")}`);
    }
  }

  if (typeof navigator !== "undefined") {
    details.push(`online=${String(navigator.onLine)}`);
  }

  if (typeof window !== "undefined") {
    details.push(`origin=${window.location.origin}`);
  }

  return details.filter(Boolean).join(" | ");
}
