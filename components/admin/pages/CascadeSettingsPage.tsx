"use client";

import React from "react";
// Import the Variants type to fix TypeScript errors
import { motion, AnimatePresence, Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

// --- Animation Variants ---
// Defines reusable animation properties for a clean and consistent look.

// Explicitly type each constant with 'Variants'
const pageContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const previewVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

const CascadeSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
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

  // Animated Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 max-w-4xl p-6 mx-auto">
        <motion.div
          className="text-secondary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading settings...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl p-6 mx-auto space-y-8"
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={sectionVariants}>
        <h1 className="mb-2 text-3xl font-bold text-primary">
          Cascade Settings
        </h1>
        <p className="text-sm text-secondary">
          Configure infinite scrolling behavior for your blog
        </p>
      </motion.div>

      {/* Animated Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="p-4 border rounded-lg bg-error/5 border-error/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <p className="text-sm text-error">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Cascade Configuration */}
        <motion.div
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
          variants={sectionVariants}
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Infinite Scrolling Configuration
          </h2>
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Automatic
              </label>
              <p className="mt-1 text-xs text-secondary">
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
        </motion.div>

        {/* Interactive Behavior Preview */}
        <motion.div
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
          variants={sectionVariants}
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Scrolling Behavior Preview
          </h2>
          <div className="p-6 border rounded-lg bg-surface border-default">
            <h4 className="mb-4 font-medium text-primary">
              How cascade will work:
            </h4>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {settings.automatic ? (
                  <motion.div
                    key="automatic-preview"
                    variants={previewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="p-4 border rounded-lg bg-success/5 border-success/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-success/20">
                        <span className="text-xs text-success">✓</span>
                      </div>
                      <div>
                        <h5 className="mb-2 font-medium text-success">
                          Automatic Loading Enabled
                        </h5>
                        <ul className="space-y-1 text-sm text-secondary">
                          <li>
                            • Posts load automatically when user scrolls to
                            bottom
                          </li>
                          <li>• Seamless infinite scrolling experience</li>
                          <li>• No clicking required from visitors</li>
                          <li>• Smooth AJAX-powered content loading</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="manual-preview"
                    variants={previewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="p-4 border rounded-lg bg-warning/5 border-warning/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-warning/20">
                        <span className="text-xs text-warning">!</span>
                      </div>
                      <div>
                        <h5 className="mb-2 font-medium text-warning">
                          Manual Loading Mode
                        </h5>
                        <ul className="space-y-1 text-sm text-secondary">
                          <li>
                            • "Load More" button appears at bottom of page
                          </li>
                          <li>
                            • Visitors must click to load additional posts
                          </li>
                          <li>• Gives users control over content loading</li>
                          <li>• Reduces automatic bandwidth usage</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* User Experience Impact */}
        <motion.div
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
          variants={sectionVariants}
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            User Experience Impact
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg bg-surface border-default">
              <h4 className="mb-2 font-medium text-primary">
                Automatic Scrolling
              </h4>
              <div className="space-y-2 text-sm text-secondary">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  <span>Seamless browsing experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  <span>Encourages deeper content exploration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning"></span>
                  <span>May increase bandwidth usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning"></span>
                  <span>Less user control over loading</span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-surface border-default">
              <h4 className="mb-2 font-medium text-primary">Manual Loading</h4>
              <div className="space-y-2 text-sm text-secondary">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  <span>User controls content loading</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  <span>Conserves bandwidth</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning"></span>
                  <span>Requires additional user action</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning"></span>
                  <span>May reduce content discovery</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Information */}
        <motion.div
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
          variants={sectionVariants}
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            About Cascade
          </h2>
          <div className="p-4 border rounded-lg bg-surface border-default">
            <p className="mb-4 text-sm leading-relaxed text-secondary">
              The Cascade module adds AJAX-powered infinite scrolling to your
              blog, allowing visitors to load additional posts without page
              refreshes. This creates a smooth, modern browsing experience
              similar to social media platforms.
            </p>
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Technical Features:</h4>
              <ul className="ml-4 space-y-1 text-sm text-secondary">
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
        </motion.div>

        {/* Performance Considerations */}
        <motion.div
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
          variants={sectionVariants}
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Performance Considerations
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 border rounded-lg bg-surface border-default">
              <h4 className="mb-2 font-medium text-primary">Server Impact</h4>
              <ul className="space-y-1 text-sm text-secondary">
                <li>• Reduces server load per page view</li>
                <li>• Spreads content loading over time</li>
                <li>• May increase total requests per session</li>
                <li>• Requires AJAX endpoint handling</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg bg-surface border-default">
              <h4 className="mb-2 font-medium text-primary">Client Impact</h4>
              <ul className="space-y-1 text-sm text-secondary">
                <li>• Faster initial page load times</li>
                <li>• Progressive content loading</li>
                <li>• Requires JavaScript to be enabled</li>
                <li>• May increase memory usage over time</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Current Settings Summary */}
        <motion.div
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
          variants={sectionVariants}
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Current Configuration
          </h2>
          <div className="p-4 border rounded-lg bg-surface border-default">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="mb-1 font-medium text-primary">
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
                <span className="text-sm font-medium text-secondary">
                  {settings.automatic ? "Automatic" : "Manual"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Save Button */}
        <motion.div
          className="flex justify-end pt-6"
          variants={sectionVariants}
        >
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 font-medium btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {saving ? "Saving..." : "Update Cascade Settings"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CascadeSettingsPage;
