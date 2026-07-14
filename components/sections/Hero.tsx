"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTextReveal } from "@/hooks/useTextReveal";

export default function Hero() {
  const t = useTranslations("hero");
  const { container, word, followUp } = useTextReveal();
  const headlineWords = t("headline").split(" ");

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={container}
        className="flex flex-wrap justify-center gap-x-4 gap-y-2 bg-gradient-to-r from-rust via-sand to-rust bg-gradient-sweep bg-clip-text font-display text-5xl leading-tight tracking-tight text-transparent animate-gradient-sweep sm:text-6xl md:text-7xl"
      >
        {headlineWords.map((wordText, index) => (
          <span key={`${wordText}-${index}`} className="overflow-hidden">
            <motion.span variants={word} className="inline-block">
              {wordText}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={followUp}
        className="mt-8 max-w-2xl font-subtitle text-base text-sand/80 sm:text-lg"
      >
        {t("subheadline")}
      </motion.p>
    </section>
  );
}
