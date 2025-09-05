"use client";

import React, { useState } from "react";
import MarkdownEditor from "../MarkdownEditor";
import { ExternalLink, Image, Loader } from "lucide-react";

interface LinkPostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

const LinkPost: React.FC<LinkPostProps> = ({ content, onChange, errors }) => {
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const loadPreview = async () => {
    if (!content.url) return;

    setIsLoadingPreview(true);
    try {
      // In a real app, this would fetch metadata from the URL
      // For now, we'll simulate the preview
      setTimeout(() => {
        setPreviewData({
          title: "Example Page Title",
          description: "This would be the meta description from the page",
          image: null,
          siteName: "example.com",
        });
        setIsLoadingPreview(false);
      }, 1000);
    } catch (error) {
      setIsLoadingPreview(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          URL *
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={content.url || ""}
            onChange={(e) => onChange("url", e.target.value)}
            className="flex-1 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="https://example.com"
          />
          <button
            type="button"
            onClick={loadPreview}
            disabled={!content.url || isLoadingPreview}
            className="px-4 py-2 bg-[#f7a5a5] text-white rounded-lg hover:bg-[#f7a5a5]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoadingPreview ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <ExternalLink size={16} />
            )}
            {isLoadingPreview ? "Loading..." : "Preview"}
          </button>
        </div>
        {errors?.url && (
          <p className="text-red-400 text-xs mt-1">{errors.url}</p>
        )}
      </div>

      {/* Link Preview */}
      {previewData && (
        <div className="p-4 bg-white/5 border border-[#f7a5a5]/20 rounded-lg">
          <h4 className="text-sm font-medium text-[#f7a5a5] mb-2">
            Link Preview
          </h4>
          <div className="flex gap-4">
            {previewData.image && (
              <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Image size={24} className="text-[#f7a5a5]/50" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-white truncate">
                {previewData.title}
              </h5>
              <p className="text-sm text-white/70 mt-1 line-clamp-2">
                {previewData.description}
              </p>
              <p className="text-xs text-[#f7a5a5] mt-2">
                {previewData.siteName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description/Commentary */}
      <MarkdownEditor
        value={content.description || ""}
        onChange={(value: string) => onChange("description", value)}
        placeholder="Why are you sharing this link? What makes it interesting or valuable? Add your thoughts or summary..."
        height="h-32 sm:h-40"
        label="Description/Commentary"
        showToolbar={true}
      />
    </div>
  );
};

export default LinkPost;
