import apiClient, { ApiError, isAdminUser } from "./client";
import { User } from "./types";

export const adminUsersAPI = {
  /**
   * Get users for admin panel
   */
  async getUsers(params: any = {}): Promise<{ data: User[] }> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.get("/api/v1/admin/users", { params });
      // Expecting { data: User[] }
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch users",
        error.response?.status
      );
    }
  },

  /**
   * Create a new user
   */
  async createUser(userData: any): Promise<User> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.post("/api/v1/admin/users", userData);
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to create user",
        error.response?.status
      );
    }
  },

  /**
   * Update an existing user
   */
  async updateUser(userId: string, userData: any): Promise<User> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.put(
        `/api/v1/admin/users/${userId}`,
        userData
      );
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to update user",
        error.response?.status
      );
    }
  },

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<void> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      await apiClient.delete(`/api/v1/admin/users/${userId}`);
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to delete user",
        error.response?.status
      );
    }
  },
};
