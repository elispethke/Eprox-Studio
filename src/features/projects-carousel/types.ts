export interface CarouselProject {
  id: string;
  title: string;
  /** Uppercase category line, e.g. "Architecture, Web Design". */
  category: string;
  description: string;
  coverImage: string;
  href: string;
}

/** Everything the visual layer needs to place one card, derived purely from its offset to the active index. */
export interface CardTransform {
  /** Horizontal displacement from the track center, in px. */
  x: number;
  /** Real depth (translateZ) in px — 0 for the focused card, receding negative for the sides. */
  z: number;
  scale: number;
  /** Perspective rotation in degrees — side cards turn inward, toward the center. */
  rotateY: number;
  /** Card width in px — the focused card is ~2x the side cards. */
  width: number;
  /** Card height in px — sides read slightly more portrait than the focused card. */
  height: number;
  opacity: number;
  zIndex: number;
  /** Depth-of-field blur radius in px (0 for the focused card). */
  blur: number;
  /** Lighting: CSS brightness factor — 1 on the focused card, dimming with depth. */
  brightness: number;
  /** Drop-shadow strength (0–1) — strongest on the focused card. */
  shadowOpacity: number;
}
