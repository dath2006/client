"use client";

import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Tag,
  Calendar,
  User,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/types/post";
import { adminAPI, ApiError } from "@/lib/api";

interface PostCardProps {
  post: Post;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void; // Made optional since we'll handle deletion internally
  onPostDeleted?: (id: string) => void; // Callback after successful deletion
  isDeleting?: boolean;
}

const PostCard = ({
  post,
  onEdit,
  onDelete,
  onPostDeleted,
  isDeleting = false,
}: PostCardProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    // If onDelete callback is provided, use that (for backwards compatibility)
    if (onDelete) {
      onDelete(post.id);
      return;
    }

    // Confirm deletion
    if (
      !window.confirm(
        `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleteLoading(true);
    setDeleteError(null);

    try {
      await adminAPI.deletePost(post.id);

      // Call the callback to notify parent component
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }

      // Optional: Show success message
      console.log(`Post "${post.title}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting post:", error);

      let errorMessage = "Failed to delete post. Please try again.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }

      setDeleteError(errorMessage);

      // Optional: You could show a toast notification here
      alert(errorMessage);
    } finally {
      setIsDeleteLoading(false);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-success bg-success/10";
      case "draft":
        return "text-warning bg-warning/10";
      case "private":
        return "text-error bg-error/10";
      case "scheduled":
        return "text-primary bg-primary/10";
      default:
        return "text-muted bg-muted/10";
    }
  };

  return (
    <div className="bg-card border border-default rounded-lg p-6 hover:shadow-lg transition-all duration-300">
      {deleteError && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg">
          {deleteError}
        </div>
      )}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Title and Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <h3 className="text-lg font-semibold text-text-primary hover:text-primary transition-colors duration-300 cursor-pointer truncate flex-1">
              {post.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                post.status
              )}`}
            >
              {post.status}
            </span>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{post.category}</span>
            </div>
          </div>

          {/* Tags */}
          {post?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-surface-elevated text-text-tertiary text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-surface-elevated text-text-tertiary text-xs rounded-md">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats and Controls */}
        <div className="flex items-center justify-between lg:justify-end gap-6">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{(post.viewCount || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>{post.webmentions || 0}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(post.id)}
              className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
              title="Edit post"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || isDeleteLoading}
              className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete post"
            >
              {isDeleting || isDeleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
