"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

// Proactive Fix: Define a clear interface for an image option.
interface ImageOption {
  value: string;
  label: string;
  color: string;
  description: string;
}

// --- Animation Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const LikesSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => console.log("Likes settings saved successfully"),
      onSaveError: (error) =>
        console.error("Failed to save likes settings:", error),
    });

  const handleInputChange = (field: string, value: string | boolean) => {
    updateSetting(field, value);
  };

  const handleSave = async () => {
    await saveSettings();
  };

  const imageOptions: ImageOption[] = [
    {
      value: "pink",
      label: "Pink",
      color: "#ec4899",
      description: "Classic pink heart",
    },
    {
      value: "red",
      label: "Red",
      color: "#ef4444",
      description: "Traditional red heart",
    },
    {
      value: "blue",
      label: "Blue",
      color: "#3b82f6",
      description: "Cool blue heart",
    },
    {
      value: "green",
      label: "Green",
      color: "#10b981",
      description: "Fresh green heart",
    },
    {
      value: "purple",
      label: "Purple",
      color: "#8b5cf6",
      description: "Royal purple heart",
    },
    {
      value: "orange",
      label: "Orange",
      color: "#f97316",
      description: "Warm orange heart",
    },
  ];

  const ImageOptionCard = ({ option }: { option: ImageOption }) => (
    <motion.label
      whileHover={{ y: -3, boxShadow: "var(--card-shadow-hover)" }}
      className={`relative p-4 bg-surface rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
        settings.likeImage === option.value
          ? "border-primary bg-primary/5"
          : "border-default hover:border-primary/30"
      }`}
    >
      <input
        type="radio"
        name="likeImage"
        value={option.value}
        checked={settings.likeImage === option.value}
        onChange={(e) => handleInputChange("likeImage", e.target.value)}
        className="sr-only"
      />
      {settings.likeImage === option.value && (
        <motion.div
          layoutId="selected-like-check"
          className="absolute top-2 right-2 w-5 h-5 bg-primary text-white text-xs flex items-center justify-center rounded-full"
        >
          ✓
        </motion.div>
      )}
      <div className="flex items-center gap-3">
        {/* ... Card content ... */}
      </div>
    </motion.label>
  );

  if (loading) {
    /* ... Loading state ... */
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="max-w-4xl p-6 mx-auto space-y-8"
    >
      <motion.div variants={sectionVariants}>
        <h1 className="mb-2 text-3xl font-bold text-primary">Likes Settings</h1>
        <p className="text-sm text-secondary">
          Configure like functionality on your blog
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Like Appearance Settings */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Like Appearance
          </h2>
          {/* ... Like Image Selection Grid ... */}
        </motion.div>

        {/* Like Behavior Settings */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Like Behavior
          </h2>
          {/* ... Toggles for behavior ... */}
        </motion.div>

        {/* Like Button Preview */}
        <motion.div
          variants={sectionVariants}
          className="p-6 space-y-6 bg-card rounded-lg card-shadow"
        >
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
            Like Button Preview
          </h2>
          <div className="p-6 border rounded-lg bg-surface border-default">
            <h4 className="mb-4 font-medium text-primary">
              How your like buttons will appear:
            </h4>
            <div className="p-4 space-y-4 bg-card rounded-lg border border-default">
              {/* Like Button Preview */}
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{
                    color:
                      imageOptions.find(
                        (opt) => opt.value === settings.likeImage
                      )?.color || "#ec4899",
                  }}
                  className="text-lg"
                >
                  ♥
                </motion.span>
                <AnimatePresence>
                  {settings.likeWithText && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{
                        opacity: 1,
                        width: "auto",
                        marginLeft: "0.25rem",
                      }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      className="text-sm text-secondary"
                    >
                      Like this post
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="ml-2 text-xs text-secondary">(0 likes)</span>
              </div>
              {/* Unlike Button Preview */}
              <div className="flex items-center gap-2">
                {/* ... Unlike button preview with same animations ... */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ... Other info sections with motion.div wrapper ... */}

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
            {saving ? "Saving..." : "Save Likes Settings"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LikesSettingsPage;
