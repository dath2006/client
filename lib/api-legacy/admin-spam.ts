import apiClient, { ApiError } from "./client";

// Spam types
export interface SpamItem {
  id: string;
  type: "comment" | "pingback" | "trackback" | "contact_form";
  author: {
    name: string;
    email: string;
    website?: string;
    ipAddress: string;
  };
  content: string;
  detectedAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  source?: {
    post?: {
      id: string;
      title: string;
      slug: string;
    };
    form?: string;
  };
  status: "spam" | "approved" | "rejected";
}

export interface AdminSpamParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "all" | SpamItem["type"];
  status?: "all" | SpamItem["status"];
  sortBy?: "detectedAt" | "updatedAt" | "author" | "type" | "status";
  sortOrder?: "asc" | "desc";
}

export interface AdminSpamResponse {
  data: SpamItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    spam: number;
    approved: number;
    rejected: number;
    byType: {
      comment: number;
      pingback: number;
      trackback: number;
      contact_form: number;
    };
  };
}

export interface UpdateSpamStatusData {
  status: SpamItem["status"];
}

export interface BatchSpamActionData {
  spamIds: string[];
  action: "approve" | "reject" | "delete";
}

export interface BatchSpamActionResponse {
  success: boolean;
  updated: number;
  deleted: number;
  errors?: Array<{
    spamId: string;
    error: string;
  }>;
}

// Spam API functions
export const adminSpamAPI = {
  // Get all spam items with filtering and pagination
  getSpamItems: async (
    params: AdminSpamParams = {}
  ): Promise<AdminSpamResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.type && params.type !== "all")
        searchParams.append("type", params.type);
      if (params.status && params.status !== "all")
        searchParams.append("status", params.status);
      if (params.sortBy) searchParams.append("sort", params.sortBy);
      if (params.sortOrder) searchParams.append("order", params.sortOrder);

      const response = await apiClient.get(
        `/api/v1/admin/spam?${searchParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to fetch spam items: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to fetch spam items", 500, String(error));
    }
  },

  // Get a specific spam item by ID
  getSpamItem: async (spamId: string): Promise<SpamItem> => {
    try {
      const response = await apiClient.get(`/api/v1/admin/spam/${spamId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to fetch spam item: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to fetch spam item", 500, String(error));
    }
  },

  // Update spam item status
  updateSpamStatus: async (
    spamId: string,
    data: UpdateSpamStatusData
  ): Promise<SpamItem> => {
    try {
      const response = await apiClient.patch(
        `/api/v1/admin/spam/${spamId}/status`,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to update spam status: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to update spam status", 500, String(error));
    }
  },

  // Delete a spam item
  deleteSpamItem: async (
    spamId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete(`/api/v1/admin/spam/${spamId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to delete spam item: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to delete spam item", 500, String(error));
    }
  },

  // Batch actions on multiple spam items
  batchAction: async (
    data: BatchSpamActionData
  ): Promise<BatchSpamActionResponse> => {
    try {
      const response = await apiClient.post("/api/v1/admin/spam/batch", data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to perform batch action: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to perform batch action", 500, String(error));
    }
  },

  // Get spam statistics
  getStats: async (): Promise<AdminSpamResponse["stats"]> => {
    try {
      const response = await apiClient.get("/api/v1/admin/spam/stats");
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to fetch spam stats: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to fetch spam stats", 500, String(error));
    }
  },

  // Mark comment as spam (used when spam is detected from comments page)
  markCommentAsSpam: async (commentId: string): Promise<SpamItem> => {
    try {
      const response = await apiClient.post(`/api/v1/admin/spam/mark-comment`, {
        commentId,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to mark comment as spam: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to mark comment as spam", 500, String(error));
    }
  },
};
