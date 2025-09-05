"use client";

import React, { useState, useEffect } from "react";
import UserCard from "@/components/admin/users/UserCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import UserModal, { UserFormData } from "@/components/admin/users/UserModal";
import { adminAPI, ApiError } from "@/lib/api";

type UserRole = "admin" | "friend" | "banned" | "guest" | "member";
interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: Date | null;
  createdAt: Date;
  role: UserRole;
  username?: string;
  fullName?: string;
  website?: string;
  stats: {
    comments: number;
    likedPosts: number;
    posts: number;
  };
}

// Helper to map API user to local User type
function mapApiUser(apiUser: any): User {
  return {
    id: apiUser.id,
    name: apiUser.name || apiUser.fullName || apiUser.username, // Use fallback logic for name
    email: apiUser.email,
    lastLogin: apiUser.lastLogin ? new Date(apiUser.lastLogin) : null,
    createdAt: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date(),
    role: apiUser.role as UserRole, // Just cast it directly - API should return valid role
    username: apiUser.username,
    fullName: apiUser.fullName,
    website: apiUser.website,
    stats: apiUser.stats || { comments: 0, likedPosts: 0, posts: 0 },
  };
}

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async (search: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await adminAPI.getUsers(params);
      setUsers((response.data || []).map(mapApiUser));
    } catch (err: any) {
      setError(err?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    setError(null);
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      setError(err?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleViewData = (id: string) => {
    // Implement view user data if needed
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await fetchUsers(query);
  };

  const handleNew = () => {
    setSelectedUser(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserSave = async (userData: UserFormData) => {
    setLoading(true);
    setError(null);
    try {
      // Transform UserFormData to API format
      const apiUserData = {
        username: userData.username,
        email: userData.email,
        name: userData.fullName || userData.username, // Include name field
        role: userData.group.toLowerCase(), // Convert "Admin" -> "admin", "Member" -> "member", etc.
        fullName: userData.fullName,
        website: userData.website,
        // Only include password for create operations or when password is provided
        ...(modalMode === "create" || userData.password
          ? { password: userData.password }
          : {}),
      };

      if (modalMode === "create") {
        const created = await adminAPI.createUser(apiUserData);
        setUsers((prev) => [...prev, mapApiUser(created)]);
      } else if (modalMode === "edit" && selectedUser) {
        const updated = await adminAPI.updateUser(selectedUser.id, apiUserData);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id ? mapApiUser(updated) : user
          )
        );
      }
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err?.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader title="User" onSearch={handleSearch} onNew={handleNew} />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-center text-muted">Loading users...</div>
        )}
        <div className="grid gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewData={handleViewData}
            />
          ))}

          {!loading && users.length === 0 && (
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

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleUserSave}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
};

export default UsersPage;
