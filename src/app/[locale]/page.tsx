import { Hero } from "@/features/home";
import { VisionSection } from "@/features/vision";
import { FoundationSection } from "@/features/foundation";
import { ProjectsCarousel } from "@/features/projects-carousel";
import { ContactSection } from "@/features/contact-form";

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex flex-1 flex-col outline-none"
    >
      <Hero />
      <VisionSection />
      <FoundationSection />
      <ProjectsCarousel />
      <ContactSection />
    </main>
  );
}
