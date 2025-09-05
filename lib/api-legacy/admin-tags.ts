import apiClient, { ApiError, isAdminUser } from "./client";

export const adminTagsAPI = {
  /**
   * Get tags for admin panel
   */
  async getTags(params: any = {}): Promise<{ data: any[] }> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.get("/api/v1/admin/tags", { params });
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch tags",
        error.response?.status
      );
    }
  },

  /**
   * Create a new tag
   */
  async createTag(tagData: any): Promise<any> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.post("/api/v1/admin/tags", tagData);
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to create tag",
        error.response?.status
      );
    }
  },

  /**
   * Update an existing tag
   */
  async updateTag(tagId: string, tagData: any): Promise<any> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.put(
        `/api/v1/admin/tags/${tagId}`,
        tagData
      );
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to update tag",
        error.response?.status
      );
    }
  },

  /**
   * Delete a tag
   */
  async deleteTag(tagId: string): Promise<void> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      await apiClient.delete(`/api/v1/admin/tags/${tagId}`);
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to delete tag",
        error.response?.status
      );
    }
  },

  /**
   * Get tag by ID with associated posts
   */
  async getTag(tagId: string): Promise<any> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.get(`/api/v1/admin/tags/${tagId}`);
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch tag",
        error.response?.status
      );
    }
  },
};
