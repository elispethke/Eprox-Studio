# ADR 0001 — Contact form goes through a server relay

**Status:** accepted · **Date:** 2026-07-19

## Context

The form provider endpoint (Formspree) must never appear in the client
bundle, in DevTools network calls, or in versioned source.

## Decision

The client posts only to the internal `/api/contact` route handler. The real
endpoint lives in the non-public `FORMSPREE_ENDPOINT` env var and is called
server-side. The handler validates with the shared zod schema, answers
filled honeypots with a fake success (bots learn nothing), rate-limits by IP
(Upstash Redis when configured; in-memory single-node fallback), and returns
only `{ success: boolean }` — provider errors are logged server-side, never
surfaced.

## Consequences

Swapping form providers is a one-line env change. The client bundle carries
zero knowledge of the provider. Local dev disables rate limiting entirely.
