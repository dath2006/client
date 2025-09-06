// Main API file - exports all APIs in a backward compatible way
// Import all modules from the api directory
export {
  apiClient,
  feedAPI,
  adminAPI,
  adminPostsAPI,
  adminUsersAPI,
  adminGroupsAPI,
  adminUploadsAPI,
  adminTagsAPI,
  adminCategoriesAPI,
  adminCommentsAPI,
  adminSpamAPI,
  adminSettingsAPI,
  ApiError,
  isApiError,
  getAuthToken,
  isAdminUser,
  isProduction,
  isDevelopment,
} from "./api-legacy";

// Export user profile API
export { userProfileAPI } from "./api-legacy/user-profile";

// Export user comments API
export { userCommentsAPI } from "./api-legacy/user-comments";

// Export types
export type {
  FeedParams,
  FeedResponse,
  BackendPost,
  AdminPostParams,
  AdminPostsResponse,
  CreatePostData,
  UpdatePostData,
  Post,
  PostType,
  PostStatus,
  PostContent,
  Comment,
  User,
  Category,
  AdminCategoriesParams,
  AdminCategoriesResponse,
  CreateCategoryData,
  UpdateCategoryData,
} from "./api-legacy";

// Export user profile types
export type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  ApiResponse,
} from "./api-legacy/user-profile";

// Export user comments types
export type {
  UserComment,
  UpdateCommentData,
  CreateCommentData,
} from "./api-legacy/user-comments";

// Export comment and spam types
export type {
  Comment as AdminComment,
  PostWithComments,
  AdminCommentsParams,
  AdminCommentsResponse,
  UpdateCommentStatusData,
  BatchCommentActionData,
  BatchCommentActionResponse,
} from "./api-legacy/admin-comments";

export type {
  SpamItem,
  AdminSpamParams,
  AdminSpamResponse,
  UpdateSpamStatusData,
  BatchSpamActionData,
  BatchSpamActionResponse,
} from "./api-legacy/admin-spam";

export type {
  Setting,
  AdminSettingsResponse,
  UpdateSettingData,
  UpdateSettingsData,
  UpdateSettingsResponse,
} from "./api-legacy/admin-settings";

// Re-export apiClient as default
export { apiClient as default } from "./api-legacy";
