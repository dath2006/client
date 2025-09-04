"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent"; // Assuming this handles image display
import PostInteractions from "./PostInteractions";
import PostTags from "./PostTags";
import CommentsSection from "./CommentsSection"; // This will be updated
import ShareModal from "./ShareModal";
import { Post, Comment } from "@/types/post";
import { feedAPI, ApiError } from "@/lib/api";

// --- Animation Variants (with explicit 'Variants' type) ---

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const notificationVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

// New variants for comments
const commentVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
};

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
        const post = await feedAPI.getPost(postId);
        setCurrentPost(post);
      } catch (err) {
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
    if (postId) fetchPost();
  }, [postId]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLike = () => {
    if (!currentPost) return;
    const newLikedState = !userInteractions.liked;
    setUserInteractions((prev) => ({ ...prev, liked: newLikedState }));
    setCurrentPost((prev) =>
      prev
        ? { ...prev, likes: newLikedState ? prev.likes + 1 : prev.likes - 1 }
        : null
    );
  };

  const handleSave = () => {
    const newSavedState = !userInteractions.saved;
    setUserInteractions((prev) => ({ ...prev, saved: newSavedState }));
    showNotification(newSavedState ? "Post saved!" : "Post unsaved!");
  };

  const handleShare = () => setIsShareModalOpen(true);
  const handleTagClick = (tag: string) => console.log("Navigate to tag:", tag);

  const handleCommentSubmit = (content: string) => {
    if (!currentPost) return;
    const newComment: Comment = {
      id: `c${Date.now()}`, // Ensure unique ID for AnimatePresence to track
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
    setCurrentPost((prev) =>
      prev ? { ...prev, comments: [newComment, ...prev.comments] } : null
    );
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen bg-background flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex items-center gap-2 text-text-secondary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading post...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen bg-background flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
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
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Post not found</div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-4 right-4 z-50 bg-success text-white px-4 py-2 rounded-lg shadow-lg"
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShareModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              variants={modalBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsShareModalOpen(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ShareModal
                post={currentPost}
                onClose={() => setIsShareModalOpen(false)}
                onShare={() => showNotification("Link copied to clipboard!")}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <nav className="flex justify-between items-center mb-8">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </motion.button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">Post Details</span>
          </div>
        </nav>

        <motion.article
          className="space-y-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <PostHeader post={currentPost} />
          </motion.div>
          <motion.div variants={staggerItem}>
            <PostContent post={currentPost} />
          </motion.div>
          <motion.div variants={staggerItem}>
            <PostTags tags={currentPost.tags} onTagClick={handleTagClick} />
          </motion.div>
          <motion.div variants={staggerItem}>
            <PostInteractions
              post={currentPost}
              userLiked={userInteractions.liked}
              userSaved={userInteractions.saved}
              onLike={handleLike}
              onShare={handleShare}
              onSave={handleSave}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            {/* Pass commentVariants down to CommentsSection */}
            <CommentsSection
              comments={currentPost.comments}
              onCommentSubmit={handleCommentSubmit}
              commentVariants={commentVariants}
            />
          </motion.div>
        </motion.article>
      </div>
    </motion.div>
  );
};

export default PostView;
