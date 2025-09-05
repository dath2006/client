"use client";

import React from "react";
import { motion } from "framer-motion";
import { PostContent } from "@/types/post";

interface TextPostContentProps {
  content: PostContent;
}

// FIX: Corrected the structure of the variants object
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.6,
    ease: "easeOut",
  },
};

const TextPostContent: React.FC<TextPostContentProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    // Simple markdown-like rendering
    let html = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /`(.*?)`/g,
        '<code class="bg-surface px-1 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br />");

    return `<div class="text-text-primary leading-relaxed"><p class="mb-4">${html}</p></div>`;
  };

  if (!content.body) {
    return null;
  }

  return (
    <motion.article
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content.body) }}
    />
  );
};

export default TextPostContent;
