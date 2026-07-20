import { z } from "zod";

// Server-only environment contract. Parsed lazily (not at module load) so
// CI builds without secrets still succeed — hard requirements are enforced
// the moment a request actually needs them, with a clear message instead of
// an undefined-var failure deep inside a handler.
const serverEnvSchema = z.object({
  /** Real contact-form upstream. Required in production, optional in dev/test. */
  FORMSPREE_ENDPOINT: z.url().optional(),
  /** Optional Upstash Redis pair — enables distributed rate limiting when both are set. */
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  /** Optional error-tracking DSN — observability instrumentation no-ops without it. */
  SENTRY_DSN: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`[env] Invalid server environment: ${details}`);
  }

  if (
    process.env.NODE_ENV === "production" &&
    !parsed.data.FORMSPREE_ENDPOINT
  ) {
    throw new Error(
      "[env] FORMSPREE_ENDPOINT is required in production — set it in the deployment environment (see .env.example)."
    );
  }

  cached = parsed.data;
  return cached;
}
