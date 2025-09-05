"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  isLoading = false,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end pages
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Adjust if we're near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      // Add first page and ellipsis if needed
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      // Add visible page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const buttonClass = `
    flex items-center justify-center w-8 h-8 rounded-md border border-border
    transition-colors duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:bg-surface hover:border-primary
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  `;

  const activeButtonClass = `
    ${buttonClass} bg-primary text-primary-foreground border-primary
    hover:bg-primary/90
  `;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage || isLoading}
          className={buttonClass}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || isLoading}
          className={buttonClass}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page !== "number" || isLoading}
            className={
              page === currentPage
                ? activeButtonClass
                : typeof page === "number"
                ? buttonClass
                : `${buttonClass} cursor-default hover:bg-transparent hover:border-border`
            }
          >
            {page}
          </button>
        ))}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className={buttonClass}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage || isLoading}
          className={buttonClass}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
