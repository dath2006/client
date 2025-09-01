"use client";

import React, { useState } from "react";
import {
  Shield,
  AlertTriangle,
  Check,
  X,
  Trash2,
  User,
  Mail,
  Globe,
  Monitor,
  MessageSquare,
  Link as LinkIcon,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";

interface SpamItem {
  id: string;
  type: "comment" | "pingback" | "trackback" | "contact_form";
  author: {
    name: string;
    email: string;
    website?: string;
    ipAddress: string;
    userAgent?: string;
  };
  content: string;
  detectedAt: Date;
  spamScore: number;
  spamReasons: string[];
  source?: {
    post?: {
      id: string;
      title: string;
      slug: string;
    };
    form?: string;
  };
  status: "detected" | "confirmed" | "false_positive" | "deleted";
}

interface SpamCardProps {
  spamItem: SpamItem;
  onSpamStatusChange: (spamId: string, newStatus: SpamItem["status"]) => void;
  onSpamDelete: (spamId: string) => void;
  onSpamSelect: (spamId: string, selected: boolean) => void;
  selectedSpamItems: string[];
}

const SpamCard = ({
  spamItem,
  onSpamStatusChange,
  onSpamDelete,
  onSpamSelect,
  selectedSpamItems,
}: SpamCardProps) => {
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

  const getTypeIcon = (type: SpamItem["type"]) => {
    switch (type) {
      case "comment":
        return <MessageSquare size={16} />;
      case "pingback":
      case "trackback":
        return <LinkIcon size={16} />;
      case "contact_form":
        return <FileText size={16} />;
      default:
        return <Shield size={16} />;
    }
  };

  const getTypeLabel = (type: SpamItem["type"]) => {
    switch (type) {
      case "comment":
        return "Comment";
      case "pingback":
        return "Pingback";
      case "trackback":
        return "Trackback";
      case "contact_form":
        return "Contact Form";
      default:
        return type;
    }
  };

  const getSpamScoreColor = (score: number) => {
    if (score >= 80) return "text-red-400 bg-red-400/20";
    if (score >= 50) return "text-yellow-400 bg-yellow-400/20";
    return "text-orange-400 bg-orange-400/20";
  };

  const getStatusColor = (status: SpamItem["status"]) => {
    switch (status) {
      case "detected":
        return "text-yellow-400 bg-yellow-400/20";
      case "confirmed":
        return "text-red-400 bg-red-400/20";
      case "false_positive":
        return "text-green-400 bg-green-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const isSelected = selectedSpamItems.includes(spamItem.id);

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
            onChange={(e) => onSpamSelect(spamItem.id, e.target.checked)}
            className="mt-1 w-4 h-4 text-[#f7a5a5] bg-transparent border border-[#f7a5a5]/30 rounded focus:ring-[#f7a5a5] focus:ring-1"
            suppressHydrationWarning={true}
          />

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 text-[#f7a5a5]">
                {getTypeIcon(spamItem.type)}
                <span className="font-medium">
                  {getTypeLabel(spamItem.type)}
                </span>
              </div>

              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getSpamScoreColor(
                  spamItem.spamScore
                )}`}
              >
                <AlertTriangle size={12} />
                {spamItem.spamScore}% spam
              </div>

              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                  spamItem.status
                )}`}
              >
                <span className="capitalize">
                  {spamItem.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 text-sm text-[#f7a5a5]/70 mb-3">
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{spamItem.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={12} />
                <span>{spamItem.author.email}</span>
              </div>
              {spamItem.author.website && (
                <div className="flex items-center gap-1">
                  <Globe size={12} />
                  <a
                    href={spamItem.author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#f7a5a5] transition-colors"
                  >
                    {new URL(spamItem.author.website).hostname}
                  </a>
                </div>
              )}
            </div>

            {/* Source Info */}
            {spamItem.source && (
              <div className="text-xs text-[#f7a5a5]/50 mb-2">
                {spamItem.source.post && (
                  <span>On post: "{spamItem.source.post.title}"</span>
                )}
                {spamItem.source.form && (
                  <span>From: {spamItem.source.form}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-[#f7a5a5]/50">
          {formatDate(spamItem.detectedAt)}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 ml-7">
        <div className="bg-white/2 rounded-lg p-4 border border-[#f7a5a5]/10">
          <div className="text-[#f7a5a5]/90 leading-relaxed">
            {showFullContent || spamItem.content.length <= 200
              ? spamItem.content
              : truncateContent(spamItem.content)}
          </div>

          {spamItem.content.length > 200 && (
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

      {/* Spam Reasons */}
      <div className="mb-4 ml-7">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm text-[#f7a5a5]/70 hover:text-[#f7a5a5] transition-colors mb-2"
          suppressHydrationWarning={true}
        >
          <Eye size={14} />
          Detection Details ({spamItem.spamReasons.length} reasons)
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showDetails && (
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            <ul className="space-y-1 text-sm text-red-400">
              {spamItem.spamReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>

            {/* Technical Details */}
            <div className="mt-3 pt-3 border-t border-red-500/20 text-xs text-red-400/70 space-y-1">
              <div>IP: {spamItem.author.ipAddress}</div>
              {spamItem.author.userAgent && (
                <div className="flex items-start gap-1">
                  <Monitor size={10} className="mt-0.5 flex-shrink-0" />
                  <span className="break-all">{spamItem.author.userAgent}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-7">
        <button
          onClick={() => onSpamStatusChange(spamItem.id, "confirmed")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            spamItem.status === "confirmed"
              ? "bg-red-400/20 text-red-400"
              : "bg-red-400/10 text-red-400/70 hover:text-red-400 hover:bg-red-400/20"
          }`}
          disabled={spamItem.status === "confirmed"}
          suppressHydrationWarning={true}
        >
          <Shield size={12} className="inline mr-1" />
          Confirm Spam
        </button>

        <button
          onClick={() => onSpamStatusChange(spamItem.id, "false_positive")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            spamItem.status === "false_positive"
              ? "bg-green-400/20 text-green-400"
              : "bg-green-400/10 text-green-400/70 hover:text-green-400 hover:bg-green-400/20"
          }`}
          disabled={spamItem.status === "false_positive"}
          suppressHydrationWarning={true}
        >
          <Check size={12} className="inline mr-1" />
          Not Spam
        </button>

        <button
          onClick={() => onSpamDelete(spamItem.id)}
          className="px-3 py-1 rounded text-xs bg-red-600/10 text-red-500/70 hover:text-red-500 hover:bg-red-600/20 transition-colors ml-2"
          suppressHydrationWarning={true}
        >
          <Trash2 size={12} className="inline mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default SpamCard;
