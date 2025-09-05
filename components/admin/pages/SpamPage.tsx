"use client";

import React, { useState, useEffect } from "react";
import SpamCard from "@/components/admin/spam/SpamCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import SpamBatchActions from "@/components/admin/spam/SpamBatchActions";
import { useSpam } from "@/hooks/useSpam";

const SpamPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "spam" | "approved" | "rejected"
  >("all");
  const [selectedSpamItems, setSelectedSpamItems] = useState<string[]>([]);

  // Use the real API hook
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
    autoFetch: false, // We'll fetch manually with initial params
  });

  // Fetch data on mount and when filters change
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
      // Remove from selection after status change
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
        // Remove from selection after deletion
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
      return {
        all: 0,
        spam: 0,
        approved: 0,
        rejected: 0,
      };
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
      <div className="flex-1 p-6">
        <div className=" border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Spam Items
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={retry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#5d688a] text-[#f7a5a5]">
      {/* Header */}
      <SearchHeader
        title="Spam Management"
        onSearch={handleSearch}
        hideNew={true}
      />

      {/* Stats Cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-[#f7a5a5]">
              {statusCounts.all}
            </div>
            <div className="text-sm text-[#f7a5a5]/70">Total Items</div>
          </div>
          <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">
              {statusCounts.spam}
            </div>
            <div className="text-sm text-[#f7a5a5]/70">Spam</div>
          </div>
          <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {statusCounts.approved}
            </div>
            <div className="text-sm text-[#f7a5a5]/70">Approved</div>
          </div>
          <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {statusCounts.rejected}
            </div>
            <div className="text-sm text-[#f7a5a5]/70">Rejected</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-[#f7a5a5]/20 px-6">
        <div className="flex space-x-8">
          {[
            { key: "all", label: "All", count: statusCounts.all },
            { key: "spam", label: "Spam", count: statusCounts.spam },
            {
              key: "approved",
              label: "Approved",
              count: statusCounts.approved,
            },
            {
              key: "rejected",
              label: "Rejected",
              count: statusCounts.rejected,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleStatusFilter(tab.key)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                statusFilter === tab.key
                  ? "border-[#f7a5a5] text-[#f7a5a5]"
                  : "border-transparent text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:border-[#f7a5a5]/50"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-[#f7a5a5]/20 text-[#f7a5a5] py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Actions */}
      {selectedSpamItems.length > 0 && (
        <SpamBatchActions
          selectedCount={selectedSpamItems.length}
          onBatchAction={handleBatchAction}
          selectedSpamIds={selectedSpamItems}
        />
      )}

      <div className="flex-1 overflow-y-auto pt-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f7a5a5]"></div>
            <span className="ml-2 text-[#f7a5a5]/70">
              Loading spam items...
            </span>
          </div>
        ) : (
          <div className="space-y-4 px-6">
            {spamItems.map((spamItem) => (
              <SpamCard
                key={spamItem.id}
                spamItem={spamItem}
                onSpamSelect={handleSpamSelect}
                onSpamStatusChange={handleSpamStatusChange}
                onSpamDelete={handleSpamDelete}
                selectedSpamItems={selectedSpamItems}
              />
            ))}

            {spamItems.length === 0 && !loading && (
              <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
                <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                  No spam items found
                </h3>
                <p className="text-[#f7a5a5]/70">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search query or filter settings."
                    : "Spam items will appear here when detected."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="p-6 border-t border-[#f7a5a5]/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#f7a5a5]/70">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} spam items
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  fetchSpamItems({
                    page: pagination.page - 1,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    search: searchQuery || undefined,
                  })
                }
                disabled={pagination.page <= 1}
                className="px-3 py-1 bg-[#f7a5a5]/20 text-[#f7a5a5] rounded hover:bg-[#f7a5a5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-[#f7a5a5]/70">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  fetchSpamItems({
                    page: pagination.page + 1,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    search: searchQuery || undefined,
                  })
                }
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 bg-[#f7a5a5]/20 text-[#f7a5a5] rounded hover:bg-[#f7a5a5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpamPage;
