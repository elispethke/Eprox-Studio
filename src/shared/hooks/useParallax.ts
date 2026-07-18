"use client";

import { useEffect, useSyncExternalStore, type RefObject } from "react";
import {
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type ParallaxMode = "scroll" | "mouse" | "both";

interface UseParallaxOptions {
  /** Which input drives the motion. Defaults to "scroll". */
  mode?: ParallaxMode;
  /** Scroll parallax travel distance in px, applied to `y`. */
  scrollStrength?: number;
  /** Element whose scroll progress drives the scroll parallax; defaults to whole-page scroll. */
  scrollTarget?: RefObject<HTMLElement | null>;
  /** Mouse parallax translate range in px, applied to `x`/`y`. */
  mouseStrength?: number;
  /** Mouse parallax rotation range in degrees, applied to `rotateX`/`rotateY`. */
  mouseTiltStrength?: number;
  /** Element whose bounds normalize the cursor position; defaults to the viewport. */
  mouseTarget?: RefObject<HTMLElement | null>;
}

interface UseParallaxResult {
  /** Bind to `style.x`. */
  x: MotionValue<number>;
  /** Bind to `style.y`. */
  y: MotionValue<number>;
  /** Bind to `style.rotateX`, in degrees. */
  rotateX: MotionValue<number>;
  /** Bind to `style.rotateY`, in degrees. */
  rotateY: MotionValue<number>;
}

const SPRING = { stiffness: 120, damping: 20, mass: 0.6 };
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * Scroll- and/or mouse-driven parallax, expressed as spring-damped motion
 * values ready to bind to `style`. Both inputs are always tracked internally
 * — `mode` only decides which one(s) reach the output — so hook order stays
 * fixed regardless of the option and `mode` is safe to change at runtime.
 * Collapses to a static 0 under prefers-reduced-motion.
 */
export function useParallax({
  mode = "scroll",
  scrollStrength = 60,
  scrollTarget,
  mouseStrength = 16,
  mouseTiltStrength = 6,
  mouseTarget,
}: UseParallaxOptions = {}): UseParallaxResult {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const wantsMouse = mode === "mouse" || mode === "both";
  const wantsScroll = mode === "scroll" || mode === "both";
  const mouseActive = wantsMouse && !prefersReducedMotion;
  const scrollActive = wantsScroll && !prefersReducedMotion;

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, SPRING);
  const mouseY = useSpring(rawMouseY, SPRING);

  useEffect(() => {
    if (!mouseActive) return;

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = mouseTarget?.current?.getBoundingClientRect();
      const width = bounds?.width ?? window.innerWidth;
      const height = bounds?.height ?? window.innerHeight;
      const originX = bounds?.left ?? 0;
      const originY = bounds?.top ?? 0;

      const normalizedX = ((event.clientX - originX) / width) * 2 - 1; // -1..1
      const normalizedY = ((event.clientY - originY) / height) * 2 - 1;

      rawMouseX.set(normalizedX * mouseStrength);
      rawMouseY.set(normalizedY * mouseStrength);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseActive, mouseStrength, mouseTarget, rawMouseX, rawMouseY]);

  const { scrollYProgress } = useScroll(
    scrollTarget
      ? { target: scrollTarget, offset: ["start end", "end start"] }
      : undefined,
  );
  const scrollY = useTransform(
    scrollYProgress,
    [0, 1],
    [-scrollStrength, scrollStrength],
  );

  const x = useTransform(mouseX, (mx) => (mouseActive ? mx : 0));
  const y = useTransform(
    [scrollY, mouseY],
    ([sy, my]: number[]) =>
      (scrollActive ? sy : 0) + (mouseActive ? my : 0),
  );
  const rotateY = useTransform(mouseX, (mx) =>
    mouseActive ? (mx / mouseStrength) * mouseTiltStrength : 0,
  );
  const rotateX = useTransform(mouseY, (my) =>
    mouseActive ? (-my / mouseStrength) * mouseTiltStrength : 0,
  );

  return { x, y, rotateX, rotateY };
}
