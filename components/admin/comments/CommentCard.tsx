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
  id: string;
  author: {
    name: string;
    email: string;
    website?: string;
    avatar?: string;
    isRegistered: boolean;
  };
  content: string;
  status: "pending" | "approved" | "spam" | "rejected";
  createdAt: Date;
  ipAddress: string;
  userAgent?: string;
  post: {
    id: string;
    title: string;
    slug: string;
  };
  parentId?: string;
  isReply?: boolean;
}

interface PostWithComments {
  post: {
    id: string;
    title: string;
    slug: string;
    createdAt: Date;
    author: {
      name: string;
      avatar?: string;
    };
  };
  comments: Comment[];
  totalComments: number;
  pendingCount: number;
  approvedCount: number;
  spamCount: number;
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
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
            {postData.totalComments} comment
            {postData.totalComments !== 1 ? "s" : ""} •
            {postData.pendingCount > 0 && (
              <span className="text-yellow-400 ml-1">
                {postData.pendingCount} pending
              </span>
            )}
            {postData.spamCount > 0 && (
              <span className="text-red-400 ml-1">
                {postData.spamCount} spam
              </span>
            )}
          </p>
        </div>
        <div className="text-xs text-[#f7a5a5]/50">
          Posted {formatDate(postData.post.createdAt)}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {postData.comments.map((comment) => {
          const isExpanded = expandedComments.includes(comment.id);
          const isSelected = selectedComments.includes(comment.id);
          const shouldTruncate = comment.content.length > 150;

          return (
            <div
              key={comment.id}
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
                      onCommentSelect(comment.id, e.target.checked)
                    }
                    className="mt-1 w-4 h-4 text-[#f7a5a5] bg-transparent border border-[#f7a5a5]/30 rounded focus:ring-[#f7a5a5] focus:ring-1"
                    suppressHydrationWarning={true}
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {comment.author.isRegistered ? (
                        <User className="text-[#f7a5a5]" size={14} />
                      ) : (
                        <Globe className="text-[#f7a5a5]/70" size={14} />
                      )}
                      <span className="font-medium text-[#f7a5a5]">
                        {comment.author.name}
                      </span>
                      <span className="text-[#f7a5a5]/50 text-sm">
                        <Mail size={12} className="inline mr-1" />
                        {comment.author.email}
                      </span>
                      {comment.author.website && (
                        <a
                          href={comment.author.website}
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
                      <span>IP: {comment.ipAddress}</span>
                      {comment.userAgent && (
                        <>
                          <span>•</span>
                          <Monitor size={10} className="inline" />
                        </>
                      )}
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
                    ? comment.content
                    : truncateContent(comment.content)}
                </div>

                {shouldTruncate && (
                  <button
                    onClick={() => toggleCommentExpansion(comment.id)}
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
                  onClick={() => onCommentStatusChange(comment.id, "approved")}
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
                  onClick={() => onCommentStatusChange(comment.id, "rejected")}
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
                  onClick={() => onCommentStatusChange(comment.id, "spam")}
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
                  onClick={() => onCommentDelete(comment.id)}
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
