import axios from "axios";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";

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

// Create a separate admin API client that accepts tokens directly
const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create request function that accepts token as parameter
export const createAuthenticatedRequest = (token: string | null) => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        console.error("Access forbidden: Insufficient permissions");
        throw new ApiError(
          "You don't have permission to perform this action",
          403
        );
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export default adminApiClient;
