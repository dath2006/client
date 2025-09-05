import { useState, useEffect, useCallback } from "react";
import {
  adminSpamAPI,
  type AdminSpamParams,
  type AdminSpamResponse,
  type SpamItem,
  type BatchSpamActionData,
  ApiError,
} from "@/lib/api";
import type { PostWithComments } from "@/lib/api";

// Backend might return comments structure instead of spam structure
interface BackendSpamResponse {
  data: PostWithComments[] | SpamItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  stats: {
    total: number;
    spam: number;
    approved: number;
    rejected: number;
  };
}

export interface UseSpamOptions {
  initialParams?: AdminSpamParams;
  autoFetch?: boolean;
}

export interface UseSpamReturn {
  // Data
  spamItems: SpamItem[];
  stats: AdminSpamResponse["stats"] | null;
  pagination: AdminSpamResponse["pagination"] | null;

  // State
  loading: boolean;
  error: string | null;

  // Actions
  fetchSpamItems: (params?: AdminSpamParams) => Promise<void>;
  updateSpamStatus: (
    spamId: string,
    status: SpamItem["status"]
  ) => Promise<void>;
  deleteSpamItem: (spamId: string) => Promise<void>;
  batchAction: (
    action: BatchSpamActionData["action"],
    spamIds: string[]
  ) => Promise<void>;
  markCommentAsSpam: (commentId: string) => Promise<void>;
  refreshStats: () => Promise<void>;

  // Utilities
  clearError: () => void;
  retry: () => Promise<void>;
}

// Helper function to transform comments data to spam items
const transformCommentsToSpamItems = (postsWithComments: any[]): SpamItem[] => {
  const spamItems: SpamItem[] = [];

  postsWithComments.forEach((postData: any) => {
    postData.comments.forEach((comment: any) => {
      spamItems.push({
        id: comment.id.toString(),
        type: "comment" as const,
        author: {
          name: comment.author,
          email: comment.email,
          website: comment.url || undefined,
          ipAddress: comment.ip,
        },
        content: comment.body,
        detectedAt: comment.created_at,
        updatedAt: comment.updated_at,
        source: {
          post: {
            id: postData.post.id.toString(),
            title: postData.post.title,
            slug: postData.post.url, // Backend uses 'url' field for the post slug
          },
        },
        status:
          comment.status === "spam"
            ? "spam"
            : comment.status === "approved"
            ? "approved"
            : "rejected",
      });
    });
  });

  return spamItems;
};

// Helper function to check if data is comments structure
const isCommentsData = (data: any[]): boolean => {
  return data.length > 0 && data[0].post && data[0].comments;
};

export const useSpam = (options: UseSpamOptions = {}): UseSpamReturn => {
  const { initialParams = {}, autoFetch = true } = options;

  // State
  const [spamItems, setSpamItems] = useState<SpamItem[]>([]);
  const [stats, setStats] = useState<AdminSpamResponse["stats"] | null>(null);
  const [pagination, setPagination] = useState<
    AdminSpamResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<AdminSpamParams>(initialParams);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch spam items
  const fetchSpamItems = useCallback(async (params: AdminSpamParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const mergedParams = { ...params };
      setLastParams(mergedParams);

      const response = await adminSpamAPI.getSpamItems(mergedParams);

      // Handle case where backend returns comments structure instead of spam structure
      let spamData: SpamItem[];
      if (isCommentsData(response.data)) {
        // Transform comments data to spam items
        spamData = transformCommentsToSpamItems(response.data as any[]);
      } else {
        // Data is already in spam format
        spamData = response.data as SpamItem[];
      }

      setSpamItems(spamData);
      setStats(response.stats);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to fetch spam items";
      setError(errorMessage);
      console.error("Error fetching spam items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update spam status
  const updateSpamStatus = useCallback(
    async (spamId: string, status: SpamItem["status"]) => {
      try {
        setError(null);

        await adminSpamAPI.updateSpamStatus(spamId, { status });

        // Update local state
        setSpamItems((prev) =>
          prev.map((item) => (item.id === spamId ? { ...item, status } : item))
        );

        // Refresh stats
        await refreshStats();
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : "Failed to update spam status";
        setError(errorMessage);
        console.error("Error updating spam status:", err);
        throw err;
      }
    },
    []
  );

  // Delete spam item
  const deleteSpamItem = useCallback(async (spamId: string) => {
    try {
      setError(null);

      await adminSpamAPI.deleteSpamItem(spamId);

      // Update local state
      setSpamItems((prev) => prev.filter((item) => item.id !== spamId));

      // Refresh stats
      await refreshStats();
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to delete spam item";
      setError(errorMessage);
      console.error("Error deleting spam item:", err);
      throw err;
    }
  }, []);

  // Batch action
  const batchAction = useCallback(
    async (action: BatchSpamActionData["action"], spamIds: string[]) => {
      try {
        setError(null);

        const response = await adminSpamAPI.batchAction({
          spamIds,
          action,
        });

        if (response.errors && response.errors.length > 0) {
          console.warn("Some batch actions failed:", response.errors);
        }

        // Refresh data after batch action
        await fetchSpamItems(lastParams);
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
    [fetchSpamItems, lastParams]
  );

  // Mark comment as spam
  const markCommentAsSpam = useCallback(async (commentId: string) => {
    try {
      setError(null);

      const newSpamItem = await adminSpamAPI.markCommentAsSpam(commentId);

      // Add to local state
      setSpamItems((prev) => [newSpamItem, ...prev]);

      // Refresh stats
      await refreshStats();
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Failed to mark comment as spam";
      setError(errorMessage);
      console.error("Error marking comment as spam:", err);
      throw err;
    }
  }, []);

  // Refresh stats
  const refreshStats = useCallback(async () => {
    try {
      const newStats = await adminSpamAPI.getStats();
      setStats(newStats);
    } catch (err) {
      console.error("Error refreshing stats:", err);
    }
  }, []);

  // Retry last operation
  const retry = useCallback(async () => {
    await fetchSpamItems(lastParams);
  }, [fetchSpamItems, lastParams]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchSpamItems(initialParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  return {
    // Data
    spamItems,
    stats,
    pagination,

    // State
    loading,
    error,

    // Actions
    fetchSpamItems,
    updateSpamStatus,
    deleteSpamItem,
    batchAction,
    markCommentAsSpam,
    refreshStats,

    // Utilities
    clearError,
    retry,
  };
};
