"use client";

import PostCard from "./PostCard";

// Mock data for different post types
const mockPosts = [
  {
    id: 1,
    title: "Welcome to the Future of Blogging",
    content:
      "Chyrp Lite Reimagine brings a fresh perspective to content management. With its modern interface and powerful features, creating and managing content has never been easier.",
    type: "text" as const,
    author: "Admin",
    date: "2024-01-15",
    tags: ["blogging", "cms", "web"],
    likes: 24,
    comments: 8,
    views: 1200, // Added views
  },
  {
    id: 2,
    title: "Beautiful Mountain Landscape",
    content:
      "Captured this stunning view during my hiking trip last weekend. Nature never fails to amaze me.",
    type: "photo" as const,
    author: "John Doe",
    date: "2024-01-14",
    tags: ["photography", "nature", "mountains"],
    likes: 45,
    comments: 12,
    views: 2500, // Added views
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 3,
    title: "Words of Wisdom",
    content: "The only way to do great work is to love what you do.",
    type: "quote" as const,
    author: "Steve Jobs",
    date: "2024-01-13",
    tags: ["quotes", "inspiration", "motivation"],
    likes: 67,
    comments: 15,
    views: 3100, // Added views
  },
  {
    id: 4,
    title: "Amazing Web Development Resource",
    content:
      "Found this incredible tutorial series that covers everything from basics to advanced concepts. Highly recommended for anyone learning web development!",
    type: "link" as const,
    author: "Jane Smith",
    date: "2024-01-12",
    tags: ["webdev", "tutorial", "learning"],
    likes: 32,
    comments: 6,
    views: 1800, // Added views
    linkUrl: "https://example.com/tutorial",
  },
  {
    id: 5,
    title: "My Latest Music Video",
    content:
      "Just finished editing my latest music video. Can't wait to share it with everyone!",
    type: "video" as const,
    author: "Music Artist",
    date: "2024-01-11",
    tags: ["music", "video", "creative"],
    likes: 89,
    comments: 23,
    views: 5400, // Added views
    videoUrl: "https://www.youtube.com/watch?v=FtBzf8VgSUU",
  },
  {
    id: 6,
    title: "New Podcast Episode",
    content:
      "In this episode, we discuss the future of artificial intelligence and its impact on society.",
    type: "audio" as const,
    author: "Podcast Host",
    date: "2024-01-10",
    tags: ["podcast", "ai", "technology"],
    likes: 56,
    comments: 18,
    views: 2200, // Added views
    audioUrl: "https://example.com/audio",
  },
  {
    id: 7,
    title: "Research Paper on Climate Change",
    content:
      "Sharing my latest research findings on climate change patterns and their long-term implications.",
    type: "file" as const,
    author: "Dr. Research",
    date: "2024-01-09",
    tags: ["research", "climate", "science"],
    likes: 78,
    comments: 34,
    views: 4100, // Added views
    fileUrl: "https://example.com/research.pdf",
  },
];

const PostGrid = () => {
  return (
    <section id="posts" className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-text-primary mb-4">
          Latest Posts
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Discover a diverse collection of content from our community. From
          thoughts and photos to quotes and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          Load More Posts
        </button>
      </div>
    </section>
  );
};

export default PostGrid;