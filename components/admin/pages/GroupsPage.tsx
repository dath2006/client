"use client";

import React, { useState, useEffect } from "react";
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

// Helper to map API group to local Group type
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch groups from API
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
    const group = groups.find((g) => g.id === id);
    if (group) {
      setSelectedGroup(group);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      const isSystem = [
        "admin",
        "member",
        "friend",
        "banned",
        "guest",
      ].includes(group.name.toLowerCase());
      if (isSystem) {
        alert("System groups cannot be deleted.");
        return;
      }

      if (
        !window.confirm(
          `Are you sure you want to delete the group "${group.name}"?`
        )
      )
        return;

      setLoading(true);
      setError(null);
      try {
        await adminAPI.deleteGroup(id);
        setGroups((prev) => prev.filter((group) => group.id !== id));
      } catch (err: any) {
        setError(err?.message || "Failed to delete group");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await fetchGroups(query);
  };

  const handleNew = () => {
    setSelectedGroup(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  const handleGroupSave = async (groupData: GroupFormData) => {
    setLoading(true);
    setError(null);
    try {
      // Transform GroupFormData to API format
      const apiGroupData = {
        name: groupData.name,
        description: groupData.description,
        permissions: groupData.permissions,
      };

      if (modalMode === "create") {
        const created = await adminAPI.createGroup(apiGroupData);
        setGroups((prev) => [...prev, mapApiGroup(created)]);
      } else if (modalMode === "edit" && selectedGroup) {
        const updated = await adminAPI.updateGroup(
          selectedGroup.id,
          apiGroupData
        );
        setGroups((prev) =>
          prev.map((group) =>
            group.id === selectedGroup.id ? mapApiGroup(updated) : group
          )
        );
      }
      setIsModalOpen(false);
      setSelectedGroup(null);
    } catch (err: any) {
      setError(err?.message || "Failed to save group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader title="Group" onSearch={handleSearch} onNew={handleNew} />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-center text-muted">Loading groups...</div>
        )}
        <div className="grid gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {!loading && groups.length === 0 && (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No groups found
              </h3>
              <p className="text-[#f7a5a5]/70 mb-4">
                Get started by creating your first user group.
              </p>
              <button
                onClick={handleNew}
                className="bg-[#f7a5a5] text-white px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
              >
                Create Group
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Group Modal */}
      <GroupModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleGroupSave}
        group={selectedGroup}
        mode={modalMode}
      />
    </div>
  );
};

export default GroupsPage;
