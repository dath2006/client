"use client";

import React, { useState } from "react";
import {
  Link as LinkIcon,
  Heart,
  Repeat,
  MessageSquare,
  Bookmark,
  Calendar,
  Check,
  X,
  Shield,
  Trash2,
  User,
  Globe,
  ExternalLink,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";

interface Webmention {
  id: string;
  type: "mention" | "like" | "repost" | "reply" | "bookmark" | "rsvp";
  source: {
    url: string;
    title?: string;
    author: {
      name: string;
      url?: string;
      avatar?: string;
    };
    publishedAt: Date;
    content?: string;
    excerpt?: string;
  };
  target: {
    url: string;
    post: {
      id: string;
      title: string;
      slug: string;
    };
  };
  status: "pending" | "approved" | "rejected" | "spam";
  receivedAt: Date;
  verifiedAt?: Date;
  isValid: boolean;
  validationErrors?: string[];
  properties: {
    likeOf?: string;
    repostOf?: string;
    inReplyTo?: string;
    bookmarkOf?: string;
    rsvp?: "yes" | "no" | "maybe" | "interested";
  };
}

interface WebmentionCardProps {
  webmention: Webmention;
  onWebmentionStatusChange: (
    webmentionId: string,
    newStatus: Webmention["status"]
  ) => void;
  onWebmentionDelete: (webmentionId: string) => void;
  onWebmentionSelect: (webmentionId: string, selected: boolean) => void;
  selectedWebmentions: string[];
}

const WebmentionCard = ({
  webmention,
  onWebmentionStatusChange,
  onWebmentionDelete,
  onWebmentionSelect,
  selectedWebmentions,
}: WebmentionCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: Webmention["type"]) => {
    switch (type) {
      case "mention":
        return <LinkIcon size={16} className="text-blue-400" />;
      case "like":
        return <Heart size={16} className="text-red-400" />;
      case "repost":
        return <Repeat size={16} className="text-green-400" />;
      case "reply":
        return <MessageSquare size={16} className="text-purple-400" />;
      case "bookmark":
        return <Bookmark size={16} className="text-yellow-400" />;
      case "rsvp":
        return <Calendar size={16} className="text-orange-400" />;
      default:
        return <LinkIcon size={16} className="text-blue-400" />;
    }
  };

  const getTypeLabel = (type: Webmention["type"]) => {
    switch (type) {
      case "mention":
        return "Mention";
      case "like":
        return "Like";
      case "repost":
        return "Repost";
      case "reply":
        return "Reply";
      case "bookmark":
        return "Bookmark";
      case "rsvp":
        return "RSVP";
      default:
        return "Unknown";
    }
  };

  const getTypeColor = (type: Webmention["type"]) => {
    switch (type) {
      case "mention":
        return "text-blue-400 bg-blue-400/20";
      case "like":
        return "text-red-400 bg-red-400/20";
      case "repost":
        return "text-green-400 bg-green-400/20";
      case "reply":
        return "text-purple-400 bg-purple-400/20";
      case "bookmark":
        return "text-yellow-400 bg-yellow-400/20";
      case "rsvp":
        return "text-orange-400 bg-orange-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  const getStatusColor = (status: Webmention["status"]) => {
    switch (status) {
      case "approved":
        return "text-green-400 bg-green-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/20";
      case "spam":
      case "rejected":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const isSelected = selectedWebmentions.includes(webmention.id);

  return (
    <div
      className={`bg-white/5 rounded-lg border transition-all p-6 ${
        isSelected
          ? "border-[#f7a5a5]/50 bg-[#f7a5a5]/5"
          : "border-[#f7a5a5]/20"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) =>
              onWebmentionSelect(webmention.id, e.target.checked)
            }
            className="mt-1 w-4 h-4 text-[#f7a5a5] bg-transparent border border-[#f7a5a5]/30 rounded focus:ring-[#f7a5a5] focus:ring-1"
            suppressHydrationWarning={true}
          />

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${getTypeColor(
                  webmention.type
                )}`}
              >
                {getTypeIcon(webmention.type)}
                <span>{getTypeLabel(webmention.type)}</span>
              </div>

              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                  webmention.status
                )}`}
              >
                <span className="capitalize">{webmention.status}</span>
              </div>

              {!webmention.isValid && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-red-400 bg-red-400/20">
                  <AlertTriangle size={12} />
                  Invalid
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-2 mb-2">
              {webmention.source.author.avatar && (
                <img
                  src={webmention.source.author.avatar}
                  alt={webmention.source.author.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="flex items-center gap-2">
                <User className="text-[#f7a5a5]" size={14} />
                <span className="text-[#f7a5a5] font-medium">
                  {webmention.source.author.name}
                </span>
                {webmention.source.author.url && (
                  <a
                    href={webmention.source.author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f7a5a5]/70 hover:text-[#f7a5a5] transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Source Info */}
            <div className="text-sm text-[#f7a5a5]/70 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={12} />
                <a
                  href={webmention.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f7a5a5] transition-colors"
                >
                  {webmention.source.title ||
                    new URL(webmention.source.url).hostname}
                </a>
                <ExternalLink size={10} />
              </div>
              <div className="text-xs">
                Published: {formatDate(webmention.source.publishedAt)}
              </div>
            </div>

            {/* Target Info */}
            <div className="text-xs text-[#f7a5a5]/50 mb-3">
              → On your post: "{webmention.target.post.title}"
            </div>
          </div>
        </div>

        <div className="text-xs text-[#f7a5a5]/50">
          Received {formatDate(webmention.receivedAt)}
          {webmention.verifiedAt && (
            <div>Verified {formatDate(webmention.verifiedAt)}</div>
          )}
        </div>
      </div>

      {/* Content */}
      {webmention.source.content && (
        <div className="mb-4 ml-7">
          <div className="bg-white/2 rounded-lg p-4 border border-[#f7a5a5]/10">
            <div className="text-[#f7a5a5]/90 leading-relaxed">
              {showFullContent || webmention.source.content.length <= 200
                ? webmention.source.content
                : truncateContent(webmention.source.content)}
            </div>

            {webmention.source.content.length > 200 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="mt-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] text-sm flex items-center gap-1 transition-colors"
                suppressHydrationWarning={true}
              >
                {showFullContent ? (
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
        </div>
      )}

      {/* Validation Errors */}
      {!webmention.isValid && webmention.validationErrors && (
        <div className="mb-4 ml-7">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 transition-colors mb-2"
            suppressHydrationWarning={true}
          >
            <Eye size={14} />
            Validation Issues ({webmention.validationErrors.length})
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDetails && (
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <ul className="space-y-1 text-sm text-red-400">
                {webmention.validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Microformat Properties */}
      {Object.keys(webmention.properties).length > 0 && (
        <div className="mb-4 ml-7">
          <div className="text-xs text-[#f7a5a5]/50 mb-1">
            Microformat Properties:
          </div>
          <div className="bg-white/2 rounded p-2 text-xs text-[#f7a5a5]/70">
            {Object.entries(webmention.properties).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-mono">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-7">
        <button
          onClick={() => onWebmentionStatusChange(webmention.id, "approved")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            webmention.status === "approved"
              ? "bg-green-400/20 text-green-400"
              : "bg-green-400/10 text-green-400/70 hover:text-green-400 hover:bg-green-400/20"
          }`}
          disabled={webmention.status === "approved"}
          suppressHydrationWarning={true}
        >
          <Check size={12} className="inline mr-1" />
          Approve
        </button>

        <button
          onClick={() => onWebmentionStatusChange(webmention.id, "rejected")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            webmention.status === "rejected"
              ? "bg-gray-400/20 text-gray-400"
              : "bg-gray-400/10 text-gray-400/70 hover:text-gray-400 hover:bg-gray-400/20"
          }`}
          disabled={webmention.status === "rejected"}
          suppressHydrationWarning={true}
        >
          <X size={12} className="inline mr-1" />
          Reject
        </button>

        <button
          onClick={() => onWebmentionStatusChange(webmention.id, "spam")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            webmention.status === "spam"
              ? "bg-red-400/20 text-red-400"
              : "bg-red-400/10 text-red-400/70 hover:text-red-400 hover:bg-red-400/20"
          }`}
          disabled={webmention.status === "spam"}
          suppressHydrationWarning={true}
        >
          <Shield size={12} className="inline mr-1" />
          Spam
        </button>

        <button
          onClick={() => onWebmentionDelete(webmention.id)}
          className="px-3 py-1 rounded text-xs bg-red-600/10 text-red-500/70 hover:text-red-500 hover:bg-red-600/20 transition-colors ml-2"
          suppressHydrationWarning={true}
        >
          <Trash2 size={12} className="inline mr-1" />
          Delete
        </button>

        {/* Visit Source Button */}
        <a
          href={webmention.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded text-xs bg-[#f7a5a5]/10 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/20 transition-colors ml-2"
        >
          <ExternalLink size={12} className="inline mr-1" />
          Visit Source
        </a>
      </div>
    </div>
  );
};

export default WebmentionCard;
