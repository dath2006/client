"use client";

import React from "react";
import { motion } from "framer-motion";
import { PostContent } from "@/types/post";
import { ExternalLink, Globe } from "lucide-react";

interface LinkPostContentProps {
  content: PostContent;
}

// Animation variants for the card and its children
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: {
    y: -8,
    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)",
  },
};

const thumbnailVariants = {
  hover: { scale: 1.05 },
};

const visitLinkVariants = {
  hover: { x: 3 },
};

const LinkPostContent: React.FC<LinkPostContentProps> = ({ content }) => {
  if (!content.url) {
    return null;
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const hasPreview =
    content.linkTitle || content.linkDescription || content.linkThumbnail;

  return (
    <motion.div initial="initial" animate="animate" className="space-y-6">
      {hasPreview ? (
        // Link Preview Card
        <motion.a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover="hover"
          transition={{ duration: 0.3 }}
          className="block border border-border rounded-lg overflow-hidden"
        >
          {content.linkThumbnail && (
            <div className="aspect-video overflow-hidden">
              <motion.img
                src={content.linkThumbnail}
                alt={content.linkTitle || "Link preview"}
                variants={thumbnailVariants}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-3">
            {content.linkTitle && (
              <h3 className="text-xl font-semibold text-text-primary transition-colors group-[.hover]:text-primary">
                {content.linkTitle}
              </h3>
            )}

            {content.linkDescription && (
              <p className="text-text-secondary leading-relaxed">
                {content.linkDescription}
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Globe size={16} />
                <span>{getDomain(content.url)}</span>
              </div>
              <div className="flex items-center gap-1 text-primary text-sm font-medium">
                <span>Visit link</span>
                <motion.div variants={visitLinkVariants}>
                  <ExternalLink size={16} />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.a>
      ) : (
        // Fallback for links without preview data
        <motion.a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover="hover"
          transition={{ duration: 0.3 }}
          className="block bg-card border border-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Globe size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary group-[.hover]:text-primary">
                  {getDomain(content.url)}
                </p>
                <p
                  className="text-sm text-text-secondary truncate max-w-md"
                  title={content.url}
                >
                  {content.url}
                </p>
              </div>
            </div>
            <motion.div variants={visitLinkVariants}>
              <ExternalLink
                size={20}
                className="text-text-secondary group-[.hover]:text-primary"
              />
            </motion.div>
          </div>
        </motion.a>
      )}
    </motion.div>
  );
};

export default LinkPostContent;
