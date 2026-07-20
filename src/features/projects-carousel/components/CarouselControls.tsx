"use client";

import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
  /** WCAG 2.2.2: visible, explicit control over the autoplay motion. */
  onTogglePlay: () => void;
  isUserPaused: boolean;
  playLabel: string;
  pauseLabel: string;
  /** Rendered between the two arrows — the progress dashes. */
  children?: ReactNode;
}

const CIRCLE_BUTTON_CLASSNAME =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sand/20 text-sand transition-colors duration-300 hover:border-rust hover:text-rust focus-visible:border-rust focus-visible:outline-none";

/** The circular prev/next arrows flanking the progress dashes, plus the autoplay toggle. */
export default function CarouselControls({
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  onTogglePlay,
  isUserPaused,
  playLabel,
  pauseLabel,
  children,
}: CarouselControlsProps) {
  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={onPrev}
        aria-label={prevLabel}
        className={CIRCLE_BUTTON_CLASSNAME}
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      </button>
      {children}
      <button
        type="button"
        onClick={onNext}
        aria-label={nextLabel}
        className={CIRCLE_BUTTON_CLASSNAME}
      >
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isUserPaused ? playLabel : pauseLabel}
        aria-pressed={isUserPaused}
        className={`${CIRCLE_BUTTON_CLASSNAME} h-9 w-9`}
      >
        {isUserPaused ? (
          <Play aria-hidden="true" className="h-3.5 w-3.5" />
        ) : (
          <Pause aria-hidden="true" className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
