"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlobalLoadingProps {
  /** Custom loading message */
  message?: string;
  /** Show detailed loading state */
  showDetails?: boolean;
  /** Custom logo/icon */
  logo?: React.ReactNode;
}

/**
 * Global loading screen that shows during initial site settings load
 * This covers the entire viewport while the app is initializing
 */
export function GlobalLoading({
  message = "Loading Chyrp Lite...",
  showDetails = false,
  logo,
}: GlobalLoadingProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-4">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {logo || (
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="w-full h-full bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CL</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading Spinner and Message */}
        <motion.div
          className="flex items-center justify-center space-x-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div
            className="rounded-full h-8 w-8 border-b-2 border-t-2 border-blue-600 dark:border-blue-500"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
            }}
          />
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {message}
          </span>
        </motion.div>

        {/* Details */}
        {showDetails && (
          <motion.div
            className="text-sm text-gray-600 dark:text-gray-400 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <p>Initializing site settings...</p>
            <p>This should only take a moment.</p>
          </motion.div>
        )}

        {/* Subtle progress animation */}
        <div className="w-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
          <motion.div
            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.2,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Minimal global loading component for faster renders
 */
export function GlobalLoadingMinimal() {
  return (
    <motion.div
      className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600 dark:border-blue-500"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }} // Adds a subtle pulse
        transition={{
          rotate: {
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          },
          scale: {
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          },
        }}
      />
    </motion.div>
  );
}