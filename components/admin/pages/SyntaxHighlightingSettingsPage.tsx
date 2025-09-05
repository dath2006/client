"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

// Framer Motion Variants for cleaner animation definitions
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const SyntaxHighlightingSettingsPage = () => {
  const [copyButtonText, setCopyButtonText] = useState("📋 Copy");
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => {
        console.log("Syntax highlighting settings saved successfully");
      },
      onSaveError: (error) => {
        console.error("Failed to save syntax highlighting settings:", error);
      },
    });

  const handleInputChange = (field: string, value: string | boolean) => {
    updateSetting(field, value);
  };

  const handleSave = async () => {
    await saveSettings();
  };

  const handleCopy = () => {
    const code = `function highlightCode(language) {\n  const code = "Hello, world!";\n  return code;\n}`;
    navigator.clipboard.writeText(code).then(() => {
      setCopyButtonText("✅ Copied!");
      setTimeout(() => setCopyButtonText("📋 Copy"), 2000);
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-secondary"
          >
            Loading settings...
          </motion.div>
        </div>
      </div>
    );
  }

  const stylesheetOptions = [
    {
      value: "default",
      label: "Default",
      description: "Clean and minimal syntax highlighting",
      colors: ["#d73a49", "#005cc5", "#6f42c1", "#032f62"],
    },
    {
      value: "monokai",
      label: "Monokai",
      description: "Popular dark theme with vibrant colors",
      colors: ["#f92672", "#a6e22e", "#66d9ef", "#fd971f"],
    },
    {
      value: "github",
      label: "GitHub",
      description: "GitHub-inspired light theme",
      colors: ["#d73a49", "#032f62", "#6f42c1", "#005cc5"],
    },
    {
      value: "dracula",
      label: "Dracula",
      description: "Dark theme with purple accents",
      colors: ["#ff79c6", "#8be9fd", "#50fa7b", "#ffb86c"],
    },
    {
      value: "solarized-light",
      label: "Solarized Light",
      description: "Easy on the eyes light theme",
      colors: ["#dc322f", "#268bd2", "#6c71c4", "#859900"],
    },
    {
      value: "solarized-dark",
      label: "Solarized Dark",
      description: "Easy on the eyes dark theme",
      colors: ["#dc322f", "#268bd2", "#6c71c4", "#859900"],
    },
    {
      value: "atom-one-light",
      label: "Atom One Light",
      description: "Atom editor's light syntax theme",
      colors: ["#e45649", "#0184bb", "#a626a4", "#986801"],
    },
    {
      value: "atom-one-dark",
      label: "Atom One Dark",
      description: "Atom editor's dark syntax theme",
      colors: ["#e06c75", "#61afef", "#c678dd", "#e5c07b"],
    },
  ];

  const StylesheetOptionCard = ({
    option,
  }: {
    option: (typeof stylesheetOptions)[0];
  }) => (
    <motion.label
      className={`relative p-4 bg-surface rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        settings.stylesheet === option.value
          ? "border-primary bg-primary/10 shadow-md"
          : "border-default hover:border-primary/50"
      }`}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="radio"
        name="stylesheet"
        value={option.value}
        checked={settings.stylesheet === option.value}
        onChange={(e) => handleInputChange("stylesheet", e.target.value)}
        className="sr-only"
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium text-primary">{option.label}</div>
          <div className="flex gap-1">
            {option.colors.map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-default/30"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <div className="text-xs text-secondary">{option.description}</div>
      </div>
      <AnimatePresence>
        {settings.stylesheet === option.value && (
          <motion.div
            className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.label>
  );

  const generateCodePreview = (theme: string) => {
    const themeColors =
      stylesheetOptions.find((opt) => opt.value === theme)?.colors ||
      stylesheetOptions[0].colors;

    return (
      <motion.div
        key={theme}
        className={`p-4 rounded-lg font-mono text-sm ${
          theme.includes("dark")
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-1">
          <div>
            <span style={{ color: themeColors[2] }}>function</span>{" "}
            <span style={{ color: themeColors[1] }}>highlightCode</span>
            <span>(</span>
            <span style={{ color: themeColors[0] }}>language</span>
            <span>) {"{"}</span>
          </div>
          <div className="ml-4">
            <span style={{ color: themeColors[2] }}>const</span>{" "}
            <span style={{ color: themeColors[1] }}>code</span> <span>=</span>{" "}
            <span style={{ color: themeColors[3] }}>"Hello, world!"</span>
            <span>;</span>
          </div>
          <div className="ml-4">
            <span style={{ color: themeColors[2] }}>return</span>{" "}
            <span style={{ color: themeColors[1] }}>code</span>
            <span>;</span>
          </div>
          <div>
            <span>{"}"}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Syntax Highlighting
        </h1>
        <p className="text-secondary text-sm">
          Configure code syntax highlighting appearance and features.
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-error/5 border border-error/20 rounded-lg p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-error text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Sections */}
      <div className="space-y-8">
        {[
          {
            title: "Syntax Theme",
            content: (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-primary">
                    Stylesheet
                  </label>
                  <p className="text-xs text-secondary">
                    Choose the color scheme for syntax highlighting.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {stylesheetOptions.map((option) => (
                    <StylesheetOptionCard key={option.value} option={option} />
                  ))}
                </div>
              </div>
            ),
          },
          {
            title: "Additional Features",
            content: (
              <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium text-primary">
                    Copy Button
                  </label>
                  <p className="text-xs text-secondary mt-1">
                    Add a button for copying to the clipboard.
                  </p>
                </div>
                <Toggle
                  checked={settings.copyButton}
                  onChange={(checked) =>
                    handleInputChange("copyButton", checked)
                  }
                  label="Copy Button toggle"
                  variant="primary"
                  size="md"
                />
              </div>
            ),
          },
          {
            title: "Theme Preview",
            content: (
              <div className="bg-surface rounded-lg border border-default p-4">
                <h4 className="font-medium text-primary mb-4">
                  How your code will look:
                </h4>
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {generateCodePreview(settings.stylesheet)}
                  </AnimatePresence>
                  <AnimatePresence>
                    {settings.copyButton && (
                      <motion.button
                        className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors"
                        onClick={handleCopy}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {copyButtonText}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ),
          },
          {
            title: "Current Configuration",
            content: (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-surface rounded-lg border border-default">
                  <h4 className="font-medium text-primary mb-2">Theme</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {stylesheetOptions
                        .find((opt) => opt.value === settings.stylesheet)
                        ?.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-default/30"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                    </div>
                    <span className="text-sm text-secondary">
                      {
                        stylesheetOptions.find(
                          (opt) => opt.value === settings.stylesheet
                        )?.label
                      }
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-surface rounded-lg border border-default">
                  <h4 className="font-medium text-primary mb-2">Copy Button</h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full transition-colors ${
                        settings.copyButton ? "bg-success" : "bg-warning"
                      }`}
                    ></span>
                    <span className="text-sm text-secondary">
                      {settings.copyButton ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            ),
          },
        ].map((section, index) => (
          <motion.div
            key={index}
            className="bg-card rounded-lg card-shadow p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-3">
              {section.title}
            </h2>
            {section.content}
          </motion.div>
        ))}
      </div>

      {/* Save Button */}
      <motion.div className="flex justify-end pt-6" variants={itemVariants}>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: saving ? 1 : 1.05 }}
          whileTap={{ scale: saving ? 1 : 0.95 }}
        >
          {saving ? "Saving..." : "Update Settings"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SyntaxHighlightingSettingsPage;
