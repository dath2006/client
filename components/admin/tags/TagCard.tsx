"use client";

import React from "react";
import { Edit2, Trash2, Hash, FileText, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TagCardProps {
  tag: {
    id: string;
    name: string;
    createdAt: Date;
    postCount: number;
    posts: Array<{
      id: string;
      title: string;
      createdAt: Date;
    }>;
    color?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

const TagCard = ({ tag, onEdit, onDelete, onView }: TagCardProps) => {
  const getTagColor = (name: string) => {
    // Generate a consistent color based on tag name
    const colors = [
      "bg-blue-400/10 text-blue-400",
      "bg-green-400/10 text-green-400",
      "bg-purple-400/10 text-purple-400",
      "bg-pink-400/10 text-pink-400",
      "bg-yellow-400/10 text-yellow-400",
      "bg-indigo-400/10 text-indigo-400",
      "bg-red-400/10 text-red-400",
    ];
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const truncateTitle = (title: string, maxLength: number = 40) => {
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
  };

  return (
    <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4 hover:border-[#f7a5a5]/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Hash size={18} className="text-[#f7a5a5]/70" />
              <h3
                className="text-lg font-medium text-[#f7a5a5] hover:text-[#ffdbb6] transition-colors duration-300 cursor-pointer"
                onClick={() => onView && onView(tag.id)}
              >
                {tag.name}
              </h3>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(
                tag.name
              )}`}
            >
              {tag.postCount} {tag.postCount === 1 ? "post" : "posts"}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-3 text-sm text-[#f7a5a5]/70">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                Created{" "}
                {formatDistanceToNow(tag.createdAt, { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FileText size={14} />
              <span>{tag.postCount} posts tagged</span>
            </div>
          </div>

          {tag.posts.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-[#f7a5a5]/70 mb-2">
                Recent Posts:
              </p>
              <div className="space-y-1">
                {tag.posts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between bg-[#f7a5a5]/5 rounded px-2 py-1"
                  >
                    <span className="text-xs text-[#f7a5a5]/80">
                      {truncateTitle(post.title)}
                    </span>
                    <span className="text-xs text-[#f7a5a5]/60">
                      {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                ))}
                {tag.posts.length > 3 && (
                  <div className="text-xs text-[#f7a5a5]/60 px-2">
                    +{tag.posts.length - 3} more posts
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(tag.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
            title="Edit tag"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(tag.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300"
            title="Delete tag"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagCard;
