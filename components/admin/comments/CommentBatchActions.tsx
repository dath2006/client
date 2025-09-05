"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, Shield, Trash2, CheckSquare } from "lucide-react";

interface CommentBatchActionsProps {
  selectedCount: number;
  onBatchAction: (
    action: "approve" | "reject" | "spam" | "delete",
    commentIds: string[]
  ) => void;
  selectedCommentIds: string[];
}

const CommentBatchActions = ({
  selectedCount,
  onBatchAction,
  selectedCommentIds,
}: CommentBatchActionsProps) => {
  return (
    <motion.div
      className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4 sticky top-20 z-10 backdrop-blur-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="text-[#f7a5a5]" size={20} />
          <span className="text-[#f7a5a5] font-medium">
            {selectedCount} comment{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#f7a5a5]/70 text-sm mr-2">Quick Actions:</span>

          <motion.button
            onClick={() => onBatchAction("approve", selectedCommentIds)}
            className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 text-sm flex items-center gap-2 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            suppressHydrationWarning={true}
          >
            <Check size={16} />
            Approve
          </motion.button>

          <motion.button
            onClick={() => onBatchAction("reject", selectedCommentIds)}
            className="px-4 py-2 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20 text-sm flex items-center gap-2 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            suppressHydrationWarning={true}
          >
            <X size={16} />
            Reject
          </motion.button>

          <motion.button
            onClick={() => onBatchAction("spam", selectedCommentIds)}
            className="px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 text-sm flex items-center gap-2 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            suppressHydrationWarning={true}
          >
            <Shield size={16} />
            Mark Spam
          </motion.button>

          <div className="w-px h-6 bg-[#f7a5a5]/20"></div>

          <motion.button
            onClick={() => onBatchAction("delete", selectedCommentIds)}
            className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 text-sm flex items-center gap-2 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            suppressHydrationWarning={true}
          >
            <Trash2 size={16} />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentBatchActions;