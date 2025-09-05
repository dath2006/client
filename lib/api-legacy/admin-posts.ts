import apiClient, { ApiError, isAdminUser } from "./client";
import {
  AdminPostParams,
  AdminPostsResponse,
  CreatePostData,
  UpdatePostData,
  Post,
  transformPost,
  PostType,
} from "./types";

export const adminPostsAPI = {
  /**
   * Get posts for admin panel with pagination
   */
  async getPosts(params: AdminPostParams = {}): Promise<AdminPostsResponse> {
    // Check if user has admin role
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      throw new ApiError("Admin access required", 403);
    }

    try {
      const response = await apiClient.get("/api/v1/admin/posts", { params });

      const data = response.data;

      // Check if response already has the new format
      if (data.data && data.pagination) {
        return {
          data: data.data.map(transformPost),
          pagination: data.pagination,
          filters: data.filters || {
            status: null,
            userId: null,
            search: null,
          },
        };
      }

      // Handle legacy format
      const posts = data.posts ? data.posts.map(transformPost) : [];

      return {
        data: posts,
        pagination: {
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalPosts: data.totalCount || posts.length,
          limit: params.limit || 10,
          hasNext: data.hasNextPage || false,
          hasPrevious: data.hasPrevPage || false,
          nextPage: data.hasNextPage ? (data.currentPage || 1) + 1 : null,
          previousPage: data.hasPrevPage ? (data.currentPage || 1) - 1 : null,
        },
        filters: {
          status: null,
          userId: null,
          search: params.search || null,
        },
      };
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch posts",
        error.response?.status
      );
    }
  },

  /**
   * Create a new post - handles both JSON and multipart/form-data
   */
  async createPost(postData: CreatePostData): Promise<Post> {
    // Check if user has admin role
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      throw new ApiError("Admin access required", 403);
    }

    try {
      console.log("Create post data:", postData);

      // Check if post contains file uploads
      const hasFiles = this.postHasFiles(postData);

      if (hasFiles) {
        // Use multipart/form-data for posts with files
        const formData = this.createFormData(postData);

        const response = await apiClient.post("/api/v1/admin/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return transformPost(response.data);
      } else {
        // Use JSON for text-only posts
        const response = await apiClient.post("/api/v1/admin/posts", postData);
        return transformPost(response.data);
      }
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to create post",
        error.response?.status
      );
    }
  },

  /**
   * Check if post data contains file uploads
   */
  postHasFiles(postData: CreatePostData): boolean {
    const { type, content } = postData;

    switch (type) {
      case "photo":
        return !!(content as any).imageFiles?.length;
      case "video":
        return (
          !!(content as any).videoFile ||
          !!(content as any).posterImage ||
          !!(content as any).captionFiles?.length
        );
      case "audio":
        return !!(content as any).audioFile || !!(content as any).captionFile;
      case "file":
        return !!(content as any).files?.length;
      default:
        return false;
    }
  },

  /**
   * Create FormData for multipart upload
   */
  createFormData(postData: CreatePostData): FormData {
    const formData = new FormData();
    const { type, content, ...metadata } = postData;

    // Add metadata as JSON string
    const metadataJson = {
      ...metadata,
      type,
      content: this.extractNonFileContent(type, content),
    };
    formData.append("data", JSON.stringify(metadataJson));

    // Add files based on post type
    switch (type) {
      case "photo":
        this.addPhotoFiles(formData, content as any);
        break;
      case "video":
        this.addVideoFiles(formData, content as any);
        break;
      case "audio":
        this.addAudioFiles(formData, content as any);
        break;
      case "file":
        this.addGeneralFiles(formData, content as any);
        break;
    }

    return formData;
  },

  /**
   * Extract non-file content for JSON metadata
   */
  extractNonFileContent(type: PostType, content: any): any {
    const nonFileContent = { ...content };

    switch (type) {
      case "photo":
        delete nonFileContent.imageFiles;
        break;
      case "video":
        delete nonFileContent.videoFile;
        delete nonFileContent.posterImage;
        delete nonFileContent.captionFiles;
        break;
      case "audio":
        delete nonFileContent.audioFile;
        delete nonFileContent.captionFile;
        break;
      case "file":
        delete nonFileContent.files;
        break;
    }

    return nonFileContent;
  },

  /**
   * Add photo files to FormData
   */
  addPhotoFiles(formData: FormData, content: any): void {
    if (content.imageFiles?.length) {
      // Backend expects "imageFiles" as a list, not indexed
      content.imageFiles.forEach((file: File) => {
        formData.append("imageFiles", file);
      });
    }
  },

  /**
   * Add video files to FormData
   */
  addVideoFiles(formData: FormData, content: any): void {
    if (content.videoFile) {
      formData.append("videoFile", content.videoFile);
    }
    if (content.posterImage) {
      formData.append("posterImage", content.posterImage);
    }
    if (content.captionFiles?.length) {
      // Backend expects "captionFiles" as a list, not indexed
      content.captionFiles.forEach((file: File) => {
        formData.append("captionFiles", file);
      });
    }
  },

  /**
   * Add audio files to FormData
   */
  addAudioFiles(formData: FormData, content: any): void {
    if (content.audioFile) {
      formData.append("audioFile", content.audioFile);
    }
    if (content.captionFile) {
      formData.append("captionFile", content.captionFile);
    }
  },

  /**
   * Add general files to FormData
   */
  addGeneralFiles(formData: FormData, content: any): void {
    if (content.files?.length) {
      // Backend expects "files" as a list, not indexed
      content.files.forEach((file: File) => {
        formData.append("files", file);
      });
    }
  },

  /**
   * Update an existing post - handles both JSON and multipart/form-data
   */
  async updatePost(postData: UpdatePostData): Promise<Post> {
    // Check if user has admin role
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      throw new ApiError("Admin access required", 403);
    }

    try {
      const { id, ...updateData } = postData;

      // Check if post contains file uploads
      const hasFiles = updateData.content
        ? this.postHasFiles(updateData as CreatePostData)
        : false;

      if (hasFiles) {
        // Use multipart/form-data for posts with files
        const formData = this.createFormData(updateData as CreatePostData);

        const response = await apiClient.put(
          `/api/v1/admin/posts/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return transformPost(response.data);
      } else {
        // Use JSON for text-only posts
        const response = await apiClient.put(
          `/api/v1/admin/posts/${id}`,
          updateData
        );
        return transformPost(response.data);
      }
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to update post",
        error.response?.status
      );
    }
  },

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    // Check if user has admin role
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      throw new ApiError("Admin access required", 403);
    }

    try {
      await apiClient.delete(`/api/v1/admin/posts/${postId}`);
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to delete post",
        error.response?.status
      );
    }
  },

  /**
   * Get post by ID for editing
   */
  async getPost(postId: string): Promise<Post> {
    // Check if user has admin role
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      throw new ApiError("Admin access required", 403);
    }

    try {
      const response = await apiClient.get(`/api/v1/admin/posts/${postId}`);
      return transformPost(response.data);
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch post",
        error.response?.status
      );
    }
  },

  /**
   * Get all posts for tag management
   */
  async getAllPosts(params: any = {}): Promise<{ data: any[] }> {
    const isAdmin = await isAdminUser();
    if (!isAdmin) throw new ApiError("Admin access required", 403);
    try {
      const response = await apiClient.get("/api/v1/admin/posts/all", {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.detail || "Failed to fetch all posts",
        error.response?.status
      );
    }
  },
};
