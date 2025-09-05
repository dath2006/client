"use client";

import React, { useState, useEffect } from "react";
import CategoryCard from "@/components/admin/categories/CategoryCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import Pagination from "@/components/admin/common/Pagination";
import CategoryModal, {
  CategoryFormData,
} from "@/components/admin/categories/CategoryModal";
import { adminCategoriesAPI } from "@/lib/api";
import type { Category, AdminCategoriesParams } from "@/lib/api";

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  // Load categories from API
  const loadCategories = async (params: AdminCategoriesParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminCategoriesAPI.getCategories({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        ...params,
      });
      setCategories(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalCategories(response.pagination.totalCategories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount and when page/search changes
  useEffect(() => {
    loadCategories();
  }, [currentPage, searchQuery]);

  const handleEdit = (id: string) => {
    console.log("Editing category:", id);
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategory(category);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting category:", id);
    if (
      confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      try {
        await adminCategoriesAPI.deleteCategory(id);
        await loadCategories(); // Reload categories after deletion
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete category"
        );
        console.error("Error deleting category:", err);
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleNew = () => {
    console.log("Creating new category");
    setSelectedCategory(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCategorySave = async (categoryData: CategoryFormData) => {
    try {
      if (modalMode === "create") {
        // Create new category
        await adminCategoriesAPI.createCategory({
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          isListed: categoryData.isListed ?? true,
        });
      } else if (modalMode === "edit" && selectedCategory) {
        // Update existing category
        await adminCategoriesAPI.updateCategory(selectedCategory.id, {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          isListed: categoryData.isListed,
        });
      }

      // Reload categories after save
      await loadCategories();
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
      console.error("Error saving category:", err);
    }
  };

  // Remove client-side filtering since API handles search
  const displayCategories = categories;

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader
          title="Category"
          onSearch={handleSearch}
          onNew={handleNew}
        />
      </div>

      {error && (
        <div className=" border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto pt-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Loading categories...</div>
          </div>
        ) : displayCategories.length === 0 ? (
          <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
            <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
              No categories found
            </h3>
            <p className="text-[#f7a5a5]/70 mb-4">
              {searchQuery
                ? "Try adjusting your search query."
                : "Get started by creating your first category to organize your content."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleNew}
                className="bg-[#f7a5a5] text-white px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
                suppressHydrationWarning={true}
              >
                Create Category
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {displayCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && displayCategories.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={currentPage < totalPages}
            hasPrevPage={currentPage > 1}
            onPageChange={setCurrentPage}
            isLoading={loading}
          />
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleCategorySave}
        category={selectedCategory}
        mode={modalMode}
      />
    </div>
  );
};

export default CategoriesPage;
