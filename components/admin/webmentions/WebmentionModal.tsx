"use client";

import React, { useState } from "react";
import {
  X,
  Link as LinkIcon,
  User,
  Globe,
  Calendar,
  FileText,
} from "lucide-react";

export interface WebmentionFormData {
  type: "mention" | "like" | "repost" | "reply" | "bookmark" | "rsvp";
  sourceUrl: string;
  sourceTitle?: string;
  targetUrl: string;
  authorName: string;
  authorUrl?: string;
  authorAvatar?: string;
  publishedAt?: string;
  content?: string;
}

interface WebmentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (webmentionData: WebmentionFormData) => void;
}

const WebmentionModal = ({ isOpen, onClose, onSave }: WebmentionModalProps) => {
  const [formData, setFormData] = useState<WebmentionFormData>({
    type: "mention",
    sourceUrl: "",
    sourceTitle: "",
    targetUrl: "",
    authorName: "",
    authorUrl: "",
    authorAvatar: "",
    publishedAt: new Date().toISOString().slice(0, 16),
    content: "",
  });

  const [errors, setErrors] = useState<{
    sourceUrl?: string;
    targetUrl?: string;
    authorName?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.sourceUrl.trim()) {
      newErrors.sourceUrl = "Source URL is required";
    } else {
      try {
        new URL(formData.sourceUrl);
      } catch {
        newErrors.sourceUrl = "Please enter a valid URL";
      }
    }

    if (!formData.targetUrl.trim()) {
      newErrors.targetUrl = "Target URL is required";
    } else {
      try {
        new URL(formData.targetUrl);
      } catch {
        newErrors.targetUrl = "Please enter a valid URL";
      }
    }

    if (!formData.authorName.trim()) {
      newErrors.authorName = "Author name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
      // Reset form
      setFormData({
        type: "mention",
        sourceUrl: "",
        sourceTitle: "",
        targetUrl: "",
        authorName: "",
        authorUrl: "",
        authorAvatar: "",
        publishedAt: new Date().toISOString().slice(0, 16),
        content: "",
      });
      setErrors({});
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  const webmentionTypes = [
    { value: "mention", label: "Mention", icon: <LinkIcon size={16} /> },
    { value: "like", label: "Like", icon: <span>❤️</span> },
    { value: "repost", label: "Repost", icon: <span>🔁</span> },
    { value: "reply", label: "Reply", icon: <span>💬</span> },
    { value: "bookmark", label: "Bookmark", icon: <span>🔖</span> },
    { value: "rsvp", label: "RSVP", icon: <span>📅</span> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#2a2a2a] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#f7a5a5]/20">
          <div className="flex items-center gap-3">
            <LinkIcon className="text-[#f7a5a5]" size={24} />
            <h2 className="text-xl font-semibold text-[#f7a5a5]">
              Add Manual Webmention
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-lg transition-colors"
            suppressHydrationWarning={true}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto"
        >
          {/* Webmention Type */}
          <div>
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              Type <span className="text-red-400">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
              text-[#f7a5a5] focus:outline-none focus:border-[#f7a5a5]/50
              transition-all duration-300"
              suppressHydrationWarning={true}
            >
              {webmentionTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                  className="bg-[#2a2a2a] text-[#f7a5a5]"
                >
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source URL */}
          <div>
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              <div className="flex items-center gap-2">
                <Globe size={16} />
                Source URL <span className="text-red-400">*</span>
              </div>
            </label>
            <input
              type="url"
              name="sourceUrl"
              value={formData.sourceUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
              text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
              transition-all duration-300"
              placeholder="https://example.com/post-mentioning-you"
              suppressHydrationWarning={true}
            />
            <p className="mt-1 text-xs text-[#f7a5a5]/50">
              The URL of the page that mentions your content
            </p>
            {errors.sourceUrl && (
              <p className="mt-1 text-sm text-red-400">{errors.sourceUrl}</p>
            )}
          </div>

          {/* Source Title */}
          <div>
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              Source Title (optional)
            </label>
            <input
              type="text"
              name="sourceTitle"
              value={formData.sourceTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
              text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
              transition-all duration-300"
              placeholder="Title of the source page"
              suppressHydrationWarning={true}
            />
          </div>

          {/* Target URL */}
          <div>
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              <div className="flex items-center gap-2">
                <LinkIcon size={16} />
                Target URL <span className="text-red-400">*</span>
              </div>
            </label>
            <input
              type="url"
              name="targetUrl"
              value={formData.targetUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
              text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
              transition-all duration-300"
              placeholder="https://yoursite.com/your-post"
              suppressHydrationWarning={true}
            />
            <p className="mt-1 text-xs text-[#f7a5a5]/50">
              The URL on your site that is being mentioned
            </p>
            {errors.targetUrl && (
              <p className="mt-1 text-sm text-red-400">{errors.targetUrl}</p>
            )}
          </div>

          {/* Author Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#f7a5a5] border-b border-[#f7a5a5]/20 pb-2">
              Author Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  Author Name <span className="text-red-400">*</span>
                </div>
              </label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
                text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
                transition-all duration-300"
                placeholder="Author's name"
                suppressHydrationWarning={true}
              />
              {errors.authorName && (
                <p className="mt-1 text-sm text-red-400">{errors.authorName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
                Author URL (optional)
              </label>
              <input
                type="url"
                name="authorUrl"
                value={formData.authorUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
                text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
                transition-all duration-300"
                placeholder="https://example.com/author"
                suppressHydrationWarning={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
                Author Avatar URL (optional)
              </label>
              <input
                type="url"
                name="authorAvatar"
                value={formData.authorAvatar}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
                text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
                transition-all duration-300"
                placeholder="https://example.com/avatar.jpg"
                suppressHydrationWarning={true}
              />
            </div>
          </div>

          {/* Published Date */}
          <div>
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Published At (optional)
              </div>
            </label>
            <input
              type="datetime-local"
              name="publishedAt"
              value={formData.publishedAt}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
              text-[#f7a5a5] focus:outline-none focus:border-[#f7a5a5]/50
              transition-all duration-300"
              suppressHydrationWarning={true}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                Content (optional)
              </div>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg
              text-[#f7a5a5] placeholder-[#f7a5a5]/50 focus:outline-none focus:border-[#f7a5a5]/50
              transition-all duration-300 resize-none"
              placeholder="The content of the webmention (excerpt from the source page)"
              suppressHydrationWarning={true}
            />
            <p className="mt-1 text-xs text-[#f7a5a5]/50">
              The relevant text content from the source page that mentions your
              content
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[#f7a5a5] border border-[#f7a5a5]/20 rounded-lg
              hover:bg-[#f7a5a5]/10 transition-colors"
              suppressHydrationWarning={true}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#f7a5a5] text-[#5d688a] rounded-lg
              hover:bg-[#ffdbb6] transition-colors font-medium"
              suppressHydrationWarning={true}
            >
              Add Webmention
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebmentionModal;
