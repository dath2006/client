# Redux Global Settings Implementation

This implementation provides a Redux-based global settings system that automatically loads settings from `/api/v1/settings` when the website loads and makes them available throughout all components.

## 🚀 Features

- **Automatic Loading**: Settings are fetched automatically when the app initializes
- **Global Access**: Settings available in any component through Redux
- **Type Safety**: Full TypeScript support with predefined setting types
- **Caching**: Settings are cached and only refetched when stale (> 5 minutes)
- **Error Handling**: Built-in error handling and retry mechanisms
- **Optimized Selectors**: Memoized selectors for efficient re-renders
- **Easy Updates**: Simple API for updating settings (admin only)

## 📁 File Structure

```
client/
├── components/
│   ├── ReduxProvider.tsx          # Main Redux provider component
│   └── examples/                  # Example usage components
├── hooks/
│   └── useGlobalSettings.ts       # Main hook for accessing settings
├── lib/redux/
│   ├── index.ts                   # Export all Redux utilities
│   ├── store.ts                   # Redux store configuration
│   ├── hooks.ts                   # Typed Redux hooks
│   ├── settingsSlice.ts           # Settings Redux slice
│   └── selectors.ts               # Memoized selectors
└── types/
    └── settings.ts                # TypeScript types for settings
```

## 🛠️ Setup

### 1. Dependencies Installed

- `@reduxjs/toolkit`
- `react-redux`

### 2. Provider Setup

The `ReduxProvider` is already integrated into your app's layout (`app/layout.tsx`):

```tsx
<ReduxProvider>
  <AuthProvider>
    <Navigation />
    {children}
  </AuthProvider>
</ReduxProvider>
```

### 3. Automatic Settings Loading

Settings are automatically fetched from `/api/v1/settings` when the app loads.

## 📖 How to Use Settings in Components

### Method 1: Using the `useGlobalSettings` Hook (Recommended)

```tsx
"use client";

import { useGlobalSettings } from "@/hooks/useGlobalSettings";

export default function MyComponent() {
  const { siteTitle, siteDescription, theme, loading, error, refreshSettings } =
    useGlobalSettings();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{siteTitle}</h1>
      <p>{siteDescription}</p>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

### Method 2: Using Redux Selectors Directly

```tsx
"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { selectSiteTitle, selectTheme } from "@/lib/redux/selectors";

export default function MyComponent() {
  const siteTitle = useAppSelector(selectSiteTitle);
  const theme = useAppSelector(selectTheme);

  return (
    <div>
      <h1>{siteTitle}</h1>
      <p>Theme: {theme}</p>
    </div>
  );
}
```

### Method 3: Getting Custom Settings

```tsx
"use client";

import { useGlobalSettings } from "@/hooks/useGlobalSettings";

export default function MyComponent() {
  const { getSetting } = useGlobalSettings();

  // Get any setting with a fallback value
  const customSetting = getSetting("my_custom_setting", "default_value");
  const maxFileSize = getSetting("max_file_size", 10485760); // 10MB default

  return (
    <div>
      <p>Custom: {customSetting}</p>
      <p>Max file size: {maxFileSize} bytes</p>
    </div>
  );
}
```

## 🔧 Available Settings and Selectors

### Pre-built Selectors

```tsx
import {
  selectSiteTitle, // Site title
  selectSiteDescription, // Site description
  selectSiteUrl, // Site URL
  selectTheme, // Current theme
  selectPostsPerPage, // Posts per page setting
  selectEnableRegistration, // Registration enabled
  selectEnableComments, // Comments enabled
  selectMaintenanceMode, // Maintenance mode status
  selectSocialLinks, // Social media links object
  selectSeoSettings, // SEO settings object
} from "@/lib/redux/selectors";
```

### useGlobalSettings Hook Returns

```tsx
const {
  // Raw data
  settings, // Complete settings object
  loading, // Loading state
  error, // Error message if any
  isStale, // True if data is older than 5 minutes

  // Pre-selected common settings
  siteTitle, // Site title with fallback
  siteDescription, // Site description
  theme, // Current theme
  postsPerPage, // Posts per page
  enableComments, // Comments enabled
  maintenanceMode, // Maintenance mode
  socialLinks, // Social links object
  seoSettings, // SEO settings object

  // Actions
  refreshSettings, // Function to refresh settings
  updateSettings, // Function to update settings (admin)
  clearError, // Clear error state
  ensureFreshData, // Refresh if data is stale

  // Utilities
  getSetting, // Get any setting with fallback

  // Computed values
  isLoaded, // Settings loaded and not loading
  hasError, // Has error state
} = useGlobalSettings();
```

## 🔄 Updating Settings (Admin Only)

```tsx
"use client";

