"use client";

import React, { useState, useEffect } from "react";
import CommentCard from "@/components/admin/comments/CommentCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import CommentBatchActions from "@/components/admin/comments/CommentBatchActions";
import { useComments } from "@/hooks/useComments";
import type { PostWithComments, Comment as AdminComment } from "@/lib/api";

const CommentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "spam" | "rejected"
  >("all");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);

  // Use the real API hook
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
  } = useComments({
    autoFetch: false, // We'll fetch manually with initial params
  });

  // Fetch data on mount and when filters change
  useEffect(() => {
    const params = {
      page: 1,
      limit: 20,
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery || undefined,
    };
    fetchComments(params);
  }, [statusFilter, searchQuery, fetchComments]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(
      status as "all" | "pending" | "approved" | "spam" | "rejected"
    );
  };

  const handleCommentSelect = (commentId: string, isSelected: boolean) => {
    setSelectedComments((prev) =>
      isSelected ? [...prev, commentId] : prev.filter((id) => id !== commentId)
    );
  };

  const handleCommentStatusChange = async (
    commentId: string,
    newStatus: "pending" | "approved" | "spam" | "rejected"
  ) => {
    try {
      await updateCommentStatus(commentId, newStatus);
      // Remove from selection after status change
      setSelectedComments((prev) => prev.filter((id) => id !== commentId));
    } catch (error) {
      console.error("Failed to update comment status:", error);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      try {
        await deleteComment(commentId);
        // Remove from selection after deletion
        setSelectedComments((prev) => prev.filter((id) => id !== commentId));
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  const handleBatchAction = async (
    action: "approve" | "reject" | "spam" | "delete"
  ) => {
    if (selectedComments.length === 0) return;

    const actionText = {
      approve: "approve",
      reject: "reject",
      spam: "mark as spam",
      delete: "delete",
    }[action];

    if (
      window.confirm(
        `Are you sure you want to ${actionText} ${selectedComments.length} comment(s)?`
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

  const getStatusCounts = () => {
    if (!stats) {
      return {
        all: 0,
        pending: 0,
        approved: 0,
        spam: 0,
        rejected: 0,
      };
    }

    return {
      all: stats.total,
      pending: stats.pending,
      approved: stats.approved,
      spam: stats.spam,
      rejected: stats.rejected,
    };
  };

  const statusCounts = getStatusCounts();

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className=" border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Comments
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={retry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#5d688a] text-[#f7a5a5]">
      {/* Header */}
      <SearchHeader title="Comments" onSearch={handleSearch} hideNew={true} />

      {/* Filter Tabs */}
      <div className="border-b border-[#f7a5a5]/20 px-6">
        <div className="flex space-x-8">
          {[
            { key: "all", label: "All", count: statusCounts.all },
            { key: "pending", label: "Pending", count: statusCounts.pending },
            {
              key: "approved",
              label: "Approved",
              count: statusCounts.approved,
            },
            { key: "spam", label: "Spam", count: statusCounts.spam },
            {
              key: "rejected",
              label: "Rejected",
              count: statusCounts.rejected,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleStatusFilter(tab.key)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                statusFilter === tab.key
                  ? "border-[#f7a5a5] text-[#f7a5a5]"
                  : "border-transparent text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:border-[#f7a5a5]/50"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-[#f7a5a5]/20 text-[#f7a5a5] py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Actions */}
      {selectedComments.length > 0 && (
        <CommentBatchActions
          selectedCount={selectedComments.length}
          onBatchAction={handleBatchAction}
          selectedCommentIds={selectedComments}
        />
      )}

      <div className="flex-1 overflow-y-auto pt-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f7a5a5]"></div>
            <span className="ml-2 text-[#f7a5a5]/70">Loading comments...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {postsWithComments.map((postData: any) => (
              <CommentCard
                key={postData.post.id}
                postData={{
                  post: {
                    id: Number(postData.post.id),
                    title: postData.post.title,
                    url: postData.post.url, // Backend uses 'url' field directly
                  },
                  comments: postData.comments.map((comment: any) => ({
                    id: comment.id,
                    body: comment.body,
                    author: comment.author,
                    email: comment.email,
                    url: comment.url || "",
                    ip: comment.ip,
                    status: comment.status,
                    createdAt: comment.created_at,
                    updatedAt: comment.updated_at || comment.created_at,
                  })),
                  commentCount: postData.comments.length, // Calculate from comments array
                }}
                onCommentStatusChange={handleCommentStatusChange}
                onCommentDelete={handleCommentDelete}
                onCommentSelect={handleCommentSelect}
                selectedComments={selectedComments}
              />
            ))}

            {postsWithComments.length === 0 && !loading && (
              <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
                <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                  No comments found
                </h3>
                <p className="text-[#f7a5a5]/70">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search query or filter settings."
                    : "Comments will appear here once visitors start engaging with your posts."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="p-6 border-t border-[#f7a5a5]/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#f7a5a5]/70">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} comments
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  fetchComments({
                    page: pagination.page - 1,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    search: searchQuery || undefined,
                  })
                }
                disabled={pagination.page <= 1}
                className="px-3 py-1 bg-[#f7a5a5]/20 text-[#f7a5a5] rounded hover:bg-[#f7a5a5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-[#f7a5a5]/70">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  fetchComments({
                    page: pagination.page + 1,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    search: searchQuery || undefined,
                  })
                }
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 bg-[#f7a5a5]/20 text-[#f7a5a5] rounded hover:bg-[#f7a5a5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
