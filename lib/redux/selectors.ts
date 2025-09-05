import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Basic selectors
export const selectSettings = (state: RootState) => state.settings;
export const selectSettingsData = (state: RootState) => state.settings.data;
export const selectSettingsLoading = (state: RootState) =>
  state.settings.loading;
export const selectSettingsError = (state: RootState) => state.settings.error;
export const selectSettingsLastFetched = (state: RootState) =>
  state.settings.lastFetched;
export const selectSettingsIsInitialLoad = (state: RootState) =>
  state.settings.isInitialLoad;

// Memoized selectors for specific settings
export const selectSiteTitle = createSelector(
  [selectSettingsData],
  (settings) => settings?.site_title || "Chyrp Lite"
);

export const selectSiteDescription = createSelector(
  [selectSettingsData],
  (settings) => settings?.site_description || ""
);

export const selectSiteUrl = createSelector(
  [selectSettingsData],
  (settings) => settings?.site_url || ""
);

export const selectTheme = createSelector(
  [selectSettingsData],
  (settings) => settings?.theme || "default"
);

export const selectPostsPerPage = createSelector(
  [selectSettingsData],
  (settings) => settings?.posts_per_page || 10
);

export const selectEnableRegistration = createSelector(
  [selectSettingsData],
  (settings) => settings?.enable_registration ?? true
);

export const selectEnableComments = createSelector(
  [selectSettingsData],
  (settings) => settings?.enable_comments ?? true
);

export const selectMaintenanceMode = createSelector(
  [selectSettingsData],
  (settings) => settings?.maintenance_mode ?? false
);

export const selectSocialLinks = createSelector(
  [selectSettingsData],
  (settings) => settings?.social_links || {}
);

export const selectSeoSettings = createSelector(
  [selectSettingsData],
  (settings) => settings?.seo_settings || {}
);

// Combined selector for layout-related settings
export const selectLayoutSettings = createSelector(
  [selectSiteTitle, selectSiteDescription, selectTheme],
  (title, description, theme) => ({
    title,
    description,
    theme,
  })
);

// Selector to check if settings are stale (older than 5 minutes)
export const selectSettingsStale = createSelector(
  [selectSettingsLastFetched],
  (lastFetched) => {
    if (!lastFetched) return true;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - lastFetched > fiveMinutes;
  }
);

// Selector for initial loading state (show website-wide loading)
export const selectIsInitialLoading = createSelector(
  [selectSettingsIsInitialLoad, selectSettingsLoading],
  (isInitialLoad, loading) => isInitialLoad && loading
);

// Selector to check if the app is ready (settings loaded successfully)
export const selectAppReady = createSelector(
  [selectSettingsIsInitialLoad, selectSettingsData, selectSettingsError],
  (isInitialLoad, data, error) => !isInitialLoad || !!data || !!error
);
