"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Toggle from "@/components/common/Toggle";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: GroupFormData) => void;
  group?: {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
  } | null;
  mode: "create" | "edit";
}

export interface GroupFormData {
  name: string;
  description?: string;
  permissions: string[];
}

// All available permissions
const ALL_PERMISSIONS = [
  "add_comments",
  "add_comments_private",
  "add_drafts",
  "add_groups",
  "add_pages",
  "add_posts",
  "add_uploads",
  "add_users",
  "change_settings",
  "use_html_comments",
  "delete_comments",
  "delete_drafts",
  "delete_groups",
  "delete_own_comments",
  "delete_own_drafts",
  "delete_own_posts",
  "delete_pages",
  "delete_webmentions",
  "delete_posts",
  "delete_uploads",
  "delete_users",
  "edit_comments",
  "edit_drafts",
  "edit_groups",
  "edit_own_comments",
  "edit_own_drafts",
  "edit_own_posts",
  "edit_pages",
  "edit_webmentions",
  "edit_posts",
  "edit_uploads",
  "edit_users",
  "export_content",
  "import_content",
  "like_posts",
  "manage_categories",
  "toggle_extensions",
  "unlike_posts",
  "view_drafts",
  "view_own_drafts",
  "view_pages",
  "view_private_posts",
  "view_scheduled_posts",
  "view_site",
  "view_uploads",
];

// Permission display names
const PERMISSION_LABELS: Record<string, string> = {
  add_comments: "Add Comments",
  add_comments_private: "Add Comments to Private Posts",
  add_drafts: "Add Drafts",
  add_groups: "Add Groups",
  add_pages: "Add Pages",
  add_posts: "Add Posts",
  add_uploads: "Add Uploads",
  add_users: "Add Users",
  change_settings: "Change Settings",
  use_html_comments: "Use HTML in Comments",
  delete_comments: "Delete Comments",
  delete_drafts: "Delete Drafts",
  delete_groups: "Delete Groups",
  delete_own_comments: "Delete Own Comments",
  delete_own_drafts: "Delete Own Drafts",
  delete_own_posts: "Delete Own Posts",
  delete_pages: "Delete Pages",
  delete_webmentions: "Delete Webmentions",
  delete_posts: "Delete Posts",
  delete_uploads: "Delete Uploads",
  delete_users: "Delete Users",
  edit_comments: "Edit Comments",
  edit_drafts: "Edit Drafts",
  edit_groups: "Edit Groups",
  edit_own_comments: "Edit Own Comments",
  edit_own_drafts: "Edit Own Drafts",
  edit_own_posts: "Edit Own Posts",
  edit_pages: "Edit Pages",
  edit_webmentions: "Edit Webmentions",
  edit_posts: "Edit Posts",
  edit_uploads: "Edit Uploads",
  edit_users: "Edit Users",
  export_content: "Export Content",
  import_content: "Import Content",
  like_posts: "Like Posts",
  manage_categories: "Manage Categories",
  toggle_extensions: "Toggle Extensions",
  unlike_posts: "Unlike Posts",
  view_drafts: "View Drafts",
  view_own_drafts: "View Own Drafts",
  view_pages: "View Pages",
  view_private_posts: "View Private Posts",
  view_scheduled_posts: "View Scheduled Posts",
  view_site: "View Site",
  view_uploads: "View Uploads",
};

const GroupModal = ({
  isOpen,
  onClose,
  onSave,
  group,
  mode,
}: GroupModalProps) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    description: "",
    permissions: [],
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (mode === "edit" && group) {
      setFormData({
        name: group.name,
        description: group.description || "",
        permissions: group.permissions,
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        permissions: [],
      });
    }
    setErrors({});
  }, [mode, group, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Group name is required";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleToggleAll = () => {
    const allSelected = formData.permissions.length === ALL_PERMISSIONS.length;
    setFormData((prev) => ({
      ...prev,
      permissions: allSelected ? [] : [...ALL_PERMISSIONS],
    }));
  };

  const isSystemGroup = (name: string) => {
    return ["admin", "member", "friend", "banned", "guest"].includes(
      name.toLowerCase()
    );
  };

  if (!isOpen) return null;

  const allToggled = formData.permissions.length === ALL_PERMISSIONS.length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-[#f7a5a5]/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-[#f7a5a5]/20 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#f7a5a5]">
            {mode === "create" ? "New Group" : "Edit Group"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Group Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#f7a5a5] mb-1"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={mode === "edit" && isSystemGroup(formData.name)}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter group name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
            {mode === "edit" && isSystemGroup(formData.name) && (
              <p className="text-yellow-400 text-xs mt-1">
                System group names cannot be changed
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#f7a5a5] mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 resize-none"
              placeholder="Enter group description (optional)"
            />
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-[#f7a5a5]">
                Permissions
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#f7a5a5]/70">Toggle All</span>
                <Toggle
                  checked={allToggled}
                  onChange={handleToggleAll}
                  size="sm"
                  variant="primary"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid gap-3">
                {ALL_PERMISSIONS.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between py-2 border-b border-[#f7a5a5]/10 last:border-b-0"
                  >
                    <span className="text-sm text-white">
                      {PERMISSION_LABELS[permission]}
                    </span>
                    <Toggle
                      checked={formData.permissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                      size="sm"
                      variant="primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 text-xs text-[#f7a5a5]/60">
              {formData.permissions.length} of {ALL_PERMISSIONS.length}{" "}
              permissions selected
            </div>
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
              {mode === "create" ? "Create Group" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
