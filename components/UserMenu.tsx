"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Settings } from "lucide-react";
import { useState } from "react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (status === "loading") return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>;

  if (session) {
    return (
      <div className="relative">
        {/* User Avatar/Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <User size={16} />
          <span className="text-sm font-medium">{session.user?.name}</span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-primary/20 py-2 z-50">
            <div className="px-4 py-2 border-b border-primary/10">
              <p className="text-sm font-medium text-text-primary">{session.user?.name}</p>
              <p className="text-xs text-text-secondary">{session.user?.email}</p>
            </div>
            
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Navigate to profile page when implemented
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-primary/10 transition-colors"
            >
              <Settings size={16} />
              Profile Settings
            </button>
            
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  return null;
}
