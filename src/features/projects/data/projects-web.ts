import type { WebProject } from "@/features/projects/types";

// Fictional showcase clients (approved reference set). Imagery is curated
// royalty-free photography standing in for real case screenshots — every
// entry has a distinct, verified image (no placeholders, no gradients).
const cover = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;

const p = (
  id: string,
  title: string,
  category: string,
  stack: string[],
  image: string,
  featured = false
): WebProject => ({
  id,
  title,
  category,
  stack,
  type: "web",
  coverImage: cover(image),
  featured,
});

export const webProjects: WebProject[] = [
  p(
    "mod-o",
    "Mod.O",
    "Fashion Studio",
    ["Next.js", "Tailwind", "GSAP"],
    "1522542550221-31fd19575a2d",
    true
  ),
  p(
    "aurea-properties",
    "Aurea Properties",
    "Luxury Real Estate",
    ["Next.js", "Strapi", "GSAP"],
    "1467232004584-a241de8bcf5d",
    true
  ),
  p(
    "vellora",
    "Vellora",
    "Wellness & Beauty",
    ["Next.js", "Tailwind", "CMS"],
    "1583508915901-b5f84c1dcde1",
    true
  ),
  p(
    "nexora",
    "Nexora",
    "Tech Company",
    ["Next.js", "Framer Motion"],
    "1517180102446-f3ece451e9d8",
    true
  ),
  p(
    "luminis",
    "Luminis",
    "Interior Design",
    ["Next.js", "Tailwind", "CMS"],
    "1481887328591-3e277f9473dc",
    true
  ),
  p(
    "sante-clinic",
    "Santé Clinic",
    "Premium Healthcare",
    ["Next.js", "Strapi", "Tailwind"],
    "1573164713988-8665fc963095"
  ),
  p(
    "fjord-travel",
    "Fjord Travel",
    "Luxury Experiences",
    ["Next.js", "Tailwind", "CMS"],
    "1526406915894-7bcd65f60845"
  ),
  p(
    "arvo-consulting",
    "Arvo Consulting",
    "Business Advisory",
    ["Next.js", "Strapi"],
    "1551434678-e076c223a692"
  ),
  p(
    "bela-vista",
    "Bela Vista",
    "Gastronomy",
    ["Next.js", "Tailwind", "CMS"],
    "1567581935884-3349723552ca"
  ),
  p(
    "kronos",
    "Kronos",
    "Financial Services",
    ["Next.js", "Recharts"],
    "1461749280684-dccba630e2f6"
  ),
  p(
    "halvar",
    "Halvar",
    "Architecture Studio",
    ["Next.js", "GSAP", "Sanity"],
    "1497366754035-f200968a6e72"
  ),
  p(
    "ondine",
    "Ondine",
    "Hotel & Spa",
    ["Next.js", "Tailwind", "CMS"],
    "1559028012-481c04fa702d"
  ),
  p(
    "vantage-legal",
    "Vantage Legal",
    "Law Firm",
    ["Next.js", "Strapi"],
    "1555066931-4365d14bab8c"
  ),
  p(
    "terra-verde",
    "Terra Verde",
    "Sustainability",
    ["Next.js", "Tailwind"],
    "1512499617640-c74ae3a79d37"
  ),
  p(
    "atelier-noir",
    "Atelier Noir",
    "Fashion E-commerce",
    ["Next.js", "Shopify", "GSAP"],
    "1547658719-da2b51169166"
  ),
  p(
    "meridian",
    "Meridian",
    "SaaS Marketing",
    ["Next.js", "Framer Motion"],
    "1551650975-87deedd944c3"
  ),
  p(
    "solstice-events",
    "Solstice Events",
    "Event Production",
    ["Next.js", "Tailwind", "CMS"],
    "1505373877841-8d25f7d46678"
  ),
  p(
    "novara-motors",
    "Novara Motors",
    "Automotive",
    ["Next.js", "Three.js"],
    "1493238792000-8113da705763"
  ),
  p(
    "casa-mia",
    "Casa Mia",
    "Furniture & Decor",
    ["Next.js", "Shopify"],
    "1493663284031-b7e3aefcae8e"
  ),
  p(
    "aria-music",
    "Aria Music School",
    "Education",
    ["Next.js", "Tailwind", "CMS"],
    "1498050108023-c5249f4df085"
  ),
];
