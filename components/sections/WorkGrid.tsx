"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ui/cards/ProjectCard";
import type { Project } from "@/types/project";

interface WorkGridProps {
  projects: Project[];
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Cycled per card to give the grid an irregular, editorial rhythm instead
// of a uniform checkerboard of equal-sized tiles.
const BENTO_SPANS = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

export default function WorkGrid({ projects }: WorkGridProps) {
  return (
    <div className="relative mx-auto max-w-7xl px-6 pb-32">
      <div className="grid grid-cols-1 gap-8 md:auto-rows-[16rem] md:grid-cols-4 md:gap-10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.6,
              delay: (index % 6) * 0.08,
              ease: EASE_OUT_EXPO,
            }}
            className={BENTO_SPANS[index % BENTO_SPANS.length]}
          >
            <ProjectCard project={project} className="h-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
