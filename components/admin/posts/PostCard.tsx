"use client";

import React, { useState } from "react";
// Import motion from framer-motion for animations
import { motion, AnimatePresence } from "framer-motion";
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
  onDelete?: (id: string) => void;
  onPostDeleted?: (id: string) => void;
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
    if (onDelete) {
      onDelete(post.id);
      return;
    }

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
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
      console.log(`Post "${post.title}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting post:", error);
      let errorMessage = "Failed to delete post. Please try again.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      setDeleteError(errorMessage);
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

  // CORRECTED: Animation variants for the card container
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    // The transition property is now a sibling to the variants,
    // which resolves the TypeScript error.
    transition: { duration: 0.4, ease: "easeOut" },
  };

  // Animation variants for the buttons
  const buttonVariants = {
    hover: { scale: 1.1, rotate: 3 },
    tap: { scale: 0.9 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      whileHover={{ y: -5, boxShadow: "0px 10px 30px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-card border border-default rounded-lg p-6 transition-shadow duration-300"
    >
      <AnimatePresence>
        {deleteError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg overflow-hidden"
          >
            {deleteError}
          </motion.div>
        )}
      </AnimatePresence>
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
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              <span>{post.category}</span>
            </div>
          </div>

          {/* Tags */}
          {post?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={index}
                  whileHover={{ y: -2 }}
                  className="px-2 py-1 bg-surface-elevated text-text-tertiary text-xs rounded-md cursor-default"
                >
                  #{tag}
                </motion.span>
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
        <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <motion.div
              whileHover={{ color: "var(--color-primary)" }}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>{(post.viewCount || 0).toLocaleString()}</span>
            </motion.div>
            <motion.div
              whileHover={{ color: "var(--color-error)" }}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="h-4 w-4" />
              <span>{post.likes || 0}</span>
            </motion.div>
            <motion.div
              whileHover={{ color: "var(--color-info)" }}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments?.length || 0}</span>
            </motion.div>
            <motion.div
              whileHover={{ color: "var(--color-success)" }}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>{post.webmentions || 0}</span>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => onEdit(post.id)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
              title="Edit post"
            >
              <Edit2 className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={handleDelete}
              disabled={isDeleting || isDeleteLoading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete post"
            >
              {isDeleting || isDeleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
