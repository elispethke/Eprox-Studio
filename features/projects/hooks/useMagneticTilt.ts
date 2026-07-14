"use client";

import { useRef, type PointerEvent, type RefObject } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

interface UseMagneticTiltOptions {
  /** Max rotation, in degrees, applied on each axis at the card's edge. */
  maxRotation?: number;
}

interface UseMagneticTiltResult {
  containerRef: RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  /** Pointer position as a 0-100 percentage, for a glow that trails the cursor. */
  glowX: MotionValue<number>;
  glowY: MotionValue<number>;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
}

const DEFAULT_MAX_ROTATION = 10;
const SPRING = { stiffness: 200, damping: 20, mass: 0.6 };

/**
 * Drives the "Imponente Hover Card" magnetic-glass tilt: rotateX/rotateY
 * follow the pointer within the card, and glowX/glowY track it as a
 * percentage so a radial gradient can trail the cursor under the glass.
 */
export function useMagneticTilt({
  maxRotation = DEFAULT_MAX_ROTATION,
}: UseMagneticTiltOptions = {}): UseMagneticTiltResult {
  const containerRef = useRef<HTMLDivElement>(null);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawGlowX = useMotionValue(50);
  const rawGlowY = useMotionValue(50);

  const rotateX = useSpring(rawRotateX, SPRING);
  const rotateY = useSpring(rawRotateY, SPRING);
  const glowX = useSpring(rawGlowX, SPRING);
  const glowY = useSpring(rawGlowY, SPRING);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;

    rawRotateY.set((relativeX - 0.5) * maxRotation * 2);
    rawRotateX.set(-(relativeY - 0.5) * maxRotation * 2);
    rawGlowX.set(relativeX * 100);
    rawGlowY.set(relativeY * 100);
  };

  const onPointerLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawGlowX.set(50);
    rawGlowY.set(50);
  };

  return {
    containerRef,
    rotateX,
    rotateY,
    glowX,
    glowY,
    onPointerMove,
    onPointerLeave,
  };
}
