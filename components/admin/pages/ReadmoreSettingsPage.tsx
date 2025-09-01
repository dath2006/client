"use client";

import React, { useState } from "react";
import Toggle from "../../common/Toggle";

const ReadmoreSettingsPage = () => {
  const [formData, setFormData] = useState({
    applyToFeeds: false,
    defaultText: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving readmore settings:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Read More Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure how "read more" links behave in your blog posts
        </p>
      </div>

      <div className="space-y-6">
        {/* Read More Configuration */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Read More Configuration
          </h2>

          {/* Apply to Feeds */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Apply to Feeds
              </label>
              <p className="text-xs text-secondary mt-1">
                Include "read more" functionality in RSS/JSON feeds and
                syndicated content.
              </p>
            </div>
            <Toggle
              checked={formData.applyToFeeds}
              onChange={(checked) => handleInputChange("applyToFeeds", checked)}
              label="Apply to Feeds toggle"
              variant="primary"
              size="md"
            />
          </div>

          {/* Default Text */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Default Text (optional)
            </label>
            <input
              type="text"
              value={formData.defaultText}
              onChange={(e) => handleInputChange("defaultText", e.target.value)}
              placeholder="Read more..."
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            <p className="text-xs text-secondary">
              The default text to display for "read more" links. Leave empty to
              use the module's default text.
            </p>
          </div>
        </div>

        {/* Usage Information */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            How to Use Read More
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <p className="text-secondary text-sm leading-relaxed mb-4">
              The Read More module allows you to add "…more" links to your blog
              index by using special markers in your posts.
            </p>
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Usage Examples:</h4>
              <div className="space-y-3">
                <div className="p-3 bg-default/30 rounded-lg">
                  <code className="text-sm font-mono text-primary">
                    &lt;!--more--&gt;
                  </code>
                  <p className="text-xs text-secondary mt-1">
                    Basic "read more" marker with default text
                  </p>
                </div>
                <div className="p-3 bg-default/30 rounded-lg">
                  <code className="text-sm font-mono text-primary">
                    &lt;!--more Continue reading this post--&gt;
                  </code>
                  <p className="text-xs text-secondary mt-1">
                    Custom "read more" text for this specific post
                  </p>
                </div>
                <div className="p-3 bg-default/30 rounded-lg">
                  <code className="text-sm font-mono text-primary">
                    &lt;!--more See the full tutorial--&gt;
                  </code>
                  <p className="text-xs text-secondary mt-1">
                    Another example with custom text
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Behavior */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Content Behavior
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">On Blog Index</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Shows content up to the marker</li>
                <li>• Displays "read more" link</li>
                <li>• Hides remaining content</li>
                <li>• Links to full post view</li>
              </ul>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">On Single Post</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Shows complete post content</li>
                <li>• Ignores read more markers</li>
                <li>• No truncation applied</li>
                <li>• Full content visibility</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feed Integration */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Feed Integration
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs">ℹ️</span>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">Feed Behavior</h4>
                <p className="text-secondary text-sm leading-relaxed mb-3">
                  When "Apply to Feeds" is enabled, your RSS and JSON feeds will
                  also respect the read more markers, showing only the excerpt
                  portion of posts rather than the full content.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    <span className="text-sm text-secondary">
                      <strong>Enabled:</strong> Feeds show excerpts with read
                      more links
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-warning rounded-full"></span>
                    <span className="text-sm text-secondary">
                      <strong>Disabled:</strong> Feeds show complete post
                      content
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Current Configuration
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">
                Feed Integration
              </h4>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.applyToFeeds ? "bg-success" : "bg-warning"
                  }`}
                ></span>
                <span className="text-sm text-secondary">
                  {formData.applyToFeeds ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Default Text</h4>
              <div className="text-sm text-secondary">
                {formData.defaultText || (
                  <span className="italic">Using module default</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            className="btn-primary px-6 py-3 font-medium"
          >
            Update Read More Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadmoreSettingsPage;
