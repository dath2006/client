"use client";

import {
  FileText,
  Image,
  Quote,
  ExternalLink,
  Video,
  Music,
  File,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
} from "lucide-react";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    type: "text" | "photo" | "quote" | "link" | "video" | "audio" | "file";
    author: string;
    date: string;
    tags: string[];
    likes: number;
    comments: number;
    imageUrl?: string;
    linkUrl?: string;
    fileUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const getPostIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText size={20} className="text-text-secondary" />;
      case "photo":
        return <Image size={20} className="text-text-secondary" />;
      case "quote":
        return <Quote size={20} className="text-text-secondary" />;
      case "link":
        return <ExternalLink size={20} className="text-text-secondary" />;
      case "video":
        return <Video size={20} className="text-text-secondary" />;
      case "audio":
        return <Music size={20} className="text-text-secondary" />;
      case "file":
        return <File size={20} className="text-text-secondary" />;
      default:
        return <FileText size={20} className="text-text-secondary" />;
    }
  };

  const getPostTypeStyles = (type: string) => {
    // Minimal consistent styling for all post types
    return "border-l-4 border-border bg-card";
  };

  const renderPostContent = () => {
    switch (post.type) {
      case "photo":
        return (
          <div className="mb-4">
            <img
              src={post.imageUrl || "/api/placeholder/400/250"}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        );
      case "quote":
        return (
          <div className="mb-4 p-6 bg-surface rounded-lg border-l-4 border-muted">
            <Quote size={24} className="text-text-secondary mb-2" />
            <blockquote className="text-lg italic text-text-primary font-medium">
              "{post.content}"
            </blockquote>
          </div>
        );
      case "link":
        return (
          <div className="mb-4">
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-surface rounded-lg border border-border hover:bg-surface-elevated transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <ExternalLink size={20} className="text-text-secondary" />
                <span className="font-medium text-text-secondary">
                  External Link
                </span>
              </div>
              <p className="text-text-primary">{post.content}</p>
            </a>
          </div>
        );
      case "video":
        return (
          <div className="mb-4">
            <div className="relative aspect-video bg-surface rounded-lg overflow-hidden shadow-md">
              <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                <Video size={48} className="text-text-secondary" />
              </div>
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="mb-4 p-4 bg-surface rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Music size={20} className="text-text-secondary" />
              <span className="font-medium text-text-secondary">
                Audio Post
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-text-secondary h-2 rounded-full w-1/3"></div>
              </div>
              <span className="text-sm text-text-secondary">2:34</span>
            </div>
          </div>
        );
      case "file":
        return (
          <div className="mb-4 p-4 bg-surface rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <File size={20} className="text-text-secondary" />
              <div>
                <span className="font-medium text-text-primary">
                  Document.pdf
                </span>
                <p className="text-sm text-text-secondary">2.4 MB</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <article
      className={`bg-card rounded-xl p-6 card-shadow hover:shadow-lg transition-all duration-300 ${getPostTypeStyles(
        post.type
      )}`}
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getPostIcon(post.type)}
          <div>
            <h2 className="text-xl font-bold text-text-primary hover:text-primary transition-colors cursor-pointer">
              {post.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-text-secondary mt-1">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              <span className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-full font-medium capitalize">
                {post.type}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-surface">
            <Edit size={16} />
          </button>
          <button className="p-2 text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-surface">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Post Content */}
      {renderPostContent()}

      {/* Text Content (for non-quote types) */}
      {post.type !== "quote" && (
        <div className="mb-4">
          <p className="text-text-primary leading-relaxed">{post.content}</p>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-surface text-text-secondary text-sm rounded-full hover:bg-surface-elevated hover:text-text-primary transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <Heart size={18} />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <MessageCircle size={18} />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>

        <button className="text-text-secondary hover:text-text-primary transition-colors font-medium">
          Read More
        </button>
      </div>
    </article>
  );
};

export default PostCard;
