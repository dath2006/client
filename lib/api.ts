import axios from "axios";
import {
  Post,
  PostType,
  PostStatus,
  PostContent,
  Comment,
  User,
} from "@/types/post";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/auth/signin";
      }
    }
    return Promise.reject(error);
  }
);

// API Types
export interface FeedParams {
  limit?: number;
  cursor?: string;
  type?: string;
  category?: number;
  search?: string;
}

export interface FeedResponse {
  posts: Post[];
  has_more: boolean;
  next_cursor: string | null;
  total_count?: number;
}

// Backend response format
interface BackendFeedResponse {
  value: BackendPost[];
  Count: number;
}

// Backend post format (with string dates)
interface BackendPost {
  id: string;
  title: string;
  type: PostType;
  author: User;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  status: PostStatus;
  tags: string[];
  category: string;
  likes: number;
  shares: number;
  saves: number;
  viewCount: number;
  content: PostContent;
  comments: Comment[];
}

// Helper function to transform backend post to frontend post
const transformPost = (backendPost: BackendPost): Post => ({
  ...backendPost,
  createdAt: new Date(backendPost.createdAt),
  updatedAt: new Date(backendPost.updatedAt),
});

// Custom Error class
export class ApiError extends Error {
  status?: number;
  details?: any;

  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// API Functions
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

// Utility function to check if error is ApiError
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

// Environment check utility
export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";

export default apiClient;
