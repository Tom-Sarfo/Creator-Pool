// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  WS_URL: import.meta.env.VITE_WS_URL || "ws://localhost:3000",
  BASE_URL_FRONTEND: import.meta.env.VITE_BASE_URL || "http://localhost:3000",

  // Authentication
  ACCESS_TOKEN_KEY: import.meta.env.VITE_ACCESS_TOKEN_KEY || "accessToken",
  REFRESH_TOKEN_KEY: import.meta.env.VITE_REFRESH_TOKEN_KEY || "refreshToken",
  ACCESS_TOKEN_EXPIRES_IN:
    import.meta.env.VITE_ACCESS_TOKEN_EXPIRES_IN || "15m",
  REFRESH_TOKEN_EXPIRES_IN:
    import.meta.env.VITE_REFRESH_TOKEN_EXPIRES_IN || "7d",

  // YouTube
  YOUTUBE_CLIENT_ID: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET: import.meta.env.VITE_YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REDIRECT_URI:
    import.meta.env.VITE_YOUTUBE_REDIRECT_URI ||
    "http://localhost:3000/api/youtube/callback",
  YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY,

  // Google OAuth
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI:
    import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
    "http://localhost:3001/auth/google/callback",

  // Feature Flags
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === "true" || false, // Default to false for real API
} as const;

// API Endpoints
// Note: Backend supports both /api/* and /* routes (automatically rewrites)
// Using /api/* prefix for consistency and explicit routing
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    GOOGLE: "/api/auth/google",
    LOGOUT: "/api/auth/logout",
  },

  // Wallet
  WALLET: {
    BALANCE: "/api/auth/wallet/balance",
    DEPOSIT: "/api/auth/wallet/add-funds",
    WITHDRAW: "/api/wallet/withdraw",
    TRANSACTIONS: "/api/transactions",
  },

  // YouTube
  YOUTUBE: {
    AUTH_URL: "/api/youtube/auth-url",
    CALLBACK: "/api/youtube/callback",
    CHANNEL: "/api/youtube/channel",
    STATUS: "/api/youtube/status", // Added: Simple status check endpoint
    SYNC_VIDEOS: "/api/youtube/sync-videos",
    SYNC: "/api/youtube/sync", // Added: Alternative sync endpoint from guide
    VIDEOS: "/api/youtube/videos",
    DISCONNECT: "/api/youtube/disconnect",
  },

  // Pools
  POOLS: {
    LIST: "/api/pools",
    CREATE: "/api/pools",
    GET_BY_ID: (id: string) => `/api/pools/${id}`,
    UPDATE_STATUS: (id: string) => `/api/pools/${id}/status`,
    SETTLE: (id: string) => `/api/pools/${id}/settle`,
    STATS: (id: string) => `/api/pools/${id}/stats`,
    DEPOSIT_PLEDGE: (id: string) => `/api/pools/${id}/deposit-pledge`,
  },

  // Predictions
  PREDICTIONS: {
    LIST: "/api/predictions",
    CREATE: "/api/predictions",
    GET_BY_ID: (id: string) => `/api/predictions/${id}`,
  },

  // Videos
  VIDEOS: {
    GET_BY_ID: (id: string) => `/api/videos/${id}`,
    METRICS: (id: string) => `/api/videos/${id}/metrics`,
    SYNC_METRICS: (id: string) => `/api/videos/${id}/sync-metrics`,
  },

  // Analytics
  ANALYTICS: {
    CREATOR: (id: string) => `/api/analytics/creator/${id}`,
    PREDICTOR: (id: string) => `/api/analytics/predictor/${id}`,
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Default API request configuration
export const DEFAULT_REQUEST_CONFIG = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
} as const;
