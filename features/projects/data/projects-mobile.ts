import type { MobileProject } from "@/features/projects/types";

function poster(index: number): string {
  const variant = (index % 8) + 1;
  return `/images/projects/placeholder-${variant}.jpg`;
}

function video(id: string): string {
  return `/videos/mobile/${id}.mp4`;
}

function videoWebm(id: string): string {
  return `/videos/mobile/${id}.webm`;
}

export const mobileProjects: MobileProject[] = [
  {
    id: "pulse-fitness-app",
    title: "Pulse Fitness",
    category: "Fitness App",
    type: "mobile",
    videoSrc: video("pulse-fitness-app"),
    videoSrcWebm: videoWebm("pulse-fitness-app"),
    poster: poster(2),
    featured: false,
  },
  {
    id: "lumen-fintech-app",
    title: "Lumen Wallet",
    category: "Fintech App",
    type: "mobile",
    videoSrc: video("lumen-fintech-app"),
    videoSrcWebm: videoWebm("lumen-fintech-app"),
    poster: poster(4),
    featured: false,
  },
  {
    id: "wavelength-music-app",
    title: "Wavelength",
    category: "Music Streaming App",
    type: "mobile",
    videoSrc: video("wavelength-music-app"),
    videoSrcWebm: videoWebm("wavelength-music-app"),
    poster: poster(0),
    featured: false,
  },
  {
    id: "clarity-health-app",
    title: "Clarity Health",
    category: "Health & Wellness App",
    type: "mobile",
    videoSrc: video("clarity-health-app"),
    videoSrcWebm: videoWebm("clarity-health-app"),
    poster: poster(1),
    featured: false,
  },
  {
    id: "farflung-travel-app",
    title: "Farflung",
    category: "Travel App",
    type: "mobile",
    videoSrc: video("farflung-travel-app"),
    videoSrcWebm: videoWebm("farflung-travel-app"),
    poster: poster(7),
    featured: false,
  },
  {
    id: "ledger-financial-dashboard",
    title: "Ledger",
    category: "Financial Dashboard App",
    type: "mobile",
    videoSrc: video("ledger-financial-dashboard"),
    videoSrcWebm: videoWebm("ledger-financial-dashboard"),
    poster: poster(3),
    featured: false,
  },
];
