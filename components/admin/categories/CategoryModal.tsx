"use client";

import React, { useState, useEffect } from "react";
import { X, Hash, Link, Eye } from "lucide-react";
import Toggle from "@/components/common/Toggle";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CategoryFormData) => void;
  category?: {
    id: string;
    name: string;
    slug: string;
    isListed: boolean;
    postCount: number;
    createdAt: Date;
    description?: string;
  } | null;
  mode: "create" | "edit";
}

export interface CategoryFormData {
  name: string;
  slug: string;
  isListed: boolean;
  description?: string;
}

const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  category,
  mode,
}: CategoryModalProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    isListed: true,
    description: "",
  });

  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});

  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        isListed: category.isListed,
        description: category.description || "",
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        slug: "",
        isListed: true,
        description: "",
      });
    }
    setErrors({});
  }, [mode, category, isOpen]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; slug?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    // Auto-generate slug if empty
    if (!formData.slug.trim()) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.name) }));
    } else {
      // Validate slug format
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(formData.slug)) {
        newErrors.slug =
          "Slug can only contain lowercase letters, numbers, and hyphens";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug when name changes (only for create mode)
    if (name === "name" && mode === "create") {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isListed: checked }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#2a2a2a] rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#f7a5a5]/20">
          <div className="flex items-center gap-3">
            <Hash className="text-[#f7a5a5]" size={24} />
            <h2 className="text-xl font-semibold text-[#f7a5a5]">
              {mode === "create" ? "Create Category" : "Edit Category"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-colors"
            suppressHydrationWarning={true}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
              text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
              transition-all duration-300"
              placeholder="Enter category name"
              suppressHydrationWarning={true}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Category Slug */}
          <div>
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              <div className="flex items-center gap-2">
                <Link size={16} />
                Slug (optional)
              </div>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
              text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
              transition-all duration-300"
              placeholder="category-slug"
              suppressHydrationWarning={true}
            />
            <p className="mt-1 text-xs text-[#f7a5a5]/50">
              The slug is the URL-friendly identifying name for this category.
            </p>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-400">{errors.slug}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
              text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
              transition-all duration-300 resize-none"
              placeholder="Brief description of this category..."
              suppressHydrationWarning={true}
            />
          </div>

          {/* Listed Toggle */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="text-[#f7a5a5]" size={16} />
                <label className="text-sm font-medium text-[#f7a5a5]">
                  Listed?
                </label>
              </div>
              <Toggle
                checked={formData.isListed}
                onChange={handleToggleChange}
              />
            </div>
            <p className="mt-1 text-xs text-[#f7a5a5]/50">
              Do you want to include this category in the categories list?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[#f7a5a5] border border-[#f7a5a5]/20 rounded-lg
              hover:bg-[#f7a5a5]/10 transition-colors"
              suppressHydrationWarning={true}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#f7a5a5] text-[#5d688a] rounded-lg
              hover:bg-[#ffdbb6] transition-colors font-medium"
              suppressHydrationWarning={true}
            >
              {mode === "create" ? "Create Category" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
