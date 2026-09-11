import { loadAdminToken, loadAuthData } from "../authStorage";

import { API_BASE } from "../../utils/constant";
import axios from "axios";

// Create axios instances for different API types
// Prefer an explicit VITE_API_BASE when provided (useful for dev and deployed previews)
const envApiBase = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const devBase = envApiBase || (import.meta.env.DEV ? "" : API_BASE);

const publicApi = axios.create({
  baseURL: devBase,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug: print resolved API base used by axios during startup
try {
  // eslint-disable-next-line no-console
  console.debug("API base for axios instances:", { devBase, envApiBase, API_BASE });
} catch (e) {}

const userApi = axios.create({
  baseURL: devBase,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const adminApi = axios.create({
  baseURL: devBase,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// REQUEST INTERCEPTORS
// ============================================

/**
 * User API Request Interceptor
 * Adds user authentication token to requests
 */
userApi.interceptors.request.use(
  (config) => {
    const { token } = loadAuthData();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing user requests for debugging CORS/preflight issues
    try {
      // avoid logging sensitive token values
      const { Authorization, ...rest } = config.headers || {};
      console.debug(
        "User API Request:",
        config.method?.toUpperCase(),
        config.baseURL + (config.url || ""),
        rest,
      );
    } catch (e) {
      console.debug("User API Request (logging failed)", e);
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

/**
 * Admin API Request Interceptor
 * Adds admin authentication token to requests
 */
adminApi.interceptors.request.use(
  (config) => {
    const token = loadAdminToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing admin requests for debugging CORS/preflight issues
    try {
      const { Authorization, ...rest } = config.headers || {};
      console.debug(
        "Admin API Request:",
        config.method?.toUpperCase(),
        config.baseURL + (config.url || ""),
        rest,
      );
    } catch (e) {
      console.debug("Admin API Request (logging failed)", e);
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// ============================================
// RESPONSE INTERCEPTORS
// ============================================

/**
 * Global Error Handler
 * Handles common error responses
 */
const handleError = (error, apiType = "user") => {
  const errorResponse = {
    message: "An error occurred",
    status: error.response?.status,
    data: error.response?.data,
  };

  // Detailed debug logging to help identify CORS/preflight and response header issues
  try {
    console.error("API Error Debug:", {
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      },
      request: error.request && {
        readyState: error.request.readyState,
        status: error.request.status,
        responseURL: error.request.responseURL,
      },
      response: error.response && {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      },
    });
  } catch (e) {
    console.error("Failed to log API error details", e);
  }

  // Handle different error scenarios
  if (!error.response) {
    // Network error
    errorResponse.message = "Network error. Please check your connection.";
    console.error("Network Error:", error);
  } else if (error.response.status === 401) {
    // Unauthorized: only treat as session expiration for user/admin APIs.
    if (apiType === "user" || apiType === "admin") {
      errorResponse.message = "Session expired. Please login again.";

      if (apiType === "user") {
        // Dispatch logout action (would need Redux integration)
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_refresh_token");
      } else {
        localStorage.removeItem("admin_auth_token");
      }

      // Redirect to login (can be handled in Redux thunk or middleware)
      window.dispatchEvent(
        new CustomEvent("AUTH_EXPIRED", { detail: { type: apiType } }),
      );
    } else {
      // For public or other API types, propagate backend message instead
      errorResponse.message =
        error.response?.data?.detail || error.response?.data?.message ||
        "Authentication required";
    }
  } else if (error.response.status === 403) {
    errorResponse.message =
      "You don't have permission to access this resource.";
  } else if (error.response.status === 404) {
    errorResponse.message = "Resource not found.";
  } else if (error.response.status === 500) {
    errorResponse.message = "Server error. Please try again later.";
  } else if (error.response.status === 429) {
    errorResponse.message = "Too many requests. Please try again later.";
  } else {
    errorResponse.message =
      error.response?.data?.message || errorResponse.message;
  }

  return Promise.reject(errorResponse);
};

/**
 * User API Response Interceptor
 */
userApi.interceptors.response.use(
  (response) => {
    // Success response
    return response.data || response;
  },
  (error) => handleError(error, "user"),
);

/**
 * Admin API Response Interceptor
 */
adminApi.interceptors.response.use(
  (response) => {
    // Success response
    return response.data || response;
  },
  (error) => handleError(error, "admin"),
);

// ============================================
// PUBLIC API (No auth needed)
// ============================================
publicApi.interceptors.response.use(
  (response) => response.data || response,
  (error) => handleError(error, "public"),
);

export { publicApi, userApi, adminApi };
