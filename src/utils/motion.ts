import type { HTMLMotionProps } from "framer-motion";

type RevealProps = Pick<
  HTMLMotionProps<"div">,
  "animate" | "initial" | "whileInView" | "viewport" | "transition"
>;

export function getRevealProps(prefersReducedMotion: boolean, delay = 0): RevealProps {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 1, y: 0 }
    };
  }

  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
      delay
    }
  };
}
