"use client";

import React, { useState } from "react";
import Toggle from "../../common/Toggle";

const ContentSettingsPage = () => {
  const [formData, setFormData] = useState({
    postsPerBlogPage: 5,
    postsInFeed: 20,
    itemsPerAdminPage: 25,
    defaultPostStatus: "public",
    defaultPageStatus: "public",
    uploadsPath: "/uploads/",
    uploadSizeLimit: 10,
    feedFormat: "JSON",
    searchPages: true,
    webmentions: true,
    unicodeEmoticons: true,
    markdown: true,
  });

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving content settings:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Content Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure content display, uploads, and behavior preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Display & Pagination Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Display & Pagination
          </h2>

          {/* Posts Per Blog Page */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Posts Per Blog Page
            </label>
            <input
              type="number"
              value={formData.postsPerBlogPage}
              onChange={(e) =>
                handleInputChange(
                  "postsPerBlogPage",
                  parseInt(e.target.value) || 0
                )
              }
              min="1"
              max="100"
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Posts in Feed */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Posts in Feed
            </label>
            <input
              type="number"
              value={formData.postsInFeed}
              onChange={(e) =>
                handleInputChange("postsInFeed", parseInt(e.target.value) || 0)
              }
              min="1"
              max="100"
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Items Per Admin Page */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Items Per Admin Page
            </label>
            <input
              type="number"
              value={formData.itemsPerAdminPage}
              onChange={(e) =>
                handleInputChange(
                  "itemsPerAdminPage",
                  parseInt(e.target.value) || 0
                )
              }
              min="1"
              max="100"
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>
        </div>

        {/* Default Status Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Default Status Settings
          </h2>

          {/* Default Post Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Default Post Status
            </label>
            <select
              value={formData.defaultPostStatus}
              onChange={(e) =>
                handleInputChange("defaultPostStatus", e.target.value)
              }
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* Default Page Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Default Page Status
            </label>
            <select
              value={formData.defaultPageStatus}
              onChange={(e) =>
                handleInputChange("defaultPageStatus", e.target.value)
              }
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="public">Public and visible in pages list</option>
              <option value="public-hidden">
                Public but hidden from pages list
              </option>
              <option value="private">Private</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Upload Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Upload Settings
          </h2>

          {/* Uploads Path */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Uploads Path
            </label>
            <input
              type="text"
              value={formData.uploadsPath}
              onChange={(e) => handleInputChange("uploadsPath", e.target.value)}
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            <p className="text-xs text-tertiary">
              The directory to which files are uploaded, relative to your
              installation directory.
            </p>
          </div>

          {/* Upload Size Limit */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Upload Size Limit (Megabytes)
            </label>
            <input
              type="number"
              value={formData.uploadSizeLimit}
              onChange={(e) =>
                handleInputChange(
                  "uploadSizeLimit",
                  parseInt(e.target.value) || 0
                )
              }
              min="1"
              max="1000"
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>
        </div>

        {/* Feed Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Feed Settings
          </h2>

          {/* Feed Format */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Feed Format
            </label>
            <select
              value={formData.feedFormat}
              onChange={(e) => handleInputChange("feedFormat", e.target.value)}
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="JSON">JSON</option>
              <option value="RSS">RSS</option>
              <option value="Atom">Atom</option>
            </select>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Feature Settings
          </h2>

          {/* Search Pages */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Search Pages
              </label>
              <p className="text-xs text-tertiary mt-1">
                Include pages in search results.
              </p>
            </div>
            <Toggle
              checked={formData.searchPages}
              onChange={(checked) => handleInputChange("searchPages", checked)}
              label="Search Pages toggle"
              variant="primary"
              size="md"
            />
          </div>

          {/* Webmentions */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Webmentions
              </label>
              <p className="text-xs text-tertiary mt-1">
                Send and receive notifications when URLs are mentioned.
              </p>
            </div>
            <Toggle
              checked={formData.webmentions}
              onChange={(checked) => handleInputChange("webmentions", checked)}
              label="Webmentions toggle"
              variant="secondary"
              size="md"
            />
          </div>

          {/* Unicode Emoticons */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Unicode Emoticons
              </label>
              <p className="text-xs text-tertiary mt-1">
                Display emoticons as Unicode emoji.
              </p>
            </div>
            <Toggle
              checked={formData.unicodeEmoticons}
              onChange={(checked) =>
                handleInputChange("unicodeEmoticons", checked)
              }
              label="Unicode Emoticons toggle"
              variant="success"
              size="md"
            />
          </div>

          {/* Markdown */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Markdown
              </label>
              <p className="text-xs text-tertiary mt-1">
                Compose blog content using Markdown text formatting.
              </p>
            </div>
            <Toggle
              checked={formData.markdown}
              onChange={(checked) => handleInputChange("markdown", checked)}
              label="Markdown toggle"
              variant="primary"
              size="md"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            className="btn-primary px-6 py-3 font-medium"
          >
            Save Content Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentSettingsPage;
