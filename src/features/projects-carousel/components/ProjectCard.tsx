"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import {
  computeCardTransform,
  wrapOffset,
  type CarouselMetrics,
} from "../hooks/useCarousel3D";
import type { CarouselProject, CardTransform } from "../types";

interface ProjectCardProps {
  project: CarouselProject;
  index: number;
  itemCount: number;
  /** The carousel's continuous track position, in card units. */
  position: MotionValue<number>;
  metrics: CarouselMetrics;
  isActive: boolean;
  /** Called when a non-focused card is clicked, to rotate it into focus. */
  onFocusCard: (index: number) => void;
}

/**
 * One card on the showcase rig. All spatial styling (position, real z-depth,
 * inward rotation, dimensions, lighting) is derived per-frame from the shared
 * `position` motion value via the pure computeCardTransform mapping — the
 * component itself only re-renders when `isActive` flips.
 *
 * Layout per the reference: cover image fills the top ~70%, content
 * (category, serif title, description, View Project) sits below it — never
 * over the image.
 */
export default function ProjectCard({
  project,
  index,
  itemCount,
  position,
  metrics,
  isActive,
  onFocusCard,
}: ProjectCardProps) {
  const t = useTranslations("projectsCarousel");

  const at = (p: number): CardTransform =>
    computeCardTransform(wrapOffset(index - p, itemCount), metrics);

  const x = useTransform(position, (p) => at(p).x);
  const z = useTransform(position, (p) => at(p).z);
  const scale = useTransform(position, (p) => at(p).scale);
  const rotateY = useTransform(position, (p) => at(p).rotateY);
  const width = useTransform(position, (p) => at(p).width);
  const height = useTransform(position, (p) => at(p).height);
  const opacity = useTransform(position, (p) => at(p).opacity);
  const zIndex = useTransform(position, (p) => at(p).zIndex);
  const filter = useTransform(position, (p) => {
    const { blur, brightness } = at(p);
    return `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(3)})`;
  });
  const boxShadow = useTransform(
    position,
    (p) => `0 45px 90px -22px rgba(0,0,0,${at(p).shadowOpacity.toFixed(2)})`,
  );

  return (
    <motion.div
      style={{ x, z, scale, rotateY, width, height, opacity, zIndex, filter, boxShadow }}
      transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
      className="absolute left-1/2 top-1/2 rounded-2xl will-change-transform"
      aria-hidden={!isActive}
    >
      <article
        onClick={() => {
          if (!isActive) onFocusCard(index);
        }}
        className={`flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-obsidian-deep transition-colors duration-500 ${
          isActive ? "border-rust/30" : "cursor-pointer border-sand/10"
        }`}
      >
        {/* Cover — ~70% of the card, content never overlaps it. */}
        <div className="relative h-[70%] w-full shrink-0">
          <Image
            src={project.coverImage}
            alt=""
            fill
            draggable={false}
            sizes="(max-width: 768px) 90vw, 640px"
            className="select-none object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian-deep/60" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between gap-1 px-6 py-4 sm:px-7">
          <div className="min-h-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-rust">
              {project.category}
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-4">
              <h3 className="truncate font-display text-xl text-sand sm:text-2xl lg:text-[1.7rem]">
                {project.title}
              </h3>
            </div>
            <p className="mt-1 line-clamp-2 font-subtitle text-xs leading-relaxed text-sand/55 sm:text-sm">
              {project.description}
            </p>
          </div>

          <div className="flex justify-end">
            <Link
              href={project.href}
              tabIndex={isActive ? 0 : -1}
              aria-label={`${t("viewProject")} — ${project.title}`}
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sand transition-colors hover:text-rust"
            >
              {t("viewProject")}
              <ArrowUpRight
                aria-hidden="true"
                className="h-3 w-3 text-rust transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
