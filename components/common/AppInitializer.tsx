import React from "react";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { GlobalLoadingSpinner } from "./GlobalLoadingSpinner";

interface AppInitializerProps {
  children: React.ReactNode;
  /** Custom loading component */
  loadingComponent?: React.ComponentType;
  /** Custom error component */
  errorComponent?: React.ComponentType<{ error: string; retry: () => void }>;
  /** Minimum loading time to prevent flash */
  minLoadingDuration?: number;
}

/**
 * AppInitializer component that handles global app initialization
 *
 * This component:
 * - Shows loading state while fetching initial site settings
 * - Displays errors if initialization fails
 * - Only renders children when the app is ready
 */
export function AppInitializer({
  children,
  loadingComponent: LoadingComponent = GlobalLoadingSpinner,
  errorComponent: ErrorComponent,
  minLoadingDuration = 500,
}: AppInitializerProps) {
  const {
    isGlobalLoading,
    isAppReady,
    hasInitializationError,
    error,
    retryInitialization,
    loadingPhase,
  } = useGlobalLoading({
    autoInitialize: true,
    minLoadingDuration,
  });

  // Show loading state
  if (isGlobalLoading) {
    return <LoadingComponent />;
  }

  // Show error state
  if (hasInitializationError) {
    if (ErrorComponent) {
      return (
        <ErrorComponent
          error={error || "Unknown error"}
          retry={retryInitialization}
        />
      );
    }

    // Default error component
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-red-100 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-200 rounded-full">
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
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Failed to Initialize App
            </h2>
            <p className="text-red-600 mb-4">
              {error || "An error occurred while loading site settings."}
            </p>
            <button
              onClick={retryInitialization}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // App is ready - render children
  if (isAppReady) {
    return <>{children}</>;
  }

  // Fallback (shouldn't reach here normally)
  return <LoadingComponent />;
}

/**
 * Higher-order component for wrapping components that need settings to be loaded
 */
export function withSettingsLoaded<P extends object>(
  Component: React.ComponentType<P>
) {
  return function SettingsLoadedComponent(props: P) {
    return (
      <AppInitializer>
        <Component {...props} />
      </AppInitializer>
    );
  };
}

/**
 * Component that shows different content based on loading phase
 */
export function LoadingPhaseIndicator() {
  const { loadingPhase, error, retryInitialization } = useGlobalLoading();

  switch (loadingPhase) {
    case "loading":
      return (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Loading site settings...
        </div>
      );

    case "error":
      return (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>Failed to load settings</span>
            <button
              onClick={retryInitialization}
              className="underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      );

    case "ready":
      return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg opacity-75">
          App ready!
        </div>
      );

    default:
      return null;
  }
}
