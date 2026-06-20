import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "lc_admin_session";
const HMAC_PAYLOAD = "lc-admin:v1";

function isValidSession(cookieValue: string | undefined, password: string): boolean {
  if (!cookieValue) return false;
  const expected = createHmac("sha256", password).update(HMAC_PAYLOAD).digest("hex");
  if (expected.length !== cookieValue.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(cookieValue));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD;
  const session = request.cookies.get(COOKIE_NAME)?.value;

  if (!password || !isValidSession(session, password)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
