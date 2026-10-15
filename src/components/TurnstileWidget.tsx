import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

type Props = { onToken: (token: string) => void; resetKey: number };
const SCRIPT_ID = "cloudflare-turnstile-script";

export function TurnstileWidget({ onToken, resetKey }: Props) {
  const configuredSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim();
  const isLocalPreview = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const siteKey = configuredSiteKey ?? "";
  const elementRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const id = `turnstile-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!siteKey || isLocalPreview) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !elementRef.current || !window.turnstile || widgetRef.current) return;
      widgetRef.current = window.turnstile.render(elementRef.current, {
        sitekey: siteKey,
        theme: "dark",
        size: "flexible",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (window.turnstile) render();
    else if (existing) existing.addEventListener("load", render, { once: true });
    else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", render, { once: true });
      document.head.appendChild(script);
    }
    return () => {
      cancelled = true;
      if (widgetRef.current && window.turnstile) window.turnstile.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, [id, isLocalPreview, onToken, siteKey]);

  useEffect(() => {
    if (isLocalPreview) {
      onToken("local-development-bypass");
      return;
    }
    if (widgetRef.current && window.turnstile) {
      window.turnstile.reset(widgetRef.current);
      onToken("");
    }
  }, [isLocalPreview, onToken, resetKey]);

  if (isLocalPreview) return null;
  if (!siteKey) return <p className="guestbook-status guestbook-status--error">Turnstile не настроен для этого домена.</p>;
  return <div id={id} ref={elementRef} className="guestbook-turnstile" aria-label="Проверка защиты от ботов" />;
}
