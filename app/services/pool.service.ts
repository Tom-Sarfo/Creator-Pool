import { apiClient, buildQueryString } from "./api-client";
import { API_ENDPOINTS } from "../lib/api-config";
import type {
  CreatePoolRequest,
  CreatePoolResponse,
  PoolFilters,
  GetPoolsResponse,
  GetPoolResponse,
  UpdatePoolStatusRequest,
  SettlePoolResponse,
  Pool,
  PoolStatus,
} from "../lib/types";
import { PoolStatus as PoolStatusEnum } from "../lib/types";

// Pool service class
export class PoolService {
  // Get pools with filters and pagination
  async getPools(params?: PoolFilters): Promise<GetPoolsResponse> {
    const queryString = params ? buildQueryString(params) : "";
    return apiClient.get<GetPoolsResponse>(
      `${API_ENDPOINTS.POOLS.LIST}${queryString}`
    );
  }

  // Get all pools (for dashboard display)
  async getAllPools(): Promise<Pool[]> {
    const response = await this.getPools({ limit: 1000 }); // Get all pools
    return response.pools;
  }

  // Get pools by status
  async getPoolsByStatus(status: PoolStatus): Promise<Pool[]> {
    const response = await this.getPools({ status });
    return response.pools;
  }

  // Get pools by creator
  async getPoolsByCreator(creatorId: string): Promise<Pool[]> {
    const response = await this.getPools({ creatorId });
    return response.pools;
  }

  // Get active pools (open, awaiting_release, live_tracking)
  async getActivePools(): Promise<Pool[]> {
    const response = await this.getPools();
    return response.pools.filter((pool) =>
      ["open", "awaiting_release", "live_tracking"].includes(pool.status)
    );
  }

  // Get settled pools
  async getSettledPools(): Promise<Pool[]> {
    return this.getPoolsByStatus(PoolStatusEnum.SETTLED);
  }

  // Get pool by ID with full details
  async getPoolById(poolId: string): Promise<GetPoolResponse> {
    return apiClient.get<GetPoolResponse>(
      API_ENDPOINTS.POOLS.GET_BY_ID(poolId)
    );
  }

  // Create a new pool
  async createPool(poolData: CreatePoolRequest): Promise<CreatePoolResponse> {
    return apiClient.post<CreatePoolResponse>(
      API_ENDPOINTS.POOLS.CREATE,
      poolData
    );
  }

  // Update pool status
  async updatePoolStatus(poolId: string, status: PoolStatus): Promise<Pool> {
    return apiClient.put<Pool>(API_ENDPOINTS.POOLS.UPDATE_STATUS(poolId), {
      status,
    } as UpdatePoolStatusRequest);
  }

  // Settle a pool
  async settlePool(poolId: string): Promise<SettlePoolResponse> {
    return apiClient.post<SettlePoolResponse>(
      API_ENDPOINTS.POOLS.SETTLE(poolId)
    );
  }

  // Get pools for predictor dashboard
  async getPredictorPools(): Promise<Pool[]> {
    const response = await this.getPools();
    // Filter out pools that are not available for predictions
    return response.pools.filter((pool) =>
      ["open", "awaiting_release", "live_tracking"].includes(pool.status)
    );
  }

  // Get pools for creator dashboard
  async getCreatorPools(creatorId: string): Promise<Pool[]> {
    return this.getPoolsByCreator(creatorId);
  }

