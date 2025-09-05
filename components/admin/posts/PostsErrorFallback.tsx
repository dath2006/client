"use client";

import React from "react";
// Import motion for animations
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Plus } from "lucide-react";

interface PostsErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  onNew?: () => void;
}

// Animation variants for the container and its children
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const PostsErrorFallback: React.FC<PostsErrorFallbackProps> = ({
  error,
  onRetry,
  onNew,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]"
    >
      {/* Animated icon with a subtle shake to draw attention */}
      <motion.div
        animate={{
          rotate: [0, -3, 3, -3, 3, 0],
          scale: [1, 1.05, 1, 1.05, 1],
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        <AlertTriangle className="w-16 h-16 text-error mb-4" />
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-xl font-semibold text-foreground mb-2"
      >
        Failed to load posts
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="text-muted-foreground mb-6 max-w-md"
      >
        {error?.message ||
          "There was an error loading the posts. This could be due to a network issue or a server problem."}
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-3"
      >
        <motion.button
          onClick={onRetry || (() => window.location.reload())}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Loading
        </motion.button>

        {onNew && (
          <motion.button
            onClick={onNew}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-surface transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </motion.button>
        )}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-8 text-xs text-muted-foreground"
      >
        <p>If this problem persists, please contact support.</p>
      </motion.div>
    </motion.div>
  );
};

export default PostsErrorFallback;
