"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SectionLabel from "@/shared/components/ui/SectionLabel";
import PillButton from "@/shared/components/ui/PillButton";
import GrainOverlay from "@/shared/components/ui/GrainOverlay";
import { LineReveal, splitIntoLines } from "@/shared/hooks/useLineReveal";
import { buildCarouselMetrics, useCarousel3D } from "../hooks/useCarousel3D";
import { carouselProjects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import CarouselControls from "./CarouselControls";
import ProgressDashes from "./ProgressDashes";

interface ProjectsCarouselProps {
  /** Advance automatically (pauses on hover, focus and drag; disabled under prefers-reduced-motion). */
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const MAX_CENTER_WIDTH = 620;
const MIN_CENTER_WIDTH = 300;
/** Fraction of the track width the focused card occupies. */
const CENTER_WIDTH_RATIO = 0.46;

export default function ProjectsCarousel({
  autoPlay = true,
  autoPlayInterval = 2000,
}: ProjectsCarouselProps) {
  const t = useTranslations("projectsCarousel");
  const trackRef = useRef<HTMLDivElement>(null);
  const [centerWidth, setCenterWidth] = useState(MAX_CENTER_WIDTH);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateWidth = () => {
      setCenterWidth(
        Math.min(
          Math.max(track.clientWidth * CENTER_WIDTH_RATIO, MIN_CENTER_WIDTH),
          MAX_CENTER_WIDTH
        )
      );
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const metrics = buildCarouselMetrics(centerWidth);

  const {
    position,
    activeIndex,
    goTo,
    next,
    prev,
    trackHandlers,
    autoPlayPauseHandlers,
    isDragging,
    isAutoPlaying,
    toggleAutoPlay,
    isUserPaused,
  } = useCarousel3D({
    itemCount: carouselProjects.length,
    spacing: metrics.sideX,
    autoPlay,
    autoPlayInterval,
  });

  const activeProject = carouselProjects[activeIndex];

  return (
    <section
      id="work"
      className="relative z-40 overflow-hidden bg-obsidian py-24 md:py-32"
      {...autoPlayPauseHandlers}
    >
      <GrainOverlay opacity={0.04} />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <span className="font-mono text-sm text-sand/40">(03)</span>

          <div className="flex flex-col items-center text-center lg:max-w-xl">
            <SectionLabel className="justify-center">
              {t("kicker")}
            </SectionLabel>
            <h2 className="mt-5 font-display text-4xl tracking-tight text-sand sm:text-5xl md:text-6xl">
              <LineReveal lines={splitIntoLines(t("headline"), 20)} />
            </h2>
            <p className="mt-5 max-w-md font-subtitle text-sm text-sand/55 sm:text-base">
              {t("subheadline")}
            </p>
          </div>

          <div className="flex lg:justify-end">
            <PillButton href="/work">{t("viewAll")}</PillButton>
          </div>
        </div>

        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={t("headline")}
          tabIndex={0}
          {...trackHandlers}
          style={{ height: metrics.centerHeight + 60 }}
          className={`relative mt-14 touch-pan-y outline-none [perspective:1600px] focus-visible:ring-1 focus-visible:ring-rust/40 md:mt-20 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Floor glow: a soft copper pool of light under the focused card,
              grounding the ring the way the reference render does. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-6%] left-1/2 h-[120px] w-[min(70%,760px)] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(201,121,60,0.22)_0%,rgba(201,121,60,0.08)_45%,transparent_75%)] blur-xl"
          />

          <div className="absolute inset-0 [transform-style:preserve-3d]">
            {carouselProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                itemCount={carouselProjects.length}
                position={position}
                metrics={metrics}
                isActive={index === activeIndex}
                onFocusCard={goTo}
              />
            ))}
          </div>

          {/* Announces slide changes to assistive tech without stealing focus. */}
          <p aria-live="polite" className="sr-only">
            {t("announce", {
              title: activeProject.title,
              current: activeIndex + 1,
              total: carouselProjects.length,
            })}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <CarouselControls
            onPrev={prev}
            onNext={next}
            prevLabel={t("prev")}
            nextLabel={t("next")}
            onTogglePlay={toggleAutoPlay}
            isUserPaused={isUserPaused}
            playLabel={t("play")}
            pauseLabel={t("pause")}
          >
            <ProgressDashes
              count={carouselProjects.length}
              activeIndex={activeIndex}
              onSelect={goTo}
              goToLabel={t("goTo")}
              labels={carouselProjects.map((project) => project.title)}
              isAutoPlaying={isAutoPlaying}
              autoPlayIntervalMs={autoPlayInterval}
            />
          </CarouselControls>
        </div>
      </div>
    </section>
  );
}
