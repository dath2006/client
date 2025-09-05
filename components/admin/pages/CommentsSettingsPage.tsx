"use client";

import React from "react";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

const CommentsSettingsPage = () => {
  const {
    settings,
    loading,
    saving,
    error,
    updateSetting,
    saveSettings,
    resetSettings,
  } = useSettings({
    onSaveSuccess: () => {
      console.log("Comment settings saved successfully");
    },
    onSaveError: (error: any) => {
      console.error("Failed to save comment settings:", error);
    },
  });

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    updateSetting(field, value);
  };

  const handleSave = async () => {
    await saveSettings();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-secondary">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Comment Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure comment notifications, content filtering, and display
          options
        </p>
      </div>

      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Notification Settings
          </h2>

          {/* Site Notifications */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Site Notifications
              </label>
              <p className="text-xs text-tertiary mt-1">
                Notify the site contact by email when a comment is added.
              </p>
            </div>
            <Toggle
              checked={settings.siteNotifications || true}
              onChange={(checked) =>
                handleInputChange("siteNotifications", checked)
              }
              label="Site Notifications toggle"
              variant="primary"
              size="md"
            />
          </div>

          {/* Author Notifications */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Author Notifications
              </label>
              <p className="text-xs text-tertiary mt-1">
                Notify the post author by email when a comment is added.
              </p>
            </div>
            <Toggle
              checked={settings.authorNotifications}
              onChange={(checked) =>
                handleInputChange("authorNotifications", checked)
              }
              label="Author Notifications toggle"
              variant="secondary"
              size="md"
            />
          </div>
        </div>

        {/* Comment Moderation */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Comment Moderation
          </h2>

          {/* Default Comment Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Default Comment Status
            </label>
            <select
              value={settings.defaultCommentStatus}
              onChange={(e) =>
                handleInputChange("defaultCommentStatus", e.target.value)
              }
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
              <option value="spam">Spam</option>
              <option value="pending">Pending Review</option>
            </select>
            <p className="text-xs text-tertiary">
              The default status for new comments before moderation.
            </p>
          </div>
        </div>

        {/* Content Filtering */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Content Filtering
          </h2>

          {/* HTML in Comments */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                HTML in Comments
              </label>
              <p className="text-xs text-tertiary mt-1">
                Allow some groups of users to enter HTML directly in comment
                text.
              </p>
            </div>
            <Toggle
              checked={settings.htmlInComments}
              onChange={(checked) =>
                handleInputChange("htmlInComments", checked)
              }
              label="HTML in Comments toggle"
              variant="warning"
              size="md"
            />
          </div>

          {/* Allowed HTML */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Allowed HTML (comma separated)
            </label>
            <textarea
              value={settings.allowedHtml}
              onChange={(e) => handleInputChange("allowedHtml", e.target.value)}
              rows={3}
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none font-mono text-sm"
              placeholder="a, blockquote, code, em, li, ol, pre, strong, ul"
            />
            <p className="text-xs text-tertiary">
              HTML tags that can be added by users, Markdown filtering, and
              modules.
            </p>
          </div>
        </div>

        {/* Display Options */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Display Options
          </h2>

          {/* Comments Per Page */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Comments Per Page
            </label>
            <input
              type="number"
              value={settings.commentsPerPage}
              onChange={(e) =>
                handleInputChange(
                  "commentsPerPage",
                  parseInt(e.target.value) || 0
                )
              }
              min="1"
              max="100"
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            <p className="text-xs text-tertiary">
              Themes decide whether or not to paginate comments.
            </p>
          </div>

          {/* Reload Comments */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Reload Comments
              </label>
              <p className="text-xs text-tertiary mt-1">
                Show newly added comments (up to the maximum number per page).
              </p>
            </div>
            <Toggle
              checked={settings.reloadComments}
              onChange={(checked) =>
                handleInputChange("reloadComments", checked)
              }
              label="Reload Comments toggle"
              variant="success"
              size="md"
            />
          </div>

          {/* Reload Interval */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Reload Interval (seconds)
            </label>
            <input
              type="number"
              value={settings.reloadInterval}
              onChange={(e) =>
                handleInputChange(
                  "reloadInterval",
                  parseInt(e.target.value) || 0
                )
              }
              min="5"
              max="300"
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            <p className="text-xs text-tertiary">
              How often to check for new comments when reload is enabled.
            </p>
          </div>
        </div>

        {/* Comment Status Overview */}
        <div className="bg-card rounded-lg card-shadow p-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Current Configuration Summary
          </h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  settings.siteNotifications
                    ? "bg-success/5 border-success"
                    : "bg-muted/5 border-muted"
                }`}
              >
                <h3 className="font-medium text-sm text-primary mb-1">
                  Site Notifications
                </h3>
                <p className="text-xs text-secondary">
                  {settings.siteNotifications
                    ? "Site contact receives email alerts"
                    : "Site notifications disabled"}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg border-l-4 ${
                  settings.authorNotifications
                    ? "bg-success/5 border-success"
                    : "bg-muted/5 border-muted"
                }`}
              >
                <h3 className="font-medium text-sm text-primary mb-1">
                  Author Notifications
                </h3>
                <p className="text-xs text-secondary">
                  {settings.authorNotifications
                    ? "Authors receive email alerts"
                    : "Author notifications disabled"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 bg-primary/5 border-primary">
              <h3 className="font-medium text-sm text-primary mb-1">
                Comment Processing
              </h3>
              <p className="text-xs text-secondary">
                New comments are set to "{settings.defaultCommentStatus}" by
                default.
                {settings.htmlInComments
                  ? " HTML tags are allowed."
                  : " HTML tags are stripped."}
                {settings.reloadComments &&
                  ` Comments reload every ${settings.reloadInterval} seconds.`}
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border-l-4 ${
                settings.htmlInComments
                  ? "bg-warning/5 border-warning"
                  : "bg-success/5 border-success"
              }`}
            >
              <h3 className="font-medium text-sm text-primary mb-1">
                Content Security
              </h3>
              <p className="text-xs text-secondary">
                {settings.htmlInComments
                  ? `HTML is allowed: ${settings.allowedHtml}`
                  : "HTML is not allowed in comments for security"}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            className="btn-primary px-6 py-3 font-medium"
          >
            Save Comment Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsSettingsPage;
