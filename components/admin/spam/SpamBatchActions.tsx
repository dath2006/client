"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Check, Trash2, CheckSquare, X } from "lucide-react";

interface SpamBatchActionsProps {
  selectedCount: number;
  onBatchAction: (
    action: "approve" | "reject" | "delete",
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
    <motion.div
      className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4 sticky top-20 z-10 backdrop-blur-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      layout // Ensures smooth resizing if content wraps
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="text-[#f7a5a5]" size={20} />
          <span className="text-[#f7a5a5] font-medium">
            {selectedCount} spam item{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#f7a5a5]/70 text-sm mr-4">Batch Actions:</span>

          <motion.button
            onClick={() => onBatchAction("reject", selectedSpamIds)}
            className="px-3 py-2 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20 text-sm flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            suppressHydrationWarning={true}
          >
            <X size={14} />
            Reject All
          </motion.button>

          <motion.button
            onClick={() => onBatchAction("approve", selectedSpamIds)}
            className="px-3 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 text-sm flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            suppressHydrationWarning={true}
          >
            <Check size={14} />
            Approve All
          </motion.button>

          <motion.button
            onClick={() => onBatchAction("delete", selectedSpamIds)}
            className="px-3 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 text-sm flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            suppressHydrationWarning={true}
          >
            <Trash2 size={14} />
            Delete All
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SpamBatchActions;