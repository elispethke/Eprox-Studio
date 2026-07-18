"use client";

import type { RefObject } from "react";
import {
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Scroll-linked vertical drift for one background layer. Give each layer a
 * different `distance` (or opposite signs) to get multi-plane depth — slower
 * far layers, faster near ones. Returns a MotionValue for `style.y`; frozen
 * at 0 under prefers-reduced-motion.
 */
export function useParallaxLayer(
  target: RefObject<HTMLElement | null>,
  distance = 80,
): MotionValue<number> {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });

  return useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [distance, -distance],
  );
}
