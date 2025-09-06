"use client";

import React from "react";
import { PostContent } from "@/types/post";
import MarkdownContent from "@/components/common/MarkdownContent";

interface TextPostContentProps {
  content: PostContent;
}

const TextPostContent: React.FC<TextPostContentProps> = ({ content }) => {
  if (!content.body) {
    return null;
  }

  return (
    <MarkdownContent
      content={content.body}
      className="text-text-primary leading-relaxed"
    />
  );
};

export default TextPostContent;
