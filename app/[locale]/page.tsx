import Hero from "@/components/sections/Hero";
import OurVision from "@/components/sections/OurVision";
import Foundation from "@/components/sections/Foundation";
import FeaturedProjects from "@/components/sections/FeaturedProjects";

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
