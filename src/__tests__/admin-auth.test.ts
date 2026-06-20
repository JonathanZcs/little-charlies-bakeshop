import { describe, it, expect, vi, afterEach } from "vitest";
import { createHmac, timingSafeEqual } from "crypto";

// Mirrors the API route's isAuthorized check
function isAuthorized(headerValue: string | null, adminPassword: string | undefined): boolean {
  if (!adminPassword) return false;
  return headerValue === adminPassword;
}

// Mirrors admin-session helpers
const HMAC_PAYLOAD = "lc-admin:v1";

function createSessionToken(password: string): string {
  return createHmac("sha256", password).update(HMAC_PAYLOAD).digest("hex");
}

function isValidSession(cookieValue: string | undefined, password: string | undefined): boolean {
  if (!password || !cookieValue) return false;
  const expected = createSessionToken(password);
  if (expected.length !== cookieValue.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(cookieValue));
}

describe("Admin API authorization (x-admin-key header)", () => {
  const PASSWORD = "hunter2-secret";

  it("allows correct password", () => {
    expect(isAuthorized(PASSWORD, PASSWORD)).toBe(true);
  });

  it("rejects wrong password", () => {
    expect(isAuthorized("wrong", PASSWORD)).toBe(false);
  });

  it("rejects missing header (null)", () => {
    expect(isAuthorized(null, PASSWORD)).toBe(false);
  });

  it("rejects when ADMIN_PASSWORD env var is not set", () => {
    expect(isAuthorized(PASSWORD, undefined)).toBe(false);
  });

  it("rejects empty string header", () => {
    expect(isAuthorized("", PASSWORD)).toBe(false);
  });
});

describe("Admin session cookie (HMAC token)", () => {
  const PASSWORD = "hunter2-secret";

  it("valid token from correct password is accepted", () => {
    const token = createSessionToken(PASSWORD);
    expect(isValidSession(token, PASSWORD)).toBe(true);
  });

  it("rejects raw password stored in cookie (old insecure format)", () => {
    expect(isValidSession(PASSWORD, PASSWORD)).toBe(false);
  });

  it("rejects token generated with a different password", () => {
    const token = createSessionToken("other-password");
    expect(isValidSession(token, PASSWORD)).toBe(false);
  });

  it("rejects undefined cookie value", () => {
    expect(isValidSession(undefined, PASSWORD)).toBe(false);
  });

  it("rejects when ADMIN_PASSWORD is not set", () => {
    const token = createSessionToken(PASSWORD);
    expect(isValidSession(token, undefined)).toBe(false);
  });

  it("rejects tampered token", () => {
    const token = createSessionToken(PASSWORD);
    const tampered = token.slice(0, -4) + "0000";
    expect(isValidSession(tampered, PASSWORD)).toBe(false);
  });
});
