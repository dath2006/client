"use client";

import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { RootState, AppDispatch } from "@/lib/redux/store";
import {
  fetchPermissions,
  resetPermissions,
} from "@/lib/redux/permissionsSlice";
import { useAuth } from "./useAuth";

/**
 * Hook for managing global user permissions state
 *
 * This hook provides:
 * - Current user permissions based on their role
 * - Loading states for permissions fetching
 * - Functions to refresh permissions when user role changes
 */
export function useGlobalPermissions() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const {
    data: permissions,
    loading,
    error,
    lastFetched,
    userRole: storedUserRole,
    groupId,
    groupName,
    isInitialLoad,
  } = useSelector((state: RootState) => state.permissions);

  // Get current user role, defaulting to "guest" if not authenticated
  const currentUserRole = user?.role || "guest";

  // Check if we need to refresh permissions (role changed or no permissions loaded)
  const needsRefresh = !permissions || storedUserRole !== currentUserRole;

  // Function to refresh permissions for current user role
  const refreshPermissions = useCallback(() => {
    dispatch(fetchPermissions(currentUserRole));
  }, [dispatch, currentUserRole]);

  // Auto-refresh permissions when user role changes
  useEffect(() => {
    if (needsRefresh && !loading) {
      refreshPermissions();
    }
  }, [needsRefresh, loading, refreshPermissions]);

  // Reset permissions when user logs out
  useEffect(() => {
    if (!user && storedUserRole && storedUserRole !== "guest") {
      dispatch(resetPermissions());
      // Fetch guest permissions
      dispatch(fetchPermissions("guest"));
    }
  }, [user, storedUserRole, dispatch]);

  // Check if permissions are ready for the current user
  const permissionsReady =
    !isInitialLoad &&
    !loading &&
    permissions &&
    storedUserRole === currentUserRole;

  // Check if initial loading (first time loading permissions)
  const isInitialLoading = isInitialLoad && loading;

  return {
    // Data
    permissions,
    userRole: currentUserRole,
    storedUserRole,
    groupId,
    groupName,

    // States
    loading,
    error,
    lastFetched,
    isInitialLoad,
    isInitialLoading,
    permissionsReady,

    // Actions
    refreshPermissions,
    resetPermissions: () => dispatch(resetPermissions()),

    // Utilities
    hasPermission: (permission: string): boolean => {
      return permissions?.[permission] === true;
    },

    // Common permission checks - using actual permission names
    canAddPosts: permissions?.add_posts === true,
    canEditPosts: permissions?.edit_posts === true,
    canDeletePosts: permissions?.delete_posts === true,
    canEditOwnPosts: permissions?.edit_own_posts === true,
    canDeleteOwnPosts: permissions?.delete_own_posts === true,
    canViewDrafts: permissions?.view_drafts === true,
    canViewOwnDrafts: permissions?.view_own_drafts === true,
    canAddComments: permissions?.add_comments === true,
    canEditComments: permissions?.edit_comments === true,
    canDeleteComments: permissions?.delete_comments === true,
    canEditOwnComments: permissions?.edit_own_comments === true,
    canDeleteOwnComments: permissions?.delete_own_comments === true,
    canAddUsers: permissions?.add_users === true,
    canEditUsers: permissions?.edit_users === true,
    canDeleteUsers: permissions?.delete_users === true,
    canChangeSettings: permissions?.change_settings === true,
    canToggleExtensions: permissions?.toggle_extensions === true,
    canManageCategories: permissions?.manage_categories === true,
    canAddUploads: permissions?.add_uploads === true,
    canDeleteUploads: permissions?.delete_uploads === true,
    canViewUploads: permissions?.view_uploads === true,
    canAddPages: permissions?.add_pages === true,
    canEditPages: permissions?.edit_pages === true,
    canDeletePages: permissions?.delete_pages === true,
    canViewPages: permissions?.view_pages === true,
    canViewSite: permissions?.view_site === true,
    canLikePosts: permissions?.like_posts === true,
    canUnlikePosts: permissions?.unlike_posts === true,
    canExportContent: permissions?.export_content === true,
    canImportContent: permissions?.import_content === true,
  };
}

/**
 * Hook for components that need to wait for permissions to be ready
 * Returns null if permissions aren't loaded yet, preventing render
 */
export function usePermissionsGuard() {
  const { permissionsReady, permissions } = useGlobalPermissions();

  // Return permissions only when ready, null otherwise
  return permissionsReady ? permissions : null;
}

/**
 * Hook for checking specific permissions with fallback
 */
export function useHasPermission(
  permission: string,
  fallback: boolean = false
) {
  const { permissions, permissionsReady } = useGlobalPermissions();

  if (!permissionsReady) {
    return fallback;
  }

  return permissions?.[permission] === true;
}

/**
 * Hook for checking multiple permissions at once
 */
export function useHasPermissions(
  permissionsList: string[],
  requireAll: boolean = true
) {
  const { permissions, permissionsReady } = useGlobalPermissions();

  if (!permissionsReady || !permissions) {
    return false;
  }

  const results = permissionsList.map(
    (permission) => permissions[permission] === true
  );

  return requireAll ? results.every(Boolean) : results.some(Boolean);
}
