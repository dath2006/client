import apiClient, { ApiError } from "./client";

// User comment types
export interface UserComment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  body?: string;
  createdAt: string;
  updatedAt?: string;
  postId: string;
  parentId?: string;
  likes: number;
  replies: UserComment[];
}

export interface UpdateCommentData {
  content?: string;
  body?: string;
}

export interface CreateCommentData {
  content: string;
  body?: string;
  postId: string;
  parentId?: string;
}

// User comments API - for authenticated users to manage their own comments
export const userCommentsAPI = {
  // Create a new comment
  createComment: async (data: CreateCommentData): Promise<UserComment> => {
    try {
      const response = await apiClient.post("/api/v1/comments", data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to create comment: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to create comment", 500, String(error));
    }
  },

  // Update user's own comment
  updateComment: async (
    commentId: string,
    data: UpdateCommentData
  ): Promise<UserComment> => {
    try {
      const response = await apiClient.patch(
        `/api/v1/comments/${commentId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(
          `Failed to update comment: ${error.response.status}`,
          error.response.status,
          error.response.data
        );
      }
      throw new ApiError("Failed to update comment", 500, String(error));
    }
  },

  // Delete user's own comment
  deleteComment: async (
    commentId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete(`/api/v1/comments/${commentId}`);
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

  // Get comments for a post (public endpoint)
  getPostComments: async (postId: string): Promise<UserComment[]> => {
    try {
      const response = await apiClient.get(`/api/v1/posts/${postId}/comments`);
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
};

export default userCommentsAPI;
