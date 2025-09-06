"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseAdminAccessResult {
  isAdmin: boolean;
  isLoading: boolean;
  hasAccess: boolean;
}

/**
 * Hook to check if the current user has admin access (now allows any authenticated user)
 */
export const useAdminAccess = (): UseAdminAccessResult => {
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsChecking(false);
    }
  }, [status]);

  // Updated: Now any authenticated user has admin access
  const isAdmin = !!session?.user; // Any logged-in user is considered admin
  const isLoading = status === "loading" || isChecking;
  const hasAccess = !isLoading && isAdmin;

  return {
    isAdmin,
    isLoading,
    hasAccess,
  };
};

/**
 * Hook that redirects non-admin users to sign-in page
 */
export const useRequireAdmin = () => {
  const { isAdmin, isLoading, hasAccess } = useAdminAccess();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/auth/signin");
    }
  }, [isLoading, isAdmin, router]);

  return {
    isAdmin,
    isLoading,
    hasAccess,
  };
};

/**
 * Component to protect admin routes
 */
interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  fallback,
  redirectTo = "/auth/signin",
}) => {
  const { isAdmin, isLoading } = useAdminAccess();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push(redirectTo);
    }
  }, [isLoading, isAdmin, router, redirectTo]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  if (!isAdmin) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have admin privileges.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
