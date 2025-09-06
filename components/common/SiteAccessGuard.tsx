"use client";

import React from "react";
import { useGlobalPermissions } from "@/hooks/useGlobalPermissions";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

interface SiteAccessGuardProps {
  children: React.ReactNode;
}

/**
 * Component that checks if the user has permission to view the site
 * If not, it shows an access denied message
 */
export function SiteAccessGuard({ children }: SiteAccessGuardProps) {
  const { canViewSite, permissionsReady, loading } = useGlobalPermissions();
  const { isAuthenticated, user } = useAuth();

  // Show loading while permissions are being fetched
  if (loading || !permissionsReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have permission to view the site, show access denied
  if (!canViewSite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              You have no access to visit the site page. Please contact your
              administrator if you believe this is an error.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-gray-500">
              <p>Possible reasons:</p>
              <ul className="list-disc list-inside text-left mt-2 space-y-1">
                <li>Your account doesn't have site viewing permissions</li>
                <li>Your user group has restricted access</li>
                <li>Site maintenance or restricted access is active</li>
              </ul>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>

            {isAuthenticated && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If user has permission, render the children (the actual site)
  return <>{children}</>;
}
