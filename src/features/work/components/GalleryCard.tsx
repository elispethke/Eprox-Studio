"use client";

import Image from "next/image";
import { ArrowUpRight, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  CardGlassWrapper,
  type SystemProject,
  type WebProject,
} from "@/features/projects";
import ProjectBadge from "./ProjectBadge";

interface GalleryCardProps {
  project: WebProject | SystemProject;
}

const isSystem = (
  project: WebProject | SystemProject
): project is SystemProject => project.type === "system";

/**
 * Compact gallery card for websites and systems: the brand's glass shell
 * (magnetic tilt + rust glow) around a real cover shot under a minimal
 * browser chrome, with name, category, tech badges and a quiet arrow
 * action. A light sheen sweeps the media on hover.
 */
export default function GalleryCard({ project }: GalleryCardProps) {
  const t = useTranslations("work");
  const system = isSystem(project);

  return (
    <CardGlassWrapper className="h-full">
      <article className="flex h-full flex-col">
        {/* Minimal browser chrome — reads as a real product shot. System
            cards swap the accent dot to sage and add a dashboard glyph, so
            platforms read distinctly from marketing sites at a glance. */}
        <div className="flex items-center gap-1.5 border-b border-sand/[0.06] px-3.5 py-2.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${system ? "bg-sage/70" : "bg-rust/60"}`}
          />
          <span className="h-1.5 w-1.5 rounded-full bg-sand/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-sand/25" />
          <span className="ml-2 h-1.5 flex-1 rounded-full bg-sand/[0.06]" />
          {system && (
            <LayoutDashboard
              aria-hidden="true"
              className="h-3 w-3 shrink-0 text-sage/70"
            />
          )}
        </div>

        <div className="relative aspect-[16/11] overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 260px"
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent" />
          {/* Sheen sweep on hover. */}
          <div className="pointer-events-none absolute inset-y-0 left-[-60%] w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-sand/10 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[110%] group-hover:opacity-100" />
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-4">
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
