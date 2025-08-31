"use client";

import React, { useState } from "react";
import Toggle from "../../common/Toggle";

interface Feather {
  id: string;
  name: string;
  description: string;
  status: "enabled" | "disabled";
  canDisable?: boolean;
}

const FeathersPage = () => {
  const [feathers, setFeathers] = useState<Feather[]>([
    {
      id: "text",
      name: "Text",
      description: "A basic text feather.",
      status: "enabled",
      canDisable: true,
    },
    {
      id: "audio",
      name: "Audio",
      description: "A feather for audio.",
      status: "disabled",
    },
    {
      id: "uploader",
      name: "Uploader",
      description:
        "Upload files and make them available for visitors to download.",
      status: "disabled",
    },
    {
      id: "quote",
      name: "Quote",
      description: "Post quotes and cite sources.",
      status: "disabled",
    },
    {
      id: "video",
      name: "Video",
      description: "A feather for video.",
      status: "disabled",
    },
    {
      id: "link",
      name: "Link",
      description: "Link to other sites and add an optional description.",
      status: "disabled",
    },
    {
      id: "photo",
      name: "Photo",
      description: "Upload and display an image with a caption.",
      status: "disabled",
    },
  ]);

  const handleToggleFeather = (featherId: string) => {
    setFeathers((prev) =>
      prev.map((feather) => {
        if (feather.id === featherId) {
          return {
            ...feather,
            status: feather.status === "enabled" ? "disabled" : "enabled",
          };
        }
        return feather;
      })
    );
  };

  const enabledFeathers = feathers.filter(
    (feather) => feather.status === "enabled"
  );
  const disabledFeathers = feathers.filter(
    (feather) => feather.status === "disabled"
  );

  const FeatherCard = ({ feather }: { feather: Feather }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "enabled":
          return "bg-success/10 text-success border-success/20";
        case "disabled":
          return "bg-warning/10 text-warning border-warning/20";
        default:
          return "bg-gray-100 text-gray-800 border-gray/20";
      }
    };

    const getFeatherIcon = (name: string) => {
      switch (name.toLowerCase()) {
        case "text":
          return "📝";
        case "audio":
          return "🎵";
        case "uploader":
          return "📎";
        case "quote":
          return "💬";
        case "video":
          return "🎬";
        case "link":
          return "🔗";
        case "photo":
          return "📷";
        default:
          return "📄";
      }
    };

    return (
      <div className="bg-surface rounded-lg border border-default p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getFeatherIcon(feather.name)}</span>
              <h4 className="text-lg font-semibold text-primary">
                {feather.name}
              </h4>
            </div>
            <p className="text-secondary text-sm leading-relaxed">
              {feather.description}
            </p>
          </div>
          <div className="ml-4 flex flex-col items-end gap-2">
            <Toggle
              checked={feather.status === "enabled"}
              onChange={() => handleToggleFeather(feather.id)}
              variant={feather.status === "enabled" ? "success" : "warning"}
              size="md"
              label={`Toggle ${feather.name} feather`}
            />
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                feather.status
              )}`}
            >
              {feather.status.charAt(0).toUpperCase() + feather.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-default">
          {feather.canDisable && (
            <button
              onClick={() => handleToggleFeather(feather.id)}
              className="px-3 py-1.5 text-xs font-medium text-secondary bg-surface hover:bg-default/50 border border-default rounded-lg transition-colors"
            >
              {feather.status === "enabled" ? "Disable" : "Enable"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Feathers</h1>
        <p className="text-secondary text-sm">
          Manage content types and post formats for your blog
        </p>
      </div>

      <div className="space-y-6">
        {/* Enabled Feathers */}
        {enabledFeathers.length > 0 && (
          <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-success rounded-full"></span>
              Enabled Feathers ({enabledFeathers.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {enabledFeathers.map((feather) => (
                <FeatherCard key={feather.id} feather={feather} />
              ))}
            </div>
          </div>
        )}

        {/* Disabled Feathers */}
        {disabledFeathers.length > 0 && (
          <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-warning rounded-full"></span>
              Available Feathers ({disabledFeathers.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {disabledFeathers.map((feather) => (
                <FeatherCard key={feather.id} feather={feather} />
              ))}
            </div>
          </div>
        )}

        {/* Feather Information */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            About Feathers
          </h2>
          <div className="bg-surface rounded-lg border border-default p-4">
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Feathers are content types that define how different kinds of
              posts are created and displayed on your blog. Each feather
              provides specific fields and formatting options tailored to its
              content type.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">
                Content Type Examples:
              </h4>
              <ul className="text-sm text-secondary space-y-1 ml-4">
                <li>
                  • <strong>Text:</strong> Standard blog posts with rich text
                  content
                </li>
                <li>
                  • <strong>Photo:</strong> Image posts with captions and
                  metadata
                </li>
                <li>
                  • <strong>Video:</strong> Video embeds with descriptions
                </li>
                <li>
                  • <strong>Quote:</strong> Formatted quotes with attribution
                </li>
                <li>
                  • <strong>Link:</strong> Link sharing with optional commentary
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Feather Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="text-2xl font-bold text-success">
                {enabledFeathers.length}
              </div>
              <div className="text-sm text-secondary">Enabled</div>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
              <div className="text-2xl font-bold text-warning">
                {disabledFeathers.length}
              </div>
              <div className="text-sm text-secondary">Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeathersPage;
