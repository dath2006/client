"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  return (
    <div className="bg-surface rounded-2xl p-8 mb-12 shadow-lg">
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-muted" />
          </div>
          <input
            type="text"
            placeholder="Search posts, tags, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-background border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
