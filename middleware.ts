import { auth } from "@/auth";

import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up");
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/profile");

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users to sign in for protected routes
  if (!isLoggedIn && isProtectedRoute) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const protectedRoutes = ["/dashboard", "/profile", "/settings", "/investments"];
// const authRoutes = ["/sign-in", "/sign-up"];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );
//   const isAuthRoute = authRoutes.includes(pathname);

//   const token = request.cookies.get("auth-token")?.value;

//   if (isProtectedRoute && !token) {
//     console.log(
//       `Protected route ${pathname} accessed without token, redirecting to sign-in`
//     );
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   if (token) {
//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//       const { payload } = await jwtVerify(token, secret);

//       if (isAuthRoute) {
//         console.log(
//           "Authenticated user accessing auth pages, redirecting to dashboard"
//         );
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       }

//       // Adding user info to headers for server components
//       const response = NextResponse.next();
//       response.headers.set("x-user-id", payload.userId as string);
//       response.headers.set("x-user-email", payload.email as string);
//       response.headers.set("x-user-roles", JSON.stringify(payload.roles || []));
//       return response;
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       console.log("Invalid or expired token, clearing cookie");
//       const response = NextResponse.redirect(new URL("/sign-in", request.url));
//       response.cookies.delete("auth-token");
//       return response;
//     }
//   }

//   if (isProtectedRoute) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
