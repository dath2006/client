"use client";
import React from 'react';
import { Heart, MessageCircle, Eye, Link, FileText, Music, Film, Mic, Quote as QuoteIcon } from 'lucide-react';

// --- Type Definition ---
// Defining the shape of a post object for type safety.
type Post = {
  id: number;
  title: string;
  content: string;
  type: 'text' | 'photo' | 'quote' | 'link' | 'video' | 'audio' | 'file';
  author: string;
  date: string;
  tags: string[];
  views: number; // Added views
  likes: number;
  comments: number;
  imageUrl?: string;
  linkUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
};

// --- Helper Functions ---

// Formats large numbers into a more readable format (e.g., 1200 -> 1.2k)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

// Converts a standard YouTube URL to an embeddable URL
const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = url.split('v=')[1];
  const ampersandPosition = videoId.indexOf('&');
  if (ampersandPosition !== -1) {
    return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
  }
  return `https://www.youtube.com/embed/${videoId}`;
};


// --- PostCard Component ---
// This component was missing, so I've created it based on the data provided.
// It dynamically renders different content based on the post's type.

const PostCard = ({ post }: { post: Post }) => {
  
  const PostIcon = ({ type }: { type: Post['type'] }) => {
    const iconProps = { className: "h-6 w-6 text-text-tertiary" };
    switch (type) {
      case 'photo': return <div className="absolute top-4 right-4 bg-card/70 p-2 rounded-full backdrop-blur-sm"><Heart {...iconProps} /></div>;
      case 'quote': return <QuoteIcon {...iconProps} />;
      case 'link': return <Link {...iconProps} />;
      case 'video': return <Film {...iconProps} />;
      case 'audio': return <Mic {...iconProps} />;
      case 'file': return <FileText {...iconProps} />;
      default: return null;
    }
  };

  const renderPostContent = () => {
    switch (post.type) {
      case 'photo':
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 className="text-xl font-bold text-white absolute bottom-4 left-4 right-4">{post.title}</h3>
          </div>
        );
      case 'quote':
        return (
            <blockquote className="text-center p-6 border-l-4 border-primary bg-surface rounded-r-lg">
                <p className="text-2xl font-semibold text-text-primary italic">"{post.content}"</p>
                <cite className="block text-right mt-4 text-text-secondary not-italic">— {post.author}</cite>
            </blockquote>
        );
      case 'video':
        return (
          <div className="aspect-video">
            <iframe
              src={getYouTubeEmbedUrl(post.videoUrl!)}
              title={post.title}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
       case 'link':
        return (
            <a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="block p-6 bg-surface rounded-lg hover:bg-surface-elevated transition-colors">
                <div className="flex items-center space-x-4">
                    <Link className="h-8 w-8 text-primary flex-shrink-0"/>
                    <div>
                        <h3 className="text-lg font-bold text-primary">{post.title}</h3>
                        <p className="text-text-secondary truncate">{post.linkUrl}</p>
                    </div>
                </div>
            </a>
        );
      default:
        return (
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-2">{post.title}</h3>
            <p className="text-text-secondary">{post.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
       {post.type !== 'photo' && post.type !== 'quote' && post.type !== 'link' && (
        <div className="p-6">
            {renderPostContent()}
        </div>
      )}
      {(post.type === 'photo' || post.type === 'quote' || post.type === 'link') && renderPostContent()}
      
      <div className="p-6">
         {/* Footer with author, date, and stats */}
         <div className="flex items-center justify-between text-sm text-text-tertiary">
            <div className="flex items-center space-x-4">
                <span className="font-semibold text-text-secondary">{post.author}</span>
                <span>&bull;</span>
                <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-4">
                {/* Views count added here, to the left of likes */}
                <span className="flex items-center space-x-1 hover:text-primary transition-colors cursor-pointer">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(post.views)}</span>
                </span>
                <span className="flex items-center space-x-1 hover:text-primary transition-colors cursor-pointer">
                    <Heart className="h-4 w-4" />
                    <span>{formatNumber(post.likes)}</span>
                </span>
                <span className="flex items-center space-x-1 hover:text-primary transition-colors cursor-pointer">
                    <MessageCircle className="h-4 w-4" />
                    <span>{formatNumber(post.comments)}</span>
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};


// --- Mock Data ---
// Added a `views` property to each post object.
const mockPosts: Post[] = [
  {
    id: 1,
    title: "Welcome to the Future of Blogging",
    content: "Chyrp Lite Reimagine brings a fresh perspective to content management. With its modern interface and powerful features, creating and managing content has never been easier.",
    type: "text" as const,
    author: "Admin",
    date: "2024-01-15",
    tags: ["blogging", "cms", "web"],
    views: 1200,
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    title: "Beautiful Mountain Landscape",
    content: "Captured this stunning view during my hiking trip last weekend. Nature never fails to amaze me.",
    type: "photo" as const,
    author: "John Doe",
    date: "2024-01-14",
    tags: ["photography", "nature", "mountains"],
    views: 5400,
    likes: 45,
    comments: 12,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Words of Wisdom",
    content: "The only way to do great work is to love what you do.",
    type: "quote" as const,
    author: "Steve Jobs",
    date: "2024-01-13",
    tags: ["quotes", "inspiration", "motivation"],
    views: 8900,
    likes: 67,
    comments: 15,
  },
  {
    id: 4,
    title: "Amazing Web Development Resource",
    content: "Found this incredible tutorial series that covers everything from basics to advanced concepts. Highly recommended for anyone learning web development!",
    type: "link" as const,
    author: "Jane Smith",
    date: "2024-01-12",
    tags: ["webdev", "tutorial", "learning"],
    views: 2100,
    likes: 32,
    comments: 6,
    linkUrl: "https://example.com/tutorial",
  },
  {
    id: 5,
    title: "My Latest Music Video",
    content: "Just finished editing my latest music video. Can't wait to share it with everyone!",
    type: "video" as const,
    author: "Music Artist",
    date: "2024-01-11",
    tags: ["music", "video", "creative"],
    views: 15200,
    likes: 89,
    comments: 23,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 6,
    title: "New Podcast Episode",
    content: "In this episode, we discuss the future of artificial intelligence and its impact on society.",
    type: "audio" as const,
    author: "Podcast Host",
    date: "2024-01-10",
    tags: ["podcast", "ai", "technology"],
    views: 4500,
    likes: 56,
    comments: 18,
    audioUrl: "https://example.com/audio",
  },
  {
    id: 7,
    title: "Research Paper on Climate Change",
    content: "Sharing my latest research findings on climate change patterns and their long-term implications.",
    type: "file" as const,
    author: "Dr. Research",
    date: "2024-01-09",
    tags: ["research", "climate", "science"],
    views: 11300,
    likes: 78,
    comments: 34,
    fileUrl: "https://example.com/research.pdf",
  },
];


// --- Main PostGrid Component ---

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="bg-primary text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-secondary hover:shadow-xl transition-all duration-300">
          Load More Posts
        </button>
      </div>
    </section>
  );
};

export default PostGrid;
