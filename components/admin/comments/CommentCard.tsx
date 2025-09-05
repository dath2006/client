"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Clock,
  Check,
  X,
  Shield,
  Trash2,
  User,
  Globe,
  Mail,
  Monitor,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Comment {
  id: number | string; // Handle both API (number) and UI (string) formats
  body: string; // API uses 'body' not 'content'
  author: string; // API returns author as string, not object
  email: string;
  url: string; // API uses 'url' for website
  ip: string; // API uses 'ip' not 'ipAddress'
  status: "pending" | "approved" | "spam" | "rejected";
  createdAt: string; // ISO date string
  updatedAt: string;
}

interface PostWithComments {
  post: {
    id: number;
    title: string;
    url: string; // API uses 'url' not 'slug'
  };
  comments: Comment[];
  commentCount: number; // API uses 'commentCount' not 'totalComments'
}

interface CommentCardProps {
  postData: PostWithComments;
  onCommentStatusChange: (
    commentId: string,
    newStatus: Comment["status"]
  ) => void;
  onCommentDelete: (commentId: string) => void;
  onCommentSelect: (commentId: string, selected: boolean) => void;
  selectedComments: string[];
}

const CommentCard = ({
  postData,
  onCommentStatusChange,
  onCommentDelete,
  onCommentSelect,
  selectedComments,
}: CommentCardProps) => {
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  // Helper function to convert ID to string
  const getCommentId = (comment: Comment): string => {
    return comment.id.toString();
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "Invalid date";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: Comment["status"]) => {
    switch (status) {
      case "approved":
        return "text-green-400 bg-green-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/20";
      case "spam":
        return "text-red-400 bg-red-400/20";
      case "rejected":
        return "text-gray-400 bg-gray-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusIcon = (status: Comment["status"]) => {
    switch (status) {
      case "approved":
        return <Check size={12} />;
      case "pending":
        return <Clock size={12} />;
      case "spam":
        return <Shield size={12} />;
      case "rejected":
        return <X size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-6">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f7a5a5]/10">
        <MessageSquare className="text-[#f7a5a5]" size={20} />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#f7a5a5]">
            {postData.post.title}
          </h3>
          <p className="text-sm text-[#f7a5a5]/70">
            {postData.commentCount} comment
            {postData.commentCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {postData.comments.map((comment) => {
          const commentId = getCommentId(comment);
          const isExpanded = expandedComments.includes(commentId);
          const isSelected = selectedComments.includes(commentId);
          const shouldTruncate = comment.body?.length > 150;

          return (
            <div
              key={commentId}
              className={`p-4 rounded-lg border transition-all ${
                isSelected
                  ? "border-[#f7a5a5]/50 bg-[#f7a5a5]/5"
                  : "border-[#f7a5a5]/20 bg-white/2"
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) =>
                      onCommentSelect(commentId, e.target.checked)
                    }
                    className="mt-1 w-4 h-4 text-[#f7a5a5] bg-transparent border border-[#f7a5a5]/30 rounded focus:ring-[#f7a5a5] focus:ring-1"
                    suppressHydrationWarning={true}
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="text-[#f7a5a5]/70" size={14} />
                      <span className="font-medium text-[#f7a5a5]">
                        {comment.author}
                      </span>
                      <span className="text-[#f7a5a5]/50 text-sm">
                        <Mail size={12} className="inline mr-1" />
                        {comment.email}
                      </span>
                      {comment.url && (
                        <a
                          href={comment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f7a5a5]/70 hover:text-[#f7a5a5] text-sm transition-colors"
                        >
                          <Globe size={12} className="inline" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#f7a5a5]/50">
                      <span>{formatDate(comment.createdAt)}</span>
                      <span>•</span>
                      <span>IP: {comment.ip}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                    comment.status
                  )}`}
                >
                  {getStatusIcon(comment.status)}
                  <span className="capitalize">{comment.status}</span>
                </div>
              </div>

              {/* Comment Content */}
              <div className="mb-4 ml-7">
                <div className="text-[#f7a5a5]/90 leading-relaxed">
                  {isExpanded || !shouldTruncate
                    ? comment.body
                    : truncateContent(comment.body || "")}
                </div>

                {shouldTruncate && (
                  <button
                    onClick={() => toggleCommentExpansion(commentId)}
                    className="mt-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] text-sm flex items-center gap-1 transition-colors"
                    suppressHydrationWarning={true}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={14} />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        Show more
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-7">
                <button
                  onClick={() => onCommentStatusChange(commentId, "approved")}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    comment.status === "approved"
                      ? "bg-green-400/20 text-green-400"
                      : "bg-green-400/10 text-green-400/70 hover:text-green-400 hover:bg-green-400/20"
                  }`}
                  disabled={comment.status === "approved"}
                  suppressHydrationWarning={true}
                >
                  <Check size={12} className="inline mr-1" />
                  Approve
                </button>

                <button
                  onClick={() => onCommentStatusChange(commentId, "rejected")}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    comment.status === "rejected"
                      ? "bg-gray-400/20 text-gray-400"
                      : "bg-gray-400/10 text-gray-400/70 hover:text-gray-400 hover:bg-gray-400/20"
                  }`}
                  disabled={comment.status === "rejected"}
                  suppressHydrationWarning={true}
                >
                  <X size={12} className="inline mr-1" />
                  Reject
                </button>

                <button
                  onClick={() => onCommentStatusChange(commentId, "spam")}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    comment.status === "spam"
                      ? "bg-red-400/20 text-red-400"
                      : "bg-red-400/10 text-red-400/70 hover:text-red-400 hover:bg-red-400/20"
                  }`}
                  disabled={comment.status === "spam"}
                  suppressHydrationWarning={true}
                >
                  <Shield size={12} className="inline mr-1" />
                  Spam
                </button>

                <button
                  onClick={() => onCommentDelete(commentId)}
                  className="px-3 py-1 rounded text-xs bg-red-500/10 text-red-500/70 hover:text-red-500 hover:bg-red-500/20 transition-colors ml-2"
                  suppressHydrationWarning={true}
                >
                  <Trash2 size={12} className="inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentCard;
