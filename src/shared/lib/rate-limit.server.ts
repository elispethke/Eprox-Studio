import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getServerEnv } from "./env.server";

const WINDOW_SECONDS = 10 * 60;
const MAX_PER_WINDOW = 5;

// ---- Distributed limiter (production-grade) --------------------------------
// When the Upstash pair is configured, limits are enforced across every
// serverless instance via a sliding window in Redis.
let upstash: Ratelimit | null | undefined;

function getUpstash(): Ratelimit | null {
  if (upstash !== undefined) return upstash;
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = getServerEnv();
  upstash =
    UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
      ? new Ratelimit({
          redis: new Redis({
            url: UPSTASH_REDIS_REST_URL,
            token: UPSTASH_REDIS_REST_TOKEN,
          }),
          limiter: Ratelimit.slidingWindow(
            MAX_PER_WINDOW,
            `${WINDOW_SECONDS} s`
          ),
          prefix: "eprox:contact",
        })
      : null;
  return upstash;
}

// ---- In-memory fallback ----------------------------------------------------
// Single-instance only (resets on restart, not shared across replicas):
// fine for local dev and self-hosted single-node deploys, and the reason
// the Upstash path above exists for serverless production.
const memoryLog = new Map<string, number[]>();

function isMemoryLimited(key: string): boolean {
  const now = Date.now();
  const windowMs = WINDOW_SECONDS * 1000;
  const recent = (memoryLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < windowMs
  );
  if (recent.length >= MAX_PER_WINDOW) {
    memoryLog.set(key, recent);
    return true;
  }
  recent.push(now);
  memoryLog.set(key, recent);
  return false;
}

/**
 * True when `key` (normally the client IP) has exceeded the submission
 * budget. Uses Upstash Redis when configured, the in-memory window
 * otherwise, and is disabled in development so local testing never trips it.
 */
export async function isRateLimited(key: string): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return false;

  const limiter = getUpstash();
  if (limiter) {
    try {
      const { success } = await limiter.limit(key);
      return !success;
    } catch (error) {
      // Redis being unreachable must not take the contact form down.
      console.error("[rate-limit] upstash unavailable, falling back", error);
      return isMemoryLimited(key);
    }
  }
  return isMemoryLimited(key);
}
