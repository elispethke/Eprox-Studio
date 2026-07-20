import "@testing-library/jest-dom/vitest";
import * as axeMatchers from "vitest-axe/matchers";
import { afterEach, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

expect.extend(axeMatchers);

// @testing-library/react's own auto-cleanup only registers when `afterEach`
// is a global (i.e. `test.globals: true`), which this project doesn't set.
// Without this, DOM from one test leaks into the next within the same file.
afterEach(() => {
  cleanup();
});

// next-intl's Link/usePathname/useRouter wrap next/navigation, which throws
// outside a real Next.js App Router request context. Component tests don't
// need real client-side routing — just a stable, renderable stand-in.
// Applies globally: setupFiles-level vi.mock affects every test file in the run.
vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement("a", { href, ...rest }, children),
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  redirect: vi.fn(),
}));

// jsdom lacks IntersectionObserver — framer-motion's whileInView needs it.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

// jsdom lacks matchMedia — framer-motion's useReducedMotion touches it.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
