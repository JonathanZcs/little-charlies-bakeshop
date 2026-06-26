import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "lc_admin_session";
const HMAC_PAYLOAD = "lc-admin:v1";

export function createSessionToken(password: string): string {
  return createHmac("sha256", password).update(HMAC_PAYLOAD).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function isValidSession(cookieValue: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !cookieValue) return false;
  return safeEqualHex(createSessionToken(password), cookieValue);
}

/**
 * Validates an API request from either:
 *   1. an admin session cookie (browser callers), or
 *   2. an `x-admin-key` header containing the HMAC token (external callers).
 * Both compare with timing-safe equality. The raw password is never accepted.
 */
export function isAuthorizedRequest(req: {
  cookies: { get(name: string): { value: string } | undefined };
  headers: { get(name: string): string | null };
}): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const expected = createSessionToken(password);

  const cookieValue = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookieValue && safeEqualHex(expected, cookieValue)) return true;

  const headerValue = req.headers.get("x-admin-key");
  if (headerValue && safeEqualHex(expected, headerValue)) return true;

  return false;
}
