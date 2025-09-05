"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import UploadCard from "@/components/admin/uploads/UploadCard";
import FilterSortControls from "@/components/admin/uploads/FilterSortControls";
import SearchHeader from "@/components/admin/common/SearchHeader";
import { adminAPI } from "@/lib/api";

// --- TYPE DEFINITIONS ---
interface Upload {
  id: string;
  fileName: string;
  uploadedAt: Date;
  uploader: { name: string };
  size: number;
  mediaType: "image" | "video" | "audio" | "file";
  mimeType: string;
  url?: string;
}

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

// --- API DATA MAPPER ---
function mapApiUpload(apiUpload: any): Upload {
  return {
    id: apiUpload.id,
    fileName: apiUpload.fileName || apiUpload.filename,
    uploadedAt: apiUpload.uploadedAt
      ? new Date(apiUpload.uploadedAt)
      : new Date(),
    uploader: {
      name: apiUpload.uploader?.name || apiUpload.uploaderName || "Unknown",
    },
    size: apiUpload.size || 0,
    mediaType: apiUpload.mediaType || "file",
    mimeType: apiUpload.mimeType || "application/octet-stream",
    url: apiUpload.url,
  };
}

// --- COMPONENT ---
const UploadsPage = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("uploadedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUploads(searchQuery, filterType);
  }, [sortBy, sortOrder]);

  const fetchUploads = async (search: string = "", type: string = "all") => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        search: search || undefined,
        mediaType: type === "all" ? undefined : type,
        sortBy,
        sortOrder,
      };
      const response = await adminAPI.getUploads(params);
      setUploads((response.data || []).map(mapApiUpload));
    } catch (err: any) {
      setError(err?.message || "Failed to fetch uploads");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => console.log("Editing upload:", id);

  const handleDelete = async (id: string) => {
    const upload = uploads.find((u) => u.id === id);
    if (
      !upload ||
      !window.confirm(`Are you sure you want to delete "${upload.fileName}"?`)
    )
      return;
    try {
      setError(null);
      await adminAPI.deleteUpload(id);
      setUploads((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err?.message || "Failed to delete upload");
    }
  };

  const handleView = (id: string) => {
    const upload = uploads.find((u) => u.id === id);
    if (upload?.url) window.open(upload.url, "_blank");
  };

  const handleDownload = async (id: string) => {
    try {
      const blob = await adminAPI.downloadUpload(id);
      const upload = uploads.find((u) => u.id === id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = upload?.fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message || "Failed to download file");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await fetchUploads(query, filterType);
  };

  const handleNew = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files?.length) return;
      setLoading(true);
      setError(null);
      try {
        const uploadPromises = Array.from(files).map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          return adminAPI.uploadFile(formData);
        });
        const newUploads = await Promise.all(uploadPromises);
        setUploads((prev) => [...prev, ...newUploads.map(mapApiUpload)]);
      } catch (err: any) {
        setError(err?.message || "Failed to upload file(s)");
      } finally {
        setLoading(false);
      }
    };
    input.click();
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc"); // Default to desc on new field
    }
  };

  const handleFilterChange = async (type: string) => {
    setFilterType(type);
    await fetchUploads(searchQuery, type);
  };

  const filteredAndSortedUploads = useMemo(() => {
    return [...uploads].sort((a, b) => {
      const aValue = a[sortBy as keyof Upload];
      const bValue = b[sortBy as keyof Upload];
      const order = sortOrder === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * order;
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return (aValue.getTime() - bValue.getTime()) * order;
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * order;
      }
      return 0;
    });
  }, [uploads, sortBy, sortOrder]);

  return (
    <div className="flex flex-col h-full bg-[#5d688a] text-[#f7a5a5]">
      <div className="sticky top-0 z-10 bg-[#5d688a]/95 backdrop-blur-sm border-b border-[#f7a5a5]/20 pb-4">
        <SearchHeader
          title="Upload"
          onSearch={handleSearch}
          onNew={handleNew}
        />
        <FilterSortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          filterType={filterType}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="flex-1 overflow-y-auto pt-4 px-4">
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[#f7a5a5]/70 py-10"
            >
              Loading uploads...
            </motion.div>
          ) : filteredAndSortedUploads.length > 0 ? (
            <motion.div
              key="list"
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredAndSortedUploads.map((upload) => (
                  <motion.div
                    key={upload.id}
                    layout="position"
                    variants={itemVariants}
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <UploadCard
                      upload={upload}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                      onDownload={handleDownload}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center mt-10"
            >
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No files found
              </h3>
              <p className="text-[#f7a5a5]/70 mb-4">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by uploading your first file."}
              </p>
              <motion.button
                onClick={handleNew}
                className="bg-[#f7a5a5] text-[#5d688a] font-bold px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upload File
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && filteredAndSortedUploads.length > 0 && (
          <div className="mt-4 text-center text-sm text-[#f7a5a5]/60">
            Showing {filteredAndSortedUploads.length} of {uploads.length} files
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadsPage;
