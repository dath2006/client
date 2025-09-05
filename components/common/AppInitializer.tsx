import React from "react";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { GlobalLoadingSpinner } from "./GlobalLoadingSpinner";
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion: Import motion and AnimatePresence

interface AppInitializerProps {
  children: React.ReactNode;
  loadingComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: string; retry: () => void }>;
  minLoadingDuration?: number;
}

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
  } = useGlobalLoading({
    autoInitialize: true,
    minLoadingDuration,
  });

  // Framer Motion: Use AnimatePresence to manage state transitions
  return (
    <AnimatePresence mode="wait">
      {isGlobalLoading && (
        <motion.div
          key="loading"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingComponent />
        </motion.div>
      )}

      {hasInitializationError && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {ErrorComponent ? (
            <ErrorComponent
              error={error || "Unknown error"}
              retry={retryInitialization}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="max-w-md mx-auto text-center p-6">
                <div className="bg-red-100 border border-red-200 rounded-lg p-6">
                  {/* ... default error component content ... */}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {isAppReady && (
        <motion.div
          key="app-ready"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}


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


export function LoadingPhaseIndicator() {
  const { loadingPhase, retryInitialization } = useGlobalLoading();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={loadingPhase} // This key triggers the animation on change
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {(() => {
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
              // Framer Motion: This special animation will appear and then fade out
              return (
                <motion.div
                  className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
                  animate={{ opacity: [0, 1, 1, 0] }} // Keyframes: fade in, stay, fade out
                  transition={{
                    duration: 3,
                    times: [0, 0.1, 0.9, 1], // Timing for keyframes
                  }}
                >
                  App ready!
                </motion.div>
              );
            default:
              return null;
          }
        })()}
      </motion.div>
    </AnimatePresence>
  );
}