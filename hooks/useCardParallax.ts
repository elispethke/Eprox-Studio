"use client";

import { useRef, type PointerEvent, type RefObject } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

interface UseCardParallaxOptions {
  /** Max travel, in pixels, the image shifts opposite the pointer. */
  strength?: number;
}

interface UseCardParallaxResult {
  containerRef: RefObject<HTMLDivElement | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
}

const DEFAULT_STRENGTH = 10;
const SPRING = { stiffness: 150, damping: 20, mass: 0.5 };

/**
 * Tracks pointer position within a frame and derives a small spring-eased
 * offset so the image inside drifts opposite the cursor — a subtle depth
 * cue independent of any outer tilt applied to the frame itself.
 */
export function useCardParallax({
  strength = DEFAULT_STRENGTH,
}: UseCardParallaxOptions = {}): UseCardParallaxResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    rawX.set(-relativeX * strength);
    rawY.set(-relativeY * strength);
  };

  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { containerRef, x, y, onPointerMove, onPointerLeave };
}
