"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "friend" | "banned" | "guest" | "member";
    username?: string;
    fullName?: string;
    website?: string;
  } | null;
  mode: "create" | "edit";
}

export interface UserFormData {
  username: string;
  email: string;
  group: "Member" | "Admin" | "Banned" | "Friend";
  password: string;
  confirmPassword: string;
  fullName?: string;
  website?: string;
}

const UserModal = ({ isOpen, onClose, onSave, user, mode }: UserModalProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    group: "Member",
    password: "",
    confirmPassword: "",
    fullName: "",
    website: "",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        username: user.username || user.name,
        email: user.email,
        group:
          user.role === "admin"
            ? "Admin"
            : user.role === "member"
            ? "Member"
            : "Friend",
        password: "",
        confirmPassword: "",
        fullName: user.fullName || user.name,
        website: user.website || "",
      });
    } else if (mode === "create") {
      setFormData({
        username: "",
        email: "",
        group: "Member",
        password: "",
        confirmPassword: "",
        fullName: "",
        website: "",
      });
    }
    setErrors({});
  }, [mode, user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (mode === "create" || formData.password) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = "Invalid website URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-[#f7a5a5]/20 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-[#f7a5a5]/20 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#f7a5a5]">
            {mode === "create" ? "New User" : "Edit User"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#f7a5a5] mb-1"
            >
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#f7a5a5] mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Group */}
          <div>
            <label
              htmlFor="group"
              className="block text-sm font-medium text-[#f7a5a5] mb-1"
            >
              Group *
            </label>
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
              <option value="Banned">Banned</option>
              <option value="Friend">Friend</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#f7a5a5] mb-1"
            >
              Password {mode === "create" && "*"}
              {mode === "edit" && (
                <span className="text-xs text-[#f7a5a5]/60 ml-1">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#f7a5a5] mb-1"
            >
              Confirm Password {mode === "create" && "*"}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Full Name (optional) */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-[#f7a5a5] mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
              placeholder="Enter full name (optional)"
            />
          </div>

          {/* Website (optional) */}
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-[#f7a5a5] mb-1"
            >
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
              placeholder="https://example.com (optional)"
            />
            {errors.website && (
              <p className="text-red-400 text-xs mt-1">{errors.website}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#f7a5a5]/20 text-[#f7a5a5] rounded-lg hover:bg-[#f7a5a5]/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#f7a5a5] text-white rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
            >
              {mode === "create" ? "Create User" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
