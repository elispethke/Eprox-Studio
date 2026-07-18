"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Tiny external store for the live Lenis instance — lets any client
// component read it (via useLenis) without threading context through the
// tree or setting React state synchronously inside the provider's effect.
let currentLenis: Lenis | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function publish(instance: Lenis | null) {
  currentLenis = instance;
  listeners.forEach((listener) => listener());
}

/** The live Lenis instance, or null under prefers-reduced-motion / before mount. */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    subscribe,
    () => currentLenis,
    () => null,
  );
}

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Drives global smooth scroll and keeps GSAP ScrollTrigger's internal clock
 * on the same tick as Lenis's — without this, pinned/scrubbed sections lag
 * a frame behind the eased scroll position. Skipped entirely under
 * prefers-reduced-motion so the browser falls back to native scroll.
 * The instance is published to useLenis so anchor links can drive
 * lenis.scrollTo directly — native hash jumps fight Lenis's internal
 * animated position and end up crawling to the target.
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const instance = new Lenis();
    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    publish(instance);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      publish(null);
    };
  }, []);

  return <>{children}</>;
}
