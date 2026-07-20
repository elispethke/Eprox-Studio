"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/shared/components/layout/LenisProvider";
import { useMagnetic } from "@/shared/hooks/useMagnetic";

interface BackToTopButtonProps {
  label: string;
}

/** Discreet circular back-to-top control — Lenis-smooth, magnetic on hover. */
export default function BackToTopButton({ label }: BackToTopButtonProps) {
  const lenis = useLenis();
  const { x, y, handlers } = useMagnetic();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.button
      type="button"
      style={{ x, y }}
      {...handlers}
      onClick={scrollToTop}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso/15 text-espresso/70 transition-colors duration-300 hover:border-copper hover:text-copper"
    >
      <ArrowUp aria-hidden="true" className="h-4 w-4" />
    </motion.button>
  );
}
