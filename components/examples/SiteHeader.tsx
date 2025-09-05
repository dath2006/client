"use client";

import React from "react";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

export default function SiteHeader() {
  const {
    siteTitle,
    siteDescription,
    loading,
    error,
    refreshSettings,
    getSetting,
  } = useGlobalSettings();

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error loading site settings
        <button
          onClick={refreshSettings}
          className="ml-2 underline text-blue-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{siteTitle}</h1>
      {siteDescription && (
        <p className="text-gray-600 mt-2">{siteDescription}</p>
      )}
      <div className="text-xs text-gray-400 mt-4">
        Custom Setting Example: {getSetting("custom_field", "Default Value")}
      </div>
    </header>
  );
}
