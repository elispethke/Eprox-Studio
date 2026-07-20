import type { Project } from "@/features/projects";
import type { WorkSort } from "../components/CategoryFilter";

/**
 * Pure ordering for a section's grid. "recent" surfaces featured work first
 * (then source order); "az" is a locale-aware alphabetical sort by title.
 * Never mutates the input array.
 */
export function sortProjects<T extends Project>(
  projects: T[],
  sort: WorkSort
): T[] {
  if (sort === "az") {
    return [...projects].sort((a, b) => a.title.localeCompare(b.title));
  }
  return [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
}
