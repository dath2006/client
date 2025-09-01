"use client";

import React, { useState } from "react";
import CategoryCard from "@/components/admin/categories/CategoryCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import CategoryModal, {
  CategoryFormData,
} from "@/components/admin/categories/CategoryModal";

interface Category {
  id: string;
  name: string;
  slug: string;
  isListed: boolean;
  postCount: number;
  createdAt: Date;
  description?: string;
}

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);

  // Mock categories data
  const mockCategories: Category[] = [
    {
      id: "1",
      name: "Technology",
      slug: "technology",
      isListed: true,
      postCount: 15,
      createdAt: new Date("2024-01-15"),
      description: "Latest technology trends and updates",
    },
    {
      id: "2",
      name: "Programming",
      slug: "programming",
      isListed: true,
      postCount: 23,
      createdAt: new Date("2024-02-01"),
      description: "Programming tutorials and guides",
    },
    {
      id: "3",
      name: "Design",
      slug: "design",
      isListed: true,
      postCount: 8,
      createdAt: new Date("2024-02-15"),
      description: "UI/UX design and creative content",
    },
    {
      id: "4",
      name: "Personal",
      slug: "personal",
      isListed: false,
      postCount: 5,
      createdAt: new Date("2024-03-01"),
      description: "Personal thoughts and experiences",
    },
    {
      id: "5",
      name: "Tutorials",
      slug: "tutorials",
      isListed: true,
      postCount: 12,
      createdAt: new Date("2024-03-10"),
      description: "Step-by-step guides and how-tos",
    },
  ];

  // Initialize categories with mock data
  React.useEffect(() => {
    setCategories(mockCategories);
  }, []);

  const handleEdit = (id: string) => {
    console.log("Editing category:", id);
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategory(category);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Deleting category:", id);
    if (
      confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      setCategories((prev) => prev.filter((category) => category.id !== id));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
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

  const handleCategorySave = (categoryData: CategoryFormData) => {
    if (modalMode === "create") {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryData.name,
        slug:
          categoryData.slug ||
          categoryData.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        isListed: categoryData.isListed,
        postCount: 0,
        createdAt: new Date(),
        description: categoryData.description,
      };
      setCategories((prev) => [...prev, newCategory]);
    } else if (modalMode === "edit" && selectedCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((category) =>
          category.id === selectedCategory.id
            ? {
                ...category,
                name: categoryData.name,
                slug:
                  categoryData.slug ||
                  categoryData.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, ""),
                isListed: categoryData.isListed,
                description: categoryData.description,
              }
            : category
        )
      );
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader
          title="Category"
          onSearch={handleSearch}
          onNew={handleNew}
        />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="grid gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {filteredCategories.length === 0 && categories.length > 0 && (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No categories found
              </h3>
              <p className="text-[#f7a5a5]/70">
                Try adjusting your search query.
              </p>
            </div>
          )}

          {categories.length === 0 && (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No categories found
              </h3>
              <p className="text-[#f7a5a5]/70 mb-4">
                Get started by creating your first category to organize your
                content.
              </p>
              <button
                onClick={handleNew}
                className="bg-[#f7a5a5] text-white px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
                suppressHydrationWarning={true}
              >
                Create Category
              </button>
            </div>
          )}
        </div>
      </div>

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
