import { type ReactNode } from "react";
import {
  useAuth,
  useRequireAuth,
  useRequireRole,
} from "../contexts/AuthContext";
import { UserRole as UserRoleEnum } from "../lib/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: UserRoleEnum;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  fallback = null,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Use role-based protection if requiredRole is specified
  if (requiredRole) {
    const { hasAccess } = useRequireRole(requiredRole);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      );
    }

    if (!isAuthenticated || !hasAccess) {
      return fallback;
    }

    return <>{children}</>;
  }

  // Use basic auth protection
  if (requireAuth) {
    useRequireAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return fallback;
    }
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function CreatorRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole={UserRoleEnum.CREATOR} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function PredictorRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole={UserRoleEnum.USER} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole={UserRoleEnum.ADMIN} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
