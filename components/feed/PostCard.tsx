"use client";

import React, { useState, useEffect } from "react";
import { Post } from "@/types/post";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { feedAPI, ApiError } from "@/lib/api";
import TextPostContent from "../posts/content-types/TextPostContent";
import PhotoPostContent from "../posts/content-types/PhotoPostContent";
import LinkPostContent from "../posts/content-types/LinkPostContent";
import QuotePostContent from "../posts/content-types/QuotePostContent";
import VideoPostContent from "../posts/content-types/VideoPostContent";
import AudioPostContent from "../posts/content-types/AudioPostContent";
import FilePostContent from "../posts/content-types/FilePostContent";
import { useGlobalPermissions } from "@/hooks/useGlobalPermissions";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Local state for interactive elements
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [viewCount, setViewCount] = useState(post.viewCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [hasRecordedView, setHasRecordedView] = useState(false);
  // State for fullscreen image modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const { canLikePosts, canUnlikePosts } = useGlobalPermissions();
  const { isModuleEnabled } = useGlobalSettings();
  const commentsEnabled = isModuleEnabled("comments");
  const likeEnabled = isModuleEnabled("likes");

  // Check like status on component mount
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (session?.user?.id) {
        try {
          const status = await feedAPI.checkLikeStatus(
            post.id,
            session.user.id
          );
          setIsLiked(status.liked);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    };

    checkLikeStatus();
  }, [post.id, session?.user?.id]);

  // Record view when component becomes visible
  useEffect(() => {
    if (hasRecordedView) return; // Don't set up observer if view already recorded

    const recordView = async () => {
      if (!hasRecordedView) {
        try {
          const result = await feedAPI.recordView(post.id, session?.user?.id);
          setViewCount(result.viewCount);
          setHasRecordedView(true);
        } catch (error) {
          console.error("Error recording view:", error);
        }
      }
    };

    // Use IntersectionObserver to track when the post card becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRecordedView) {
            recordView();
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the card is visible
        rootMargin: "0px",
      }
    );

    const currentElement = document.getElementById(`post-${post.id}`);
    if (currentElement && !hasRecordedView) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [post.id, session?.user?.id, hasRecordedView]);

  // Handle like/unlike functionality
  const handleLike = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);

    // Optimistic update
    const previousLiked = isLiked;
    const previousCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      const result = await feedAPI.toggleLike(post.id, session?.user?.id);
      setIsLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleViewMoreClick = () => {
    router.push(`/posts/${post.id}`);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

    return date.toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getPostTypeColor = (type: string) => {
    const colors = {
      text: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      photo:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      video: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      audio:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      link: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      quote:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      file: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    return colors[type as keyof typeof colors] || colors.text;
  };

  // Custom photo post content with click-to-preview
  const renderPostContent = () => {
    switch (post.type) {
      case "text":
        return <TextPostContent content={post.content} />;
      case "photo":
        // If post.content is a string (URL), render image with click handler
        // If it's an array, render all images with click handler
        if (typeof post.content === "string") {
          return (
            <img
              src={post.content}
              alt={post.title || "Post image"}
              className="w-full max-h-96 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof post.content === "string" && post.content) {
                  setModalImageSrc(post.content);
                  setShowImageModal(true);
                }
              }}
            />
          );
        } else if (Array.isArray(post.content)) {
          return (
            <div className="flex flex-wrap gap-2">
              {post.content.map((imgSrc: string, idx: number) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`Post image ${idx + 1}`}
                  className="w-full max-h-96 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof imgSrc === "string" && imgSrc) {
                      setModalImageSrc(imgSrc);
                      setShowImageModal(true);
                    }
                  }}
                />
              ))}
            </div>
          );
        } else {
          return <PhotoPostContent content={post.content} />;
        }
      case "video":
        return <VideoPostContent content={post.content} />;
      case "audio":
        return <AudioPostContent content={post.content} />;
      case "link":
        return <LinkPostContent content={post.content} />;
      case "quote":
        return <QuotePostContent content={post.content} />;
      case "file":
        return <FilePostContent content={post.content} />;
      default:
        return <TextPostContent content={post.content} />;
    }
  };

  // Modal close handler
  useEffect(() => {
    if (!showImageModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowImageModal(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("image-modal-backdrop")) {
        setShowImageModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showImageModal]);

  return (
    <>
      {/* Fullscreen Image Modal */}
      {showImageModal && modalImageSrc && (
        <div
          className="image-modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] p-4">
            <img
              src={modalImageSrc}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: "90vh", maxWidth: "90vw" }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-2xl font-bold z-10 w-8 h-8 flex items-center justify-center bg-black bg-opacity-50 rounded-full"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <article
        id={`post-${post.id}`}
        className="bg-card border border-border rounded-lg p-6 card-shadow hover:shadow-lg transition-shadow duration-200"
      >
        {/* Post Header */}
        <header className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              <img
                src={post.author.avatar || "/api/placeholder/48/48"}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-border"
              />
            </div>

            {/* Author Info & Metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-text-primary truncate">
                  {post.author.name}
                </h3>
                <span className="text-text-tertiary text-sm">•</span>
                <span className="text-text-tertiary text-sm whitespace-nowrap">
                  {formatDate(post.createdAt)}
                </span>
                {/* Post Type Badge */}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(
                    post.type
                  )}`}
                >
                  {post.type}
                </span>
              </div>

              {/* Category */}
              <p className="text-text-secondary text-sm mt-1">
                in{" "}
                <span className="font-medium hover:text-primary cursor-pointer">
                  {post.category}
                </span>
              </p>

              {/* Rights and License Information */}
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {post.rightsHolder && (
                  <span className="text-text-tertiary">
                    © {post.rightsHolder}
                  </span>
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
            </div>
          </div>

          {/* More Options */}
          <button className="p-1 hover:bg-surface rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-text-tertiary" />
          </button>
        </header>

        {/* Post Title */}
        {post.title && (
          <h2 className="text-xl font-bold text-text-primary mb-4 leading-tight">
            {post.title}
          </h2>
        )}

        {/* Post Content */}
        <div className="mb-4">{renderPostContent()}</div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-surface text-text-secondary text-sm rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Statistics & Actions */}
        <footer className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-6">
            {/* Like Button */}

            {likeEnabled && (
              <button
                onClick={handleLike}
                disabled={
                  isLikeLoading ||
                  (!isLiked && !canLikePosts) ||
                  (isLiked && !canUnlikePosts)
                }
                className={`flex items-center space-x-2 transition-colors group ${
                  isLiked
                    ? "text-error"
                    : "text-text-secondary hover:text-error"
                } ${isLikeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    isLiked
                      ? "fill-current text-error"
                      : "group-hover:fill-current"
                  }`}
                />
                <span className="text-sm font-medium">
                  {formatNumber(likeCount)}
                </span>
              </button>
            )}

            {/* Comment Button */}
            {commentsEnabled && (
              <button
                className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
                onClick={handleViewMoreClick}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {formatNumber(post.comments.length)}
                </span>
              </button>
            )}

            {/* Share Button */}
            <button className="flex items-center space-x-2 text-text-secondary hover:text-secondary transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                {formatNumber(post.shares)}
              </span>
            </button>

            {/* Views */}
            <div className="flex items-center space-x-2 text-text-tertiary">
              <Eye className="w-5 h-5" />
              <span className="text-sm">{formatNumber(viewCount)}</span>
            </div>
          </div>

          {/* View More Button and Save Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleViewMoreClick}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View More</span>
            </button>

            {/* <button className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors">
            <Bookmark className="w-5 h-5" />
            <span className="text-sm font-medium">
              {formatNumber(post.saves)}
            </span>
          </button> */}
          </div>
        </footer>
      </article>
    </>
  );
};

export default PostCard;
