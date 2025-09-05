"use client";

import React, { useState, useEffect } from "react";
// Import motion and AnimatePresence for animations
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2, // FIX: Use Loader2 for consistency
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

// Animation Variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

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
    if (!formData.title.trim()) newErrors.title = "Title is required";
    switch (formData.type) {
      case "text":
        if (!formData.content.body?.trim())
          newErrors.body = "Content is required";
        break;
      case "audio":
        if (!formData.content.audioFile)
          newErrors.audioFile = "Audio file is required";
        break;
      case "video":
        if (!formData.content.videoFile && !formData.content.videoUrl)
          newErrors.videoFile = "Video file or URL is required";
        break;
      case "photo":
        if (
          !formData.content.imageFiles ||
          formData.content.imageFiles.length === 0
        )
          newErrors.imageFiles = "At least one image is required";
        break;
      case "file":
        if (!formData.content.files || formData.content.files.length === 0)
          newErrors.files = "At least one file is required";
        break;
      case "quote":
        if (!formData.content.quote?.trim())
          newErrors.quote = "Quote text is required";
        break;
      case "link":
        if (!formData.content.url?.trim()) newErrors.url = "URL is required";
        break;
    }
    if (formData.visibility === "scheduled" && !formData.scheduledDate)
      newErrors.scheduledDate = "Scheduled date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose(); // FIX: Re-added this line to close the modal on successful save.
    }
  };

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="post-modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            key="post-modal-panel"
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-[#f7a5a5]/20 rounded-lg w-full max-w-7xl my-4 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900/80 backdrop-blur-sm border-b border-[#f7a5a5]/20 p-3 sm:p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                {currentPostType && (
                  <currentPostType.icon size={20} className="text-[#f7a5a5]" />
                )}
                <h2 className="text-base sm:text-lg font-semibold text-[#f7a5a5]">
                  {mode === "create" ? "Create New Post" : "Edit Post"}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded-full"
              >
                <X size={20} />
              </motion.button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col lg:flex-row overflow-hidden"
            >
              {/* Left Panel */}
              {(mode === "create" || mode === "edit") && (
                <div className="w-full lg:w-64 bg-gray-800/50 border-b lg:border-b-0 lg:border-r border-[#f7a5a5]/20">
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-medium text-[#f7a5a5] mb-3">
                      Post Type
                    </h3>
                    {mode === "create" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2">
                        {POST_TYPES.map(
                          ({ type, icon: Icon, label, description }) => (
                            <motion.button
                              key={type}
                              type="button"
                              onClick={() => handleInputChange("type", type)}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
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
                            </motion.button>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="p-2 lg:p-3 rounded-lg bg-[#f7a5a5]/20 border border-[#f7a5a5]/50 text-[#f7a5a5]">
                        <div className="flex items-center gap-2 mb-1">
                          {currentPostType && (
                            <currentPostType.icon size={16} />
                          )}
                          <span className="font-medium text-sm lg:text-base">
                            {currentPostType?.label}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 hidden lg:block">
                          {currentPostType?.description}
                        </p>
                        <p className="text-xs text-white/50 mt-2">
                          Post type cannot be changed when editing.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 focus:ring-1 focus:ring-[#f7a5a5]/50 text-white placeholder-gray-400 transition-colors"
                        placeholder="Enter post title..."
                      />
                      <AnimatePresence>
                        {errors.title && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-1"
                          >
                            {errors.title}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          handleInputChange("slug", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 focus:ring-1 focus:ring-[#f7a5a5]/50 text-white placeholder-gray-400 transition-colors"
                        placeholder="post-url-slug"
                      />
                    </div>
                  </div>

                  <motion.div layout className="space-y-4">
                    {renderPostTypeContent()}
                  </motion.div>

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
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 focus:ring-1 focus:ring-[#f7a5a5]/50 text-white placeholder-gray-400 transition-colors"
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
                          className="flex-1 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 focus:ring-1 focus:ring-[#f7a5a5]/50 text-white placeholder-gray-400 transition-colors"
                          placeholder="Add tag..."
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={handleAddTag}
                          className="px-3 py-2 bg-[#f7a5a5] text-gray-900 font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                          <Plus size={16} />
                        </motion.button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <AnimatePresence>
                          {formData.tags.map((tag) => (
                            <motion.span
                              key={tag}
                              layout
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-[#f7a5a5]/20 text-[#f7a5a5] rounded text-xs"
                            >
                              {tag}
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-red-400"
                              >
                                <X size={12} />
                              </motion.button>
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#f7a5a5]/20 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-2 text-[#f7a5a5] hover:text-[#f7a5a5]/80 transition-colors mb-4"
                    >
                      <Settings size={16} /> Advanced Settings
                      <motion.div
                        animate={{ rotate: showAdvanced ? 0 : -180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronUp size={16} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          key="advanced-settings"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pl-0 sm:pl-6 overflow-hidden"
                        >
                          {/* All advanced settings content remains the same */}
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
                                      className={`flex items-center gap-2 p-2 rounded w-full transition-colors ${
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

                          {formData.visibility === "scheduled" && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
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
                            </motion.div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                                Comments
                              </label>
                              <select
                                value={formData.commentStatus}
                                onChange={(e) =>
                                  handleInputChange(
                                    "commentStatus",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
                              >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                                <option value="private">Private</option>
                              </select>
                            </div>
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
                          <div>
                            <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                              Rights Holder (Optional)
                            </label>
                            <input
                              type="text"
                              value={formData.rightsHolder}
                              onChange={(e) =>
                                handleInputChange(
                                  "rightsHolder",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                              placeholder="Copyright holder..."
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-[#f7a5a5]/20 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-[#f7a5a5]/20 text-[#f7a5a5] rounded-lg hover:bg-[#f7a5a5]/10 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-[#f7a5a5] text-gray-900 font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {isLoading
                      ? "Saving..."
                      : mode === "create"
                      ? "Create Post"
                      : "Save Changes"}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
