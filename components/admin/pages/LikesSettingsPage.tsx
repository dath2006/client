"use client";

import React, { useState } from "react";
import Toggle from "../../common/Toggle";

const LikesSettingsPage = () => {
  const [formData, setFormData] = useState({
    likeImage: "pink",
    likeWithText: false,
    showOnIndexPages: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving likes settings:", formData);
  };

  const imageOptions = [
    {
      value: "pink",
      label: "Pink",
      color: "#ec4899",
      description: "Classic pink heart icon",
    },
    {
      value: "red",
      label: "Red",
      color: "#ef4444",
      description: "Traditional red heart icon",
    },
    {
      value: "blue",
      label: "Blue",
      color: "#3b82f6",
      description: "Cool blue heart icon",
    },
    {
      value: "green",
      label: "Green",
      color: "#10b981",
      description: "Fresh green heart icon",
    },
    {
      value: "purple",
      label: "Purple",
      color: "#8b5cf6",
      description: "Royal purple heart icon",
    },
    {
      value: "orange",
      label: "Orange",
      color: "#f97316",
      description: "Warm orange heart icon",
    },
  ];

  const ImageOptionCard = ({
    option,
  }: {
    option: (typeof imageOptions)[0];
  }) => (
    <label
      className={`p-4 bg-surface rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
        formData.likeImage === option.value
          ? "border-primary bg-primary/5"
          : "border-default hover:border-primary/30"
      }`}
    >
      <input
        type="radio"
        name="likeImage"
        value={option.value}
        checked={formData.likeImage === option.value}
        onChange={(e) => handleInputChange("likeImage", e.target.value)}
        className="sr-only"
      />
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{ backgroundColor: `${option.color}20` }}
        >
          <span style={{ color: option.color }} className="text-lg">
            ♥
          </span>
        </div>
        <div>
          <div className="font-medium text-primary">{option.label}</div>
          <div className="text-xs text-secondary">{option.description}</div>
        </div>
      </div>
    </label>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Likes Settings</h1>
        <p className="text-secondary text-sm">
          Configure how the like functionality appears and behaves on your blog
        </p>
      </div>

      <div className="space-y-6">
        {/* Like Appearance Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Like Appearance
          </h2>

          {/* Like Image Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">
                Like Image
              </label>
              <p className="text-xs text-secondary">
                Choose the color and style for your like buttons.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {imageOptions.map((option) => (
                <ImageOptionCard key={option.value} option={option} />
              ))}
            </div>
          </div>
        </div>

        {/* Like Behavior Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Like Behavior
          </h2>

          {/* Like with Text */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Like with Text
              </label>
              <p className="text-xs text-secondary mt-1">
                Enables text descriptions in like/unlike links.
              </p>
            </div>
            <Toggle
              checked={formData.likeWithText}
              onChange={(checked) => handleInputChange("likeWithText", checked)}
              label="Like with Text toggle"
              variant="primary"
              size="md"
            />
          </div>

          {/* Show on Index Pages */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Show on Index Pages
              </label>
              <p className="text-xs text-secondary mt-1">
                Enables like functionality on blog index pages.
              </p>
            </div>
            <Toggle
              checked={formData.showOnIndexPages}
              onChange={(checked) =>
                handleInputChange("showOnIndexPages", checked)
              }
              label="Show on Index Pages toggle"
              variant="secondary"
              size="md"
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Like Button Preview
          </h2>
          <div className="bg-surface rounded-lg border border-default p-6">
            <h4 className="font-medium text-primary mb-4">
              How your like buttons will appear:
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-default">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: imageOptions.find(
                        (opt) => opt.value === formData.likeImage
                      )?.color,
                    }}
                    className="text-lg"
                  >
                    ♥
                  </span>
                  {formData.likeWithText && (
                    <span className="text-sm text-secondary">
                      Like this post
                    </span>
                  )}
                  <span className="text-xs text-secondary ml-2">(0 likes)</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-default">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: imageOptions.find(
                        (opt) => opt.value === formData.likeImage
                      )?.color,
                    }}
                    className="text-lg opacity-50"
                  >
                    ♥
                  </span>
                  {formData.likeWithText && (
                    <span className="text-sm text-secondary">
                      Unlike this post
                    </span>
                  )}
                  <span className="text-xs text-secondary ml-2">(3 likes)</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-secondary mt-4">
              {formData.showOnIndexPages
                ? "These buttons will appear on both individual posts and index pages."
                : "These buttons will appear only on individual post pages."}
            </p>
          </div>
        </div>

        {/* Feature Information */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            About Likes
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <p className="text-secondary text-sm leading-relaxed mb-4">
              The Likes module allows visitors to show appreciation for your
              content with a simple click. It helps gauge content popularity and
              encourages reader engagement.
            </p>
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Features:</h4>
              <ul className="text-sm text-secondary space-y-1 ml-4">
                <li>
                  • <strong>Anonymous Likes:</strong> No registration required
                  for visitors
                </li>
                <li>
                  • <strong>IP Tracking:</strong> Prevents multiple likes from
                  same visitor
                </li>
                <li>
                  • <strong>Customizable Appearance:</strong> Choose colors and
                  text options
                </li>
                <li>
                  • <strong>Index Integration:</strong> Optional display on blog
                  index pages
                </li>
                <li>
                  • <strong>Like Counts:</strong> Shows total likes for each
                  post
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Display Locations */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Display Locations
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">
                Individual Posts
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-success rounded-full"></span>
                <span className="text-sm text-secondary">Always enabled</span>
              </div>
              <p className="text-xs text-secondary">
                Like buttons always appear on single post pages where readers
                can engage with your content.
              </p>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Index Pages</h4>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.showOnIndexPages ? "bg-success" : "bg-warning"
                  }`}
                ></span>
                <span className="text-sm text-secondary">
                  {formData.showOnIndexPages ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-secondary">
                {formData.showOnIndexPages
                  ? "Like buttons appear on your blog homepage and category pages."
                  : "Like buttons are hidden on index pages to reduce clutter."}
              </p>
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Current Configuration
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Like Color</h4>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    color: imageOptions.find(
                      (opt) => opt.value === formData.likeImage
                    )?.color,
                  }}
                  className="text-lg"
                >
                  ♥
                </span>
                <span className="text-sm text-secondary capitalize">
                  {formData.likeImage}
                </span>
              </div>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Text Labels</h4>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.likeWithText ? "bg-success" : "bg-warning"
                  }`}
                ></span>
                <span className="text-sm text-secondary">
                  {formData.likeWithText ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Index Pages</h4>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.showOnIndexPages ? "bg-success" : "bg-warning"
                  }`}
                ></span>
                <span className="text-sm text-secondary">
                  {formData.showOnIndexPages ? "Enabled" : "Disabled"}
                </span>
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
            Save Likes Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default LikesSettingsPage;
