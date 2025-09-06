"use client";

import React from "react";
import { Post } from "@/types/post";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useGlobalPermissions } from "@/hooks/useGlobalPermissions";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

interface PostInteractionsProps {
  post: Post;
  userLiked: boolean;
  userSaved: boolean;
  onLike: () => void;
  onShare: () => void;
  onSave: () => void;
  onCommentClick: () => void; // Prop to handle scrolling
  isLikeLoading?: boolean;
}

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const InteractionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  text: string;
  isActive?: boolean;
  disabled?: boolean;
}> = ({ onClick, children, text, isActive = false, disabled = false }) => (
  <motion.button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : isActive
        ? "bg-primary/10 text-primary"
        : "text-text-secondary hover:bg-border hover:text-foreground"
    }`}
    whileHover={disabled ? {} : { scale: 1.05 }}
    whileTap={disabled ? {} : { scale: 0.95 }}
  >
    {children}
    <span className="hidden sm:inline">{text}</span>
  </motion.button>
);

const PostInteractions: React.FC<PostInteractionsProps> = ({
  post,
  userLiked,
  userSaved,
  onLike,
  onShare,
  onSave,
  onCommentClick,
  isLikeLoading = false,
}) => {
  const { canLikePosts, canUnlikePosts } = useGlobalPermissions();
  const { isModuleEnabled } = useGlobalSettings();
  const commentsEnabled = isModuleEnabled("comments");
  const likeEnabled = isModuleEnabled("likes");

  if (!likeEnabled && !commentsEnabled) {
    return null; // Don't render anything if both likes and comments are disabled
  }

  return (
    <div className="flex items-center justify-between py-4 border-t border-b border-border">
      <div className="flex items-center gap-2">
        {likeEnabled && (
          <InteractionButton
            onClick={onLike}
            text={`${post.likes} Likes`}
            isActive={userLiked}
            disabled={
              isLikeLoading || !canLikePosts || (!userLiked && !canUnlikePosts)
            }
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={userLiked ? "liked" : "unliked"}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {isLikeLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart size={20} fill={userLiked ? "currentColor" : "none"} />
                )}
              </motion.span>
            </AnimatePresence>
          </InteractionButton>
        )}

        {commentsEnabled && (
          <InteractionButton
            onClick={onCommentClick}
            text={`${post.comments.length} Comments`}
          >
            <MessageCircle size={20} />
          </InteractionButton>
        )}

        <InteractionButton onClick={onShare} text="Share">
          <Share2 size={20} />
        </InteractionButton>
      </div>

      <InteractionButton
        onClick={onSave}
        text={userSaved ? "Saved" : "Save"}
        isActive={userSaved}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={userSaved ? "saved" : "unsaved"}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Bookmark size={20} fill={userSaved ? "currentColor" : "none"} />
          </motion.span>
        </AnimatePresence>
      </InteractionButton>
    </div>
  );
};

export default PostInteractions;
