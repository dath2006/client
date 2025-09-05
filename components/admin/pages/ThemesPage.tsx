"use-client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Theme as ApiTheme,
  getThemes,
  activateTheme,
} from "../../../lib/api-legacy/admin-themes";

// --- TYPE DEFINITIONS ---
interface Theme {
  id: number;
  name: string;
  description: string;
  isActive?: boolean;
  previewImage?: string;
}

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

// --- COMPONENT ---
const ThemesPage = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const response = await getThemes();
        const themesData = response.data || [];
        const formattedThemes: Theme[] = themesData;
        setThemes(formattedThemes);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch themes:", err);
        setError("Failed to load themes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  const handleSelectTheme = async (themeId: number) => {
    try {
      // Optimistically update the UI for a faster feel
      setThemes((prev) =>
        prev.map((theme) => ({
          ...theme,
          isActive: theme.id === themeId,
        }))
      );
      await activateTheme(themeId);
    } catch (err) {
      console.error("Failed to activate theme:", err);
      setError("Failed to activate theme. Please try again later.");
      // Revert the UI change on error
      setThemes((prev) =>
        prev.map((theme) => ({
          ...theme,
          isActive: theme.id !== themeId ? theme.isActive : !theme.isActive,
        }))
      );
    }
  };

  const handlePreview = (themeName: string) => {
    console.log(`Preview ${themeName} theme`);
  };

  const getThemePreviewGradient = (themeName: string) => {
    // ... (utility function remains the same)
    switch (themeName.toLowerCase()) {
      case "umbra":
        return "bg-gradient-to-br from-gray-900 via-gray-800 to-black";
      case "virgula":
        return "bg-gradient-to-br from-black via-white to-black";
      case "topaz":
        return "bg-gradient-to-br from-blue-50 via-white to-blue-100";
      case "sparrow":
        return "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100";
      case "blossom":
        return "bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100";
      default:
        return "bg-gradient-to-br from-gray-100 to-gray-200";
    }
  };

  const getThemeIcon = (themeName: string) => {
    // ... (utility function remains the same)
    switch (themeName.toLowerCase()) {
      case "umbra":
        return "🌙";
      case "virgula":
        return "⚡";
      case "topaz":
        return "💎";
      case "sparrow":
        return "🐦";
      case "blossom":
        return "🌸";
      default:
        return "🎨";
    }
  };

  const activeTheme = themes.find((theme) => theme.isActive);
  const availableThemes = themes.filter((theme) => !theme.isActive);

  const ThemeCard = ({ theme }: { theme: Theme }) => {
    return (
      <motion.div
        layoutId={`theme-card-${theme.id}`} // Crucial for the magic motion animation
        className="bg-surface rounded-lg border border-default p-4 flex flex-col"
        variants={itemVariants}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <div
          className={`h-32 rounded-lg mb-4 relative overflow-hidden ${getThemePreviewGradient(
            theme.name
          )}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-4xl opacity-60"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {getThemeIcon(theme.name)}
            </motion.span>
          </div>
          <div className="absolute top-2 right-2">
            <AnimatePresence>
              {theme.isActive && (
                <motion.span
                  className="px-2 py-1 bg-success text-white text-xs font-medium rounded-full"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  Active
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mb-4 flex-grow">
          <h4 className="text-lg font-semibold text-primary mb-2">
            {theme.name}
          </h4>
          <p className="text-secondary text-sm leading-relaxed">
            {theme.description}
          </p>
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={() => handlePreview(theme.name)}
            className="flex-1 px-3 py-2 text-sm font-medium text-secondary bg-surface hover:bg-default/50 border border-default rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Preview
          </motion.button>
          {!theme.isActive && (
            <motion.button
              onClick={() => handleSelectTheme(theme.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Select
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-2">Blog Themes</h1>
        <p className="text-secondary text-sm">
          Customize the appearance and design of your blog
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            className="flex items-center justify-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            className="bg-error/10 border border-error/20 p-4 rounded-lg text-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {activeTheme && (
              <motion.div
                className="bg-card rounded-lg card-shadow p-6"
                variants={itemVariants}
              >
                <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-success rounded-full"></span>
                  Active Theme
                </h2>
                <div className="max-w-sm">
                  <ThemeCard theme={activeTheme} />
                </div>
              </motion.div>
            )}

            {availableThemes.length > 0 && (
              <motion.div
                className="bg-card rounded-lg card-shadow p-6"
                variants={itemVariants}
              >
                <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-warning rounded-full"></span>
                  Available Themes ({availableThemes.length})
                </h2>
                <motion.div
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                >
                  {availableThemes.map((theme) => (
                    <ThemeCard key={theme.id} theme={theme} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            <motion.div
              className="bg-card rounded-lg card-shadow p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
                About Themes
              </h2>
              {/* ... About themes content ... */}
            </motion.div>

            <motion.div
              className="bg-card rounded-lg card-shadow p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
                Theme Statistics
              </h2>
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
              >
                <motion.div
                  className="text-center p-4 bg-success/10 rounded-lg border border-success/20"
                  variants={itemVariants}
                >
                  <div className="text-2xl font-bold text-success">1</div>
                  <div className="text-sm text-secondary">Active Theme</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20"
                  variants={itemVariants}
                >
                  <div className="text-2xl font-bold text-primary">
                    {themes.length}
                  </div>
                  <div className="text-sm text-secondary">Total Themes</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemesPage;
