"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import MarkdownEditor from "../MarkdownEditor";
import { FileText, X } from "lucide-react";

// --- PROPS INTERFACE ---
interface FilePostProps {
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
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const errorVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// --- HELPER FUNCTIONS ---
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getFileType = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const types: { [key: string]: string } = {
    pdf: "PDF Document",
    doc: "Word Document",
    docx: "Word Document",
    xls: "Excel Spreadsheet",
    xlsx: "Excel Spreadsheet",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
    txt: "Text File",
    zip: "Archive",
    rar: "Archive",
    mp3: "Audio",
    mp4: "Video",
    jpg: "Image",
    jpeg: "Image",
    png: "Image",
    gif: "Image",
  };
  return types[ext] || "File";
};

// --- COMPONENT ---
const FilePost: React.FC<FilePostProps> = ({ content, onChange, errors }) => {
  const handleMultipleFiles = (files: FileList | null) => {
    if (files) {
      onChange("files", [...(content.files || []), ...Array.from(files)]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const newFiles = (content.files || []).filter(
      (_: any, index: number) => index !== indexToRemove
    );
    onChange("files", newFiles);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* File Upload */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Files *
        </label>
        <div className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg">
          <input
            type="file"
            multiple
            onChange={(e) => handleMultipleFiles(e.target.files)}
            className="w-full bg-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
          />
        </div>
        <AnimatePresence>
          {errors?.files && (
            <motion.p
              className="text-red-400 text-xs mt-1"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {errors.files}
            </motion.p>
          )}
        </AnimatePresence>
        <p className="text-xs text-white/60 mt-1">
          Upload one or more files to share.
        </p>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {content.files && content.files.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              Selected Files ({content.files.length})
            </label>
            <div className="space-y-2">
              <AnimatePresence>
                {content.files.map((file: File, index: number) => (
                  <motion.div
                    key={`${file.name}-${file.lastModified}`}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center justify-between p-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText
                        size={20}
                        className="text-[#f7a5a5] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-white/60">
                          {getFileType(file.name)} • {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-400 hover:text-red-300 rounded-full flex-shrink-0"
                      whileHover={{
                        scale: 1.2,
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={16} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description with Markdown */}
      <motion.div variants={itemVariants}>
        <MarkdownEditor
          value={content.description || ""}
          onChange={(value: string) => onChange("description", value)}
          placeholder="Describe your files. What are they for? How to use them?"
          height="h-32 sm:h-40"
          label="Description"
          showToolbar={true}
        />
      </motion.div>
    </motion.div>
  );
};

export default FilePost;
