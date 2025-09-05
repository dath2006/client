"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

// --- FRAMER MOTION VARIANTS ---

const containerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

// --- SKELETON COMPONENTS ---

const Shimmer: React.FC = () => (
  <motion.div
    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
    animate={{
      x: ["-100%", "100%"],
    }}
    transition={{
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    }}
  />
);

const SkeletonElement: React.FC<{ className: string }> = ({ className }) => (
  <div className={`${className} bg-surface rounded`} />
);

const AdminPostSkeleton: React.FC = () => {
  return (
    <div className="relative bg-card border border-border rounded-lg p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <SkeletonElement className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <SkeletonElement className="h-4 w-24" />
            <SkeletonElement className="h-3 w-20" />
          </div>
        </div>
        <SkeletonElement className="h-6 rounded-full w-20" />
      </div>

      {/* Title & Category */}
      <SkeletonElement className="h-6 w-3/4 mb-3" />
      <div className="flex items-center space-x-2 mb-4">
        <SkeletonElement className="w-4 h-4" />
        <SkeletonElement className="h-4 w-20" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <SkeletonElement className="h-6 rounded-full w-16" />
        <SkeletonElement className="h-6 rounded-full w-12" />
        <SkeletonElement className="h-6 rounded-full w-20" />
      </div>

      {/* Stats & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <SkeletonElement className="w-4 h-4" />
            <SkeletonElement className="h-4 w-8" />
          </div>
          <div className="flex items-center space-x-1">
            <SkeletonElement className="w-4 h-4" />
            <SkeletonElement className="h-4 w-8" />
          </div>
          <div className="flex items-center space-x-1">
            <SkeletonElement className="w-4 h-4" />
            <SkeletonElement className="h-4 w-12" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <SkeletonElement className="w-8 h-8" />
          <SkeletonElement className="w-8 h-8" />
        </div>
      </div>

      <Shimmer />
    </div>
  );
};

const AdminPostsSkeletonList: React.FC<{ count?: number }> = ({
  count = 5,
}) => {
  return (
    <motion.div
      className="grid gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div key={index} variants={itemVariants}>
          <AdminPostSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
};

export { AdminPostSkeleton, AdminPostsSkeletonList };
export default AdminPostsSkeletonList;
