"use client";

import React, { useState } from "react";
import SearchHeader from "@/components/admin/common/SearchHeader";
import PostCard from "@/components/admin/posts/PostCard";

// Temporary mock data - replace with actual API data later
const mockPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    author: { name: "John Doe" },
    createdAt: new Date(2025, 7, 25),
  },
  {
    id: "2",
    title: "The Future of Web Development",
    author: { name: "Jane Smith" },
    createdAt: new Date(2025, 7, 28),
  },
  {
    id: "3",
    title: "Understanding TypeScript",
    author: { name: "Mike Johnson" },
    createdAt: new Date(2025, 7, 30),
  },
];

const PostsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(mockPosts);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter posts based on search query
    const filteredPosts = mockPosts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    setPosts(filteredPosts);
  };

  const handleNewPost = () => {
    // Implement new post functionality
    console.log("Create new post");
  };

  const handleEditPost = (id: string) => {
    // Implement edit functionality
    console.log("Edit post:", id);
  };

  const handleDeletePost = (id: string) => {
    // Implement delete functionality
    console.log("Delete post:", id);
  };

  return (
    <div className="space-y-6">
      <SearchHeader
        title="Post"
        onSearch={handleSearch}
        onNew={handleNewPost}
      />

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-10 text-primary/70">
            {searchQuery
              ? "No posts found matching your search."
              : "No posts yet."}
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PostsPage;
