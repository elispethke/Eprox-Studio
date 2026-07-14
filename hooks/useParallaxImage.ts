"use client";

import { useRef, type RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

interface UseParallaxImageOptions {
  /** Max vertical travel, in pixels, across the container's scroll range. */
  offset?: number;
}

interface UseParallaxImageResult {
  /** Attach to the element whose scroll progress drives the parallax. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Bind to `style.y` on the element that should drift. */
  y: MotionValue<number>;
}

const DEFAULT_OFFSET = 40;

/**
 * Derives a vertical offset from a container's scroll progress so an
 * image can drift at a slightly different speed than its surrounding
 * content. Kept independent of any single section so both Our Vision
 * and Foundation can reuse it with different offsets.
 */
export function useParallaxImage({
  offset = DEFAULT_OFFSET,
}: UseParallaxImageOptions = {}): UseParallaxImageResult {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return { containerRef, y };
}
