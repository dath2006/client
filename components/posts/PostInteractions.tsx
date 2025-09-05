"use client";

import React from "react";
import { Post } from "@/types/post";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

interface PostInteractionsProps {
  post: Post;
  userLiked: boolean;
  userSaved: boolean;
  onLike: () => void;
  onShare: () => void;
  onSave: () => void;
  onCommentClick: () => void; // Prop to handle scrolling
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
}> = ({ onClick, children, text, isActive = false }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-text-secondary hover:bg-border hover:text-foreground"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
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
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-t border-b border-border">
      <div className="flex items-center gap-2">
        <InteractionButton
          onClick={onLike}
          text={`${post.likes} Likes`}
          isActive={userLiked}
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
              <Heart size={20} fill={userLiked ? "currentColor" : "none"} />
            </motion.span>
          </AnimatePresence>
        </InteractionButton>

        <InteractionButton
          onClick={onCommentClick}
          text={`${post.comments.length} Comments`}
        >
          <MessageCircle size={20} />
        </InteractionButton>

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
