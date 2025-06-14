import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile");

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!isLoggedIn && isProtectedRoute) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/sign-in?from=${encodeURIComponent(from)}`, request.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
