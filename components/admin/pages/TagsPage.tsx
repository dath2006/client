"use client";

import React, { useState } from "react";
import TagCard from "@/components/admin/tags/TagCard";
import SearchHeader from "@/components/admin/common/SearchHeader";

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

const TagsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleEdit = (id: string) => {
    console.log("Editing tag:", id);
    // Add edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Deleting tag:", id);
    // Add delete logic here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  const handleNew = () => {
    console.log("Creating new tag");
    // Add new tag creation logic here
  };

  // Filter tags based on search query
  const filteredTags = mockTags.filter(
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
            Showing {filteredTags.length} of {mockTags.length} tags
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsPage;
