"use client";

import React from "react";
import {
  Edit2,
  Trash2,
  Eye,
  User,
  Calendar,
  Globe,
  List,
  Check,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGlobalPermissions } from "@/hooks/useGlobalPermissions";

interface PageCardProps {
  page: {
    id: string;
    title: string;
    createdDate: Date;
    editedDate: Date;
    views: number;
    isPublic: boolean;
    isListed: boolean;
    author: {
      name: string;
    };
    status: "published" | "draft" | "archived";
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PageCard = ({ page, onEdit, onDelete }: PageCardProps) => {
  const { canDeletePages, canEditPages } = useGlobalPermissions();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-400 bg-green-400/10";
      case "draft":
        return "text-yellow-400 bg-yellow-400/10";
      case "archived":
        return "text-[#f7a5a5]/70 bg-[#f7a5a5]/10";
      default:
        return "text-[#f7a5a5]/70 bg-[#f7a5a5]/10";
    }
  };

  return (
    <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg overflow-hidden hover:border-[#f7a5a5]/50 transition-all duration-300">
      {/* Header with Title and Status */}
      <div className="p-4 border-b border-[#f7a5a5]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-[#f7a5a5] hover:text-[#ffdbb6] transition-colors duration-300 cursor-pointer">
              {page.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                page.status
              )}`}
            >
              {page.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {canEditPages && (
              <button
                onClick={() => onEdit(page.id)}
                className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
                title="Edit page"
              >
                <Edit2 size={16} />
              </button>
            )}
            {canDeletePages && (
              <button
                onClick={() => onDelete(page.id)}
                className="p-2 text-[#f7a5a5]/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                title="Delete page"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Created */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-xs text-[#f7a5a5]/60 mb-1">
              <Calendar size={12} />
              <span>Created</span>
            </div>
            <span className="text-sm text-[#f7a5a5]/90">
              {page.createdDate.toLocaleDateString()}
            </span>
            <span className="text-xs text-[#f7a5a5]/60">
              {formatDistanceToNow(page.createdDate, { addSuffix: true })}
            </span>
          </div>

          {/* Last Updated */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-xs text-[#f7a5a5]/60 mb-1">
              <Calendar size={12} />
              <span>Last Updated</span>
            </div>
            <span className="text-sm text-[#f7a5a5]/90">
              {page.editedDate.toLocaleDateString()}
            </span>
            <span className="text-xs text-[#f7a5a5]/60">
              {formatDistanceToNow(page.editedDate, { addSuffix: true })}
            </span>
          </div>

          {/* Author */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-xs text-[#f7a5a5]/60 mb-1">
              <User size={12} />
              <span>Author</span>
            </div>
            <span className="text-sm text-[#f7a5a5]/90">
              {page.author.name}
            </span>
            <div className="flex items-center gap-1 text-xs text-[#f7a5a5]/60">
              <Eye size={10} />
              <span>{page.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Public & Listed Status */}
          <div className="flex flex-col">
            <div className="text-xs text-[#f7a5a5]/60 mb-1">Status</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Globe size={12} />
                  <span className="text-xs text-[#f7a5a5]/70">Public:</span>
                </div>
                {page.isPublic ? (
                  <div className="flex items-center gap-1">
                    <Check size={12} className="text-green-400" />
                    <span className="text-xs text-green-400">Yes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <X size={12} className="text-red-400" />
                    <span className="text-xs text-red-400">No</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <List size={12} />
                  <span className="text-xs text-[#f7a5a5]/70">Listed:</span>
                </div>
                {page.isListed ? (
                  <div className="flex items-center gap-1">
                    <Check size={12} className="text-green-400" />
                    <span className="text-xs text-green-400">Yes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <X size={12} className="text-red-400" />
                    <span className="text-xs text-red-400">No</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCard;
