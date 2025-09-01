"use client";

import React, { useState } from "react";
import PostCard from "@/components/admin/posts/PostCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import PostModal, { PostFormData } from "@/components/admin/posts/PostModalNew";

const PostsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const handleEdit = (id: string) => {
    console.log("Editing post:", id);
    const post = posts.find((p) => p.id === id);
    if (post) {
      setSelectedPost(post);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Deleting post:", id);
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  const handleNew = () => {
    console.log("Creating new post");
    setSelectedPost(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handlePostSave = (postData: PostFormData) => {
    if (modalMode === "create") {
      // Create new post
      const newPost = {
        id: Date.now().toString(),
        title: postData.title,
        type: postData.type,
        author: { name: "Current User" }, // This should come from auth context
        createdAt: new Date(),
        status:
          postData.visibility === "public" ? "published" : postData.visibility,
        tags: postData.tags,
        category: postData.category,
        likes: 0,
        comments: 0,
        viewCount: 0,
        webmentions: 0,
        content: postData.content,
      };
      setPosts((prev) => [newPost, ...prev]);
    } else if (modalMode === "edit" && selectedPost) {
      // Update existing post
      setPosts((prev) =>
        prev.map((post) =>
          post.id === selectedPost.id
            ? {
                ...post,
                title: postData.title,
                type: postData.type,
                status:
                  postData.visibility === "public"
                    ? "published"
                    : postData.visibility,
                tags: postData.tags,
                category: postData.category,
                content: postData.content,
              }
            : post
        )
      );
    }
  };

  // This is temporary mock data - should be replaced with actual API data
  const mockPost = [
    {
      id: "1",
      title: "Getting Started with React and TypeScript",
      type: "text",
      author: {
        name: "John Doe",
      },
      createdAt: new Date(2024, 7, 15),
      status: "published" as const,
      tags: ["react", "typescript", "tutorial"],
      category: "Development",
      likes: 42,
      comments: 8,
      viewCount: 1250,
      webmentions: 3,
      content: {
        body: "This is a comprehensive guide to getting started with React and TypeScript...",
      },
    },
    {
      id: "2",
      title: "Advanced CSS Grid Techniques",
      type: "text",
      author: {
        name: "Jane Smith",
      },
      createdAt: new Date(2024, 7, 12),
      status: "published" as const,
      tags: ["css", "grid", "layout", "design"],
      category: "Design",
      likes: 67,
      comments: 12,
      viewCount: 2100,
      webmentions: 5,
      content: {
        body: "Learn advanced CSS Grid techniques that will revolutionize your layouts...",
      },
    },
    {
      id: "3",
      title: "Building REST APIs with Node.js",
      type: "text",
      author: {
        name: "Mike Johnson",
      },
      createdAt: new Date(2024, 7, 10),
      status: "draft" as const,
      tags: ["nodejs", "api", "backend"],
      category: "Backend",
      likes: 23,
      comments: 4,
      viewCount: 890,
      webmentions: 1,
      content: {
        body: "A complete guide to building RESTful APIs with Node.js and Express...",
      },
    },
    {
      id: "4",
      title: "Understanding JavaScript Closures",
      type: "text",
      author: {
        name: "Sarah Wilson",
      },
      createdAt: new Date(2024, 7, 8),
      status: "published" as const,
      tags: ["javascript", "closures", "fundamentals"],
      category: "Programming",
      likes: 89,
      comments: 15,
      viewCount: 3400,
      webmentions: 7,
      content: {
        body: "Closures are a fundamental concept in JavaScript. Let's explore them in detail...",
      },
    },
    {
      id: "5",
      title: "Modern Web Performance Optimization",
      type: "text",
      author: {
        name: "Alex Chen",
      },
      createdAt: new Date(2024, 7, 5),
      status: "scheduled" as const,
      tags: ["performance", "optimization", "web"],
      category: "Performance",
      likes: 34,
      comments: 6,
      viewCount: 1680,
      webmentions: 2,
      content: {
        body: "Learn the latest techniques for optimizing web performance...",
      },
    },
    {
      id: "6",
      title: "Introduction to Machine Learning",
      type: "text",
      author: {
        name: "David Brown",
      },
      createdAt: new Date(2024, 7, 3),
      status: "private" as const,
      tags: ["ml", "ai", "python", "data-science"],
      category: "AI/ML",
      likes: 156,
      comments: 28,
      viewCount: 5200,
      webmentions: 12,
      content: {
        body: "An introduction to the fascinating world of machine learning...",
      },
    },
    {
      id: "7",
      title: "Responsive Design Best Practices",
      type: "text",
      author: {
        name: "Emily Davis",
      },
      createdAt: new Date(2024, 7, 1),
      status: "published" as const,
      tags: ["responsive", "mobile", "design"],
      category: "Design",
      likes: 78,
      comments: 11,
      viewCount: 2800,
      webmentions: 4,
      content: {
        body: "Master the art of responsive design with these proven techniques...",
      },
    },
    {
      id: "8",
      title: "Database Optimization Strategies",
      type: "text",
      author: {
        name: "Tom Anderson",
      },
      createdAt: new Date(2024, 6, 28),
      status: "published" as const,
      tags: ["database", "sql", "optimization"],
      category: "Database",
      likes: 95,
      comments: 19,
      viewCount: 3900,
      webmentions: 8,
      content: {
        body: "Optimize your database performance with these expert strategies...",
      },
    },
    {
      id: "9",
      title: "Secure Coding Practices",
      type: "text",
      author: {
        name: "Lisa Garcia",
      },
      createdAt: new Date(2024, 6, 25),
      status: "draft" as const,
      tags: ["security", "coding", "best-practices"],
      category: "Security",
      likes: 62,
      comments: 9,
      viewCount: 1990,
      webmentions: 3,
      content: {
        body: "Essential security practices every developer should know...",
      },
    },
    {
      id: "10",
      title: "Cloud Computing Fundamentals",
      type: "text",
      author: {
        name: "Robert Kim",
      },
      createdAt: new Date(2024, 6, 22),
      status: "published" as const,
      tags: ["cloud", "aws", "infrastructure"],
      category: "Cloud",
      likes: 124,
      comments: 22,
      viewCount: 4500,
      webmentions: 9,
      content: {
        body: "Get started with cloud computing and understand the fundamentals...",
      },
    },
    {
      id: "11",
      title: "Testing Strategies for Modern Apps",
      type: "text",
      author: {
        name: "Anna Martinez",
      },
      createdAt: new Date(2024, 6, 20),
      status: "scheduled" as const,
      tags: ["testing", "qa", "automation"],
      category: "Testing",
      likes: 45,
      comments: 7,
      viewCount: 1750,
      webmentions: 2,
      content: {
        body: "Comprehensive testing strategies for modern web applications...",
      },
    },
  ];

  // Initialize posts with mock data
  React.useEffect(() => {
    setPosts(mockPost);
  }, []);

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

      {/* PostModal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handlePostSave}
        post={selectedPost}
        mode={modalMode}
      />
    </div>
  );
};

export default PostsPage;
