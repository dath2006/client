export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}

export interface PostContent {
  // Text post
  body?: string;

  // Photo post
  images?: string[];
  caption?: string;

  // Video post
  videoUrl?: string;
  videoFile?: File;
  videoThumbnail?: string;

  // Audio post
  audioUrl?: string;
  audioFile?: File;
  duration?: string;
  audioDescription?: string;

  // Quote post
  quote?: string;
  source?: string;

  // Link post
  url?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkThumbnail?: string;

  // File post
  files?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
}

export type PostType =
  | "text"
  | "photo"
  | "video"
  | "audio"
  | "quote"
  | "link"
  | "file";
export type PostStatus = "published" | "draft" | "private" | "scheduled";

export interface Post {
  id: string;
  title: string;
  type: PostType;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  status: PostStatus;
  tags: string[];
  category: string;
  likes: number;
  shares: number;
  saves: number;
  viewCount: number;
  content: PostContent;
  comments: Comment[];
  imageUrl?: string;
}
