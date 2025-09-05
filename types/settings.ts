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

export interface SettingsState {
  data: SiteSettings | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  isInitialLoad: boolean; // Flag to indicate if this is the first time loading settings
}
