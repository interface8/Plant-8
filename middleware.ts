import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/profile", "/settings", "/investments"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  const token = request.cookies.get("auth-token")?.value;

  if (isProtectedRoute && !token) {
    console.log(
      `Protected route ${pathname} accessed without token, redirecting to sign-in`
    );
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      if (isAuthRoute) {
        console.log(
          "Authenticated user accessing auth pages, redirecting to dashboard"
        );
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Adding user info to headers for server components
      const response = NextResponse.next();
      response.headers.set("x-user-id", payload.userId as string);
      response.headers.set("x-user-email", payload.email as string);
      response.headers.set("x-user-roles", JSON.stringify(payload.roles || []));
      return response;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log("Invalid token, clearing cookie");

      if (isProtectedRoute) {
        const response = NextResponse.redirect(
          new URL("/sign-in", request.url)
        );
        response.cookies.delete("auth-token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
