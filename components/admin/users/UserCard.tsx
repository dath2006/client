"use client";

import React from "react";
import { Edit2, Trash2, Eye, Mail, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    lastLogin: Date | null;
    createdAt: Date;
    role: "admin" | "editor" | "contributor" | "member";
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

const UserCard = ({ user, onEdit, onDelete, onViewData }: UserCardProps) => {
  const getRoleColor = (role: string) => {
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
    <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4 hover:border-[#f7a5a5]/50 transition-all duration-300">
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
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Last login: {formatLastLogin(user.lastLogin)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                Joined{" "}
                {formatDistanceToNow(user.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#f7a5a5]/60">
            <span className="bg-[#f7a5a5]/10 px-2 py-1 rounded">
              {user.stats.posts} posts
            </span>
            <span className="bg-[#f7a5a5]/10 px-2 py-1 rounded">
              {user.stats.comments} comments
            </span>
            <span className="bg-[#f7a5a5]/10 px-2 py-1 rounded">
              {user.stats.likedPosts} likes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewData(user.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
            title="View user data"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(user.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
            title="Edit user"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300"
            title="Delete user"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
