"use client";

import React, { useState, useRef, useCallback } from "react";
import { Post } from "@/types/post";
import { useFeed, useInfiniteScroll } from "@/hooks/useFeed";
import { FeedParams } from "@/lib/api";
import PostCard from "./PostCard";
import FeedSkeleton from "../common/FeedSkeleton";
import FallbackFeed from "./FallbackFeed";
import {
  RefreshCw,
  AlertCircle,
  Wifi,
  Search,
  Filter,
  X,
  Server,
} from "lucide-react";

interface FilterState {
  type: string;
  category: string;
  search: string;
}

const InfiniteScrollFeed: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    category: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [useFallback, setUseFallback] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    search,
    filter,
    clearError,
  } = useFeed({
    initialParams: { limit: 10 },
    autoLoad: true,
  });

  const { isFetching } = useInfiniteScroll(loadMore, hasMore, loading);

  // Handle search with debouncing
  const handleSearch = useCallback(
    (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        search(query);
        setFilters((prev) => ({ ...prev, search: query }));
      }, 500);
    },
    [search]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    async (filterParams: Partial<FeedParams>) => {
      await filter(filterParams);
    },
    [filter]
  );

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    clearError();
    await refresh();
  }, [refresh, clearError]);

  // Clear all filters
  const clearAllFilters = useCallback(async () => {
    setFilters({ type: "", category: "", search: "" });
    setSearchInput("");
    await filter({});
  }, [filter]);

  // Check if error suggests API connection issues
  const isConnectionError =
    error &&
    (error.includes("Failed to fetch") ||
      error.includes("Network Error") ||
      error.includes("ECONNREFUSED") ||
      error.includes("net::ERR_CONNECTION_REFUSED") ||
      posts.length === 0);

  // Show fallback if there's a connection error
  if (useFallback || isConnectionError) {
    return (
      <div>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-warning" />
                <div>
                  <span className="text-warning font-medium block">
                    Backend API not available
                  </span>
                  <span className="text-warning/80 text-sm">
                    Showing demo content with mock data
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setUseFallback(false);
                  handleRefresh();
                }}
                className="text-warning hover:text-warning/80 text-sm underline"
              >
                Try reconnecting
              </button>
            </div>
          </div>
        </div>
        <FallbackFeed />
      </div>
    );
  }

  // Error state (non-connection errors)
  if (error && posts.length === 0 && !isConnectionError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card border border-error/20 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
              {navigator.onLine ? (
                <AlertCircle className="w-8 h-8 text-error" />
              ) : (
                <Wifi className="w-8 h-8 text-error" />
              )}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {navigator.onLine
              ? "Something went wrong"
              : "No internet connection"}
          </h3>
          <p className="text-text-secondary mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRefresh}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => setUseFallback(true)}
              className="btn-outline inline-flex items-center gap-2"
            >
              <Server className="w-4 h-4" />
              Use Demo Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header with Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-text-primary">Feed</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-surface hover:bg-surface-elevated transition-colors"
              title="Toggle filters"
            >
              <Filter className="w-5 h-5 text-text-secondary" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-surface hover:bg-surface-elevated transition-colors"
              title="Refresh feed"
              disabled={loading}
            >
              <RefreshCw
                className={`w-5 h-5 text-text-secondary ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-tertiary" />
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              handleSearch(e.target.value);
            }}
            className="block w-full pl-10 pr-4 py-3 border border-default rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:border-primary text-text-primary placeholder-text-tertiary"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                handleSearch("");
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-text-tertiary hover:text-text-secondary" />
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-surface border border-default rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-text-primary">Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-primary/80"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Post Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFilters((prev) => ({ ...prev, type: newType }));
                    handleFilterChange({ type: newType || undefined });
                  }}
                  className="w-full px-3 py-2 border border-default rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Types</option>
                  <option value="text">Text</option>
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="quote">Quote</option>
                  <option value="link">Link</option>
                  <option value="file">File</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setFilters((prev) => ({ ...prev, category: newCategory }));
                    handleFilterChange({
                      category: newCategory ? parseInt(newCategory) : undefined,
                    });
                  }}
                  className="w-full px-3 py-2 border border-default rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Categories</option>
                  <option value="1">Technology</option>
                  <option value="2">Design</option>
                  <option value="3">Photography</option>
                  <option value="4">Music</option>
                  <option value="5">Travel</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(filters.search || filters.type || filters.category) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Search: "{filters.search}"
                <button
                  onClick={() => {
                    setSearchInput("");
                    handleSearch("");
                  }}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                Type: {filters.type}
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, type: "" }));
                    handleFilterChange({ type: undefined });
                  }}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                Category: {filters.category}
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: "" }));
                    handleFilterChange({ category: undefined });
                  }}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && posts.length > 0 && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-error" />
              <span className="text-error font-medium">
                Failed to load more posts
              </span>
            </div>
            <button
              onClick={clearError}
              className="text-error hover:text-error/80"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {loading && posts?.length === 0 ? (
        <FeedSkeleton />
      ) : posts?.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No posts found
          </h3>
          <p className="text-text-secondary mb-6">
            {filters.search || filters.type || filters.category
              ? "Try adjusting your filters or search terms"
              : "Be the first to create a post!"}
          </p>
          {(filters.search || filters.type || filters.category) && (
            <button onClick={clearAllFilters} className="btn-outline">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Loading more indicator */}
          {(loading || isFetching) && posts.length > 0 && (
            <div className="mt-8">
              <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-lg border border-default p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-surface rounded-full"></div>
                      <div className="space-y-2">
                        <div className="w-24 h-4 bg-surface rounded"></div>
                        <div className="w-16 h-3 bg-surface rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-3/4 h-4 bg-surface rounded"></div>
                      <div className="w-full h-4 bg-surface rounded"></div>
                      <div className="w-1/2 h-4 bg-surface rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* End of results */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-success rounded-full"></div>
              </div>
              <p className="text-text-secondary">
                You've reached the end of the feed
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InfiniteScrollFeed;
