"use client";

import React from "react";
import { Shield, Check, Trash2, CheckSquare } from "lucide-react";

interface SpamBatchActionsProps {
  selectedCount: number;
  onBatchAction: (
    action: "confirm" | "false_positive" | "delete",
    spamIds: string[]
  ) => void;
  selectedSpamIds: string[];
}

const SpamBatchActions = ({
  selectedCount,
  onBatchAction,
  selectedSpamIds,
}: SpamBatchActionsProps) => {
  return (
    <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4 sticky top-20 z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckSquare className="text-[#f7a5a5]" size={20} />
          <span className="text-[#f7a5a5] font-medium">
            {selectedCount} spam item{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#f7a5a5]/70 text-sm mr-4">Batch Actions:</span>

          <button
            onClick={() => onBatchAction("confirm", selectedSpamIds)}
            className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm flex items-center gap-2"
            suppressHydrationWarning={true}
          >
            <Shield size={14} />
            Confirm as Spam
          </button>

          <button
            onClick={() => onBatchAction("false_positive", selectedSpamIds)}
            className="px-3 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm flex items-center gap-2"
            suppressHydrationWarning={true}
          >
            <Check size={14} />
            Mark as Not Spam
          </button>

          <button
            onClick={() => onBatchAction("delete", selectedSpamIds)}
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

export default SpamBatchActions;