import { useGlobalSettings } from "@/hooks/useGlobalSettings";

export default function AdminSettingsPanel() {
  const { updateSettings, loading } = useGlobalSettings();

  const handleUpdateSiteTitle = async () => {
    try {
      await updateSettings({
        site_title: "New Site Title",
        site_description: "Updated description",
      });
      // Settings are automatically updated in the store
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  return (
    <button onClick={handleUpdateSiteTitle} disabled={loading}>
      Update Site Title
    </button>
  );
}
```

## 🎯 Example Components

Check out these example components to see the settings in action:

1. **Site Header** (`/components/examples/SiteHeader.tsx`)

   - Shows site title and description
   - Demonstrates loading states and error handling

2. **Social Links** (`/components/examples/SocialLinks.tsx`)

   - Displays social media links from settings
   - Shows conditional rendering

3. **Maintenance Banner** (`/components/examples/MaintenanceBanner.tsx`)
   - Shows maintenance mode banner when enabled
   - Demonstrates boolean setting usage

## 🧪 Demo Page

Visit `/settings-demo` to see all examples in action and view the raw settings data.

## 🏗️ Settings Data Structure

The settings are expected to follow this structure from `/api/v1/settings`:

```typescript
interface SiteSettings {
  site_title?: string;
  site_description?: string;
  site_url?: string;
  theme?: string;
  timezone?: string;
  locale?: string;
  posts_per_page?: number;
  enable_registration?: boolean;
  enable_comments?: boolean;
  enable_trackbacks?: boolean;
  enable_webmentions?: boolean;
  enable_feeds?: boolean;
  enable_search?: boolean;
  maintenance_mode?: boolean;
  admin_email?: string;
  smtp_settings?: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    encryption?: string;
  };
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  seo_settings?: {
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
  };
  [key: string]: any; // Allow additional settings
}
```

## 🚨 Error Handling

The system includes comprehensive error handling:

```tsx
const { error, hasError, clearError, refreshSettings } = useGlobalSettings();

if (hasError) {
  return (
    <div className="error">
      <p>Error loading settings: {error}</p>
      <button onClick={refreshSettings}>Retry</button>
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

## 🔄 Data Freshness

Settings are automatically considered stale after 5 minutes. You can force a refresh:

```tsx
const { isStale, ensureFreshData, refreshSettings } = useGlobalSettings();

// Automatically refresh if stale
useEffect(() => {
  ensureFreshData();
}, [ensureFreshData]);

// Or manually refresh
<button onClick={refreshSettings}>Refresh Settings</button>;
```

## 🎨 Integration with Existing Code

This new Redux-based system works alongside your existing `useSettings` hook:

- **useSettings**: For admin settings management (in admin panels)
- **useGlobalSettings**: For read-only access to site settings globally

Both can coexist, and you can gradually migrate components to use the global settings where appropriate.

## 🚀 Performance

- **Memoized Selectors**: Prevent unnecessary re-renders
- **Selective Updates**: Components only re-render when their specific settings change
- **Cached Data**: Settings are cached and only refetched when stale
- **Minimal Bundle**: Redux Toolkit provides a lean implementation

## 📝 TypeScript Support

Full TypeScript support with:

- Type-safe selectors
- Intellisense for all settings
- Runtime type checking
- Generic helper functions for custom settings
