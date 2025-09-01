"use client";

import React, { useState } from "react";
import Toggle from "../../common/Toggle";

const LightboxSettingsPage = () => {
  const [formData, setFormData] = useState({
    background: "gray",
    edgeSpacing: 24,
    protectImages: false,
  });

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving lightbox settings:", formData);
  };

  const backgroundOptions = [
    {
      value: "gray",
      label: "Gray",
      color: "#6b7280",
      description: "Classic gray overlay",
    },
    {
      value: "black",
      label: "Black",
      color: "#000000",
      description: "Deep black background",
    },
    {
      value: "white",
      label: "White",
      color: "#ffffff",
      description: "Clean white background",
    },
    {
      value: "dark",
      label: "Dark",
      color: "#1f2937",
      description: "Dark charcoal overlay",
    },
    {
      value: "light",
      label: "Light",
      color: "#f3f4f6",
      description: "Light gray background",
    },
  ];

  const BackgroundOptionCard = ({
    option,
  }: {
    option: (typeof backgroundOptions)[0];
  }) => (
    <label
      className={`p-4 bg-surface rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
        formData.background === option.value
          ? "border-primary bg-primary/5"
          : "border-default hover:border-primary/30"
      }`}
    >
      <input
        type="radio"
        name="background"
        value={option.value}
        checked={formData.background === option.value}
        onChange={(e) => handleInputChange("background", e.target.value)}
        className="sr-only"
      />
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg border border-default/30"
          style={{ backgroundColor: option.color }}
        ></div>
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
        <h1 className="text-3xl font-bold text-primary mb-2">
          Lightbox Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure how images are displayed in the lightbox overlay
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Appearance Settings
          </h2>

          {/* Background Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">
                Background
              </label>
              <p className="text-xs text-secondary">
                Choose the background color for the lightbox overlay.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {backgroundOptions.map((option) => (
                <BackgroundOptionCard key={option.value} option={option} />
              ))}
            </div>
          </div>

          {/* Edge Spacing */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Edge Spacing (pixels)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={formData.edgeSpacing}
                onChange={(e) =>
                  handleInputChange("edgeSpacing", parseInt(e.target.value))
                }
                className="flex-1 h-2 bg-surface rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.edgeSpacing}
                  onChange={(e) =>
                    handleInputChange(
                      "edgeSpacing",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-20 p-2 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center"
                />
                <span className="text-sm text-secondary">px</span>
              </div>
            </div>
            <p className="text-xs text-secondary">
              The minimum distance between the image and the edge of the
              viewport.
            </p>
          </div>
        </div>

        {/* Protection Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Image Protection
          </h2>

          {/* Protect Images */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Protect Images
              </label>
              <p className="text-xs text-secondary mt-1">
                Prevent visitors from saving images?
              </p>
            </div>
            <Toggle
              checked={formData.protectImages}
              onChange={(checked) =>
                handleInputChange("protectImages", checked)
              }
              label="Protect Images toggle"
              variant="warning"
              size="md"
            />
          </div>

          {formData.protectImages && (
            <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning font-medium mb-1">
                ⚠️ Protection Notice
              </p>
              <p className="text-xs text-secondary">
                Image protection provides basic deterrence but is not foolproof.
                Determined users can still access images through browser
                developer tools or by disabling JavaScript.
              </p>
            </div>
          )}
        </div>

        {/* Lightbox Preview */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Lightbox Preview
          </h2>
          <div className="bg-surface rounded-lg border border-default p-6">
            <h4 className="font-medium text-primary mb-4">
              How your lightbox will appear:
            </h4>

            {/* Mock Lightbox Preview */}
            <div className="relative">
              <div
                className="relative w-full h-64 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: backgroundOptions.find(
                    (opt) => opt.value === formData.background
                  )?.color,
                  padding: `${formData.edgeSpacing}px`,
                }}
              >
                <div className="bg-white rounded-lg shadow-2xl p-4 max-w-sm">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-32 rounded mb-2 flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Sample Image
                  </p>
                  {formData.protectImages && (
                    <div className="absolute top-2 right-2 bg-warning/80 text-white text-xs px-2 py-1 rounded">
                      🔒 Protected
                    </div>
                  )}
                </div>
                <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600">
                  ✕
                </button>
              </div>
              <p className="text-xs text-secondary mt-3 text-center">
                Edge spacing: {formData.edgeSpacing}px • Background:{" "}
                {
                  backgroundOptions.find(
                    (opt) => opt.value === formData.background
                  )?.label
                }
              </p>
            </div>
          </div>
        </div>

        {/* Feature Information */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            About Lightbox
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <p className="text-secondary text-sm leading-relaxed mb-4">
              The Lightbox module provides an elegant way to display images in
              an overlay, allowing visitors to view photos in full size without
              leaving the current page. It enhances the browsing experience with
              smooth transitions and intuitive controls.
            </p>
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Features:</h4>
              <ul className="text-sm text-secondary space-y-1 ml-4">
                <li>
                  • <strong>Responsive Design:</strong> Automatically adjusts to
                  different screen sizes
                </li>
                <li>
                  • <strong>Keyboard Navigation:</strong> Use arrow keys and ESC
                  to navigate
                </li>
                <li>
                  • <strong>Touch Support:</strong> Swipe gestures on mobile
                  devices
                </li>
                <li>
                  • <strong>Image Protection:</strong> Optional right-click and
                  drag prevention
                </li>
                <li>
                  • <strong>Customizable Appearance:</strong> Adjustable
                  background and spacing
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Browser Compatibility */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Browser Support & Controls
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">
                Keyboard Controls
              </h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>
                  •{" "}
                  <kbd className="px-2 py-1 bg-default/50 rounded text-xs">
                    ESC
                  </kbd>{" "}
                  Close lightbox
                </li>
                <li>
                  •{" "}
                  <kbd className="px-2 py-1 bg-default/50 rounded text-xs">
                    ←→
                  </kbd>{" "}
                  Navigate images
                </li>
                <li>
                  •{" "}
                  <kbd className="px-2 py-1 bg-default/50 rounded text-xs">
                    Space
                  </kbd>{" "}
                  Next image
                </li>
                <li>
                  •{" "}
                  <kbd className="px-2 py-1 bg-default/50 rounded text-xs">
                    Enter
                  </kbd>{" "}
                  Full size view
                </li>
              </ul>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Touch & Mouse</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Swipe left/right on touch devices</li>
                <li>• Click outside image to close</li>
                <li>• Mouse wheel to zoom (if supported)</li>
                <li>• Drag protection (when enabled)</li>
              </ul>
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
              <h4 className="font-medium text-primary mb-2">Background</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-default/30"
                  style={{
                    backgroundColor: backgroundOptions.find(
                      (opt) => opt.value === formData.background
                    )?.color,
                  }}
                ></div>
                <span className="text-sm text-secondary capitalize">
                  {formData.background}
                </span>
              </div>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Edge Spacing</h4>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono">
                  {formData.edgeSpacing}
                </span>
                <span className="text-sm text-secondary">pixels</span>
              </div>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">
                Image Protection
              </h4>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.protectImages ? "bg-warning" : "bg-success"
                  }`}
                ></span>
                <span className="text-sm text-secondary">
                  {formData.protectImages ? "Enabled" : "Disabled"}
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
            Update Lightbox Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default LightboxSettingsPage;
