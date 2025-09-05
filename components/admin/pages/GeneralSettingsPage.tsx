"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

// --- Animation Variants ---
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.05, // Stagger animation of child elements
    },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const GeneralSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => console.log("Settings saved successfully"),
      onSaveError: (error: any) =>
        console.error("Failed to save settings:", error),
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
    <div className="max-w-4xl p-6 mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="mb-2 text-3xl font-bold text-primary">
          General Settings
        </h1>
        <p className="text-sm text-secondary">
          Configure your site's basic information and preferences
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

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-6 bg-card rounded-lg card-shadow"
      >
        {/* Site Name */}
        <motion.div variants={fieldVariants} className="space-y-2">
          {/* ... Site Name input ... */}
        </motion.div>

        {/* Description */}
        <motion.div variants={fieldVariants} className="space-y-2">
          {/* ... Description textarea ... */}
        </motion.div>

        {/* Chyrp URL */}
        <motion.div variants={fieldVariants} className="space-y-2">
          {/* ... Chyrp URL input ... */}
        </motion.div>

        {/* Canonical URL */}
        <motion.div variants={fieldVariants} className="space-y-2">
          <label className="flex items-center text-sm font-medium text-primary">
            Canonical URL (optional)
            <motion.span
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="ml-2 inline-flex items-center justify-center w-4 h-4 text-xs cursor-help bg-muted text-white rounded-full"
              title="Have your site URLs point someplace other than your install directory."
            >
              ?
            </motion.span>
          </label>
          {/* ... Canonical URL input ... */}
        </motion.div>

        {/* Contact Email */}
        <motion.div variants={fieldVariants} className="space-y-2">
          {/* ... Contact Email input ... */}
        </motion.div>

        {/* Time Zone */}
        <motion.div variants={fieldVariants} className="space-y-2">
          {/* ... Time Zone select ... */}
        </motion.div>

        {/* Language */}
        <motion.div variants={fieldVariants} className="space-y-2">
          {/* ... Language select ... */}
        </motion.div>

        {/* Toggle Switches */}
        <motion.div
          variants={fieldVariants}
          className="pt-4 space-y-6 border-t border-default"
        >
          {/* ... Monospace Font & Check for Updates Toggles ... */}
        </motion.div>

        {/* Save Button */}
        <motion.div
          variants={fieldVariants}
          className="flex justify-end pt-6 border-t border-default"
        >
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="px-6 py-3 font-medium btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Settings"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GeneralSettingsPage;
