import { useState, useEffect, useCallback, useRef } from "react";
import { Post } from "@/types/post";
import { feedAPI, FeedParams, ApiError, isApiError } from "@/lib/api";

interface UseFeedOptions {
  initialParams?: FeedParams;
  autoLoad?: boolean;
}

interface UseFeedReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (query: string) => Promise<void>;
  filter: (params: Partial<FeedParams>) => Promise<void>;
  clearError: () => void;
}

export const useFeed = ({
  initialParams = {},
  autoLoad = true,
}: UseFeedOptions = {}): UseFeedReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<FeedParams>(initialParams);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadPosts = useCallback(
    async (params: FeedParams = {}, isLoadMore = false): Promise<void> => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const requestParams = {
          ...params,
          cursor: isLoadMore ? nextCursor || undefined : undefined,
          limit: params.limit || 10,
        };

        const response = await feedAPI.getPosts(requestParams);

        if (isLoadMore) {
          setPosts((prev) => [...prev, ...response.posts]);
        } else {
          setPosts(response.posts);
        }

        setHasMore(response.has_more);
        setNextCursor(response.next_cursor);
      } catch (err: any) {
        // Don't set error if request was aborted
        if (err.name === "AbortError" || err.name === "CanceledError") {
          return;
        }

        let errorMessage = "Failed to load posts";
        if (isApiError(err)) {
          errorMessage = err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        console.error("Feed loading error:", err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        abortControllerRef.current = null;
      }
    },
    [nextCursor]
  );

  const loadMore = useCallback(async (): Promise<void> => {
    if (loading || !hasMore) return;
    await loadPosts(currentParams, true);
  }, [currentParams, hasMore, loading, loadPosts]);

  const refresh = useCallback(async (): Promise<void> => {
    setNextCursor(null);
    setHasMore(true);
    await loadPosts(currentParams, false);
  }, [currentParams, loadPosts]);

  const search = useCallback(
    async (query: string): Promise<void> => {
      const newParams = { ...currentParams, search: query };
      setCurrentParams(newParams);
      setNextCursor(null);
      setHasMore(true);
      await loadPosts(newParams, false);
    },
    [currentParams, loadPosts]
  );

  const filter = useCallback(
    async (filterParams: Partial<FeedParams>): Promise<void> => {
      const newParams = { ...currentParams, ...filterParams };
      setCurrentParams(newParams);
      setNextCursor(null);
      setHasMore(true);
      await loadPosts(newParams, false);
    },
    [currentParams, loadPosts]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    if (autoLoad) {
      loadPosts(currentParams, false);
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Only run once on mount

  return {
    posts,
    loading: loading || initialLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    search,
    filter,
    clearError,
  };
};

// Hook for infinite scroll functionality
export const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  loading: boolean,
  threshold = 100
) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (
        scrollHeight - scrollTop <= clientHeight + threshold &&
        hasMore &&
        !loading &&
        !isFetching
      ) {
        setIsFetching(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, isFetching, threshold]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchData = async () => {
      await callback();
      setIsFetching(false);
    };

    fetchData();
  }, [isFetching, callback]);

  return { isFetching };
};
