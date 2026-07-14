"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParallaxImage } from "@/hooks/useParallaxImage";
import { ELIS_PHOTO_BLUR_DATA_URL } from "@/lib/image-placeholders";

// The frame and the photo inside it are parallaxed independently, at
// different speeds, for a layered depth effect. Margin stays coupled
// to the photo's offset so its translate never reveals blank edges.
const FRAME_PARALLAX_OFFSET = 14;
const PHOTO_PARALLAX_OFFSET = 40;

export default function Foundation() {
  const t = useTranslations("foundation");
  const { containerRef: frameRef, y: frameY } = useParallaxImage({
    offset: FRAME_PARALLAX_OFFSET,
  });
  const { containerRef: photoRef, y: photoY } = useParallaxImage({
    offset: PHOTO_PARALLAX_OFFSET,
  });
  const body = t.raw("body") as string[];

  return (
    <section id="foundation" className="bg-sand px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center md:gap-20">
        <div className="order-2 md:order-1">
          <h2 className="font-display text-4xl leading-tight tracking-tight text-obsidian sm:text-5xl">
            {t("headline")}
          </h2>
          <div className="mt-8 space-y-6 font-subtitle text-base leading-relaxed text-obsidian/80 sm:text-lg">
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
    </section>
  );
}
