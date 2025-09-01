"use client";

import React, { useState, useMemo } from "react";
import UploadCard from "@/components/admin/uploads/UploadCard";
import FilterSortControls from "@/components/admin/uploads/FilterSortControls";
import SearchHeader from "@/components/admin/common/SearchHeader";

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

const UploadsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("uploadedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState("all");

  // Mock data for uploads
  const mockUploads: Upload[] = [
    {
      id: "1",
      fileName: "hero-banner.jpg",
      uploadedAt: new Date("2024-12-22T14:30:00"),
      uploader: { name: "John Doe" },
      size: 2458624, // ~2.4MB
      mediaType: "image",
      mimeType: "image/jpeg",
    },
    {
      id: "2",
      fileName: "product-demo-video.mp4",
      uploadedAt: new Date("2024-12-21T10:15:00"),
      uploader: { name: "Jane Smith" },
      size: 15728640, // ~15MB
      mediaType: "video",
      mimeType: "video/mp4",
    },
    {
      id: "3",
      fileName: "background-music.mp3",
      uploadedAt: new Date("2024-12-20T16:45:00"),
      uploader: { name: "Mike Johnson" },
      size: 5242880, // ~5MB
      mediaType: "audio",
      mimeType: "audio/mpeg",
    },
    {
      id: "4",
      fileName: "user-guide.pdf",
      uploadedAt: new Date("2024-12-19T09:30:00"),
      uploader: { name: "Emily Davis" },
      size: 1048576, // ~1MB
      mediaType: "file",
      mimeType: "application/pdf",
    },
    {
      id: "5",
      fileName: "profile-avatar.png",
      uploadedAt: new Date("2024-12-18T11:20:00"),
      uploader: { name: "Robert Wilson" },
      size: 524288, // ~512KB
      mediaType: "image",
      mimeType: "image/png",
    },
    {
      id: "6",
      fileName: "presentation.pptx",
      uploadedAt: new Date("2024-12-17T13:45:00"),
      uploader: { name: "Sarah Johnson" },
      size: 8388608, // ~8MB
      mediaType: "file",
      mimeType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    },
    {
      id: "7",
      fileName: "podcast-episode-01.wav",
      uploadedAt: new Date("2024-12-16T08:15:00"),
      uploader: { name: "David Brown" },
      size: 31457280, // ~30MB
      mediaType: "audio",
      mimeType: "audio/wav",
    },
    {
      id: "8",
      fileName: "tutorial-screencast.webm",
      uploadedAt: new Date("2024-12-15T15:30:00"),
      uploader: { name: "Lisa Wilson" },
      size: 12582912, // ~12MB
      mediaType: "video",
      mimeType: "video/webm",
    },
  ];

  const handleEdit = (id: string) => {
    console.log("Editing upload:", id);
    // Add edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Deleting upload:", id);
    // Add delete logic here
  };

  const handleView = (id: string) => {
    console.log("Viewing upload:", id);
    // Add view logic here
  };

  const handleDownload = (id: string) => {
    console.log("Downloading upload:", id);
    // Add download logic here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNew = () => {
    console.log("Uploading new file");
    // Add file upload logic here
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  // Filter and sort uploads
  const filteredAndSortedUploads = useMemo(() => {
    let filtered = mockUploads;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (upload) =>
          upload.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          upload.uploader.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((upload) => upload.mediaType === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
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
  }, [mockUploads, searchQuery, filterType, sortBy, sortOrder]);

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
        <div className="space-y-2">
          {filteredAndSortedUploads.length > 0 ? (
            filteredAndSortedUploads.map((upload) => (
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

        {filteredAndSortedUploads.length > 0 && (
          <div className="mt-4 text-center text-sm text-[#f7a5a5]/60">
            Showing {filteredAndSortedUploads.length} of {mockUploads.length}{" "}
            files
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadsPage;
