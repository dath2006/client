"use client";

import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Users, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    userCount: number;
    createdAt: Date;
    description?: string;
    permissions: string[];
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const tagContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const tagItemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const GroupCard = ({ group, onEdit, onDelete }: GroupCardProps) => {
  const getGroupColor = (name: string) => {
    // ... (This function remains the same)
    switch (name.toLowerCase()) {
      case "admin":
        return "text-red-400 bg-red-400/10";
      case "member":
        return "text-green-400 bg-green-400/10";
      case "friend":
        return "text-blue-400 bg-blue-400/10";
      case "banned":
        return "text-gray-400 bg-gray-400/10";
      case "guest":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-[#f7a5a5]/70 bg-[#f7a5a5]/10";
    }
  };

  const isSystemGroup = (name: string) => {
    return ["admin", "member", "friend", "banned", "guest"].includes(
      name.toLowerCase()
    );
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
              {group.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getGroupColor(
                group.name
              )}`}
            >
              {isSystemGroup(group.name) ? "System" : "Custom"}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-2 text-sm text-[#f7a5a5]/70">
            {/* ... user and calendar info ... */}
          </div>

          {group.description && (
            <p className="text-xs text-[#f7a5a5]/60 mb-2">
              {group.description}
            </p>
          )}

          <motion.div
            className="flex flex-wrap gap-1"
            variants={tagContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {group.permissions.slice(0, 3).map((permission) => (
              <motion.span
                key={permission}
                className="bg-[#f7a5a5]/10 text-[#f7a5a5]/70 px-2 py-1 rounded text-xs"
                variants={tagItemVariants}
              >
                {permission}
              </motion.span>
            ))}
            {group.permissions.length > 3 && (
              <motion.span
                className="bg-[#f7a5a5]/10 text-[#f7a5a5]/70 px-2 py-1 rounded text-xs"
                variants={tagItemVariants}
              >
                +{group.permissions.length - 3} more
              </motion.span>
            )}
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onEdit(group.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg"
            title="Edit group"
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit2 size={18} />
          </motion.button>
          <motion.button
            onClick={() => onDelete(group.id)}
            className={`p-2 rounded-lg ${
              isSystemGroup(group.name)
                ? "text-[#f7a5a5]/30 cursor-not-allowed"
                : "text-[#f7a5a5]/70 hover:text-red-500 hover:bg-red-500/10"
            }`}
            title={
              isSystemGroup(group.name)
                ? "Cannot delete system group"
                : "Delete group"
            }
            disabled={isSystemGroup(group.name)}
            whileHover={{
              scale: isSystemGroup(group.name) ? 1 : 1.15,
              rotate: isSystemGroup(group.name) ? 0 : 5,
            }}
            whileTap={{ scale: isSystemGroup(group.name) ? 1 : 0.9 }}
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupCard;