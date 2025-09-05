"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
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
} from "lucide-react";

// (Your interfaces and helper functions remain the same)
interface SpamItem {
  id: string;
  type: "comment" | "pingback" | "trackback" | "contact_form";
  author: {
    name: string;
    email: string;
    website?: string;
    ipAddress: string;
  };
  content: string;
  detectedAt: string;
  source?: {
    post?: { id: string; title: string; slug: string; };
    form?: string;
  };
  status: "spam" | "approved" | "rejected";
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
  const [showFullContent, setShowFullContent] = useState(false);
  // ... (All your helper functions: formatDate, getTypeIcon, etc., remain the same)
  const formatDate = (date: string | Date) => { /* ... */ };
  const getTypeIcon = (type: SpamItem["type"]) => { /* ... */ };
  const getTypeLabel = (type: SpamItem["type"]) => { /* ... */ };
  const getStatusColor = (status: SpamItem["status"]) => { /* ... */ };
  const truncateContent = (content: string, maxLength: number = 200): string => {
    if (typeof content !== "string") return "";
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trimEnd() + "…";
  };

  const isSelected = selectedSpamItems.includes(spamItem.id);

  return (
    <motion.div
      layout // This prop animates layout changes (like background color and border)!
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-white/5 rounded-lg border p-6 ${
        isSelected
          ? "border-[#f7a5a5]/50 bg-[#f7a5a5]/5"
          : "border-[#f7a5a5]/20"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        {/* ... (Header content remains the same) ... */}
      </div>

      {/* Content */}
      <div className="mb-4 ml-7">
        <div className="bg-white/2 rounded-lg p-4 border border-[#f7a5a5]/10">
          <AnimatePresence initial={false}>
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="text-[#f7a5a5]/90 leading-relaxed">
                {showFullContent || spamItem.content.length <= 200
                  ? spamItem.content
                  : truncateContent(spamItem.content)}
              </div>
            </motion.div>
          </AnimatePresence>

          {spamItem.content.length > 200 && (
            <motion.button
              onClick={() => setShowFullContent(!showFullContent)}
              className="mt-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] text-sm flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showFullContent ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showFullContent ? "Show less" : "Show more"}
            </motion.button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-7">
        <motion.button
          onClick={() => onSpamStatusChange(spamItem.id, "approved")}
          className={`px-3 py-1 rounded text-xs ...`}
          disabled={spamItem.status === "approved"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Check size={12} className="inline mr-1" />
          Approve
        </motion.button>
        <motion.button
          onClick={() => onSpamStatusChange(spamItem.id, "rejected")}
          className={`px-3 py-1 rounded text-xs ...`}
          disabled={spamItem.status === "rejected"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={12} className="inline mr-1" />
          Reject
        </motion.button>
        <motion.button
          onClick={() => onSpamDelete(spamItem.id)}
          className={`px-3 py-1 rounded text-xs ...`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={12} className="inline mr-1" />
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SpamCard;