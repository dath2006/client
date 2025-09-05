"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

// --- Animation Variants ---
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const conditionalFieldVariants: Variants = {
  hidden: { opacity: 0, height: 0, y: -10, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    marginTop: "1.5rem", // Corresponds to space-y-6
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -10,
    marginTop: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const CommentsSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => console.log("Comment settings saved successfully"),
      onSaveError: (error: any) =>
        console.error("Failed to save comment settings:", error),
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
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl p-6 mx-auto space-y-8" // Increased spacing
    >
      <motion.div variants={sectionVariants} className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary">
          Comment Settings
        </h1>
        <p className="text-sm text-secondary">
          Configure notifications, content filtering, and display options
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
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Notification Settings */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Notification Settings
          </h2>
          {/* Site Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface">
            {/* ... content ... */}
          </div>
          {/* Author Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface">
            {/* ... content ... */}
          </div>
        </motion.div>

        {/* Comment Moderation */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Comment Moderation
          </h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Default Comment Status
            </label>
            <select
              value={settings.defaultCommentStatus}
              onChange={(e) =>
                handleInputChange("defaultCommentStatus", e.target.value)
              }
              className="w-full p-3 transition-all duration-200 border rounded-lg bg-surface border-default focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
              <option value="spam">Spam</option>
              <option value="pending">Pending Review</option>
            </select>
            <p className="text-xs text-tertiary">
              The default status for new comments.
            </p>
          </div>
        </motion.div>

        {/* Content Filtering */}
        <motion.div
          variants={sectionVariants}
          className="p-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 text-xl font-semibold border-b text-primary border-default">
            Content Filtering
          </h2>
          <div className="flex items-center justify-between p-4 mt-6 rounded-lg bg-surface">
            {/* ... HTML in Comments Toggle ... */}
          </div>
          <AnimatePresence>
            {settings.htmlInComments && (
              <motion.div
                key="allowed-html"
                variants={conditionalFieldVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-2 overflow-hidden"
              >
                <label className="block text-sm font-medium text-primary">
                  Allowed HTML (comma separated)
                </label>
                <textarea
                  value={settings.allowedHtml}
                  onChange={(e) =>
                    handleInputChange("allowedHtml", e.target.value)
                  }
                  rows={3}
                  className="w-full p-3 font-mono text-sm transition-all duration-200 border rounded-lg resize-none bg-surface border-default focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="a, blockquote, code, em, li, ol, pre, strong, ul"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Display Options */}
        <motion.div
          variants={sectionVariants}
          className="p-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 text-xl font-semibold border-b text-primary border-default">
            Display Options
          </h2>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              {/* ... Comments Per Page Input ... */}
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface">
              {/* ... Reload Comments Toggle ... */}
            </div>
            <AnimatePresence>
              {settings.reloadComments && (
                <motion.div
                  key="reload-interval"
                  variants={conditionalFieldVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-2 overflow-hidden"
                >
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
                    className="w-full p-3 transition-all duration-200 border rounded-lg bg-surface border-default focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Current Configuration Summary */}
        <motion.div
          variants={sectionVariants}
          className="p-6 bg-card rounded-lg card-shadow"
        >
          {/* ... Summary Content ... */}
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
            {saving ? "Saving..." : "Save Comment Settings"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CommentsSettingsPage;
