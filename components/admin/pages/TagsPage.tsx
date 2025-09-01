"use client";

import React, { useState } from "react";
import TagCard from "@/components/admin/tags/TagCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import TagModal, { TagFormData } from "@/components/admin/tags/TagModal";

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
  color?: string;
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
  status?: "published" | "draft" | "scheduled";
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

  // Mock data for posts
  const mockPosts: Post[] = [
    {
      id: "1",
      title: "The Future of AI in Web Development",
      author: { name: "John Doe" },
      createdAt: new Date("2024-12-20"),
      tags: ["1", "4"], // Technology, JavaScript
      status: "published",
    },
    {
      id: "2",
      title: "React 19 Features You Should Know",
      author: { name: "Jane Smith" },
      createdAt: new Date("2024-12-18"),
      tags: ["1", "4"], // Technology, JavaScript
      status: "published",
    },
    {
      id: "3",
      title: "Building Scalable Applications",
      author: { name: "Mike Johnson" },
      createdAt: new Date("2024-12-15"),
      tags: ["1", "3"], // Technology, Tutorial
      status: "published",
    },
    {
      id: "4",
      title: "TypeScript Best Practices",
      author: { name: "Sarah Wilson" },
      createdAt: new Date("2024-12-12"),
      tags: ["1", "4"], // Technology, JavaScript
      status: "published",
    },
    {
      id: "5",
      title: "Modern CSS Techniques",
      author: { name: "David Brown" },
      createdAt: new Date("2024-12-10"),
      tags: ["1"], // Technology
      status: "published",
    },
    {
      id: "6",
      title: "UI/UX Design Principles for Modern Apps",
      author: { name: "Emily Davis" },
      createdAt: new Date("2024-12-19"),
      tags: ["2"], // Design
      status: "published",
    },
    {
      id: "7",
      title: "Color Theory in Digital Design",
      author: { name: "Robert Wilson" },
      createdAt: new Date("2024-12-16"),
      tags: ["2"], // Design
      status: "published",
    },
    {
      id: "8",
      title: "Typography That Converts",
      author: { name: "Lisa Anderson" },
      createdAt: new Date("2024-12-13"),
      tags: ["2"], // Design
      status: "draft",
    },
    {
      id: "9",
      title: "Complete Guide to Next.js 14",
      author: { name: "Tom Garcia" },
      createdAt: new Date("2024-12-21"),
      tags: ["3", "4"], // Tutorial, JavaScript
      status: "published",
    },
    {
      id: "10",
      title: "Building a CMS from Scratch",
      author: { name: "Anna Martinez" },
      createdAt: new Date("2024-12-17"),
      tags: ["3"], // Tutorial
      status: "published",
    },
    {
      id: "11",
      title: "Docker for Beginners",
      author: { name: "Chris Taylor" },
      createdAt: new Date("2024-12-14"),
      tags: ["3"], // Tutorial
      status: "scheduled",
    },
    {
      id: "12",
      title: "API Development with Node.js",
      author: { name: "Kevin White" },
      createdAt: new Date("2024-12-11"),
      tags: ["3", "4"], // Tutorial, JavaScript
      status: "published",
    },
    {
      id: "13",
      title: "ES2024 New Features Overview",
      author: { name: "Michelle Lee" },
      createdAt: new Date("2024-12-22"),
      tags: ["4"], // JavaScript
      status: "published",
    },
    {
      id: "14",
      title: "Async/Await vs Promises",
      author: { name: "Daniel Clark" },
      createdAt: new Date("2024-12-19"),
      tags: ["4"], // JavaScript
      status: "published",
    },
    {
      id: "15",
      title: "JavaScript Performance Optimization",
      author: { name: "Rachel Green" },
      createdAt: new Date("2024-12-16"),
      tags: ["4"], // JavaScript
      status: "draft",
    },
    {
      id: "16",
      title: "Industry Updates: December 2024",
      author: { name: "Alex Johnson" },
      createdAt: new Date("2024-12-20"),
      tags: ["5"], // News
      status: "published",
    },
    {
      id: "17",
      title: "New Framework Releases",
      author: { name: "Samantha Davis" },
      createdAt: new Date("2024-12-15"),
      tags: ["5"], // News
      status: "published",
    },
    {
      id: "18",
      title: "The State of Frontend Development",
      author: { name: "Jordan Miller" },
      createdAt: new Date("2024-12-18"),
      tags: ["6"], // Opinion
      status: "published",
    },
    {
      id: "19",
      title: "Why I Switched to TypeScript",
      author: { name: "Taylor Wilson" },
      createdAt: new Date("2024-12-12"),
      tags: ["6", "4"], // Opinion, JavaScript
      status: "published",
    },
    {
      id: "20",
      title: "Getting Started with React Native",
      author: { name: "Morgan Brown" },
      createdAt: new Date("2024-12-09"),
      tags: ["3", "4"], // Tutorial, JavaScript
      status: "draft",
    },
  ];
  // Mock data for tags
  const mockTags: Tag[] = [
    {
      id: "1",
      name: "Technology",
      createdAt: new Date("2024-03-15"),
      postCount: 15,
      posts: [
        {
          id: "1",
          title: "The Future of AI in Web Development",
          createdAt: new Date("2024-12-20"),
        },
        {
          id: "2",
          title: "React 19 Features You Should Know",
          createdAt: new Date("2024-12-18"),
        },
        {
          id: "3",
          title: "Building Scalable Applications",
          createdAt: new Date("2024-12-15"),
        },
        {
          id: "4",
          title: "TypeScript Best Practices",
          createdAt: new Date("2024-12-12"),
        },
        {
          id: "5",
          title: "Modern CSS Techniques",
          createdAt: new Date("2024-12-10"),
        },
      ],
    },
    {
      id: "2",
      name: "Design",
      createdAt: new Date("2024-04-20"),
      postCount: 8,
      posts: [
        {
          id: "6",
          title: "UI/UX Design Principles for Modern Apps",
          createdAt: new Date("2024-12-19"),
        },
        {
          id: "7",
          title: "Color Theory in Digital Design",
          createdAt: new Date("2024-12-16"),
        },
        {
          id: "8",
          title: "Typography That Converts",
          createdAt: new Date("2024-12-13"),
        },
      ],
    },
    {
      id: "3",
      name: "Tutorial",
      createdAt: new Date("2024-02-10"),
      postCount: 23,
      posts: [
        {
          id: "9",
          title: "Complete Guide to Next.js 14",
          createdAt: new Date("2024-12-21"),
        },
        {
          id: "10",
          title: "Building a CMS from Scratch",
          createdAt: new Date("2024-12-17"),
        },
        {
          id: "11",
          title: "Docker for Beginners",
          createdAt: new Date("2024-12-14"),
        },
        {
          id: "12",
          title: "API Development with Node.js",
          createdAt: new Date("2024-12-11"),
        },
      ],
    },
    {
      id: "4",
      name: "JavaScript",
      createdAt: new Date("2024-01-25"),
      postCount: 19,
      posts: [
        {
          id: "13",
          title: "ES2024 New Features Overview",
          createdAt: new Date("2024-12-22"),
        },
        {
          id: "14",
          title: "Async/Await vs Promises",
          createdAt: new Date("2024-12-19"),
        },
        {
          id: "15",
          title: "JavaScript Performance Optimization",
          createdAt: new Date("2024-12-16"),
        },
      ],
    },
    {
      id: "5",
      name: "News",
      createdAt: new Date("2024-05-30"),
      postCount: 6,
      posts: [
        {
          id: "16",
          title: "Industry Updates: December 2024",
          createdAt: new Date("2024-12-20"),
        },
        {
          id: "17",
          title: "New Framework Releases",
          createdAt: new Date("2024-12-15"),
        },
      ],
    },
    {
      id: "6",
      name: "Opinion",
      createdAt: new Date("2024-06-12"),
      postCount: 4,
      posts: [
        {
          id: "18",
          title: "The State of Frontend Development",
          createdAt: new Date("2024-12-18"),
        },
        {
          id: "19",
          title: "Why I Switched to TypeScript",
          createdAt: new Date("2024-12-12"),
        },
      ],
    },
  ];

  // Initialize data
  React.useEffect(() => {
    setTags(mockTags);
    setPosts(mockPosts);
  }, []);

  const handleEdit = (id: string) => {
    console.log("Editing tag:", id);
    const tag = tags.find((t) => t.id === id);
    if (tag) {
      setSelectedTag(tag);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Deleting tag:", id);
    setTags((prev) => prev.filter((tag) => tag.id !== id));
    // Also remove tag from posts
    setPosts((prev) =>
      prev.map((post) => ({
        ...post,
        tags: post.tags?.filter((tagId) => tagId !== id) || [],
      }))
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNew = () => {
    console.log("Creating new tag");
    setSelectedTag(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (id: string) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) {
      setSelectedTag(tag);
      setModalMode("view");
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTag(null);
  };

  const handleTagSave = (tagData: TagFormData) => {
    if (modalMode === "create") {
      // Create new tag
      const newTagId = Date.now().toString();
      const selectedPosts = posts.filter((post) =>
        tagData.selectedPostIds.includes(post.id)
      );

      const newTag: Tag = {
        id: newTagId,
        name: tagData.name,
        createdAt: new Date(),
        postCount: tagData.selectedPostIds.length,
        posts: selectedPosts.map((post) => ({
          id: post.id,
          title: post.title,
          createdAt: post.createdAt,
        })),
        color: tagData.color,
      };

      setTags((prev) => [...prev, newTag]);

      // Update posts to include this tag
      setPosts((prev) =>
        prev.map((post) =>
          tagData.selectedPostIds.includes(post.id)
            ? { ...post, tags: [...(post.tags || []), newTagId] }
            : post
        )
      );
    } else if (modalMode === "edit" && selectedTag) {
      // Update existing tag
      const selectedPosts = posts.filter((post) =>
        tagData.selectedPostIds.includes(post.id)
      );

      setTags((prev) =>
        prev.map((tag) =>
          tag.id === selectedTag.id
            ? {
                ...tag,
                name: tagData.name,
                postCount: tagData.selectedPostIds.length,
                posts: selectedPosts.map((post) => ({
                  id: post.id,
                  title: post.title,
                  createdAt: post.createdAt,
                })),
                color: tagData.color,
              }
            : tag
        )
      );

      // Update posts - remove tag from all posts first, then add to selected ones
      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          tags: tagData.selectedPostIds.includes(post.id)
            ? [
                ...(post.tags?.filter((tagId) => tagId !== selectedTag.id) ||
                  []),
                selectedTag.id,
              ]
            : post.tags?.filter((tagId) => tagId !== selectedTag.id) || [],
        }))
      );
    }
  };

  // Filter tags based on search query
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
        <div className="space-y-2">
          {filteredTags.length > 0 ? (
            filteredTags.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))
          ) : (
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
