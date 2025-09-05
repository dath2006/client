import React from "react";

interface GlobalLoadingProps {
  /** Custom loading message */
  message?: string;
  /** Show detailed loading state */
  showDetails?: boolean;
  /** Custom logo/icon */
  logo?: React.ReactNode;
}

/**
 * Global loading screen that shows during initial site settings load
 * This covers the entire viewport while the app is initializing
 */
export function GlobalLoading({
  message = "Loading Chyrp Lite...",
  showDetails = false,
  logo,
}: GlobalLoadingProps) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        {/* Logo/Icon */}
        {logo || (
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CL</span>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-500"></div>
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {message}
          </span>
        </div>

        {/* Details */}
        {showDetails && (
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>Initializing site settings...</p>
            <p>This should only take a moment.</p>
          </div>
        )}

        {/* Subtle progress animation */}
        <div className="w-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal global loading component for faster renders
 */
export function GlobalLoadingMinimal() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
    </div>
  );
}
