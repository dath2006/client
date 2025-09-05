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

const SitemapSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => {
        console.log("Sitemap settings saved successfully");
      },
      onSaveError: (error) => {
        console.error("Failed to save sitemap settings:", error);
      },
    });

  const handleInputChange = (field: string, value: string) => {
    updateSetting(field, value);
  };

  const handleSave = async () => {
    await saveSettings();
  };

  const handleGenerateSitemap = () => {
    console.log("Generating sitemap...");
  };

  const frequencyOptions = [
    {
      value: "always",
      label: "Always",
      description: "Content changes every time it's accessed",
    },
    { value: "hourly", label: "Hourly", description: "Content changes hourly" },
    { value: "daily", label: "Daily", description: "Content changes daily" },
    { value: "weekly", label: "Weekly", description: "Content changes weekly" },
    {
      value: "monthly",
      label: "Monthly",
      description: "Content changes monthly",
    },
    { value: "yearly", label: "Yearly", description: "Content changes yearly" },
    {
      value: "never",
      label: "Never",
      description: "Content is archived and never changes",
    },
  ];

  const FrequencySelect = ({
    label,
    description,
    value,
    onChange,
    field,
  }: {
    label: string;
    description: string;
    value: string;
    onChange: (field: string, value: string) => void;
    field: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-primary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
      >
        {frequencyOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-secondary">{description}</p>
    </div>
  );

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
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      <motion.div variants={sectionVariants}>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Sitemap Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure XML sitemap generation and update frequency settings
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
            Sitemap Configuration
          </h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Sitemap Path
            </label>
            <input
              type="text"
              value={settings.sitemapPath}
              onChange={(e) => handleInputChange("sitemapPath", e.target.value)}
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-mono text-sm"
              placeholder="/var/www/html"
            />
            <p className="text-xs text-secondary">
              The directory to which the sitemap is written.
            </p>
          </div>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary mb-1">
                  Generate Sitemap
                </h4>
                <p className="text-xs text-secondary">
                  Create or update your sitemap.xml file with current content.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateSitemap}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                Generate Now
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-card rounded-lg card-shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Update Frequency Settings
          </h2>
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg mb-6">
            <p className="text-sm text-warning font-medium mb-1">
              ℹ️ Search Engine Hints
            </p>
            <p className="text-xs text-secondary">
              These values hint to search engines how frequently they should
              crawl your site. They are suggestions only and search engines may
              ignore them.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <FrequencySelect
              label="Blog is Updated"
              description="How often your blog's main content changes"
              value={settings.blogUpdateFreq}
              onChange={handleInputChange}
              field="blogUpdateFreq"
            />
            <FrequencySelect
              label="Pages are Edited"
              description="How often your static pages are modified"
              value={settings.pagesUpdateFreq}
              onChange={handleInputChange}
              field="pagesUpdateFreq"
            />
            <FrequencySelect
              label="Posts are Edited"
              description="How often your blog posts are updated"
              value={settings.postsUpdateFreq}
              onChange={handleInputChange}
              field="postsUpdateFreq"
            />
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-card rounded-lg card-shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            About XML Sitemaps
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <p className="text-secondary text-sm leading-relaxed mb-4">
              XML sitemaps help search engines discover and index your content
              more effectively. They provide structured information about your
              site's pages, posts, and their update frequencies.
            </p>
            <div className="space-y-3">
              <h4 className="font-medium text-primary">
                Benefits of XML Sitemaps:
              </h4>
              <ul className="text-sm text-secondary space-y-1 ml-4">
                <li>
                  • <strong>Better SEO:</strong> Helps search engines find and
                  index your content
                </li>
                <li>
                  • <strong>Faster Discovery:</strong> New content gets crawled
                  more quickly
                </li>
                <li>
                  • <strong>Priority Signals:</strong> Indicates which pages are
                  most important
                </li>
                <li>
                  • <strong>Update Frequency:</strong> Tells crawlers when to
                  check for changes
                </li>
                <li>
                  • <strong>Coverage:</strong> Ensures all your content is
                  discoverable
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-card rounded-lg card-shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Frequency Guidelines
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {frequencyOptions.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ y: -3, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
                className="p-4 bg-surface rounded-lg border border-default"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-primary capitalize">
                    {option.label}
                  </span>
                  <code className="px-2 py-1 text-xs bg-default/50 rounded font-mono text-secondary">
                    {option.value}
                  </code>
                </div>
                <p className="text-xs text-secondary">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="bg-card rounded-lg card-shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Current Configuration
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">
                Sitemap Location
              </h4>
              <AnimatePresence mode="wait">
                <motion.code
                  key={settings.sitemapPath}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-mono text-secondary break-all"
                >
                  {settings.sitemapPath}/sitemap.xml
                </motion.code>
              </AnimatePresence>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">
                Update Frequencies
              </h4>
              <div className="space-y-1 text-sm text-secondary">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`blog-${settings.blogUpdateFreq}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Blog:{" "}
                    <span className="capitalize font-medium">
                      {settings.blogUpdateFreq}
                    </span>
                  </motion.div>
                  <motion.div
                    key={`pages-${settings.pagesUpdateFreq}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Pages:{" "}
                    <span className="capitalize font-medium">
                      {settings.pagesUpdateFreq}
                    </span>
                  </motion.div>
                  <motion.div
                    key={`posts-${settings.postsUpdateFreq}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Posts:{" "}
                    <span className="capitalize font-medium">
                      {settings.postsUpdateFreq}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

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
            {saving ? "Saving..." : "Save Sitemap Settings"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SitemapSettingsPage;
