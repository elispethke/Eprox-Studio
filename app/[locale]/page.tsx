import Hero from "@/features/home/Hero";
import OurVision from "@/features/home/OurVision";
import Foundation from "@/features/home/Foundation";
import FeaturedProjects from "@/features/home/FeaturedProjects";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <OurVision />
      <Foundation />
      <FeaturedProjects />
    </main>
  );
}
