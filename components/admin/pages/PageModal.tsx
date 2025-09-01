"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Globe,
  Lock,
  Users,
  Eye,
  EyeOff,
  Calendar,
  Pin,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Hash,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import Toggle from "@/components/common/Toggle";
import MarkdownEditor from "@/components/admin/posts/MarkdownEditor";

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pageData: PageFormData) => void;
  page?: Page | null;
  mode: "create" | "edit";
}

interface Page {
  id: string;
  title: string;
  createdDate: Date;
  editedDate: Date;
  views: number;
  isPublic: boolean;
  isListed: boolean;
  author: {
    name: string;
  };
  status: "published" | "draft" | "archived";
  slug?: string;
  visibility?: "public" | "private" | "password" | "groups";
  priority?: number;
  content?: string;
}

export interface PageFormData {
  title: string;
  slug: string;
  content: string;
  visibility: "public" | "private" | "password" | "groups";
  password?: string;
  visibilityGroups: string[];
  isListed: boolean;
  priority: number;
  status: "published" | "draft" | "archived";
  scheduledDate?: Date;
  metaTitle?: string;
  metaDescription?: string;
  customCSS?: string;
  customJS?: string;
  template?: string;
  parentPage?: string;
  redirectUrl?: string;
  enableComments: boolean;
  showInNavigation: boolean;
  showInSitemap: boolean;
  showInSearch: boolean;
  requireAuth: boolean;
  allowedRoles: string[];
  featuredImage?: File | null;
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    type: string;
  };
}

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
    description: "Only visible to admins",
  },
  {
    value: "password",
    icon: Lock,
    label: "Password Protected",
    description: "Requires password to access",
  },
  {
    value: "groups",
    icon: Users,
    label: "Groups Only",
    description: "Visible to specific user groups",
  },
];

const PAGE_TEMPLATES = [
  "default",
  "full-width",
  "sidebar-left",
  "sidebar-right",
  "landing",
  "contact",
  "about",
  "custom",
];

const USER_ROLES = ["admin", "editor", "author", "contributor", "subscriber"];

const MOCK_PAGES = [
  { id: "0", title: "None (Root Level)", slug: "" },
  { id: "1", title: "About", slug: "about" },
  { id: "2", title: "Services", slug: "services" },
  { id: "3", title: "Contact", slug: "contact" },
];

