"use client";

import React from "react";
import PostView from "@/components/posts/PostView";
import { useRouter } from "next/navigation";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({ params }: PostPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  console.log(resolvedParams.id);

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <PostView postId={resolvedParams.id} onBack={handleBack} />
    </div>
  );
}
