// Service exports - Centralized API service layer
export {
  apiClient,
  TokenManager,
  ApiError,
  buildQueryString,
} from "./api-client";
export { authService, AuthService } from "./auth.service";
export { youtubeService, YouTubeService } from "./youtube.service";
export { poolService, PoolService } from "./pool.service";
export { predictionService, PredictionService } from "./prediction.service";
export { videoService, VideoService } from "./video.service";
export { walletService, WalletService } from "./wallet.service";
export { analyticsService, AnalyticsService } from "./analytics.service";
export {
  wsClient,
  WebSocketClient,
  useWebSocket,
  WebSocketUtils,
} from "./websocket.service";

// Re-export API configuration and types
export {
  API_CONFIG,
  API_ENDPOINTS,
  DEFAULT_REQUEST_CONFIG,
  HTTP_STATUS,
} from "../lib/api-config";
export type * from "../lib/types";
