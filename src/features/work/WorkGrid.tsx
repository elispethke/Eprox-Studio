"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/features/projects/components/ProjectCard";
import type { Project } from "@/features/projects/types";

type WorkGridLayout = "wide" | "tall";

interface WorkGridProps {
  eyebrow: string;
  headline: string;
  projects: Project[];
  /** "wide" = 16:9 YouTube-thumbnail-style cards, 2 per row on large screens
   * (Web Projects, Systems). "tall" = 9:16 phone-style cards, 4 per row on
   * large screens (Mobile Apps). */
  layout: WorkGridLayout;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// "wide" cards size to their content (media aspect-ratio lives inside the
// card itself, on the BrowserFrame's image area — see ProjectCardWeb/System's
// "grid" variant) rather than forcing the whole card, text included, into a
// 16:9 box. "tall" cards keep sizing the whole card, since PhoneFrame's
// video already dictates a comfortable 9:16 shape end to end.
const LAYOUT_CLASSES: Record<WorkGridLayout, { aspect: string; grid: string }> = {
  wide: { aspect: "", grid: "grid-cols-1 xl:grid-cols-2" },
  tall: { aspect: "aspect-[9/16]", grid: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" },
};

/**
 * One project-type section: eyebrow + headline, then a uniform grid of
 * same-aspect-ratio cards for that type only. Never mixes web/mobile/system
 * projects in one grid — the /work page renders three of these.
 */
export default function WorkGrid({ eyebrow, headline, projects, layout }: WorkGridProps) {
  const { aspect, grid } = LAYOUT_CLASSES[layout];
  const isTall = layout === "tall";

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
          {eyebrow}
        </span>
        <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-sand sm:text-4xl">
          {headline}
        </h2>

        <div className={`mt-12 grid gap-8 ${grid}`}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: (index % 4) * 0.08,
                ease: EASE_OUT_EXPO,
              }}
              className={aspect}
            >
              <ProjectCard project={project} variant="grid" className={isTall ? "h-full" : undefined} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
