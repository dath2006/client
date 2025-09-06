import apiClient, { ApiError } from "./client";

// User profile types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  website?: string | null;
  twitter_link?: string | null;
  facebook_link?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  name: string;
  website?: string | null;
  twitter_link?: string | null;
  facebook_link?: string | null;
}

export interface ChangePasswordData {
  current_password?: string;
  new_password: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
}

// User Profile API functions
export const userProfileAPI = {
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get(`/api/v1/users/${userId}`);

      if (!response.data) {
        throw new Error("User profile not found");
      }

      return response.data;
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch user profile",
        error.response?.status
      );
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<UserProfile> {
    try {
      const response = await apiClient.put(`/api/v1/users/${userId}`, data);

      if (!response.data) {
        throw new Error("Failed to update profile");
      }

      return response.data;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to update profile",
        error.response?.status
      );
    }
  },

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    data: ChangePasswordData
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.put(
        `/api/v1/users/${userId}/password`,
        data
      );

      return {
        message: response.data?.message || "Password updated successfully",
      };
    } catch (error: any) {
      console.error("Error changing password:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to change password",
        error.response?.status
      );
    }
  },

  /**
   * Update user avatar
   */
  async updateAvatar(
    userId: string,
    avatarFile: File
  ): Promise<{ avatar_url: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await apiClient.put(
        `/api/v1/users/${userId}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data) {
        throw new Error("Failed to update avatar");
      }

      return {
        avatar_url: response.data.avatar_url,
        message: response.data.message || "Avatar updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating avatar:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to update avatar",
        error.response?.status
      );
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete(`/api/v1/users/${userId}`);

      return {
        message: response.data?.message || "Account deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting account:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to delete account",
        error.response?.status
      );
    }
  },
};
