import React, { useState } from "react";
import { useAdminSettingsWithAuth } from "@/hooks/useAdminSettingsWithAuth";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

interface AdminSettingsWithAuthExampleProps {
  /** Authentication token for admin API calls */
  authToken: string | null;
}

/**
 * Example component showing how to use the useAdminSettingsWithAuth hook
 * This demonstrates context-based authentication with automatic Redux refresh
 */
export function AdminSettingsWithAuthExample({
  authToken,
}: AdminSettingsWithAuthExampleProps) {
  const {
    updateSettingByKeyValue,
    updateSettingsFromObject,
    refreshSettings,
    isAuthenticated,
    hasToken,
  } = useAdminSettingsWithAuth(authToken);

  const { siteTitle, siteName, enableComments, maintenanceMode, loading } =
    useGlobalSettings();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateSiteTitle = async () => {
    if (!isAuthenticated) {
      console.error("Not authenticated");
      return;
    }

    setIsUpdating(true);
    try {
      await updateSettingByKeyValue("site_title", "Updated via Context API");
      console.log(
        "Site title updated with context-based auth and Redux refreshed!"
      );
    } catch (error) {
      console.error("Failed to update site title:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateMultipleSettings = async () => {
    if (!isAuthenticated) {
      console.error("Not authenticated");
      return;
    }

    setIsUpdating(true);
    try {
      await updateSettingsFromObject({
        enable_comments: !enableComments,
        maintenance_mode: !maintenanceMode,
        posts_per_page: 25,
        site_description: "Updated with context-based auth",
      });
      console.log(
        "Multiple settings updated with context auth and Redux refreshed!"
      );
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (!hasToken) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h2 className="text-xl font-bold text-red-800">
          Authentication Required
        </h2>
        <p className="text-red-600">No authentication token provided.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">
        Admin Settings with Auth Context Demo
      </h2>

      <div className="p-3 bg-green-50 border border-green-200 rounded">
        <p className="text-green-800">
          ✅ Authenticated: {isAuthenticated ? "Yes" : "No"}
        </p>
      </div>

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
          disabled={isUpdating || !isAuthenticated}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Site Title (Context Auth)"}
        </button>

        <button
          onClick={handleUpdateMultipleSettings}
          disabled={isUpdating || !isAuthenticated}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isUpdating
            ? "Updating..."
            : "Update Multiple Settings (Context Auth)"}
        </button>

        <button
          onClick={refreshSettings}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Manual Refresh
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          This example uses context-based authentication with automatic Redux
          refresh.
        </p>
        <p>
          Updates will automatically sync the Redux state after successful API
          calls.
        </p>
      </div>
    </div>
  );
}
