"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import MarkdownEditor from "../MarkdownEditor";
import { ExternalLink, Image, Loader } from "lucide-react";

// --- PROPS INTERFACE ---
interface LinkPostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const errorVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// --- COMPONENT ---
const LinkPost: React.FC<LinkPostProps> = ({ content, onChange, errors }) => {
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const loadPreview = async () => {
    if (!content.url || isLoadingPreview) return;

    setIsLoadingPreview(true);
    setPreviewData(null); // Reset previous preview
    try {
      // Simulate API fetch for metadata
      setTimeout(() => {
        setPreviewData({
          title: "Framer Motion: The Ultimate Guide to Animations in React",
          description:
            "Learn how to create beautiful, fluid animations in your React applications with Framer Motion. This guide covers everything from basics to advanced layout animations.",
          image: "https://example.com/image.jpg", // Simulate having an image
          siteName: "css-tricks.com",
        });
        setIsLoadingPreview(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to load preview:", error);
      setIsLoadingPreview(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* URL Input */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          URL *
        </label>
        <div className="flex gap-2">
          <motion.input
            type="url"
            value={content.url || ""}
            onChange={(e) => onChange("url", e.target.value)}
            className="flex-1 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="https://example.com"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            type="button"
            onClick={loadPreview}
            disabled={!content.url || isLoadingPreview}
            className="px-4 py-2 bg-[#f7a5a5] text-white rounded-lg hover:bg-[#f7a5a5]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 w-32"
            whileHover={{ scale: !content.url || isLoadingPreview ? 1 : 1.05 }}
            whileTap={{ scale: !content.url || isLoadingPreview ? 1 : 0.95 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isLoadingPreview ? "loading" : "ready"}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {isLoadingPreview ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <ExternalLink size={16} />
                )}
                {isLoadingPreview ? "Loading..." : "Preview"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
        <AnimatePresence>
          {errors?.url && (
            <motion.p
              className="text-red-400 text-xs mt-1"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {errors.url}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Link Preview */}
      <AnimatePresence>
        {previewData && (
          <motion.div
            className="p-4 bg-white/5 border border-[#f7a5a5]/20 rounded-lg"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            layout
          >
            <h4 className="text-sm font-medium text-[#f7a5a5] mb-2">
              Link Preview
            </h4>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Image size={32} className="text-[#f7a5a5]/50" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-white truncate">
                  {previewData.title}
                </h5>
                <p className="text-sm text-white/70 mt-1 line-clamp-3">
                  {previewData.description}
                </p>
                <p className="text-xs text-[#f7a5a5] mt-2">
                  {previewData.siteName}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description/Commentary */}
      <motion.div variants={itemVariants}>
        <MarkdownEditor
          value={content.description || ""}
          onChange={(value: string) => onChange("description", value)}
          placeholder="Why are you sharing this link? Add your thoughts or a summary..."
          height="h-32 sm:h-40"
          label="Description/Commentary"
          showToolbar={true}
        />
      </motion.div>
    </motion.div>
  );
};

export default LinkPost;
