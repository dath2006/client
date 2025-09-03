import React, { useState, useEffect, useCallback, useRef } from "react";
import { Post } from "@/types/post";
import { fetchPosts } from "@/lib/mockData";
import PostCard from "./PostCard";
import FeedSkeleton from "../common/FeedSkeleton";
import { RefreshCw, AlertCircle } from "lucide-react";

const POSTS_PER_PAGE = 6;

interface FeedState {
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const FallbackFeed: React.FC = () => {
  const [state, setState] = useState<FeedState>({
    posts: [],
    loading: true,
    loadingMore: false,
    error: null,
    hasMore: true,
    page: 1,
  });

  const observerTarget = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Load initial posts
  const loadInitialPosts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { posts, hasMore } = await fetchPosts(1, POSTS_PER_PAGE);
      setState((prev) => ({
        ...prev,
        posts,
        hasMore,
        page: 2,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load posts. Using mock data.",
      }));
    }
  }, []);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (state.loadingMore || !state.hasMore) return;

    setState((prev) => ({ ...prev, loadingMore: true, error: null }));

    try {
      const { posts: newPosts, hasMore } = await fetchPosts(
        state.page,
        POSTS_PER_PAGE
      );

      setState((prev) => ({
        ...prev,
        posts: [...prev.posts, ...newPosts],
        hasMore,
        page: prev.page + 1,
        loadingMore: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loadingMore: false,
        error: "Failed to load more posts.",
      }));
    }
  }, [state.page, state.loadingMore, state.hasMore]);

  // Refresh feed
  const refreshFeed = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      posts: [],
      page: 1,
      hasMore: true,
      error: null,
    }));
    await loadInitialPosts();
  }, [loadInitialPosts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          state.hasMore &&
          !state.loading &&
          !state.loadingMore
        ) {
          loadMorePosts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, state.hasMore, state.loading, state.loadingMore]);

  // Load initial posts on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadInitialPosts();
    }
  }, [loadInitialPosts]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Mock Data Warning */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-warning" />
          <span className="text-warning font-medium">
            Using mock data - Backend API not connected
          </span>
        </div>
      </div>

      {/* Feed Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Feed (Demo)</h1>
          <p className="text-text-secondary mt-1">
            Explore demo posts with different content types
          </p>
        </div>
        <button
          onClick={refreshFeed}
          disabled={state.loading}
          className="btn-outline inline-flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${state.loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Content */}
      {state.loading && state.posts.length === 0 ? (
        <FeedSkeleton />
      ) : (
        <>
          <div className="grid gap-6 mb-8">
            {state.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Loading more indicator */}
          {state.loadingMore && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-3 text-text-secondary">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                <span>Loading more posts...</span>
              </div>
            </div>
          )}

          {/* No more posts message */}
          {!state.hasMore && state.posts.length > 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-4">
                <div className="w-6 h-6 bg-success rounded-full"></div>
              </div>
              <p className="text-text-secondary font-medium">
                You've reached the end of the demo posts!
              </p>
            </div>
          )}

          <div ref={observerTarget} className="h-4" />
        </>
      )}
    </div>
  );
};

export default FallbackFeed;
