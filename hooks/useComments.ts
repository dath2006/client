import { useState, useEffect, useCallback } from "react";
import {
  adminCommentsAPI,
  type AdminCommentsParams,
  type AdminCommentsResponse,
  type PostWithComments,
  type BatchCommentActionData,
  ApiError,
} from "@/lib/api";
import { type Comment } from "@/lib/api-legacy/admin-comments";

export interface UseCommentsOptions {
  initialParams?: AdminCommentsParams;
  autoFetch?: boolean;
}

export interface UseCommentsReturn {
  // Data
  postsWithComments: PostWithComments[];
  stats: AdminCommentsResponse["stats"] | null;
  pagination: AdminCommentsResponse["pagination"] | null;

  // State
  loading: boolean;
  error: string | null;

  // Actions
  fetchComments: (params?: AdminCommentsParams) => Promise<void>;
  updateCommentStatus: (
    commentId: string,
    status: Comment["status"]
  ) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  batchAction: (
    action: BatchCommentActionData["action"],
    commentIds: string[]
  ) => Promise<void>;
  refreshStats: () => Promise<void>;

  // Utilities
  clearError: () => void;
  retry: () => Promise<void>;
}

export const useComments = (
  options: UseCommentsOptions = {}
): UseCommentsReturn => {
  const { initialParams = {}, autoFetch = true } = options;

  // State
  const [postsWithComments, setPostsWithComments] = useState<
    PostWithComments[]
  >([]);
  const [stats, setStats] = useState<AdminCommentsResponse["stats"] | null>(
    null
  );
  const [pagination, setPagination] = useState<
    AdminCommentsResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] =
    useState<AdminCommentsParams>(initialParams);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch comments
  const fetchComments = useCallback(
    async (params: AdminCommentsParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedParams = { ...params };
        setLastParams(mergedParams);

        const response = await adminCommentsAPI.getComments(mergedParams);

        setPostsWithComments(response.data);
        setStats(response.stats);
        setPagination(response.pagination);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : "Failed to fetch comments";
        setError(errorMessage);
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update comment status
  const updateCommentStatus = useCallback(
    async (commentId: string, status: Comment["status"]) => {
      try {
        setError(null);

        await adminCommentsAPI.updateCommentStatus(commentId, { status });

        // Update local state
        setPostsWithComments((prev) =>
          prev.map((postData) => ({
            ...postData,
            comments: postData.comments.map((comment) =>
              comment.id === commentId ? { ...comment, status } : comment
            ),
            // Recalculate counts
            pendingCount: postData.comments.filter((c) =>
              c.id === commentId ? status === "pending" : c.status === "pending"
            ).length,
            approvedCount: postData.comments.filter((c) =>
              c.id === commentId
                ? status === "approved"
                : c.status === "approved"
            ).length,
            spamCount: postData.comments.filter((c) =>
              c.id === commentId ? status === "spam" : c.status === "spam"
            ).length,
          }))
        );

        // Refresh stats
        await refreshStats();
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : "Failed to update comment status";
        setError(errorMessage);
        console.error("Error updating comment status:", err);
        throw err;
      }
    },
    []
  );

  // Delete comment
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      setError(null);

      await adminCommentsAPI.deleteComment(commentId);

      // Update local state
      setPostsWithComments((prev) =>
        prev
          .map((postData) => ({
            ...postData,
            comments: postData.comments.filter(
              (comment) => comment.id !== commentId
            ),
            totalComments: postData.comments.filter(
              (comment) => comment.id !== commentId
            ).length,
          }))
          .filter((postData) => postData.comments.length > 0)
      );

      // Refresh stats
      await refreshStats();
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to delete comment";
      setError(errorMessage);
      console.error("Error deleting comment:", err);
      throw err;
    }
  }, []);

  // Batch action
  const batchAction = useCallback(
    async (action: BatchCommentActionData["action"], commentIds: string[]) => {
      try {
        setError(null);

        const response = await adminCommentsAPI.batchAction({
          commentIds,
          action,
        });

        if (response.errors && response.errors.length > 0) {
          console.warn("Some batch actions failed:", response.errors);
        }

        // Refresh data after batch action
        await fetchComments(lastParams);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : "Failed to perform batch action";
        setError(errorMessage);
        console.error("Error performing batch action:", err);
        throw err;
      }
    },
    [fetchComments, lastParams]
  );

  // Refresh stats
  const refreshStats = useCallback(async () => {
    try {
      const newStats = await adminCommentsAPI.getStats();
      setStats(newStats);
    } catch (err) {
      console.error("Error refreshing stats:", err);
    }
  }, []);

  // Retry last operation
  const retry = useCallback(async () => {
    await fetchComments(lastParams);
  }, [fetchComments, lastParams]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchComments(initialParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  return {
    // Data
    postsWithComments,
    stats,
    pagination,

    // State
    loading,
    error,

    // Actions
    fetchComments,
    updateCommentStatus,
    deleteComment,
    batchAction,
    refreshStats,

    // Utilities
    clearError,
    retry,
  };
};
