"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import CategoryCard from "@/components/admin/categories/CategoryCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import Pagination from "@/components/admin/common/Pagination";
import CategoryModal, {
  CategoryFormData,
} from "@/components/admin/categories/CategoryModal";
import { adminCategoriesAPI } from "@/lib/api";
import type { Category, AdminCategoriesParams } from "@/lib/api";

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadCategories(), 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery]);

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategory(category);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      try {
        await adminCategoriesAPI.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete category"
        );
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleNew = () => {
    setSelectedCategory(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCategorySave = async (categoryData: CategoryFormData) => {
    try {
      if (modalMode === "create") {
        await adminCategoriesAPI.createCategory({
          ...categoryData,
          isListed: categoryData.isListed ?? true,
        });
      } else if (modalMode === "edit" && selectedCategory) {
        await adminCategoriesAPI.updateCategory(
          selectedCategory.id,
          categoryData
        );
      }
      await loadCategories();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 z-10 pb-4 border-b bg-background/95 backdrop-blur-sm border-border"
      >
        <SearchHeader
          title="Category"
          onSearch={handleSearch}
          onNew={handleNew}
        />
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 my-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 pt-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <div className="text-muted-foreground">Loading categories...</div>
            </motion.div>
          ) : categories.length === 0 ? (
            <motion.div
              key="empty"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-8 text-center bg-white/5 rounded-lg border border-[#f7a5a5]/20"
            >
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No categories found
              </h3>
              <p className="text-[#f7a5a5]/70 mb-4">
                {searchQuery
                  ? "Try adjusting your search query."
                  : "Get started by creating your first category."}
              </p>
              {!searchQuery && (
                <motion.button
                  onClick={handleNew}
                  className="bg-[#f7a5a5] text-white px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Category
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="categories-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid gap-4"
            >
              <AnimatePresence>
                {categories.map((category) => (
                  <motion.div key={category.id} variants={itemVariants} layout>
                    <CategoryCard
                      category={category}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!loading && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          {/* FIX: Added missing hasNextPage and hasPrevPage props */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            hasNextPage={currentPage < totalPages}
            hasPrevPage={currentPage > 1}
          />
        </motion.div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <CategoryModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleCategorySave}
            category={selectedCategory}
            mode={modalMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesPage;
