# ADR 0002 — Consent stored in a first-party cookie, no web storage

**Status:** accepted · **Date:** 2026-07-19

## Context

The project bans localStorage/sessionStorage outright, and the consent
choice must survive reloads for a bounded period.

## Decision

`eprox-consent=accepted|declined` first-party cookie, `Max-Age` 180 days,
`SameSite=Lax`. The modal opens only when the cookie is absent; choosing
dispatches the `eprox:consent` window event so consent-gated loaders
(`ConsentAnalytics`) can react live. Analytics scripts load **only** after
an explicit accept — declining keeps the page third-party-free.

## Consequences

Semantics match the feature (cookie consent in a cookie), GDPR-friendly by
construction, and the storage ban holds. Preloader "once per session" uses a
module-scope flag instead, so hard reloads replay it by design.
