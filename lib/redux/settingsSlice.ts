import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api";
import { SiteSettings, SettingsState } from "@/types/settings";

// Async thunk for fetching settings
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/v1/settings");
      return response.data as SiteSettings;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings"
      );
    }
  }
);

// Async thunk for updating settings (admin only)
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settings: Partial<SiteSettings>, { rejectWithValue }) => {
    try {
      const response = await apiClient.put("/api/v1/settings", settings);
      return response.data as SiteSettings;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update settings"
      );
    }
  }
);

const initialState: SettingsState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
  isInitialLoad: true, // Initially true until first successful fetch
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSettings: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
      state.isInitialLoad = true; // Reset to initial load state
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSettings.fulfilled,
        (state, action: PayloadAction<SiteSettings>) => {
          state.loading = false;
          state.data = action.payload;
          state.lastFetched = Date.now();
          state.error = null;
          state.isInitialLoad = false; // Mark initial load as complete
        }
      )
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isInitialLoad = false; // Mark initial load as complete even on error
      })
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateSettings.fulfilled,
        (state, action: PayloadAction<SiteSettings>) => {
          state.loading = false;
          state.data = action.payload;
          state.lastFetched = Date.now();
          state.error = null;
        }
      )
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
