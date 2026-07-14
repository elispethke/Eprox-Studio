import type { Project } from "@/types/project";
import { webProjects } from "@/lib/data/projects-web";
import { mobileProjects } from "@/lib/data/projects-mobile";
import { systemProjects } from "@/lib/data/projects-systems";

export { webProjects } from "@/lib/data/projects-web";
export { mobileProjects } from "@/lib/data/projects-mobile";
export { systemProjects } from "@/lib/data/projects-systems";

/** All projects across the three disciplines, grid/listing order. */
export function getAllProjects(): Project[] {
  return [...webProjects, ...mobileProjects, ...systemProjects];
}

/** Home carousel projects — sites only, per brand direction. */
export function getFeaturedProjects(): Project[] {
  return webProjects.filter((project) => project.featured);
}
