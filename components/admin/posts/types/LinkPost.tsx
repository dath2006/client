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

      {/* Custom Title Override */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Custom Title (Optional)
        </label>
        <input
          type="text"
          value={content.customTitle || ""}
          onChange={(e) => onChange("customTitle", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
          placeholder="Override the page title with your own"
        />
        <p className="text-xs text-white/60 mt-1">
          Leave empty to use the page's original title
        </p>
      </div>

      {/* Link Category */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
          Link Category
        </label>
        <select
          value={content.linkCategory || ""}
          onChange={(e) => onChange("linkCategory", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
        >
          <option value="">Select category</option>
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="podcast">Podcast</option>
          <option value="tutorial">Tutorial</option>
          <option value="news">News</option>
          <option value="tool">Tool/Resource</option>
          <option value="documentation">Documentation</option>
          <option value="blog">Blog Post</option>
          <option value="social">Social Media</option>
          <option value="shopping">Shopping</option>
          <option value="entertainment">Entertainment</option>
          <option value="education">Education</option>
          <option value="reference">Reference</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Link Quality/Rating */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
          Quality Rating (Optional)
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange("rating", star)}
              className={`text-2xl ${
                (content.rating || 0) >= star
                  ? "text-yellow-400"
                  : "text-gray-600"
              } hover:text-yellow-300 transition-colors`}
            >
              ★
            </button>
          ))}
          <span className="text-sm text-white/70 ml-2">
            {content.rating ? `${content.rating}/5` : "No rating"}
          </span>
        </div>
      </div>

      {/* Archive Options */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={content.archive || false}
            onChange={(e) => onChange("archive", e.target.checked)}
            className="text-[#f7a5a5]"
          />
          <label className="text-sm text-[#f7a5a5]">
            Archive this page (save a copy in case the original disappears)
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={content.nofollow !== false}
            onChange={(e) => onChange("nofollow", !e.target.checked)}
            className="text-[#f7a5a5]"
          />
          <label className="text-sm text-[#f7a5a5]">
            Add rel="nofollow" to link (don't pass SEO value)
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={content.openInNewTab !== false}
            onChange={(e) => onChange("openInNewTab", e.target.checked)}
            className="text-[#f7a5a5]"
          />
          <label className="text-sm text-[#f7a5a5]">Open link in new tab</label>
        </div>
      </div>

      {/* Description/Commentary */}
      <MarkdownEditor
        value={content.description || ""}
        onChange={(value: string) => onChange("description", value)}
        placeholder="Why are you sharing this link? What makes it interesting or valuable? Add your thoughts or summary..."
        height="h-32 sm:h-40"
        label="Description/Commentary"
        showToolbar={true}
      />

      {/* Quote/Excerpt */}
      <MarkdownEditor
        value={content.excerpt || ""}
        onChange={(value: string) => onChange("excerpt", value)}
        placeholder="Quote an interesting excerpt from the linked content (optional)..."
        height="h-24 sm:h-32"
        label="Excerpt/Quote (Optional)"
        showToolbar={true}
      />

      {/* Tags/Keywords */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Keywords/Tags (Optional)
        </label>
        <input
          type="text"
          value={content.keywords || ""}
          onChange={(e) => onChange("keywords", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
          placeholder="web development, tutorial, react (comma separated)"
        />
      </div>

      {/* Related Links */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
          Related Links (Optional)
        </label>
        <div className="space-y-2">
          {(content.relatedLinks || []).map((link: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={link}
                onChange={(e) => {
                  const newLinks = [...(content.relatedLinks || [])];
                  newLinks[index] = e.target.value;
                  onChange("relatedLinks", newLinks);
                }}
                className="flex-1 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                placeholder="https://related-link.com"
              />
              <button
                type="button"
                onClick={() => {
                  const newLinks = (content.relatedLinks || []).filter(
                    (_: string, i: number) => i !== index
                  );
                  onChange("relatedLinks", newLinks);
                }}
                className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newLinks = [...(content.relatedLinks || []), ""];
              onChange("relatedLinks", newLinks);
            }}
            className="px-3 py-2 text-[#f7a5a5] hover:text-[#f7a5a5]/80 hover:bg-[#f7a5a5]/10 rounded transition-colors text-sm"
          >
            + Add Related Link
          </button>
        </div>
      </div>

      {/* Access Date */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Access Date (Optional)
        </label>
        <input
          type="date"
          value={content.accessDate || ""}
          onChange={(e) => onChange("accessDate", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
        />
        <p className="text-xs text-white/60 mt-1">
          When did you access/find this link? Useful for archival purposes.
        </p>
      </div>
    </div>
  );
};

export default LinkPost;
