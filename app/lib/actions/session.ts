"use server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Destroy the session - clear both session and USER tokens for Redux compatibility
export async function logout(path: string) {
  const cookieStore = await cookies();
  // Clear old session cookie
  cookieStore.set("session", "", { expires: new Date(0) });
  // Clear Redux USER token
  cookieStore.set("USER", "", { expires: new Date(0) });
  redirect(path);
}

// Get session - try both session and USER tokens for compatibility
export async function getSession() {
  const cookieStore = await cookies();
  // First try the Redux USER token
  const userToken = cookieStore.get("USER")?.value;
  if (userToken) {
    try {
      const userData = JSON.parse(userToken);
      return {
        user: userData,
        token: userToken,
        type: 'redux'
      };
    } catch (error) {
      // If parsing fails, continue to check session
    }
  }

  // Fallback to old session cookie
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  try {
    const parsedData = JSON.parse(session);
    return {
      ...parsedData,
      type: 'legacy'
    };
  } catch (error) {
    return null;
  }
}

// Update session - handle both Redux USER tokens and legacy sessions
export async function updateSession(request: NextRequest) {
  const cookieStore = await cookies();

  // Check for Redux USER token first
  const userToken = request.cookies.get("USER")?.value;
  if (userToken) {
    const res = NextResponse.next();
    // Refresh the USER token expiration
    cookieStore.set({
      name: "USER",
      value: userToken,
      httpOnly: false, // Allow client-side access for Redux
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      path: "/",
    });
    return res;
  }

  // Fallback to legacy session handling
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = session;
  const res = NextResponse.next();
  cookieStore.set({
    name: "session",
    value: parsed,
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
  });

  return res;
}

// Helper function to check authentication status
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

// Helper function to get user from session
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}
