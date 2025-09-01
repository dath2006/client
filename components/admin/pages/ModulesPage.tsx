"use client";

import React, { useState } from "react";
import Toggle from "../../common/Toggle";

interface Module {
  id: string;
  name: string;
  description: string;
  status: "enabled" | "disabled" | "uninstalled";
  canDisable?: boolean;
  canUninstall?: boolean;
  conflicts?: string[];
}

const ModulesPage = () => {
  const [modules, setModules] = useState<Module[]>([
    {
      id: "sitemap",
      name: "Sitemap Generator",
      description:
        "Creates a sitemap.xml file on your server to help search engines index your blog.",
      status: "enabled",
      canDisable: true,
    },
    {
      id: "tagginator",
      name: "Tagginator",
      description: "Adds tagging functionality to posts.",
      status: "enabled",
      canDisable: true,
      canUninstall: true,
    },
    {
      id: "categorize",
      name: "Categorize",
      description: "Categorize your posts.",
      status: "enabled",
      canDisable: true,
      canUninstall: true,
    },
    {
      id: "rights",
      name: "Rights",
      description:
        "Adds post options for attribution and assigning intellectual property rights.",
      status: "enabled",
      canDisable: true,
      canUninstall: true,
    },
    {
      id: "likes",
      name: "Likes",
      description: 'Allow users to "like" a post.',
      status: "enabled",
      canDisable: true,
      canUninstall: true,
    },
    {
      id: "cacher",
      name: "Cacher",
      description: "Caches pages, drastically reducing server load.",
      status: "enabled",
      canDisable: true,
    },
    {
      id: "comments",
      name: "Comments",
      description:
        "Adds commenting functionality to your posts, with webmention support.",
      status: "enabled",
      canDisable: true,
      canUninstall: true,
    },
    {
      id: "cascade",
      name: "Cascade",
      description: "Adds ajax-powered infinite scrolling to your blog.",
      status: "enabled",
      canDisable: true,
    },
    {
      id: "read-more",
      name: "Read More",
      description:
        'Add "…more" links to your blog index by typing <!--more--> or <!--more custom text--> in your posts.',
      status: "enabled",
      canDisable: true,
    },
    {
      id: "migration",
      name: "Migration Assistant",
      description:
        "Enables import from Wordpress, MovableType, TextPattern, and Tumblr.",
      status: "disabled",
    },
    {
      id: "post-views",
      name: "Post Views",
      description: "Counts the number of times your posts have been viewed.",
      status: "disabled",
      conflicts: ["Cacher"],
    },
    {
      id: "lightbox",
      name: "Lightbox",
      description: "A lightbox for your images.",
      status: "disabled",
    },
    {
      id: "mentionable",
      name: "Mentionable",
      description: "Register webmentions from blogs that link to yours.",
      status: "disabled",
      conflicts: ["Comments"],
    },
    {
      id: "easy-embed",
      name: "Easy Embed",
      description:
        "Embed content in your blog by pasting its URL surrounded by <!-- and -->.",
      status: "disabled",
    },
    {
      id: "maptcha",
      name: "MAPTCHA",
      description:
        "Ask users to solve simple mathematics problems to prevent spam.",
      status: "disabled",
    },
    {
      id: "mathjax",
      name: "MathJax",
      description: "A JavaScript display engine for mathematics.",
      status: "disabled",
    },
    {
      id: "syntax-highlighting",
      name: "Syntax Highlighting",
      description: "Adds syntax highlighting to nested <pre><code> blocks.",
      status: "disabled",
    },
  ]);

  const handleToggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            status: module.status === "enabled" ? "disabled" : "enabled",
          };
        }
        return module;
      })
    );
  };

  const handleUninstall = (moduleId: string) => {
    if (window.confirm("Are you sure you want to uninstall this module?")) {
      setModules((prev) =>
        prev.map((module) => {
          if (module.id === moduleId) {
            return {
              ...module,
              status: "uninstalled" as const,
            };
          }
          return module;
        })
      );
    }
  };

  const enabledModules = modules.filter(
    (module) => module.status === "enabled"
  );
  const disabledModules = modules.filter(
    (module) => module.status === "disabled"
  );
  const uninstalledModules = modules.filter(
    (module) => module.status === "uninstalled"
  );

  const ModuleCard = ({ module }: { module: Module }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "enabled":
          return "bg-success/10 text-success border-success/20";
        case "disabled":
          return "bg-warning/10 text-warning border-warning/20";
        case "uninstalled":
          return "bg-error/10 text-error border-error/20";
        default:
          return "bg-gray-100 text-gray-800 border-gray/20";
      }
    };

    return (
      <div className="bg-surface rounded-lg border border-default p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-primary mb-2">
              {module.name}
            </h4>
            <p className="text-secondary text-sm leading-relaxed">
              {module.description}
            </p>
          </div>
          <div className="ml-4 flex flex-col items-end gap-2">
            {module.status !== "uninstalled" && (
              <Toggle
                checked={module.status === "enabled"}
                onChange={() => handleToggleModule(module.id)}
                variant={module.status === "enabled" ? "success" : "warning"}
                size="md"
                label={`Toggle ${module.name}`}
              />
            )}
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                module.status
              )}`}
            >
              {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
            </span>
          </div>
        </div>

        {module.conflicts && module.conflicts.length > 0 && (
          <div className="mb-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <p className="text-xs text-warning font-medium mb-1">
              ⚠️ Module Conflicts:
            </p>
            <p className="text-xs text-secondary">
              This module conflicts with: {module.conflicts.join(", ")}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-default">
          {module.canUninstall && module.status !== "uninstalled" && (
            <button
              onClick={() => handleUninstall(module.id)}
              className="px-3 py-1.5 text-xs font-medium text-error bg-error/10 hover:bg-error/20 border border-error/20 rounded-lg transition-colors"
            >
              Uninstall
            </button>
          )}
          {module.canDisable && module.status !== "uninstalled" && (
            <button
              onClick={() => handleToggleModule(module.id)}
              className="px-3 py-1.5 text-xs font-medium text-secondary bg-surface hover:bg-default/50 border border-default rounded-lg transition-colors"
            >
              {module.status === "enabled" ? "Disable" : "Enable"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Modules</h1>
        <p className="text-secondary text-sm">
          Manage your blog modules and extensions
        </p>
      </div>

      {/* Enabled Modules */}
      {enabledModules.length > 0 && (
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-success rounded-full"></span>
            Enabled Modules ({enabledModules.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {enabledModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      )}

      {/* Disabled Modules */}
      {disabledModules.length > 0 && (
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-warning rounded-full"></span>
            Available Modules ({disabledModules.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {disabledModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      )}

      {/* Uninstalled Modules */}
      {uninstalledModules.length > 0 && (
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-error rounded-full"></span>
            Uninstalled Modules ({uninstalledModules.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {uninstalledModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
          Module Statistics
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="text-2xl font-bold text-success">
              {enabledModules.length}
            </div>
            <div className="text-sm text-secondary">Enabled</div>
          </div>
          <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="text-2xl font-bold text-warning">
              {disabledModules.length}
            </div>
            <div className="text-sm text-secondary">Available</div>
          </div>
          <div className="text-center p-4 bg-error/10 rounded-lg border border-error/20">
            <div className="text-2xl font-bold text-error">
              {uninstalledModules.length}
            </div>
            <div className="text-sm text-secondary">Uninstalled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;
