// TS mirror of the palette for canvas/WebGL/JS consumers (flow lines, 3D
// scene) that can't read CSS custom properties. The authoritative CSS-side
// declaration lives in src/shared/styles/globals.css — change BOTH together.
// Copy lives in lib/i18n/dictionaries/*.json (see useTranslations), not here.

export const brandColors = {
  obsidian: "#0A0A0A",
  obsidianDeep: "#0D0D0D",
  sand: "#F2EFE9",
  rust: "#C9793C",
  rustLight: "#D98A4A",
  rustDark: "#A4512C",
  sage: "#7A8471",
  silver: "#E2E8F0",
  linen: "#EFEBE3",
  espresso: "#2B2420",
  copperLight: "#E8C2A0",
  copper: "#D4986E",
} as const;

export const brandFonts = {
  display: "var(--font-display)",
  subtitle: "var(--font-manrope)",
  mono: "var(--font-space-mono)",
} as const;
