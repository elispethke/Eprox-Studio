import type { Project } from "@/features/projects/types";
import { webProjects } from "@/features/projects/data/projects-web";
import { mobileProjects } from "@/features/projects/data/projects-mobile";
import { systemProjects } from "@/features/projects/data/projects-systems";

export { webProjects } from "@/features/projects/data/projects-web";
export { mobileProjects } from "@/features/projects/data/projects-mobile";
export { systemProjects } from "@/features/projects/data/projects-systems";

/** All projects across the three disciplines, grid/listing order. */
export function getAllProjects(): Project[] {
  return [...webProjects, ...mobileProjects, ...systemProjects];
}
