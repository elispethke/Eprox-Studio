"use client";

import { useCallback } from "react";
import { useLenis } from "@/shared/components/layout/LenisProvider";

/** Clearance for the fixed header so section tops aren't hidden under it. */
const HEADER_OFFSET = -80;
const DURATION_S = 1.15;

/**
 * Returns a function that smooth-scrolls to an in-page anchor ("#vision").
 * Drives Lenis directly — letting the browser's native hash jump race
 * Lenis's eased position makes long scrolls crawl. Falls back to native
 * smooth scrollIntoView when Lenis is off (prefers-reduced-motion).
 */
export function useAnchorScroll() {
  const lenis = useLenis();

  return useCallback(
    (hash: string) => {
      const element = document.querySelector<HTMLElement>(hash);
      if (!element) return;

      if (lenis) {
        lenis.scrollTo(element, { offset: HEADER_OFFSET, duration: DURATION_S });
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      window.history.pushState(null, "", hash);
    },
    [lenis],
  );
}
