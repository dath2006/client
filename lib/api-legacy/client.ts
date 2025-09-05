import axios from "axios";
import { getSession } from "next-auth/react";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";

// Token cache to prevent repeated session calls
let cachedToken: string | null = null;
let tokenExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to get auth token from NextAuth session with caching
export const getAuthToken = async (): Promise<string | null> => {
  try {
    // Check if we have a valid cached token
    const now = Date.now();
    if (cachedToken && now < tokenExpiry) {
      return cachedToken;
    }

    // Fetch new session
    const session = await getSession();
    const token = session?.user?.accessToken || null;

    // Cache the token if it exists
    if (token) {
      cachedToken = token;
      tokenExpiry = now + CACHE_DURATION;
    } else {
      // Clear cache if no token
      cachedToken = null;
      tokenExpiry = 0;
    }

    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    // Clear cache on error
    cachedToken = null;
    tokenExpiry = 0;
    return null;
  }
};

// Helper function to clear token cache (useful for logout)
export const clearAuthTokenCache = (): void => {
  cachedToken = null;
  tokenExpiry = 0;
};

// Helper function to check if user has admin role
export const isAdminUser = async (): Promise<boolean> => {
  try {
    const session = await getSession();
    return session?.user?.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
};

// Custom Error class
export class ApiError extends Error {
  status?: number;
  details?: any;

  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// Utility function to check if error is ApiError
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

// Environment check utilities
export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  async (config) => {
    // Get auth token from NextAuth session
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Clear cached token on authentication error
      clearAuthTokenCache();
      // Handle unauthorized - redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin";
      }
    } else if (error.response?.status === 403) {
      // Handle forbidden - user doesn't have required role
      console.error("Access forbidden: Insufficient permissions");
      throw new ApiError(
        "You don't have permission to perform this action",
        403
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
