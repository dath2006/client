import React, { useState } from "react";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

/**
 * Example component showing how to use the useAdminSettings hook
 * This will automatically refresh Redux state after settings updates
 */
export function AdminSettingsExample() {
  const { updateSettingByKeyValue, updateSettingsFromObject, refreshSettings } =
    useAdminSettings();

  const { siteTitle, siteName, enableComments, maintenanceMode, loading } =
    useGlobalSettings();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateSiteTitle = async () => {
    setIsUpdating(true);
    try {
      await updateSettingByKeyValue("site_title", "My New Site Title");
      console.log("Site title updated and Redux state refreshed!");
    } catch (error) {
      console.error("Failed to update site title:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateMultipleSettings = async () => {
    setIsUpdating(true);
    try {
      await updateSettingsFromObject({
        enable_comments: !enableComments,
        maintenance_mode: !maintenanceMode,
        posts_per_page: 15,
      });
      console.log("Multiple settings updated and Redux state refreshed!");
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Admin Settings Demo</h2>

      <div className="space-y-2">
        <p>
          <strong>Current Site Title:</strong> {siteTitle}
        </p>
        <p>
          <strong>Site Name:</strong> {siteName}
        </p>
        <p>
          <strong>Comments Enabled:</strong> {enableComments ? "Yes" : "No"}
        </p>
        <p>
          <strong>Maintenance Mode:</strong> {maintenanceMode ? "Yes" : "No"}
        </p>
      </div>

      <div className="space-x-2">
        <button
          onClick={handleUpdateSiteTitle}
          disabled={isUpdating}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Site Title"}
        </button>

        <button
          onClick={handleUpdateMultipleSettings}
          disabled={isUpdating}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Toggle Comments & Maintenance"}
        </button>

        <button
          onClick={refreshSettings}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Manual Refresh
        </button>
      </div>
    </div>
  );
}
