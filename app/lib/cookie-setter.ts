"use server";

import { cookies } from "next/headers";

export async function setCookie(key: string, value: string) {
  const cookieStore = await cookies();

  // Special handling for USER token (used by Redux)
  if (key === "USER") {
    cookieStore.set(key, value, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Allow client-side access for Redux
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days for user sessions
      path: "/",
      sameSite: "lax", // Allow cross-site requests for better compatibility
    });
    return;
  }

  // Special handling for auth-related tokens
  if (key === "TalentId" || key === "CompanyId") {
    cookieStore.set(key, value, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      path: "/",
      sameSite: "strict",
    });
    return;
  }

  // Default cookie settings for other keys
  cookieStore.set(key, value, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3), // 3 days
    path: "/",
    sameSite: "strict",
  });
}

export async function getCookie(key: string) {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function deleteCookie(key: string) {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}

// Helper functions for Redux authentication
export async function setAuthToken(token: string) {
  await setCookie("USER", token);
}

export async function getAuthToken() {
  return await getCookie("USER");
}

export async function clearAuthToken() {
  await deleteCookie("USER");
}

export async function setUserData(userData: any) {
  await setCookie("USER_DATA", JSON.stringify(userData));
}

export async function getUserData() {
  const data = await getCookie("USER_DATA");
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

export async function clearUserData() {
  await deleteCookie("USER_DATA");
}
