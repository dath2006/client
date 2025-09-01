"use client";

import React, { useRef, useEffect } from "react";
import { Post } from "@/types/post";
import {
  X,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
} from "lucide-react";

interface ShareModalProps {
  post: Post;
  onClose: () => void;
  onShare: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose, onShare }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this post: ${post.title}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      onShare();
      onClose();
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      currentUrl
    )}&title=${encodeURIComponent(post.title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareText + " " + currentUrl
    )}`,
  };

  const handleSocialShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            Share Post
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text-primary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Post Preview */}
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="font-medium text-text-primary line-clamp-2 mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-text-secondary">
              By {post.author.name} • {post.category}
            </p>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            {/* Twitter */}
            <button
              onClick={() => handleSocialShare(shareLinks.twitter)}
              className="flex items-center gap-3 p-3 bg-surface hover:bg-surface-elevated rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Twitter size={16} className="text-white" />
              </div>
              <span className="text-text-primary group-hover:text-primary">
                Twitter
              </span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleSocialShare(shareLinks.facebook)}
              className="flex items-center gap-3 p-3 bg-surface hover:bg-surface-elevated rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Facebook size={16} className="text-white" />
              </div>
              <span className="text-text-primary group-hover:text-primary">
                Facebook
              </span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleSocialShare(shareLinks.linkedin)}
              className="flex items-center gap-3 p-3 bg-surface hover:bg-surface-elevated rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <Linkedin size={16} className="text-white" />
              </div>
              <span className="text-text-primary group-hover:text-primary">
                LinkedIn
              </span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleSocialShare(shareLinks.whatsapp)}
              className="flex items-center gap-3 p-3 bg-surface hover:bg-surface-elevated rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <span className="text-text-primary group-hover:text-primary">
                WhatsApp
              </span>
            </button>
          </div>

          {/* Copy Link */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Copy size={16} />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
