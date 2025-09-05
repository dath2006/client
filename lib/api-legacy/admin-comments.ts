import apiClient, { ApiError } from "./client";

// Comment types
export interface Comment {
  id: string;
  author: {
    name: string;
    email: string;
    website?: string;
    avatar?: string;
    isRegistered: boolean;
  };
  content: string;
  status: "pending" | "approved" | "spam" | "rejected";
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  ipAddress: string;
  userAgent?: string;
  post: {
    id: string;
    title: string;
    slug: string;
  };
  parentId?: string; // For nested comments
  isReply?: boolean;
}

export interface PostWithComments {
  post: {
    id: string;
    title: string;
    slug: string;
    createdAt: string; // ISO date string
    author: {
      name: string;
      avatar?: string;
    };
  };
  comments: Comment[];
  totalComments: number;
  pendingCount: number;
  approvedCount: number;
  spamCount: number;
  rejectedCount: number;
}

export interface AdminCommentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "pending" | "approved" | "spam" | "rejected";
  postId?: string;
  sortBy?: "createdAt" | "updatedAt" | "author" | "status";
  sortOrder?: "asc" | "desc";
}

export interface AdminCommentsResponse {
  data: PostWithComments[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    pending: number;
    approved: number;
    spam: number;
    rejected: number;
  };
}

export interface UpdateCommentStatusData {
  status: Comment["status"];
}

export interface BatchCommentActionData {
  commentIds: string[];
  action: "approve" | "reject" | "spam" | "delete";
}

export interface BatchCommentActionResponse {
  success: boolean;
  updated: number;
  deleted: number;
  errors?: Array<{
    commentId: string;
    error: string;
  }>;
}

// Comments API functions
export const adminCommentsAPI = {
  // Get all comments with filtering and pagination
  getComments: async (
    params: AdminCommentsParams = {}
  ): Promise<AdminCommentsResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.status && params.status !== "all")
        searchParams.append("status", params.status);
      if (params.postId) searchParams.append("post_id", params.postId);
      if (params.sortBy) searchParams.append("sort", params.sortBy);
      if (params.sortOrder) searchParams.append("order", params.sortOrder);

      const response = await apiClient.get(
        `/api/v1/admin/comments?${searchParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to fetch comments: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to fetch comments", 500, String(error));
    }
  },

  // Get a specific comment by ID
  getComment: async (commentId: string): Promise<Comment> => {
    try {
      const response = await apiClient.get(
        `/api/v1/admin/comments/${commentId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to fetch comment: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to fetch comment", 500, String(error));
    }
  },

  // Update comment status
  updateCommentStatus: async (
    commentId: string,
    data: UpdateCommentStatusData
  ): Promise<Comment> => {
    try {
      const response = await apiClient.patch(
        `/api/v1/admin/comments/${commentId}/status`,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to update comment status: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to update comment status", 500, String(error));
    }
  },

  // Delete a comment
  deleteComment: async (
    commentId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete(
        `/api/v1/admin/comments/${commentId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to delete comment: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to delete comment", 500, String(error));
    }
  },

  // Batch actions on multiple comments
  batchAction: async (
    data: BatchCommentActionData
  ): Promise<BatchCommentActionResponse> => {
    try {
      const response = await apiClient.post(
        "/api/v1/admin/comments/batch",
        data
      );
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

  // Get comments statistics
  getStats: async (): Promise<AdminCommentsResponse["stats"]> => {
    try {
      const response = await apiClient.get("/api/v1/admin/comments/stats");
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to fetch comment stats: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to fetch comment stats", 500, String(error));
    }
  },
};
