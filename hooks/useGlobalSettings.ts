import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchSettings,
  updateSettings,
  clearError,
} from "@/lib/redux/settingsSlice";
import {
  selectSettings,
  selectSettingsData,
  selectSettingsLoading,
  selectSettingsError,
  selectSiteTitle,
  selectSiteDescription,
  selectTheme,
  selectPostsPerPage,
  selectEnableComments,
  selectMaintenanceMode,
  selectSocialLinks,
  selectSeoSettings,
  selectSettingsStale,
  selectIsInitialLoading,
  selectAppReady,
} from "@/lib/redux/selectors";
import { SiteSettings, Module, Theme, Feather } from "@/types/settings";

export function useGlobalSettings() {
  const dispatch = useAppDispatch();

  // Basic state
  const settings = useAppSelector(selectSettingsData);
  const loading = useAppSelector(selectSettingsLoading);
  const error = useAppSelector(selectSettingsError);
  const isStale = useAppSelector(selectSettingsStale);
  const isInitialLoading = useAppSelector(selectIsInitialLoading);
  const appReady = useAppSelector(selectAppReady);

  // Common settings selectors
  const siteTitle = useAppSelector(selectSiteTitle);
  const siteDescription = useAppSelector(selectSiteDescription);
  const theme = useAppSelector(selectTheme);
  const postsPerPage = useAppSelector(selectPostsPerPage);
  const enableComments = useAppSelector(selectEnableComments);
  const maintenanceMode = useAppSelector(selectMaintenanceMode);
  const socialLinks = useAppSelector(selectSocialLinks);
  const seoSettings = useAppSelector(selectSeoSettings);

  // New settings selectors using getSetting helper
  const modules = settings?.modules || [];
  const themes = settings?.themes || [];
  const feathers = settings?.feathers || [];
  const enableRegistration = settings?.enable_registration ?? true;
  const enableFeeds = settings?.enable_feeds ?? true;
  const enableSearch = settings?.enable_search ?? true;
  const timezone = settings?.timezone || "UTC";
  const locale = settings?.locale || "en";
  const contactEmail = settings?.contactEmail || settings?.admin_email || "";
  const siteName = settings?.siteName || settings?.site_title || "Chyrp Lite";
  const description = settings?.description || settings?.site_description || "";
  const language = settings?.language || "en";
  const chyrpUrl = settings?.chyrpUrl || settings?.site_url || "";
  const allowRegistration =
    settings?.allowRegistration ?? settings?.enable_registration ?? true;
  const cleanUrls = settings?.cleanUrls ?? false;
  const feedFormat = settings?.feedFormat || "JSON";
  const postsInFeed = settings?.postsInFeed || 20;
  const commentsPerPage = settings?.commentsPerPage || 25;
  const itemsPerAdminPage = settings?.itemsPerAdminPage || 25;

  // Actions
  const refreshSettings = useCallback(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const updateSettingsData = useCallback(
    (newSettings: Partial<SiteSettings>) => {
      return dispatch(updateSettings(newSettings));
    },
    [dispatch]
  );

  const clearSettingsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper function to get a specific setting with fallback
  const getSetting = useCallback(
    <T>(key: keyof SiteSettings, fallback: T): T => {
      return (settings?.[key] as T) ?? fallback;
    },
    [settings]
  );

  // Helper functions for modules, themes, and feathers
  const getEnabledModules = useCallback(() => {
    return modules.filter((module) => module.status === "enabled");
  }, [modules]);

  const getActiveTheme = useCallback(() => {
    return themes.find((theme) => theme.is_active);
  }, [themes]);

  const getEnabledFeathers = useCallback(() => {
    return feathers.filter((feather) => feather.status === "enabled");
  }, [feathers]);

  const isModuleEnabled = useCallback(
    (moduleName: string) => {
      return modules.some(
        (module) =>
          module.name.toLowerCase() === moduleName.toLowerCase() &&
          module.status === "enabled"
      );
    },
    [modules]
  );

  const isFeatherEnabled = useCallback(
    (featherName: string) => {
      return feathers.some(
        (feather) =>
          feather.name.toLowerCase() === featherName.toLowerCase() &&
          feather.status === "enabled"
      );
    },
    [feathers]
  );

  // Force refresh if data is stale
  const ensureFreshData = useCallback(() => {
    if (isStale) {
      refreshSettings();
    }
  }, [isStale, refreshSettings]);

  return {
    // Raw data
    settings,
    loading,
    error,
    isStale,
    isInitialLoading,
    appReady,

    // Common settings (pre-selected)
    siteTitle,
    siteDescription,
    theme,
    postsPerPage,
    enableComments,
    maintenanceMode,
    socialLinks,
    seoSettings,

    // New settings (commonly used)
    modules,
    themes,
    feathers,
    enableRegistration,
    enableFeeds,
    enableSearch,
    timezone,
    locale,
    contactEmail,
    siteName,
    description,
    language,
    chyrpUrl,
    allowRegistration,
    cleanUrls,
    feedFormat,
    postsInFeed,
    commentsPerPage,
    itemsPerAdminPage,

    // Actions
    refreshSettings,
    updateSettings: updateSettingsData,
    clearError: clearSettingsError,
    ensureFreshData,

    // Utilities
    getSetting,
    getEnabledModules,
    getActiveTheme,
    getEnabledFeathers,
    isModuleEnabled,
    isFeatherEnabled,

    // Computed values
    isLoaded: !!settings && !loading,
    hasError: !!error,
  };
}
