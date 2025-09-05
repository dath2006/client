"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Plus } from "lucide-react";

interface PostsErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  onNew?: () => void;
}

const PostsErrorFallback: React.FC<PostsErrorFallbackProps> = ({
  error,
  onRetry,
  onNew,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
      <AlertTriangle className="w-16 h-16 text-error mb-4" />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Failed to load posts
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error?.message ||
          "There was an error loading the posts. This could be due to a network issue or server problem."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry || (() => window.location.reload())}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Loading
        </button>

        {onNew && (
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-surface transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </button>
        )}
      </div>

      <div className="mt-8 text-xs text-muted-foreground">
        <p>If this problem persists, please contact support.</p>
      </div>
    </div>
  );
};

export default PostsErrorFallback;
