"use client";

import React from "react";

const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-surface rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded w-32"></div>
          <div className="h-3 bg-surface rounded w-24"></div>
        </div>
      </div>

      {/* Title */}
      <div className="h-6 bg-surface rounded w-3/4 mb-4"></div>

      {/* Content placeholder - varies by type */}
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="h-4 bg-surface rounded w-5/6"></div>
        <div className="h-4 bg-surface rounded w-4/6"></div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-surface rounded-full w-16"></div>
        <div className="h-6 bg-surface rounded-full w-20"></div>
        <div className="h-6 bg-surface rounded-full w-14"></div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
        </div>
        <div className="h-6 bg-surface rounded w-16"></div>
      </div>
    </div>
  );
};

const PhotoPostSkeleton: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-surface rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded w-32"></div>
          <div className="h-3 bg-surface rounded w-24"></div>
        </div>
      </div>

      {/* Title */}
      <div className="h-6 bg-surface rounded w-3/4 mb-4"></div>

      {/* Photo placeholder */}
      <div className="aspect-video bg-surface rounded-lg mb-4"></div>

      {/* Caption */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="h-4 bg-surface rounded w-2/3"></div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-surface rounded-full w-16"></div>
        <div className="h-6 bg-surface rounded-full w-20"></div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
        </div>
        <div className="h-6 bg-surface rounded w-16"></div>
      </div>
    </div>
  );
};

const LinkPostSkeleton: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-surface rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded w-32"></div>
          <div className="h-3 bg-surface rounded w-24"></div>
        </div>
      </div>

      {/* Title */}
      <div className="h-6 bg-surface rounded w-3/4 mb-4"></div>

      {/* Link preview */}
      <div className="border border-border rounded-lg overflow-hidden mb-4">
        <div className="aspect-video bg-surface"></div>
        <div className="p-4 space-y-2">
          <div className="h-5 bg-surface rounded w-3/4"></div>
          <div className="h-4 bg-surface rounded w-full"></div>
          <div className="h-4 bg-surface rounded w-2/3"></div>
          <div className="h-3 bg-surface rounded w-32"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
        </div>
        <div className="h-6 bg-surface rounded w-16"></div>
      </div>
    </div>
  );
};

interface FeedSkeletonProps {
  count?: number;
}

const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ count = 3 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => {
    // Vary skeleton types for more realistic loading
    const type = index % 3;
    if (type === 0) return <PostSkeleton key={index} />;
    if (type === 1) return <PhotoPostSkeleton key={index} />;
    return <LinkPostSkeleton key={index} />;
  });

  return <div className="space-y-6">{skeletons}</div>;
};

export { PostSkeleton, PhotoPostSkeleton, LinkPostSkeleton, FeedSkeleton };
export default FeedSkeleton;
