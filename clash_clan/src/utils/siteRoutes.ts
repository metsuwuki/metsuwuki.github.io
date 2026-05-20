export function mainSitePath(): string {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_DEV_MAIN_URL ?? "http://127.0.0.1:5173/";
  }

  return "/";
}

export function animesitePath(): string {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_DEV_ANIMESITE_URL ?? "/animesite/";
  }

  return "/animesite/";
}
