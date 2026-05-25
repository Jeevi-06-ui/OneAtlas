import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session-token";

const AUTH_PATHS = new Set(["/login", "/register", "/logout"]);
const PUBLIC_API_PREFIXES = ["/api/auth/login", "/api/auth/register", "/api/auth/logout"];

function isPublicPath(pathname: string) {
  if (AUTH_PATHS.has(pathname)) {
    return true;
  }
  if (pathname.startsWith("/preview/")) {
    return true;
  }
  if (pathname.startsWith("/api/preview/")) {
    return true;
  }
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token && AUTH_PATHS.has(pathname)) {
      const session = await verifySessionToken(token);
      if (session) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifySessionToken(token);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
