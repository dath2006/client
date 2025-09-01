"use client";

import React from "react";
import { Search, Plus } from "lucide-react";

interface SearchHeaderProps {
  title: string;
  onSearch: (query: string) => void;
  onNew: () => void;
}

const SearchHeader = ({ title, onSearch, onNew }: SearchHeaderProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-full
            text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
            transition-all duration-300"
            onChange={(e) => onSearch(e.target.value)}
            suppressHydrationWarning={true}
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f7a5a5]/50"
            size={20}
          />
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-6 py-3 bg-[#f7a5a5] text-[#5d688a] rounded-full
          hover:bg-[#ffdbb6] transition-colors duration-300 font-medium"
          suppressHydrationWarning={true}
        >
          <Plus size={20} />
          New {title}
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
