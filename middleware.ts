import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; // Replace with actual path to your getSession function

export async function middleware(req: Request) {
  const session = await getSession();

  if (!session) {
    // Redirect to login page if no session exists
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Continue to the requested route
  return NextResponse.next();
}

// Define the routes that require middleware
export const config = {
  matcher: ['/protected-route/:path*'], // Replace with your protected route paths
};
