"use client";

import React, { useState } from "react";
import Toggle from "./Toggle";

const ToggleDemo = () => {
  const [toggleStates, setToggleStates] = useState({
    basic: false,
    primary: true,
    secondary: false,
    success: true,
    warning: false,
    error: false,
    small: false,
    medium: true,
    large: false,
    extraLarge: true,
    disabled: false,
    loading: false,
  });

  const updateToggle = (key: string, value: boolean) => {
    setToggleStates((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Toggle Component Demo
        </h1>
        <p className="text-secondary text-sm">
          Showcasing different sizes, variants, and states of the Toggle
          component
        </p>
      </div>

      {/* Basic Usage */}
      <div className="bg-card rounded-lg card-shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-primary">Basic Usage</h2>
        <div className="flex items-center space-x-4">
          <Toggle
            checked={toggleStates.basic}
            onChange={(checked) => updateToggle("basic", checked)}
            label="Basic toggle"
          />
          <span className="text-sm text-secondary">
            {toggleStates.basic ? "On" : "Off"}
          </span>
        </div>
      </div>

      {/* Color Variants */}
      <div className="bg-card rounded-lg card-shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-primary">Color Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Toggle
              checked={toggleStates.primary}
              onChange={(checked) => updateToggle("primary", checked)}
              variant="primary"
              label="Primary toggle"
            />
            <span className="text-sm">Primary</span>
          </div>
          <div className="flex items-center space-x-3">
            <Toggle
              checked={toggleStates.secondary}
              onChange={(checked) => updateToggle("secondary", checked)}
              variant="secondary"
              label="Secondary toggle"
            />
            <span className="text-sm">Secondary</span>
          </div>
          <div className="flex items-center space-x-3">
            <Toggle
              checked={toggleStates.success}
              onChange={(checked) => updateToggle("success", checked)}
              variant="success"
              label="Success toggle"
            />
            <span className="text-sm">Success</span>
          </div>
          <div className="flex items-center space-x-3">
            <Toggle
              checked={toggleStates.warning}
              onChange={(checked) => updateToggle("warning", checked)}
              variant="warning"
              label="Warning toggle"
            />
            <span className="text-sm">Warning</span>
          </div>
          <div className="flex items-center space-x-3">
            <Toggle
              checked={toggleStates.error}
              onChange={(checked) => updateToggle("error", checked)}
              variant="error"
              label="Error toggle"
            />
            <span className="text-sm">Error</span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="bg-card rounded-lg card-shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-primary">Sizes</h2>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <Toggle
              checked={toggleStates.small}
              onChange={(checked) => updateToggle("small", checked)}
              size="sm"
              label="Small toggle"
            />
            <span className="text-sm">Small</span>
          </div>
          <div className="flex items-center space-x-3">
            <Toggle
              checked={toggleStates.medium}
              onChange={(checked) => updateToggle("medium", checked)}
              size="md"
              label="Medium toggle"
            />
            <span className="text-sm">Medium</span>
          </div>
          <div className="flex items-center space-x-3">
            <Toggle
              checked={toggleStates.large}
              onChange={(checked) => updateToggle("large", checked)}
              size="lg"
              label="Large toggle"
            />
            <span className="text-sm">Large</span>
          </div>
          <div className="flex items-center space-x-3">
            <Toggle
              checked={toggleStates.extraLarge}
              onChange={(checked) => updateToggle("extraLarge", checked)}
              size="xl"
              label="Extra large toggle"
            />
            <span className="text-sm">XL</span>
          </div>
        </div>
      </div>

      {/* States */}
      <div className="bg-card rounded-lg card-shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-primary">States</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Toggle
              checked={toggleStates.disabled}
              onChange={(checked) => updateToggle("disabled", checked)}
              disabled={true}
              label="Disabled toggle"
            />
            <span className="text-sm text-muted">Disabled</span>
          </div>
          <div className="flex items-center space-x-4">
            <Toggle
              checked={toggleStates.loading}
              onChange={(checked) => updateToggle("loading", checked)}
              loading={true}
              label="Loading toggle"
            />
            <span className="text-sm text-muted">Loading</span>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-card rounded-lg card-shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-primary">Usage Examples</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <h3 className="font-medium text-primary">Dark Mode</h3>
              <p className="text-sm text-secondary">Enable dark mode theme</p>
            </div>
            <Toggle
              checked={toggleStates.primary}
              onChange={(checked) => updateToggle("primary", checked)}
              label="Dark mode toggle"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <h3 className="font-medium text-primary">Email Notifications</h3>
              <p className="text-sm text-secondary">Receive email updates</p>
            </div>
            <Toggle
              checked={toggleStates.secondary}
              onChange={(checked) => updateToggle("secondary", checked)}
              variant="success"
              label="Email notifications toggle"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <h3 className="font-medium text-primary">Auto-save</h3>
              <p className="text-sm text-secondary">
                Automatically save changes
              </p>
            </div>
            <Toggle
              checked={toggleStates.success}
              onChange={(checked) => updateToggle("success", checked)}
              variant="secondary"
              size="lg"
              label="Auto-save toggle"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleDemo;
