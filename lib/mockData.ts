import { Post, PostType, User } from "@/types/post";

// Mock users
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b1af?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Mike Brown",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
];

// Mock post templates
const mockPostTemplates = [
  {
    type: "text" as PostType,
    title: "Thoughts on Modern Web Development",
    content: {
      body: "Web development has evolved tremendously over the past few years. **React Server Components** are changing how we think about rendering, and *TypeScript* continues to improve developer experience. The ecosystem is more mature than ever.\n\nWhat are your thoughts on the current state of web development?",
    },
    tags: ["webdev", "react", "typescript"],
    category: "Technology",
  },
  {
    type: "photo" as PostType,
    title: "Beautiful Sunset Views",
    content: {
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop",
      ],
      caption:
        "Caught this amazing sunset during my evening walk. Nature never fails to amaze me!",
    },
    tags: ["photography", "sunset", "nature"],
    category: "Photography",
  },
  {
    type: "link" as PostType,
    title: "Interesting Article on AI",
    content: {
      url: "https://example.com/ai-article",
      linkTitle: "The Future of AI in Web Development",
      linkDescription:
        "Exploring how artificial intelligence is reshaping the way we build web applications and what developers need to know.",
      linkThumbnail:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    },
    tags: ["ai", "webdev", "future"],
    category: "Technology",
  },
  {
    type: "quote" as PostType,
    title: "Daily Inspiration",
    content: {
      quote: "The only way to do great work is to love what you do.",
      source: "Steve Jobs",
    },
    tags: ["inspiration", "motivation", "quotes"],
    category: "Inspiration",
  },
  {
    type: "video" as PostType,
    title: "How to Build Better UIs",
    content: {
      videoUrl:
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      videoThumbnail:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=450&fit=crop",
      caption:
        "A comprehensive guide to building intuitive and beautiful user interfaces.",
    },
    tags: ["ui", "design", "tutorial"],
    category: "Design",
  },
  {
    type: "audio" as PostType,
    title: "Podcast Discussion",
    content: {
      audioUrl: "https://sample-audio.com/sample.mp3",
      duration: "15:30",
      audioDescription:
        "Deep dive into the latest trends in software architecture and best practices for scalable applications.",
    },
    tags: ["podcast", "architecture", "software"],
    category: "Technology",
  },
  {
    type: "file" as PostType,
    title: "Project Resources",
    content: {
      files: [
        {
          name: "design-system.pdf",
          url: "/files/design-system.pdf",
          size: 2048000,
          type: "application/pdf",
        },
        {
          name: "component-library.zip",
          url: "/files/component-library.zip",
          size: 5120000,
          type: "application/zip",
        },
      ],
    },
    tags: ["resources", "design", "components"],
    category: "Design",
  },
];

// Generate mock posts
export function generateMockPosts(count: number, startId: number = 1): Post[] {
  const posts: Post[] = [];

  for (let i = 0; i < count; i++) {
    const template = mockPostTemplates[i % mockPostTemplates.length];
    const user = mockUsers[i % mockUsers.length];
    const postId = (startId + i).toString();

    // Create date with some variation
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(createdAt.getHours() - hoursAgo);

    posts.push({
      id: postId,
      title: `${template.title} #${postId}`,
      type: template.type,
      author: user,
      createdAt,
      updatedAt: createdAt,
      status: "published",
      tags: template.tags,
      category: template.category,
      likes: Math.floor(Math.random() * 1000),
      shares: Math.floor(Math.random() * 100),
      saves: Math.floor(Math.random() * 50),
      viewCount: Math.floor(Math.random() * 5000),
      content: template.content,
      comments: [],
    });
  }

  return posts;
}

// Simulate API delay
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mock API function for fetching posts
export async function fetchPosts(
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; hasMore: boolean }> {
  await delay(800 + Math.random() * 400); // Simulate network delay

  const startId = (page - 1) * limit + 1;
  const posts = generateMockPosts(limit, startId);

  // Simulate having a limited number of posts
  const totalPosts = 100;
  const hasMore = startId + limit - 1 < totalPosts;

  return { posts, hasMore };
}
