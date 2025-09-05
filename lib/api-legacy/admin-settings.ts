import apiClient from "./client";
import { AppDispatch } from "@/lib/redux/store";
import { fetchSettings } from "@/lib/redux/settingsSlice";

// Setting types based on the database schema
export interface Setting {
  id: number;
  name: string;
  value: string;
  description?: string;
  type: "string" | "boolean" | "number" | "json";
  created_at: string;
  updated_at: string;
}

// API response types
export interface AdminSettingsResponse {
  success: boolean;
  data: Setting[];
  message?: string;
}

export interface UpdateSettingData {
  value: string;
  type?: "string" | "boolean" | "number" | "json";
  description?: string;
}

export interface UpdateSettingsData {
  settings: Record<string, UpdateSettingData>;
}

export interface UpdateSettingsResponse {
  success: boolean;
  data: Setting[];
  message?: string;
}

// Settings API functions
export const adminSettingsAPI = {
  // Get all settings
  getSettings: async (): Promise<AdminSettingsResponse> => {
    const response = await apiClient.get("/api/v1/admin/settings");
    return response.data;
  },

  // Get a specific setting by name
  getSetting: async (
    name: string
  ): Promise<{ success: boolean; data: Setting; message?: string }> => {
    const response = await apiClient.get(`/api/v1/admin/settings/${name}`);
    return response.data;
  },

  // Update a single setting
  updateSetting: async (
    name: string,
    data: UpdateSettingData,
    dispatch?: AppDispatch
  ): Promise<{ success: boolean; data: Setting; message?: string }> => {
    const response = await apiClient.put(
      `/api/v1/admin/settings/${name}`,
      data
    );

    // Refresh Redux settings state after successful update
    if (response.data.success && dispatch) {
      dispatch(fetchSettings());
    }

    return response.data;
  },

  // Update multiple settings
  updateSettings: async (
    data: UpdateSettingsData,
    dispatch?: AppDispatch
  ): Promise<UpdateSettingsResponse> => {
    const response = await apiClient.put("/api/v1/admin/settings", data);

    // Refresh Redux settings state after successful update
    if (response.data.success && dispatch) {
      dispatch(fetchSettings());
    }

    return response.data;
  },

  // Get settings by category/group (helper function)
  getSettingsByGroup: async (group: string): Promise<AdminSettingsResponse> => {
    const response = await apiClient.get(
      `/api/v1/admin/settings?group=${group}`
    );
    return response.data;
  },
};

// Redux-integrated API functions (recommended for use in components)
export const createAdminSettingsAPIWithDispatch = (dispatch: AppDispatch) => ({
  // Get all settings
  getSettings: () => adminSettingsAPI.getSettings(),

  // Get a specific setting by name
  getSetting: (name: string) => adminSettingsAPI.getSetting(name),

  // Update a single setting with automatic Redux refresh
  updateSetting: async (name: string, data: UpdateSettingData) => {
    return adminSettingsAPI.updateSetting(name, data, dispatch);
  },

  // Update multiple settings with automatic Redux refresh
  updateSettings: async (data: UpdateSettingsData) => {
    return adminSettingsAPI.updateSettings(data, dispatch);
  },

  // Get settings by category/group
  getSettingsByGroup: (group: string) =>
    adminSettingsAPI.getSettingsByGroup(group),
});
