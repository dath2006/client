// src/components/PostHeader.tsx
"use client";
import React from "react";
import { Post } from "@/types/post";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

interface PostHeaderProps {
  post: Post;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  return (
    <motion.div
      className="flex items-center justify-between"
      variants={containerVariants}
    >
      <div className="flex items-center gap-4">
        <motion.img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-border"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        />
        <motion.div variants={itemVariants}>
          {/* FIX: Ensure you are rendering post.author.name, not the whole author object */}
          <p className="font-bold text-foreground">{post.author.name}</p>
          <p className="text-sm text-text-secondary">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {/* Rights and License Information */}
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {post.rightsHolder && (
              <span className="text-text-tertiary">© {post.rightsHolder}</span>
            )}
            {post.license && (
              <span className="px-2 py-1 bg-surface text-text-secondary rounded">
                {post.license}
              </span>
            )}
            {post.originalWork && (
              <span className="px-2 py-1 bg-accent/20 text-accent rounded font-medium">
                Original Work
              </span>
            )}
          </div>
        </motion.div>
      </div>

      <motion.button
        className="p-2 rounded-full text-text-secondary hover:bg-border hover:text-foreground"
        variants={itemVariants}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <MoreHorizontal size={24} />
      </motion.button>
    </motion.div>
  );
};

export default PostHeader;
