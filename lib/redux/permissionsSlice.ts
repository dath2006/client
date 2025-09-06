import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api";
import { UserPermissions, PermissionsState } from "@/types/settings";

// Async thunk for fetching permissions
export const fetchPermissions = createAsyncThunk(
  "permissions/fetchPermissions",
  async (userRole: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/v1/permissions", {
        params: { role: userRole },
      });
      return {
        permissions: response.data.permissions as UserPermissions,
        userRole,
        groupId: response.data.group_id,
        groupName: response.data.group_name,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch permissions"
      );
    }
  }
);

const initialState: PermissionsState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
  userRole: null,
  groupId: null,
  groupName: null,
  isInitialLoad: true,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPermissions: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
      state.userRole = null;
      state.groupId = null;
      state.groupName = null;
      state.isInitialLoad = true;
    },
    // Action to update user role without fetching (useful for optimistic updates)
    setUserRole: (state, action: PayloadAction<string>) => {
      state.userRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPermissions.fulfilled,
        (
          state,
          action: PayloadAction<{
            permissions: UserPermissions;
            userRole: string;
            groupId: number;
            groupName: string;
          }>
        ) => {
          state.loading = false;
          state.data = action.payload.permissions;
          state.userRole = action.payload.userRole;
          state.groupId = action.payload.groupId;
          state.groupName = action.payload.groupName;
          state.lastFetched = Date.now();
          state.error = null;
          state.isInitialLoad = false;
        }
      )
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isInitialLoad = false;
      });
  },
});

export const { clearError, resetPermissions, setUserRole } =
  permissionsSlice.actions;
export default permissionsSlice.reducer;
