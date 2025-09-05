# Global Loading System Integration Guide

This guide explains how to integrate the global loading system for site settings in your Chyrp Lite application.

## Overview

The global loading system provides a smooth, full-screen loading experience while your app initializes and fetches the initial site settings. It prevents users from seeing incomplete UI states and ensures settings are available throughout your application.

## Key Components

### 1. Redux State Management

- **`settingsSlice.ts`** - Manages settings state with `isInitialLoad` flag
- **`selectors.ts`** - Provides selectors for loading states
- **`useGlobalSettings`** - Main hook for accessing settings

### 2. Loading Components

- **`GlobalLoadingSpinner`** - Full-screen loading spinner
- **`GlobalLoading`** - Comprehensive loading screen
- **`AppInitializer`** - Component that handles initialization logic

### 3. Provider Components

- **`SettingsProvider`** - Context provider for settings
- **`AppInitializer`** - Higher-level initialization wrapper

## Integration Methods

### Method 1: AppInitializer (Recommended)

```tsx
import { AppInitializer } from "@/components/common/AppInitializer";

function App() {
  return (
    <AppInitializer minLoadingDuration={800}>
      <YourAppContent />
    </AppInitializer>
  );
}
```

**Benefits:**

- Automatic initialization
- Error handling
- Customizable loading duration
- Clean separation of concerns

### Method 2: SettingsProvider

```tsx
import { SettingsProvider } from "@/components/common/SettingsProvider";

function App() {
  return (
    <SettingsProvider autoRefresh={true} showLoadingDetails={true}>
      <YourAppContent />
    </SettingsProvider>
  );
}
```

**Benefits:**

- Context-based settings access
- Detailed loading information
- Built-in error handling

### Method 3: Manual Integration

```tsx
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import { GlobalLoadingSpinner } from "@/components/common/GlobalLoadingSpinner";

function App() {
  const { isInitialLoading, appReady, error, refreshSettings } =
    useGlobalSettings();

  // Initialize on mount
  React.useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  if (isInitialLoading) {
    return <GlobalLoadingSpinner />;
  }

  if (error && !appReady) {
    return <ErrorComponent error={error} retry={refreshSettings} />;
  }

  if (appReady) {
    return <YourAppContent />;
  }

  return null;
}
```

## Key Features

### 1. Initial Loading State

- Shows loading screen on first app load
- Prevents rendering until settings are available
- Handles loading failures gracefully

### 2. Auto-Initialization

- Automatically fetches settings on app mount
- Configurable minimum loading duration
- Smart retry logic

### 3. Error Handling

- User-friendly error messages
- Retry functionality
- Fallback states

### 4. Redux Integration

- Automatic state management
- Optimistic updates
- Cache management

## Available Hooks

### useGlobalSettings()

Main hook for accessing settings and loading state.

```tsx
const {
  // Settings data
  settings,
  siteTitle,
  theme,
  modules,
  themes,
  feathers,

  // Loading states
  loading,
  isInitialLoading,
  appReady,
  error,

  // Actions
  refreshSettings,
  updateSettings,

  // Utilities
  getSetting,
  isModuleEnabled,
  getActiveTheme,
} = useGlobalSettings();
```

### useGlobalLoading()

Specialized hook for managing global loading state.

```tsx
const {
  isGlobalLoading,
  isAppReady,
  hasInitializationError,
  loadingPhase,
  initializeSettings,
  retryInitialization,
} = useGlobalLoading();
```

### useAdminSettings()

Hook for admin-specific settings operations with auto-refresh.

```tsx
const {
  updateSetting,
  updateSettings,
  updateSettingByKeyValue,
  refreshSettings,
} = useAdminSettings();
```

## Customization

### Custom Loading Component

```tsx
function CustomLoadingSpinner() {
  return (
    <div className="custom-loading">
      <img src="/logo.png" alt="Loading" className="animate-pulse" />
      <p>Loading your awesome site...</p>
    </div>
  );
}

<AppInitializer loadingComponent={CustomLoadingSpinner}>
  <YourApp />
</AppInitializer>;
```

### Custom Error Handling

```tsx
function CustomErrorComponent({ error, retry }) {
  return (
    <div className="error-screen">
      <h1>Oops! Something went wrong</h1>
      <p>{error}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  );
}

<AppInitializer errorComponent={CustomErrorComponent}>
  <YourApp />
</AppInitializer>;
```

## Loading Flow

1. **App Starts** - `isInitialLoad: true`, `loading: false`
2. **Settings Requested** - `isInitialLoad: true`, `loading: true`
3. **Settings Loaded** - `isInitialLoad: false`, `loading: false`, `data: {...}`
4. **App Ready** - `appReady: true`, normal rendering begins

## Best Practices

### 1. Use AppInitializer at the Root

Place the `AppInitializer` as high in your component tree as possible:

```tsx
// Good
function App() {
  return (
    <AppInitializer>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AppInitializer>
  );
}
```

### 2. Check Settings in Components

Always check if settings are available before using them:

```tsx
function MyComponent() {
  const { settings, appReady } = useGlobalSettings();

  if (!appReady || !settings) {
    return <div>Loading...</div>;
  }

  return <div>{settings.site_title}</div>;
}
```

### 3. Handle Loading States

Provide feedback during updates:

```tsx
function SettingsForm() {
  const { updateSettingByKeyValue } = useAdminSettings();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (data) => {
    setIsUpdating(true);
    try {
      await updateSettingByKeyValue("site_title", data.title);
      // Settings will auto-refresh in Redux
    } finally {
      setIsUpdating(false);
    }
  };
}
```

## Troubleshooting

### Settings Not Loading

1. Check if the API endpoint `/api/v1/settings` is accessible
2. Verify Redux store is properly configured
3. Ensure `fetchSettings` is being called

### Loading Screen Flashing

- Increase `minLoadingDuration` prop
- Check for race conditions in initialization
- Verify settings are properly cached

### Redux State Not Updating

- Ensure you're using `updateSettings` from admin APIs
- Check that dispatch is being passed to API functions
- Verify selectors are properly configured

## API Integration

The system automatically refreshes Redux state when admin settings are updated:

```tsx
// This will update the setting AND refresh Redux state
await adminSettingsAPI.updateSetting(
  "site_title",
  {
    value: "New Title",
    type: "string",
  },
  dispatch
);

// Or use the hook which handles dispatch automatically
const { updateSettingByKeyValue } = useAdminSettings();
await updateSettingByKeyValue("site_title", "New Title");
```

## Performance Considerations

- Settings are cached in Redux with timestamp
- Stale data detection (5-minute default)
- Minimal re-renders using memoized selectors
- Automatic cleanup on component unmount

This system ensures your Chyrp Lite application provides a smooth, professional loading experience while maintaining optimal performance and user experience.
