"use client";

import React, { useState } from "react";
import GroupCard from "@/components/admin/groups/GroupCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import GroupModal, {
  GroupFormData,
} from "@/components/admin/groups/GroupModal";

interface Group {
  id: string;
  name: string;
  userCount: number;
  createdAt: Date;
  description?: string;
  permissions: string[];
}

const GroupsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  // Predefined system groups
  const mockGroups: Group[] = [
    {
      id: "1",
      name: "Admin",
      userCount: 2,
      createdAt: new Date("2024-01-01"),
      description: "Full system access with all administrative privileges",
      permissions: [
        "add_users",
        "delete_users",
        "edit_users",
        "add_groups",
        "delete_groups",
        "edit_groups",
        "change_settings",
        "delete_posts",
        "edit_posts",
        "add_posts",
        "view_private_posts",
        "manage_categories",
        "toggle_extensions",
        "export_content",
        "import_content",
      ],
    },
    {
      id: "2",
      name: "Member",
      userCount: 45,
      createdAt: new Date("2024-01-01"),
      description: "Regular registered users with standard posting privileges",
      permissions: [
        "add_posts",
        "add_comments",
        "like_posts",
        "edit_own_posts",
        "edit_own_comments",
        "delete_own_posts",
        "delete_own_comments",
        "view_site",
        "view_pages",
      ],
    },
    {
      id: "3",
      name: "Friend",
      userCount: 12,
      createdAt: new Date("2024-02-15"),
      description: "Trusted users with additional content access",
      permissions: [
        "add_posts",
        "add_comments",
        "like_posts",
        "unlike_posts",
        "view_private_posts",
        "view_site",
        "view_pages",
        "edit_own_posts",
        "edit_own_comments",
        "delete_own_posts",
        "delete_own_comments",
      ],
    },
    {
      id: "4",
      name: "Banned",
      userCount: 3,
      createdAt: new Date("2024-01-01"),
      description: "Restricted users with limited or no access",
      permissions: ["view_site"],
    },
    {
      id: "5",
      name: "Guest",
      userCount: 0,
      createdAt: new Date("2024-01-01"),
      description: "Anonymous visitors with read-only access",
      permissions: ["view_site", "view_pages"],
    },
  ];

  // Initialize groups with mock data
  React.useEffect(() => {
    setGroups(mockGroups);
  }, []);

  const handleEdit = (id: string) => {
    console.log("Editing group:", id);
    const group = groups.find((g) => g.id === id);
    if (group) {
      setSelectedGroup(group);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
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
      console.log("Deleting group:", id);
      setGroups((prev) => prev.filter((group) => group.id !== id));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  const handleNew = () => {
    console.log("Creating new group");
    setSelectedGroup(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  const handleGroupSave = (groupData: GroupFormData) => {
    if (modalMode === "create") {
      // Create new group
      const newGroup: Group = {
        id: Date.now().toString(),
        name: groupData.name,
        userCount: 0,
        createdAt: new Date(),
        description: groupData.description,
        permissions: groupData.permissions,
      };
      setGroups((prev) => [...prev, newGroup]);
    } else if (modalMode === "edit" && selectedGroup) {
      // Update existing group
      setGroups((prev) =>
        prev.map((group) =>
          group.id === selectedGroup.id
            ? {
                ...group,
                name: groupData.name,
                description: groupData.description,
                permissions: groupData.permissions,
              }
            : group
        )
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader title="Group" onSearch={handleSearch} onNew={handleNew} />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="grid gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {groups.length === 0 && (
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
