const TAG_PATTERN = /^#[0289PYLQGRJCUV]+$/i;

export function normalizeClashTag(input: string): string {
  const compact = input.trim().toUpperCase().replace(/\s+/g, "");
  if (!compact) {
    return "";
  }

  return compact.startsWith("#") ? compact : `#${compact}`;
}

export function normalizeTag(input: string): string {
  return normalizeClashTag(input);
}

export function isLikelyClashTag(input: string): boolean {
  const normalized = normalizeClashTag(input);
  return TAG_PATTERN.test(normalized) && normalized.length >= 4;
}

export function encodeTag(tag: string): string {
  return encodeURIComponent(normalizeClashTag(tag));
}

export function displayApiError(reason: string, fallback = "Request failed"): string {
  const messages: Record<string, string> = {
    badRequest: "Invalid request.",
    invalidTag: "Tag looks invalid.",
    playerNotFound: "Player not found."
  };

  return messages[reason] ?? fallback;
}
