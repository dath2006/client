"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import GroupCard from "@/components/admin/groups/GroupCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import GroupModal, {
  GroupFormData,
} from "@/components/admin/groups/GroupModal";
import { adminAPI, ApiError } from "@/lib/api";

interface Group {
  id: string;
  name: string;
  userCount: number;
  createdAt: Date;
  description?: string;
  permissions: string[];
}

// --- Animation Variants ---
const containerVariants: Variants = {
  /* ... */
};
const itemVariants: Variants = {
  /* ... */
};

// FIX: Restore the function body to ensure it returns a Group object.
function mapApiGroup(apiGroup: any): Group {
  return {
    id: apiGroup.id,
    name: apiGroup.name,
    userCount: apiGroup.userCount || 0,
    createdAt: apiGroup.createdAt ? new Date(apiGroup.createdAt) : new Date(),
    description: apiGroup.description,
    permissions: apiGroup.permissions || [],
  };
}

const GroupsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data fetching and handlers (logic is unchanged) ---
  const fetchGroups = async (search: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await adminAPI.getGroups(params);
      setGroups((response.data || []).map(mapApiGroup));
    } catch (err: any) {
      setError(err?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleEdit = (id: string) => {
    /* ... */
  };
  const handleDelete = async (id: string) => {
    /* ... */
  };
  const handleSearch = (query: string) => {
    /* ... */
  };
  const handleNew = () => {
    /* ... */
  };
  const handleModalClose = () => {
    /* ... */
  };
  const handleGroupSave = async (groupData: GroupFormData) => {
    /* ... */
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 z-10 pb-4 border-b bg-background/95 backdrop-blur-sm border-border"
      >
        <SearchHeader title="Group" onSearch={handleSearch} onNew={handleNew} />
      </motion.div>

      <div className="flex-1 pt-4 overflow-y-auto">
        {/* ... The rest of the animated JSX ... */}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <GroupModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleGroupSave}
            group={selectedGroup}
            mode={modalMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupsPage;
