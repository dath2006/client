import apiClient, { ApiError } from "./client";
import {
  FeedParams,
  FeedResponse,
  BackendPost,
  transformPost,
  Post,
} from "./types";

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
};
