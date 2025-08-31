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

        <div className="flex items-center justify-center gap-4">
          <Filter size={16} className="text-muted" />
          <div className="flex gap-2">
            {[
              "all",
              "text",
              "photo",
              "quote",
              "link",
              "video",
              "audio",
              "file",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize
                  ${
                    selectedFilter === filter
                      ? "bg-primary text-background shadow-md"
                      : "bg-card text-secondary hover:bg-primary/10 hover:text-primary"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