  // Search pools by title or question
  async searchPools(query: string): Promise<Pool[]> {
    const response = await this.getPools();
    const lowercaseQuery = query.toLowerCase();
    return response.pools.filter(
      (pool) =>
        pool.question.toLowerCase().includes(lowercaseQuery) ||
        pool.video?.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get pools by video ID
  async getPoolsByVideo(videoId: string): Promise<Pool[]> {
    const response = await this.getPools();
    return response.pools.filter((pool) => pool.videoId === videoId);
  }

  // Check if video has an active pool
  async hasActivePool(videoId: string): Promise<boolean> {
    const pools = await this.getPoolsByVideo(videoId);
    return pools.some((pool) =>
      ["open", "awaiting_release", "live_tracking"].includes(pool.status)
    );
  }

  // Get pool statistics from API
  async getPoolStats(poolId: string): Promise<{
    totalPredictions: number;
    yesPredictions: number;
    noPredictions: number;
    totalStake: number;
    yesStake: number;
    noStake: number;
    participants: number;
    currentOdds: {
      yes: number;
      no: number;
    };
    timeRemaining: number;
  }> {
    return apiClient.get(
      API_ENDPOINTS.POOLS.STATS(poolId)
    );
  }

  // Deposit creator pledge
  async depositPledge(poolId: string, amount: number): Promise<Pool> {
    return apiClient.post<Pool>(
      API_ENDPOINTS.POOLS.DEPOSIT_PLEDGE(poolId),
      { amount }
    );
  }

  // Get recent pools (last 7 days)
  async getRecentPools(): Promise<Pool[]> {
    const response = await this.getPools();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return response.pools.filter(
      (pool) => new Date(pool.createdAt) >= sevenDaysAgo
    );
  }

  // Get trending pools (most participants)
  async getTrendingPools(limit: number = 10): Promise<Pool[]> {
    const response = await this.getPools();
    return response.pools
      .sort((a, b) => b.participants - a.participants)
      .slice(0, limit);
  }

  // Get high-stake pools
  async getHighStakePools(minStake: number = 1000): Promise<Pool[]> {
    const response = await this.getPools();
    return response.pools.filter((pool) => pool.totalStake >= minStake);
  }

  // Validate pool creation data
  static validatePoolData(data: CreatePoolRequest): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.videoId) {
      errors.push("Video ID is required");
    }

    if (!data.question || data.question.trim().length < 10) {
      errors.push("Question must be at least 10 characters long");
    }

    if (!data.targetViews || data.targetViews < 1000) {
      errors.push("Target views must be at least 1,000");
    }

    if (
      data.trackingDurationDays &&
      (data.trackingDurationDays < 1 || data.trackingDurationDays > 30)
    ) {
      errors.push("Tracking duration must be between 1 and 30 days");
    }

    if (
      data.predictionWindowMinutes &&
      (data.predictionWindowMinutes < 5 || data.predictionWindowMinutes > 60)
    ) {
      errors.push("Prediction window must be between 5 and 60 minutes");
    }

    if (data.creatorPledge && data.creatorPledge < 0) {
      errors.push("Creator pledge cannot be negative");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Calculate pool odds
  static calculateOdds(
    yesStake: number,
    noStake: number
  ): { yes: number; no: number } {
    const totalStake = yesStake + noStake;

    if (totalStake === 0) {
      return { yes: 0.5, no: 0.5 };
    }

    // Apply house edge (6% total: 5% platform + 1% creator)
    const houseEdge = 0.94;
    const netPool = totalStake * houseEdge;

    // Calculate proper parimutuel odds
    const yesOdds = yesStake > 0 ? netPool / yesStake - 1 : 0;
    const noOdds = noStake > 0 ? netPool / noStake - 1 : 0;

    return {
      yes: Math.max(0.1, Number(yesOdds.toFixed(2))),
      no: Math.max(0.1, Number(noOdds.toFixed(2))),
    };
  }

  // Calculate potential payout
  static calculatePotentialPayout(stake: number, odds: number): number {
    return Number((stake * (1 + odds)).toFixed(2));
  }

  // Check if pool is accepting predictions
  static isPoolOpen(pool: Pool): boolean {
    return pool.status === "open";
  }

  // Check if pool is in tracking phase
  static isPoolTracking(pool: Pool): boolean {
    return pool.status === "live_tracking";
  }

  // Check if pool is settled
  static isPoolSettled(pool: Pool): boolean {
    return pool.status === "settled";
  }

  // Get time remaining for open pools
  static getTimeRemaining(pool: Pool): string {
    if (pool.status !== "open" || !pool.createdAt) {
      return "N/A";
    }

    const poolCreatedAt = new Date(pool.createdAt);
    const predictionWindowMinutes = pool.predictionWindowMinutes || 43200; // Default 30 days in minutes
    const deadline = new Date(
      poolCreatedAt.getTime() + predictionWindowMinutes * 60 * 1000
    );
    const remaining = deadline.getTime() - new Date().getTime();

    if (remaining <= 0) {
      return "00:00";
    }

    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // Check if timer is urgent (last 30 seconds)
  static isTimerUrgent(pool: Pool): boolean {
    if (pool.status !== "open" || !pool.createdAt) {
      return false;
    }

    const poolCreatedAt = new Date(pool.createdAt);
    const predictionWindowMinutes = pool.predictionWindowMinutes || 10;
    const deadline = new Date(
      poolCreatedAt.getTime() + predictionWindowMinutes * 60 * 1000
    );
    const remaining = deadline.getTime() - new Date().getTime();

    return remaining <= 30000 && remaining > 0; // Last 30 seconds
  }

  // Format pool status for display
  static getStatusLabel(status: PoolStatus): string {
    const statusLabels = {
      open: "Open",
      awaiting_release: "Awaiting Release",
      live_tracking: "Live Tracking",
      closed: "Closed",
      settled: "Settled",
    };
    return statusLabels[status] || status;
  }

  // Get status color class
  static getStatusColor(status: PoolStatus): string {
    const statusColors = {
      open: "bg-green-100 text-green-800",
      awaiting_release: "bg-yellow-100 text-yellow-800",
      live_tracking: "bg-cyan-100 text-cyan-800",
      closed: "bg-orange-100 text-orange-800",
      settled: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  }
}

// Create singleton instance
export const poolService = new PoolService();
