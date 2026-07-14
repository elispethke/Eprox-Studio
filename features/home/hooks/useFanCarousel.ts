"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { PanInfo } from "framer-motion";

interface UseFanCarouselOptions {
  itemCount: number;
}

interface FanCardTransform {
  x: number;
  rotate: number;
  scale: number;
  zIndex: number;
  opacity: number;
}

interface UseFanCarouselResult {
  /** Attach to the wheel-driven surface; wheel is captured natively so it
   * can be prevented (React's synthetic wheel listener is passive). */
  containerRef: RefObject<HTMLDivElement | null>;
  activeIndex: number;
  goTo: (index: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  getTransform: (distanceFromActive: number) => FanCardTransform;
  onDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => void;
}

const STEP_ROTATION = 8;
const MAX_ROTATION = 24;
const STEP_OFFSET_X = 150;
const STEP_SCALE = 0.14;
const MIN_SCALE = 0.6;
const VISIBLE_DISTANCE = 3;
const WHEEL_THRESHOLD = 60;
const DRAG_THRESHOLD = 80;
const STEP_LOCK_MS = 500;

/**
 * Computes the fan carousel's active index and derives each card's
 * position/rotation/scale/z-index from its distance to it. Wheel and drag
 * gestures both resolve to index changes; the component only renders
 * whatever `getTransform` returns.
 */
export function useFanCarousel({
  itemCount,
}: UseFanCarouselOptions): UseFanCarouselResult {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelAccumulator = useRef(0);
  const isLocked = useRef(false);

  const clampIndex = useCallback(
    (index: number) => Math.min(Math.max(index, 0), itemCount - 1),
    [itemCount],
  );

  const lockBriefly = useCallback(() => {
    isLocked.current = true;
    window.setTimeout(() => {
      isLocked.current = false;
    }, STEP_LOCK_MS);
  }, []);

  const goTo = useCallback(
    (index: number) => setActiveIndex(clampIndex(index)),
    [clampIndex],
  );

  const goToNext = useCallback(
    () => setActiveIndex((current) => clampIndex(current + 1)),
    [clampIndex],
  );

  const goToPrev = useCallback(
    () => setActiveIndex((current) => clampIndex(current - 1)),
    [clampIndex],
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      // Lenis listens for wheel on window; without this, scrolling over the
      // carousel would also smooth-scroll the page while cycling cards.
      event.stopPropagation();
      if (isLocked.current) return;

      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      wheelAccumulator.current += delta;

      if (wheelAccumulator.current > WHEEL_THRESHOLD) {
        goToNext();
        wheelAccumulator.current = 0;
        lockBriefly();
      } else if (wheelAccumulator.current < -WHEEL_THRESHOLD) {
        goToPrev();
        wheelAccumulator.current = 0;
        lockBriefly();
      }
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [goToNext, goToPrev, lockBriefly]);

  const onDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x < -DRAG_THRESHOLD) {
      goToNext();
    } else if (info.offset.x > DRAG_THRESHOLD) {
      goToPrev();
    }
  };

  const getTransform = (distanceFromActive: number): FanCardTransform => {
    const absDistance = Math.abs(distanceFromActive);
    const direction = Math.sign(distanceFromActive);

    return {
      x: direction * absDistance * STEP_OFFSET_X,
      rotate: direction * Math.min(absDistance * STEP_ROTATION, MAX_ROTATION),
      scale: Math.max(1 - absDistance * STEP_SCALE, MIN_SCALE),
      zIndex: itemCount - absDistance,
      opacity: absDistance > VISIBLE_DISTANCE ? 0 : 1,
    };
  };

  return {
    containerRef,
    activeIndex,
    goTo,
    goToNext,
    goToPrev,
    canGoNext: activeIndex < itemCount - 1,
    canGoPrev: activeIndex > 0,
    getTransform,
    onDragEnd,
  };
}
