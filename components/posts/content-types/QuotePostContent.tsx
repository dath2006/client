"use client";

import React from "react";
import { motion } from "framer-motion";
import { PostContent } from "@/types/post";
import { Quote as QuoteIcon } from "lucide-react";

interface QuotePostContentProps {
  content: PostContent;
}

// --- ALL VARIANTS CORRECTED ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  // FIX: The 'transition' object is now a sibling property.
  transition: {
    delay: 0.2,
    when: "beforeChildren",
    staggerChildren: 0.2,
  },
};

const borderVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
  },
  // FIX: Moved transition to the top level.
  transition: { duration: 0.4, ease: "easeOut" },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -90 },
  visible: {
    scale: 1,
    rotate: 0,
  },
  // FIX: Moved transition to the top level.
  transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.3 },
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
  },
  // FIX: Moved transition to the top level.
  transition: { duration: 0.5, ease: "easeOut" },
};

const QuotePostContent: React.FC<QuotePostContentProps> = ({ content }) => {
  if (!content.quote) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
      className="relative my-8"
    >
      <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-8 overflow-hidden">
        <motion.div
          variants={borderVariants}
          className="absolute top-0 left-0 h-full w-1 bg-primary"
          style={{ originY: 0 }}
        />

        <motion.div
          variants={iconVariants}
          className="absolute -top-4 left-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
        >
          <QuoteIcon size={16} className="text-white fill-white" />
        </motion.div>

        <div className="pl-4">
          <motion.blockquote
            variants={textVariants}
            className="text-xl md:text-2xl font-medium text-text-primary leading-relaxed mb-6"
          >
            "{content.quote}"
          </motion.blockquote>

          {content.source && (
            <motion.cite
              variants={textVariants}
              className="text-text-secondary text-sm font-medium not-italic"
            >
              — {content.source}
            </motion.cite>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuotePostContent;
