"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import SpamCard from "@/components/admin/spam/SpamCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import SpamBatchActions from "@/components/admin/spam/SpamBatchActions";
import { useSpam } from "@/hooks/useSpam";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: { duration: 0.3 },
  },
};

const fadeVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const SpamPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "spam" | "approved" | "rejected"
  >("all");
  const [selectedSpamItems, setSelectedSpamItems] = useState<string[]>([]);

  const {
    spamItems,
    stats,
    pagination,
    loading,
    error,
    fetchSpamItems,
    updateSpamStatus,
    deleteSpamItem,
    batchAction,
    clearError,
    retry,
  } = useSpam({
    autoFetch: false,
  });

  useEffect(() => {
    const params = {
      page: 1,
      limit: 20,
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery || undefined,
    };
    fetchSpamItems(params);
  }, [statusFilter, searchQuery, fetchSpamItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status as "all" | "spam" | "approved" | "rejected");
  };

  const handleSpamSelect = (spamId: string, isSelected: boolean) => {
    setSelectedSpamItems((prev) =>
      isSelected ? [...prev, spamId] : prev.filter((id) => id !== spamId)
    );
  };

  const handleSpamStatusChange = async (
    spamId: string,
    newStatus: "spam" | "approved" | "rejected"
  ) => {
    try {
      await updateSpamStatus(spamId, newStatus);
      setSelectedSpamItems((prev) => prev.filter((id) => id !== spamId));
    } catch (error) {
      console.error("Failed to update spam status:", error);
    }
  };

  const handleSpamDelete = async (spamId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this spam item? This action cannot be undone."
      )
    ) {
      try {
        await deleteSpamItem(spamId);
        setSelectedSpamItems((prev) => prev.filter((id) => id !== spamId));
      } catch (error) {
        console.error("Failed to delete spam item:", error);
      }
    }
  };

  const handleBatchAction = async (action: "approve" | "reject" | "delete") => {
    if (selectedSpamItems.length === 0) return;

    const actionText = {
      approve: "approve",
      reject: "reject",
      delete: "delete",
    }[action];

    if (
      window.confirm(
        `Are you sure you want to ${actionText} ${selectedSpamItems.length} spam item(s)?`
      )
    ) {
      try {
        await batchAction(action, selectedSpamItems);
        setSelectedSpamItems([]);
      } catch (error) {
        console.error("Failed to perform batch action:", error);
      }
    }
  };

  const getStatusCounts = () => {
    if (!stats) {
      return { all: 0, spam: 0, approved: 0, rejected: 0 };
    }
    return {
      all: stats.total,
      spam: stats.spam,
      approved: stats.approved,
      rejected: stats.rejected,
    };
  };

  const statusCounts = getStatusCounts();

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center bg-[#5d688a]">
        <motion.div
          className="border border-red-300 bg-red-500/10 rounded-lg p-6 max-w-md w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-lg font-medium text-red-300 mb-2">
            Error Loading Spam Items
          </h3>
          <p className="text-red-400 mb-4">{error}</p>
          <div className="flex gap-2">
            <motion.button
              onClick={retry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
            <motion.button
              onClick={clearError}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dismiss
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { key: "all", label: "All", count: statusCounts.all },
    { key: "spam", label: "Spam", count: statusCounts.spam },
    { key: "approved", label: "Approved", count: statusCounts.approved },
    { key: "rejected", label: "Rejected", count: statusCounts.rejected },
  ];

  return (
    <motion.div
      className="flex flex-col h-full bg-[#5d688a] text-[#f7a5a5]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SearchHeader
        title="Spam Management"
        onSearch={handleSearch}
        hideNew={true}
      />

      {/* Stats Cards */}
      <motion.div className="px-6 pb-6" variants={containerVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            variants={itemVariants}
            className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4"
          >
            <div className="text-2xl font-bold text-[#f7a5a5]">
              {statusCounts.all}
            </div>
            <div className="text-sm text-[#f7a5a5]/70">Total Items</div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4"
          >
            <div className="text-2xl font-bold text-red-400">
              {statusCounts.spam}
            </div>
            <div className="text-sm text-[#f7a5a5]/70">Spam</div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4"
          >
            <div className="text-2xl font-bold text-green-400">
              {statusCounts.approved}
            </div>
            <div className="text-sm text-[#f7a5a5]/70">Approved</div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4"
          >
            <div className="text-2xl font-bold text-yellow-400">
              {statusCounts.rejected}
            </div>
            <div className="text-sm text-[#f7a5a5]/70">Rejected</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="border-b border-[#f7a5a5]/20 px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleStatusFilter(tab.key)}
              className={`relative py-4 px-2 font-medium text-sm transition-colors ${
                statusFilter === tab.key
                  ? "text-[#f7a5a5]"
                  : "text-[#f7a5a5]/70 hover:text-[#f7a5a5]"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-[#f7a5a5]/20 text-[#f7a5a5] py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
              {statusFilter === tab.key && (
                <motion.div
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#f7a5a5]"
                  layoutId="active-spam-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Actions */}
      <AnimatePresence>
        {selectedSpamItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
          >
            <SpamBatchActions
              selectedCount={selectedSpamItems.length}
              onBatchAction={handleBatchAction}
              selectedSpamIds={selectedSpamItems}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto pt-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="flex items-center justify-center h-64"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f7a5a5]"></div>
              <span className="ml-2 text-[#f7a5a5]/70">
                Loading spam items...
              </span>
            </motion.div>
          ) : spamItems.length > 0 ? (
            <motion.div
              key="spam-list"
              className="space-y-4 px-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {spamItems.map((spamItem) => (
                  <motion.div
                    key={spamItem.id}
                    variants={itemVariants}
                    exit="exit"
                    layout
                  >
                    <SpamCard
                      spamItem={spamItem}
                      onSpamSelect={handleSpamSelect}
                      onSpamStatusChange={handleSpamStatusChange}
                      onSpamDelete={handleSpamDelete}
                      selectedSpamItems={selectedSpamItems}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="no-items"
              className="px-6"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center mt-4">
                <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                  No spam items found
                </h3>
                <p className="text-[#f7a5a5]/70">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search query or filter settings."
                    : "Spam items will appear here when detected."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <motion.div
          className="p-6 border-t border-[#f7a5a5]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#f7a5a5]/70">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} spam items
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() =>
                  fetchSpamItems({
                    page: pagination.page - 1,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    search: searchQuery || undefined,
                  })
                }
                disabled={pagination.page <= 1}
                className="px-3 py-1 bg-[#f7a5a5]/20 text-[#f7a5a5] rounded hover:bg-[#f7a5a5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: pagination.page > 1 ? 1.05 : 1 }}
                whileTap={{ scale: pagination.page > 1 ? 0.95 : 1 }}
              >
                Previous
              </motion.button>
              <span className="px-3 py-1 text-[#f7a5a5]/70">
                Page {pagination.page} of {pagination.pages}
              </span>
              <motion.button
                onClick={() =>
                  fetchSpamItems({
                    page: pagination.page + 1,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    search: searchQuery || undefined,
                  })
                }
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 bg-[#f7a5a5]/20 text-[#f7a5a5] rounded hover:bg-[#f7a5a5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{
                  scale: pagination.page < pagination.pages ? 1.05 : 1,
                }}
                whileTap={{
                  scale: pagination.page < pagination.pages ? 0.95 : 1,
                }}
              >
                Next
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SpamPage;
