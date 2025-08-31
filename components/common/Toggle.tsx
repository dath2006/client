"use client";

import React from "react";

export interface ToggleProps {
  /** Whether the toggle is checked/on */
  checked: boolean;
  /** Callback function called when toggle state changes */
  onChange: (checked: boolean) => void;
  /** Size variant of the toggle */
  size?: "sm" | "md" | "lg" | "xl";
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Accessible label for the toggle */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Color variant of the toggle */
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  /** Show loading state */
  loading?: boolean;
}

const sizeConfig = {
  sm: {
    container: "w-8 h-5",
    thumb: "w-3 h-3",
    translate: "translate-x-3",
  },
  md: {
    container: "w-10 h-6",
    thumb: "w-4 h-4",
    translate: "translate-x-4",
  },
  lg: {
    container: "w-12 h-7",
    thumb: "w-5 h-5",
    translate: "translate-x-5",
  },
  xl: {
    container: "w-14 h-8",
    thumb: "w-6 h-6",
    translate: "translate-x-6",
  },
};

const variantConfig = {
  primary: {
    bg: "bg-primary",
    focus: "focus:ring-primary/20",
  },
  secondary: {
    bg: "bg-secondary",
    focus: "focus:ring-secondary/20",
  },
  success: {
    bg: "bg-success",
    focus: "focus:ring-success/20",
  },
  warning: {
    bg: "bg-warning",
    focus: "focus:ring-warning/20",
  },
  error: {
    bg: "bg-error",
    focus: "focus:ring-error/20",
  },
};

// Simple utility to combine classes
const combineClasses = (
  ...classes: (string | undefined | false | null)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  size = "md",
  disabled = false,
  label,
  className,
  variant = "primary",
  loading = false,
}) => {
  const sizeClasses = sizeConfig[size];
  const variantClasses = variantConfig[variant];

  const handleToggle = () => {
    if (!disabled && !loading) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  const containerClasses = combineClasses(
    // Base styles
    "relative inline-flex items-center rounded-full transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",

    // Size
    sizeClasses.container,

    // Colors and states
    checked
      ? combineClasses(variantClasses.bg, variantClasses.focus)
      : "bg-muted focus:ring-muted/20",

    // Disabled state
    disabled && "opacity-50 cursor-not-allowed",

    // Loading state
    loading && "cursor-wait",

    // Hover effects
    !disabled && !loading && "hover:shadow-sm",

    className
  );

  const thumbClasses = combineClasses(
    // Base thumb styles
    "inline-block rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out",
    "ring-0 transform",

    // Size
    sizeClasses.thumb,

    // Position based on checked state
    checked ? sizeClasses.translate : "translate-x-1",

    // Loading indicator
    loading && "animate-pulse"
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled || loading}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={containerClasses}
    >
      <span className="sr-only">{label}</span>

      {/* Toggle thumb */}
      <span className={thumbClasses}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </span>
    </button>
  );
};

export default Toggle;
