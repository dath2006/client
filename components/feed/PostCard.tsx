"use client";

import React from "react";
import { Post } from "@/types/post";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import TextPostContent from "../posts/content-types/TextPostContent";
import PhotoPostContent from "../posts/content-types/PhotoPostContent";
import LinkPostContent from "../posts/content-types/LinkPostContent";
import QuotePostContent from "../posts/content-types/QuotePostContent";
import VideoPostContent from "../posts/content-types/VideoPostContent";
import AudioPostContent from "../posts/content-types/AudioPostContent";
import FilePostContent from "../posts/content-types/FilePostContent";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();

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

  const renderPostContent = () => {
    switch (post.type) {
      case "text":
        return <TextPostContent content={post.content} />;
      case "photo":
        return <PhotoPostContent content={post.content} />;
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

  return (
    <article className="bg-card border border-border rounded-lg p-6 card-shadow hover:shadow-lg transition-shadow duration-200">
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
          <button className="flex items-center space-x-2 text-text-secondary hover:text-error transition-colors group">
            <Heart className="w-5 h-5 group-hover:fill-current" />
            <span className="text-sm font-medium">
              {formatNumber(post.likes)}
            </span>
          </button>

          {/* Comment Button */}
          <button className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {formatNumber(post.comments.length)}
            </span>
          </button>

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
            <span className="text-sm">{formatNumber(post.viewCount)}</span>
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

          <button className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors">
            <Bookmark className="w-5 h-5" />
            <span className="text-sm font-medium">
              {formatNumber(post.saves)}
            </span>
          </button>
        </div>
      </footer>
    </article>
  );
};

export default PostCard;
