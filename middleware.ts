import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define protected and public routes
const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const publicRoutes = ["/", "/sign-in", "/sign-up", "/about", "/investments"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(pathname);

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // If it's a protected route and no token, redirect to sign-in
  if (isProtectedRoute && !token) {
    console.log(
      `Protected route ${pathname} accessed without token, redirecting to sign-in`
    );
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If token exists, verify it
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);

      // If user is authenticated and tries to access sign-in/sign-up, redirect to dashboard
      if (pathname === "/sign-in" || pathname === "/sign-up") {
        console.log(
          "Authenticated user accessing auth pages, redirecting to dashboard"
        );
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.log("Invalid token, clearing cookie");
      // Invalid token, clear it and redirect to sign-in if accessing protected route
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
