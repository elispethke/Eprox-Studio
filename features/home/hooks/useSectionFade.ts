"use client";

import { useRef, type RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

interface UseSectionFadeResult {
  /** Attach to the sticky section itself — its own scroll progress drives the fade. */
  ref: RefObject<HTMLElement | null>;
  /** Bind to `style.opacity` on the same section. */
  opacity: MotionValue<number>;
}

const FADE_OUT_OPACITY = 0.35;

/**
 * Crossfades a sticky section out as the next one slides up over it.
 * Tracks the section's own scroll progress from the moment it reaches the
 * top of the viewport to the moment it's fully covered, so the dissolve
 * stays 1:1 with scroll position — no scale or translateY, no spacer.
 */
export function useSectionFade(): UseSectionFadeResult {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, FADE_OUT_OPACITY]);

  return { ref, opacity };
}
