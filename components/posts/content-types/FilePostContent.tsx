"use client";

import React from "react";
import { motion } from "framer-motion";
import { PostContent } from "@/types/post";
import { Download, File, FileText, Image, Music, Video } from "lucide-react";

interface FilePostContentProps {
  content: PostContent;
}

// Animation variants for the container and list items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FilePostContent: React.FC<FilePostContentProps> = ({ content }) => {
  if (!content.files || content.files.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("video/")) return Video;
    if (type.startsWith("audio/")) return Music;
    if (type.includes("text") || type.includes("document")) return FileText;
    return File;
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith("image/")) return "text-green-500";
    if (type.startsWith("video/")) return "text-red-500";
    if (type.startsWith("audio/")) return "text-purple-500";
    if (type.includes("text") || type.includes("document"))
      return "text-blue-500";
    return "text-gray-500";
  };

  const handleDownloadAll = () => {
    // FIX: Added optional chaining (?.) to safely handle cases where files might be undefined.
    content.files?.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 300);
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.h3
        variants={itemVariants}
        className="text-lg font-semibold text-text-primary mb-4"
      >
        {content.files.length === 1 ? "Attached File" : "Attached Files"}
      </motion.h3>

      <motion.div variants={containerVariants} className="grid gap-4">
        {content.files.map((file, index) => {
          const FileIcon = getFileIcon(file.type);
          const colorClass = getFileTypeColor(file.type);

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 8px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-surface flex items-center justify-center ${colorClass}`}
                >
                  <FileIcon size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className="font-medium text-text-primary truncate"
                    title={file.name}
                  >
                    {file.name}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {formatFileSize(file.size)} •{" "}
                    {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                  </p>
                </div>

                <motion.a
                  href={file.url}
                  download={file.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  title={`Download ${file.name}`}
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Download</span>
                </motion.a>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {content.files.length > 1 && (
        <motion.div
          variants={itemVariants}
          className="pt-4 border-t border-border"
        >
          <motion.button
            onClick={handleDownloadAll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-surface text-text-primary rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <Download size={16} />
            <span>Download All ({content.files.length} files)</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilePostContent;
