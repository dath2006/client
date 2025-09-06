import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Settings selectors
export const selectSettings = (state: RootState) => state.settings;
export const selectSettingsData = (state: RootState) => state.settings.data;
export const selectSettingsLoading = (state: RootState) =>
  state.settings.loading;
export const selectSettingsError = (state: RootState) => state.settings.error;
export const selectSettingsLastFetched = (state: RootState) =>
  state.settings.lastFetched;
export const selectSettingsIsInitialLoad = (state: RootState) =>
  state.settings.isInitialLoad;

// Permissions selectors
export const selectPermissions = (state: RootState) => state.permissions;
export const selectPermissionsData = (state: RootState) =>
  state.permissions.data;
export const selectPermissionsLoading = (state: RootState) =>
  state.permissions.loading;
export const selectPermissionsError = (state: RootState) =>
  state.permissions.error;
export const selectPermissionsLastFetched = (state: RootState) =>
  state.permissions.lastFetched;
export const selectPermissionsIsInitialLoad = (state: RootState) =>
  state.permissions.isInitialLoad;
export const selectUserRole = (state: RootState) => state.permissions.userRole;
export const selectGroupId = (state: RootState) => state.permissions.groupId;
export const selectGroupName = (state: RootState) =>
  state.permissions.groupName;

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

// Permissions selectors
export const selectCanAddPosts = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.add_posts === true
);

export const selectCanEditPosts = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.edit_posts === true
);

export const selectCanDeletePosts = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.delete_posts === true
);

export const selectCanEditOwnPosts = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.edit_own_posts === true
);

export const selectCanDeleteOwnPosts = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.delete_own_posts === true
);

export const selectCanAddUsers = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.add_users === true
);

export const selectCanEditUsers = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.edit_users === true
);

export const selectCanDeleteUsers = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.delete_users === true
);

export const selectCanChangeSettings = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.change_settings === true
);

export const selectCanAddComments = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.add_comments === true
);

export const selectCanEditComments = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.edit_comments === true
);

export const selectCanDeleteComments = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.delete_comments === true
);

export const selectCanAddUploads = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.add_uploads === true
);

export const selectCanViewUploads = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.view_uploads === true
);

export const selectCanDeleteUploads = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.delete_uploads === true
);

export const selectCanViewSite = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.view_site === true
);

export const selectCanManageCategories = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.manage_categories === true
);

export const selectCanToggleExtensions = createSelector(
  [selectPermissionsData],
  (permissions) => permissions?.toggle_extensions === true
);

// Combined selector for admin-related permissions
export const selectAdminPermissions = createSelector(
  [
    selectCanChangeSettings,
    selectCanAddUsers,
    selectCanEditUsers,
    selectCanDeleteUsers,
  ],
  (canChangeSettings, canAddUsers, canEditUsers, canDeleteUsers) => ({
    canChangeSettings,
    canAddUsers,
    canEditUsers,
    canDeleteUsers,
  })
);

// Combined selector for content-related permissions
export const selectContentPermissions = createSelector(
  [
    selectCanAddPosts,
    selectCanEditPosts,
    selectCanDeletePosts,
    selectCanAddUploads,
  ],
  (canAddPosts, canEditPosts, canDeletePosts, canAddUploads) => ({
    canAddPosts,
    canEditPosts,
    canDeletePosts,
    canAddUploads,
  })
);

// Selector to check if permissions are stale (older than 5 minutes)
export const selectPermissionsStale = createSelector(
  [selectPermissionsLastFetched],
  (lastFetched) => {
    if (!lastFetched) return true;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - lastFetched > fiveMinutes;
  }
);

// Selector for initial permissions loading state
export const selectIsInitialPermissionsLoading = createSelector(
  [selectPermissionsIsInitialLoad, selectPermissionsLoading],
  (isInitialLoad, loading) => isInitialLoad && loading
);

// Selector to check if permissions are ready
export const selectPermissionsReady = createSelector(
  [
    selectPermissionsIsInitialLoad,
    selectPermissionsData,
    selectPermissionsError,
  ],
  (isInitialLoad, data, error) => !isInitialLoad || !!data || !!error
);
