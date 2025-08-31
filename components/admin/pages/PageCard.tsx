"use client";

import React from "react";
import { Edit2, Trash2, Eye, User, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PageCardProps {
  page: {
    id: string;
    title: string;
    editedDate: Date;
    views: number;
    author: {
      name: string;
    };
    status: "published" | "draft" | "archived";
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PageCard = ({ page, onEdit, onDelete }: PageCardProps) => {
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
    <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4 hover:border-[#f7a5a5]/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
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

          <div className="flex items-center gap-4 text-sm text-[#f7a5a5]/70">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                {formatDistanceToNow(page.editedDate, { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span className="font-mono">{page.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{page.author.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(page.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(page.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageCard;
