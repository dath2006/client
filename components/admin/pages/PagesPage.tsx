"use client";

import React, { useState } from "react";
import PageCard from "@/components/admin/pages/PageCard";
import SearchHeader from "@/components/admin/common/SearchHeader";

interface Page {
  id: string;
  title: string;
  editedDate: Date;
  views: number;
  author: {
    name: string;
  };
  status: "published" | "draft" | "archived";
}

const PagesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for pages
  const mockPages: Page[] = [
    {
      id: "1",
      title: "About Us",
      editedDate: new Date("2024-12-15"),
      views: 1247,
      author: { name: "John Doe" },
      status: "published",
    },
    {
      id: "2",
      title: "Contact",
      editedDate: new Date("2024-12-20"),
      views: 856,
      author: { name: "Jane Smith" },
      status: "published",
    },
    {
      id: "3",
      title: "Privacy Policy",
      editedDate: new Date("2024-11-30"),
      views: 432,
      author: { name: "Admin" },
      status: "published",
    },
    {
      id: "4",
      title: "Terms of Service",
      editedDate: new Date("2024-12-01"),
      views: 298,
      author: { name: "Admin" },
      status: "published",
    },
    {
      id: "5",
      title: "FAQ Draft",
      editedDate: new Date("2024-12-22"),
      views: 0,
      author: { name: "Jane Smith" },
      status: "draft",
    },
  ];

  const handleEdit = (id: string) => {
    console.log("Editing page:", id);
    // Add edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Deleting page:", id);
    // Add delete logic here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  const handleNew = () => {
    console.log("Creating new page");
    // Add new page creation logic here
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader title="Page" onSearch={handleSearch} onNew={handleNew} />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="grid gap-4">
          {mockPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {mockPages.length === 0 && (
            <div className="bg-surface rounded-lg border border-border p-8 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">
                No pages found
              </h3>
              <p className="text-muted mb-4">
                Get started by creating your first page.
              </p>
              <button onClick={handleNew} className="btn-primary">
                Create Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesPage;
