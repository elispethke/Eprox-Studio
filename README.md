# Eprox Studio

Scaffolding phase only — no sections, no animations, no i18n yet.

## Stack (this phase)

- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS 3 (`tailwind.config.ts`, brand tokens: `obsidian`, `sand`, `rust`/`rust-dark`, `sage`, `silver`)
- ESLint (Next.js default config) + Prettier (`.prettierrc`, wired into ESLint via `eslint-config-prettier`)
- Fonts via `next/font/google`: Manrope (subtitle), Space Mono (technical/data body). `--font-display` is temporarily aliased to Manrope — see the TODO in `app/layout.tsx` to swap in Clash Display (Fontshare) or Casko font files under `public/fonts`.

## Installed, not yet used

These libs are in `package.json` and build cleanly, but no component references them yet:

- `framer-motion`
- `gsap`
- `three`, `@react-three/fiber`, `@react-three/drei`
- `lenis`

## Project structure

```
app/            layout.tsx, page.tsx (placeholder), globals.css
components/
  ui/           (empty — reusable UI primitives)
  sections/     (empty — page sections: Hero, Vision, Foundation, Mission)
lib/            brand.ts (colors, font vars, draft hero copy — unused by components yet)
hooks/          (empty)
types/          (empty)
public/
  fonts/        (empty — Casko/Clash Display files go here)
  images/       (empty)
```

## Next phases

1. **Sections** — build out Hero, Vision, Foundation, Mission using the brand tokens/copy in `lib/brand.ts`.
2. **Animation** — Framer Motion for component-level motion, GSAP + ScrollTrigger for scroll-driven sequences.
3. **3D** — React Three Fiber / drei scenes.
4. **Smooth scroll** — Lenis.
5. **i18n** — EN / PT / DE.
6. **Backend** — API routes, Prisma/Postgres (to be defined).
