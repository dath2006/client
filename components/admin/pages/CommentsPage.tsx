"use client";

import React, { useState } from "react";
import CommentCard from "@/components/admin/comments/CommentCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import CommentBatchActions from "@/components/admin/comments/CommentBatchActions";

export interface Comment {
  id: string;
  author: {
    name: string;
    email: string;
    website?: string;
    avatar?: string;
    isRegistered: boolean;
  };
  content: string;
  status: "pending" | "approved" | "spam" | "rejected";
  createdAt: Date;
  ipAddress: string;
  userAgent?: string;
  post: {
    id: string;
    title: string;
    slug: string;
  };
  parentId?: string; // For nested comments
  isReply?: boolean;
}

interface PostWithComments {
  post: {
    id: string;
    title: string;
    slug: string;
    createdAt: Date;
    author: {
      name: string;
      avatar?: string;
    };
  };
  comments: Comment[];
  totalComments: number;
  pendingCount: number;
  approvedCount: number;
  spamCount: number;
}

const CommentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "spam" | "rejected"
  >("all");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [postsWithComments, setPostsWithComments] = useState<
    PostWithComments[]
  >([]);

  // Mock data for posts with comments
  const mockPostsWithComments: PostWithComments[] = [
    {
      post: {
        id: "1",
        title: "Getting Started with Next.js 14",
        slug: "getting-started-nextjs-14",
        createdAt: new Date("2024-03-01"),
        author: {
          name: "Admin User",
          avatar: "/avatars/admin.jpg",
        },
      },
      comments: [
        {
          id: "c1",
          author: {
            name: "John Doe",
            email: "john@example.com",
            website: "https://johndoe.com",
            isRegistered: false,
          },
          content:
            "Great article! This really helped me understand the new features in Next.js 14.",
          status: "pending",
          createdAt: new Date("2024-03-02T10:30:00"),
          ipAddress: "192.168.1.1",
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          post: {
            id: "1",
            title: "Getting Started with Next.js 14",
            slug: "getting-started-nextjs-14",
          },
        },
        {
          id: "c2",
          author: {
            name: "Jane Smith",
            email: "jane@example.com",
            isRegistered: true,
            avatar: "/avatars/jane.jpg",
          },
          content:
            "Thanks for sharing this! The server components explanation was particularly useful.",
          status: "approved",
          createdAt: new Date("2024-03-02T14:15:00"),
          ipAddress: "10.0.0.5",
          post: {
            id: "1",
            title: "Getting Started with Next.js 14",
            slug: "getting-started-nextjs-14",
          },
        },
        {
          id: "c3",
          author: {
            name: "Spammer Bot",
            email: "spam@badsite.com",
            website: "http://spam-site.com",
            isRegistered: false,
          },
          content:
            "Check out my amazing deals on cheap products! Visit my website now!!!",
          status: "spam",
          createdAt: new Date("2024-03-02T16:20:00"),
          ipAddress: "45.123.456.789",
          post: {
            id: "1",
            title: "Getting Started with Next.js 14",
            slug: "getting-started-nextjs-14",
          },
        },
      ],
      totalComments: 3,
      pendingCount: 1,
      approvedCount: 1,
      spamCount: 1,
    },
    {
      post: {
        id: "2",
        title: "Building Modern UIs with React",
        slug: "building-modern-uis-react",
        createdAt: new Date("2024-02-28"),
        author: {
          name: "Admin User",
          avatar: "/avatars/admin.jpg",
        },
      },
      comments: [
        {
          id: "c4",
          author: {
            name: "Alice Developer",
            email: "alice@dev.com",
            isRegistered: true,
            avatar: "/avatars/alice.jpg",
          },
          content:
            "Love the component patterns you've shown here. Will definitely use these in my projects.",
          status: "approved",
          createdAt: new Date("2024-02-29T09:45:00"),
          ipAddress: "172.16.0.10",
          post: {
            id: "2",
            title: "Building Modern UIs with React",
            slug: "building-modern-uis-react",
          },
        },
        {
          id: "c5",
          author: {
            name: "Bob Wilson",
            email: "bob@example.com",
            isRegistered: false,
          },
          content:
            "Could you provide more examples of custom hooks? This would be very helpful.",
          status: "pending",
          createdAt: new Date("2024-03-01T11:20:00"),
          ipAddress: "203.0.113.15",
          post: {
            id: "2",
            title: "Building Modern UIs with React",
            slug: "building-modern-uis-react",
          },
        },
      ],
      totalComments: 2,
      pendingCount: 1,
      approvedCount: 1,
      spamCount: 0,
    },
  ];

  // Initialize with mock data
  React.useEffect(() => {
    setPostsWithComments(mockPostsWithComments);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNew = () => {
    // Comments are typically not created directly, but this could open a modal
    // to manually add a comment or navigate to a specific post
    console.log("Navigate to posts to add comments");
  };

  const handleCommentStatusChange = (
    commentId: string,
    newStatus: Comment["status"]
  ) => {
    setPostsWithComments((prev) =>
      prev.map((postData) => ({
        ...postData,
        comments: postData.comments.map((comment) =>
          comment.id === commentId ? { ...comment, status: newStatus } : comment
        ),
        // Recalculate counts
        pendingCount: postData.comments.filter((c) =>
          c.id === commentId ? newStatus === "pending" : c.status === "pending"
        ).length,
        approvedCount: postData.comments.filter((c) =>
          c.id === commentId
            ? newStatus === "approved"
            : c.status === "approved"
        ).length,
        spamCount: postData.comments.filter((c) =>
          c.id === commentId ? newStatus === "spam" : c.status === "spam"
        ).length,
      }))
    );
  };

  const handleCommentDelete = (commentId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      setPostsWithComments(
        (prev) =>
          prev
            .map((postData) => ({
              ...postData,
              comments: postData.comments.filter(
                (comment) => comment.id !== commentId
              ),
              totalComments: postData.comments.filter(
                (comment) => comment.id !== commentId
              ).length,
            }))
            .filter((postData) => postData.comments.length > 0) // Remove posts with no comments
      );
      setSelectedComments((prev) => prev.filter((id) => id !== commentId));
    }
  };

  const handleCommentSelect = (commentId: string, selected: boolean) => {
    if (selected) {
      setSelectedComments((prev) => [...prev, commentId]);
    } else {
      setSelectedComments((prev) => prev.filter((id) => id !== commentId));
    }
  };

  const handleBatchAction = (
    action: "approve" | "reject" | "spam" | "delete",
    commentIds: string[]
  ) => {
    if (action === "delete") {
      if (
        confirm(
          `Are you sure you want to delete ${commentIds.length} comment(s)? This action cannot be undone.`
        )
      ) {
        setPostsWithComments((prev) =>
          prev
            .map((postData) => ({
              ...postData,
              comments: postData.comments.filter(
                (comment) => !commentIds.includes(comment.id)
              ),
              totalComments: postData.comments.filter(
                (comment) => !commentIds.includes(comment.id)
              ).length,
            }))
            .filter((postData) => postData.comments.length > 0)
        );
        setSelectedComments([]);
      }
    } else {
      const statusMap = {
        approve: "approved" as const,
        reject: "rejected" as const,
        spam: "spam" as const,
      };

      setPostsWithComments((prev) =>
        prev.map((postData) => {
          const updatedComments = postData.comments.map((comment) =>
            commentIds.includes(comment.id)
              ? { ...comment, status: statusMap[action] }
              : comment
          );

          return {
            ...postData,
            comments: updatedComments,
            // Recalculate counts
            pendingCount: updatedComments.filter((c) => c.status === "pending")
              .length,
            approvedCount: updatedComments.filter(
              (c) => c.status === "approved"
            ).length,
            spamCount: updatedComments.filter((c) => c.status === "spam")
              .length,
          };
        })
      );
      setSelectedComments([]);
    }
  };

  // Filter posts and comments based on search and status
  const filteredPostsWithComments = postsWithComments
    .map((postData) => ({
      ...postData,
      comments: postData.comments.filter((comment) => {
        const matchesSearch =
          searchQuery === "" ||
          comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.author.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          comment.author.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          postData.post.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || comment.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    }))
    .filter((postData) => postData.comments.length > 0);

  // Get all comments for batch actions
  const allFilteredComments = filteredPostsWithComments.flatMap(
    (postData) => postData.comments
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader
          title="Comment"
          onSearch={handleSearch}
          onNew={handleNew}
        />

        {/* Status Filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[
            { key: "all", label: "All", count: allFilteredComments.length },
            {
              key: "pending",
              label: "Pending",
              count: allFilteredComments.filter((c) => c.status === "pending")
                .length,
            },
            {
              key: "approved",
              label: "Approved",
              count: allFilteredComments.filter((c) => c.status === "approved")
                .length,
            },
            {
              key: "spam",
              label: "Spam",
              count: allFilteredComments.filter((c) => c.status === "spam")
                .length,
            },
            {
              key: "rejected",
              label: "Rejected",
              count: allFilteredComments.filter((c) => c.status === "rejected")
                .length,
            },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key as any)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                statusFilter === filter.key
                  ? "bg-[#f7a5a5] text-[#5d688a]"
                  : "bg-white/5 text-[#f7a5a5]/70 hover:bg-white/10"
              }`}
              suppressHydrationWarning={true}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Batch Actions */}
      {selectedComments.length > 0 && (
        <CommentBatchActions
          selectedCount={selectedComments.length}
          onBatchAction={handleBatchAction}
          selectedCommentIds={selectedComments}
        />
      )}

      <div className="flex-1 overflow-y-auto pt-4">
        <div className="space-y-6">
          {filteredPostsWithComments.map((postData) => (
            <CommentCard
              key={postData.post.id}
              postData={postData}
              onCommentStatusChange={handleCommentStatusChange}
              onCommentDelete={handleCommentDelete}
              onCommentSelect={handleCommentSelect}
              selectedComments={selectedComments}
            />
          ))}

          {filteredPostsWithComments.length === 0 &&
            postsWithComments.length > 0 && (
              <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
                <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                  No comments found
                </h3>
                <p className="text-[#f7a5a5]/70">
                  Try adjusting your search query or filter settings.
                </p>
              </div>
            )}

          {postsWithComments.length === 0 && (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No comments yet
              </h3>
              <p className="text-[#f7a5a5]/70">
                Comments will appear here once visitors start engaging with your
                posts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
