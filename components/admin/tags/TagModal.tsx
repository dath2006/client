"use client";

import React, { useState, useEffect } from "react";
import { X, Hash, Search, Check, Plus } from "lucide-react";
import Toggle from "@/components/common/Toggle";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tagData: TagFormData) => void;
  tag?: {
    id: string;
    name: string;
    createdAt: Date;
    postCount: number;
    posts: Array<{
      id: string;
      title: string;
      createdAt: Date;
    }>;
    color?: string;
  } | null;
  mode: "create" | "edit" | "view";
  allPosts: Post[];
}

interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  tags?: string[]; // Array of tag IDs
  status?: "published" | "draft" | "scheduled";
}

export interface TagFormData {
  name: string;
  selectedPostIds: string[];
  color?: string;
}

const TagModal = ({
  isOpen,
  onClose,
  onSave,
  tag,
  mode,
  allPosts,
}: TagModalProps) => {
  const [formData, setFormData] = useState<TagFormData>({
    name: "",
    selectedPostIds: [],
    color: "",
  });

  const [errors, setErrors] = useState<{ name?: string; posts?: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllPosts, setShowAllPosts] = useState(false);

  useEffect(() => {
    if (mode === "edit" && tag) {
      setFormData({
        name: tag.name,
        selectedPostIds: tag.posts.map((p) => p.id),
        color: tag.color || "",
      });
    } else if (mode === "view" && tag) {
      setFormData({
        name: tag.name,
        selectedPostIds: tag.posts.map((p) => p.id),
        color: tag.color || "",
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        selectedPostIds: [],
        color: "",
      });
    }
    setErrors({});
    setSearchQuery("");
    setShowAllPosts(false);
  }, [mode, tag, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; posts?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tag name is required";
    }

    if (mode === "create" && formData.selectedPostIds.length === 0) {
      newErrors.posts = "At least one post must be selected for new tags";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePostToggle = (postId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPostIds: prev.selectedPostIds.includes(postId)
        ? prev.selectedPostIds.filter((id) => id !== postId)
        : [...prev.selectedPostIds, postId],
    }));

    // Clear posts error when user selects a post
    if (errors.posts) {
      setErrors((prev) => ({ ...prev, posts: undefined }));
    }
  };

  const handleSelectAllPosts = () => {
    const currentlyFilteredPosts = getFilteredPosts();
    const allCurrentIds = currentlyFilteredPosts.map((p) => p.id);
    const allSelected = allCurrentIds.every((id) =>
      formData.selectedPostIds.includes(id)
    );

    if (allSelected) {
      // Deselect all current filtered posts
      setFormData((prev) => ({
        ...prev,
        selectedPostIds: prev.selectedPostIds.filter(
          (id) => !allCurrentIds.includes(id)
        ),
      }));
    } else {
      // Select all current filtered posts
      const newSelectedIds = [
        ...new Set([...formData.selectedPostIds, ...allCurrentIds]),
      ];
      setFormData((prev) => ({
        ...prev,
        selectedPostIds: newSelectedIds,
      }));
    }
  };

  const getFilteredPosts = () => {
    let posts = allPosts;

    // Filter by search query
    if (searchQuery) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // If in view/edit mode and not showing all posts, show only posts with this tag
    if ((mode === "view" || mode === "edit") && !showAllPosts && tag) {
      posts = posts.filter((post) =>
        tag.posts.some((tagPost) => tagPost.id === post.id)
      );
    }

    return posts;
  };

  const getTagColor = (name: string) => {
    const colors = [
      "bg-blue-400/10 text-blue-400",
      "bg-green-400/10 text-green-400",
      "bg-purple-400/10 text-purple-400",
      "bg-pink-400/10 text-pink-400",
      "bg-yellow-400/10 text-yellow-400",
      "bg-indigo-400/10 text-indigo-400",
      "bg-red-400/10 text-red-400",
    ];
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  if (!isOpen) return null;

  const filteredPosts = getFilteredPosts();
  const selectedCount = formData.selectedPostIds.length;
  const totalPosts = allPosts.length;

  const currentFilteredIds = filteredPosts.map((p) => p.id);
  const allCurrentSelected =
    currentFilteredIds.length > 0 &&
    currentFilteredIds.every((id) => formData.selectedPostIds.includes(id));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-[#f7a5a5]/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gray-900 border-b border-[#f7a5a5]/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash size={20} className="text-[#f7a5a5]" />
            <h2 className="text-lg font-semibold text-[#f7a5a5]">
              {mode === "create"
                ? "Create New Tag"
                : mode === "edit"
                ? "Edit Tag"
                : "View Tag"}
            </h2>
            {tag && mode !== "create" && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(
                  tag.name
                )}`}
              >
                {tag.postCount} {tag.postCount === 1 ? "post" : "posts"}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="p-4 space-y-4">
            {/* Tag Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#f7a5a5] mb-1"
              >
                Tag Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={mode === "view"}
                className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter tag name"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Post Selection Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-medium text-[#f7a5a5]">
                  {mode === "create" ? "Select Posts *" : "Tagged Posts"}
                </h3>
                {selectedCount > 0 && (
                  <span className="text-xs text-[#f7a5a5]/70 bg-[#f7a5a5]/10 px-2 py-1 rounded">
                    {selectedCount} selected
                  </span>
                )}
              </div>

              {mode !== "view" && (
                <div className="flex items-center gap-3">
                  {mode !== "create" && (
                    <button
                      type="button"
                      onClick={() => setShowAllPosts(!showAllPosts)}
                      className="text-xs text-[#f7a5a5]/70 hover:text-[#f7a5a5] flex items-center gap-1"
                    >
                      <Plus size={14} />
                      {showAllPosts ? "Show Tagged Only" : "Show All Posts"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSelectAllPosts}
                    className="text-xs text-[#f7a5a5]/70 hover:text-[#f7a5a5] flex items-center gap-1"
                  >
                    <Check size={14} />
                    {allCurrentSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
              )}
            </div>

            {errors.posts && (
              <p className="text-red-400 text-xs">{errors.posts}</p>
            )}

            {/* Search Posts */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f7a5a5]/70"
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Posts List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg max-h-80 overflow-y-auto">
              {filteredPosts.length > 0 ? (
                <div className="divide-y divide-[#f7a5a5]/10">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#f7a5a5]/70">
                            by {post.author.name}
                          </span>
                          <span className="text-xs text-[#f7a5a5]/50">•</span>
                          <span className="text-xs text-[#f7a5a5]/70">
                            {post.createdAt.toLocaleDateString()}
                          </span>
                          {post.status && (
                            <>
                              <span className="text-xs text-[#f7a5a5]/50">
                                •
                              </span>
                              <span
                                className={`text-xs px-1 py-0.5 rounded ${
                                  post.status === "published"
                                    ? "bg-green-400/10 text-green-400"
                                    : post.status === "draft"
                                    ? "bg-yellow-400/10 text-yellow-400"
                                    : "bg-blue-400/10 text-blue-400"
                                }`}
                              >
                                {post.status}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {mode !== "view" && (
                        <Toggle
                          checked={formData.selectedPostIds.includes(post.id)}
                          onChange={() => handlePostToggle(post.id)}
                          size="sm"
                          variant="primary"
                        />
                      )}

                      {mode === "view" &&
                        formData.selectedPostIds.includes(post.id) && (
                          <Check size={16} className="text-green-400" />
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-[#f7a5a5]/60">
                  <Hash size={32} className="mx-auto mb-2 opacity-50" />
                  <p>
                    {searchQuery
                      ? "No posts found matching your search."
                      : mode === "create" || showAllPosts
                      ? "No posts available."
                      : "No posts tagged with this tag."}
                  </p>
                </div>
              )}
            </div>

            {filteredPosts.length > 0 && (
              <div className="mt-2 text-xs text-[#f7a5a5]/60 text-center">
                Showing {filteredPosts.length} of {totalPosts} posts
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {mode !== "view" && (
            <div className="border-t border-[#f7a5a5]/20 p-4">
              <div className="flex gap-3">
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
                  {mode === "create" ? "Create Tag" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TagModal;
