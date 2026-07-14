"use client";

import type { ReactNode } from "react";
import { motion, useMotionTemplate } from "framer-motion";
import { useMagneticTilt } from "@/features/projects/hooks/useMagneticTilt";
import { brandColors } from "@/lib/brand";

interface CardGlassWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * The brand book's "Imponente Hover Card" shell: frosted glass, an
 * ultra-thin border, a large diffuse shadow for a floating feel, and a
 * magnetic rust → sage glow that tilts and trails the cursor. Shared by
 * every project card type — only the media/text inside changes.
 */
export default function CardGlassWrapper({
  children,
  className,
}: CardGlassWrapperProps) {
  const {
    containerRef,
    rotateX,
    rotateY,
    glowX,
    glowY,
    onPointerMove,
    onPointerLeave,
  } = useMagneticTilt();

  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, ${brandColors.rust} 0%, ${brandColors.sage} 55%, transparent 75%)`;

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`group relative [perspective:1200px] ${className ?? ""}`}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative h-full [transform-style:preserve-3d]"
      >
        <motion.div
          aria-hidden
          style={{ background: glowBackground }}
          className="pointer-events-none absolute -inset-4 rounded-[2rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        />

        <div className="relative h-full overflow-hidden rounded-3xl border border-silver/10 bg-obsidian/40 shadow-2xl shadow-obsidian/80 backdrop-blur-xl">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
