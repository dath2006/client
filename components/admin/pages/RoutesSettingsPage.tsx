"use client";

import React from "react";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

const RoutesSettingsPage = () => {
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
      console.log("Routes settings saved successfully");
    },
    onSaveError: (error) => {
      console.error("Failed to save routes settings:", error);
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
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

  const handleDownloadRewriteFiles = () => {
    // Handle download logic here
    console.log("Downloading URL rewrite files...");
  };

  const urlSyntaxOptions = [
    { token: "(year)", description: "Year submitted (e.g. 2007)" },
    { token: "(month)", description: "Month submitted (e.g. 12)" },
    { token: "(day)", description: "Day submitted (e.g. 25)" },
    { token: "(hour)", description: "Hour submitted (e.g. 03)" },
    { token: "(minute)", description: "Minute submitted (e.g. 59)" },
    { token: "(second)", description: "Second submitted (e.g. 30)" },
    { token: "(id)", description: "Post ID" },
    { token: "(author)", description: "Post author (username) (e.g. Alex)" },
    {
      token: "(clean)",
      description: "The non-unique slug (e.g. this_is_clean)",
    },
    {
      token: "(url)",
      description: "The unique form of (clean) (e.g. this_one_is_taken_2)",
    },
    { token: "(feather)", description: "The post's feather (e.g. text)" },
    {
      token: "(feathers)",
      description: "The plural form of the post's feather (e.g. links)",
    },
  ];

  const presetUrls = [
    { name: "Default", pattern: "(year)/(month)/(day)/(url)/" },
    { name: "Simple", pattern: "(url)/" },
    { name: "With ID", pattern: "(id)/(url)/" },
    { name: "By Author", pattern: "(author)/(url)/" },
    { name: "By Feather", pattern: "(feather)/(url)/" },
    {
      name: "Full Date",
      pattern: "(year)/(month)/(day)/(hour)/(minute)/(url)/",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Routes Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure URL structure and routing behavior for your blog
        </p>
      </div>

      {error && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Clean URLs Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            URL Configuration
          </h2>

          {/* Clean URLs Toggle */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Clean URLs
              </label>
              <p className="text-xs text-secondary mt-1">
                Gives your site prettier URLs. Requires server configuration.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Toggle
                checked={settings.cleanUrls}
                onChange={(checked) => handleInputChange("cleanUrls", checked)}
                label="Clean URLs toggle"
                variant="primary"
                size="md"
              />
            </div>
          </div>

          {/* Download Rewrite Files */}
          {settings.cleanUrls && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary mb-1">
                    URL Rewrite Files
                  </h4>
                  <p className="text-xs text-secondary">
                    Download the necessary server configuration files for clean
                    URLs.
                  </p>
                </div>
                <button
                  onClick={handleDownloadRewriteFiles}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                >
                  Download Files
                </button>
              </div>
            </div>
          )}

          {/* Homepage Toggle */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Homepage
              </label>
              <p className="text-xs text-secondary mt-1">
                Make the default route a homepage instead of the blog index.
              </p>
            </div>
            <Toggle
              checked={settings.homepage}
              onChange={(checked) => handleInputChange("homepage", checked)}
              label="Homepage toggle"
              variant="secondary"
              size="md"
            />
          </div>
        </div>

        {/* Post View URL Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Post View URL Structure
          </h2>

          {!settings.cleanUrls && (
            <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning font-medium mb-1">
                ⚠️ Clean URLs Required
              </p>
              <p className="text-xs text-secondary">
                Custom post view URLs require clean URLs to be enabled.
              </p>
            </div>
          )}

          {/* URL Pattern Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Post View URL Pattern
            </label>
            <input
              type="text"
              value={settings.postViewUrl}
              onChange={(e) => handleInputChange("postViewUrl", e.target.value)}
              disabled={!settings.cleanUrls}
              placeholder="(year)/(month)/(day)/(url)/"
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
            />
            <p className="text-xs text-secondary">
              Use the syntax tokens below to create your custom URL structure.
            </p>
          </div>

          {/* URL Presets */}
          <div className="space-y-3">
            <h4 className="font-medium text-primary">Quick Presets</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {presetUrls.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() =>
                    handleInputChange("postViewUrl", preset.pattern)
                  }
                  disabled={!settings.cleanUrls}
                  className="p-3 text-left bg-surface hover:bg-default/50 border border-default rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-primary text-sm">
                    {preset.name}
                  </div>
                  <div className="font-mono text-xs text-secondary mt-1">
                    {preset.pattern}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* URL Syntax Reference */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            URL Syntax Reference
          </h2>
          <div className="space-y-3">
            <p className="text-secondary text-sm">
              Use these tokens to build your custom URL patterns:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {urlSyntaxOptions.map((option) => (
                <div
                  key={option.token}
                  className="p-3 bg-surface rounded-lg border border-default"
                >
                  <code className="font-mono text-sm text-primary font-medium">
                    {option.token}
                  </code>
                  <p className="text-xs text-secondary mt-1">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* URL Preview */}
        {settings.cleanUrls && (
          <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
              URL Preview
            </h2>
            <div className="space-y-3">
              <p className="text-secondary text-sm">
                Example of how your URLs will look:
              </p>
              <div className="p-4 bg-surface rounded-lg border border-default">
                <div className="font-mono text-sm">
                  <span className="text-secondary">https://yourblog.com/</span>
                  <span className="text-primary font-medium">
                    {settings.postViewUrl.replace(
                      /\((.*?)\)/g,
                      (match: string, token: string) => {
                        const examples = {
                          year: "2024",
                          month: "08",
                          day: "31",
                          hour: "14",
                          minute: "30",
                          second: "45",
                          id: "123",
                          author: "john",
                          clean: "my_blog_post",
                          url: "my-blog-post",
                          feather: "text",
                          feathers: "texts",
                        };
                        return (
                          examples[token as keyof typeof examples] || match
                        );
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Update Routes Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutesSettingsPage;
