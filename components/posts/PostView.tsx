"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostInteractions from "./PostInteractions";
import PostTags from "./PostTags";
import CommentsSection from "./CommentsSection";
import ShareModal from "./ShareModal";
import { Post, Comment } from "@/types/post";

interface PostViewProps {
  postId?: string;
  onBack?: () => void;
}

// Mock data - replace with actual API calls
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    type: "text",
    author: {
      name: "John Doe",
      avatar: "/api/placeholder/40/40",
      id: "user1",
    },
    createdAt: new Date(2024, 7, 15),
    updatedAt: new Date(2024, 7, 15),
    status: "published",
    tags: ["react", "typescript", "tutorial"],
    category: "Development",
    likes: 42,
    shares: 12,
    saves: 8,
    viewCount: 1250,
    content: {
      body: "This is a comprehensive guide to getting started with React and TypeScript. In this tutorial, we'll cover the basics of setting up a React project with TypeScript, understanding the benefits of type safety, and building your first components with proper typing.\n\nTypeScript brings static typing to JavaScript, which helps catch errors early in development and provides better IDE support with autocomplete and refactoring tools.",
    },
    comments: [
      {
        id: "c1",
        author: {
          name: "Alice Smith",
          avatar: "/api/placeholder/40/40",
          id: "user2",
        },
        content:
          "Great tutorial! This really helped me understand TypeScript better.",
        createdAt: new Date(2024, 7, 16),
        likes: 5,
        replies: [],
      },
      {
        id: "c2",
        author: {
          name: "Bob Johnson",
          avatar: "/api/placeholder/40/40",
          id: "user3",
        },
        content: "Could you add more examples about generic types?",
        createdAt: new Date(2024, 7, 17),
        likes: 2,
        replies: [
          {
            id: "r1",
            author: {
              name: "John Doe",
              avatar: "/api/placeholder/40/40",
              id: "user1",
            },
            content:
              "That's a great suggestion! I'll add a section about generics in the next update.",
            createdAt: new Date(2024, 7, 17),
            likes: 3,
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Beautiful Landscape Photography",
    type: "photo",
    author: {
      name: "Jane Smith",
      avatar: "/api/placeholder/40/40",
      id: "user2",
    },
    createdAt: new Date(2024, 7, 12),
    updatedAt: new Date(2024, 7, 12),
    status: "published",
    tags: ["photography", "landscape", "nature"],
    category: "Photography",
    likes: 89,
    shares: 25,
    saves: 34,
    viewCount: 2100,
    content: {
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
      ],
      caption:
        "Captured during my recent trip to the mountains. The golden hour light was absolutely perfect!",
    },
    comments: [],
  },
  {
    id: "3",
    title: "My Favorite Podcast Episode",
    type: "audio",
    author: {
      name: "Mike Johnson",
      avatar: "/api/placeholder/40/40",
      id: "user3",
    },
    createdAt: new Date(2024, 7, 10),
    updatedAt: new Date(2024, 7, 10),
    status: "published",
    tags: ["podcast", "technology", "interview"],
    category: "Audio",
    likes: 23,
    shares: 8,
    saves: 15,
    viewCount: 890,
    content: {
      audioUrl: "/api/placeholder/audio.mp3",
      duration: "45:32",
      audioDescription:
        "An insightful conversation about the future of web development with industry experts.",
    },
    comments: [],
  },
];

const PostView: React.FC<PostViewProps> = ({ postId = "1", onBack }) => {
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInteractions, setUserInteractions] = useState({
    liked: false,
    saved: false,
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Find the post by ID
    const post = mockPosts.find((p) => p.id === postId);
    const index = mockPosts.findIndex((p) => p.id === postId);

    if (post) {
      setCurrentPost(post);
      setCurrentIndex(index);
    }
  }, [postId]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLike = () => {
    if (!currentPost) return;

    const newLikedState = !userInteractions.liked;
    setUserInteractions((prev) => ({ ...prev, liked: newLikedState }));

    setCurrentPost((prev: Post | null) =>
      prev
        ? {
            ...prev,
            likes: newLikedState ? prev.likes + 1 : prev.likes - 1,
          }
        : null
    );
  };

  const handleSave = () => {
    const newSavedState = !userInteractions.saved;
    setUserInteractions((prev) => ({ ...prev, saved: newSavedState }));
    showNotification(newSavedState ? "Post saved!" : "Post unsaved!");
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleTagClick = (tag: string) => {
    // Navigate to tag filter page
    console.log("Navigate to tag:", tag);
  };

  const handleCommentSubmit = (content: string) => {
    if (!currentPost) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: {
        name: "Current User",
        avatar: "/api/placeholder/40/40",
        id: "current-user",
      },
      content,
      createdAt: new Date(),
      likes: 0,
      replies: [],
    };

    setCurrentPost((prev: Post | null) =>
      prev
        ? {
            ...prev,
            comments: [newComment, ...prev.comments],
          }
        : null
    );
  };

  const handleNextPost = () => {
    if (currentIndex < mockPosts.length - 1) {
      const nextPost = mockPosts[currentIndex + 1];
      setCurrentPost(nextPost);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevPost = () => {
    if (currentIndex > 0) {
      const prevPost = mockPosts[currentIndex - 1];
      setCurrentPost(prevPost);
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-success text-white px-4 py-2 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          post={currentPost}
          onClose={() => setIsShareModalOpen(false)}
          onShare={() => showNotification("Link copied to clipboard!")}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {currentIndex + 1} of {mockPosts.length}
            </span>
            <button
              onClick={handlePrevPost}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextPost}
              disabled={currentIndex === mockPosts.length - 1}
              className="p-2 rounded-lg hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </nav>

        {/* Post Content */}
        <article className="space-y-8">
          <PostHeader post={currentPost} />
          <PostContent post={currentPost} />
          <PostTags tags={currentPost.tags} onTagClick={handleTagClick} />
          <PostInteractions
            post={currentPost}
            userLiked={userInteractions.liked}
            userSaved={userInteractions.saved}
            onLike={handleLike}
            onShare={handleShare}
            onSave={handleSave}
          />
          <CommentsSection
            comments={currentPost.comments}
            onCommentSubmit={handleCommentSubmit}
          />
        </article>
      </div>
    </div>
  );
};

export default PostView;
