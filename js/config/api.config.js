/**
 * AZ Studio - API & Environment Configuration
 * Toggle between Mock Data Store and Real Production Backend seamlessly.
 */

export const API_CONFIG = {
  // Toggle this flag to false when your backend API is ready:
  USE_MOCK: true,

  // Base API URL for backend services
  BASE_URL: window.ENV?.API_BASE_URL || "https://api.azstudio.com/api/v1",

  // Request timeout in milliseconds
  TIMEOUT_MS: 15000,

  // Standard API Endpoints
  ENDPOINTS: {
    // Auth & Identity
    AUTH: {
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh-token",
      REQUEST_OTP: "/auth/forgot-password",
      VERIFY_OTP: "/auth/verify-otp",
      RESET_PASSWORD: "/auth/reset-password",
      PROFILE: "/auth/me",
    },
    // Orders & Quotations
    ORDERS: {
      LIST: "/orders",
      DETAIL: (id) => `/orders/${id}`,
      UPDATE_STATUS: (id) => `/orders/${id}/status`,
      SEND_QUOTE: (id) => `/orders/${id}/quote`,
      EXPORT: "/orders/export",
    },
    // Services
    SERVICES: {
      LIST: "/services",
      DETAIL: (id) => `/services/${id}`,
      CREATE: "/services",
      UPDATE: (id) => `/services/${id}`,
      DELETE: (id) => `/services/${id}`,
    },
    // Packages
    PACKAGES: {
      LIST: "/packages",
      DETAIL: (id) => `/packages/${id}`,
      CREATE: "/packages",
      UPDATE: (id) => `/packages/${id}`,
      DELETE: (id) => `/packages/${id}`,
    },
    // Supervisors & Team
    SUPERVISORS: {
      LIST: "/supervisors",
      DETAIL: (id) => `/supervisors/${id}`,
      CREATE: "/supervisors",
      UPDATE: (id) => `/supervisors/${id}`,
      TOGGLE_STATUS: (id) => `/supervisors/${id}/toggle-status`,
      DELETE: (id) => `/supervisors/${id}`,
    },
    // Roles & Permissions
    ROLES: {
      LIST: "/roles",
      DETAIL: (id) => `/roles/${id}`,
      CREATE: "/roles",
      UPDATE: (id) => `/roles/${id}`,
      DELETE: (id) => `/roles/${id}`,
      PERMISSIONS: "/roles/permissions",
    },
    // Website & CMS Settings
    SETTINGS: {
      GET: "/settings",
      UPDATE: "/settings",
      SECTORS: "/settings/sectors",
      FAQ: "/settings/faq",
      OUTPUTS: "/settings/outputs",
      UPLOAD_MEDIA: "/settings/upload",
    },
  },
};
