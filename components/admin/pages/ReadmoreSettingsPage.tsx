"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

// --- Animation Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ReadmoreSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => console.log("Read more settings saved successfully"),
      onSaveError: (error) =>
        console.error("Failed to save read more settings:", error),
    });

  const handleInputChange = (field: string, value: string | boolean) => {
    updateSetting(field, value);
  };

  const handleSave = async () => {
    await saveSettings();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 max-w-4xl p-6 mx-auto">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-secondary"
        >
          Loading settings...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="max-w-4xl p-6 mx-auto space-y-8"
    >
      <motion.div variants={sectionVariants}>
        <h1 className="mb-2 text-3xl font-bold text-primary">
          Read More Settings
        </h1>
        <p className="text-sm text-secondary">
          Configure "read more" links in your blog posts
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 border rounded-lg bg-error/5 border-error/20 text-error text-sm"
          >
            {error as string}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Read More Configuration */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Read More Configuration
          </h2>
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface">
            {/* ... Apply to Feeds Toggle ... */}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Default Text (optional)
            </label>
            <input
              type="text"
              value={settings.defaultText}
              onChange={(e) => handleInputChange("defaultText", e.target.value)}
              placeholder="Read more..."
              className="w-full p-3 transition-all duration-200 border rounded-lg bg-surface border-default focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </motion.div>

        {/* Usage Information */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            How to Use Read More
          </h2>
          <div className="p-4 border rounded-lg bg-surface border-default">
            <p className="mb-4 text-sm leading-relaxed text-secondary">
              Use special markers in your posts to create "…more" links on your
              blog index.
            </p>
            <div className="space-y-3">
              <motion.div
                whileHover={{ y: -2 }}
                className="p-3 rounded-lg bg-default/30"
              >
                {/* ... Example 1 ... */}
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                className="p-3 rounded-lg bg-default/30"
              >
                {/* ... Example 2 ... */}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Other informational cards */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          {/* ... Content Behavior Card ... */}
        </motion.div>
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          {/* ... Feed Integration Card ... */}
        </motion.div>

        {/* Current Settings Summary */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Current Configuration
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 border rounded-lg bg-surface border-default">
              <h4 className="mb-2 font-medium text-primary">
                Feed Integration
              </h4>
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{
                    backgroundColor: settings.applyToFeeds
                      ? "#10b981"
                      : "#f97316",
                  }}
                  className="w-3 h-3 rounded-full"
                />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={String(settings.applyToFeeds)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-secondary"
                  >
                    {settings.applyToFeeds ? "Enabled" : "Disabled"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-surface border-default">
              <h4 className="mb-2 font-medium text-primary">Default Text</h4>
              <AnimatePresence mode="wait">
                <motion.div
                  key={settings.defaultText || "default"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-secondary"
                >
                  {settings.defaultText || (
                    <span className="italic">Using module default</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          variants={sectionVariants}
          className="flex justify-end pt-6"
        >
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 font-medium btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Update Read More Settings"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReadmoreSettingsPage;
