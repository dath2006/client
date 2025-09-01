"use client";

import React from "react";
import { PostContent } from "@/types/post";
import { ExternalLink, Globe } from "lucide-react";

interface LinkPostContentProps {
  content: PostContent;
}

const LinkPostContent: React.FC<LinkPostContentProps> = ({ content }) => {
  if (!content.url) {
    return null;
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      {/* Link Preview Card */}
      <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          {/* Thumbnail */}
          {content.linkThumbnail && (
            <div className="aspect-video overflow-hidden">
              <img
                src={content.linkThumbnail}
                alt={content.linkTitle || "Link preview"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-3">
            {/* Title */}
            {content.linkTitle && (
              <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors">
                {content.linkTitle}
              </h3>
            )}

            {/* Description */}
            {content.linkDescription && (
              <p className="text-text-secondary leading-relaxed">
                {content.linkDescription}
              </p>
            )}

            {/* URL and Domain */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Globe size={16} />
                <span>{getDomain(content.url)}</span>
              </div>
              <div className="flex items-center gap-1 text-primary text-sm font-medium">
                <span>Visit link</span>
                <ExternalLink size={16} />
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Fallback for links without preview data */}
      {!content.linkTitle &&
        !content.linkDescription &&
        !content.linkThumbnail && (
          <div className="bg-card border border-border rounded-lg p-4">
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between group hover:text-primary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-text-primary group-hover:text-primary">
                    {getDomain(content.url)}
                  </p>
                  <p className="text-sm text-text-secondary truncate max-w-md">
                    {content.url}
                  </p>
                </div>
              </div>
              <ExternalLink
                size={20}
                className="text-text-secondary group-hover:text-primary"
              />
            </a>
          </div>
        )}
    </div>
  );
};

export default LinkPostContent;
