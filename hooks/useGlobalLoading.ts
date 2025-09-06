"use client";

import { useCallback, useEffect } from "react";
import { useGlobalSettings } from "./useGlobalSettings";
import { useGlobalPermissions } from "./useGlobalPermissions";

interface UseGlobalLoadingOptions {
  /** Auto-initialize settings on mount */
  autoInitialize?: boolean;
  /** Show loading for minimum duration (ms) to prevent flash */
  minLoadingDuration?: number;
  /** Whether to also load permissions */
  includePermissions?: boolean;
}

/**
 * Hook for managing global loading state during site initialization
 *
 * This hook is specifically designed to handle the initial loading
 * of site settings and user permissions, providing a smooth loading experience.
 */
export function useGlobalLoading(options: UseGlobalLoadingOptions = {}) {
  const {
    autoInitialize = true,
    minLoadingDuration = 500,
    includePermissions = true,
  } = options;

  const {
    isInitialLoading: settingsInitialLoading,
    appReady: settingsReady,
    error: settingsError,
    settings,
    refreshSettings,
    loading: settingsLoading,
  } = useGlobalSettings();

  const {
    isInitialLoading: permissionsInitialLoading,
    permissionsReady,
    error: permissionsError,
    permissions,
    refreshPermissions,
    loading: permissionsLoading,
  } = useGlobalPermissions();

  // Initialize settings and permissions on mount if auto-initialize is enabled
  useEffect(() => {
    if (autoInitialize && !settings && !settingsLoading && !settingsError) {
      refreshSettings();
    }
    // Also initialize permissions if includePermissions is true
    if (
      autoInitialize &&
      includePermissions &&
      !permissions &&
      !permissionsLoading &&
      !permissionsError
    ) {
      refreshPermissions();
    }
  }, [
    autoInitialize,
    settings,
    settingsLoading,
    settingsError,
    refreshSettings,
    includePermissions,
    permissions,
    permissionsLoading,
    permissionsError,
    refreshPermissions,
  ]);

  // Force initialize both settings and permissions
  const initializeAll = useCallback(() => {
    refreshSettings();
    if (includePermissions) {
      refreshPermissions();
    }
  }, [refreshSettings, refreshPermissions, includePermissions]);

  // Check if app is in loading state
  const isGlobalLoading = includePermissions
    ? settingsInitialLoading || permissionsInitialLoading
    : settingsInitialLoading;

  // Check if app failed to initialize
  const hasInitializationError = includePermissions
    ? (!settingsReady && !!settingsError && !settingsLoading) ||
      (!permissionsReady && !!permissionsError && !permissionsLoading)
    : !settingsReady && !!settingsError && !settingsLoading;

  // Check if app is ready to use
  const isAppReady = includePermissions
    ? settingsReady && !!settings && permissionsReady && !!permissions
    : settingsReady && !!settings;

  // Get current error (prioritize settings error, then permissions error)
  const error = settingsError || (includePermissions ? permissionsError : null);

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
    initializeSettings: initializeAll,
    retryInitialization: initializeAll,

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
    useGlobalLoading({ includePermissions: false }); // Only load settings, not permissions

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

/**
 * Hook that ensures both settings and permissions are loaded
 * Throws a promise that can be caught by Suspense boundaries
 */
export function useAppLoader() {
  const { isGlobalLoading, hasInitializationError, error } = useGlobalLoading({
    includePermissions: true,
  });

  if (hasInitializationError) {
    throw new Error(`Failed to load app data: ${error}`);
  }

  if (isGlobalLoading) {
    // Throw a promise to trigger Suspense
    throw new Promise((resolve) => {
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
