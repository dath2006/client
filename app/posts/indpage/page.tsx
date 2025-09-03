"use client";

import React, { useState, useEffect, useRef } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

// --- SVG ICON COMPONENTS ---
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-user-circle-2"
  >
    <path d="M18 20a6 6 0 0 0-12 0" />
    <circle cx="12" cy="10" r="4" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-calendar"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-eye"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-heart ${filled ? "text-red-500" : ""}`}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const MessageSquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-message-square"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-share-2"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
);
const ThumbsUpIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-thumbs-up"
  >
    <path d="M7 10v12" />
    <path d="M18 10V4c0-1.1-.9-2-2-2v0a2 2 0 0 0-2 2v2.5" />
    <path d="M12 10a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
    <path d="M18 10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-4-4-1-4V4a2 2 0 0 1 2-2h2.5" />
  </svg>
);
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-x"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-arrow-left"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-left"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-right"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.84c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.96 3.36 3.66z" />
  </svg>
);
const WhatsappIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.8L2 22l5.3-1.38c1.37.74 2.93 1.18 4.56 1.18h.1c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zm0 18.16h-.1c-1.47 0-2.88-.4-4.13-1.15l-.3-.18-3.07.8.82-3.01-.2-.32a8.09 8.09 0 0 1-1.23-4.32c0-4.54 3.69-8.23 8.23-8.23 4.54 0 8.23 3.69 8.23 8.23s-3.7 8.23-8.24 8.23zm4.49-6.17c-.25-.12-1.47-.72-1.7-.82s-.39-.12-.56.12c-.17.25-.64.82-.79.99s-.29.17-.54.06c-.25-.12-1.06-.39-2.02-1.25s-1.46-1.92-1.63-2.24c-.17-.32-.02-.5.1-.64s.25-.29.37-.44a1.35 1.35 0 0 0 .25-.41c.04-.13.02-.24-.04-.36s-.56-1.34-.76-1.84c-.2-.48-.4-.42-.55-.42h-.48c-.17 0-.44.06-.66.31s-.86.84-.86 2.05c0 1.2.88 2.37 1 2.54s1.73 2.64 4.2 3.72c.59.26 1.05.41 1.41.52.59.17 1.13.15 1.55.09.47-.06 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18s-.24-.09-.5-.21z" />
  </svg>
);
const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-copy"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

// --- TYPES ---
type Comment = {
  id: number;
  author: string;
  text: string;
  timestamp: Date;
  upvotes: number;
  userUpvoted: boolean;
};

type Post = {
  id: number;
  title: string;
  author: string;
  date: string;
  feather: string;
  body: string;
  tags: string[];
  likes: number;
  views: number;
  rights: string;
  media: string[];
  embedUrl: string;
  comments: Comment[];
};

// --- MOCK DATA ---
const initialMockPosts: Post[] = JSON.parse(
  JSON.stringify([
    {
      id: 1,
      title: "Welcome to the Future of Blogging",
      author: "Admin",
      date: "2024-01-15",
      feather: "Photo",
      body: "Chyrp Lite Reimagine brings a fresh perspective to content management. With its modern interface and powerful features, creating and managing content has never been easier. This post showcases a photo gallery feature.",
      tags: ["blogging", "cms", "web", "react"],
      likes: 24,
      views: 1345,
      rights: "© 2025 Admin. All rights reserved.",
      media: [
        "https://placehold.co/800x600/1a202c/ffffff?text=Image+1",
        "https://placehold.co/800x600/2d3748/ffffff?text=Image+2",
        "https://placehold.co/800x600/4a5568/ffffff?text=Image+3",
      ],
      embedUrl: "",
      comments: [
        {
          id: 101,
          author: "Jane Doe",
          text: "This is a fantastic update! The new interface is so clean.",
          timestamp: new Date(Date.now() - 3600000 * 2),
          upvotes: 15,
          userUpvoted: false,
        },
        {
          id: 102,
          author: "John Smith",
          text: "I'm really looking forward to trying this out. The gallery looks great.",
          timestamp: new Date(Date.now() - 3600000 * 5),
          upvotes: 8,
          userUpvoted: true,
        },
      ],
    },
    {
      id: 2,
      title: "Exploring Mathematical Concepts",
      author: "Dr. Math",
      date: "2024-04-01",
      feather: "Text",
      body: "Today we explore the famous equation, $E=mc^2$. It's a cornerstone of modern physics.",
      tags: ["science", "physics", "math"],
      likes: 256,
      views: 8302,
      rights: "Creative Commons BY-NC",
      media: [],
      embedUrl: "",
      comments: [
        {
          id: 201,
          author: "Student",
          text: "I finally understand this!",
          timestamp: new Date(Date.now() - 3600000 * 10),
          upvotes: 22,
          userUpvoted: false,
        },
      ],
    },
    {
      id: 3,
      title: "How to Embed Content",
      author: "EmbedMaster",
      date: "2024-05-15",
      feather: "Embed",
      body: "Embedding content is easy! Here is a video embedded directly from YouTube.",
      tags: ["embed", "youtube", "web"],
      likes: 88,
      views: 4100,
      rights: "",
      media: [],
      embedUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      comments: [],
    },
  ])
);

// --- HELPER FUNCTIONS ---
const timeAgo = (date: Date): string => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const getYouTubeEmbedUrl = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

// --- CHILD COMPONENTS ---

const CommentForm = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (commentText.trim() === "") return;
    onSubmit(commentText);
    setCommentText(""); // Clear textarea after submit
  };

  return (
    <div className="mb-6">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        rows={3}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          {" "}
          Post Comment{" "}
        </button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function BlogPostViewer() {
  const [postsData, setPostsData] = useState<Post[]>(initialMockPosts);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"single" | "filtered">("single");
  const [filteredInfo, setFilteredInfo] = useState<{
    tag: string;
    posts: Post[];
  } | null>(null);
  const [userLiked, setUserLiked] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const shareModalRef = useRef<HTMLDivElement>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(
    null
  );

  const post = postsData[currentPostIndex];

  const mathJaxConfig = {
    loader: { load: ["input/tex", "output/svg"] },
    tex: { inlineMath: [["$", "$"]] },
  };

  useEffect(() => {
    setPostsData((prevPosts) =>
      prevPosts.map((p, index) =>
        index === currentPostIndex ? { ...p, views: (p.views || 0) + 1 } : p
      )
    );
    setViewMode("single");
    setUserLiked(false);
  }, [currentPostIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareModalRef.current &&
        !shareModalRef.current.contains(event.target as Node)
      ) {
        setIsShareModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith("$") && part.endsWith("$")) {
        // Pass the content *with* the delimiters to MathJax
        return (
          <MathJax key={index} inline>
            {part}
          </MathJax>
        );
      }
      // Simple newline handling
      return part.split("\n").map((line, i) => (
        <React.Fragment key={`${index}-${i}`}>
          {line}
          {i < part.split("\n").length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  const handleLike = () => {
    setPostsData((prevPosts) =>
      prevPosts.map((p, index) =>
        index === currentPostIndex
          ? { ...p, likes: userLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    setUserLiked(!userLiked);
  };

  const handleCommentUpvote = (commentId: number) => {
    setPostsData((prevPosts) =>
      prevPosts.map((p: Post, index: number) => {
        if (index === currentPostIndex) {
          return {
            ...p,
            comments: p.comments.map((c: Comment) =>
              c.id === commentId
                ? {
                    ...c,
                    upvotes: c.userUpvoted ? c.upvotes - 1 : c.upvotes + 1,
                    userUpvoted: !c.userUpvoted,
                  }
                : c
            ),
          };
        }
        return p;
      })
    );
  };

  const handlePostComment = (text: string) => {
    const comment: Comment = {
      id: Date.now(),
      author: "Guest User",
      text,
      timestamp: new Date(),
      upvotes: 0,
      userUpvoted: false,
    };
    setPostsData((prevPosts) =>
      prevPosts.map((p, index) =>
        index === currentPostIndex
          ? { ...p, comments: [comment, ...p.comments] }
          : p
      )
    );
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `Check out this post: ${post.title}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing post:", err);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handleNextPost = () => {
    if (currentPostIndex < postsData.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
    }
  };

  const handlePrevPost = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1);
    }
  };

  const handleTagClick = (tag: string) => {
    const filtered = postsData.filter((p) => p.tags.includes(tag));
    setFilteredInfo({ tag, posts: filtered });
    setViewMode("filtered");
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setNotification("Link copied to clipboard!");
    setIsShareModalOpen(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const renderFeatherContent = (postToRender: Post) => {
    switch (postToRender.feather) {
      case "Photo":
        return (
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {postToRender.media.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`Post image ${index + 1}`}
                className="rounded-lg object-cover w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setLightboxImageIndex(index)}
              />
            ))}
          </div>
        );
      case "Video":
        return (
          <div className="my-6">
            {" "}
            {postToRender.media.map((url: string, index: number) => (
              <video
                key={index}
                src={url}
                controls
                className="rounded-lg w-full mb-4"
              />
            ))}{" "}
          </div>
        );
      case "Audio":
        return (
          <div className="my-6 space-y-4">
            {" "}
            {postToRender.media.map((url: string, index: number) => (
              <audio key={index} src={url} controls className="w-full" />
            ))}{" "}
          </div>
        );
      case "Quote":
        return (
          <blockquote className="my-6 p-4 border-l-4 border-blue-500 bg-gray-800 italic text-xl">
            {" "}
            "{postToRender.body}"{" "}
          </blockquote>
        );
      case "Embed":
        const embedUrl = getYouTubeEmbedUrl(postToRender.embedUrl);
        return embedUrl ? (
          <div className="my-6 aspect-w-16 aspect-h-9">
            <iframe
              src={embedUrl}
              title={postToRender.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg min-h-[400px]"
            ></iframe>
          </div>
        ) : (
          <p className="my-6 text-red-500">Invalid embed URL.</p>
        );
      default:
        return null;
    }
  };

  const SinglePostView = ({ postData }: { postData: Post }) => (
    <>
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          {postData.title}
        </h1>
        <div className="flex items-center text-gray-400 text-sm gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {" "}
            <UserIcon /> <span>{postData.author}</span>{" "}
          </div>
          <div className="flex items-center gap-2">
            {" "}
            <CalendarIcon /> <span>{postData.date}</span>{" "}
          </div>
          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs">
            {postData.feather}
          </span>
        </div>
      </header>
      <article>
        {renderFeatherContent(postData)}
        <div className="prose prose-invert max-w-none text-lg leading-relaxed">
          {renderMarkdown(postData.body)}
        </div>
      </article>
      <div className="my-8 flex flex-wrap gap-2">
        {postData.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="bg-blue-600/50 hover:bg-blue-600/80 text-blue-100 text-sm font-semibold px-3 py-1 rounded-full transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>
      <div className="py-4 border-t border-b border-gray-700 flex items-center justify-between text-gray-400">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            {" "}
            <HeartIcon filled={userLiked} /> <span>{postData.likes}</span>{" "}
          </button>
          <div className="flex items-center gap-2">
            {" "}
            <MessageSquareIcon />{" "}
            <span>{postData.comments.length} Comments</span>{" "}
          </div>
          <div className="flex items-center gap-2">
            {" "}
            <EyeIcon /> <span>
              {postData.views.toLocaleString()} Views
            </span>{" "}
          </div>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          {" "}
          <ShareIcon /> <span>Share</span>{" "}
        </button>
      </div>
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <CommentForm onSubmit={handlePostComment} />
        <div className="space-y-6">
          {postData.comments.map((comment: Comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                {" "}
                {comment.author.charAt(0)}{" "}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  {" "}
                  <p className="font-bold">{comment.author}</p>{" "}
                  <p className="text-xs text-gray-500">
                    {timeAgo(comment.timestamp)}
                  </p>{" "}
                </div>
                <p className="text-gray-300 mt-1">{comment.text}</p>
                <div className="mt-2">
                  {" "}
                  <button
                    onClick={() => handleCommentUpvote(comment.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {" "}
                    <ThumbsUpIcon filled={comment.userUpvoted} />{" "}
                    <span>{comment.upvotes}</span>{" "}
                  </button>{" "}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {postData.rights && (
        <footer className="mt-12 pt-4 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>{postData.rights}</p>
        </footer>
      )}
    </>
  );

  const FilteredPostsView = ({
    tag,
    posts,
  }: {
    tag: string;
    posts: Post[];
  }) => (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Posts tagged with <span className="text-blue-400">#{tag}</span>
        </h1>
        <button
          onClick={() => {
            setViewMode("single");
            setFilteredInfo(null);
          }}
          className="text-sm text-blue-400 hover:underline"
        >
          {" "}
          &larr; Back to Current Post{" "}
        </button>
      </div>
      <div className="space-y-8">
        {posts.map((p: Post) => (
          <div key={p.id} className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">{p.title}</h2>
            <div className="flex items-center text-gray-400 text-xs gap-4 mb-4">
              {" "}
              <span>by {p.author}</span> <span>on {p.date}</span>{" "}
            </div>
            <p className="text-gray-300 mb-4">{p.body.substring(0, 150)}...</p>
            <button
              onClick={() => {
                const postIndex = postsData.findIndex(
                  (mock) => mock.id === p.id
                );
                if (postIndex !== -1) setCurrentPostIndex(postIndex);
              }}
              className="font-bold text-blue-400 hover:underline"
            >
              {" "}
              Read More &rarr;{" "}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const ShareModal = ({
    post,
    onClose,
  }: {
    post: Post;
    onClose: () => void;
  }) => {
    const url = window.location.href;
    const text = `Check out this post: ${post.title}`;
    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(
        post.body.substring(0, 100)
      )}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        text
      )}%20${encodeURIComponent(url)}`,
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div
          ref={shareModalRef}
          className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm"
        >
          <div className="flex justify-between items-center mb-4">
            {" "}
            <h2 className="text-xl font-bold">Share Post</h2>{" "}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              {" "}
              <XIcon />{" "}
            </button>{" "}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {" "}
              <TwitterIcon /> <span className="mt-2 text-sm">Twitter</span>{" "}
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {" "}
              <FacebookIcon /> <span className="mt-2 text-sm">
                Facebook
              </span>{" "}
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {" "}
              <LinkedinIcon /> <span className="mt-2 text-sm">
                LinkedIn
              </span>{" "}
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {" "}
              <WhatsappIcon /> <span className="mt-2 text-sm">
                WhatsApp
              </span>{" "}
            </a>
          </div>
          <div className="mt-4">
            {" "}
            <button
              onClick={handleCopyToClipboard}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {" "}
              <CopyIcon /> <span>Copy Link</span>{" "}
            </button>{" "}
          </div>
        </div>
      </div>
    );
  };

  const Lightbox = ({
    images,
    startIndex,
    onClose,
  }: {
    images: string[];
    startIndex: number;
    onClose: () => void;
  }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    const handleNext = () =>
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    const handlePrev = () =>
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <button
          className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20"
          onClick={onClose}
        >
          <XIcon />
        </button>
        <button
          className="absolute left-4 p-2 rounded-full hover:bg-white/20 text-white"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
        >
          <ChevronLeftIcon />
        </button>
        <button
          className="absolute right-4 p-2 rounded-full hover:bg-white/20 text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          <ChevronRightIcon />
        </button>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <img
            src={images[currentIndex]}
            alt={`Lightbox image ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      </div>
    );
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="bg-gray-900 min-h-screen text-white font-sans">
        {notification && (
          <div className="fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg bg-green-600 text-white">
            {" "}
            {notification}{" "}
          </div>
        )}
        {isShareModalOpen && (
          <ShareModal post={post} onClose={() => setIsShareModalOpen(false)} />
        )}
        {viewMode === "single" &&
          post.feather === "Photo" &&
          lightboxImageIndex !== null && (
            <Lightbox
              images={post.media}
              startIndex={lightboxImageIndex}
              onClose={() => setLightboxImageIndex(null)}
            />
          )}
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <nav className="flex justify-between items-center mb-8">
            <button
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Back to home"
            >
              {" "}
              <ArrowLeftIcon />{" "}
            </button>
            {viewMode === "single" && (
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-sm">
                  {currentPostIndex + 1} of {postsData.length}
                </span>
                <button
                  onClick={handlePrevPost}
                  disabled={currentPostIndex === 0}
                  className="p-2 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous post"
                >
                  {" "}
                  <ChevronLeftIcon />{" "}
                </button>
                <button
                  onClick={handleNextPost}
                  disabled={currentPostIndex === postsData.length - 1}
                  className="p-2 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next post"
                >
                  {" "}
                  <ChevronRightIcon />{" "}
                </button>
              </div>
            )}
          </nav>
          {viewMode === "single" ? (
            <SinglePostView postData={post} />
          ) : (
            <FilteredPostsView
              tag={filteredInfo!.tag}
              posts={filteredInfo!.posts}
            />
          )}
        </div>
      </div>
    </MathJaxContext>
  );
}
