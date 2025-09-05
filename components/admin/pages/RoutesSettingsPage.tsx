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

const conditionalVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0, overflow: "hidden" },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: "1.5rem",
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    overflow: "hidden",
    transition: { duration: 0.3 },
  },
};

const RoutesSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => {
        console.log("Routes settings saved successfully");
      },
      onSaveError: (error) => {
        console.error("Failed to save routes settings:", error);
      },
    });

  const handleInputChange = (field: string, value: string | boolean) => {
    updateSetting(field, value);
  };

  const handleSave = async () => {
    await saveSettings();
  };

  const handleDownloadRewriteFiles = () => {
    console.log("Downloading URL rewrite files...");
  };

  const urlSyntaxOptions = [
    { token: "(year)", description: "Year submitted (e.g. 2007)" },
    { token: "(month)", description: "Month submitted (e.g. 12)" },
    { token: "(day)", description: "Day submitted (e.g. 25)" },
    { token: "(hour)", description: "Hour submitted (e.g. 03)" },
    { token: "(minute)", description: "Minute submitted (e.g. 59)" },
    { token: "(second)", description: "Second submitted (e.g. 30)" },
    { token: "(id)", description: "Post ID" },
    { token: "(author)", description: "Post author (username) (e.g. Alex)" },
    {
      token: "(clean)",
      description: "The non-unique slug (e.g. this_is_clean)",
    },
    {
      token: "(url)",
      description: "The unique form of (clean) (e.g. this_one_is_taken_2)",
    },
    { token: "(feather)", description: "The post's feather (e.g. text)" },
    {
      token: "(feathers)",
      description: "The plural form of the post's feather (e.g. links)",
    },
  ];

  const presetUrls = [
    { name: "Default", pattern: "(year)/(month)/(day)/(url)/" },
    { name: "Simple", pattern: "(url)/" },
    { name: "With ID", pattern: "(id)/(url)/" },
    { name: "By Author", pattern: "(author)/(url)/" },
    { name: "By Feather", pattern: "(feather)/(url)/" },
    {
      name: "Full Date",
      pattern: "(year)/(month)/(day)/(hour)/(minute)/(url)/",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-secondary"
          >
            Loading settings...
          </motion.div>
        </div>
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
        <h1 className="text-3xl font-bold text-primary mb-2">
          Routes Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure URL structure and routing for your blog
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-error/5 border border-error/20 rounded-lg p-4"
          >
            <p className="text-error text-sm">{error as string}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        <motion.div
          variants={sectionVariants}
          className="bg-card rounded-lg card-shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            URL Configuration
          </h2>
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Clean URLs
              </label>
              <p className="text-xs text-secondary mt-1">
                Gives your site prettier URLs. Requires server configuration.
              </p>
            </div>
            <Toggle
              checked={settings.cleanUrls}
              onChange={(checked) => handleInputChange("cleanUrls", checked)}
              label="Clean URLs toggle"
              variant="primary"
              size="md"
            />
          </div>
          <AnimatePresence>
            {settings.cleanUrls && (
              <motion.div
                key="download-files"
                variants={conditionalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-primary mb-1">
                        URL Rewrite Files
                      </h4>
                      <p className="text-xs text-secondary">
                        Download the necessary server configuration files for
                        clean URLs.
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadRewriteFiles}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                    >
                      Download Files
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium text-primary">
                Homepage
              </label>
              <p className="text-xs text-secondary mt-1">
                Make the default route a homepage instead of the blog index.
              </p>
            </div>
            <Toggle
              checked={settings.homepage}
              onChange={(checked) => handleInputChange("homepage", checked)}
              label="Homepage toggle"
              variant="secondary"
              size="md"
            />
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-card rounded-lg card-shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Post View URL Structure
          </h2>
          <AnimatePresence>
            {!settings.cleanUrls && (
              <motion.div
                key="clean-urls-warning"
                variants={conditionalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-0!"
              >
                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <p className="text-sm text-warning font-medium mb-1">
                    ⚠️ Clean URLs Required
                  </p>
                  <p className="text-xs text-secondary">
                    Custom post view URLs require clean URLs to be enabled.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Post View URL Pattern
            </label>
            <input
              type="text"
              value={settings.postViewUrl}
              onChange={(e) => handleInputChange("postViewUrl", e.target.value)}
              disabled={!settings.cleanUrls}
              placeholder="(year)/(month)/(day)/(url)/"
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
            />
            <p className="text-xs text-secondary">
              Use the syntax tokens below to create your custom URL structure.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-primary">Quick Presets</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {presetUrls.map((preset) => (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  key={preset.name}
                  onClick={() =>
                    handleInputChange("postViewUrl", preset.pattern)
                  }
                  disabled={!settings.cleanUrls}
                  className="p-3 text-left bg-surface hover:bg-default/50 border border-default rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-primary text-sm">
                    {preset.name}
                  </div>
                  <div className="font-mono text-xs text-secondary mt-1">
                    {preset.pattern}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-card rounded-lg card-shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            URL Syntax Reference
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {urlSyntaxOptions.map((option) => (
              <motion.div
                key={option.token}
                whileHover={{ borderColor: "rgba(var(--primary))" }}
                className="p-3 bg-surface rounded-lg border border-default transition-colors"
              >
                <code className="font-mono text-sm text-primary font-medium">
                  {option.token}
                </code>
                <p className="text-xs text-secondary mt-1">
                  {option.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {settings.cleanUrls && (
            <motion.div
              key="url-preview"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-card rounded-lg card-shadow p-6 space-y-6"
            >
              <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
                URL Preview
              </h2>
              <div className="p-4 bg-surface rounded-lg border border-default">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={settings.postViewUrl}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <span className="text-secondary">
                      https://yourblog.com/
                    </span>
                    <span className="text-primary font-medium">
                      {settings.postViewUrl.replace(
                        /\((.*?)\)/g,
                        (match: string, token: string) => {
                          const examples: Record<string, string> = {
                            year: "2024",
                            month: "08",
                            day: "31",
                            hour: "14",
                            minute: "30",
                            second: "45",
                            id: "123",
                            author: "john",
                            clean: "my_blog_post",
                            url: "my-blog-post",
                            feather: "text",
                            feathers: "texts",
                          };
                          return examples[token] || match;
                        }
                      )}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={sectionVariants}
          className="flex justify-end pt-6"
        >
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Update Routes Settings"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RoutesSettingsPage;
