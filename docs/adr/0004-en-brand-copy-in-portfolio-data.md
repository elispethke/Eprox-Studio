# ADR 0004 — Portfolio/project copy stays in English across locales

**Status:** accepted · **Date:** 2026-07-19

## Context

The site UI is fully localized (EN/PT/DE), but project names, categories and
taglines in the showcase read as brand assets.

## Decision

Project data (`features/projects/data`, `features/projects-carousel/data`)
keeps its copy in English in every locale, like the wordmark itself. UI
strings around it (labels, buttons, announcements) are translated.

## Consequences

One source of truth for portfolio copy; no translation drift on brand
voice. If a client ever requires localized case studies, the data modules
gain per-locale fields — the UI layer already goes through `useTranslations`
and needs no change.
