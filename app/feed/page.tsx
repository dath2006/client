import React from "react";
import InfiniteScrollFeed from "@/components/feed/InfiniteScrollFeed";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-background">
      <InfiniteScrollFeed />
    </div>
  );
}
