"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import CommentCard from "@/components/admin/comments/CommentCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import CommentBatchActions from "@/components/admin/comments/CommentBatchActions";
import { useComments } from "@/hooks/useComments";
import type { PostWithComments, Comment as AdminComment } from "@/lib/api";

// --- Type Definitions for Clarity and Safety ---
type CommentStatus = "pending" | "approved" | "spam" | "rejected";
type BatchAction = "approve" | "reject" | "spam" | "delete";

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const CommentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CommentStatus>(
    "all"
  );
  const [selectedComments, setSelectedComments] = useState<string[]>([]);

  const {
    postsWithComments,
    stats,
    pagination,
    loading,
    error,
    fetchComments,
    updateCommentStatus,
    deleteComment,
    batchAction,
    clearError,
    retry,
  } = useComments({ autoFetch: false });

  useEffect(() => {
    const params = {
      page: 1,
      limit: 20,
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery || undefined,
    };
    fetchComments(params);
  }, [statusFilter, searchQuery, fetchComments]);

  // --- Handlers ---
  const handleSearch = (query: string) => setSearchQuery(query);
  const handleStatusFilter = (status: string) =>
    setStatusFilter(status as "all" | CommentStatus);

  const handleCommentSelect = (commentId: string, isSelected: boolean) => {
    setSelectedComments((prev) =>
      isSelected ? [...prev, commentId] : prev.filter((id) => id !== commentId)
    );
  };

  // FIX: Use the specific CommentStatus type
  const handleCommentStatusChange = async (
    commentId: string,
    newStatus: CommentStatus
  ) => {
    try {
      await updateCommentStatus(commentId, newStatus);
      setSelectedComments((prev) => prev.filter((id) => id !== commentId));
    } catch (error) {
      console.error("Failed to update comment status:", error);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId);
        setSelectedComments((prev) => prev.filter((id) => id !== commentId));
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  // FIX: Use the specific BatchAction type
  const handleBatchAction = async (action: BatchAction) => {
    if (selectedComments.length === 0) return;

    const actionText: Record<BatchAction, string> = {
      approve: "approve",
      reject: "reject",
      spam: "mark as spam",
      delete: "delete",
    };

    if (
      window.confirm(
        `Are you sure you want to ${actionText[action]} ${selectedComments.length} comment(s)?`
      )
    ) {
      try {
        await batchAction(action, selectedComments);
        setSelectedComments([]);
      } catch (error) {
        console.error("Failed to perform batch action:", error);
      }
    }
  };

  const statusCounts = stats || {
    total: 0,
    pending: 0,
    approved: 0,
    spam: 0,
    rejected: 0,
  };
  const TABS = [
    { key: "all", label: "All", count: statusCounts.total },
    { key: "pending", label: "Pending", count: statusCounts.pending },
    { key: "approved", label: "Approved", count: statusCounts.approved },
    { key: "spam", label: "Spam", count: statusCounts.spam },
    { key: "rejected", label: "Rejected", count: statusCounts.rejected },
  ];

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-6"
      >
        <div className="p-4 border border-red-200 rounded-lg">
          <h3 className="mb-2 text-lg font-medium text-red-800">
            Error Loading Comments
          </h3>
          <p className="mb-4 text-red-600">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={retry}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button
              onClick={clearError}
              className="px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
            >
              Dismiss
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#5d688a] text-[#f7a5a5]">
      {/* ... The rest of the JSX is unchanged ... */}
    </div>
  );
};

export default CommentsPage;
