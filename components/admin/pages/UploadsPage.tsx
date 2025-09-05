"use client";

import React, { useState, useMemo, useEffect } from "react";
import UploadCard from "@/components/admin/uploads/UploadCard";
import FilterSortControls from "@/components/admin/uploads/FilterSortControls";
import SearchHeader from "@/components/admin/common/SearchHeader";
import { adminAPI, ApiError } from "@/lib/api";

interface Upload {
  id: string;
  fileName: string;
  uploadedAt: Date;
  uploader: {
    name: string;
  };
  size: number;
  mediaType: "image" | "video" | "audio" | "file";
  mimeType: string;
  url?: string;
}

// Helper to map API upload to local Upload type
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

const UploadsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("uploadedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState("all");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch uploads from API
  const fetchUploads = async (search: string = "", type: string = "all") => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (type !== "all") params.mediaType = type;
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;

      const response = await adminAPI.getUploads(params);
      setUploads((response.data || []).map(mapApiUpload));
    } catch (err: any) {
      setError(err?.message || "Failed to fetch uploads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads(searchQuery, filterType);
  }, [sortBy, sortOrder]);

  const handleEdit = async (id: string) => {
    // For file uploads, editing usually means updating metadata like filename or description
    // You might want to open a modal for this
    console.log("Editing upload:", id);
  };

  const handleDelete = async (id: string) => {
    const upload = uploads.find((u) => u.id === id);
    if (!upload) return;

    if (
      !window.confirm(`Are you sure you want to delete "${upload.fileName}"?`)
    )
      return;

    setLoading(true);
    setError(null);
    try {
      await adminAPI.deleteUpload(id);
      setUploads((prev) => prev.filter((upload) => upload.id !== id));
    } catch (err: any) {
      setError(err?.message || "Failed to delete upload");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    const upload = uploads.find((u) => u.id === id);
    if (upload?.url) {
      window.open(upload.url, "_blank");
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const blob = await adminAPI.downloadUpload(id);
      const upload = uploads.find((u) => u.id === id);

      // Create download link
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
    // Create file input for upload
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files?.length) return;

      setLoading(true);
      setError(null);
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append("file", file);

          const uploaded = await adminAPI.uploadFile(formData);
          setUploads((prev) => [...prev, mapApiUpload(uploaded)]);
        }
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
      setSortOrder("asc");
    }
  };

  const handleFilterChange = async (type: string) => {
    setFilterType(type);
    await fetchUploads(searchQuery, type);
  };

  // Filter and sort uploads (client-side filtering for additional responsiveness)
  const filteredAndSortedUploads = useMemo(() => {
    let filtered = uploads;

    // Apply search filter (if API doesn't handle it completely)
    if (searchQuery) {
      filtered = filtered.filter(
        (upload: Upload) =>
          upload.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          upload.uploader.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter (if API doesn't handle it completely)
    if (filterType !== "all") {
      filtered = filtered.filter(
        (upload: Upload) => upload.mediaType === filterType
      );
    }

    // Apply sorting (if API doesn't handle it completely)
    filtered.sort((a: Upload, b: Upload) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "fileName":
          aValue = a.fileName.toLowerCase();
          bValue = b.fileName.toLowerCase();
          break;
        case "uploadedAt":
          aValue = a.uploadedAt.getTime();
          bValue = b.uploadedAt.getTime();
          break;
        case "size":
          aValue = a.size;
          bValue = b.size;
          break;
        case "mediaType":
          aValue = a.mediaType;
          bValue = b.mediaType;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [uploads, searchQuery, filterType, sortBy, sortOrder]);

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
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

      <div className="flex-1 overflow-y-auto pt-4">
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-center text-muted">Loading uploads...</div>
        )}

        <div className="space-y-2">
          {filteredAndSortedUploads.length > 0 ? (
            filteredAndSortedUploads.map((upload: Upload) => (
              <UploadCard
                key={upload.id}
                upload={upload}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onDownload={handleDownload}
              />
            ))
          ) : (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No files found
              </h3>
              <p className="text-[#f7a5a5]/70 mb-4">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by uploading your first file."}
              </p>
              <button
                onClick={handleNew}
                className="bg-[#f7a5a5] text-white px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
              >
                Upload File
              </button>
            </div>
          )}
        </div>

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
