"use client";

import React from "react";
import { Post } from "@/types/post";
import TextPostContent from "./content-types/TextPostContent";
import PhotoPostContent from "./content-types/PhotoPostContent";
import VideoPostContent from "./content-types/VideoPostContent";
import AudioPostContent from "./content-types/AudioPostContent";
import QuotePostContent from "./content-types/QuotePostContent";
import LinkPostContent from "./content-types/LinkPostContent";
import FilePostContent from "./content-types/FilePostContent";

interface PostContentProps {
  post: Post;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const renderContent = () => {
    switch (post.type) {
      case "text":
        return <TextPostContent content={post.content} />;
      case "photo":
        return <PhotoPostContent content={post.content} />;
      case "video":
        return <VideoPostContent content={post.content} />;
      case "audio":
        return <AudioPostContent content={post.content} />;
      case "quote":
        return <QuotePostContent content={post.content} />;
      case "link":
        return <LinkPostContent content={post.content} />;
      case "file":
        return <FilePostContent content={post.content} />;
      default:
        return <TextPostContent content={post.content} />;
    }
  };

  return <div className="prose prose-lg max-w-none">{renderContent()}</div>;
};

export default PostContent;
