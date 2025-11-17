// Consolidated Frontend Types - Based on Backend Data Types
// This file contains all TypeScript interfaces and enums used throughout the frontend
// Matching the backend NestJS DTOs and entities as specified in Data-type.md

// ============================================================================
// Enums
// ============================================================================

export enum UserRole {
  USER = "predictor",
  CREATOR = "creator",
  ADMIN = "admin",
}

export enum PoolStatus {
  OPEN = "open",
  AWAITING_RELEASE = "awaiting_release",
  LIVE_TRACKING = "live_tracking",
  CLOSED = "closed",
  SETTLED = "settled",
}

export enum PoolResult {
  YES_WON = "yes_won",
  NO_WON = "no_won",
  PENDING = "pending",
}

export enum PredictionChoice {
  YES = "yes",
  NO = "no",
}

export enum PredictionResult {
  WON = "won",
  LOST = "lost",
  PENDING = "pending",
}

export enum VideoStatus {
  UNLISTED = "unlisted",
  PRIVATE = "private",
  PUBLIC = "public",
  DELETED = "deleted",
}

export enum VideoVisibility {
  UNLISTED = "unlisted",
  PRIVATE = "private",
  PUBLIC = "public",
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface CreatePoolRequest {
  videoId: string;
  question: string;
  targetViews: number;
  predictionWindowMinutes?: number;
  trackingDurationDays?: number;
  creatorPledge?: number;
}

export interface UpdatePoolRequest {
  question?: string;
  targetViews?: number;
  trackingDurationDays?: number;
  creatorPledge?: number;
}

export interface PoolFilters {
  status?: PoolStatus;
  creatorId?: string;
  videoId?: string;
  page?: number;
  limit?: number;
}

export interface Suggestion {
  question: string;
  targetViews: number;
  trackingDurationDays: number;
  description: string;
  type: "comparison" | "average";
}

export interface SuggestionResponse {
  suggestions: Suggestion[];
  analytics: {
    avg24hViews: number | null;
    avg48hViews: number | null;
    avg7dViews: number | null;
    avg30dViews: number | null;
    sampleSize: number;
    hasEnoughData: boolean;
  };
  creatorStats: {
    totalVideos: number;
    videosWithMilestones: number;
  };
}

export interface CreatePredictionRequest {
  poolId: string;
  choice: PredictionChoice;
  stake: number;
}

export interface PredictionFilters {
  poolId?: string;
  predictorId?: string;
  result?: PredictionResult;
  page?: number;
  limit?: number;
}

export interface PredictionStats {
  totalPredictions: number;
  wonPredictions: number;
  lostPredictions: number;
  pendingPredictions: number;
  totalEarnings: number;
  totalStaked: number;
  winRate: number;
}

// ============================================================================
// Entity Interfaces
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  walletBalance: number;
  googleId?: string | null;
  youtubeChannelId?: string | null;
  youtubeTokenExpiresAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description?: string | null;
  thumbnail: string;
  status: VideoStatus;
  visibility: VideoVisibility;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  publishedAt?: string | Date | null;
  lastSyncedAt?: string | Date | null;
  hasActivePool: boolean;
  poolCreatedAt?: string | Date | null;
  poolClosedAt?: string | Date | null;
  creatorId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  creator?: User;
}

export interface Pool {
  id: string;
  videoId: string;
  creatorId: string;
  question: string;
  targetViews: number;
  trackingDurationDays: number;
  predictionWindowMinutes: number;
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
  probabilityYes: number;
  probabilityNo: number;
  /** @deprecated Use probabilityYes instead */
  yesOdds?: number | null;
  /** @deprecated Use probabilityNo instead */
  noOdds?: number | null;
  result: PoolResult;
  creatorEarnings: number;
  closesAt?: string | Date | null;
  publishedAt?: string | Date | null;
  trackingStartedAt?: string | Date | null;
  closedAt?: string | Date | null;
  settledAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  video?: Video;
  creator?: User;
  predictions?: Prediction[];
}

export interface Prediction {
  id: string;
  poolId: string;
  predictorId: string;
  choice: PredictionChoice;
  stake: number;
  potentialPayout?: number | null;
  actualPayout?: number | null;
  result: PredictionResult;
  settledAt?: string | Date | null;
  predictedAt: string | Date;
  updatedAt: string | Date;
  pool?: Pool;
  predictor?: User;
}

// ============================================================================
// Paginated Responses
// ============================================================================

export interface PaginatedPools {
  pools: Pool[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedPredictions {
  predictions: Prediction[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthRequest {
  googleToken: string;
  role: UserRole;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

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

export interface CreatePoolResponse {
  pool: Pool;
}

export interface GetPoolsResponse extends PaginatedPools {}

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

export interface CreatePredictionResponse {
  prediction: Prediction;
  potentialPayout: number;
  updatedProbabilities: {
    probabilityYes: number;
    probabilityNo: number;
  };
}

export interface GetPredictionsResponse extends PaginatedPredictions {}

export interface GetPredictionResponse {
  prediction: Prediction;
  pool: Pool;
  video: Video;
}

export interface WalletBalanceResponse {
  balance: number;
  totalEarnings: number;
  totalStaked: number;
  pendingWithdrawals: number;
}

export interface DepositRequest {
  amount: number;
  //   paymentMethod: "stripe" | "paypal";
}

export interface DepositResponse {
  transaction: Transaction;
  paymentIntent?: string;
  approvalUrl?: string;
}

export interface WithdrawRequest {
  amount: number;
  paymentMethod: "stripe" | "paypal";
}

export interface WithdrawResponse {
  transaction: Transaction;
}

// ============================================================================
// Transaction Types
// ============================================================================

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
  reference?: string;
  description?: string;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
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

// ============================================================================
// Analytics Types
// ============================================================================

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

// ============================================================================
// WebSocket Event Types
// ============================================================================

export interface WebSocketEvents {
  poolUpdate: {
    poolId: string;
    pool: Pool;
  };
  newPrediction: {
    poolId: string;
    prediction: Prediction;
  };
  probabilityUpdate: {
    poolId: string;
    probabilityYes: number;
    probabilityNo: number;
  };
  poolStatusChange: {
    poolId: string;
    oldStatus: PoolStatus;
    newStatus: PoolStatus;
  };
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

// ============================================================================
// Utility Types
// ============================================================================

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

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
