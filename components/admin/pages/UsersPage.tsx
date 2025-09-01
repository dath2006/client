"use client";

import React, { useState } from "react";
import UserCard from "@/components/admin/users/UserCard";
import SearchHeader from "@/components/admin/common/SearchHeader";

interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: Date | null;
  createdAt: Date;
  role: "admin" | "editor" | "contributor" | "member";
  stats: {
    comments: number;
    likedPosts: number;
    posts: number;
  };
}

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for users
  const mockUsers: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      lastLogin: new Date("2024-12-23T10:30:00"),
      createdAt: new Date("2024-01-15"),
      role: "admin",
      stats: {
        comments: 45,
        likedPosts: 123,
        posts: 12,
      },
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      lastLogin: new Date("2024-12-22T15:45:00"),
      createdAt: new Date("2024-03-20"),
      role: "editor",
      stats: {
        comments: 89,
        likedPosts: 267,
        posts: 24,
      },
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      lastLogin: new Date("2024-12-20T09:15:00"),
      createdAt: new Date("2024-06-10"),
      role: "contributor",
      stats: {
        comments: 23,
        likedPosts: 89,
        posts: 8,
      },
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      lastLogin: new Date("2024-12-21T14:20:00"),
      createdAt: new Date("2024-08-05"),
      role: "member",
      stats: {
        comments: 12,
        likedPosts: 34,
        posts: 3,
      },
    },
    {
      id: "5",
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      lastLogin: null,
      createdAt: new Date("2024-12-01"),
      role: "member",
      stats: {
        comments: 0,
        likedPosts: 2,
        posts: 0,
      },
    },
  ];

  const handleEdit = (id: string) => {
    console.log("Editing user:", id);
    // Add edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Deleting user:", id);
    // Add delete logic here
  };

  const handleViewData = (id: string) => {
    console.log("Viewing user data:", id);
    // Add view user data logic here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  const handleNew = () => {
    console.log("Creating new user");
    // Add new user creation logic here
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader title="User" onSearch={handleSearch} onNew={handleNew} />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="grid gap-4">
          {mockUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewData={handleViewData}
            />
          ))}

          {mockUsers.length === 0 && (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No users found
              </h3>
              <p className="text-[#f7a5a5]/70 mb-4">
                Get started by creating your first user account.
              </p>
              <button
                onClick={handleNew}
                className="bg-[#f7a5a5] text-white px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
              >
                Create User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
