import { useTranslations } from "next-intl";
import GrainOverlay from "@/shared/components/ui/GrainOverlay";
import PillButton from "@/shared/components/ui/PillButton";
import SectionLabel from "@/shared/components/ui/SectionLabel";

/**
 * Branded 404 — the same obsidian/copper world as the hero: giant serif
 * numerals with the copper italic accent, glow, grain, and a single way
 * back home.
 */
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-obsidian px-6 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,121,60,0.18)_0%,rgba(201,121,60,0.06)_45%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-rust/15"
      />
      <GrainOverlay opacity={0.05} />

      <div className="relative z-10 flex flex-col items-center">
        <SectionLabel>{t("kicker")}</SectionLabel>
        <p className="mt-6 font-display text-[7rem] leading-none tracking-tight text-sand sm:text-[10rem]">
          4
          <em className="bg-gradient-to-br from-rust-light via-rust to-rust-dark bg-clip-text italic text-transparent">
            0
          </em>
          4
        </p>
        <h1 className="mt-6 max-w-md font-display text-2xl tracking-tight text-sand sm:text-3xl">
          {t("headline")}
        </h1>
        <p className="mt-4 max-w-sm font-subtitle text-sm text-sand/60 sm:text-base">
          {t("body")}
        </p>
        <div className="mt-10">
          <PillButton href="/">{t("backHome")}</PillButton>
        </div>
      </div>
    </main>
  );
}
