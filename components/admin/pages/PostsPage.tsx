"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  Variants,
  useSpring,
  useTransform,
} from "framer-motion";

// --- UI Components (Assumed to be in these paths) ---
import PostCard from "@/components/admin/posts/PostCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import PostModal, { PostFormData } from "@/components/admin/posts/PostModalNew";
import AdminPostsSkeletonList from "@/components/admin/posts/AdminPostSkeleton";
import Pagination from "@/components/admin/common/Pagination";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import PostsErrorFallback from "@/components/admin/posts/PostsErrorFallback";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// --- Hooks & API ---
import { useRequireAdmin } from "@/hooks/useAdminAccess";
import {
  adminAPI,
  isApiError,
  AdminPostParams,
  CreatePostData,
  UpdatePostData,
} from "@/lib/api";
import { Post, PostStatus } from "@/types/post";

// --- Animation Variants (kept within the file) ---
const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

/**
 * A small, self-contained component for animating numbers.
 */
const AnimatedCounter = ({ to }: { to: number }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(to);
  }, [spring, to]);

  return <motion.span>{display}</motion.span>;
};

const PostsPageContent = () => {
  // --- State ---
  const { isAdmin, isLoading: isCheckingAuth, hasAccess } = useRequireAdmin();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [pageSize] = useState(10);

  // UI Interaction State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Loading & Feedback State
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // --- Data Fetching & Effects ---
  const loadPosts = useCallback(async () => {
    if (!isSearching) setIsLoading(true);
    setFeedback(null);
    try {
      const params: AdminPostParams = {
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
      };
      const response = await adminAPI.getPosts(params);
      setPosts(response.data);
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "An unknown error occurred.";
      setFeedback({ type: "error", message });
      setPosts([]); // Clear posts on error
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [currentPage, pageSize, searchQuery, isSearching]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Auto-clear feedback message after a delay
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // --- Event Handlers ---
  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNew = () => {
    setSelectedPost(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const postToEdit = posts.find((p) => p.id === id);
    if (postToEdit) {
      setSelectedPost(postToEdit);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await adminAPI.deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      setTotalCount((prev) => prev - 1);
      setFeedback({ type: "success", message: "Post deleted successfully." });
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Failed to delete post.";
      setFeedback({ type: "error", message });
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePostSave = async (postData: PostFormData) => {
    setIsSaving(true);
    setFeedback(null);
  };

  // --- Render Logic ---
  if (isCheckingAuth) {
    return <AdminPostsSkeletonList count={pageSize} />;
  }
  if (!hasAccess) {
    return <div className="text-center p-8">Access Denied.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader
          title="Posts"
          onSearch={handleSearch}
          onNew={handleNew}
          isLoading={isSearching}
        />
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto", marginTop: "1rem" }}
              exit={{ opacity: 0, y: -10, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            ></motion.div>
          )}
        </AnimatePresence>

        {!isLoading && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mt-4"
          >
            Total Posts:{" "}
            <strong className="text-foreground">
              <AnimatedCounter to={totalCount} />
            </strong>
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pt-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loader" exit={{ opacity: 0 }}>
              <AdminPostsSkeletonList count={pageSize} />
            </motion.div>
          ) : posts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            ></motion.div>
          ) : (
            <motion.div
              key="list"
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
            >
              <AnimatePresence>
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={listItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    exit="exit"
                    layout
                  >
                    <PostCard
                      post={post}
                      onEdit={() => handleEdit(post.id)}
                      onDelete={() => handleDelete(post.id)}
                      isDeleting={isDeleting === post.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && totalPages > 1 && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal-backdrop"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={handleModalClose}
          >
            <motion.div
              key="modal-content"
              variants={modalContentVariants}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
              <ErrorBoundary fallback={<div>Modal Error</div>}>
                <PostModal
                  isOpen={isModalOpen}
                  onClose={handleModalClose}
                  onSave={handlePostSave}
                  post={selectedPost}
                  mode={modalMode}
                  isLoading={isSaving}
                />
              </ErrorBoundary>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main export component for Error Boundary remains the same
const PostsPage = () => (
  <ErrorBoundary
    fallback={
      <PostsErrorFallback
        onRetry={() => window.location.reload()}
        onNew={() => {}}
      />
    }
  >
    <PostsPageContent />
  </ErrorBoundary>
);

export default PostsPage;
