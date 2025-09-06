"use client";

import React, { useState } from "react";
import { PostContent } from "@/types/post";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import MarkdownContent from "@/components/common/MarkdownContent";

interface PhotoPostContentProps {
  content: PostContent;
}

const PhotoPostContent: React.FC<PhotoPostContentProps> = ({ content }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  if (!content.images || content.images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && content.images) {
      setSelectedImageIndex((selectedImageIndex + 1) % content.images.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && content.images) {
      setSelectedImageIndex(
        selectedImageIndex === 0
          ? content.images.length - 1
          : selectedImageIndex - 1
      );
    }
  };

  const getGridClass = () => {
    const imageCount = content.images?.length || 0;
    if (imageCount === 1) return "grid-cols-1";
    if (imageCount === 2) return "grid-cols-1 md:grid-cols-2";
    if (imageCount === 3) return "grid-cols-1 md:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2";
  };

  return (
    <div className="space-y-6">
      {/* Image Grid */}
      <div className={`grid gap-4 ${getGridClass()}`}>
        {content.images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-surface"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            {(content.images?.length || 0) > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {index + 1} / {content.images?.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Caption */}
      {content.caption && (
        <div className="bg-surface p-4 rounded-lg">
          <MarkdownContent
            content={content.caption}
            className="text-text-secondary italic text-center"
          />
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && content.images && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {content.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Main Image */}
            <img
              src={content.images[selectedImageIndex]}
              alt={`Photo ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            {content.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {content.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoPostContent;
