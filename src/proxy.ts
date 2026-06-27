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

// Non-CSP security headers. X-Frame-Options removed in favour of CSP
// frame-ancestors which supports domain allowlisting. jzajac.dev is permitted
// so the portfolio can embed a live preview; all other origins are blocked.
function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://jzajac.dev https://www.jzajac.dev",
  );
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin auth gate (unchanged)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const password = process.env.ADMIN_PASSWORD;
    const session = request.cookies.get(COOKIE_NAME)?.value;
    if (!password || !isValidSession(session, password)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    // Run on every page + API route but skip Next internals and static assets.
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|images/|icons/|file\\.svg|globe\\.svg|window\\.svg|next\\.svg|vercel\\.svg).*)",
  ],
};
