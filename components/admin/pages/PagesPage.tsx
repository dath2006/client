"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PageCard from "@/components/admin/pages/PageCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
// FIX: Import the 'Page' type from the modal file
import PageModal, {
  PageFormData,
  Page,
} from "@/components/admin/pages/PageModal";

// FIX: The local Page interface has been removed to avoid type conflicts.

// --- Animation Variants ---
const containerVariants: Variants = {
  /* ... */
};

const PagesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [pages, setPages] = useState<Page[]>([]);

  // Mock data and handlers remain the same
  const mockPages: Page[] = [
    /* ... */
  ];
  useEffect(() => {
    setPages(mockPages);
  }, []);
  const handleEdit = (id: string) => {
    /* ... */
  };
  const handleDelete = (id: string) => {
    /* ... */
  };

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <motion.div /* ... Header ... */>
        <SearchHeader
          title="Page"
          onSearch={setSearchQuery}
          onNew={() => setIsModalOpen(true)}
        />
      </motion.div>

      <div className="flex-1 pt-4 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          <AnimatePresence>
            {filteredPages.map((page) => (
              <PageCard
                key={page.id}
                page={page}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ... Empty state JSX ... */}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <PageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={(pageData) => {
              /* ... */
            }}
            page={selectedPage} // This will now be type-correct
            mode={modalMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PagesPage;
