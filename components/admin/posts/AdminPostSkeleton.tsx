"use client";

import React from "react";

const AdminPostSkeleton: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      {/* Header with status and actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-surface rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            {/* Author name */}
            <div className="h-4 bg-surface rounded w-24"></div>
            {/* Date */}
            <div className="h-3 bg-surface rounded w-20"></div>
          </div>
        </div>
        {/* Status badge */}
        <div className="h-6 bg-surface rounded-full w-20"></div>
      </div>

      {/* Title */}
      <div className="h-6 bg-surface rounded w-3/4 mb-3"></div>

      {/* Category */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-4 h-4 bg-surface rounded"></div>
        <div className="h-4 bg-surface rounded w-20"></div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-surface rounded-full w-16"></div>
        <div className="h-6 bg-surface rounded-full w-12"></div>
        <div className="h-6 bg-surface rounded-full w-20"></div>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-6 mb-4">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-surface rounded"></div>
          <div className="h-4 bg-surface rounded w-8"></div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-surface rounded"></div>
          <div className="h-4 bg-surface rounded w-8"></div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-surface rounded"></div>
          <div className="h-4 bg-surface rounded w-12"></div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-surface rounded"></div>
          <div className="h-4 bg-surface rounded w-8"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2">
        <div className="w-8 h-8 bg-surface rounded"></div>
        <div className="w-8 h-8 bg-surface rounded"></div>
      </div>
    </div>
  );
};

const AdminPostsSkeletonList: React.FC<{ count?: number }> = ({
  count = 5,
}) => {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <AdminPostSkeleton key={index} />
      ))}
    </div>
  );
};

export { AdminPostSkeleton, AdminPostsSkeletonList };
export default AdminPostsSkeletonList;
