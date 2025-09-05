"use client";

import React from "react";
import { motion } from "framer-motion";

// --- New Shimmer Component ---
// This component creates the animated gradient wave effect.
const ShimmerWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-lg p-6">
      {children}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, #3a3a3a20 50%, transparent 100%)",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
};

// --- Updated Skeleton Components ---
// They now use the ShimmerWrapper instead of animate-pulse.

const PostSkeleton: React.FC = () => {
  return (
    <ShimmerWrapper>
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-surface rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded w-32"></div>
          <div className="h-3 bg-surface rounded w-24"></div>
        </div>
      </div>
      {/* ... rest of your PostSkeleton structure ... */}
      <div className="h-6 bg-surface rounded w-3/4 mb-4"></div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="h-4 bg-surface rounded w-5/6"></div>
        <div className="h-4 bg-surface rounded w-4/6"></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-surface rounded-full w-16"></div>
        <div className="h-6 bg-surface rounded-full w-20"></div>
        <div className="h-6 bg-surface rounded-full w-14"></div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
        </div>
        <div className="h-6 bg-surface rounded w-16"></div>
      </div>
    </ShimmerWrapper>
  );
};

const PhotoPostSkeleton: React.FC = () => {
  return (
    <ShimmerWrapper>
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-surface rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded w-32"></div>
          <div className="h-3 bg-surface rounded w-24"></div>
        </div>
      </div>
      {/* ... rest of your PhotoPostSkeleton structure ... */}
      <div className="h-6 bg-surface rounded w-3/4 mb-4"></div>
      <div className="aspect-video bg-surface rounded-lg mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="h-4 bg-surface rounded w-2/3"></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-surface rounded-full w-16"></div>
        <div className="h-6 bg-surface rounded-full w-20"></div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
        </div>
        <div className="h-6 bg-surface rounded w-16"></div>
      </div>
    </ShimmerWrapper>
  );
};

const LinkPostSkeleton: React.FC = () => {
  return (
    <ShimmerWrapper>
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-surface rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded w-32"></div>
          <div className="h-3 bg-surface rounded w-24"></div>
        </div>
      </div>
      {/* ... rest of your LinkPostSkeleton structure ... */}
      <div className="h-6 bg-surface rounded w-3/4 mb-4"></div>
      <div className="border border-border rounded-lg overflow-hidden mb-4">
        <div className="aspect-video bg-surface"></div>
        <div className="p-4 space-y-2">
          <div className="h-5 bg-surface rounded w-3/4"></div>
          <div className="h-4 bg-surface rounded w-full"></div>
          <div className="h-4 bg-surface rounded w-2/3"></div>
          <div className="h-3 bg-surface rounded w-32"></div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
          <div className="h-6 bg-surface rounded w-12"></div>
        </div>
        <div className="h-6 bg-surface rounded w-16"></div>
      </div>
    </ShimmerWrapper>
  );
};

interface FeedSkeletonProps {
  count?: number;
}

// --- Updated FeedSkeleton with Staggered Entrance ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ count = 3 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => {
    const type = index % 3;
    if (type === 0)
      return (
        <motion.div key={index} variants={itemVariants}>
          <PostSkeleton />
        </motion.div>
      );
    if (type === 1)
      return (
        <motion.div key={index} variants={itemVariants}>
          <PhotoPostSkeleton />
        </motion.div>
      );
    return (
      <motion.div key={index} variants={itemVariants}>
        <LinkPostSkeleton />
      </motion.div>
    );
  });

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {skeletons}
    </motion.div>
  );
};

export { PostSkeleton, PhotoPostSkeleton, LinkPostSkeleton, FeedSkeleton };
export default FeedSkeleton;