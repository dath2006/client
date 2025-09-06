"use client";

import React from "react";
import { PostContent } from "@/types/post";
import { Quote } from "lucide-react";
import MarkdownContent from "@/components/common/MarkdownContent";

interface QuotePostContentProps {
  content: PostContent;
}

const QuotePostContent: React.FC<QuotePostContentProps> = ({ content }) => {
  if (!content.quote) {
    return null;
  }

  return (
    <div className="relative">
      {/* Quote Container */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-l-4 border-primary rounded-lg p-8 my-8">
        {/* Quote Icon */}
        <div className="absolute -top-4 -left-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Quote size={16} className="text-white" />
        </div>

        {/* Quote Text */}
        <blockquote className="text-xl md:text-2xl font-medium text-text-primary leading-relaxed mb-6">
          "<MarkdownContent content={content.quote} className="inline" />"
        </blockquote>

        {/* Source */}
        {content.source && (
          <cite className="text-text-secondary text-sm font-medium not-italic">
            — <MarkdownContent content={content.source} className="inline" />
          </cite>
        )}
      </div>
    </div>
  );
};

export default QuotePostContent;
