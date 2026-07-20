import type { SystemProject } from "@/features/projects/types";

// Fictional showcase platforms (approved reference set). Dashboard-style
// royalty-free imagery, one distinct verified shot per entry.
const cover = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;

const p = (
  id: string,
  title: string,
  category: string,
  stack: string[],
  image: string
): SystemProject => ({
  id,
  title,
  category,
  stack,
  type: "system",
  coverImage: cover(image),
  featured: false,
});

export const systemProjects: SystemProject[] = [
  p(
    "restora",
    "Restora",
    "Restaurant Management",
    ["SaaS", "Web"],
    "1551288049-bebda4e38f71"
  ),
  p(
    "churchflow",
    "ChurchFlow",
    "Church Management",
    ["SaaS", "Web"],
    "1460925895917-afdab827c52f"
  ),
  p(
    "nestly",
    "Nestly",
    "Property Management",
    ["SaaS", "Web"],
    "1543286386-713bdd548da4"
  ),
  p(
    "taskflow",
    "TaskFlow",
    "Team Collaboration",
    ["SaaS", "Web"],
    "1531403009284-440f080d1e12"
  ),
  p(
    "fintrak",
    "Fintrak",
    "Financial Dashboard",
    ["SaaS", "Web"],
    "1581291518857-4e27b48ff24e"
  ),
  p(
    "medilink",
    "MediLink",
    "Health Records",
    ["SaaS", "Web"],
    "1587440871875-191322ee64b0"
  ),
];
