"use client";

import React from "react";
import {
  Edit2,
  Trash2,
  Eye,
  Download,
  FileText,
  Image,
  Music,
  Video,
  File,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGlobalPermissions } from "@/hooks/useGlobalPermissions";

interface UploadCardProps {
  upload: {
    id: string;
    fileName: string;
    uploadedAt: Date;
    uploader: {
      name: string;
    };
    size: number;
    mediaType: "image" | "video" | "audio" | "file";
    mimeType: string;
    url?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

const UploadCard = ({
  upload,
  onEdit,
  onDelete,
  onView,
  onDownload,
}: UploadCardProps) => {
  const { canDeleteUploads } = useGlobalPermissions();
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image size={20} className="text-green-400" />;
      case "video":
        return <Video size={20} className="text-blue-400" />;
      case "audio":
        return <Music size={20} className="text-purple-400" />;
      case "file":
      default:
        return <FileText size={20} className="text-gray-400" />;
    }
  };

  const getMediaTypeBadge = (type: string) => {
    switch (type) {
      case "image":
        return "text-green-400 bg-green-400/10";
      case "video":
        return "text-blue-400 bg-blue-400/10";
      case "audio":
        return "text-purple-400 bg-purple-400/10";
      case "file":
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const truncateFileName = (name: string, maxLength: number = 30) => {
    if (name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf("."));
    const truncated = nameWithoutExt.substring(
      0,
      maxLength - extension!.length - 4
    );
    return `${truncated}...${extension}`;
  };

  return (
    <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4 hover:border-[#f7a5a5]/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              {getMediaTypeIcon(upload.mediaType)}
              <h3 className="text-lg font-medium text-[#f7a5a5] hover:text-[#ffdbb6] transition-colors duration-300 cursor-pointer">
                {truncateFileName(upload.fileName)}
              </h3>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getMediaTypeBadge(
                upload.mediaType
              )}`}
            >
              {upload.mediaType.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-[#f7a5a5]/70">
            <div>
              <span className="font-medium">Uploaded:</span>{" "}
              <span>
                {formatDistanceToNow(upload.uploadedAt, { addSuffix: true })}
              </span>
            </div>
            <div>
              <span className="font-medium">Size:</span>{" "}
              <span className="font-mono">{formatFileSize(upload.size)}</span>
            </div>
            <div>
              <span className="font-medium">By:</span>{" "}
              <span>{upload.uploader.name}</span>
            </div>
          </div>

          <div className="mt-2">
            <span className="bg-[#f7a5a5]/10 text-[#f7a5a5]/60 px-2 py-1 rounded text-xs">
              {upload.mimeType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onView(upload.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
            title="View file"
          >
            <Eye size={16} />
          </button>
          {/* <button
            onClick={() => onDownload(upload.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
            title="Download file"
          >
            <Download size={16} />
          </button> */}
          {/* <button
            onClick={() => onEdit(upload.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
            title="Edit file details"
          >
            <Edit2 size={16} />
          </button> */}
          {canDeleteUploads && (
            <button
              onClick={() => onDelete(upload.id)}
              className="p-2 text-[#f7a5a5]/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300"
              title="Delete file"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
