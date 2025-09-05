import React from "react";

interface GlobalLoadingSpinnerProps {
  /** Custom loading message */
  message?: string;
  /** Show site branding during loading */
  showBranding?: boolean;
}

/**
 * Global loading spinner component shown during app initialization
 */
export function GlobalLoadingSpinner({
  message = "Loading Chyrp Lite...",
  showBranding = true,
}: GlobalLoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        {/* Logo/Branding */}
        {showBranding && (
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Chyrp Lite
            </h1>
          </div>
        )}

        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-12 h-12 mx-auto mb-4">
            {/* Spinning circle */}
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>

          {/* Pulsing dots */}
          <div className="flex justify-center space-x-1 mb-6">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>

        {/* Loading Message */}
        <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
        <p className="text-sm text-gray-500">Initializing your site...</p>

        {/* Progress bar animation */}
        <div className="mt-6 w-64 mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal loading spinner for smaller components
 */
export function MiniLoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
    </div>
  );
}

/**
 * Inline loading spinner for text contexts
 */
export function InlineLoadingSpinner({
  size = "sm",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}
    ></div>
  );
}
