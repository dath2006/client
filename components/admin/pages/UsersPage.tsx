"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import UserCard from "@/components/admin/users/UserCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import UserModal, { UserFormData } from "@/components/admin/users/UserModal";
import { adminAPI } from "@/lib/api";

// --- TYPE DEFINITIONS ---
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
  stats: { comments: number; likedPosts: number; posts: number };
}

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

// --- API DATA MAPPER ---
function mapApiUser(apiUser: any): User {
  return {
    id: apiUser.id,
    name: apiUser.name || apiUser.fullName || apiUser.username,
    email: apiUser.email,
    lastLogin: apiUser.lastLogin ? new Date(apiUser.lastLogin) : null,
    createdAt: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date(),
    role: apiUser.role,
    username: apiUser.username,
    fullName: apiUser.fullName,
    website: apiUser.website,
    stats: apiUser.stats || { comments: 0, likedPosts: 0, posts: 0 },
  };
}

// --- COMPONENT ---
const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (search: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = search ? { search } : {};
      const response = await adminAPI.getUsers(params);
      setUsers((response.data || []).map(mapApiUser));
    } catch (err: any) {
      setError(err?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

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
    try {
      setError(null);
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      setError(err?.message || "Failed to delete user");
    }
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
    setError(null);
    const apiUserData = {
      username: userData.username,
      email: userData.email,
      name: userData.fullName || userData.username,
      role: userData.group.toLowerCase(),
      fullName: userData.fullName,
      website: userData.website,
      ...(modalMode === "create" || userData.password
        ? { password: userData.password }
        : {}),
    };

    try {
      if (modalMode === "create") {
        const created = await adminAPI.createUser(apiUserData);
        setUsers((prev) => [mapApiUser(created), ...prev]);
      } else if (modalMode === "edit" && selectedUser) {
        const updated = await adminAPI.updateUser(selectedUser.id, apiUserData);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id ? mapApiUser(updated) : user
          )
        );
      }
      handleModalClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save user");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#5d688a] text-[#f7a5a5]">
      <div className="sticky top-0 z-10 bg-[#5d688a]/95 backdrop-blur-sm border-b border-[#f7a5a5]/20 pb-4">
        <SearchHeader title="User" onSearch={handleSearch} onNew={handleNew} />
      </div>

      <div className="flex-1 overflow-y-auto pt-4 px-4">
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[#f7a5a5]/70 py-10"
            >
              Loading users...
            </motion.div>
          ) : users.length > 0 ? (
            <motion.div
              key="user-list"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {users.map((user) => (
                  <motion.div
                    key={user.id}
                    layout
                    variants={itemVariants}
                    exit="exit"
                  >
                    <UserCard
                      user={user}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewData={() => {}}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center mt-10"
            >
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No users found
              </h3>
              <p className="text-[#f7a5a5]/70 mb-4">
                Get started by creating your first user account.
              </p>
              <motion.button
                onClick={handleNew}
                className="bg-[#f7a5a5] text-[#5d688a] font-bold px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create User
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <UserModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleUserSave}
            user={selectedUser}
            mode={modalMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersPage;
