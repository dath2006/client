"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Hash, Eye, EyeOff } from "lucide-react";
import type { Category } from "@/lib/api";

interface CategoryCardProps {
  category: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid Date";
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const postCountPercentage = Math.min((category.postCount / 25) * 100, 100);

  return (
    <motion.div
      className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-6"
      whileHover={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(247, 165, 165, 0.3)",
        y: -5,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Hash className="text-[#f7a5a5]" size={20} />
            <h3 className="text-lg font-semibold text-[#f7a5a5]">
              {category.name}
            </h3>
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={category.isListed ? "listed" : "unlisted"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-2 text-sm text-[#f7a5a5]/70">
            {/* ... other details ... */}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <motion.button
            onClick={() => onEdit(category.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            suppressHydrationWarning={true}
          >
            <Edit size={16} />
          </motion.button>
          <motion.button
            onClick={() => onDelete(category.id)}
            className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            suppressHydrationWarning={true}
          >
            <Trash2 size={16} />
          </motion.button>
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
          <motion.div
            className="bg-[#f7a5a5] h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${postCountPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;