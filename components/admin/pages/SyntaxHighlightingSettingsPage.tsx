"use client";

import React from "react";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

const SyntaxHighlightingSettingsPage = () => {
  const {
    settings,
    loading,
    saving,
    error,
    updateSetting,
    saveSettings,
    resetSettings,
  } = useSettings({
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-secondary">Loading settings...</div>
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
    <label
      className={`p-4 bg-surface rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
        settings.stylesheet === option.value
          ? "border-primary bg-primary/5"
          : "border-default hover:border-primary/30"
      }`}
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
    </label>
  );

  const generateCodePreview = (theme: string) => {
    const themeColors =
      stylesheetOptions.find((opt) => opt.value === theme)?.colors ||
      stylesheetOptions[0].colors;

    return (
      <div
        className={`p-4 rounded-lg font-mono text-sm ${
          theme.includes("dark")
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
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
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Syntax Highlighting Settings
        </h1>
        <p className="text-secondary text-sm">
          Configure code syntax highlighting appearance and features
        </p>
      </div>

      {error && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Syntax Theme
          </h2>

          {/* Stylesheet Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">
                Stylesheet
              </label>
              <p className="text-xs text-secondary">
                Choose the color scheme for syntax highlighting in code blocks.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {stylesheetOptions.map((option) => (
                <StylesheetOptionCard key={option.value} option={option} />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Additional Features
          </h2>

          {/* Copy Button */}
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
              onChange={(checked) => handleInputChange("copyButton", checked)}
              label="Copy Button toggle"
              variant="primary"
              size="md"
            />
          </div>
        </div>

        {/* Code Preview */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Theme Preview
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <h4 className="font-medium text-primary mb-4">
              How your code will look:
            </h4>
            <div className="relative">
              {generateCodePreview(settings.stylesheet)}
              {settings.copyButton && (
                <button className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors">
                  📋 Copy
                </button>
              )}
            </div>
            <p className="text-xs text-secondary mt-3">
              Theme:{" "}
              {
                stylesheetOptions.find(
                  (opt) => opt.value === settings.stylesheet
                )?.label
              }
              {settings.copyButton && " • Copy button enabled"}
            </p>
          </div>
        </div>

        {/* Usage Information */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            How to Use Syntax Highlighting
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <p className="text-secondary text-sm leading-relaxed mb-4">
              The Syntax Highlighting module automatically detects and
              highlights code within nested &lt;pre&gt;&lt;code&gt; blocks. It
              supports many programming languages and provides beautiful color
              schemes for enhanced readability.
            </p>
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Usage Examples:</h4>
              <div className="space-y-3">
                <div className="p-3 bg-default/30 rounded-lg">
                  <code className="text-sm font-mono text-primary block mb-1">
                    &lt;pre&gt;&lt;code class="language-javascript"&gt;
                  </code>
                  <code className="text-sm font-mono text-secondary block ml-4">
                    console.log("Hello, world!");
                  </code>
                  <code className="text-sm font-mono text-primary">
                    &lt;/code&gt;&lt;/pre&gt;
                  </code>
                  <p className="text-xs text-secondary mt-1">
                    JavaScript code with language specification
                  </p>
                </div>
                <div className="p-3 bg-default/30 rounded-lg">
                  <code className="text-sm font-mono text-primary block mb-1">
                    &lt;pre&gt;&lt;code&gt;
                  </code>
                  <code className="text-sm font-mono text-secondary block ml-4">
                    def hello_world():
                  </code>
                  <code className="text-sm font-mono text-secondary block ml-8">
                    print("Hello, world!")
                  </code>
                  <code className="text-sm font-mono text-primary">
                    &lt;/code&gt;&lt;/pre&gt;
                  </code>
                  <p className="text-xs text-secondary mt-1">
                    Auto-detected Python code
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Languages */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Supported Languages
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "JavaScript", class: "language-javascript" },
              { name: "Python", class: "language-python" },
              { name: "HTML", class: "language-html" },
              { name: "CSS", class: "language-css" },
              { name: "PHP", class: "language-php" },
              { name: "Java", class: "language-java" },
              { name: "C++", class: "language-cpp" },
              { name: "C#", class: "language-csharp" },
              { name: "Ruby", class: "language-ruby" },
              { name: "Go", class: "language-go" },
              { name: "Rust", class: "language-rust" },
              { name: "TypeScript", class: "language-typescript" },
            ].map((lang) => (
              <div
                key={lang.name}
                className="p-3 bg-surface rounded-lg border border-default"
              >
                <div className="font-medium text-primary text-sm">
                  {lang.name}
                </div>
                <code className="text-xs font-mono text-secondary">
                  {lang.class}
                </code>
              </div>
            ))}
          </div>
          <p className="text-xs text-secondary">
            And many more languages supported automatically through language
            detection.
          </p>
        </div>

        {/* Performance & Accessibility */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Performance & Accessibility
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Performance</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Lightweight syntax highlighting engine</li>
                <li>• Only loads when code blocks are present</li>
                <li>• Minimal impact on page load times</li>
                <li>• Efficient language auto-detection</li>
              </ul>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-default">
              <h4 className="font-medium text-primary mb-2">Accessibility</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• High contrast color schemes available</li>
                <li>• Screen reader friendly markup</li>
                <li>• Keyboard accessible copy buttons</li>
                <li>• Semantic HTML structure preserved</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Current Configuration
          </h2>
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
                  className={`w-3 h-3 rounded-full ${
                    settings.copyButton ? "bg-success" : "bg-warning"
                  }`}
                ></span>
                <span className="text-sm text-secondary">
                  {settings.copyButton ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Update Syntax Highlighting Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyntaxHighlightingSettingsPage;
