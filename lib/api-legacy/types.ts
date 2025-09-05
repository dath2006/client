// Common types used across all API modules
import {
  Post as BasePost,
  PostType,
  PostStatus,
  PostContent,
  Comment,
  User,
} from "@/types/post";

// Re-export types for consistency
export type { PostType, PostStatus, PostContent, Comment, User };

// API Types
export interface FeedParams {
  limit?: number;
  cursor?: string;
  type?: string;
  category?: number;
  search?: string;
}

export interface FeedResponse {
  posts: BasePost[];
  has_more: boolean;
  next_cursor: string | null;
  total_count?: number;
}

// Backend response format
export interface BackendFeedResponse {
  value: BackendPost[];
  Count: number;
}

// Backend post format (with string dates)
export interface BackendPost {
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

// Admin API Types
export interface AdminPostParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
  category?: string;
  author?: string;
}

export interface AdminPostsResponse {
  data: BasePost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
  filters: {
    status: string | null;
    userId: string | null;
    search: string | null;
  };
}

export interface CreatePostData {
  title: string;
  type: PostType;
  content: PostContent;
  status: PostStatus;
  tags: string[];
  category: string;
  slug?: string;
  isPinned?: boolean;
  allowComments?: boolean;
  scheduledDate?: string;
  visibility?: string;
  visibilityGroups?: string[];
  rightsHolder?: string;
  license?: string;
  isOriginalWork?: boolean;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

// Helper function to transform backend post to frontend post
export const transformPost = (backendPost: BackendPost): BasePost => ({
  ...backendPost,
  createdAt: new Date(backendPost.createdAt),
  updatedAt: new Date(backendPost.updatedAt),
});

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isListed: boolean;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
  order?: number;
  parentId?: string | null;
  children?: Category[];
}

export interface AdminCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  isListed?: boolean;
  parentId?: string;
  sortBy?: "name" | "createdAt" | "postCount" | "order";
  sortOrder?: "asc" | "desc";
}

export interface AdminCategoriesResponse {
  data: Category[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCategories: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
  filters: {
    search: string | null;
    isListed: boolean | null;
    parentId: string | null;
  };
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  isListed?: boolean;
  parentId?: string | null;
  order?: number;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

// Re-export Post type for consistency
export type Post = BasePost;
