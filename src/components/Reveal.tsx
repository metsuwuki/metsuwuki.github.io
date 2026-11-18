import type { ReactNode } from "react";
import { m } from "framer-motion";
import { getRevealProps, supportsViewTimeline } from "../utils/motion";

type RevealProps = {
  as?: "div" | "article";
  className?: string;
  delay?: number;
  prefersReducedMotion: boolean;
  children: ReactNode;
};

/**
 * Fades an element in as it scrolls into view. Where the browser supports
 * native scroll-driven animations (`animation-timeline: view()`), this is
 * plain CSS running on the compositor thread with zero JS involvement.
 * Otherwise it falls back to the existing framer-motion whileInView path.
 * Not meant for staggered multi-child choreography — keep framer-motion
 * (variants + staggerChildren) for that.
 */
export function Reveal({ as = "div", className, delay = 0, prefersReducedMotion, children }: RevealProps) {
  if (!prefersReducedMotion && supportsViewTimeline()) {
    const nativeClassName = className ? `${className} reveal-on-view` : "reveal-on-view";
    const style = delay ? { animationDelay: `${delay}s` } : undefined;

    if (as === "article") {
      return (
        <article className={nativeClassName} style={style}>
          {children}
        </article>
      );
    }
    return (
      <div className={nativeClassName} style={style}>
        {children}
      </div>
    );
  }

  const revealProps = getRevealProps(prefersReducedMotion, delay);
  if (as === "article") {
    return (
      <m.article className={className} {...revealProps}>
        {children}
      </m.article>
    );
  }
  return (
    <m.div className={className} {...revealProps}>
      {children}
    </m.div>
  );
}
