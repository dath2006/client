"use client";

import React from "react";
import { Edit2, Trash2, Users, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    userCount: number;
    createdAt: Date;
    description?: string;
    permissions: string[];
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const GroupCard = ({ group, onEdit, onDelete }: GroupCardProps) => {
  const getGroupColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "admin":
        return "text-red-400 bg-red-400/10";
      case "member":
        return "text-green-400 bg-green-400/10";
      case "friend":
        return "text-blue-400 bg-blue-400/10";
      case "banned":
        return "text-gray-400 bg-gray-400/10";
      case "guest":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-[#f7a5a5]/70 bg-[#f7a5a5]/10";
    }
  };

  const isSystemGroup = (name: string) => {
    return ["admin", "member", "friend", "banned", "guest"].includes(
      name.toLowerCase()
    );
  };

  return (
    <div className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4 hover:border-[#f7a5a5]/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-medium text-[#f7a5a5] hover:text-[#ffdbb6] transition-colors duration-300 cursor-pointer">
              {group.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getGroupColor(
                group.name
              )}`}
            >
              {isSystemGroup(group.name) ? "System" : "Custom"}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-2 text-sm text-[#f7a5a5]/70">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>
                {group.userCount} {group.userCount === 1 ? "user" : "users"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                Created{" "}
                {formatDistanceToNow(group.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>

          {group.description && (
            <p className="text-xs text-[#f7a5a5]/60 mb-2">
              {group.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1">
            {group.permissions.slice(0, 3).map((permission) => (
              <span
                key={permission}
                className="bg-[#f7a5a5]/10 text-[#f7a5a5]/70 px-2 py-1 rounded text-xs"
              >
                {permission}
              </span>
            ))}
            {group.permissions.length > 3 && (
              <span className="bg-[#f7a5a5]/10 text-[#f7a5a5]/70 px-2 py-1 rounded text-xs">
                +{group.permissions.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(group.id)}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-all duration-300"
            title="Edit group"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(group.id)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isSystemGroup(group.name)
                ? "text-[#f7a5a5]/30 cursor-not-allowed"
                : "text-[#f7a5a5]/70 hover:text-red-500 hover:bg-red-500/10"
            }`}
            title={
              isSystemGroup(group.name)
                ? "Cannot delete system group"
                : "Delete group"
            }
            disabled={isSystemGroup(group.name)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
