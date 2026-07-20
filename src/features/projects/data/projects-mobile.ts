import type { MobileProject } from "@/features/projects/types";

// Fictional showcase apps (approved reference set). Six entries carry REAL
// screen-capture loops recorded for this portfolio (public/videos/mobile);
// the other four use verified royalty-free phone photography as posters.
const video = (id: string) => `/videos/mobile/${id}.mp4`;
const videoWebm = (id: string) => `/videos/mobile/${id}.webm`;
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=700&q=80&auto=format&fit=crop`;

const withVideo = (
  id: string,
  videoId: string,
  title: string,
  category: string,
  stack: string[],
  poster: string
): MobileProject => ({
  id,
  title,
  category,
  stack,
  type: "mobile",
  videoSrc: video(videoId),
  videoSrcWebm: videoWebm(videoId),
  poster: photo(poster),
  featured: false,
});

const withPhoto = (
  id: string,
  title: string,
  category: string,
  stack: string[],
  poster: string
): MobileProject => ({
  id,
  title,
  category,
  stack,
  type: "mobile",
  poster: photo(poster),
  featured: false,
});

export const mobileProjects: MobileProject[] = [
  withVideo(
    "fittrack",
    "pulse-fitness-app",
    "FitTrack",
    "Fitness & Health",
    ["iOS", "Android"],
    "1512941937669-90a1b58e7e9c"
  ),
  withPhoto(
    "foodgo",
    "FoodGo",
    "Food Delivery",
    ["iOS", "Android"],
    "1512499617640-c74ae3a79d37"
  ),
  withVideo(
    "habitplus",
    "clarity-health-app",
    "HabitPlus",
    "Productivity",
    ["iOS", "Android"],
    "1523206489230-c012c64b2b48"
  ),
  withVideo(
    "t-bank",
    "ledger-financial-dashboard",
    "T-Bank",
    "Digital Banking",
    ["iOS", "Android"],
    "1556656793-08538906a9f8"
  ),
  withVideo(
    "mindly",
    "wavelength-music-app",
    "Mindly",
    "Mental Health",
    ["iOS", "Android"],
    "1601784551446-20c9e07cdbdb"
  ),
  withPhoto(
    "yourway",
    "YourWay",
    "Daily Planner",
    ["iOS", "Android"],
    "1605236453806-6ff36851218e"
  ),
  withVideo(
    "lumen-wallet",
    "lumen-fintech-app",
    "Lumen Wallet",
    "Fintech",
    ["React Native"],
    "1512941937669-90a1b58e7e9c"
  ),
  withVideo(
    "farflung",
    "farflung-travel-app",
    "Farflung",
    "Travel Companion",
    ["iOS", "Android"],
    "1523206489230-c012c64b2b48"
  ),
  withPhoto(
    "aera-home",
    "Aera",
    "Smart Home",
    ["React Native"],
    "1593642532973-d31b6557fa68"
  ),
  withPhoto(
    "notio",
    "Notio",
    "Notes & Focus",
    ["iOS", "Android"],
    "1593642634315-48f5414c3ad9"
  ),
];
