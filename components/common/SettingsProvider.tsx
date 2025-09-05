"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import { GlobalLoading } from "@/components/common/GlobalLoading";

interface SettingsProviderProps {
  children: React.ReactNode;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Show detailed loading information */
  showLoadingDetails?: boolean;
  /** Auto-refresh settings on mount */
  autoRefresh?: boolean;
}

/**
 * Settings Provider that handles initial site settings loading
 * Shows a global loading screen until settings are loaded
 * Handles errors gracefully and ensures the app has basic settings to work with
 */
export function SettingsProvider({
  children,
  loadingComponent,
  errorComponent,
  showLoadingDetails = false,
  autoRefresh = true,
}: SettingsProviderProps) {
  const { isInitialLoading, appReady, error, refreshSettings, settings } =
    useGlobalSettings();

  // Auto-refresh settings on mount if enabled
  useEffect(() => {
    if (autoRefresh && (!settings || !appReady)) {
      refreshSettings();
    }
  }, [autoRefresh, settings, appReady, refreshSettings]);

  return (
    <AnimatePresence mode="wait">
      {/* Show loading screen during initial load */}
      {isInitialLoading && (
        <motion.div key="loading" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
          {loadingComponent || (
            <GlobalLoading
              message="Initializing Chyrp Lite..."
              showDetails={showLoadingDetails}
            />
          )}
        </motion.div>
      )}

      {/* Show error screen if initial load failed */}
      {!isInitialLoading && !appReady && error && (
        <motion.div key="error">
          {errorComponent || (
            <GlobalErrorFallback error={error} onRetry={refreshSettings} />
          )}
        </motion.div>
      )}

      {/* Render children when ready */}
      {!isInitialLoading && appReady && (
        <motion.div
          key="ready"
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

/**
 * Default error fallback component for settings loading failures
 */
function GlobalErrorFallback({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <motion.div
        className="text-center space-y-6 max-w-md mx-auto p-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {/* Error Icon */}
        <motion.div
          className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center"
          variants={{
            hidden: { scale: 0.5, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { type: 'spring' } },
          }}
        >
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="space-y-2"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Unable to Load Site Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-3"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
        >
          <motion.button
            onClick={onRetry}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Retry Loading
          </motion.button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If this problem persists, please contact your site administrator.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Higher-order component to wrap your app with settings loading
 */
export function withSettingsProvider<P extends object>(
  Component: React.ComponentType<P>,
  providerProps?: Omit<SettingsProviderProps, "children">
) {
  return function SettingsWrappedComponent(props: P) {
    return (
      <SettingsProvider {...providerProps}>
        <Component {...props} />
      </SettingsProvider>
    );
  };
}