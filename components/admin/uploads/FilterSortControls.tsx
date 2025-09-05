"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ArrowUpDown } from "lucide-react";

interface FilterSortControlsProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  filterType: string;
  onSortChange: (field: string) => void;
  onFilterChange: (type: string) => void;
}

const FilterSortControls = ({
  sortBy,
  sortOrder,
  filterType,
  onSortChange,
  onFilterChange,
}: FilterSortControlsProps) => {
  const sortOptions = [
    { value: "fileName", label: "Name" },
    { value: "uploadedAt", label: "Date" },
    { value: "size", label: "Size" },
    { value: "mediaType", label: "Type" },
  ];

  const filterOptions = [
    { value: "all", label: "All Files" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "audio", label: "Audio" },
    { value: "file", label: "Documents" },
  ];

  const arrowVariants = {
    hidden: { rotate: sortOrder === "asc" ? -180 : 180, opacity: 0 },
    visible: { rotate: 0, opacity: 1 },
    exit: { rotate: sortOrder === "asc" ? 180 : -180, opacity: 0 },
  };

  return (
    <motion.div
      className="bg-white/5 border border-[#f7a5a5]/20 rounded-lg p-4 mb-4"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center gap-4">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Filter size={16} className="text-[#f7a5a5]/70" />
          <span className="text-sm text-[#f7a5a5]/70 font-medium">Filter:</span>
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-white/10 border border-[#f7a5a5]/20 rounded px-3 py-1 text-sm text-[#f7a5a5] focus:outline-none focus:border-[#f7a5a5]/50"
          >
            {filterOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-slate-800"
              >
                {option.label}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <ArrowUpDown size={16} className="text-[#f7a5a5]/70" />
          <span className="text-sm text-[#f7a5a5]/70 font-medium">
            Sort by:
          </span>
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white/10 border border-[#f7a5a5]/20 rounded px-3 py-1 text-sm text-[#f7a5a5] focus:outline-none focus:border-[#f7a5a5]/50 appearance-none pr-8"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-slate-800"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={sortOrder} // Key change triggers the animation
                  variants={arrowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="text-xs text-[#f7a5a5]/60">
          Click same field to toggle ascending/descending
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSortControls;