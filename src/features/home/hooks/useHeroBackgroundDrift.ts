"use client";

import type { RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

interface UseHeroBackgroundDriftResult {
  /** Bind to `style.opacity` on the Hero's background layer. */
  opacity: MotionValue<number>;
  /** Bind to `style.y` on the same layer. */
  y: MotionValue<number>;
}

const RISE_DISTANCE = 140;

/**
 * Fades and lifts the Hero's decorative background (flow lines + glow orb)
 * as the section scrolls away, so the light reads as rising and dissolving
 * rather than sitting static while the text crossfades on top of it.
 * Shares the Hero section ref with useSectionFade — that hook stays
 * opacity-only by design, this one adds the upward drift on a second,
 * independent useScroll targeting the same element.
 */
export function useHeroBackgroundDrift(
  target: RefObject<HTMLElement | null>,
): UseHeroBackgroundDriftResult {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -RISE_DISTANCE]);

  return { opacity, y };
}
