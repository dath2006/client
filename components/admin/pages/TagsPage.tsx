"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import TagCard from "@/components/admin/tags/TagCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import TagModal from "@/components/admin/tags/TagModal";
import { adminAPI } from "@/lib/api";

// --- TYPE DEFINITIONS ---
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

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
  exit: {
    x: -50,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// --- API DATA MAPPERS ---
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

// --- COMPONENT ---
const TagsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchTags();
      await fetchPosts();
    };
    fetchInitialData();
  }, []);

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

  const fetchPosts = async () => {
    try {
      const response = await adminAPI.getAllPosts();
      setPosts((response.data || []).map(mapApiPost));
    } catch (err: any) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery) {
        fetchTags(searchQuery);
      }
    }, 300);
    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

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
      closeModal();
    } catch (err: any) {
      setError(err?.message || "Failed to save tag");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (
      !window.confirm(
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

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.posts.some((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="flex flex-col h-full bg-[#5d688a] text-[#f7a5a5]">
      <div className="sticky top-0 z-10 bg-[#5d688a]/95 backdrop-blur-sm border-b border-[#f7a5a5]/20 pb-4">
        <SearchHeader
          title="Tag"
          onSearch={setSearchQuery}
          onNew={openCreateModal}
        />
      </div>

      <div className="flex-1 overflow-y-auto pt-4 px-4">
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="flex justify-center items-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-[#f7a5a5]/70">Loading tags...</div>
            </motion.div>
          ) : filteredTags.length > 0 ? (
            <motion.div
              key="tag-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <AnimatePresence>
                {filteredTags.map((tag) => (
                  <motion.div
                    key={tag.id}
                    variants={itemVariants}
                    exit="exit"
                    layout
                  >
                    <TagCard
                      tag={tag}
                      onEdit={() => openEditModal(tag)}
                      onDelete={() => handleDeleteTag(tag.id)}
                      onView={() => openViewModal(tag)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="no-tags"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center mt-10"
            >
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No tags found
              </h3>
              <p className="text-[#f7a5a5]/70 mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria."
                  : "Get started by creating your first tag."}
              </p>
              <motion.button
                onClick={openCreateModal}
                className="bg-[#f7a5a5] text-[#5d688a] font-bold px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Tag
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredTags.length > 0 && !loading && (
          <div className="mt-4 text-center text-sm text-[#f7a5a5]/60">
            Showing {filteredTags.length} of {tags.length} tags
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <TagModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={handleTagSave}
            tag={selectedTag}
            mode={modalMode}
            allPosts={posts}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TagsPage;
