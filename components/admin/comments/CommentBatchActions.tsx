"use client";

import React from "react";
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
    <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4 sticky top-20 z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckSquare className="text-[#f7a5a5]" size={20} />
          <span className="text-[#f7a5a5] font-medium">
            {selectedCount} comment{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#f7a5a5]/70 text-sm mr-4">Batch Actions:</span>

          <button
            onClick={() => onBatchAction("approve", selectedCommentIds)}
            className="px-3 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm flex items-center gap-2"
            suppressHydrationWarning={true}
          >
            <Check size={14} />
            Approve All
          </button>

          <button
            onClick={() => onBatchAction("reject", selectedCommentIds)}
            className="px-3 py-2 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20 transition-colors text-sm flex items-center gap-2"
            suppressHydrationWarning={true}
          >
            <X size={14} />
            Reject All
          </button>

          <button
            onClick={() => onBatchAction("spam", selectedCommentIds)}
            className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm flex items-center gap-2"
            suppressHydrationWarning={true}
          >
            <Shield size={14} />
            Mark as Spam
          </button>

          <button
            onClick={() => onBatchAction("delete", selectedCommentIds)}
            className="px-3 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-colors text-sm flex items-center gap-2"
            suppressHydrationWarning={true}
          >
            <Trash2 size={14} />
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentBatchActions;
