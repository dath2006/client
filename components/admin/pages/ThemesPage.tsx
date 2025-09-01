"use client";

import React, { useState } from "react";

interface Theme {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
  previewImage?: string;
}

const ThemesPage = () => {
  const [themes, setThemes] = useState<Theme[]>([
    {
      id: "umbra",
      name: "Umbra",
      description: "A dark tumbleblog theme for Chyrp Lite.",
      isActive: false,
    },
    {
      id: "virgula",
      name: "Virgula",
      description: "A high-contrast theme for Chyrp Lite.",
      isActive: false,
    },
    {
      id: "topaz",
      name: "Topaz",
      description: "A minimalist responsive theme for Chyrp Lite.",
      isActive: false,
    },
    {
      id: "sparrow",
      name: "Sparrow",
      description: "An unobtrusive tumbleblog theme for Chyrp Lite.",
      isActive: false,
    },
    {
      id: "blossom",
      name: "Blossom",
      description: "The default theme provided with Chyrp Lite.",
      isActive: true,
    },
  ]);

  const handleSelectTheme = (themeId: string) => {
    setThemes((prev) =>
      prev.map((theme) => ({
        ...theme,
        isActive: theme.id === themeId,
      }))
    );
  };

  const handlePreview = (themeName: string) => {
    // In a real implementation, this would open a preview window
    console.log(`Preview ${themeName} theme`);
  };

  const getThemePreviewGradient = (themeName: string) => {
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
      <div className="bg-surface rounded-lg border border-default p-4 hover:shadow-sm transition-all duration-200">
        {/* Theme Preview */}
        <div
          className={`h-32 rounded-lg mb-4 relative overflow-hidden ${getThemePreviewGradient(
            theme.name
          )}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-60">
              {getThemeIcon(theme.name)}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            {theme.isActive && (
              <span className="px-2 py-1 bg-success text-white text-xs font-medium rounded-full">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Theme Info */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-primary mb-2">
            {theme.name}
          </h4>
          <p className="text-secondary text-sm leading-relaxed">
            {theme.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handlePreview(theme.name)}
            className="flex-1 px-3 py-2 text-sm font-medium text-secondary bg-surface hover:bg-default/50 border border-default rounded-lg transition-colors"
          >
            Preview
          </button>
          {!theme.isActive && (
            <button
              onClick={() => handleSelectTheme(theme.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Select
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Blog Themes</h1>
        <p className="text-secondary text-sm">
          Customize the appearance and design of your blog
        </p>
      </div>

      <div className="space-y-6">
        {/* Active Theme */}
        {activeTheme && (
          <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-success rounded-full"></span>
              Active Theme
            </h2>
            <div className="max-w-sm">
              <ThemeCard theme={activeTheme} />
            </div>
          </div>
        )}

        {/* Available Themes */}
        {availableThemes.length > 0 && (
          <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-warning rounded-full"></span>
              Available Themes ({availableThemes.length})
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          </div>
        )}

        {/* Theme Information */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            About Themes
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Themes control the visual appearance and layout of your blog. Each
              theme provides a unique design aesthetic and user experience
              tailored for different use cases and preferences.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Theme Features:</h4>
              <ul className="text-sm text-secondary space-y-1 ml-4">
                <li>
                  • <strong>Responsive Design:</strong> All themes adapt to
                  different screen sizes
                </li>
                <li>
                  • <strong>Customizable:</strong> Most themes support color and
                  layout customization
                </li>
                <li>
                  • <strong>Accessibility:</strong> Built with web accessibility
                  standards in mind
                </li>
                <li>
                  • <strong>Performance:</strong> Optimized for fast loading and
                  smooth browsing
                </li>
                <li>
                  • <strong>SEO Friendly:</strong> Clean HTML structure for
                  better search engine visibility
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Theme Statistics */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Theme Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="text-2xl font-bold text-success">1</div>
              <div className="text-sm text-secondary">Active Theme</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                {themes.length}
              </div>
              <div className="text-sm text-secondary">Total Themes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemesPage;
