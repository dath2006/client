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
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Eye,
  EyeOff,
  Calendar,
  Pin,
  Tag,
  Hash,
  Globe,
  Lock,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import Toggle from "@/components/common/Toggle";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: PostFormData) => void;
  post?: Post | null;
  mode: "create" | "edit";
}

interface Post {
  id: string;
  title: string;
  type: PostType;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  status: "published" | "draft" | "private" | "scheduled";
  tags: string[];
  category: string;
  likes: number;
  comments: number;
  viewCount: number;
  webmentions: number;
  content?: any; // Will vary by post type
}

type PostType =
  | "text"
  | "audio"
  | "video"
  | "photo"
  | "file"
  | "quote"
  | "link";

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

const MARKDOWN_BUTTONS = [
  { icon: Bold, label: "Bold", syntax: "**text**" },
  { icon: Italic, label: "Italic", syntax: "*text*" },
  { icon: Code, label: "Code", syntax: "`code`" },
  { icon: Heading1, label: "Heading 1", syntax: "# " },
  { icon: Heading2, label: "Heading 2", syntax: "## " },
  { icon: List, label: "Bullet List", syntax: "- " },
  { icon: ListOrdered, label: "Numbered List", syntax: "1. " },
  { icon: Link2, label: "Link", syntax: "[text](url)" },
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

const PostModal = ({ isOpen, onClose, onSave, post, mode }: PostModalProps) => {
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

  const [showPreview, setShowPreview] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (mode === "edit" && post) {
      // Populate form with existing post data
      setFormData({
        title: post.title,
        type: post.type,
        content: post.content || {},
        visibility: post.status === "published" ? "public" : post.status,
        visibilityGroups: [],
        isPinned: false,
        slug: post.title.toLowerCase().replace(/\s+/g, "-"),
        tags: post.tags,
        category: post.category,
        commentStatus: "open",
        isOriginalWork: true,
        rightsHolder: "",
        license: "All Rights Reserved",
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

  const handleMarkdownInsert = (syntax: string) => {
    const textarea = document.querySelector(
      'textarea[name="body"]'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    let newText = syntax;
    if (syntax.includes("text")) {
      newText = syntax.replace("text", selectedText || "text");
    } else if (syntax.includes("url")) {
      newText = syntax
        .replace("text", selectedText || "link text")
        .replace("url", "https://");
    } else {
      newText = syntax + selectedText;
    }

    const newValue = before + newText + after;
    handleContentChange("body", newValue);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      if (syntax.includes("text") || syntax.includes("url")) {
        textarea.setSelectionRange(start, start + newText.length);
      } else {
        textarea.setSelectionRange(
          start + newText.length,
          start + newText.length
        );
      }
    }, 0);
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
        if (!formData.content.videoFile) {
          newErrors.videoFile = "Video file is required";
        }
        break;
      case "photo":
        if (!formData.content.imageFile) {
          newErrors.imageFile = "Image file is required";
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-[#f7a5a5]/20 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-[#f7a5a5]/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentPostType && (
              <currentPostType.icon size={20} className="text-[#f7a5a5]" />
            )}
            <h2 className="text-lg font-semibold text-[#f7a5a5]">
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

        <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
          {/* Left Panel - Post Types */}
          <div className="w-64 bg-gray-800/50 border-r border-[#f7a5a5]/20 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-[#f7a5a5] mb-3">
              Post Type
            </h3>
            <div className="space-y-2">
              {POST_TYPES.map(({ type, icon: Icon, label, description }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange("type", type)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    formData.type === type
                      ? "bg-[#f7a5a5]/20 border border-[#f7a5a5]/50 text-[#f7a5a5]"
                      : "bg-white/5 border border-transparent text-white/70 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} />
                    <span className="font-medium">{label}</span>
                  </div>
                  <p className="text-xs text-white/60">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
              <div className="space-y-4">
                {/* Text Post */}
                {formData.type === "text" && (
                  <div className="space-y-4">
                    {/* Markdown Toolbar */}
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-[#f7a5a5]/20">
                      <span className="text-xs text-[#f7a5a5]/70 mr-2">
                        Format:
                      </span>
                      {MARKDOWN_BUTTONS.map(({ icon: Icon, label, syntax }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleMarkdownInsert(syntax)}
                          className="p-1.5 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded transition-colors"
                          title={label}
                        >
                          <Icon size={14} />
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPreview(false)}
                        className={`px-3 py-1 rounded text-sm ${
                          !showPreview
                            ? "bg-[#f7a5a5] text-white"
                            : "text-[#f7a5a5]/70"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className={`px-3 py-1 rounded text-sm ${
                          showPreview
                            ? "bg-[#f7a5a5] text-white"
                            : "text-[#f7a5a5]/70"
                        }`}
                      >
                        Preview
                      </button>
                    </div>

                    {!showPreview ? (
                      <textarea
                        name="body"
                        value={formData.content.body || ""}
                        onChange={(e) =>
                          handleContentChange("body", e.target.value)
                        }
                        className="w-full h-64 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 font-mono text-sm resize-none"
                        placeholder="Write your post content in Markdown..."
                      />
                    ) : (
                      <div className="h-64 p-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg overflow-y-auto prose prose-invert max-w-none">
                        {formData.content.body ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formData.content.body.replace(
                                /\n/g,
                                "<br>"
                              ),
                            }}
                          />
                        ) : (
                          <p className="text-gray-400">
                            Preview will appear here...
                          </p>
                        )}
                      </div>
                    )}
                    {errors.body && (
                      <p className="text-red-400 text-xs">{errors.body}</p>
                    )}
                  </div>
                )}

                {/* Audio Post */}
                {formData.type === "audio" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Audio File *
                      </label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) =>
                          handleContentChange("audioFile", e.target.files?.[0])
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer"
                      />
                      {errors.audioFile && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.audioFile}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Caption File (Optional)
                      </label>
                      <input
                        type="file"
                        accept=".vtt,.srt,.ass"
                        onChange={(e) =>
                          handleContentChange(
                            "captionFile",
                            e.target.files?.[0]
                          )
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.content.description || ""}
                        onChange={(e) =>
                          handleContentChange("description", e.target.value)
                        }
                        className="w-full h-24 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="Describe your audio..."
                      />
                    </div>
                  </div>
                )}

                {/* Video Post */}
                {formData.type === "video" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Video File *
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleContentChange("videoFile", e.target.files?.[0])
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer"
                      />
                      {errors.videoFile && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.videoFile}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Poster Image (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleContentChange(
                            "posterImage",
                            e.target.files?.[0]
                          )
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Caption File (Optional)
                      </label>
                      <input
                        type="file"
                        accept=".vtt,.srt,.ass"
                        onChange={(e) =>
                          handleContentChange(
                            "captionFile",
                            e.target.files?.[0]
                          )
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.content.description || ""}
                        onChange={(e) =>
                          handleContentChange("description", e.target.value)
                        }
                        className="w-full h-24 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="Describe your video..."
                      />
                    </div>
                  </div>
                )}

                {/* Photo Post */}
                {formData.type === "photo" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Image File *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleContentChange("imageFile", e.target.files?.[0])
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer"
                      />
                      {errors.imageFile && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.imageFile}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Alternative Text
                      </label>
                      <input
                        type="text"
                        value={formData.content.altText || ""}
                        onChange={(e) =>
                          handleContentChange("altText", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="Describe the image for accessibility..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Source URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.content.sourceUrl || ""}
                        onChange={(e) =>
                          handleContentChange("sourceUrl", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="https://source.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Caption
                      </label>
                      <textarea
                        value={formData.content.caption || ""}
                        onChange={(e) =>
                          handleContentChange("caption", e.target.value)
                        }
                        className="w-full h-24 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="Add a caption for your photo..."
                      />
                    </div>
                  </div>
                )}

                {/* File Post */}
                {formData.type === "file" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Files *
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={(e) =>
                          handleContentChange(
                            "files",
                            Array.from(e.target.files || [])
                          )
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer"
                      />
                      {errors.files && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.files}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Source URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.content.sourceUrl || ""}
                        onChange={(e) =>
                          handleContentChange("sourceUrl", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="https://source.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Caption
                      </label>
                      <textarea
                        value={formData.content.caption || ""}
                        onChange={(e) =>
                          handleContentChange("caption", e.target.value)
                        }
                        className="w-full h-24 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="Describe your files..."
                      />
                    </div>
                  </div>
                )}

                {/* Quote Post */}
                {formData.type === "quote" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Quote Text *
                      </label>
                      <textarea
                        value={formData.content.quote || ""}
                        onChange={(e) =>
                          handleContentChange("quote", e.target.value)
                        }
                        className="w-full h-32 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 text-lg italic"
                        placeholder="Enter the quote text..."
                      />
                      {errors.quote && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.quote}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Source
                      </label>
                      <input
                        type="text"
                        value={formData.content.source || ""}
                        onChange={(e) =>
                          handleContentChange("source", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="Quote author or source..."
                      />
                    </div>
                  </div>
                )}

                {/* Link Post */}
                {formData.type === "link" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        URL *
                      </label>
                      <input
                        type="url"
                        value={formData.content.url || ""}
                        onChange={(e) =>
                          handleContentChange("url", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="https://example.com"
                      />
                      {errors.url && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.url}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.content.description || ""}
                        onChange={(e) =>
                          handleContentChange("description", e.target.value)
                        }
                        className="w-full h-24 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="Describe or comment on this link..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tags and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
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
                  <div className="space-y-4 pl-6">
                    {/* Visibility */}
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
                        Visibility
                      </label>
                      <div className="space-y-2">
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
                                className={`flex items-center gap-2 p-2 rounded ${
                                  formData.visibility === value
                                    ? "bg-[#f7a5a5]/20 text-[#f7a5a5]"
                                    : "text-white/70"
                                }`}
                              >
                                <Icon size={16} />
                                <div>
                                  <div className="font-medium">{label}</div>
                                  <div className="text-xs opacity-70">
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

                    {/* Pin Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pin size={16} className="text-[#f7a5a5]" />
                        <span className="text-[#f7a5a5]">Pin this post</span>
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

                    {/* Comment Status */}
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
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

                    {/* Original Work Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#f7a5a5]">Original Work</span>
                      <Toggle
                        checked={formData.isOriginalWork}
                        onChange={(checked) =>
                          handleInputChange("isOriginalWork", checked)
                        }
                        size="sm"
                        variant="primary"
                      />
                    </div>

                    {/* Rights Holder */}
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Rights Holder
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
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-[#f7a5a5]/20 p-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[#f7a5a5]/20 text-[#f7a5a5] rounded-lg hover:bg-[#f7a5a5]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#f7a5a5] text-white rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
              >
                {mode === "create" ? "Create Post" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
