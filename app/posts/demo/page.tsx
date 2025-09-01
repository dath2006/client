"use client";

import React from "react";
import PostView from "@/components/posts/PostView";

export default function PostViewDemo() {
  const handleBack = () => {
    // In a real app, this would navigate back to the posts list
    console.log("Navigate back to posts list");
  };

  return (
    <div>
      <PostView postId="1" onBack={handleBack} />
    </div>
  );
}
