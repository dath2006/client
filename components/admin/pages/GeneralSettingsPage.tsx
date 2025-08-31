"use client";

import React, { useState } from "react";
import Toggle from "../../common/Toggle";

const GeneralSettingsPage = () => {
  const [formData, setFormData] = useState({
    siteName: "My Awesome Site",
    description: "demo",
    chyrpUrl: "http://127.0.0.1:8080",
    canonicalUrl: "",
    contactEmail: "sathishdutt0@gmail.com",
    timeZone: "UTC",
    language: "en_US",
    monospaceFont: true,
    checkUpdates: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving settings:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          General Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure your site's basic information and preferences
        </p>
      </div>

      <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
        {/* Site Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Site Name
          </label>
          <input
            type="text"
            value={formData.siteName}
            onChange={(e) => handleInputChange("siteName", e.target.value)}
            className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
            className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
          />
        </div>

        {/* Chyrp URL */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Chyrp URL
          </label>
          <input
            type="url"
            value={formData.chyrpUrl}
            onChange={(e) => handleInputChange("chyrpUrl", e.target.value)}
            className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          <p className="text-xs text-tertiary">The base URL for your site.</p>
        </div>

        {/* Canonical URL */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Canonical URL (optional)
            <span className="ml-2 inline-flex items-center justify-center w-4 h-4 text-xs bg-muted text-white rounded-full">
              ?
            </span>
          </label>
          <input
            type="url"
            value={formData.canonicalUrl}
            onChange={(e) => handleInputChange("canonicalUrl", e.target.value)}
            className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          <p className="text-xs text-tertiary">
            Have your site URLs point someplace other than your install
            directory.
          </p>
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Contact Email Address
          </label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange("contactEmail", e.target.value)}
            className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>

        {/* Time Zone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Time Zone
          </label>
          <select
            value={formData.timeZone}
            onChange={(e) => handleInputChange("timeZone", e.target.value)}
            className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
            <option value="Australia/Sydney">Australia/Sydney</option>
          </select>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleInputChange("language", e.target.value)}
            className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          >
            <option value="en_US">English (US)</option>
            <option value="en_GB">English (UK)</option>
            <option value="es_ES">Español</option>
            <option value="fr_FR">Français</option>
            <option value="de_DE">Deutsch</option>
            <option value="ja_JP">日本語</option>
          </select>
        </div>

        {/* Toggle Switches */}
        <div className="space-y-6 pt-4 border-t border-default">
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Monospace Font
              </label>
              <p className="text-xs text-tertiary mt-1">
                Write with a monospace font.
              </p>
            </div>
            <Toggle
              checked={formData.monospaceFont}
              onChange={(checked) =>
                handleInputChange("monospaceFont", checked)
              }
              label="Monospace Font toggle"
              variant="primary"
              size="md"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Check for Updates
              </label>
              <p className="text-xs text-tertiary mt-1">
                Current version: 2025.02
              </p>
            </div>
            <Toggle
              checked={formData.checkUpdates}
              onChange={(checked) => handleInputChange("checkUpdates", checked)}
              label="Check for Updates toggle"
              variant="secondary"
              size="md"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-default">
          <button
            onClick={handleSave}
            className="btn-primary px-6 py-3 font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
