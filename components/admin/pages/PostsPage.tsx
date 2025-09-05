"use client";

import React, { useState, useEffect, useCallback } from "react";
import PostCard from "@/components/admin/posts/PostCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import PostModal, { PostFormData } from "@/components/admin/posts/PostModalNew";
import AdminPostsSkeletonList from "@/components/admin/posts/AdminPostSkeleton";
import Pagination from "@/components/admin/common/Pagination";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import PostsErrorFallback from "@/components/admin/posts/PostsErrorFallback";
import { useRequireAdmin } from "@/hooks/useAdminAccess";
import {
  adminAPI,
  isApiError,
  AdminPostParams,
  CreatePostData,
  UpdatePostData,
} from "@/lib/api";
import { Post, PostStatus } from "@/types/post";

const PostsPageContent = () => {
  const { isAdmin, isLoading: isCheckingAuth, hasAccess } = useRequireAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [pageSize] = useState(10);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const loadPosts = useCallback(
    async (params: AdminPostParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await adminAPI.getPosts({
          page: currentPage,
          limit: pageSize,
          search: searchQuery || undefined,
          ...params,
        });

        // Handle the new API response format
        setPosts(response.data || []);
        setTotalCount(response.pagination?.totalPosts || 0);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || 1);
        setHasNextPage(response.pagination?.hasNext || false);
        setHasPrevPage(response.pagination?.hasPrevious || false);
      } catch (err) {
        console.error("Failed to load posts:", err);
        const errorMessage = isApiError(err)
          ? err.message
          : "Failed to load posts";
        setError(errorMessage);

        // If it's a network error, we might want to retry
        if (err instanceof Error && err.message.includes("Network Error")) {
          setError(`${errorMessage}. Click retry to try again.`);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, pageSize, searchQuery]
  );

  // Load posts on component mount and when dependencies change
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleEdit = async (id: string) => {
    try {
      setIsLoading(true);
      const post = await adminAPI.getPost(id);
      setSelectedPost(post);
      setModalMode("edit");
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to load post for editing:", err);
      setError(isApiError(err) ? err.message : "Failed to load post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await adminAPI.deletePost(id);

      // Remove post from local state
      setPosts((prev) => prev.filter((post) => post.id !== id));
      setTotalCount((prev) => prev - 1);

      // If we deleted the last post on this page and we're not on the first page, go back
      if (posts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError(isApiError(err) ? err.message : "Failed to delete post");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      setIsSearching(true);
      loadPosts({ search: query }).finally(() => {
        setIsSearching(false);
      });
    }, 500);

    setSearchTimeout(newTimeout);
  };

  const handleNew = () => {
    setSelectedPost(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const transformPostFormData = (
    postData: PostFormData
  ): CreatePostData | UpdatePostData => {
    const baseData = {
      title: postData.title,
      type: postData.type,
      content: postData.content,
      status: (postData.visibility === "public"
        ? "published"
        : postData.visibility) as PostStatus,
      tags: postData.tags,
      category: postData.category,
      slug: postData.slug,
      isPinned: postData.isPinned,
      allowComments: postData.commentStatus === "open",
      scheduledDate: postData.scheduledDate?.toISOString(),
      visibility: postData.visibility,
      visibilityGroups: postData.visibilityGroups,
      // Additional metadata fields (may need to be added to API interface)
      rightsHolder: postData.rightsHolder,
      license: postData.license,
      isOriginalWork: postData.isOriginalWork,
    };

    if (modalMode === "edit" && selectedPost) {
      return {
        id: selectedPost.id,
        ...baseData,
      } as UpdatePostData;
    }

    return baseData as CreatePostData;
  };

  const handlePostSave = async (postData: PostFormData) => {
    try {
      setIsSaving(true);
      setError(null);

      const transformedData = transformPostFormData(postData);

      if (modalMode === "create") {
        const newPost = await adminAPI.createPost(
          transformedData as CreatePostData
        );
        setPosts((prev) => [newPost, ...prev]);
        setTotalCount((prev) => prev + 1);
      } else if (modalMode === "edit" && selectedPost) {
        const updatedPost = await adminAPI.updatePost(
          transformedData as UpdatePostData
        );
        setPosts((prev) =>
          prev.map((post) => (post.id === selectedPost.id ? updatedPost : post))
        );
      }

      handleModalClose();
    } catch (err) {
      console.error("Failed to save post:", err);
      setError(isApiError(err) ? err.message : "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Clean up search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not admin, useRequireAdmin will handle redirect
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader
          title="Post"
          onSearch={handleSearch}
          onNew={handleNew}
          isLoading={isSearching}
        />

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-error text-sm font-medium mb-1">
                  Error loading posts
                </p>
                <p className="text-error/80 text-sm">{error}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => loadPosts()}
                  className="text-xs text-error hover:text-error/80 underline"
                >
                  Retry
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-xs text-error hover:text-error/80 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {!isLoading && (
          <div className="mt-4 text-sm text-muted-foreground">
            {searchQuery ? (
              <span>
                Found {totalCount} post{totalCount !== 1 ? "s" : ""} matching "
                {searchQuery}"
              </span>
            ) : (
              <span>
                {totalCount} total post{totalCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pt-4">
        {isLoading ? (
          <AdminPostsSkeletonList count={pageSize} />
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground mb-4">
              {searchQuery
                ? "No posts found matching your search."
                : "No posts yet."}
            </div>
            {!searchQuery && (
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create your first post
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={isDeleting === post.id}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && posts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* PostModal */}
      <ErrorBoundary
        fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-2">Modal Error</h3>
              <p className="text-muted-foreground mb-4">
                There was an error with the post editor. Please try again.
              </p>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPost(null);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        }
      >
        <PostModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handlePostSave}
          post={selectedPost}
          mode={modalMode}
          isLoading={isSaving}
        />
      </ErrorBoundary>
    </div>
  );
};

const PostsPage = () => {
  return (
    <ErrorBoundary
      fallback={
        <PostsErrorFallback
          onRetry={() => window.location.reload()}
          onNew={() => {
            // This will be handled by the parent component or router
            console.log("Navigate to create post");
          }}
        />
      }
    >
      <PostsPageContent />
    </ErrorBoundary>
  );
};

export default PostsPage;
