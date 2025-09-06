import apiClient, { ApiError } from "./client";
import {
  AdminCategoriesParams,
  AdminCategoriesResponse,
  CreateCategoryData,
  UpdateCategoryData,
  Category,
} from "./types";

// Helper function to transform backend category response to frontend format
const transformCategory = (backendCategory: any): Category => ({
  ...backendCategory,
  createdAt: new Date(backendCategory.createdAt),
  updatedAt: new Date(backendCategory.updatedAt),
});

// Helper function to transform array of categories
const transformCategories = (categories: any[]): Category[] => {
  return categories.map(transformCategory);
};

export const adminCategoriesAPI = {
  /**
   * Get all categories for dropdown/selection (simplified)
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get("/api/v1/categories");

      // Transform the categories in the response
      const categories = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      return transformCategories(categories);
    } catch (error: any) {
      throw new ApiError(
        "Failed to fetch categories",
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Get paginated categories for admin management
   */
  async getCategories(
    params: AdminCategoriesParams = {}
  ): Promise<AdminCategoriesResponse> {
    try {
      const response = await apiClient.get("/api/v1/admin/categories", {
        params,
      });

      // Transform the categories in the response
      const transformedResponse = {
        ...response.data,
        data: transformCategories(response.data.data || []),
      };

      return transformedResponse;
    } catch (error: any) {
      throw new ApiError(
        "Failed to fetch categories",
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Get a specific category by ID
   */
  async getCategory(id: string): Promise<Category> {
    try {
      const response = await apiClient.get(`/api/v1/admin/categories/${id}`);
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        `Failed to fetch category ${id}`,
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Create a new category
   */
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    try {
      const response = await apiClient.post(
        "/api/v1/admin/categories",
        categoryData
      );
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        "Failed to create category",
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Update an existing category
   */
  async updateCategory(
    id: string,
    categoryData: UpdateCategoryData
  ): Promise<Category> {
    try {
      const response = await apiClient.put(
        `/api/v1/admin/categories/${id}`,
        categoryData
      );
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        `Failed to update category ${id}`,
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/admin/categories/${id}`);
    } catch (error: any) {
      throw new ApiError(
        `Failed to delete category ${id}`,
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Bulk delete categories
   */
  async deleteCategories(ids: string[]): Promise<void> {
    try {
      await apiClient.delete("/api/v1/admin/categories", { data: { ids } });
    } catch (error: any) {
      throw new ApiError(
        "Failed to delete categories",
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Toggle category visibility
   */
  async toggleCategoryVisibility(id: string): Promise<Category> {
    try {
      const response = await apiClient.patch(
        `/api/v1/admin/categories/${id}/toggle-visibility`
      );
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        `Failed to toggle visibility for category ${id}`,
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Search categories
   */
  async searchCategories(query: string): Promise<Category[]> {
    try {
      const response = await apiClient.get("/api/v1/admin/categories/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        "Failed to search categories",
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<{
    total: number;
    listed: number;
    unlisted: number;
    totalPosts: number;
  }> {
    try {
      const response = await apiClient.get("/api/v1/admin/categories/stats");
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        "Failed to fetch category statistics",
        error?.response?.status,
        error?.response?.data
      );
    }
  },

  /**
   * Reorder categories
   */
  async reorderCategories(categoryIds: string[]): Promise<void> {
    try {
      await apiClient.put("/api/v1/admin/categories/reorder", {
        categoryIds,
      });
    } catch (error: any) {
      throw new ApiError(
        "Failed to reorder categories",
        error?.response?.status,
        error?.response?.data
      );
    }
  },
};
