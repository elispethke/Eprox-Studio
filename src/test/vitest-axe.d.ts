import "vitest";
import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  // Interface-merging is the documented augmentation pattern for vitest
  // matchers — the "empty" extends IS the mechanism.
  /* eslint-disable @typescript-eslint/no-empty-object-type */
  interface Assertion extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
  /* eslint-enable @typescript-eslint/no-empty-object-type */
}
