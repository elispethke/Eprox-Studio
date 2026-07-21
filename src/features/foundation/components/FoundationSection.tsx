"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { ELIS_PHOTO_BLUR_DATA_URL } from "../image-placeholders";

export default function Foundation() {
  const t = useTranslations("foundation");
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const frameY = useMotionValue(0);
  const photoY = useMotionValue(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Ratio against the viewport (not the target) so full opacity is
        // still reached once content taller than one screen makes the
        // section itself taller than the root — intersectionRatio alone
        // would then cap below 1.
        const rootHeight = entry.rootBounds?.height ?? window.innerHeight;
        setOpacity(entry.intersectionRect.height / rootHeight);
      },
      { threshold: Array.from({ length: 11 }, (_, index) => index / 10) }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateParallax = () => {
      const frame = frameRef.current;
      if (!frame) return;

      const rect = frame.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.min(
        Math.max(
          (viewportHeight - rect.top) / (viewportHeight + rect.height),
          0
        ),
        1
      );

      frameY.set((0.5 - progress) * 20);
      photoY.set((progress - 0.5) * 20);
    };

    updateParallax();

    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);

    return () => {
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, [frameY, photoY]);

  const body = t.raw("body") as string[];

  return (
    <motion.section
      id="foundation"
      ref={sectionRef}
      style={{ opacity }}
      className="sticky top-0 z-30 flex min-h-screen items-center overflow-hidden bg-sand px-6 py-24 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-2 md:items-center md:gap-20">
        <div className="order-2 md:order-1 md:max-w-xl">
          <h2 className="font-display text-5xl leading-[0.92] tracking-[-0.03em] text-rust sm:text-6xl lg:text-7xl">
            {t("headline")}
          </h2>
          <div className="mt-10 space-y-7 font-subtitle text-base leading-8 text-obsidian/80 sm:text-lg">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div
          ref={frameRef}
          className="relative order-1 aspect-[2/3] md:order-2"
        >
          <motion.div
            style={{ y: frameY }}
            className="pointer-events-none absolute -inset-3 rounded-tr-[4rem] rounded-bl-[4rem] border border-rust"
          />
          <div
            ref={photoRef}
            className="relative h-full w-full overflow-hidden rounded-tr-[3.5rem] rounded-bl-[3.5rem]"
          >
            <motion.div
              style={{ y: photoY }}
              className="absolute -inset-y-10 inset-x-0"
            >
              <Image
                src="/images/elis.png"
                alt="Elis, founder of Eprox Studio"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                placeholder="blur"
                blurDataURL={ELIS_PHOTO_BLUR_DATA_URL}
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
