import { useEffect, useMemo, useState } from "react";

type TypewriterTextProps = {
  className?: string;
  phrases: string[];
  prefix: string;
  reducedMotion?: boolean;
};

const TYPE_DELAY = 46;
const ERASE_DELAY = 24;
const HOLD_DELAY = 1750;

export function TypewriterText({ className, phrases, prefix, reducedMotion = false }: TypewriterTextProps) {
  const safePhrases = useMemo(() => phrases.filter(Boolean), [phrases]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  const currentPhrase = safePhrases[phraseIndex] ?? "";

  useEffect(() => {
    if (reducedMotion || safePhrases.length <= 1) {
      setVisibleCount(currentPhrase.length);
      return undefined;
    }

    const isComplete = visibleCount === currentPhrase.length;
    const isEmpty = visibleCount === 0;
    const delay = isComplete && !isErasing ? HOLD_DELAY : isErasing ? ERASE_DELAY : TYPE_DELAY;

    const timeout = window.setTimeout(() => {
      if (!isErasing && isComplete) {
        setIsErasing(true);
        return;
      }

      if (isErasing && isEmpty) {
        setIsErasing(false);
        setPhraseIndex((index) => (index + 1) % safePhrases.length);
        return;
      }

      setVisibleCount((count) => count + (isErasing ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [currentPhrase, isErasing, reducedMotion, safePhrases.length, visibleCount]);

  const suffix = reducedMotion ? currentPhrase : currentPhrase.slice(0, visibleCount);

  return (
    <span className={className} aria-label={`${prefix}${suffix}`}>
      <span>{prefix}</span>
      <span className="typewriter-text__dynamic">{suffix}</span>
      {!reducedMotion ? <span className="typewriter-text__cursor" aria-hidden="true" /> : null}
    </span>
  );
}
