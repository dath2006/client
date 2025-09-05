import { useCallback } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  adminSettingsAPI,
  createAdminSettingsAPIWithDispatch,
  UpdateSettingData,
  UpdateSettingsData,
} from "@/lib/api-legacy/admin-settings";
import { fetchSettings } from "@/lib/redux/settingsSlice";

/**
 * Hook for managing admin settings with automatic Redux state refresh
 *
 * This hook provides methods to update settings that automatically
 * refresh the Redux settings state after successful updates.
 */
export function useAdminSettings() {
  const dispatch = useAppDispatch();

  // Create API instance with dispatch integration
  const api = createAdminSettingsAPIWithDispatch(dispatch);

  // Force refresh settings (useful for manual refresh)
  const refreshSettings = useCallback(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Update a single setting with automatic Redux refresh
  const updateSetting = useCallback(
    async (name: string, data: UpdateSettingData) => {
      try {
        const result = await api.updateSetting(name, data);
        return result;
      } catch (error) {
        console.error("Failed to update setting:", error);
        throw error;
      }
    },
    [api]
  );

  // Update multiple settings with automatic Redux refresh
  const updateSettings = useCallback(
    async (data: UpdateSettingsData) => {
      try {
        const result = await api.updateSettings(data);
        return result;
      } catch (error) {
        console.error("Failed to update settings:", error);
        throw error;
      }
    },
    [api]
  );

  // Convenience method to update a single setting by key-value
  const updateSettingByKeyValue = useCallback(
    async (
      key: string,
      value: string | boolean | number | object,
      type?: "string" | "boolean" | "number" | "json"
    ) => {
      const settingData: UpdateSettingData = {
        value:
          typeof value === "object" ? JSON.stringify(value) : String(value),
        type:
          type ||
          (typeof value === "boolean"
            ? "boolean"
            : typeof value === "number"
            ? "number"
            : typeof value === "object"
            ? "json"
            : "string"),
      };

      return updateSetting(key, settingData);
    },
    [updateSetting]
  );

  // Convenience method to update multiple settings from a key-value object
  const updateSettingsFromObject = useCallback(
    async (settingsObj: Record<string, any>) => {
      const settings: Record<string, UpdateSettingData> = {};

      for (const [key, value] of Object.entries(settingsObj)) {
        settings[key] = {
          value:
            typeof value === "object" ? JSON.stringify(value) : String(value),
          type:
            typeof value === "boolean"
              ? "boolean"
              : typeof value === "number"
              ? "number"
              : typeof value === "object"
              ? "json"
              : "string",
        };
      }

      return updateSettings({ settings });
    },
    [updateSettings]
  );

  return {
    // Core API methods (with automatic Redux refresh)
    updateSetting,
    updateSettings,

    // Convenience methods
    updateSettingByKeyValue,
    updateSettingsFromObject,

    // Read-only methods (no Redux refresh needed)
    getSettings: api.getSettings,
    getSetting: api.getSetting,
    getSettingsByGroup: api.getSettingsByGroup,

    // Manual refresh
    refreshSettings,
  };
}
