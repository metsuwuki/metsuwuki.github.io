import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useMotionSettings(): { prefersReducedMotion: boolean } {
  const reducedMotion = useReducedMotion();
  const [isCompactScreen, setIsCompactScreen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 768px)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsCompactScreen(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return {
    prefersReducedMotion: Boolean(reducedMotion) || isCompactScreen
  };
}
