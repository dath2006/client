"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    author: {
      name: string;
      avatar?: string;
    };
    createdAt: Date;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PostCard = ({ post, onEdit, onDelete }: PostCardProps) => {
  return (
    <div
      className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4
    hover:border-[#f7a5a5]/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3
            className="text-lg font-medium text-[#f7a5a5] hover:text-[#ffdbb6] 
          transition-colors duration-300 cursor-pointer"
          >
            {post.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-sm text-[#f7a5a5]/70">
            <span>{post.author.name}</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(post.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] 
            hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-red-500
            hover:bg-red-500/10 rounded-lg transition-all duration-300"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
