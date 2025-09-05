import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  createAdminSettingsAPI,
  Setting,
  UpdateSettingsData,
} from "@/lib/api-legacy/admin-settings-context";

export interface UseSettingsOptions {
  initialSettings?: Record<string, any>;
  onSaveSuccess?: (settings: Setting[]) => void;
  onSaveError?: (error: any) => void;
}

export interface UseSettingsReturn {
  settings: Record<string, any>;
  loading: boolean;
  saving: boolean;
  error: string | null;
  updateSetting: (name: string, value: any, type?: Setting["type"]) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  refreshSettings: () => Promise<void>;
}

export const useSettingsWithContext = (
  options: UseSettingsOptions = {}
): UseSettingsReturn => {
  const { data: session } = useSession({ required: false });
  const { initialSettings = {}, onSaveSuccess, onSaveError } = options;

  const [settings, setSettings] =
    useState<Record<string, any>>(initialSettings);
  const [originalSettings, setOriginalSettings] =
    useState<Record<string, any>>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if we've already loaded settings
  const initialFetchDone = useRef(false);

  // Convert settings array to object for easier manipulation
  const convertSettingsToObject = useCallback(
    (settingsArray: Setting[]): Record<string, any> => {
      const settingsObj: Record<string, any> = {};
      settingsArray.forEach((setting) => {
        let value: any = setting.value;

        // Convert based on type
        switch (setting.type) {
          case "boolean":
            value = setting.value === "true" || setting.value === "1";
            break;
          case "number":
            value = parseFloat(setting.value) || 0;
            break;
          case "json":
            try {
              value = JSON.parse(setting.value);
            } catch {
              value = setting.value;
            }
            break;
          default:
            value = setting.value;
        }

        settingsObj[setting.name] = value;
      });
      return settingsObj;
    },
    []
  );

  // Convert object back to settings format for API
  const convertObjectToSettings = useCallback(
    (settingsObj: Record<string, any>): UpdateSettingsData => {
      const settingsData: Record<string, any> = {};

      Object.entries(settingsObj).forEach(([name, value]) => {
        let stringValue: string;
        let type: Setting["type"] = "string";

        if (typeof value === "boolean") {
          stringValue = value.toString();
          type = "boolean";
        } else if (typeof value === "number") {
          stringValue = value.toString();
          type = "number";
        } else if (typeof value === "object" && value !== null) {
          stringValue = JSON.stringify(value);
          type = "json";
        } else {
          stringValue = String(value);
          type = "string";
        }

        settingsData[name] = {
          value: stringValue,
          type,
        };
      });

      return { settings: settingsData };
    },
    []
  );

  // Load settings from API
  const refreshSettings = useCallback(async () => {
    if (!session?.user?.accessToken) {
      setError("No authentication token available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create API instance only when needed
      const adminAPI = createAdminSettingsAPI(session.user.accessToken);
      const response = await adminAPI.getSettings();
      if (response.success) {
        const settingsObj = convertSettingsToObject(response.data);
        setSettings(settingsObj);
        setOriginalSettings(settingsObj);
      } else {
        setError(response.message || "Failed to load settings");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.accessToken, convertSettingsToObject]);

  // Update a single setting
  const updateSetting = useCallback(
    (name: string, value: any, type?: Setting["type"]) => {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Save all modified settings
  const saveSettings = useCallback(async () => {
    if (!session?.user?.accessToken) {
      setError("No authentication token available");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Create API instance only when needed
      const adminAPI = createAdminSettingsAPI(session.user.accessToken);
      const settingsData = convertObjectToSettings(settings);
      const response = await adminAPI.updateSettings(settingsData);

      if (response.success) {
        const updatedSettingsObj = convertSettingsToObject(response.data);
        setSettings(updatedSettingsObj);
        setOriginalSettings(updatedSettingsObj);
        onSaveSuccess?.(response.data);
      } else {
        setError(response.message || "Failed to save settings");
        onSaveError?.(new Error(response.message || "Failed to save settings"));
      }
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
      onSaveError?.(err);
    } finally {
      setSaving(false);
    }
  }, [
    session?.user?.accessToken,
    settings,
    convertObjectToSettings,
    convertSettingsToObject,
    onSaveSuccess,
    onSaveError,
  ]);

  // Reset to original values
  const resetSettings = useCallback(() => {
    setSettings(originalSettings);
    setError(null);
  }, [originalSettings]);

  // Load settings on mount or when session changes
  useEffect(() => {
    if (
      session?.user?.accessToken &&
      Object.keys(initialSettings).length === 0 &&
      !initialFetchDone.current
    ) {
      refreshSettings();
      initialFetchDone.current = true;
    }
  }, [session?.user?.accessToken, initialSettings]); // Don't include refreshSettings to avoid loops

  return {
    settings,
    loading,
    saving,
    error,
    updateSetting,
    saveSettings,
    resetSettings,
    refreshSettings,
  };
};
