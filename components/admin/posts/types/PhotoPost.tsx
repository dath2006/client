"use client";

import React from "react";
import MarkdownEditor from "../MarkdownEditor";
import { Image, X } from "lucide-react";

interface PhotoPostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

const PhotoPost: React.FC<PhotoPostProps> = ({ content, onChange, errors }) => {
  const handleMultipleFiles = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      onChange("imageFiles", fileArray);
    }
  };

  const removeImage = (index: number) => {
    const currentFiles = content.imageFiles || [];
    const newFiles = currentFiles.filter((_: any, i: number) => i !== index);
    onChange("imageFiles", newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Images *
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleMultipleFiles(e.target.files)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
        {errors?.imageFiles && (
          <p className="text-red-400 text-xs mt-1">{errors.imageFiles}</p>
        )}
        <p className="text-xs text-white/60 mt-1">
          Select multiple images to create a gallery. Supported formats: JPG,
          PNG, WebP, GIF
        </p>
      </div>

      {/* Image Preview */}
      {content.imageFiles && content.imageFiles.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
            Selected Images ({content.imageFiles.length})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {content.imageFiles.map((file: File, index: number) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-white/5 border border-[#f7a5a5]/20 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image size={24} className="text-[#f7a5a5]/50" />
                  {/* Note: In a real app, you'd show image preview here */}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
                <p className="text-xs text-white/60 mt-1 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Layout */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
          Gallery Layout
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="layout"
              value="grid"
              checked={content.layout === "grid" || !content.layout}
              onChange={(e) => onChange("layout", e.target.value)}
              className="mr-2 text-[#f7a5a5]"
            />
            <span className="text-sm">Grid</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="layout"
              value="masonry"
              checked={content.layout === "masonry"}
              onChange={(e) => onChange("layout", e.target.value)}
              className="mr-2 text-[#f7a5a5]"
            />
            <span className="text-sm">Masonry</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="layout"
              value="carousel"
              checked={content.layout === "carousel"}
              onChange={(e) => onChange("layout", e.target.value)}
              className="mr-2 text-[#f7a5a5]"
            />
            <span className="text-sm">Carousel</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="layout"
              value="single"
              checked={content.layout === "single"}
              onChange={(e) => onChange("layout", e.target.value)}
              className="mr-2 text-[#f7a5a5]"
            />
            <span className="text-sm">Single</span>
          </label>
        </div>
      </div>

      {/* Alternative Text */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Alternative Text (Accessibility)
        </label>
        <input
          type="text"
          value={content.altText || ""}
          onChange={(e) => onChange("altText", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
          placeholder="Describe the images for screen readers..."
        />
      </div>

      {/* Photo Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Location (Optional)
          </label>
          <input
            type="text"
            value={content.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="Where was this taken?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Camera/Device (Optional)
          </label>
          <input
            type="text"
            value={content.camera || ""}
            onChange={(e) => onChange("camera", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="Camera or device used"
          />
        </div>
      </div>

      {/* Source URL */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Source URL (Optional)
        </label>
        <input
          type="url"
          value={content.sourceUrl || ""}
          onChange={(e) => onChange("sourceUrl", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
          placeholder="https://source.com (if image is from external source)"
        />
      </div>

      {/* Caption with Markdown */}
      <MarkdownEditor
        value={content.caption || ""}
        onChange={(value: string) => onChange("caption", value)}
        placeholder="Add a caption to your photos. Describe the moment, story, or context..."
        height="h-24 sm:h-32"
        label="Caption"
        showToolbar={true}
      />

      {/* EXIF Data Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={content.showExif || false}
          onChange={(e) => onChange("showExif", e.target.checked)}
          className="text-[#f7a5a5]"
        />
        <label className="text-sm text-[#f7a5a5]">
          Show EXIF data (camera settings, if available)
        </label>
      </div>

      {/* Copyright/Attribution */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Copyright/Attribution (Optional)
        </label>
        <input
          type="text"
          value={content.copyright || ""}
          onChange={(e) => onChange("copyright", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
          placeholder="© 2024 Your Name or attribution info"
        />
      </div>
    </div>
  );
};

export default PhotoPost;
