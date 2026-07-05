"use server";

import { getSession, isAuthenticated, getCurrentUser } from "./actions/session";
import { setAuthToken, getAuthToken, clearAuthToken, setUserData, getUserData, clearUserData } from "./cookie-setter";

// Authentication utilities that work with Redux (NextAuth removed to avoid middleware conflicts)
export async function getServerAuth() {
  // Use Redux session
  const reduxSession = await getSession();
  if (reduxSession) {
    return {
      user: reduxSession.user,
      token: reduxSession.token,
      provider: 'redux'
    };
  }

  return null;
}

export async function requireServerAuth() {
  const auth = await getServerAuth();
  if (!auth) {
    throw new Error('Authentication required');
  }
  return auth;
}

export async function getUserFromRequest() {
  const auth = await getServerAuth();
  return auth?.user || null;
}

export async function getTokenFromRequest() {
  const auth = await getServerAuth();
  return auth?.token || null;
}

// API route helpers
export async function withAuth(handler: (user: any, token?: string) => Promise<Response>) {
  return async (request: Request) => {
    const auth = await getServerAuth();

    if (!auth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(auth.user, auth.token);
  };
}

// Database helpers (placeholder for future implementation)
export async function createUser(userData: any) {
  // TODO: Implement user creation in database
  console.log('Creating user:', userData);
  return { id: 'user_' + Date.now(), ...userData };
}

export async function findUserByEmail(email: string) {
  // TODO: Implement user lookup in database
  console.log('Finding user by email:', email);
  return null;
}

export async function validateCredentials(email: string, password: string) {
  // TODO: Implement credential validation
  console.log('Validating credentials for:', email);
  // Mock validation - replace with real implementation
  if (email && password) {
    return await createUser({ email, name: email.split('@')[0] });
  }
  return null;
}

// Session management helpers
export async function createSession(user: any, token?: string) {
  const sessionToken = token || `session_${Date.now()}`;

  await setAuthToken(sessionToken);
  await setUserData(user);

  return {
    user,
    token: sessionToken,
  };
}

export async function destroySession() {
  await clearAuthToken();
  await clearUserData();
}

// Export all utilities
export {
  getSession,
  isAuthenticated,
  getCurrentUser,
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  setUserData,
  getUserData,
  clearUserData,
};