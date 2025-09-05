"use client";

import React, { useState, useEffect } from "react";
import Toggle from "../../common/Toggle";
import {
  Module as ApiModule,
  getModules,
  updateModuleStatus,
  uninstallModule,
} from "../../../lib/api-legacy/admin-modules";

interface Module {
  id: number;
  name: string;
  description: string;
  status: "enabled" | "disabled" | "uninstalled";
  canDisable: boolean;
  canUninstall: boolean;
  conflicts: string[] | null;
}

const ModulesPage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await getModules();
        // Extract data from response
        const modulesData = response.data || [];
        // API now returns data in the format we need
        const formattedModules: Module[] = modulesData;
        setModules(formattedModules);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setError("Failed to load modules. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleToggleModule = async (moduleId: number) => {
    try {
      const module = modules.find((m) => m.id === moduleId);
      if (!module) return;

      const newStatus = module.status === "enabled" ? "disabled" : "enabled";
      const updatedModule = await updateModuleStatus(moduleId, newStatus);

      setModules((prev) =>
        prev.map((m) => {
          if (m.id === moduleId) {
            return {
              ...m,
              status: updatedModule.status,
            };
          }
          return m;
        })
      );
    } catch (err) {
      console.error("Failed to update module status:", err);
      setError("Failed to update module. Please try again later.");
    }
  };

  const handleUninstall = async (moduleId: number) => {
    if (window.confirm("Are you sure you want to uninstall this module?")) {
      try {
        await uninstallModule(moduleId);

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
      } catch (err) {
        console.error("Failed to uninstall module:", err);
        setError("Failed to uninstall module. Please try again later.");
      }
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

        {module.conflicts &&
          Array.isArray(module.conflicts) &&
          module.conflicts.length > 0 && (
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

      {loading ? (
        <div className="bg-card rounded-lg card-shadow p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-card rounded-lg card-shadow p-6">
          <div className="bg-error/10 border border-error/20 p-4 rounded-lg text-error">
            {error}
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ModulesPage;
