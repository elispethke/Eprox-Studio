import GrainOverlay from "@/shared/components/ui/GrainOverlay";
import SectionLabel from "@/shared/components/ui/SectionLabel";

export interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageProps {
  kicker: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}

/**
 * Shared shell for the legal pages (/privacy, /terms): the light linen
 * world of the contact section — serif title, copper kicker, quiet copper
 * rings — with a measured editorial column for the clauses.
 */
export default function LegalPage({
  kicker,
  title,
  updated,
  sections,
}: LegalPageProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative overflow-hidden bg-linen pb-24 pt-36 outline-none md:pb-32 md:pt-44"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[12%] top-[-15%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(212,152,110,0.2)_0%,rgba(232,194,160,0.08)_45%,transparent_72%)] blur-2xl" />
        <div className="absolute -left-[8%] bottom-[-20%] h-[420px] w-[420px] rounded-full border border-copper/20" />
      </div>
      <GrainOverlay opacity={0.05} />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6">
        <SectionLabel>{kicker}</SectionLabel>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-espresso sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-espresso/60">
          {updated}
        </p>

        <div className="mt-14 space-y-12">
          {sections.map((section, index) => (
            <section key={section.heading}>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-copper">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-xl text-espresso sm:text-2xl">
                  {section.heading}
                </h2>
              </div>
              <p className="mt-4 pl-9 font-subtitle text-sm leading-relaxed text-espresso/70 sm:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
