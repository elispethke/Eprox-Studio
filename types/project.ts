export type ProjectType = "web" | "mobile" | "system";

interface ProjectBase {
  id: string;
  title: string;
  category: string;
  featured: boolean;
}

export interface WebProject extends ProjectBase {
  type: "web";
  coverImage: string;
}

export interface MobileProject extends ProjectBase {
  type: "mobile";
  videoSrc: string;
  videoSrcWebm?: string;
  poster: string;
}

export interface SystemProject extends ProjectBase {
  type: "system";
  coverImage: string;
}

export type Project = WebProject | MobileProject | SystemProject;
