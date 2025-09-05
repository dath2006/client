// Main API exports - provides a clean interface for importing APIs
import apiClient from "./client";
export { default as apiClient } from "./client";
export * from "./client";
export * from "./types";

// Feed API
export { feedAPI } from "./feed";

// Admin APIs
export { adminPostsAPI } from "./admin-posts";
export { adminUsersAPI } from "./admin-users";
export { adminGroupsAPI } from "./admin-groups";
export { adminUploadsAPI } from "./admin-uploads";
export { adminTagsAPI } from "./admin-tags";
export { adminCategoriesAPI } from "./admin-categories";
export { adminCommentsAPI } from "./admin-comments";
export { adminSpamAPI } from "./admin-spam";
export { adminSettingsAPI } from "./admin-settings";

// Consolidated admin API for backward compatibility
import { adminPostsAPI } from "./admin-posts";
import { adminUsersAPI } from "./admin-users";
import { adminGroupsAPI } from "./admin-groups";
import { adminUploadsAPI } from "./admin-uploads";
import { adminTagsAPI } from "./admin-tags";
import { adminCategoriesAPI } from "./admin-categories";
import { adminCommentsAPI } from "./admin-comments";
import { adminSpamAPI } from "./admin-spam";
import { adminSettingsAPI } from "./admin-settings";

export const adminAPI = {
  // Posts
  ...adminPostsAPI,

  // Users
  ...adminUsersAPI,

  // Groups
  ...adminGroupsAPI,

  // Uploads
  ...adminUploadsAPI,

  // Tags
  ...adminTagsAPI,

  // Categories
  ...adminCategoriesAPI,

  // Comments
  ...adminCommentsAPI,

  // Spam
  ...adminSpamAPI,

  // Settings
  ...adminSettingsAPI,
};

// Default export
export default apiClient;
