"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Type,
  Music,
  Video,
  Image,
  Upload,
  Quote,
  Link2,
  Pin,
  Calendar,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Globe,
  Lock,
  Users,
  FileText,
} from "lucide-react";
import Toggle from "@/components/common/Toggle";
import { Post, PostType } from "@/types/post";

// Import post type components
import TextPost from "./types/TextPost";
import AudioPost from "./types/AudioPost";
import VideoPost from "./types/VideoPost";
import PhotoPost from "./types/PhotoPost";
import FilePost from "./types/FilePost";
import QuotePost from "./types/QuotePost";
import LinkPost from "./types/LinkPost";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: PostFormData) => void;
  post?: Post | null;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export interface PostFormData {
  title: string;
  type: PostType;
  content: any;
  visibility: "public" | "private" | "draft" | "scheduled" | "groups";
  visibilityGroups: string[];
  isPinned: boolean;
  slug: string;
  scheduledDate?: Date;
  tags: string[];
  category: string;
  commentStatus: "open" | "closed" | "private";
  isOriginalWork: boolean;
  rightsHolder: string;
  license: string;
}

const POST_TYPES = [
  {
    type: "text" as PostType,
    icon: Type,
    label: "Text",
    description: "Write a blog post with rich text",
  },
  {
    type: "audio" as PostType,
    icon: Music,
    label: "Audio",
    description: "Share an audio file or podcast",
  },
  {
    type: "video" as PostType,
    icon: Video,
    label: "Video",
    description: "Upload and share a video",
  },
  {
    type: "photo" as PostType,
    icon: Image,
    label: "Photo",
    description: "Share images with captions",
  },
  {
    type: "file" as PostType,
    icon: Upload,
    label: "File",
    description: "Share downloadable files",
  },
  {
    type: "quote" as PostType,
    icon: Quote,
    label: "Quote",
    description: "Share an inspiring quote",
  },
  {
    type: "link" as PostType,
    icon: Link2,
    label: "Link",
    description: "Share a link with description",
  },
];

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    icon: Globe,
    label: "Public",
    description: "Visible to everyone",
  },
  {
    value: "private",
    icon: Lock,
    label: "Private",
    description: "Only visible to you",
  },
  {
    value: "draft",
    icon: FileText,
    label: "Draft",
    description: "Save as draft",
  },
  {
    value: "scheduled",
    icon: Calendar,
    label: "Scheduled",
    description: "Publish at a specific time",
  },
  {
    value: "groups",
    icon: Users,
    label: "Groups",
    description: "Visible to specific groups",
  },
];

const LICENSE_OPTIONS = [
  "All Rights Reserved",
  "CC BY 4.0",
  "CC BY-SA 4.0",
  "CC BY-NC 4.0",
  "CC BY-NC-SA 4.0",
  "CC0 1.0",
  "MIT License",
  "Apache License 2.0",
];

