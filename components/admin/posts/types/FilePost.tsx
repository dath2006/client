"use client";

import React from "react";
import MarkdownEditor from "../MarkdownEditor";
import { FileText, X, Download } from "lucide-react";

interface FilePostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

const FilePost: React.FC<FilePostProps> = ({ content, onChange, errors }) => {
  const handleMultipleFiles = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      onChange("files", fileArray);
    }
  };

  const removeFile = (index: number) => {
    const currentFiles = content.files || [];
    const newFiles = currentFiles.filter((_: any, i: number) => i !== index);
    onChange("files", newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
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
    return types[ext || ""] || "File";
  };

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Files *
        </label>
        <input
          type="file"
          multiple
          onChange={(e) => handleMultipleFiles(e.target.files)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
        {errors?.files && (
          <p className="text-red-400 text-xs mt-1">{errors.files}</p>
        )}
        <p className="text-xs text-white/60 mt-1">
          Upload one or more files to share. All file types are supported.
        </p>
      </div>

      {/* File List */}
      {content.files && content.files.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
            Selected Files ({content.files.length})
          </label>
          <div className="space-y-2">
            {content.files.map((file: File, index: number) => (
              <div
                key={index}
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
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source URL */}

      {/* Description with Markdown */}
      <MarkdownEditor
        value={content.description || ""}
        onChange={(value: string) => onChange("description", value)}
        placeholder="Describe your files. What are they for? How to use them? Installation instructions?"
        height="h-32 sm:h-40"
        label="Description"
        showToolbar={true}
      />
    </div>
  );
};

export default FilePost;
