"use client";

import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
  /** Rendered between the two arrows — the progress dashes. */
  children?: ReactNode;
}

const ARROW_BUTTON_CLASSNAME =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sand/20 text-sand transition-colors duration-300 hover:border-rust hover:text-rust focus-visible:border-rust focus-visible:outline-none";

/** The circular prev/next arrows flanking the progress dashes. */
export default function CarouselControls({
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  children,
}: CarouselControlsProps) {
  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={onPrev}
        aria-label={prevLabel}
        className={ARROW_BUTTON_CLASSNAME}
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      </button>
      {children}
      <button
        type="button"
        onClick={onNext}
        aria-label={nextLabel}
        className={ARROW_BUTTON_CLASSNAME}
      >
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
