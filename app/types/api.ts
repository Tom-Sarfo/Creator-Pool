// Backend API Types - Matching NestJS API Schema

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "creator" | "predictor" | "admin";
  walletBalance: number;
  googleId?: string;
  youtubeChannelId?: string;
  youtubeAccessToken?: string;
  youtubeRefreshToken?: string;
  youtubeTokenExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Video Types
export type VideoStatus = "unlisted" | "private" | "public";

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description?: string;
  thumbnail: string;
  status: VideoStatus;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  publishedAt: string;
  lastSyncedAt?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
}

// Pool Types
export type PoolStatus =
  | "open"
  | "awaiting_release"
  | "live_tracking"
  | "closed"
  | "settled";

export interface Pool {
  id: string;
  videoId: string;
  creatorId: string;
  question: string;
  targetViews: number;
  duration: number; // Duration in days for the pool question
  predictionWindow: number; // Duration in minutes for prediction window
  status: PoolStatus;
  totalStake: number;
  creatorPledge: number;
  predictorStakes: number;
  yesStake: number;
  noStake: number;
  yesCount: number;
  noCount: number;
  participants: number;
  currentViews: number;
  yesOdds?: number;
  noOdds?: number;
  result?: boolean; // true = YES won, false = NO won
  creatorEarnings: number;
  closesAt?: string;
  publishedAt?: string;
  closedAt?: string;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
  video?: Video;
  creator?: User;
  predictions?: Prediction[];
}

// Prediction Types
export type PredictionChoice = "yes" | "no";
export type PredictionResult = "won" | "lost" | "pending";

export interface Prediction {
  id: string;
  poolId: string;
  predictorId: string;
  choice: PredictionChoice;
  stake: number;
  potentialPayout?: number;
  actualPayout?: number;
  result: PredictionResult;
  settledAt?: string;
  predictedAt: string;
  updatedAt: string;
  pool?: Pool;
  predictor?: User;
}

// Transaction Types
export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "stake"
  | "reward"
  | "fee"
  | "royalty"
  | "pledge";

export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  reference?: string; // Pool ID, prediction ID, etc.
  description?: string;
  externalId?: string; // Payment processor transaction ID
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// YouTube Types
export interface YouTubeChannel {
  id: string;
  title: string;
  thumbnail: string;
  subscriberCount: number;
  videoCount: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  status: VideoStatus;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  publishedAt: string;
  channelId: string;
}

// API Request/Response Types

// Authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  role: "creator" | "predictor";
}

export interface GoogleAuthRequest {
  googleToken: string;
  role: "creator" | "predictor";
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// YouTube API
export interface YouTubeAuthUrlResponse {
  authUrl: string;
}

export interface YouTubeCallbackRequest {
  code: string;
  state?: string;
}

export interface YouTubeChannelResponse {
  id: string;
  title: string;
  thumbnail: string;
  subscriberCount: number;
  videoCount: number;
}

export interface SyncVideosResponse {
  success: boolean;
  videosCount: number;
  newVideosCount: number;
  updatedVideosCount: number;
}

export interface VideosResponse {
  videos: Video[];
  total: number;
  page: number;
  limit: number;
}

// Pool API
export interface CreatePoolRequest {
  videoId: string;
  question: string;
  targetViews: number;
  duration?: number;
  predictionWindow?: number;
  creatorPledge?: number;
}

export interface CreatePoolResponse {
  pool: Pool;
}

export interface GetPoolsRequest {
  status?: PoolStatus;
  creatorId?: string;
  page?: number;
  limit?: number;
}

export interface GetPoolsResponse {
  pools: Pool[];
  total: number;
  page: number;
  limit: number;
}

export interface GetPoolResponse {
  pool: Pool;
  predictions: Prediction[];
  video: Video;
  creator: User;
}

export interface UpdatePoolStatusRequest {
  status: PoolStatus;
}

export interface SettlePoolResponse {
  pool: Pool;
  winningPredictions: Prediction[];
  totalPayout: number;
  creatorEarnings: number;
  platformFee: number;
}

// Prediction API
export interface CreatePredictionRequest {
  poolId: string;
  choice: "yes" | "no";
  stake: number;
}

export interface CreatePredictionResponse {
  prediction: Prediction;
  updatedOdds: {
    yes: number;
    no: number;
  };
}

export interface GetPredictionsRequest {
  poolId?: string;
  predictorId?: string;
  result?: "won" | "lost" | "pending";
  page?: number;
  limit?: number;
}

export interface GetPredictionsResponse {
  predictions: Prediction[];
  total: number;
  page: number;
  limit: number;
}

export interface GetPredictionResponse {
  prediction: Prediction;
  pool: Pool;
  video: Video;
}

// Wallet API
export interface WalletBalanceResponse {
  balance: number;
  totalEarnings: number;
  totalStaked: number;
  pendingWithdrawals: number;
}

export interface DepositRequest {
  amount: number;
  paymentMethod: "stripe" | "paypal";
}

export interface DepositResponse {
  transaction: Transaction;
  paymentIntent?: string; // For Stripe
  approvalUrl?: string; // For PayPal
}

export interface WithdrawRequest {
  amount: number;
  paymentMethod: "stripe" | "paypal";
}

export interface WithdrawResponse {
  transaction: Transaction;
}

export interface GetTransactionsRequest {
  type?: TransactionType;
  status?: TransactionStatus;
  page?: number;
  limit?: number;
}

export interface GetTransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

// Analytics API
export interface MonthlyAnalytics {
  month: string;
  pools: number;
  participants: number;
  revenue: number;
}

export interface PoolPerformance {
  poolId: string;
  title: string;
  participants: number;
  totalStake: number;
  creatorEarnings: number;
  result: boolean;
}

export interface CreatorAnalyticsResponse {
  totalPools: number;
  totalParticipants: number;
  totalStaked: number;
  totalEarned: number;
  averagePoolSize: number;
  averageParticipants: number;
  winRate: number;
  monthlyData: MonthlyAnalytics[];
  poolPerformance: PoolPerformance[];
}

export interface PredictionHistory {
  predictionId: string;
  poolTitle: string;
  choice: PredictionChoice;
  stake: number;
  result: PredictionResult;
  payout?: number;
  predictedAt: string;
}

export interface PredictorAnalyticsResponse {
  totalPredictions: number;
  winRate: number;
  totalEarnings: number;
  activePredictions: number;
  monthlyData: MonthlyAnalytics[];
  predictionHistory: PredictionHistory[];
}

// WebSocket Event Types
export interface WebSocketEvents {
  poolUpdate: {
    poolId: string;
    pool: Pool;
  };
  newPrediction: {
    poolId: string;
    prediction: Prediction;
  };
  oddsUpdate: {
    poolId: string;
    yesOdds: number;
    noOdds: number;
  };
  poolStatusChange: {
    poolId: string;
    oldStatus: PoolStatus;
    newStatus: PoolStatus;
  };
}

// Error Types
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
