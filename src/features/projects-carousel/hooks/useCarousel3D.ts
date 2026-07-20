"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import type { CardTransform } from "../types";

interface UseCarousel3DOptions {
  itemCount: number;
  /** Horizontal distance between neighboring card centers, in px. */
  spacing?: number;
  /** Cards further than this many positions from center are fully faded out. */
  maxVisibleOffset?: number;
  autoPlay?: boolean;
  /** Delay between autoplay advances, in ms. */
  autoPlayInterval?: number;
}

interface CarouselTrackHandlers {
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
  onClickCapture: (event: MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onWheel: (event: WheelEvent<HTMLDivElement>) => void;
}

interface UseCarousel3DResult {
  /** Continuous track position in card units — cards derive their transforms from it via useTransform. */
  position: MotionValue<number>;
  /** Index of the card currently closest to center, normalized to [0, itemCount). */
  activeIndex: number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  /** Spread onto the draggable/focusable track element. */
  trackHandlers: CarouselTrackHandlers;
  /** Spread onto the hover/focus boundary (the whole section) to pause autoplay. */
  autoPlayPauseHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
  isDragging: boolean;
  /** True while the autoplay timer is actually running (enabled, not user-paused, motion allowed). */
  isAutoPlaying: boolean;
  /** WCAG 2.2.2 control: the visitor's explicit play/pause toggle. */
  toggleAutoPlay: () => void;
  /** Whether the visitor has explicitly paused (drives the button icon). */
  isUserPaused: boolean;
}

const SPRING = {
  type: "spring",
  stiffness: 210,
  damping: 30,
  mass: 0.9,
} as const;
/** Pointer travel (px) below which a gesture on the track still counts as a click. */
const CLICK_DRAG_THRESHOLD = 8;

const DEFAULT_SPACING = 300;
const MAX_VISIBLE_OFFSET = 3;

/** Shortest signed distance from the active position to `raw`, wrapped onto (-n/2, n/2] so the ring has no seam. */
export function wrapOffset(raw: number, itemCount: number): number {
  const half = itemCount / 2;
  return ((((raw + half) % itemCount) + itemCount) % itemCount) - half;
}

/** Physical dimensions of the showcase rig, all derived from the focused card's width. */
export interface CarouselMetrics {
  centerWidth: number;
  centerHeight: number;
  sideWidth: number;
  sideHeight: number;
  /** Distance from track center to the first side card's center, in px. */
  sideX: number;
  /** Additional x per step beyond the first side card, in px. */
  sideStep: number;
}

export function buildCarouselMetrics(centerWidth: number): CarouselMetrics {
  const centerHeight = Math.round(centerWidth * 0.92);
  return {
    centerWidth,
    centerHeight,
    // Focused card is ~2x the side cards once the sides' scale and depth
    // shrink are applied on top of this base width.
    sideWidth: Math.round(centerWidth * 0.6),
    sideHeight: Math.round(centerHeight * 0.9),
    sideX: Math.round(centerWidth * 0.74),
    sideStep: Math.round(centerWidth * 0.32),
  };
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * Math.min(Math.max(t, 0), 1);
}

/**
 * Pure index→visual mapping for the showcase rig: each card's placement is a
 * function of nothing but its (fractional) offset from the focused slot.
 * Depth is real — cards recede on translateZ under a shared perspective, turn
 * inward on rotateY, dim (brightness), soften (blur) and narrow (the focused
 * card is ~2x the side cards' width). Kept separate from the hook so the
 * visual layer can derive per-frame transforms with useTransform without
 * re-rendering.
 */
export function computeCardTransform(
  offset: number,
  metrics: CarouselMetrics
): CardTransform {
  const distance = Math.abs(offset);
  const direction = Math.sign(offset);
  // 0→1 over the center→first-side transition; side cards hold these values.
  const u = Math.min(distance, 1);
  const beyond = Math.max(distance - 1, 0);

  const x = direction * (lerp(0, metrics.sideX, u) + beyond * metrics.sideStep);
  const z = -distance * 230;
  const rotateY = -direction * (lerp(0, 30, u) + Math.min(beyond * 4, 8));
  const scale = lerp(1, 0.86, u) * (1 - Math.min(beyond, 2) * 0.05);
  const width = lerp(metrics.centerWidth, metrics.sideWidth, u);
  const height = lerp(metrics.centerHeight, metrics.sideHeight, u);

  const opacity =
    distance >= MAX_VISIBLE_OFFSET
      ? 0
      : distance <= 1
        ? lerp(1, 0.8, u)
        : lerp(0.8, 0, (distance - 1) / (MAX_VISIBLE_OFFSET - 1));
  const zIndex = Math.round((MAX_VISIBLE_OFFSET + 1 - distance) * 10);
  const blur = Math.min(distance * 1.7, 5);
  const brightness = 1 - Math.min(distance, 2) * 0.19;
  const shadowOpacity = Math.max(0.55 - distance * 0.18, 0.12);

  return {
    x,
    z,
    scale,
    rotateY,
    width,
    height,
    opacity,
    zIndex,
    blur,
    brightness,
    shadowOpacity,
  };
}

/**
 * State + gesture engine for the 3D coverflow carousel. Owns a continuous
 * `position` motion value (in card units, unbounded — offsets wrap), and
 * moves it with a spring on arrows/keyboard/click, or 1:1 during drag.
 * Under prefers-reduced-motion the spring is skipped (position snaps) and
 * autoplay is disabled.
 */
export function useCarousel3D({
  itemCount,
  spacing = DEFAULT_SPACING,
  autoPlay = false,
  autoPlayInterval = 2000,
}: UseCarousel3DOptions): UseCarousel3DResult {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const position = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);

  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartPositionRef = useRef(0);
  const dragTravelRef = useRef(0);
  const isDraggingRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const wheelCooldownRef = useRef(0);

