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
    transition: { staggerChildren: 0.08 },
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

const ContentSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => console.log("Content settings saved successfully"),
      onSaveError: (error: any) =>
        console.error("Failed to save content settings:", error),
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
      className="max-w-4xl p-6 mx-auto space-y-8"
    >
      <motion.div variants={sectionVariants} className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary">
          Content Settings
        </h1>
        <p className="text-sm text-secondary">
          Configure content display, uploads, and behavior preferences
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
            {`Error: ${error}`}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Display & Pagination Settings */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Display & Pagination
          </h2>
          {/* All inputs inside will animate in with the card */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Posts Per Blog Page
            </label>
            <input
              type="number"
              value={settings.postsPerBlogPage || 5}
              onChange={(e) =>
                handleInputChange(
                  "postsPerBlogPage",
                  parseInt(e.target.value) || 0
                )
              }
              min="1"
              max="100"
              className="w-full p-3 transition-all duration-200 border rounded-lg bg-surface border-default focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Posts in Feed
            </label>
            <input
              type="number"
              value={settings.postsInFeed || 20}
              onChange={(e) =>
                handleInputChange("postsInFeed", parseInt(e.target.value) || 0)
              }
              min="1"
              max="100"
              className="w-full p-3 transition-all duration-200 border rounded-lg bg-surface border-default focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Items Per Admin Page
            </label>
            <input
              type="number"
              value={settings.itemsPerAdminPage || 25}
              onChange={(e) =>
                handleInputChange(
                  "itemsPerAdminPage",
                  parseInt(e.target.value) || 0
                )
              }
              min="1"
              max="100"
              className="w-full p-3 transition-all duration-200 border rounded-lg bg-surface border-default focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </motion.div>

        {/* Default Status Settings */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Default Status Settings
          </h2>
          {/* Default Post Status */}
          <div className="space-y-2">
            {/* ... Default Post Status Select ... */}
          </div>
          {/* Default Page Status */}
          <div className="space-y-2">
            {/* ... Default Page Status Select ... */}
          </div>
        </motion.div>

        {/* Upload Settings */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Upload Settings
          </h2>
          {/* ... Uploads Path & Size Limit Inputs ... */}
        </motion.div>

        {/* Feed Settings */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Feed Settings
          </h2>
          {/* ... Feed Format Select ... */}
        </motion.div>

        {/* Feature Toggles */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Feature Settings
          </h2>
          {/* ... All Toggle components ... */}
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
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="px-6 py-3 font-medium btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Content Settings"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContentSettingsPage;
