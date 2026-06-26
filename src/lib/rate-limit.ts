import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Limiter = { check: (identifier: string) => Promise<{ success: boolean; reset: number; remaining: number }> };

function buildLimiter(): Limiter | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: false,
    prefix: "lc:contact",
  });

  return {
    async check(identifier: string) {
      const r = await ratelimit.limit(identifier);
      return { success: r.success, reset: r.reset, remaining: r.remaining };
    },
  };
}

let cached: Limiter | null | undefined;

function get(): Limiter | null {
  if (cached === undefined) cached = buildLimiter();
  return cached;
}

/**
 * Rate-limit a request by identifier (typically IP).
 * Returns null when no limiter is configured (env vars missing) — caller should treat as allowed.
 */
export async function rateLimitContact(identifier: string) {
  const limiter = get();
  if (!limiter) return null;
  return limiter.check(identifier);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
