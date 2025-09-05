"use client";

import React, { useState, useEffect } from "react";
import TagCard from "@/components/admin/tags/TagCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import TagModal, { TagFormData } from "@/components/admin/tags/TagModal";
import { adminAPI, ApiError } from "@/lib/api";

interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  postCount: number;
  posts: Array<{
    id: string;
    title: string;
    createdAt: Date;
  }>;
}

interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  tags?: string[];
  status?: "published" | "draft";
}

// Helper to map API tag to local Tag type
function mapApiTag(apiTag: any): Tag {
  return {
    id: apiTag.id,
    name: apiTag.name,
    createdAt: apiTag.createdAt ? new Date(apiTag.createdAt) : new Date(),
    postCount: apiTag.postCount || 0,
    posts: (apiTag.posts || []).map((post: any) => ({
      id: post.id,
      title: post.title,
      createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
    })),
  };
}

// Helper to map API post to local Post type
function mapApiPost(apiPost: any): Post {
  return {
    id: apiPost.id,
    title: apiPost.title,
    author: {
      name: apiPost.author?.name || "Unknown",
      avatar: apiPost.author?.avatar,
    },
    createdAt: apiPost.createdAt ? new Date(apiPost.createdAt) : new Date(),
    tags: apiPost.tags || [],
    status: apiPost.status || "published",
  };
}

const TagsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tags from API
  const fetchTags = async (search: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (search) params.search = search;
      const response = await adminAPI.getTags(params);
      setTags((response.data || []).map(mapApiTag));
    } catch (err: any) {
      setError(err?.message || "Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all posts for tag management
  const fetchPosts = async () => {
    try {
      const response = await adminAPI.getAllPosts();
      setPosts((response.data || []).map(mapApiPost));
    } catch (err: any) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchPosts();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchTags(searchQuery);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Handle tag save (create or edit)
  const handleTagSave = async (tagData: { name: string }) => {
    try {
      setError(null);
      if (modalMode === "create") {
        const response = await adminAPI.createTag(tagData);
        const newTag = mapApiTag(response);
        setTags((prev) => [newTag, ...prev]);
      } else if (modalMode === "edit" && selectedTag) {
        const response = await adminAPI.updateTag(selectedTag.id, tagData);
        const updatedTag = mapApiTag(response);
        setTags((prev) =>
          prev.map((tag) => (tag.id === selectedTag.id ? updatedTag : tag))
        );
      }
      setIsModalOpen(false);
      setSelectedTag(null);
    } catch (err: any) {
      setError(err?.message || "Failed to save tag");
    }
  };

  // Handle tag deletion
  const handleDeleteTag = async (tagId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this tag? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setError(null);
      await adminAPI.deleteTag(tagId);
      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
    } catch (err: any) {
      setError(err?.message || "Failed to delete tag");
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedTag(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tag: Tag) => {
    setModalMode("edit");
    setSelectedTag(tag);
    setIsModalOpen(true);
  };

  const openViewModal = (tag: Tag) => {
    setModalMode("view");
    setSelectedTag(tag);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTag(null);
    setError(null);
  };

  // Additional handlers for UI components
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNew = () => {
    openCreateModal();
  };

  const handleEdit = (id: string) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) {
      openEditModal(tag);
    }
  };

  const handleDelete = (id: string) => {
    handleDeleteTag(id);
  };

  const handleView = (id: string) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) {
      openViewModal(tag);
    }
  };

  const handleModalClose = () => {
    closeModal();
  };

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.posts.some((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader title="Tag" onSearch={handleSearch} onNew={handleNew} />
      </div>

      <div className="flex-1 overflow-y-auto pt-4">
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-center text-muted">Loading tags...</div>
        )}
        <div className="space-y-2">
          {filteredTags.length > 0
            ? filteredTags.map((tag) => (
                <TagCard
                  key={tag.id}
                  tag={tag}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))
            : !loading && (
                <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
                  <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                    No tags found
                  </h3>
                  <p className="text-[#f7a5a5]/70 mb-4">
                    {searchQuery
                      ? "Try adjusting your search criteria."
                      : "Get started by creating your first tag."}
                  </p>
                  <button
                    onClick={handleNew}
                    className="bg-[#f7a5a5] text-white px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
                  >
                    Create Tag
                  </button>
                </div>
              )}
        </div>

        {filteredTags.length > 0 && (
          <div className="mt-4 text-center text-sm text-[#f7a5a5]/60">
            Showing {filteredTags.length} of {tags.length} tags
          </div>
        )}
      </div>

      {/* Tag Modal */}
      <TagModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleTagSave}
        tag={selectedTag}
        mode={modalMode}
        allPosts={posts}
      />
    </div>
  );
};

export default TagsPage;
