"use server";

import { NextRequest, NextResponse } from "next/server";
import { getServerAuth } from "./auth-utils";

// API route authentication middleware
export async function withApiAuth(
  handler: (request: NextRequest, user: any, token?: string) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const auth = await getServerAuth();

      if (!auth) {
        return NextResponse.json(
          { error: "Unauthorized", message: "Authentication required" },
          { status: 401 }
        );
      }

      return await handler(request, auth.user, auth.token);
    } catch (error) {
      console.error("API Authentication error:", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: "Authentication failed" },
        { status: 500 }
      );
    }
  };
}

// API route helpers
export async function getAuthenticatedUser(request: NextRequest) {
  const auth = await getServerAuth();
  return auth?.user || null;
}

export async function getAuthToken(request: NextRequest) {
  const auth = await getServerAuth();
  return auth?.token || null;
}

export async function requireAuth(request: NextRequest) {
  const auth = await getServerAuth();

  if (!auth) {
    throw new Error("Authentication required");
  }

  return auth;
}

// Response helpers
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function errorResponse(message: string, status: number = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Forbidden") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = "Not Found") {
  return errorResponse(message, 404);
}

export function serverErrorResponse(message: string = "Internal Server Error") {
  return errorResponse(message, 500);
}

// Validation helpers
export function validateRequired(fields: Record<string, any>, requiredFields: string[]) {
  const missing = requiredFields.filter(field => !fields[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}