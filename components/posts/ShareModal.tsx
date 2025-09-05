"use client";

// src/components/ShareModal.tsx

import React from "react";
import { Post } from "@/types/post";
import { motion } from "framer-motion";
import {
  X,
  Twitter,
  Facebook,
  Link as LinkIcon,
  MessageSquare,
} from "lucide-react";

// Define the props for the component
interface ShareModalProps {
  post: Post;
  onClose: () => void;
  onShare: () => void; // Used for the "Copy Link" notification
}

// A reusable component for each share option
const ShareOption: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}> = ({ icon, label, onClick, href }) => {
  const commonProps = {
    className:
      "flex items-center w-full p-3 rounded-lg text-foreground hover:bg-border transition-colors duration-200",
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {icon}
        <span className="ml-4 font-medium">{label}</span>
      </a>
    );
  }

  return (
    <button onClick={onClick} {...commonProps}>
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </button>
  );
};

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose, onShare }) => {
  // Construct the URL for the post
  // In a real app, ensure this URL structure matches your routing
  const postUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/post/${post.id}`
      : "";
  const postTitle = `Check out this post: "${post.title}"`;

  // Handler for copying the link to the clipboard
  const handleCopyLink = () => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      alert("Clipboard API not available. Please copy the link manually.");
      return;
    }
    navigator.clipboard.writeText(postUrl).then(() => {
      onShare(); // Triggers the "Link copied" notification from PostView
      setTimeout(onClose, 300); // Close modal shortly after
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-2xl w-full max-w-sm border border-border">
      {/* Modal Header */}
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Share Post</h2>
        <motion.button
          onClick={onClose}
          className="p-1 rounded-full text-text-secondary hover:bg-border hover:text-foreground"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
      </div>

      {/* Modal Body with Share Options */}
      <div className="p-4">
        <div className="flex flex-col space-y-2">
          <ShareOption
            icon={<Twitter size={24} className="text-[#1DA1F2]" />}
            label="Share on Twitter"
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              postUrl
            )}&text=${encodeURIComponent(postTitle)}`}
          />
          <ShareOption
            icon={<Facebook size={24} className="text-[#1877F2]" />}
            label="Share on Facebook"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              postUrl
            )}`}
          />
          {/* Note: Lucide doesn't have a WhatsApp icon, so MessageSquare is a substitute */}
          <ShareOption
            icon={<MessageSquare size={24} className="text-[#25D366]" />}
            label="Share on WhatsApp"
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              postTitle + " " + postUrl
            )}`}
          />
          <ShareOption
            icon={<LinkIcon size={24} className="text-text-secondary" />}
            label="Copy Link"
            onClick={handleCopyLink}
          />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
