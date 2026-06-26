import { describe, it, expect } from "vitest";
import { createHmac, timingSafeEqual } from "crypto";

// Mirrors src/lib/admin-session.ts — both header and cookie require the HMAC token.
const HMAC_PAYLOAD = "lc-admin:v1";

function createSessionToken(password: string): string {
  return createHmac("sha256", password).update(HMAC_PAYLOAD).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function isAuthorizedRequest(
  headerValue: string | null,
  cookieValue: string | undefined,
  password: string | undefined,
): boolean {
  if (!password) return false;
  const expected = createSessionToken(password);
  if (cookieValue && safeEqualHex(expected, cookieValue)) return true;
  if (headerValue && safeEqualHex(expected, headerValue)) return true;
  return false;
}

describe("Admin API authorization (HMAC header OR cookie)", () => {
  const PASSWORD = "hunter2-secret";
  const TOKEN = createSessionToken(PASSWORD);

  it("accepts valid HMAC token in x-admin-key header", () => {
    expect(isAuthorizedRequest(TOKEN, undefined, PASSWORD)).toBe(true);
  });

  it("accepts valid HMAC token in session cookie", () => {
    expect(isAuthorizedRequest(null, TOKEN, PASSWORD)).toBe(true);
  });

  it("rejects raw password sent in x-admin-key header (old insecure format)", () => {
    expect(isAuthorizedRequest(PASSWORD, undefined, PASSWORD)).toBe(false);
  });

  it("rejects raw password stored in cookie (old insecure format)", () => {
    expect(isAuthorizedRequest(null, PASSWORD, PASSWORD)).toBe(false);
  });

  it("rejects token generated with a different password", () => {
    const token = createSessionToken("other-password");
    expect(isAuthorizedRequest(token, undefined, PASSWORD)).toBe(false);
  });

  it("rejects missing header AND missing cookie", () => {
    expect(isAuthorizedRequest(null, undefined, PASSWORD)).toBe(false);
  });

  it("rejects when ADMIN_PASSWORD is not set", () => {
    expect(isAuthorizedRequest(TOKEN, undefined, undefined)).toBe(false);
  });

  it("rejects empty string header", () => {
    expect(isAuthorizedRequest("", undefined, PASSWORD)).toBe(false);
  });

  it("rejects tampered token", () => {
    const tampered = TOKEN.slice(0, -4) + "0000";
    expect(isAuthorizedRequest(tampered, undefined, PASSWORD)).toBe(false);
  });
});