  useEffect(() => {
    return position.on("change", (p) => {
      const normalized = ((Math.round(p) % itemCount) + itemCount) % itemCount;
      setActiveIndex(normalized);
    });
  }, [position, itemCount]);

  const settleTo = useCallback(
    (target: number) => {
      animationRef.current?.stop();
      if (prefersReducedMotion) {
        position.set(target);
        return;
      }
      animationRef.current = animate(position, target, SPRING);
    },
    [position, prefersReducedMotion]
  );

  const next = useCallback(() => {
    settleTo(Math.round(position.get()) + 1);
  }, [position, settleTo]);

  const prev = useCallback(() => {
    settleTo(Math.round(position.get()) - 1);
  }, [position, settleTo]);

  const goTo = useCallback(
    (index: number) => {
      const current = Math.round(position.get());
      const currentIndex = ((current % itemCount) + itemCount) % itemCount;
      // Travel the short way around the ring, not through zero.
      settleTo(current + wrapOffset(index - currentIndex, itemCount));
    },
    [position, itemCount, settleTo]
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      animationRef.current?.stop();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStartXRef.current = event.clientX;
      dragStartPositionRef.current = position.get();
      dragTravelRef.current = 0;
      isDraggingRef.current = true;
      setIsDragging(true);
    },
    [position]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const deltaX = event.clientX - dragStartXRef.current;
      dragTravelRef.current = Math.max(dragTravelRef.current, Math.abs(deltaX));
      position.set(dragStartPositionRef.current - deltaX / spacing);
    },
    [position, spacing]
  );

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    settleTo(Math.round(position.get()));
  }, [position, settleTo]);

  const onClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
    // A real drag should not also fire the card's click/navigation.
    if (dragTravelRef.current > CLICK_DRAG_THRESHOLD) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // "Left"/"Right" are the legacy pre-standard names some engines emit.
      if (event.key === "ArrowRight" || event.key === "Right") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft" || event.key === "Left") {
        event.preventDefault();
        prev();
      }
    },
    [next, prev]
  );

  // Horizontal wheel/trackpad support: swipes with a clear horizontal intent
  // advance the ring; vertical scrolling passes through untouched.
  const onWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const now = performance.now();
      if (now < wheelCooldownRef.current) return;
      wheelAccumulatorRef.current += event.deltaX;
      if (Math.abs(wheelAccumulatorRef.current) > 60) {
        settleTo(
          Math.round(position.get()) + Math.sign(wheelAccumulatorRef.current)
        );
        wheelAccumulatorRef.current = 0;
        wheelCooldownRef.current = now + 450;
      }
    },
    [position, settleTo]
  );

  const isAutoPlaying =
    autoPlay && !prefersReducedMotion && !isUserPaused && !isPaused;

  const toggleAutoPlay = useCallback(() => {
    setIsUserPaused((paused) => !paused);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      if (!isDraggingRef.current) {
        settleTo(Math.round(position.get()) + 1);
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, position, settleTo]);

  useEffect(() => {
    return () => animationRef.current?.stop();
  }, []);

  return {
    position,
    activeIndex,
    goTo,
    next,
    prev,
    trackHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
      onKeyDown,
      onWheel,
    },
    autoPlayPauseHandlers: {
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => setIsPaused(false),
      onFocus: () => setIsPaused(true),
      onBlur: () => setIsPaused(false),
    },
    isDragging,
    isAutoPlaying,
    toggleAutoPlay,
    isUserPaused,
  };
}
