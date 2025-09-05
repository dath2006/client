"use client";

import React from "react";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

const CascadeSettingsPage = () => {
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
      console.log("Cascade settings saved successfully");
    },
    onSaveError: (error: any) => {
      console.error("Failed to save cascade settings:", error);
    },
  });

  const handleInputChange = (field: string, value: boolean) => {
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
          Cascade Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure infinite scrolling behavior for your blog
        </p>
      </div>

      {error && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Cascade Configuration */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Infinite Scrolling Configuration
          </h2>

          {/* Automatic Loading */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Automatic
              </label>
              <p className="text-xs text-secondary mt-1">
                Load more posts when the visitor scrolls to the bottom of the
                page?
              </p>
            </div>
            <Toggle
              checked={settings.automatic}
              onChange={(checked) => handleInputChange("automatic", checked)}
              label="Automatic loading toggle"
              variant="primary"
              size="md"
            />
          </div>
        </div>

        {/* Behavior Preview */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Scrolling Behavior Preview
          </h2>
          <div className="bg-surface rounded-lg border border-default p-6">
            <h4 className="font-medium text-primary mb-4">
              How cascade will work:
            </h4>
            <div className="space-y-4">
              {settings.automatic ? (
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-success text-xs">✓</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-success mb-2">
                        Automatic Loading Enabled
                      </h5>
                      <ul className="text-sm text-secondary space-y-1">
                        <li>
                          • Posts load automatically when user scrolls to bottom
                        </li>
                        <li>• Seamless infinite scrolling experience</li>
                        <li>• No clicking required from visitors</li>
                        <li>• Smooth AJAX-powered content loading</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-warning text-xs">!</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-warning mb-2">
                        Manual Loading Mode
                      </h5>
                      <ul className="text-sm text-secondary space-y-1">
                        <li>• "Load More" button appears at bottom of page</li>
                        <li>• Visitors must click to load additional posts</li>
                        <li>• Gives users control over content loading</li>
                        <li>• Reduces automatic bandwidth usage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Experience Impact */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            User Experience Impact
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">
                Automatic Scrolling
              </h4>
              <div className="space-y-2 text-sm text-secondary">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Seamless browsing experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Encourages deeper content exploration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-warning rounded-full"></span>
                  <span>May increase bandwidth usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-warning rounded-full"></span>
                  <span>Less user control over loading</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Manual Loading</h4>
              <div className="space-y-2 text-sm text-secondary">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>User controls content loading</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Conserves bandwidth</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-warning rounded-full"></span>
                  <span>Requires additional user action</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-warning rounded-full"></span>
                  <span>May reduce content discovery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Information */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            About Cascade
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <p className="text-secondary text-sm leading-relaxed mb-4">
              The Cascade module adds AJAX-powered infinite scrolling to your
              blog, allowing visitors to load additional posts without page
              refreshes. This creates a smooth, modern browsing experience
              similar to social media platforms.
            </p>
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Technical Features:</h4>
              <ul className="text-sm text-secondary space-y-1 ml-4">
                <li>
                  • <strong>AJAX Loading:</strong> Posts load asynchronously
                  without page refreshes
                </li>
                <li>
                  • <strong>Progressive Enhancement:</strong> Fallback to
                  pagination if JavaScript is disabled
                </li>
                <li>
                  • <strong>SEO Friendly:</strong> Maintains proper URL
                  structure and navigation
                </li>
                <li>
                  • <strong>Performance Optimized:</strong> Loads content on
                  demand to reduce initial page size
                </li>
                <li>
                  • <strong>Mobile Responsive:</strong> Works smoothly on touch
                  devices
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Considerations */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Performance Considerations
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Server Impact</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Reduces server load per page view</li>
                <li>• Spreads content loading over time</li>
                <li>• May increase total requests per session</li>
                <li>• Requires AJAX endpoint handling</li>
              </ul>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Client Impact</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Faster initial page load times</li>
                <li>• Progressive content loading</li>
                <li>• Requires JavaScript to be enabled</li>
                <li>• May increase memory usage over time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Current Configuration
          </h2>
          <div className="p-4 bg-surface rounded-lg border border-default">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary mb-1">
                  Loading Behavior
                </h4>
                <p className="text-sm text-secondary">
                  {settings.automatic
                    ? "Posts will load automatically when users scroll to the bottom"
                    : "Users will see a 'Load More' button to manually load additional posts"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    settings.automatic ? "bg-success" : "bg-warning"
                  }`}
                ></span>
                <span className="text-sm text-secondary font-medium">
                  {settings.automatic ? "Automatic" : "Manual"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Update Cascade Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CascadeSettingsPage;
