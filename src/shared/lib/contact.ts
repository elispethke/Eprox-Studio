// Single source of truth for the studio's public contact details — used by
// the contact section and the footer so the two can never drift.
export const CONTACT_EMAIL = "contact@eproxstudio.com";
export const CONTACT_PHONE = "+49 17661610407";
export const CONTACT_ADDRESS = "Berlin, Germany";

// Brand glyphs were dropped from lucide, so socials use typographic
// monograms — which also suits the site's editorial voice.
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", monogram: "IG" },
  { label: "LinkedIn", href: "https://linkedin.com", monogram: "IN" },
  { label: "X", href: "https://x.com", monogram: "X" },
  { label: "Behance", href: "https://behance.net", monogram: "BE" },
] as const;
