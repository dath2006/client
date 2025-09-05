"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Edit2,
  Trash2,
  Eye,
  User,
  Calendar,
  Globe,
  List,
  Check,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PageCardProps {
  page: {
    id: string;
    title: string;
    createdDate: Date;
    editedDate: Date;
    views: number;
    isPublic: boolean;
    isListed: boolean;
    author: {
      name: string;
    };
    status: "published" | "draft" | "archived";
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// --- Animation Variants ---
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const detailsItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const PageCard = ({ page, onEdit, onDelete }: PageCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-400 bg-green-400/10";
      case "draft":
        return "text-yellow-400 bg-yellow-400/10";
      case "archived":
        return "text-[#f7a5a5]/70 bg-[#f7a5a5]/10";
      default:
        return "text-[#f7a5a5]/70 bg-[#f7a5a5]/10";
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
      className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg overflow-hidden"
    >
      {/* Header with Title and Status */}
      <div className="p-4 border-b border-[#f7a5a5]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-[#f7a5a5] hover:text-[#ffdbb6] transition-colors duration-300 cursor-pointer">
              {page.title}
            </h3>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                page.status
              )}`}
            >
              {page.status}
            </motion.span>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(247, 165, 165, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(page.id)}
              className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] rounded-lg"
              title="Edit page"
            >
              <Edit2 size={16} />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.1,
                color: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(page.id)}
              className="p-2 text-[#f7a5a5]/70 rounded-lg"
              title="Delete page"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Created */}
          <motion.div variants={detailsItemVariants} className="flex flex-col">
            {/* ... content ... */}
          </motion.div>

          {/* Last Updated */}
          <motion.div variants={detailsItemVariants} className="flex flex-col">
            {/* ... content ... */}
          </motion.div>

          {/* Author */}
          <motion.div variants={detailsItemVariants} className="flex flex-col">
            {/* ... content ... */}
          </motion.div>

          {/* Public & Listed Status */}
          <motion.div variants={detailsItemVariants} className="flex flex-col">
            {/* ... content ... */}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PageCard;