const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  onSave,
  post,
  mode,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    type: "text",
    content: {},
    visibility: "public",
    visibilityGroups: [],
    isPinned: false,
    slug: "",
    scheduledDate: undefined,
    tags: [],
    category: "",
    commentStatus: "open",
    isOriginalWork: true,
    rightsHolder: "",
    license: "All Rights Reserved",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (mode === "edit" && post) {
      setFormData({
        title: post.title,
        type: post.type,
        content: post.content || {},
        visibility: post.status === "published" ? "public" : post.status,
        visibilityGroups: post.visibilityGroups || [],
        isPinned: post.isPinned || false,
        slug: post.slug || post.title.toLowerCase().replace(/\s+/g, "-"),
        scheduledDate: post.scheduledDate
          ? new Date(post.scheduledDate)
          : undefined,
        tags: post.tags,
        category: post.category || "",
        commentStatus: post.allowComments === false ? "closed" : "open",
        isOriginalWork: post.isOriginalWork || true,
        rightsHolder: post.rightsHolder || "",
        license: post.license || "All Rights Reserved",
      });
    } else if (mode === "create") {
      setFormData({
        title: "",
        type: "text",
        content: {},
        visibility: "public",
        visibilityGroups: [],
        isPinned: false,
        slug: "",
        scheduledDate: undefined,
        tags: [],
        category: "",
        commentStatus: "open",
        isOriginalWork: true,
        rightsHolder: "",
        license: "All Rights Reserved",
      });
    }
    setErrors({});
  }, [mode, post, isOpen]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && (!formData.slug || mode === "create")) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContentChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      content: { ...prev.content, [field]: value },
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Type-specific validation
    switch (formData.type) {
      case "text":
        if (!formData.content.body?.trim()) {
          newErrors.body = "Content is required";
        }
        break;
      case "audio":
        if (!formData.content.audioFile) {
          newErrors.audioFile = "Audio file is required";
        }
        break;
      case "video":
        if (!formData.content.videoFile && !formData.content.videoUrl) {
          newErrors.videoFile = "Video file or URL is required";
        }
        break;
      case "photo":
        if (
          !formData.content.imageFiles ||
          formData.content.imageFiles.length === 0
        ) {
          newErrors.imageFiles = "At least one image is required";
        }
        break;
      case "file":
        if (!formData.content.files || formData.content.files.length === 0) {
          newErrors.files = "At least one file is required";
        }
        break;
      case "quote":
        if (!formData.content.quote?.trim()) {
          newErrors.quote = "Quote text is required";
        }
        break;
      case "link":
        if (!formData.content.url?.trim()) {
          newErrors.url = "URL is required";
        }
        break;
    }

    if (formData.visibility === "scheduled" && !formData.scheduledDate) {
      newErrors.scheduledDate = "Scheduled date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentPostType = POST_TYPES.find((pt) => pt.type === formData.type);

  const renderPostTypeContent = () => {
    const props = {
      content: formData.content,
      onChange: handleContentChange,
      errors,
    };

    switch (formData.type) {
      case "text":
        return <TextPost {...props} />;
      case "audio":
        return <AudioPost {...props} />;
      case "video":
        return <VideoPost {...props} />;
      case "photo":
        return <PhotoPost {...props} />;
      case "file":
        return <FilePost {...props} />;
      case "quote":
        return <QuotePost {...props} />;
      case "link":
        return <LinkPost {...props} />;
      default:
        return <TextPost {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-[#f7a5a5]/20 rounded-lg w-full max-w-7xl my-4 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-[#f7a5a5]/20 p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {currentPostType && (
              <currentPostType.icon size={20} className="text-[#f7a5a5]" />
            )}
            <h2 className="text-base sm:text-lg font-semibold text-[#f7a5a5]">
              {mode === "create" ? "Create New Post" : "Edit Post"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col lg:flex-row overflow-hidden"
        >
          {/* Left Panel - Post Types (Only show in create mode) */}
          {mode === "create" && (
            <div className="w-full lg:w-64 bg-gray-800/50 border-b lg:border-b-0 lg:border-r border-[#f7a5a5]/20">
              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-medium text-[#f7a5a5] mb-3">
                  Post Type
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2">
                  {POST_TYPES.map(
                    ({ type, icon: Icon, label, description }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange("type", type)}
                        className={`p-2 lg:p-3 rounded-lg text-left transition-all ${
                          formData.type === type
                            ? "bg-[#f7a5a5]/20 border border-[#f7a5a5]/50 text-[#f7a5a5]"
                            : "bg-white/5 border border-transparent text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={16} />
                          <span className="font-medium text-sm lg:text-base">
                            {label}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 hidden lg:block">
                          {description}
                        </p>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Show current post type info in edit mode */}
          {mode === "edit" && (
            <div className="w-full lg:w-64 bg-gray-800/50 border-b lg:border-b-0 lg:border-r border-[#f7a5a5]/20">
              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-medium text-[#f7a5a5] mb-3">
                  Post Type
                </h3>
                <div className="p-2 lg:p-3 rounded-lg bg-[#f7a5a5]/20 border border-[#f7a5a5]/50 text-[#f7a5a5]">
                  <div className="flex items-center gap-2 mb-1">
                    {currentPostType && <currentPostType.icon size={16} />}
                    <span className="font-medium text-sm lg:text-base">
                      {currentPostType?.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 hidden lg:block">
                    {currentPostType?.description}
                  </p>
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Post type cannot be changed when editing
                </p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                    placeholder="Enter post title..."
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                    placeholder="post-url-slug"
                  />
                </div>
              </div>

              {/* Type-specific Content */}
              <div className="space-y-4">{renderPostTypeContent()}</div>

              {/* Tags and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category || ""}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                    placeholder="Post category..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                      className="flex-1 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                      placeholder="Add tag..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-[#f7a5a5] text-white rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#f7a5a5]/20 text-[#f7a5a5] rounded text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="border-t border-[#f7a5a5]/20 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-[#f7a5a5] hover:text-[#f7a5a5]/80 transition-colors mb-4"
                >
                  <Settings size={16} />
                  Advanced Settings
                  {showAdvanced ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {showAdvanced && (
                  <div className="space-y-4 pl-0 sm:pl-6">
                    {/* Visibility */}
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
                        Visibility
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                        {VISIBILITY_OPTIONS.map(
                          ({ value, icon: Icon, label, description }) => (
                            <label
                              key={value}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="visibility"
                                value={value}
                                checked={formData.visibility === value}
                                onChange={(e) =>
                                  handleInputChange(
                                    "visibility",
                                    e.target.value
                                  )
                                }
                                className="sr-only"
                              />
                              <div
                                className={`flex items-center gap-2 p-2 rounded w-full ${
                                  formData.visibility === value
                                    ? "bg-[#f7a5a5]/20 text-[#f7a5a5]"
                                    : "text-white/70 hover:bg-white/5"
                                }`}
                              >
                                <Icon size={16} />
                                <div>
                                  <div className="font-medium text-sm">
                                    {label}
                                  </div>
                                  <div className="text-xs opacity-70 hidden sm:block">
                                    {description}
                                  </div>
                                </div>
                              </div>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    {/* Scheduled Date */}
                    {formData.visibility === "scheduled" && (
                      <div>
                        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                          Scheduled Date *
                        </label>
                        <input
                          type="datetime-local"
                          value={
                            formData.scheduledDate
                              ? formData.scheduledDate
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "scheduledDate",
                              new Date(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
                        />
                        {errors.scheduledDate && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.scheduledDate}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Additional Settings Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Pin Toggle */}
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Pin size={16} className="text-[#f7a5a5]" />
                          <span className="text-[#f7a5a5] text-sm">
                            Pin this post
                          </span>
                        </div>
                        <Toggle
                          checked={formData.isPinned}
                          onChange={(checked) =>
                            handleInputChange("isPinned", checked)
                          }
                          size="sm"
                          variant="primary"
                        />
                      </div>

                      {/* Original Work Toggle */}
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <span className="text-[#f7a5a5] text-sm">
                          Original Work
                        </span>
                        <Toggle
                          checked={formData.isOriginalWork}
                          onChange={(checked) =>
                            handleInputChange("isOriginalWork", checked)
                          }
                          size="sm"
                          variant="primary"
                        />
                      </div>
                    </div>

                    {/* Additional Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Comment Status */}
                      <div>
                        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                          Comments
                        </label>
                        <select
                          value={formData.commentStatus}
                          onChange={(e) =>
                            handleInputChange("commentStatus", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="private">Private</option>
                        </select>
                      </div>

                      {/* License */}
                      <div>
                        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                          License
                        </label>
                        <select
                          value={formData.license}
                          onChange={(e) =>
                            handleInputChange("license", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
                        >
                          {LICENSE_OPTIONS.map((license) => (
                            <option key={license} value={license}>
                              {license}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Rights Holder */}
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Rights Holder (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.rightsHolder}
                        onChange={(e) =>
                          handleInputChange("rightsHolder", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="Copyright holder..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-[#f7a5a5]/20 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[#f7a5a5]/20 text-[#f7a5a5] rounded-lg hover:bg-[#f7a5a5]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-[#f7a5a5] text-white rounded-lg hover:bg-[#f7a5a5]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Post"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
