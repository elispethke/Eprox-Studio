export type ProjectType = "web" | "mobile" | "system";

interface ProjectBase {
  id: string;
  title: string;
  category: string;
  /** Tech badges shown on the card (e.g. "Next.js", "Tailwind"). */
  stack: string[];
  featured: boolean;
}

export interface WebProject extends ProjectBase {
  type: "web";
  coverImage: string;
}

export interface MobileProject extends ProjectBase {
  type: "mobile";
  /** Looping phone-screen capture; when absent the poster renders as a static mockup. */
  videoSrc?: string;
  videoSrcWebm?: string;
  poster: string;
}

export interface SystemProject extends ProjectBase {
  type: "system";
  coverImage: string;
}

export type Project = WebProject | MobileProject | SystemProject;

/** "carousel" is the home fan-carousel anatomy — title column beside the
 * media. "grid" is the /work section grid anatomy — media filling most of
 * the card, title/category below it. */
export type ProjectCardVariant = "carousel" | "grid";
