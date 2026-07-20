"use client";

import { useCallback, type PointerEvent } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";

interface UseMagneticResult {
  /** Bind to `style.x` / `style.y` on a motion element. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Spread onto the same element. */
  handlers: {
    onPointerMove: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave: () => void;
  };
}

const SPRING = { stiffness: 260, damping: 18, mass: 0.5 };

/**
 * Subtle magnetic hover: the element leans toward the cursor while hovered
 * and springs back on leave. `strength` scales how far it follows (0–1),
 * `maxOffset` caps the travel in px. Inert under prefers-reduced-motion.
 */
export function useMagnetic(strength = 0.35, maxOffset = 8): UseMagneticResult {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const deltaX =
        (event.clientX - (bounds.left + bounds.width / 2)) * strength;
      const deltaY =
        (event.clientY - (bounds.top + bounds.height / 2)) * strength;
      rawX.set(Math.max(Math.min(deltaX, maxOffset), -maxOffset));
      rawY.set(Math.max(Math.min(deltaY, maxOffset), -maxOffset));
    },
    [prefersReducedMotion, strength, maxOffset, rawX, rawY]
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { x, y, handlers: { onPointerMove, onPointerLeave } };
}
