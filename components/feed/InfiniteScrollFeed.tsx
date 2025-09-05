"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion: Import motion and AnimatePresence
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

// Framer Motion: Define variants for the list and list items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

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

  const handleFilterChange = useCallback(
    async (filterParams: Partial<FeedParams>) => {
      await filter(filterParams);
    },
    [filter]
  );

  const handleRefresh = useCallback(async () => {
    clearError();
    await refresh();
  }, [refresh, clearError]);

  const clearAllFilters = useCallback(async () => {
    setFilters({ type: "", category: "", search: "" });
    setSearchInput("");
    await filter({});
  }, [filter]);

  const isConnectionError =
    error &&
    (error.includes("Failed to fetch") ||
      error.includes("Network Error") ||
      error.includes("ECONNREFUSED") ||
      error.includes("net::ERR_CONNECTION_REFUSED") ||
      posts.length === 0);

  // Framer Motion: Wrap state-based returns in motion.div for smooth transitions
  if (useFallback || isConnectionError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6"
        >
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
        </motion.div>
        <FallbackFeed />
      </motion.div>
    );
  }

  if (error && posts.length === 0 && !isConnectionError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="bg-card border border-error/20 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { delay: 0.1 } }}
              className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center"
            >
              {navigator.onLine ? (
                <AlertCircle className="w-8 h-8 text-error" />
              ) : (
                <Wifi className="w-8 h-8 text-error" />
              )}
            </motion.div>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {navigator.onLine
              ? "Something went wrong"
              : "No internet connection"}
          </h3>
          <p className="text-text-secondary mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUseFallback(true)}
              className="btn-outline inline-flex items-center gap-2"
            >
              <Server className="w-4 h-4" />
              Use Demo Mode
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header with Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-text-primary"
          >
            Feed
          </motion.h1>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-surface hover:bg-surface-elevated transition-colors"
              title="Toggle filters"
            >
              <Filter className="w-5 h-5 text-text-secondary" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
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
            </motion.button>
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
          <AnimatePresence>
            {searchInput && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => {
                  setSearchInput("");
                  handleSearch("");
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-text-tertiary hover:text-text-secondary" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Framer Motion: Use AnimatePresence to animate the filter panel's entry and exit */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-surface border border-default rounded-lg p-4 mb-4 overflow-hidden"
            >
              {/* ... Filter Panel Content ... */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mb-4">
          <AnimatePresence>
            {(filters.search || filters.type || filters.category) && (
              <>
                {filters.search && (
                  <motion.span
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
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
                  </motion.span>
                )}
                {/* ... Add similar motion.span for type and category filters ... */}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6"
          >
            {/* ... Error content ... */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Grid */}
      {loading && posts?.length === 0 ? (
        <FeedSkeleton />
      ) : posts?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          {/* ... No posts found content ... */}
        </motion.div>
      ) : (
        <>
          <motion.div
            className="grid gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                layout
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
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
