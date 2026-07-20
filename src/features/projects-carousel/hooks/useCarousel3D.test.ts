import { describe, expect, it } from "vitest";
import {
  buildCarouselMetrics,
  computeCardTransform,
  wrapOffset,
} from "./useCarousel3D";

const metrics = buildCarouselMetrics(620);

describe("wrapOffset", () => {
  it("returns the raw offset when already within half the ring", () => {
    expect(wrapOffset(1, 7)).toBe(1);
    expect(wrapOffset(-2, 7)).toBe(-2);
    expect(wrapOffset(0, 7)).toBe(0);
  });

  it("wraps across the seam to the shortest signed distance", () => {
    // index 6 seen from position 0 on a 7-ring is one step to the LEFT.
    expect(wrapOffset(6, 7)).toBe(-1);
    expect(wrapOffset(-6, 7)).toBe(1);
  });

  it("is periodic: full turns collapse to the same offset", () => {
    expect(wrapOffset(1 + 7 * 3, 7)).toBe(1);
    expect(wrapOffset(-2 - 7 * 5, 7)).toBe(-2);
  });

  it("handles fractional positions (mid-animation)", () => {
    expect(wrapOffset(6.5, 7)).toBeCloseTo(-0.5);
  });
});

describe("computeCardTransform", () => {
  it("renders the focused card front and center at full presence", () => {
    const t = computeCardTransform(0, metrics);
    expect(t.x).toBeCloseTo(0);
    expect(t.z).toBeCloseTo(0);
    expect(t.rotateY).toBeCloseTo(0);
    expect(t.scale).toBe(1);
    expect(t.opacity).toBe(1);
    expect(t.width).toBe(metrics.centerWidth);
    expect(t.blur).toBe(0);
    expect(t.brightness).toBe(1);
  });

  it("recedes side cards in real depth, turned inward and dimmed", () => {
    const right = computeCardTransform(1, metrics);
    expect(right.x).toBeGreaterThan(0);
    expect(right.z).toBeLessThan(0);
    expect(right.rotateY).toBeLessThan(0); // right card turns toward center
    expect(right.scale).toBeLessThan(1);
    expect(right.width).toBe(metrics.sideWidth);
    expect(right.brightness).toBeLessThan(1);
    expect(right.blur).toBeGreaterThan(0);
  });

  it("is horizontally symmetric", () => {
    const left = computeCardTransform(-1, metrics);
    const right = computeCardTransform(1, metrics);
    expect(left.x).toBeCloseTo(-right.x);
    expect(left.rotateY).toBeCloseTo(-right.rotateY);
    expect(left.scale).toBeCloseTo(right.scale);
    expect(left.opacity).toBeCloseTo(right.opacity);
  });

  it("fades cards fully out at the visibility horizon", () => {
    expect(computeCardTransform(3, metrics).opacity).toBe(0);
    expect(computeCardTransform(3.5, metrics).opacity).toBe(0);
  });

  it("keeps zIndex strictly decreasing away from center", () => {
    const z0 = computeCardTransform(0, metrics).zIndex;
    const z1 = computeCardTransform(1, metrics).zIndex;
    const z2 = computeCardTransform(2, metrics).zIndex;
    expect(z0).toBeGreaterThan(z1);
    expect(z1).toBeGreaterThan(z2);
  });
});
