import { useEffect, useRef, useState, type MouseEvent } from "react";

type GlassActionButtonProps = {
  href: string;
  label: string;
  processingLabel: string;
  variant?: "download" | "buy";
};

function DownloadGlyph() {
  return (
    <svg className="glass-action-btn__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.25v11.5m0 0-3.75-3.75M12 14.75l3.75-3.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.25 16.25v2a2.5 2.5 0 0 0 2.5 2.5h10.5a2.5 2.5 0 0 0 2.5-2.5v-2" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg className="glass-action-btn__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.75 12.75 5 5 9.5-11" />
    </svg>
  );
}

function MoneyGlyph() {
  return (
    <svg className="glass-action-btn__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2.75" y="6" width="18.5" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" d="M5.5 9v0M18.5 15v0" />
    </svg>
  );
}

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <span
          key={index}
          className={char === " " ? "glass-action-btn__letter glass-action-btn__letter--space" : "glass-action-btn__letter"}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </>
  );
}

/**
 * Glassmorphism action button — adapted from a Uiverse "Generate" button
 * (inset/outset shadow layers, per-letter hover shimmer, focus-triggered
 * text swap) into a Download/Buy link for the app cards. Same shadow
 * mechanics and timings as the source component; only the icon, copy, and
 * icon animation are swapped to fit "download" instead of "generate". Glow
 * colors are a fixed amethyst→violet→blue→white gradient (styles.css) for
 * every instance — no per-button hue.
 */
export function GlassActionButton({ href, label, processingLabel, variant = "download" }: GlassActionButtonProps) {
  const [downloaded, setDownloaded] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
    setDownloaded(true);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setDownloaded(false), 1800);
  }

  return (
    <div className="glass-action-btn-wrapper">
      <a
        className={`glass-action-btn${downloaded ? " is-downloaded" : ""}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={handleClick}
      >
        {downloaded ? <CheckGlyph /> : variant === "buy" ? <MoneyGlyph /> : <DownloadGlyph />}
        <span className="glass-action-btn__txt-wrapper">
          <span className="glass-action-btn__txt-1">
            <Letters text={label} />
          </span>
          <span className="glass-action-btn__txt-2">
            <Letters text={processingLabel} />
          </span>
        </span>
        <span className="glass-action-btn__progress" aria-hidden="true" />
      </a>
    </div>
  );
}
