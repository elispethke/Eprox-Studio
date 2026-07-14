// Single source of truth for Eprox Studio brand tokens.
// Copy lives in lib/i18n/dictionaries/*.json (see useTranslations), not here.

export const brandColors = {
  obsidian: "#0B0C0E",
  sand: "#F2EFE9",
  rust: "#C36A3F",
  rustDark: "#A4512C",
  sage: "#7A8471",
  silver: "#E2E8F0",
} as const;

export const brandFonts = {
  // TODO: swap for Clash Display (Fontshare) or Casko once added to public/fonts.
  display: "var(--font-display)",
  subtitle: "var(--font-manrope)",
  mono: "var(--font-space-mono)",
} as const;
