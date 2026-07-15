import type { Variants } from "framer-motion";

interface UseTextRevealOptions {
  /** Delay, in seconds, before the first word starts revealing. */
  initialDelay?: number;
  /** Delay, in seconds, between each word's reveal. */
  staggerDelay?: number;
}

interface UseTextRevealResult {
  /** Wraps the split words; orchestrates the stagger via staggerChildren. */
  container: Variants;
  /** Applied to each word: fade-in with a subtle upward rise. */
  word: Variants;
  /** Applied to elements (e.g. the sub-headline) that reveal after the headline. */
  followUp: Variants;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Orchestrates a cinematic text reveal (opacity + subtle rise, staggered
 * per word) for use with `motion` components. Kept independent of any single
 * component so both the headline and any future editorial copy can reuse it.
 */
export function useTextReveal({
  initialDelay = 0.2,
  staggerDelay = 0.08,
}: UseTextRevealOptions = {}): UseTextRevealResult {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const word: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const followUp: Variants = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: EASE_OUT_EXPO,
        delay: initialDelay + 0.6,
      },
    },
  };

  return { container, word, followUp };
}
