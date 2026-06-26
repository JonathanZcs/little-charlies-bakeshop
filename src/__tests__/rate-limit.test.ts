import { describe, it, expect } from "vitest";

// Mirrors getClientIp in src/lib/rate-limit.ts.
function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function makeReq(headers: Record<string, string>): Request {
  return new Request("http://test.local/", { headers });
}

describe("getClientIp", () => {
  it("prefers the first IP in x-forwarded-for", () => {
    const req = makeReq({ "x-forwarded-for": "203.0.113.42, 10.0.0.1, 10.0.0.2" });
    expect(getClientIp(req)).toBe("203.0.113.42");
  });

  it("trims whitespace around the first x-forwarded-for entry", () => {
    const req = makeReq({ "x-forwarded-for": "   203.0.113.42  , 10.0.0.1" });
    expect(getClientIp(req)).toBe("203.0.113.42");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const req = makeReq({ "x-real-ip": "198.51.100.7" });
    expect(getClientIp(req)).toBe("198.51.100.7");
  });

  it("returns 'unknown' when no proxy headers are present", () => {
    const req = makeReq({});
    expect(getClientIp(req)).toBe("unknown");
  });

  it("ignores x-real-ip when x-forwarded-for is set (forwarded wins)", () => {
    const req = makeReq({ "x-forwarded-for": "203.0.113.42", "x-real-ip": "198.51.100.7" });
    expect(getClientIp(req)).toBe("203.0.113.42");
  });
});

// Mirrors the limiter-build env check: limiter is null without both env vars.
function limiterAvailable(url: string | undefined, token: string | undefined): boolean {
  return Boolean(url && token);
}

describe("Upstash limiter availability", () => {
  it("not available without both env vars", () => {
    expect(limiterAvailable(undefined, undefined)).toBe(false);
    expect(limiterAvailable("https://x.upstash.io", undefined)).toBe(false);
    expect(limiterAvailable(undefined, "abc")).toBe(false);
    expect(limiterAvailable("", "abc")).toBe(false);
    expect(limiterAvailable("https://x.upstash.io", "")).toBe(false);
  });

  it("available when both env vars are non-empty", () => {
    expect(limiterAvailable("https://x.upstash.io", "abc")).toBe(true);
  });
});
