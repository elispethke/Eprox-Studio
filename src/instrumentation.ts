import type { Instrumentation } from "next";

/**
 * Server observability hooks. `onRequestError` receives every uncaught
 * server-side error (RSC render, route handlers, middleware) and logs it as
 * structured JSON — the single place to plug an APM/error tracker (e.g.
 * Sentry: call `Sentry.captureRequestError` here once the SDK is added,
 * gated on the SENTRY_DSN env var).
 */
export async function register(): Promise<void> {
  // Reserved for SDK boot (OpenTelemetry / Sentry.init) — intentionally
  // empty until a tracking backend is provisioned.
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  console.error(
    "[server-error]",
    JSON.stringify({
      message: error instanceof Error ? error.message : String(error),
      digest:
        typeof error === "object" && error !== null && "digest" in error
          ? (error as { digest?: string }).digest
          : undefined,
      path: request.path,
      method: request.method,
      routerKind: context.routerKind,
      routeType: context.routeType,
    })
  );
};
