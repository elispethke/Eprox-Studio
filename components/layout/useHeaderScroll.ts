"use client";

import { useEffect, useState } from "react";

const DEFAULT_THRESHOLD = 80;

/**
 * Tracks whether the page has been scrolled past a threshold, so the
 * Header can transition from a transparent overlay to a frosted-glass bar.
 */
export function useHeaderScroll(threshold: number = DEFAULT_THRESHOLD) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
