import GrainOverlay from "@/shared/components/ui/GrainOverlay";
import FooterCTA from "./FooterCTA";
import FooterColumns from "./FooterColumns";
import FooterBottomBar from "./FooterBottomBar";
import FooterWatermark from "./FooterWatermark";

/**
 * Site footer on the light linen base, visually continuous with the contact
 * section: same copper glow, grain, espresso text and serif/mono type mix,
 * closed by the giant outline EPROX watermark. Sits at z-40 so it slides
 * over the home page's sticky sections like every other late section.
 */
export default function Footer() {
  return (
    <footer className="relative z-40 overflow-hidden bg-linen">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[12%] top-[-20%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(212,152,110,0.2)_0%,rgba(232,194,160,0.08)_45%,transparent_72%)] blur-2xl" />
        <div className="absolute -right-[8%] bottom-[-25%] h-[420px] w-[420px] rounded-full border border-copper/20" />
      </div>
      <GrainOverlay opacity={0.05} />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-10">
        <FooterCTA />
        <FooterColumns />
        <FooterBottomBar />
      </div>
      <FooterWatermark />
    </footer>
  );
}
