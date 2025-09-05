"use client";

import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Eye, Mail, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    lastLogin: Date | null;
    createdAt: Date;
    role: "admin" | "friend" | "banned" | "guest" | "member";
    stats: {
      comments: number;
      likedPosts: number;
      posts: number;
    };
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewData: (id: string) => void;
}

const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const statItemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const UserCard = ({ user, onEdit, onDelete, onViewData }: UserCardProps) => {
  const getRoleColor = (role: string) => {
    // ... (This function remains the same)
    switch (role) {
      case "admin":
        return "text-red-400 bg-red-400/10";
      case "editor":
        return "text-blue-400 bg-blue-400/10";
      case "contributor":
        return "text-green-400 bg-green-400/10";
      case "member":
        return "text-[#f7a5a5]/70 bg-[#f7a5a5]/10";
      default:
        return "text-[#f7a5a5]/70 bg-[#f7a5a5]/10";
    }
  };

  const formatLastLogin = (date: Date | null) => {
    if (!date) return "Never";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <motion.div
      className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4"
      whileHover={{
        y: -5,
        borderColor: "rgba(247, 165, 165, 0.5)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-medium text-[#f7a5a5] hover:text-[#ffdbb6] transition-colors duration-300 cursor-pointer">
              {user.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                user.role
              )}`}
            >
              {user.role}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm text-[#f7a5a5]/70">
            {/* ... user details ... */}
          </div>

          <motion.div
            className="flex items-center gap-4 text-xs text-[#f7a5a5]/60"
            variants={statsContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              className="bg-[#f7a5a5]/10 px-2 py-1 rounded"
              variants={statItemVariants}
            >
              {user.stats.posts} posts
            </motion.span>
            <motion.span
              className="bg-[#f7a5a5]/10 px-2 py-1 rounded"
              variants={statItemVariants}
            >
              {user.stats.comments} comments
            </motion.span>
            <motion.span
              className="bg-[#f7a5a5]/10 px-2 py-1 rounded"
              variants={statItemVariants}
            >
              {user.stats.likedPosts} likes
            </motion.span>
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onViewData(user.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg"
            title="View user data"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye size={18} />
          </motion.button>
          <motion.button
            onClick={() => onEdit(user.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg"
            title="Edit user"
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit2 size={18} />
          </motion.button>
          <motion.button
            onClick={() => onDelete(user.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
            title="Delete user"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;