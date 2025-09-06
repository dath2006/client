export interface Module {
  id: number;
  name: string;
  description: string;
  status: "enabled" | "disabled";
  can_disable: boolean;
  can_uninstall: boolean;
  conflicts: string | null;
}

export interface Theme {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Feather {
  id: number;
  name: string;
  description: string;
  status: "enabled" | "disabled";
  can_disable: boolean;
}

export interface SiteSettings {
  site_title?: string;
  site_description?: string;
  site_url?: string;
  theme?: string;
  timezone?: string;
  locale?: string;
  posts_per_page?: number;
  enable_registration?: boolean;
  enable_comments?: boolean;
  enable_trackbacks?: boolean;
  enable_webmentions?: boolean;
  enable_feeds?: boolean;
  enable_search?: boolean;
  maintenance_mode?: boolean;
  admin_email?: string;
  smtp_settings?: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    encryption?: string;
  };
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  seo_settings?: {
    meta_description?: string;
    meta_keywords?: string;
    og_image?: string;
  };

  // New settings from the provided JSON
  modules?: Module[];
  themes?: Theme[];
  feathers?: Feather[];

  // Additional boolean settings
  activateByEmail?: boolean;
  allowRegistration?: boolean;
  applyToFeeds?: boolean;
  authorNotifications?: boolean;
  automatic?: boolean;
  checkUpdates?: boolean;
  cleanUrls?: boolean;
  copyButton?: boolean;
  emailCorrespondence?: boolean;
  homepage?: boolean;
  htmlInComments?: boolean;
  likeWithText?: boolean;
  markdown?: boolean;
  mathmlSupport?: boolean;
  monospaceFont?: boolean;
  protectImages?: boolean;
  reloadComments?: boolean;
  searchPages?: boolean;
  showOnIndexPages?: boolean;
  siteNotifications?: boolean;
  texLatexSupport?: boolean;
  unicodeEmoticons?: boolean;
  webmentions?: boolean;

  // String settings
  allowedHtml?: string;
  background?: string;
  blogUpdateFreq?: string;
  canonicalUrl?: string;
  chyrpUrl?: string;
  contactEmail?: string;
  defaultCommentStatus?: string;
  defaultPageStatus?: string;
  defaultPostStatus?: string;
  defaultText?: string;
  defaultUserGroup?: string;
  description?: string;
  feedFormat?: string;
  guestGroup?: string;
  language?: string;
  likeImage?: string;
  pagesUpdateFreq?: string;
  postsUpdateFreq?: string;
  postViewUrl?: string;
  sitemapPath?: string;
  siteName?: string;
  stylesheet?: string;
  timeZone?: string;
  uploadsPath?: string;

  // Number settings
  commentsPerPage?: number;
  edgeSpacing?: number;
  itemsPerAdminPage?: number;
  postsInFeed?: number;
  postsPerBlogPage?: number;
  reloadInterval?: number;
  uploadSizeLimit?: number;

  [key: string]: any; // Allow additional settings
}

export interface UserPermissions {
  // Add permissions
  add_comments?: boolean;
  add_comments_private?: boolean;
  add_drafts?: boolean;
  add_groups?: boolean;
  add_pages?: boolean;
  add_posts?: boolean;
  add_uploads?: boolean;
  add_users?: boolean;

  // Settings permissions
  change_settings?: boolean;

  // HTML permissions
  use_html_comments?: boolean;

  // Delete permissions
  delete_comments?: boolean;
  delete_drafts?: boolean;
  delete_groups?: boolean;
  delete_own_comments?: boolean;
  delete_own_drafts?: boolean;
  delete_own_posts?: boolean;
  delete_pages?: boolean;
  delete_webmentions?: boolean;
  delete_posts?: boolean;
  delete_uploads?: boolean;
  delete_users?: boolean;

  // Edit permissions
  edit_comments?: boolean;
  edit_drafts?: boolean;
  edit_groups?: boolean;
  edit_own_comments?: boolean;
  edit_own_drafts?: boolean;
  edit_own_posts?: boolean;
  edit_pages?: boolean;
  edit_webmentions?: boolean;
  edit_posts?: boolean;
  edit_uploads?: boolean;
  edit_users?: boolean;

  // Content management permissions
  export_content?: boolean;
  import_content?: boolean;

  // Post interaction permissions
  like_posts?: boolean;
  unlike_posts?: boolean;

  // Category management
  manage_categories?: boolean;

  // System permissions
  toggle_extensions?: boolean;

  // View permissions
  view_drafts?: boolean;
  view_own_drafts?: boolean;
  view_pages?: boolean;
  view_private_posts?: boolean;
  view_scheduled_posts?: boolean;
  view_site?: boolean;
  view_uploads?: boolean;

  [key: string]: boolean | undefined; // Allow additional permissions
}

export interface PermissionsState {
  data: UserPermissions | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  userRole: string | null;
  groupId: number | null;
  groupName: string | null;
  isInitialLoad: boolean;
}

export interface SettingsState {
  data: SiteSettings | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  isInitialLoad: boolean; // Flag to indicate if this is the first time loading settings
}
