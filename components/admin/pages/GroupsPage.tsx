"use client";

import React, { useState } from "react";
import GroupCard from "@/components/admin/groups/GroupCard";
import SearchHeader from "@/components/admin/common/SearchHeader";

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

  // Predefined system groups
  const mockGroups: Group[] = [
    {
      id: "1",
      name: "Admin",
      userCount: 2,
      createdAt: new Date("2024-01-01"),
      description: "Full system access with all administrative privileges",
      permissions: [
        "manage_users",
        "manage_content",
        "system_settings",
        "delete_posts",
        "manage_groups",
      ],
    },
    {
      id: "2",
      name: "Member",
      userCount: 45,
      createdAt: new Date("2024-01-01"),
      description: "Regular registered users with standard posting privileges",
      permissions: ["create_posts", "comment", "like_posts", "edit_profile"],
    },
    {
      id: "3",
      name: "Friend",
      userCount: 12,
      createdAt: new Date("2024-02-15"),
      description: "Trusted users with additional content access",
      permissions: [
        "create_posts",
        "comment",
        "like_posts",
        "access_private",
        "share_content",
      ],
    },
    {
      id: "4",
      name: "Banned",
      userCount: 3,
      createdAt: new Date("2024-01-01"),
      description: "Restricted users with limited or no access",
      permissions: ["view_public"],
    },
    {
      id: "5",
      name: "Guest",
      userCount: 0,
      createdAt: new Date("2024-01-01"),
      description: "Anonymous visitors with read-only access",
      permissions: ["view_public", "search"],
    },
  ];

  const handleEdit = (id: string) => {
    console.log("Editing group:", id);
    // Add edit logic here
  };

  const handleDelete = (id: string) => {
    const group = mockGroups.find((g) => g.id === id);
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
      // Add delete logic here
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  const handleNew = () => {
    console.log("Creating new group");
    // Add new group creation logic here
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader title="Group" onSearch={handleSearch} onNew={handleNew} />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="grid gap-4">
          {mockGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {mockGroups.length === 0 && (
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
    </div>
  );
};

export default GroupsPage;
