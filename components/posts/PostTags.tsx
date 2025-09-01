"use client";

import React from "react";
import { Hash } from "lucide-react";

interface PostTagsProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

const PostTags: React.FC<PostTagsProps> = ({ tags, onTagClick }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1 text-text-secondary">
        <Hash size={16} />
        <span className="text-sm font-medium">Tags:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-sm font-medium transition-colors"
          >
            <Hash size={12} />
            <span>{tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostTags;
