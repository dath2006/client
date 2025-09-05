import apiClient, { ApiError, isAdminUser } from "./client";

export const adminGroupsAPI = {
  /**
   * Get groups for admin panel
   */
  async getGroups(params: any = {}): Promise<{ data: any[] }> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.get("/api/v1/admin/groups", { params });
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch groups",
        error.response?.status
      );
    }
  },

  /**
   * Create a new group
   */
  async createGroup(groupData: any): Promise<any> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.post("/api/v1/admin/groups", groupData);
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to create group",
        error.response?.status
      );
    }
  },

  /**
   * Update an existing group
   */
  async updateGroup(groupId: string, groupData: any): Promise<any> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.put(
        `/api/v1/admin/groups/${groupId}`,
        groupData
      );
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to update group",
        error.response?.status
      );
    }
  },

  /**
   * Delete a group
   */
  async deleteGroup(groupId: string): Promise<void> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      await apiClient.delete(`/api/v1/admin/groups/${groupId}`);
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to delete group",
        error.response?.status
      );
    }
  },
};
