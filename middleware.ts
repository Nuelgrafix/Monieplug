import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected and public routes
const protectedRoutes = ["/dashboard"];
const authRoutes = ["/signin", "/signup"];
const publicRoutes = ["/", "/landingpage"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication status from Redux USER token
  const token = request.cookies.get("USER")?.value;
  const isAuthenticated = !!token;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  // If accessing protected route without authentication, redirect to signin
  if (isProtectedRoute && !isAuthenticated) {
    const signinUrl = new URL("/signin", request.url);
    // Add the current path as a redirect parameter
    signinUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // If accessing auth routes while authenticated, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If accessing root path and authenticated, redirect to dashboard
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If accessing root path and not authenticated, redirect to landing page
  if (pathname === "/" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/landingpage", request.url));
  }

  // Allow all other requests to proceed
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
     * - public files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
