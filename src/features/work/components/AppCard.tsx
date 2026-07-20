"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { CardGlassWrapper, type MobileProject } from "@/features/projects";
import ProjectBadge from "./ProjectBadge";

interface AppCardProps {
  project: MobileProject;
}

/**
 * Compact app card: a slim phone bezel (notch, ring highlight) holding a
 * REAL screen capture loop when available, or curated phone photography
 * otherwise — never a placeholder. Same glass shell and hover language as
 * the gallery cards.
 */
export default function AppCard({ project }: AppCardProps) {
  const t = useTranslations("work");

  return (
    <CardGlassWrapper className="h-full">
      <article className="flex h-full flex-col">
        <div className="flex justify-center px-6 pb-2 pt-6">
          {/* Phone bezel */}
          <div className="relative w-full max-w-[150px] overflow-hidden rounded-[1.6rem] border border-sand/15 bg-obsidian shadow-[inset_0_0_0_2px_rgba(10,10,10,0.9),0_18px_36px_-18px_rgba(0,0,0,0.8)]">
            <span className="absolute left-1/2 top-1.5 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-obsidian-deep ring-1 ring-sand/10" />
            <div className="relative aspect-[9/19]">
              {project.videoSrc ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={project.poster}
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  {project.videoSrcWebm && (
                    <source src={project.videoSrcWebm} type="video/webm" />
                  )}
                  <source src={project.videoSrc} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={project.poster}
                  alt={project.title}
                  fill
                  loading="lazy"
                  sizes="150px"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-4 pt-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-subtitle text-sm font-bold text-sand">
                {project.title}
              </h3>
              <p className="mt-0.5 truncate font-subtitle text-xs text-sand/55">
                {project.category}
              </p>
            </div>
            <span
              aria-label={`${t("viewProject")} — ${project.title}`}
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sand/15 text-sand/70 transition-all duration-300 group-hover:border-rust group-hover:text-rust group-hover:shadow-[0_0_16px_-4px_rgba(201,121,60,0.6)]"
            >
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
          <div className="mt-auto flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <ProjectBadge key={tech} label={tech} />
            ))}
          </div>
        </div>
      </article>
    </CardGlassWrapper>
  );
}
