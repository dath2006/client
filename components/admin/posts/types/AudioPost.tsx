"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import MarkdownEditor from "../MarkdownEditor";

// --- PROPS INTERFACE ---
interface AudioPostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const errorVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// --- COMPONENT ---
const AudioPost: React.FC<AudioPostProps> = ({ content, onChange, errors }) => {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Audio File Upload */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Audio File *
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => onChange("audioFile", e.target.files?.[0])}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
        <AnimatePresence>
          {errors?.audioFile && (
            <motion.p
              className="text-red-400 text-xs mt-1"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {errors.audioFile}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Caption/Transcript File */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Transcript File (Optional)
        </label>
        <input
          type="file"
          accept=".vtt,.srt,.ass,.txt"
          onChange={(e) => onChange("captionFile", e.target.files?.[0])}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
        <p className="text-xs text-white/60 mt-1">
          Supported formats: VTT, SRT, ASS, TXT
        </p>
      </motion.div>

      {/* Description with Markdown */}
      <motion.div variants={itemVariants}>
        <MarkdownEditor
          value={content.description || ""}
          onChange={(value: string) => onChange("description", value)}
          placeholder="Describe your audio content, show notes, or episode summary..."
          height="h-32 sm:h-40"
          label="Description"
          showToolbar={true}
        />
      </motion.div>
    </motion.div>
  );
};

export default AudioPost;
