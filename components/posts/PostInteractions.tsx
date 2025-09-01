"use client";

import React from "react";
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { Post } from "@/types/post";

interface PostInteractionsProps {
  post: Post;
  userLiked: boolean;
  userSaved: boolean;
  onLike: () => void;
  onShare: () => void;
  onSave: () => void;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  post,
  userLiked,
  userSaved,
  onLike,
  onShare,
  onSave,
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="flex items-center justify-between py-6 border-t border-b border-border">
      {/* Left side - Like and Comments */}
      <div className="flex items-center gap-6">
        {/* Like Button */}
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            userLiked
              ? "bg-red-50 text-red-500 border border-red-200"
              : "bg-surface hover:bg-surface-elevated text-text-secondary hover:text-red-500"
          }`}
        >
          <Heart size={20} className={userLiked ? "fill-current" : ""} />
          <span className="font-medium">{formatNumber(post.likes)}</span>
        </button>

        {/* Comments */}
        <div className="flex items-center gap-2 px-4 py-2 text-text-secondary">
          <MessageSquare size={20} />
          <span className="font-medium">
            {formatNumber(post.comments.length)}
          </span>
          <span className="hidden sm:inline">Comments</span>
        </div>
      </div>

      {/* Right side - Share and Save */}
      <div className="flex items-center gap-3">
        {/* Share Button */}
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-elevated text-text-secondary hover:text-primary rounded-lg transition-colors"
        >
          <Share2 size={20} />
          <span className="hidden sm:inline font-medium">Share</span>
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            userSaved
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-surface hover:bg-surface-elevated text-text-secondary hover:text-primary"
          }`}
        >
          <Bookmark size={20} className={userSaved ? "fill-current" : ""} />
          <span className="hidden sm:inline font-medium">
            {userSaved ? "Saved" : "Save"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PostInteractions;
