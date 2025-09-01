"use client";

import React from "react";
import { Calendar, User, Eye } from "lucide-react";
import { Post } from "@/types/post";

interface PostHeaderProps {
  post: Post;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <header className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-text-primary">{post.author.name}</p>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>Author</span>
            </div>
          </div>
        </div>

        {/* Publication Date */}
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{formatDate(post.createdAt)}</span>
        </div>

        {/* View Count */}
        <div className="flex items-center gap-2">
          <Eye size={16} />
          <span>{formatNumber(post.viewCount)} views</span>
        </div>

        {/* Post Type Badge */}
        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium capitalize">
          {post.type}
        </span>

        {/* Category */}
        <span className="bg-surface text-text-secondary px-2 py-1 rounded-full text-xs">
          {post.category}
        </span>
      </div>
    </header>
  );
};

export default PostHeader;
