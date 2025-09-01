"use client";

import React, { useState } from "react";
import PostCard from "@/components/admin/posts/PostCard";
import SearchHeader from "@/components/admin/common/SearchHeader";

const PostsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (id: string) => {
    console.log("Editing post:", id);
    // Add edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Deleting post:", id);
    // Add delete logic here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  const handleNew = () => {
    console.log("Creating new post");
    // Add new post creation logic here
  };

  // This is temporary mock data - should be replaced with actual API data
  const mockPost = [
    {
      id: "1",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "4",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "5",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "6",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "7",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "8",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "9",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "10",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
    {
      id: "11",
      title: "Sample Post",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader title="Post" onSearch={handleSearch} onNew={handleNew} />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="grid gap-4">
          {mockPost.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {/* Add more posts here when implementing API */}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
