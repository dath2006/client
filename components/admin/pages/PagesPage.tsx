"use client";

import React, { useState } from "react";
import PageCard from "@/components/admin/pages/PageCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import PageModal, { PageFormData } from "@/components/admin/pages/PageModal";
import { useHasPermission } from "@/hooks/useGlobalPermissions";

interface Page {
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
  slug?: string;
  visibility?: "public" | "private" | "password" | "groups";
  priority?: number;
  content?: string;
}

const PagesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [pages, setPages] = useState<Page[]>([]);

  // Mock data for pages
  const mockPages: Page[] = [
    {
      id: "1",
      title: "About Us",
      createdDate: new Date("2024-10-01"),
      editedDate: new Date("2024-12-15"),
      views: 1247,
      isPublic: true,
      isListed: true,
      author: { name: "John Doe" },
      status: "published",
      slug: "about-us",
      visibility: "public",
      priority: 5,
      content:
        "# About Us\n\nWelcome to our website! We are a team of passionate individuals...",
    },
    {
      id: "2",
      title: "Contact",
      createdDate: new Date("2024-09-15"),
      editedDate: new Date("2024-12-20"),
      views: 856,
      isPublic: true,
      isListed: true,
      author: { name: "Jane Smith" },
      status: "published",
      slug: "contact",
      visibility: "public",
      priority: 3,
      content: "# Contact Us\n\nGet in touch with us using the form below...",
    },
    {
      id: "3",
      title: "Privacy Policy",
      createdDate: new Date("2024-08-20"),
      editedDate: new Date("2024-11-30"),
      views: 432,
      isPublic: true,
      isListed: false,
      author: { name: "Admin" },
      status: "published",
      slug: "privacy-policy",
      visibility: "public",
      priority: 0,
      content:
        "# Privacy Policy\n\nThis privacy policy outlines how we collect and use your data...",
    },
    {
      id: "4",
      title: "Terms of Service",
      createdDate: new Date("2024-08-20"),
      editedDate: new Date("2024-12-01"),
      views: 298,
      isPublic: true,
      isListed: false,
      author: { name: "Admin" },
      status: "published",
      slug: "terms-of-service",
      visibility: "public",
      priority: 0,
      content:
        "# Terms of Service\n\nBy using our service, you agree to these terms...",
    },
    {
      id: "5",
      title: "FAQ Draft",
      createdDate: new Date("2024-12-20"),
      editedDate: new Date("2024-12-22"),
      views: 0,
      isPublic: false,
      isListed: false,
      author: { name: "Jane Smith" },
      status: "draft",
      slug: "faq-draft",
      visibility: "private",
      priority: 0,
      content:
        "# Frequently Asked Questions\n\n## Q: How do I get started?\nA: ...",
    },
  ];

  // Initialize pages with mock data
  React.useEffect(() => {
    setPages(mockPages);
  }, []);

  const handleEdit = (id: string) => {
    console.log("Editing page:", id);
    const page = pages.find((p) => p.id === id);
    if (page) {
      setSelectedPage(page);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Deleting page:", id);
    setPages((prev) => prev.filter((page) => page.id !== id));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  const handleNew = () => {
    console.log("Creating new page");
    setSelectedPage(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPage(null);
  };

  const handlePageSave = (pageData: PageFormData) => {
    if (modalMode === "create") {
      // Create new page
      const newPage: Page = {
        id: Date.now().toString(),
        title: pageData.title,
        createdDate: new Date(),
        editedDate: new Date(),
        views: 0,
        isPublic: pageData.visibility === "public",
        isListed: pageData.isListed,
        author: { name: "Current User" }, // This should come from auth context
        status: pageData.status,
        slug: pageData.slug,
        visibility: pageData.visibility,
        priority: pageData.priority,
        content: pageData.content,
      };
      setPages((prev) => [newPage, ...prev]);
    } else if (modalMode === "edit" && selectedPage) {
      // Update existing page
      setPages((prev) =>
        prev.map((page) =>
          page.id === selectedPage.id
            ? {
                ...page,
                title: pageData.title,
                editedDate: new Date(),
                isPublic: pageData.visibility === "public",
                isListed: pageData.isListed,
                status: pageData.status,
                slug: pageData.slug,
                visibility: pageData.visibility,
                priority: pageData.priority,
                content: pageData.content,
              }
            : page
        )
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader
          title="Page"
          onSearch={handleSearch}
          onNew={handleNew}
          hideNew={!useHasPermission("add_pages", true)}
        />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <div className="grid gap-4">
          {pages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {pages.length === 0 && (
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

      {/* PageModal */}
      <PageModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handlePageSave}
        page={selectedPage}
        mode={modalMode}
      />
    </div>
  );
};

export default PagesPage;
