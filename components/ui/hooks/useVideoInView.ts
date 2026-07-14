"use client";

import { useEffect, useRef, type RefObject } from "react";

interface UseVideoInViewResult {
  /** Attach to the element whose visibility gates playback. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Attach to the <video> element to play/pause. */
  videoRef: RefObject<HTMLVideoElement | null>;
}

const VIEWPORT_THRESHOLD = 0.5;

/**
 * Plays a card's looping preview video only while it's actually visible,
 * so app-card loops don't all autoplay at once on page load.
 */
export function useVideoInView(): UseVideoInViewResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: VIEWPORT_THRESHOLD },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return { containerRef, videoRef };
}
