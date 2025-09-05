"use client";

import { useCallback, useEffect } from "react";
import { useGlobalSettings } from "./useGlobalSettings";

interface UseGlobalLoadingOptions {
  /** Auto-initialize settings on mount */
  autoInitialize?: boolean;
  /** Show loading for minimum duration (ms) to prevent flash */
  minLoadingDuration?: number;
}

/**
 * Hook for managing global loading state during site initialization
 *
 * This hook is specifically designed to handle the initial loading
 * of site settings and provide a smooth loading experience.
 */
export function useGlobalLoading(options: UseGlobalLoadingOptions = {}) {
  const { autoInitialize = true, minLoadingDuration = 500 } = options;

  const {
    isInitialLoading,
    appReady,
    error,
    settings,
    refreshSettings,
    loading,
  } = useGlobalSettings();

  // Initialize settings on mount if auto-initialize is enabled
  useEffect(() => {
    if (autoInitialize && !settings && !loading && !error) {
      refreshSettings();
    }
  }, [autoInitialize, settings, loading, error, refreshSettings]);

  // Force initialize settings (useful for manual initialization)
  const initializeSettings = useCallback(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Check if app is in loading state
  const isGlobalLoading = isInitialLoading;

  // Check if app failed to initialize
  const hasInitializationError = !appReady && !!error && !loading;

  // Check if app is ready to use
  const isAppReady = appReady && !!settings;

  // Get current loading phase
  const getLoadingPhase = useCallback(() => {
    if (hasInitializationError) return "error";
    if (isGlobalLoading) return "loading";
    if (isAppReady) return "ready";
    return "initializing";
  }, [hasInitializationError, isGlobalLoading, isAppReady]);

  return {
    // Loading states
    isGlobalLoading,
    isAppReady,
    hasInitializationError,

    // Current state
    loadingPhase: getLoadingPhase(),
    error,

    // Actions
    initializeSettings,
    retryInitialization: initializeSettings,

    // Utilities
    canRenderApp: isAppReady,
    shouldShowLoading: isGlobalLoading,
    shouldShowError: hasInitializationError,
  };
}

/**
 * Hook for components that need to wait for settings to be ready
 * Returns null if settings aren't loaded yet, preventing render
 */
export function useSettingsGuard() {
  const { appReady, settings } = useGlobalSettings();

  // Return settings only when ready, null otherwise
  return appReady ? settings : null;
}

/**
 * Hook that ensures settings are loaded before allowing component to proceed
 * Throws a promise that can be caught by Suspense boundaries
 */
export function useSettingsLoader() {
  const { isGlobalLoading, hasInitializationError, error, initializeSettings } =
    useGlobalLoading();

  if (hasInitializationError) {
    throw new Error(`Failed to load site settings: ${error}`);
  }

  if (isGlobalLoading) {
    // Throw a promise to trigger Suspense
    throw new Promise((resolve) => {
      // This will resolve when settings are loaded
      const checkLoading = () => {
        if (!isGlobalLoading) {
          resolve(true);
        } else {
          requestAnimationFrame(checkLoading);
        }
      };
      checkLoading();
    });
  }
}
