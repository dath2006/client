"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostInteractions from "./PostInteractions";
import PostTags from "./PostTags";
import CommentsSection from "./CommentsSection";
import ShareModal from "./ShareModal";
import { Post, Comment } from "@/types/post";
import { feedAPI, ApiError } from "@/lib/api";

interface PostViewProps {
  postId?: string;
  onBack?: () => void;
}

const PostView: React.FC<PostViewProps> = ({ postId = "1", onBack }) => {
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInteractions, setUserInteractions] = useState({
    liked: false,
    saved: false,
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching post with ID:", postId);
        const post = await feedAPI.getPost(postId);
        console.log("Fetched post:", post);

        setCurrentPost(post);
      } catch (err) {
        console.error("Error fetching post:", err);

        if (err instanceof ApiError) {
          if (err.status === 404) {
            setError("Post not found");
          } else {
            setError(err.message || "Failed to load post");
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLike = () => {
    if (!currentPost) return;

    const newLikedState = !userInteractions.liked;
    setUserInteractions((prev) => ({ ...prev, liked: newLikedState }));

    setCurrentPost((prev: Post | null) =>
      prev
        ? {
            ...prev,
            likes: newLikedState ? prev.likes + 1 : prev.likes - 1,
          }
        : null
    );
  };

  const handleSave = () => {
    const newSavedState = !userInteractions.saved;
    setUserInteractions((prev) => ({ ...prev, saved: newSavedState }));
    showNotification(newSavedState ? "Post saved!" : "Post unsaved!");
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleTagClick = (tag: string) => {
    // Navigate to tag filter page
    console.log("Navigate to tag:", tag);
  };

  const handleCommentSubmit = (content: string) => {
    if (!currentPost) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: {
        name: "Current User",
        avatar: "/api/placeholder/40/40",
        id: "current-user",
      },
      content,
      createdAt: new Date(),
      likes: 0,
      replies: [],
    };

    setCurrentPost((prev: Post | null) =>
      prev
        ? {
            ...prev,
            comments: [newComment, ...prev.comments],
          }
        : null
    );
  };

  const handleNextPost = () => {
    // Navigation between posts removed since we're fetching individual posts
    // This could be implemented later with a posts list context or additional API calls
    console.log("Next post navigation not implemented");
  };

  const handlePrevPost = () => {
    // Navigation between posts removed since we're fetching individual posts
    // This could be implemented later with a posts list context or additional API calls
    console.log("Previous post navigation not implemented");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-text-secondary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-text-primary text-lg mb-2">
            Error Loading Post
          </div>
          <div className="text-text-secondary mb-6">{error}</div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => {
                setError(null);
                const fetchPost = async () => {
                  try {
                    setLoading(true);
                    const post = await feedAPI.getPost(postId);
                    setCurrentPost(post);
                  } catch (err) {
                    console.error("Retry failed:", err);
                    if (err instanceof ApiError) {
                      setError(
                        err.status === 404
                          ? "Post not found"
                          : err.message || "Failed to load post"
                      );
                    } else {
                      setError("An unexpected error occurred");
                    }
                  } finally {
                    setLoading(false);
                  }
                };
                fetchPost();
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Post not found state
  if (!currentPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-success text-white px-4 py-2 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          post={currentPost}
          onClose={() => setIsShareModalOpen(false)}
          onShare={() => showNotification("Link copied to clipboard!")}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Removed post navigation since we're fetching individual posts */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">Post Details</span>
          </div>
        </nav>

        {/* Post Content */}
        <article className="space-y-8">
          <PostHeader post={currentPost} />
          <PostContent post={currentPost} />
          <PostTags tags={currentPost.tags} onTagClick={handleTagClick} />
          <PostInteractions
            post={currentPost}
            userLiked={userInteractions.liked}
            userSaved={userInteractions.saved}
            onLike={handleLike}
            onShare={handleShare}
            onSave={handleSave}
          />
          <CommentsSection
            comments={currentPost.comments}
            onCommentSubmit={handleCommentSubmit}
          />
        </article>
      </div>
    </div>
  );
};

export default PostView;
