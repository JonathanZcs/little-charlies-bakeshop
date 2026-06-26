import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "lc_admin_session";
const HMAC_PAYLOAD = "lc-admin:v1";
const ADMIN_SUBDOMAIN = "admin.littlecharliesbakeshop.com";

function isValidSession(cookieValue: string | undefined, password: string): boolean {
  if (!cookieValue) return false;
  const expected = createHmac("sha256", password).update(HMAC_PAYLOAD).digest("hex");
  if (expected.length !== cookieValue.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(cookieValue));
}

// Content Security Policy — kept permissive for inline (Next hydration markers + scripts).
// va.vercel-scripts.com / vitals.vercel-insights.com cover Vercel Analytics.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("Content-Security-Policy", CSP);
  return response;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname, search } = request.nextUrl;

  const isAdminSubdomain = host === ADMIN_SUBDOMAIN || host.startsWith("admin.");
  // Vercel preview URLs (.vercel.app) and any local dev host serve /admin/* directly —
  // no subdomain redirect. Match localhost/127.0.0.1 on any port (dev servers shift ports).
  const isPreview =
    host.endsWith(".vercel.app") ||
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");

  // Main domain: redirect /admin/* → admin subdomain (skip on preview)
  if (!isAdminSubdomain && !isPreview && pathname.startsWith("/admin")) {
    const cleanPath = pathname.slice("/admin".length) || "/";
    return NextResponse.redirect(
      new URL(`https://${ADMIN_SUBDOMAIN}${cleanPath}${search}`),
      { status: 301 }
    );
  }

  if (isAdminSubdomain) {
    // Server actions redirect to /admin/* — strip the prefix so URLs stay clean
    if (pathname.startsWith("/admin")) {
      const cleanPath = pathname.slice("/admin".length) || "/";
      const target = request.nextUrl.clone();
      target.pathname = cleanPath;
      return NextResponse.redirect(target);
    }

    // Auth check before rewriting
    const rewrittenPath = pathname === "/" ? "/admin" : `/admin${pathname}`;
    const isLoginPage = rewrittenPath === "/admin/login" || rewrittenPath.startsWith("/admin/login/");

    if (!isLoginPage) {
      const password = process.env.ADMIN_PASSWORD;
      const session = request.cookies.get(COOKIE_NAME)?.value;
      if (!password || !isValidSession(session, password)) {
        const loginUrl = new URL("/login", `https://${host}`);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Rewrite clean admin URLs → /admin/* so Next.js App Router picks them up
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = rewrittenPath;
    return applySecurityHeaders(NextResponse.rewrite(rewritten));
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|file.svg|globe.svg|window.svg|next.svg|vercel.svg).*)",
  ],
};
