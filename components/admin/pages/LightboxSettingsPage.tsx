"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

// FIX: Define a clear interface for a background option object.
interface BackgroundOption {
  value: string;
  label: string;
  color: string;
  description: string;
}

// --- Animation Variants ---
const sectionVariants: Variants = {
  /* ... */
};

const LightboxSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => console.log("Lightbox settings saved successfully"),
      onSaveError: (error: any) =>
        console.error("Failed to save lightbox settings:", error),
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

  // FIX: Apply the BackgroundOption[] type to the array.
  const backgroundOptions: BackgroundOption[] = [
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

  // FIX: Use the clear interface for the component's props.
  const BackgroundOptionCard = ({ option }: { option: BackgroundOption }) => (
    <motion.label /* ... */>
      {/* ... Card content remains the same ... */}
    </motion.label>
  );

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
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="max-w-4xl p-6 mx-auto space-y-8"
    >
      {/* ... The rest of the animated JSX remains the same ... */}
    </motion.div>
  );
};

export default LightboxSettingsPage;
