# Contributing — Eprox Studio

## Workflow

1. Branch from `main`; keep PRs focused.
2. `npm run typecheck && npm run lint && npm test` must pass locally — CI
   runs the same gates plus a production build.
3. Pre-commit hooks (husky + lint-staged) auto-fix staged files; don't skip
   them.

## Conventions

- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`,
  `test:`, `chore:`), imperative mood, English.
- **Architecture:** features expose their public API via `index.ts`
  (`schema.ts` additionally for server contracts). The boundaries lint will
  fail deep cross-feature imports — that's intentional; add to the barrel
  instead.
- **Design tokens:** never hardcode palette hex in components. Tailwind
  token classes resolve from the CSS variables in
  `src/shared/styles/globals.css`; the TS mirror is
  `src/shared/lib/brand.ts` (change both together).
- **Motion:** every animation must have a `prefers-reduced-motion` path.
  Framer's `useReducedMotion` for components; check `matchMedia` in raw
  hooks.
- **i18n:** any user-facing string goes through `useTranslations` and lands
  in all three dictionaries (`en`, `pt`, `de`) in the same change.
- **Accessibility:** interactive additions ship with labels/roles and, where
  reasonable, an axe assertion in the suite.

## Adding a feature

```
src/features/<name>/
  components/   hooks/   (data/ | schema.ts | types.ts as needed)
  index.ts      # the ONLY import surface for the rest of the app
```

Wire pages through `src/app/[locale]/…` and keep server-only code out of
client barrels (export server contracts from `schema.ts`, like
contact-form does).
