/**
 * Simple in-memory rate limiter for development.
 *
 * PRODUCTION NOTE: Replace this with Upstash Redis rate limiting or a
 * similar persistent solution. In-memory state resets on every server
 * restart and does not work across multiple instances.
 *
 * Recommended production library: @upstash/ratelimit + @upstash/redis
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/** Remove expired entries to prevent unbounded memory growth */
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}

/**
 * Check whether a key (e.g. IP + route) has exceeded the allowed limit.
 * @param key     Unique identifier (e.g. "budget-request:192.168.1.1")
 * @param limit   Maximum requests allowed in the window
 * @param windowMs Window size in milliseconds (default 60 000 = 1 minute)
 * @returns { allowed: boolean; remaining: number; resetAt: number }
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  entry.count += 1;

  if (entry.count > limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/** Rate limit presets for common routes */
export const RATE_LIMITS = {
  ORDER_CREATE: { limit: 5, windowMs: 60_000 },        // 5 orders/min
  BUDGET_REQUEST: { limit: 3, windowMs: 60_000 },       // 3 requests/min
  IMAGE_UPLOAD: { limit: 20, windowMs: 60_000 },        // 20 uploads/min
  CONTACT_FORM: { limit: 3, windowMs: 300_000 },        // 3 per 5 min
} as const;
