"use client";

import React from "react";
import { Edit, Trash2, Hash, Eye, EyeOff } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  isListed: boolean;
  postCount: number;
  createdAt: Date;
  description?: string;
}

interface CategoryCardProps {
  category: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-6 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Hash className="text-[#f7a5a5]" size={20} />
            <h3 className="text-lg font-semibold text-[#f7a5a5]">
              {category.name}
            </h3>
            <div className="flex items-center gap-2">
              {category.isListed ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                  <Eye size={12} />
                  Listed
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                  <EyeOff size={12} />
                  Unlisted
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm text-[#f7a5a5]/70">
            <div>
              <span className="font-medium">Slug:</span> /{category.slug}
            </div>
            <div>
              <span className="font-medium">Posts:</span> {category.postCount}{" "}
              post{category.postCount !== 1 ? "s" : ""}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {formatDate(category.createdAt)}
            </div>
            {category.description && (
              <div>
                <span className="font-medium">Description:</span>{" "}
                {category.description}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(category.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-colors"
            suppressHydrationWarning={true}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            suppressHydrationWarning={true}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress bar for post count visualization */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-[#f7a5a5]/50">Content Activity</span>
          <span className="text-xs text-[#f7a5a5]/50">
            {category.postCount} posts
          </span>
        </div>
        <div className="w-full bg-[#f7a5a5]/10 rounded-full h-2">
          <div
            className="bg-[#f7a5a5] h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((category.postCount / 25) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
