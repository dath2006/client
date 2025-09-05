"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import MarkdownEditor from "../MarkdownEditor";

// --- PROPS INTERFACE ---
interface VideoPostProps {
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
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const errorVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// --- COMPONENT ---
const VideoPost: React.FC<VideoPostProps> = ({ content, onChange, errors }) => {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Video Source Type */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
          Video Source
        </label>
        <div className="flex flex-wrap gap-4">
          <motion.label
            className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <input
              type="radio"
              name="videoSource"
              value="upload"
              checked={content.sourceType !== "url"}
              onChange={() => onChange("sourceType", "upload")}
              className="mr-2 h-4 w-4 accent-[#f7a5a5]"
            />
            Upload File
          </motion.label>
          <motion.label
            className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <input
              type="radio"
              name="videoSource"
              value="url"
              checked={content.sourceType === "url"}
              onChange={() => onChange("sourceType", "url")}
              className="mr-2 h-4 w-4 accent-[#f7a5a5]"
            />
            Video URL
          </motion.label>
        </div>
      </motion.div>

      {/* Video Upload or URL */}
      <AnimatePresence mode="wait">
        {content.sourceType === "url" ? (
          <motion.div key="url" variants={itemVariants} exit="exit">
            <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
              Video URL *
            </label>
            <input
              type="url"
              value={content.videoUrl || ""}
              onChange={(e) => onChange("videoUrl", e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
              placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
            />
            <AnimatePresence>
              {errors?.videoUrl && (
                <motion.p
                  className="text-red-400 text-xs mt-1"
                  {...errorVariants}
                >
                  {errors.videoUrl}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="file" variants={itemVariants} exit="exit">
            <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
              Video File *
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => onChange("videoFile", e.target.files?.[0])}
              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
            />
            <AnimatePresence>
              {errors?.videoFile && (
                <motion.p
                  className="text-red-400 text-xs mt-1"
                  {...errorVariants}
                >
                  {errors.videoFile}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poster Image */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Thumbnail/Poster Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange("posterImage", e.target.files?.[0])}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
      </motion.div>

      {/* Caption/Subtitle Files */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Subtitle Files (Optional)
        </label>
        <input
          type="file"
          accept=".vtt,.srt,.ass"
          multiple
          onChange={(e) =>
            onChange("captionFiles", Array.from(e.target.files || []))
          }
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
        <p className="text-xs text-white/60 mt-1">
          Multiple subtitle files supported (VTT, SRT, ASS)
        </p>
      </motion.div>

      {/* Description with Markdown */}
      <motion.div variants={itemVariants}>
        <MarkdownEditor
          value={content.description || ""}
          onChange={(value: string) => onChange("description", value)}
          placeholder="Describe your video, include chapters, or add information..."
          height="h-32 sm:h-40"
          label="Description"
          showToolbar={true}
        />
      </motion.div>
    </motion.div>
  );
};

export default VideoPost;
