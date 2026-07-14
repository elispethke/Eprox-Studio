"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTextReveal } from "@/features/home/hooks/useTextReveal";
import { useSectionFade } from "@/features/home/hooks/useSectionFade";
import { useFlowLines } from "@/features/home/hooks/useFlowLines";
import { useHeroBackgroundDrift } from "@/features/home/hooks/useHeroBackgroundDrift";
import HeroGlowOrb from "@/components/ui/HeroGlowOrb";

export default function Hero() {
  const t = useTranslations("hero");
  const { container, word, followUp } = useTextReveal();
  const { ref, opacity } = useSectionFade();
  const { canvasRef } = useFlowLines();
  const { opacity: bgOpacity, y: bgY } = useHeroBackgroundDrift(ref);
  const headlineWords = t("headline").split(" ");

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="sticky top-0 z-10 flex h-screen flex-col items-center justify-center overflow-hidden bg-obsidian px-6 text-center"
    >
      <motion.div
        aria-hidden="true"
        style={{ opacity: bgOpacity, y: bgY }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
        <HeroGlowOrb />
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative z-10 flex flex-wrap justify-center gap-x-4 gap-y-2 bg-gradient-to-r from-rust via-sand to-rust bg-gradient-sweep bg-clip-text font-display text-5xl leading-tight tracking-tight text-transparent animate-gradient-sweep sm:text-6xl md:text-7xl"
      >
        {headlineWords.map((wordText, index) => (
          <span key={`${wordText}-${index}`} className="overflow-hidden">
            <motion.span variants={word} className="leading-[1.4]">
              {wordText}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={followUp}
        className="relative z-10 mt-8 max-w-2xl font-subtitle text-base text-sand/80 sm:text-lg"
      >
        {t("subheadline")}
      </motion.p>
    </motion.section>
  );
}
