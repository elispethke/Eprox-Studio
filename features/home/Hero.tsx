"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTextReveal } from "@/features/home/hooks/useTextReveal";
import { useSectionFade } from "@/features/home/hooks/useSectionFade";
import { useFlowLines } from "@/features/home/hooks/useFlowLines";
import { useHeroBackgroundDrift } from "@/features/home/hooks/useHeroBackgroundDrift";


export default function Hero() {
  const t = useTranslations("hero");
  const { container, word, followUp } = useTextReveal();
  const { ref, opacity } = useSectionFade();
  const { canvasRef } = useFlowLines();
  const { opacity: bgOpacity, y: bgY } = useHeroBackgroundDrift(ref);
  const headlineWords = t("headline").split(" ");
  const [leadWord, secondWord, ...restWords] = headlineWords;

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
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-obsidian/30" />
        <canvas ref={canvasRef} className="absolute inset-0" />
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative z-10 flex flex-col items-center gap-y-2 bg-gradient-to-r from-rust via-sand to-rust bg-gradient-sweep bg-clip-text font-display leading-[0.95] tracking-tight text-transparent animate-gradient-sweep drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)] sm:gap-y-3"
      >
        {[leadWord, secondWord].map((wordText, index) => (
          <span
            key={`${wordText}-${index}`}
            className="overflow-hidden text-6xl font-black sm:text-8xl md:text-9xl"
          >
            <motion.span variants={word} className="inline-block leading-[1.05]">
              {wordText}
            </motion.span>
          </span>
        ))}

        {restWords.length > 0 && (
          <span className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-2xl font-light sm:mt-4 sm:text-3xl md:text-4xl">
            {restWords.map((wordText, index) => (
              <span key={`${wordText}-${index}`} className="overflow-hidden">
                <motion.span variants={word} className="inline-block leading-[1.3]">
                  {wordText}
                </motion.span>
              </span>
            ))}
          </span>
        )}
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
