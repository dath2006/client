// src/components/PostTags.tsx

import React from "react";
import { motion } from "framer-motion";

interface PostTagsProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

const tagsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // Each tag will animate in 0.1s after the previous one
    },
  },
};

const tagItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const PostTags: React.FC<PostTagsProps> = ({ tags, onTagClick }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      variants={tagsContainerVariants}
    >
      {tags.map((tag) => (
        <motion.button
          key={tag}
          onClick={() => onTagClick(tag)}
          className="px-3 py-1 bg-border text-primary font-medium text-sm rounded-full"
          variants={tagItemVariants}
          // Interactive hover and tap animations
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(var(--primary-rgb), 0.1)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          #{tag}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default PostTags;
