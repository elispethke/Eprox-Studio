"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useFanCarousel } from "@/features/home/hooks/useFanCarousel";
import { getFeaturedProjects } from "@/features/projects/data";
import ProjectCard from "@/features/projects/components/ProjectCard";

// Home carousel is site-only by brand direction — mobile/system cards
// (PhoneFrame, system BrowserFrame variant) never appear here.
const featuredProjects = getFeaturedProjects();

const SPRING = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;

const ARROW_BUTTON_CLASSNAME =
  "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-silver/20 text-lg text-sand backdrop-blur-md transition-colors hover:border-rust hover:text-rust disabled:pointer-events-none disabled:opacity-30";

export default function FeaturedProjects() {
  const t = useTranslations("work");
  const {
    containerRef,
    activeIndex,
    goTo,
    goToNext,
    goToPrev,
    canGoNext,
    canGoPrev,
    getTransform,
    onDragEnd,
  } = useFanCarousel({ itemCount: featuredProjects.length });

  return (
    <section className="sticky top-0 z-40 flex h-screen items-center overflow-hidden bg-obsidian px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="font-display text-4xl leading-tight tracking-tight text-sand sm:text-5xl">
          {t("featuredHeadline")}
        </h2>

        <div
          ref={containerRef}
          className="relative mt-16 h-[420px] touch-pan-y sm:h-[500px]"
        >
          <motion.div
            className="absolute inset-0 flex cursor-grab items-center justify-center active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
          >
            {featuredProjects.map((project, index) => {
              const distance = index - activeIndex;
              const transform = getTransform(distance);
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={project.id}
                  className="absolute h-[3000px] w-[600px] sm:h-[590px] sm:w-[720px]"
                  style={{ zIndex: transform.zIndex }}
                  animate={{
                    x: transform.x,
                    rotate: transform.rotate,

                    
                    scale: transform.scale,
                    opacity: transform.opacity,
                  }}
                  transition={SPRING}
                >
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={project.title}
                    aria-current={isActive}
                    className="block h-full w-full text-left"
                  >
                    <ProjectCard project={project} className="h-full w-full" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          <button
            type="button"
            onClick={goToPrev}
            disabled={!canGoPrev}
            aria-label={t("prev")}
            className={`${ARROW_BUTTON_CLASSNAME} left-0`}
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            onClick={goToNext}
            disabled={!canGoNext}
            aria-label={t("next")}
            className={`${ARROW_BUTTON_CLASSNAME} right-0`}
          >
            <span aria-hidden>›</span>
          </button>
        </div>

        <div className="mt-10 flex justify-center gap-3">
          {featuredProjects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={project.title}
              aria-current={index === activeIndex}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-rust" : "w-1.5 bg-sand/30"
              }`}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-subtitle text-sm uppercase tracking-widest text-sand transition-colors hover:text-rust"
          >
            {t("viewAll")}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
