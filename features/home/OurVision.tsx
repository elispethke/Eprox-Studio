"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParallaxImage } from "@/features/home/hooks/useParallaxImage";
import { useSectionFade } from "@/features/home/hooks/useSectionFade";
import { VISION_PHOTO_BLUR_DATA_URL } from "@/features/home/image-placeholders";

// Parallax travel and the wrapper's safe margin below are coupled: the
// margin must be >= the offset so the translated image never reveals
// blank space at the clipped edges during scroll.
const PARALLAX_OFFSET = 40;

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
      className="sticky top-0 z-20 flex h-screen items-center overflow-hidden bg-obsidian px-6 py-24 md:py-32"
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
