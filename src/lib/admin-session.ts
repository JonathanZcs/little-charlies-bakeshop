import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "lc_admin_session";
const HMAC_PAYLOAD = "lc-admin:v1";

export function createSessionToken(password: string): string {
  return createHmac("sha256", password).update(HMAC_PAYLOAD).digest("hex");
}

export function isValidSession(cookieValue: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  // Dev bypass: no password configured + running locally = open access
  if (!password && process.env.NODE_ENV === "development") return true;
  if (!password || !cookieValue) return false;
  const expected = createSessionToken(password);
  if (expected.length !== cookieValue.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(cookieValue));
}
