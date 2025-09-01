"use client";

import React from "react";
import { PostContent } from "@/types/post";
import { Download, File, FileText, Image, Music, Video } from "lucide-react";

interface FilePostContentProps {
  content: PostContent;
}

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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {content.files.length === 1 ? "Attached File" : "Attached Files"}
      </h3>

      <div className="grid gap-4">
        {content.files.map((file, index) => {
          const FileIcon = getFileIcon(file.type);
          const colorClass = getFileTypeColor(file.type);

          return (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                {/* File Icon */}
                <div
                  className={`w-12 h-12 rounded-lg bg-surface flex items-center justify-center ${colorClass}`}
                >
                  <FileIcon size={24} />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary truncate">
                    {file.name}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {formatFileSize(file.size)} •{" "}
                    {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                  </p>
                </div>

                {/* Download Button */}
                <a
                  href={file.url}
                  download={file.name}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch Download (if multiple files) */}
      {content.files.length > 1 && (
        <div className="pt-4 border-t border-border">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface text-text-primary rounded-lg hover:bg-surface-elevated transition-colors">
            <Download size={16} />
            <span>Download All ({content.files.length} files)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FilePostContent;
