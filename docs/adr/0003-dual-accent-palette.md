# ADR 0003 — Dual copper accent: rust on dark, copper on light

**Status:** accepted · **Date:** 2026-07-19

## Context

The site is two worlds: obsidian (hero → showcase) and linen
(contact → footer). One copper value cannot sit correctly on both.

## Decision

Two deliberate accent families sharing one temperature: `rust`
(#C9793C/±) carries the accent on dark surfaces; `copper`
(#D4986E/#E8C2A0) carries it on light ones. Both live as CSS custom
properties in `globals.css` (single source), mirrored in `brand.ts` for
canvas/WebGL consumers. Decorative rgba() gradients in effect layers may
inline these values — they are tuned per effect and documented here as
intentional.

## Consequences

Accent contrast stays correct in both worlds without per-usage overrides.
Any palette change edits exactly two files (CSS vars + TS mirror).
