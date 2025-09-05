import React from "react";
import { SettingsProvider } from "@/components/common/SettingsProvider";
import { AppInitializer } from "@/components/common/AppInitializer";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

// Example components (replace with your actual components)
import Navigation from "@/components/Navigation";

/**
 * Example of how to integrate the global loading system into your main app
 *
 * Method 1: Using AppInitializer (Recommended)
 */
export function AppWithGlobalLoading() {
  return (
    <AppInitializer minLoadingDuration={800}>
      <div className="min-h-screen">
        <Navigation />
        <main>
          {/* Your app content here */}
          <YourAppContent />
        </main>
        {/* Footer component would go here */}
      </div>
    </AppInitializer>
  );
}

/**
 * Method 2: Using SettingsProvider (Alternative approach)
 */
export function AppWithSettingsProvider() {
  return (
    <SettingsProvider autoRefresh={true} showLoadingDetails={true}>
      <div className="min-h-screen">
        <Navigation />
        <main>
          <YourAppContent />
        </main>
        {/* Footer component would go here */}
      </div>
    </SettingsProvider>
  );
}

/**
 * Method 3: Manual integration with useGlobalSettings
 */
export function AppWithManualLoading() {
  const { isInitialLoading, appReady, error, refreshSettings, settings } =
    useGlobalSettings();

  // Initialize settings on mount
  React.useEffect(() => {
    if (!settings && !isInitialLoading && !error) {
      refreshSettings();
    }
  }, [settings, isInitialLoading, error, refreshSettings]);

  // Show loading state
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading Chyrp Lite...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Initializing site settings
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Failed to Load Settings
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshSettings}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // App is ready - render normal content
  if (appReady) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main>
          <YourAppContent />
        </main>
        {/* Footer component would go here */}
      </div>
    );
  }

  // Fallback
  return null;
}

/**
 * Your main app content component
 */
function YourAppContent() {
  const { siteTitle, theme, maintenanceMode } = useGlobalSettings();

  if (maintenanceMode) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Site Under Maintenance
        </h1>
        <p className="text-gray-600">
          {siteTitle} is currently undergoing maintenance. Please check back
          soon.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to {siteTitle}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Your content here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600">
            Your site is now running with theme: <strong>{theme}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Usage in your root App component or _app.tsx:
 */
export default function App() {
  return (
    <div id="app">
      {/* Choose one of the methods above */}
      <AppWithGlobalLoading />

      {/* Or use the provider approach */}
      {/* <AppWithSettingsProvider /> */}

      {/* Or manual integration */}
      {/* <AppWithManualLoading /> */}
    </div>
  );
}

/**
 * For Next.js, you might use it in _app.tsx like this:
 */
export function NextJSAppExample({ Component, pageProps }: any) {
  return (
    <AppInitializer>
      <Component {...pageProps} />
    </AppInitializer>
  );
}
