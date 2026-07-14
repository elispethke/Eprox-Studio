import type { SystemProject } from "@/types/project";

function placeholder(index: number): string {
  const variant = (index % 8) + 1;
  return `/images/projects/placeholder-${variant}.jpg`;
}

export const systemProjects: SystemProject[] = [
  {
    id: "atlas-erp-console",
    title: "Atlas ERP Console",
    category: "Enterprise Resource Planning",
    type: "system",
    coverImage: placeholder(5),
    featured: false,
  },
  {
    id: "vertex-crm-suite",
    title: "Vertex CRM Suite",
    category: "CRM Platform",
    type: "system",
    coverImage: placeholder(6),
    featured: false,
  },
  {
    id: "signal-ops-dashboard",
    title: "Signal Ops Dashboard",
    category: "Operations Monitoring",
    type: "system",
    coverImage: placeholder(7),
    featured: false,
  },
  {
    id: "sentinel-compliance-platform",
    title: "Sentinel Compliance Platform",
    category: "Compliance & Risk System",
    type: "system",
    coverImage: placeholder(0),
    featured: false,
  },
];
