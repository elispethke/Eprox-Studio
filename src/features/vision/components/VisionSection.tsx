"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { VISION_PHOTO_BLUR_DATA_URL } from "../image-placeholders";
import SectionLabel from "@/shared/components/ui/SectionLabel";

// Parallax travel and the wrapper's safe margin below are coupled: the
// margin must be >= the offset so the translated image never reveals
// blank space at the clipped edges during scroll.
const PARALLAX_OFFSET = 40;

function useSectionFade() {
  const ref = useRef<HTMLElement | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = 1 - rect.top / window.innerHeight;
      setOpacity(Math.max(0, Math.min(1, progress)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { ref, opacity };
}

function useParallaxImage({ offset }: { offset: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2) / window.innerHeight;
      const translate = (progress - 0.5) * offset * 2;
      setY(Math.max(-offset, Math.min(offset, translate)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  return { containerRef, y };
}

export default function OurVision() {
  const t = useTranslations("vision");
  const { containerRef, y } = useParallaxImage({ offset: PARALLAX_OFFSET });
  const { ref, opacity } = useSectionFade();
  const body = t.raw("body") as string[];

  return (
    <motion.section
      id="vision"
      ref={ref}
      style={{ opacity }}
      className="sticky top-0 z-20 flex min-h-screen items-center overflow-hidden bg-obsidian px-6 py-24 md:py-32"
    >
      <div
        ref={containerRef}
        className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-2 md:items-center md:gap-20"
      >
        <div className="relative aspect-[2/3] overflow-hidden [clip-path:polygon(0_0,100%_0,100%_100%,14%_100%,0_86%)]">
          <motion.div style={{ y }} className="absolute -inset-y-10 inset-x-0">
            <Image
              src="/images/foto-vision.png"
              alt="Eprox Studio — Our Vision"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              placeholder="blur"
              blurDataURL={VISION_PHOTO_BLUR_DATA_URL}
              className="object-cover"
            />
          </motion.div>
        </div>

        <div>
          <SectionLabel className="md:-translate-y-8">
            {t("kicker")}
          </SectionLabel>

          <h2 className="font-display text-4xl leading-tight tracking-tight text-sand sm:text-5xl">
            {t("headline")}
          </h2>

          <div className="mt-8 space-y-6 font-subtitle text-base leading-relaxed text-sand/80 sm:text-lg">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
