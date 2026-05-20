function normalizeBase(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
}

export function withBasePath(pathname: string): string {
  if (/^https?:\/\//i.test(pathname) || pathname.startsWith("#")) {
    return pathname;
  }

  const base = normalizeBase(import.meta.env.BASE_URL);
  const cleanPath = pathname.replace(/^\/+/, "");
  return base === "/" ? `/${cleanPath}` : `${base}${cleanPath}`;
}

export function appPath(app: "animesite" | "clashClan" | "mineSweeper" | "breakBrick" | "lightFlow"): string {
  if (import.meta.env.DEV) {
    if (app === "clashClan") {
      return import.meta.env.VITE_DEV_CLASH_CLAN_URL ?? "http://127.0.0.1:5174/clash_clan/";
    }

    if (app === "mineSweeper") {
      return import.meta.env.VITE_DEV_MINE_SWEEPER_URL ?? "http://127.0.0.1:5175/mine_sweeper/";
    }

    if (app === "breakBrick") {
      return import.meta.env.VITE_DEV_BREAK_BRICK_URL ?? "http://127.0.0.1:5176/break_brick/";
    }

    if (app === "lightFlow") {
      return import.meta.env.VITE_DEV_LIGHT_FLOW_URL ?? "http://127.0.0.1:5177/light_flow/";
    }

    return import.meta.env.VITE_DEV_ANIMESITE_URL ?? withBasePath("animesite/");
  }

  if (app === "clashClan") {
    return withBasePath("clash_clan/");
  }

  if (app === "mineSweeper") {
    return withBasePath("mine_sweeper/");
  }

  if (app === "breakBrick") {
    return withBasePath("break_brick/");
  }

  if (app === "lightFlow") {
    return withBasePath("light_flow/");
  }

  return withBasePath("animesite/");
}
