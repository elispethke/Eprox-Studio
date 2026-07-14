"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCardParallax } from "@/hooks/useCardParallax";

interface BrowserFrameProps {
  src: string;
  alt: string;
  className?: string;
  /** Set false when nesting inside another frame that supplies its own border/shadow. */
  bordered?: boolean;
  /** "system" swaps the chrome accent to sage, distinguishing dashboard/system captures from marketing sites. */
  variant?: "web" | "system";
}

const CHROME_DOT_CLASSNAME_WEB = "h-2 w-2 rounded-full bg-sand/15";
const CHROME_DOT_CLASSNAME_SYSTEM = "h-2 w-2 rounded-full bg-sage/50";

export default function BrowserFrame({
  src,
  alt,
  className,
  bordered = true,
  variant = "web",
}: BrowserFrameProps) {
  const { containerRef, x, y, onPointerMove, onPointerLeave } =
    useCardParallax();

  const frameClassName = bordered
    ? "border border-silver/10 shadow-2xl shadow-obsidian/60"
    : "";
  const chromeDotClassName =
    variant === "system" ? CHROME_DOT_CLASSNAME_SYSTEM : CHROME_DOT_CLASSNAME_WEB;

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl bg-obsidian ${frameClassName} ${className ?? ""}`}
    >
      <div className="flex shrink-0 items-center gap-1.5 border-b border-silver/10 bg-obsidian px-4 py-3">
        <span className={chromeDotClassName} />
        <span className={chromeDotClassName} />
        <span className={chromeDotClassName} />
        <div className="ml-3 h-3 w-2/3 max-w-40 rounded-full bg-sand/5" />
      </div>

      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative flex-1 overflow-hidden"
      >
        <motion.div style={{ x, y }} className="absolute -inset-2">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 33vw, 90vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}
