import Hero from "@/features/home/Hero";
import OurVision from "@/features/home/OurVision";
import Foundation from "@/features/home/Foundation";
import { ProjectsCarousel } from "@/features/projects-carousel";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <OurVision />
      <Foundation />
      <ProjectsCarousel />
    </main>
  );
}
