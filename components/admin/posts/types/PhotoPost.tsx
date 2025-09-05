"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import MarkdownEditor from "../MarkdownEditor";
import { Image, X } from "lucide-react";

// --- PROPS INTERFACE ---
interface PhotoPostProps {
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
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};

const errorVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// --- COMPONENT ---
const PhotoPost: React.FC<PhotoPostProps> = ({ content, onChange, errors }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Effect to create and clean up object URLs for image previews
  useEffect(() => {
    if (!content.imageFiles || content.imageFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }
    const objectUrls = content.imageFiles.map((file: File) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls(objectUrls);

    // Cleanup function to revoke URLs and prevent memory leaks
    return () => {
      objectUrls.forEach((url: string) => URL.revokeObjectURL(url));
    };
  }, [content.imageFiles]);

  const handleMultipleFiles = (files: FileList | null) => {
    if (files) {
      onChange("imageFiles", [
        ...(content.imageFiles || []),
        ...Array.from(files),
      ]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newFiles = (content.imageFiles || []).filter(
      (_: any, index: number) => index !== indexToRemove
    );
    onChange("imageFiles", newFiles);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Image Upload */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Images *
        </label>
        <div className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultipleFiles(e.target.files)}
            className="w-full bg-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
          />
        </div>
        <AnimatePresence>
          {errors?.imageFiles && (
            <motion.p
              className="text-red-400 text-xs mt-1"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {errors.imageFiles}
            </motion.p>
          )}
        </AnimatePresence>
        <p className="text-xs text-white/60 mt-1">
          Select multiple images to create a gallery.
        </p>
      </motion.div>

      {/* Image Preview */}
      <AnimatePresence>
        {content.imageFiles && content.imageFiles.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              Selected Images ({content.imageFiles.length})
            </label>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={containerVariants}
            >
              <AnimatePresence>
                {content.imageFiles.map((file: File, index: number) => (
                  <motion.div
                    key={previewUrls[index] || file.name}
                    layout
                    variants={itemVariants}
                    exit="exit"
                  >
                    <div className="relative group aspect-square">
                      <img
                        src={previewUrls[index]}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg border border-[#f7a5a5]/20"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                      <motion.button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                    <p className="text-xs text-white/60 mt-1 truncate">
                      {file.name}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other Form Fields */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Alternative Text
        </label>
        <input
          type="text"
          value={content.altText || ""}
          onChange={(e) => onChange("altText", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
          placeholder="Describe the images for accessibility..."
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Source URL (Optional)
        </label>
        <input
          type="url"
          value={content.sourceUrl || ""}
          onChange={(e) => onChange("sourceUrl", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
          placeholder="https://source.com"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <MarkdownEditor
          value={content.caption || ""}
          onChange={(value: string) => onChange("caption", value)}
          placeholder="Add a caption to your photos..."
          height="h-24 sm:h-32"
          label="Caption"
          showToolbar={true}
        />
      </motion.div>
    </motion.div>
  );
};

export default PhotoPost;
