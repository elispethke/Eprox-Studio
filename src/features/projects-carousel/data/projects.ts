import type { CarouselProject } from "../types";

// Showcase copy is intentionally not localized — project names and taglines
// are brand assets, kept identical across locales like the rest of the
// portfolio data (see features/projects/data).
// Cover images are temporary public Unsplash photos (allowed via
// next.config remotePatterns) until real project shots replace them.
const cover = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1400&q=80&auto=format&fit=crop`;

export const carouselProjects: CarouselProject[] = [
  {
    id: "vertix-studio",
    title: "Vertix Studio",
    category: "Architecture, Web Design",
    description: "A bold digital presence for a cutting-edge architecture firm.",
    coverImage: cover("1487958449943-2429e8be8625"),
    href: "/work",
  },
  {
    id: "nextmotion",
    title: "Nextmotion",
    category: "Technology, Branding",
    description: "A dynamic brand identity for a next-gen tech company.",
    coverImage: cover("1518709268805-4e9042af9f23"),
    href: "/work",
  },
  {
    id: "spacia-interiors",
    title: "Spacia Interiors",
    category: "Architecture, Web Design",
    description: "A modern website for a premium interior studio.",
    coverImage: cover("1618221195710-dd6b41faaea6"),
    href: "/work",
  },
  {
    id: "lumina-skincare",
    title: "Lumina Skincare",
    category: "Branding, E-Commerce",
    description: "Elevating a skincare brand with elegant digital storytelling.",
    coverImage: cover("1570172619644-dfd03ed5d881"),
    href: "/work",
  },
  {
    id: "aurea-living",
    title: "Aurea Living",
    category: "Interior Design",
    description: "A refined digital experience for a luxury interior brand.",
    coverImage: cover("1600210492486-724fe5c67fb0"),
    href: "/work",
  },
  {
    id: "natura-organics",
    title: "Natura Organics",
    category: "Branding, E-Commerce",
    description: "Organic beauty, reimagined for the digital age.",
    coverImage: cover("1526947425960-945c6e72858f"),
    href: "/work",
  },
  {
    id: "move-beyond",
    title: "Move Beyond",
    category: "Fitness, Mobile App",
    description: "A high-performance app for modern athletes.",
    coverImage: cover("1571019613454-1cb2f99b2d8b"),
    href: "/work",
  },
];
