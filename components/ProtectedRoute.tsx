"use client";

import React from 'react';
import { useProtectedRoute } from '../app/lib/client-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

// Component for protected routes with loading state
export function ProtectedRoute({
  children,
  redirectTo = '/signin',
  fallback
}: ProtectedRouteProps) {
  const { shouldRender, loading } = useProtectedRoute(redirectTo);

  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/signin'
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute redirectTo={redirectTo}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}