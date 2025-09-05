import apiClient, { ApiError, isAdminUser } from "./client";

export const adminUploadsAPI = {
  /**
   * Get uploads for admin panel
   */
  async getUploads(params: any = {}): Promise<{ data: any[] }> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.get("/api/v1/admin/uploads", { params });
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch uploads",
        error.response?.status
      );
    }
  },

  /**
   * Upload a new file
   */
  async uploadFile(fileData: FormData): Promise<any> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.post("/api/v1/admin/uploads", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to upload file",
        error.response?.status
      );
    }
  },

  /**
   * Update upload metadata
   */
  async updateUpload(uploadId: string, uploadData: any): Promise<any> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.put(
        `/api/v1/admin/uploads/${uploadId}`,
        uploadData
      );
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to update upload",
        error.response?.status
      );
    }
  },

  /**
   * Delete an upload
   */
  async deleteUpload(uploadId: string): Promise<void> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      await apiClient.delete(`/api/v1/admin/uploads/${uploadId}`);
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to delete upload",
        error.response?.status
      );
    }
  },

  /**
   * Download an upload
   */
  async downloadUpload(uploadId: string): Promise<Blob> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.get(
        `/api/v1/admin/uploads/${uploadId}/download`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to download upload",
        error.response?.status
      );
    }
  },
};
