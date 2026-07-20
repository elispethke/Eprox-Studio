# Eprox Studio

Premium digital-engineering studio site — cinematic dark hero (liquid-copper
video), 3D project showcase, glassmorphism contact experience, and a light
linen closing world. Next.js App Router, fully localized (EN default / PT / DE).

## Stack

| Layer     | Choice                                                                             |
| --------- | ---------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript strict                             |
| Styling   | Tailwind CSS 3 — tokens via CSS custom properties (see below)                      |
| Motion    | Framer Motion (components) · GSAP + ScrollTrigger (scroll) · Lenis (smooth scroll) |
| 3D        | three / React Three Fiber (route-split, `/work` only)                              |
| i18n      | next-intl (`src/lib/i18n`), locale-prefixed routes, EN default                     |
| Forms     | zod schema shared client/server · server relay to Formspree                        |
| Tests     | Vitest + Testing Library + vitest-axe                                              |

## Getting started

```bash
npm ci
cp .env.example .env.local   # fill FORMSPREE_ENDPOINT (see file for all vars)
npm run dev                  # http://localhost:3000 → redirects to /en
```

### Scripts

| Script                            | Purpose                                     |
| --------------------------------- | ------------------------------------------- |
| `npm run dev`                     | Dev server (Turbopack)                      |
| `npm run build`                   | Production build                            |
| `npm run typecheck`               | `tsc --noEmit`                              |
| `npm run lint`                    | ESLint (includes architecture boundaries)   |
| `npm test`                        | Vitest suite (unit + a11y/axe)              |
| `node scripts/generate-icons.mjs` | Regenerate favicons from `src/app/icon.svg` |

## Architecture

```
src/
  app/                  # routes, layouts, metadata, route handlers, sitemap/robots
  features/             # one folder per product feature; public API = index.ts
    home/               #   hero (video, flow-lines canvas)
    vision/  foundation/ #  editorial sticky sections
    projects-carousel/  #   3D showcase ring (autoplay, drag, wheel, keyboard)
    projects/  work/    #   portfolio data + /work page pieces
    contact-form/       #   glass form + shared zod schema (schema.ts is public)
    footer/  consent/  legal/  experience/  # site chrome & rituals
  shared/               # design-system primitives, hooks, lib, styles
  lib/i18n/             # next-intl config + dictionaries (en/pt/de)
```

Rules enforced by `eslint-plugin-boundaries` (not just convention):
features are imported **only** through `index.ts` (plus `schema.ts` for
server contracts); `shared` never imports features; deep cross-feature
imports fail the lint.

### Design tokens

The palette lives once, as RGB-triplet CSS custom properties in
`src/shared/styles/globals.css`; `tailwind.config.ts` maps every color to
`rgb(var(--…) / <alpha-value>)`. `src/shared/lib/brand.ts` is the TS mirror
for canvas/WebGL consumers — change both together.

### Contact relay (security)

The Formspree endpoint exists **only** in the non-public `FORMSPREE_ENDPOINT`
env var. The client posts to `/api/contact`, which validates (zod), applies a
honeypot and IP rate limiting (Upstash Redis when configured, in-memory
fallback), then forwards server-side. See `docs/adr/0001-contact-relay.md`.

## Quality gates

- **CI** (`.github/workflows/ci.yml`): typecheck → lint → tests → build on every PR.
- **Pre-commit**: husky + lint-staged (eslint --fix + prettier on staged files).
- **Observability**: Web Vitals beacon → `/api/vitals`; server errors →
  structured logs via `src/instrumentation.ts` (Sentry-ready, DSN-gated).
- **A11y**: skip-link, carousel pause control + live announcements, consent
  modal focus trap/inert, axe assertions in the test suite,
  `prefers-reduced-motion` honored everywhere (including the hero video).

## Decisions

Short ADRs live in `docs/adr/`. Highlights: contact relay pattern (0001),
cookie-based consent with no web storage (0002), dual accent palette
rust-on-dark / copper-on-light (0003), EN-only brand copy in portfolio data
(0004).