const PageModal: React.FC<PageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  page,
  mode,
}) => {
  const [formData, setFormData] = useState<PageFormData>({
    title: "",
    slug: "",
    content: "",
    visibility: "public",
    password: "",
    visibilityGroups: [],
    isListed: true,
    priority: 0,
    status: "draft",
    scheduledDate: undefined,
    metaTitle: "",
    metaDescription: "",
    customCSS: "",
    customJS: "",
    template: "default",
    parentPage: "",
    redirectUrl: "",
    enableComments: false,
    showInNavigation: true,
    showInSitemap: true,
    showInSearch: true,
    requireAuth: false,
    allowedRoles: [],
    featuredImage: null,
    openGraph: {
      title: "",
      description: "",
      image: "",
      type: "website",
    },
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [showOpenGraph, setShowOpenGraph] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (mode === "edit" && page) {
      setFormData({
        title: page.title,
        slug: page.slug || page.title.toLowerCase().replace(/\s+/g, "-"),
        content: page.content || "",
        visibility: page.visibility || "public",
        password: "",
        visibilityGroups: [],
        isListed: page.isListed,
        priority: page.priority || 0,
        status: page.status,
        scheduledDate: undefined,
        metaTitle: "",
        metaDescription: "",
        customCSS: "",
        customJS: "",
        template: "default",
        parentPage: "",
        redirectUrl: "",
        enableComments: false,
        showInNavigation: true,
        showInSitemap: true,
        showInSearch: true,
        requireAuth: false,
        allowedRoles: [],
        featuredImage: null,
        openGraph: {
          title: "",
          description: "",
          image: "",
          type: "website",
        },
      });
    } else if (mode === "create") {
      setFormData({
        title: "",
        slug: "",
        content: "",
        visibility: "public",
        password: "",
        visibilityGroups: [],
        isListed: true,
        priority: 0,
        status: "draft",
        scheduledDate: undefined,
        metaTitle: "",
        metaDescription: "",
        customCSS: "",
        customJS: "",
        template: "default",
        parentPage: "",
        redirectUrl: "",
        enableComments: false,
        showInNavigation: true,
        showInSitemap: true,
        showInSearch: true,
        requireAuth: false,
        allowedRoles: [],
        featuredImage: null,
        openGraph: {
          title: "",
          description: "",
          image: "",
          type: "website",
        },
      });
    }
    setErrors({});
  }, [mode, page, isOpen]);

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

  // Auto-generate meta title from title
  useEffect(() => {
    if (formData.title && !formData.metaTitle) {
      setFormData((prev) => ({ ...prev, metaTitle: formData.title }));
    }
  }, [formData.title, formData.metaTitle]);

  // Auto-generate Open Graph title from meta title
  useEffect(() => {
    if (formData.metaTitle && !formData.openGraph.title) {
      setFormData((prev) => ({
        ...prev,
        openGraph: { ...prev.openGraph, title: formData.metaTitle },
      }));
    }
  }, [formData.metaTitle, formData.openGraph.title]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleOpenGraphChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      openGraph: { ...prev.openGraph, [field]: value },
    }));
  };

  const handleRoleToggle = (role: string) => {
    const currentRoles = formData.allowedRoles;
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];
    handleInputChange("allowedRoles", newRoles);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.visibility === "password" && !formData.password?.trim()) {
      newErrors.password = "Password is required for password-protected pages";
    }

    if (formData.redirectUrl && !/^https?:\/\/.+/.test(formData.redirectUrl)) {
      newErrors.redirectUrl = "Redirect URL must be a valid HTTP/HTTPS URL";
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-[#f7a5a5]/20 rounded-lg w-full max-w-6xl my-4 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-[#f7a5a5]/20 p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileText size={20} className="text-[#f7a5a5]" />
            <h2 className="text-base sm:text-lg font-semibold text-[#f7a5a5]">
              {mode === "create" ? "Create New Page" : "Edit Page"}
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
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                    placeholder="Enter page title..."
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      handleInputChange(
                        "slug",
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                      )
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 font-mono"
                    placeholder="page-url-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-400 text-xs mt-1">{errors.slug}</p>
                  )}
                  <p className="text-xs text-white/60 mt-1">
                    URL: /{formData.slug || "page-url-slug"}
                  </p>
                </div>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Priority
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          "priority",
                          Math.max(-10, formData.priority - 1)
                        )
                      }
                      className="p-2 text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) =>
                        handleInputChange(
                          "priority",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-16 px-2 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white text-center"
                      min="-10"
                      max="10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          "priority",
                          Math.min(10, formData.priority + 1)
                        )
                      }
                      className="p-2 text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Higher priority pages appear first (-10 to 10)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Template
                  </label>
                  <select
                    value={formData.template}
                    onChange={(e) =>
                      handleInputChange("template", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
                  >
                    {PAGE_TEMPLATES.map((template) => (
                      <option key={template} value={template}>
                        {template
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Parent Page
                  </label>
                  <select
                    value={formData.parentPage}
                    onChange={(e) =>
                      handleInputChange("parentPage", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
                  >
                    {MOCK_PAGES.map((mockPage) => (
                      <option key={mockPage.id} value={mockPage.slug}>
                        {mockPage.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <MarkdownEditor
                value={formData.content}
                onChange={(value: string) =>
                  handleInputChange("content", value)
                }
                placeholder="Write your page content using Markdown..."
                height="h-64 sm:h-80 lg:h-96"
                label="Page Content *"
                error={errors.content}
                showToolbar={true}
              />
            </div>

            {/* Visibility Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#f7a5a5] flex items-center gap-2">
                <Eye size={18} />
                Visibility & Access
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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
                          handleInputChange("visibility", e.target.value)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`flex items-center gap-2 p-3 rounded w-full transition-all ${
                          formData.visibility === value
                            ? "bg-[#f7a5a5]/20 text-[#f7a5a5] border border-[#f7a5a5]/50"
                            : "text-white/70 hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <Icon size={16} />
                        <div>
                          <div className="font-medium text-sm">{label}</div>
                          <div className="text-xs opacity-70 hidden lg:block">
                            {description}
                          </div>
                        </div>
                      </div>
                    </label>
                  )
                )}
              </div>

              {/* Password Field */}
              {formData.visibility === "password" && (
                <div>
                  <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
                    placeholder="Enter password..."
                  />
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              {/* Quick Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-[#f7a5a5] text-sm">
                    Listed in Navigation
                  </span>
                  <Toggle
                    checked={formData.isListed}
                    onChange={(checked) =>
                      handleInputChange("isListed", checked)
                    }
                    size="sm"
                    variant="primary"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-[#f7a5a5] text-sm">
                    Show in Navigation
                  </span>
                  <Toggle
                    checked={formData.showInNavigation}
                    onChange={(checked) =>
                      handleInputChange("showInNavigation", checked)
                    }
                    size="sm"
                    variant="primary"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-[#f7a5a5] text-sm">
                    Include in Sitemap
                  </span>
                  <Toggle
                    checked={formData.showInSitemap}
                    onChange={(checked) =>
                      handleInputChange("showInSitemap", checked)
                    }
                    size="sm"
                    variant="primary"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-[#f7a5a5] text-sm">Allow Search</span>
                  <Toggle
                    checked={formData.showInSearch}
                    onChange={(checked) =>
                      handleInputChange("showInSearch", checked)
                    }
                    size="sm"
                    variant="primary"
                  />
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
                <div className="space-y-6 pl-0 sm:pl-6">
                  {/* SEO Settings */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowSEO(!showSEO)}
                      className="flex items-center gap-2 text-[#f7a5a5] hover:text-[#f7a5a5]/80 transition-colors mb-3"
                    >
                      <Hash size={14} />
                      SEO Settings
                      {showSEO ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>

                    {showSEO && (
                      <div className="space-y-4 pl-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                              Meta Title
                            </label>
                            <input
                              type="text"
                              value={formData.metaTitle}
                              onChange={(e) =>
                                handleInputChange("metaTitle", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                              placeholder="SEO title for search engines..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                              Featured Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleInputChange(
                                  "featuredImage",
                                  e.target.files?.[0] || null
                                )
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                            Meta Description
                          </label>
                          <textarea
                            value={formData.metaDescription}
                            onChange={(e) =>
                              handleInputChange(
                                "metaDescription",
                                e.target.value
                              )
                            }
                            className="w-full h-20 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 resize-none"
                            placeholder="Brief description for search engines (150-160 characters)..."
                            maxLength={160}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Open Graph Settings */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowOpenGraph(!showOpenGraph)}
                      className="flex items-center gap-2 text-[#f7a5a5] hover:text-[#f7a5a5]/80 transition-colors mb-3"
                    >
                      <Globe size={14} />
                      Social Media (Open Graph)
                      {showOpenGraph ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>

                    {showOpenGraph && (
                      <div className="space-y-4 pl-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                              OG Title
                            </label>
                            <input
                              type="text"
                              value={formData.openGraph.title}
                              onChange={(e) =>
                                handleOpenGraphChange("title", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                              placeholder="Title for social media sharing..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                              OG Type
                            </label>
                            <select
                              value={formData.openGraph.type}
                              onChange={(e) =>
                                handleOpenGraphChange("type", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
                            >
                              <option value="website">Website</option>
                              <option value="article">Article</option>
                              <option value="profile">Profile</option>
                              <option value="book">Book</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                            OG Description
                          </label>
                          <textarea
                            value={formData.openGraph.description}
                            onChange={(e) =>
                              handleOpenGraphChange(
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full h-16 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 resize-none"
                            placeholder="Description for social media sharing..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                            OG Image URL
                          </label>
                          <input
                            type="url"
                            value={formData.openGraph.image}
                            onChange={(e) =>
                              handleOpenGraphChange("image", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Redirect URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.redirectUrl}
                        onChange={(e) =>
                          handleInputChange("redirectUrl", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
                        placeholder="https://redirect-to-this-url.com"
                      />
                      {errors.redirectUrl && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.redirectUrl}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-[#f7a5a5] text-sm">
                        Enable Comments
                      </span>
                      <Toggle
                        checked={formData.enableComments}
                        onChange={(checked) =>
                          handleInputChange("enableComments", checked)
                        }
                        size="sm"
                        variant="primary"
                      />
                    </div>
                  </div>

                  {/* Custom Code */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Custom CSS
                      </label>
                      <textarea
                        value={formData.customCSS}
                        onChange={(e) =>
                          handleInputChange("customCSS", e.target.value)
                        }
                        className="w-full h-24 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 font-mono text-sm resize-none"
                        placeholder="/* Custom CSS for this page */"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
                        Custom JavaScript
                      </label>
                      <textarea
                        value={formData.customJS}
                        onChange={(e) =>
                          handleInputChange("customJS", e.target.value)
                        }
                        className="w-full h-24 px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 font-mono text-sm resize-none"
                        placeholder="// Custom JavaScript for this page"
                      />
                    </div>
                  </div>

                  {/* Role-based Access */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg mb-4">
                    <span className="text-[#f7a5a5] text-sm">
                      Require Authentication
                    </span>
                    <Toggle
                      checked={formData.requireAuth}
                      onChange={(checked) =>
                        handleInputChange("requireAuth", checked)
                      }
                      size="sm"
                      variant="primary"
                    />
                  </div>

                  {formData.requireAuth && (
                    <div>
                      <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
                        Allowed Roles
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {USER_ROLES.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleToggle(role)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              formData.allowedRoles.includes(role)
                                ? "bg-[#f7a5a5] text-white"
                                : "bg-white/10 text-white/70 hover:bg-white/20"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
              className="flex-1 px-4 py-2 bg-[#f7a5a5] text-white rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
            >
              {mode === "create" ? "Create Page" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageModal;
