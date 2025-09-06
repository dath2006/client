import apiClient, { ApiError } from "./client";
import {
  FeedParams,
  FeedResponse,
  BackendPost,
  transformPost,
  Post,
  Comment,
} from "./types";

// Helper function to get user IP address
const getUserIP = async (): Promise<string | null> => {
  try {
    // Use a public IP API service
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || null;
  } catch (error) {
    console.warn("Failed to fetch user IP:", error);
    return null;
  }
};

export const feedAPI = {
  /**
   * Fetch paginated posts for the feed
   */
  async getPosts(params: FeedParams = {}): Promise<FeedResponse> {
    try {
      console.log("API Request params:", params);
      const response = await apiClient.get("/api/v1/posts/feed", { params });
      console.log("Raw API response:", response.data);

      // New API response format
      // {
      //   data: [...],
      //   pagination: { nextCursor, hasMore, limit }
      // }
      let posts: BackendPost[] = [];
      let nextCursor: string | null = null;
      let hasMore = false;
      let totalCount: number | undefined = undefined;

      if (response.data && Array.isArray(response.data.data)) {
        posts = response.data.data;
        if (response.data.pagination) {
          // Use the dynamic cursor, hasMore, and limit from the API response
          nextCursor = response.data.pagination.nextCursor || null;
          hasMore = !!response.data.pagination.hasMore;
        } else {
          // Fallback logic if pagination object is missing
          const limit = params.limit || 10;
          hasMore = posts.length >= limit;
          nextCursor = hasMore ? String(posts.length) : null;
        }
      } else {
        throw new Error("Unexpected API response format");
      }

      // Transform backend posts to frontend posts
      const transformedPosts = posts.map(transformPost);
      console.log("Transformed posts:", transformedPosts);
      console.log("Posts length:", transformedPosts.length);

      return {
        posts: transformedPosts,
        has_more: hasMore,
        next_cursor: nextCursor,
        total_count: totalCount,
      };
    } catch (error: any) {
      console.error("API Error:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch posts",
        error.response?.status
      );
    }
  },

  /**
   * Get a single post by ID
   */
  async getPost(postId: string): Promise<Post> {
    try {
      const response = await apiClient.get(`/api/v1/posts/${postId}`);
      console.log("API Response for post:", response.data);

      // Check if response data exists
      if (!response.data) {
        throw new Error("Post not found");
      }

      // Transform the backend post to frontend format if needed
      const backendPost = response.data as BackendPost;
      return transformPost(backendPost);
    } catch (error: any) {
      console.error("Error fetching post:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch post",
        error.response?.status
      );
    }
  },

  /**
   * Search posts
   */
  async searchPosts(
    query: string,
    params: Omit<FeedParams, "search"> = {}
  ): Promise<FeedResponse> {
    try {
      const response = await apiClient.get("/api/v1/posts/feed", {
        params: { ...params, search: query },
      });

      // New API response format
      let posts: BackendPost[] = [];
      let nextCursor: string | null = null;
      let hasMore = false;
      let totalCount: number | undefined = undefined;

      if (response.data && Array.isArray(response.data.data)) {
        posts = response.data.data;
        if (response.data.pagination) {
          // Use the dynamic cursor, hasMore, and limit from the API response
          nextCursor = response.data.pagination.nextCursor || null;
          hasMore = !!response.data.pagination.hasMore;
        } else {
          // Fallback logic if pagination object is missing
          const limit = params.limit || 10;
          hasMore = posts.length >= limit;
          nextCursor = hasMore ? String(posts.length) : null;
        }
      } else {
        throw new Error("Unexpected API response format");
      }

      // Transform backend posts to frontend posts
      const transformedPosts = posts.map(transformPost);

      return {
        posts: transformedPosts,
        has_more: hasMore,
        next_cursor: nextCursor,
        total_count: totalCount,
      };
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to search posts",
        error.response?.status
      );
    }
  },

  /**
   * Submit a comment to a post
   */
  async submitComment(
    postId: string,
    content: string,
    userId?: string
  ): Promise<Comment> {
    try {
      const requestBody: any = {
        post_id: postId,
        content: content,
      };

      // Add userId if provided
      if (userId) {
        requestBody.user_id = userId;
      }

      // Get and add user IP address
      const userIP = await getUserIP();
      if (userIP) {
        requestBody.ip_address = userIP;
      }

      const response = await apiClient.post("/api/v1/comment", requestBody);

      if (!response.data) {
        throw new Error("Failed to submit comment");
      }

      // Transform the backend comment to frontend format
      return {
        id: response.data.id,
        author: {
          id: response.data.author.id,
          name: response.data.author.name,
          avatar: response.data.author.avatar,
        },
        content: response.data.content,
        createdAt: new Date(response.data.created_at),
        likes: response.data.likes || 0,
        replies: [],
      };
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to submit comment",
        error.response?.status
      );
    }
  },

  /**
   * Like or unlike a post
   */
  async toggleLike(
    postId: string,
    userId?: string
  ): Promise<{ liked: boolean; likeCount: number }> {
    try {
      const requestBody: any = {
        post_id: postId,
      };

      // Add userId if provided
      if (userId) {
        requestBody.user_id = userId;
      }

      // Get and add user IP address
      const userIP = await getUserIP();
      if (userIP) {
        requestBody.ip_address = userIP;
      }

      const response = await apiClient.post("/api/v1/posts/like", requestBody);

      if (!response.data) {
        throw new Error("Failed to toggle like");
      }

      return {
        liked: response.data.liked,
        likeCount: response.data.like_count || response.data.likeCount || 0,
      };
    } catch (error: any) {
      console.error("Error toggling like:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to toggle like",
        error.response?.status
      );
    }
  },

  /**
   * Record a view for a post
   */
  async recordView(
    postId: string,
    userId?: string
  ): Promise<{ viewCount: number }> {
    try {
      const requestBody: any = {
        post_id: postId,
      };

      // Add userId if provided
      if (userId) {
        requestBody.user_id = userId;
      }

      // Get and add user IP address
      const userIP = await getUserIP();
      if (userIP) {
        requestBody.ip_address = userIP;
      }

      const response = await apiClient.post("/api/v1/posts/view", requestBody);

      if (!response.data) {
        throw new Error("Failed to record view");
      }

      return {
        viewCount: response.data.view_count || response.data.viewCount || 0,
      };
    } catch (error: any) {
      console.error("Error recording view:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to record view",
        error.response?.status
      );
    }
  },

  /**
   * Check if user has liked a post
   */
  async checkLikeStatus(
    postId: string,
    userId?: string
  ): Promise<{ liked: boolean }> {
    try {
      const params: any = {
        post_id: postId,
      };

      if (userId) {
        params.user_id = userId;
      }

      const response = await apiClient.get("/api/v1/posts/like/status", {
        params,
      });

      return {
        liked: response.data?.liked || false,
      };
    } catch (error: any) {
      console.error("Error checking like status:", error);
      return { liked: false }; // Default to not liked on error
    }
  },

  /**
   * Get pinned posts
   */
  async getPinnedPosts(): Promise<Post[]> {
    try {
      const response = await apiClient.get("/api/v1/posts/pinned");

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Unexpected API response format");
      }

      // Transform backend posts to frontend posts
      const transformedPosts = response.data.map(transformPost);
      console.log("Fetched pinned posts:", transformedPosts);

      return transformedPosts;
    } catch (error: any) {
      console.error("Error fetching pinned posts:", error);
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch pinned posts",
        error.response?.status
      );
    }
  },
};
