import { apiClient, buildQueryString } from "./api-client";
import { API_ENDPOINTS } from "../lib/api-config";
import type {
  CreatePredictionRequest,
  CreatePredictionResponse,
  GetPredictionsRequest,
  GetPredictionsResponse,
  GetPredictionResponse,
  Prediction,
  PredictionChoice,
  PredictionResult,
} from "../types/api";

// Prediction service class
export class PredictionService {
  // Get predictions with filters and pagination
  async getPredictions(
    params?: GetPredictionsRequest
  ): Promise<GetPredictionsResponse> {
    const queryString = params ? buildQueryString(params) : "";
    return apiClient.get<GetPredictionsResponse>(
      `${API_ENDPOINTS.PREDICTIONS.LIST}${queryString}`
    );
  }

  // Get all predictions (for dashboard display)
  async getAllPredictions(): Promise<Prediction[]> {
    const response = await this.getPredictions({ limit: 1000 }); // Get all predictions
    return response.predictions;
  }

  // Get predictions by pool ID
  async getPredictionsByPool(poolId: string): Promise<Prediction[]> {
    const response = await this.getPredictions({ poolId });
    return response.predictions;
  }

  // Get predictions by predictor (user) ID
  async getPredictionsByPredictor(predictorId: string): Promise<Prediction[]> {
    const response = await this.getPredictions({ predictorId });
    return response.predictions;
  }

  // Get predictions by result
  async getPredictionsByResult(
    result: PredictionResult
  ): Promise<Prediction[]> {
    const response = await this.getPredictions({ result });
    return response.predictions;
  }

  // Get active predictions (pending)
  async getActivePredictions(): Promise<Prediction[]> {
    return this.getPredictionsByResult("pending");
  }

  // Get won predictions
  async getWonPredictions(): Promise<Prediction[]> {
    return this.getPredictionsByResult("won");
  }

  // Get lost predictions
  async getLostPredictions(): Promise<Prediction[]> {
    return this.getPredictionsByResult("lost");
  }

  // Get prediction by ID with full details
  async getPredictionById(
    predictionId: string
  ): Promise<GetPredictionResponse> {
    return apiClient.get<GetPredictionResponse>(
      API_ENDPOINTS.PREDICTIONS.GET_BY_ID(predictionId)
    );
  }

  // Create a new prediction
  async createPrediction(
    predictionData: CreatePredictionRequest
  ): Promise<CreatePredictionResponse> {
    return apiClient.post<CreatePredictionResponse>(
      API_ENDPOINTS.PREDICTIONS.CREATE,
      predictionData
    );
  }

  // Get user's predictions for a specific pool
  async getUserPredictionForPool(
    poolId: string,
    userId: string
  ): Promise<Prediction | null> {
    const predictions = await this.getPredictionsByPredictor(userId);
    return predictions.find((p) => p.poolId === poolId) || null;
  }

  // Check if user has predicted on a pool
  async hasUserPredicted(poolId: string, userId: string): Promise<boolean> {
    const prediction = await this.getUserPredictionForPool(poolId, userId);
    return prediction !== null;
  }

  // Get user's prediction statistics
  async getUserPredictionStats(userId: string): Promise<{
    totalPredictions: number;
    activePredictions: number;
    wonPredictions: number;
    lostPredictions: number;
    winRate: number;
    totalEarnings: number;
    totalStaked: number;
  }> {
    const predictions = await this.getPredictionsByPredictor(userId);

    const totalPredictions = predictions.length;
    const activePredictions = predictions.filter(
      (p) => p.result === "pending"
    ).length;
    const wonPredictions = predictions.filter((p) => p.result === "won").length;
    const lostPredictions = predictions.filter(
      (p) => p.result === "lost"
    ).length;

    const winRate =
      totalPredictions > 0
        ? (wonPredictions / (wonPredictions + lostPredictions)) * 100
        : 0;
    const totalEarnings = predictions
      .filter((p) => p.result === "won")
      .reduce((sum, p) => sum + (p.actualPayout || 0), 0);
    const totalStaked = predictions.reduce((sum, p) => sum + p.stake, 0);

    return {
      totalPredictions,
      activePredictions,
      wonPredictions,
      lostPredictions,
      winRate: Math.round(winRate),
      totalEarnings,
      totalStaked,
    };
  }

  // Get recent predictions (last 7 days)
  async getRecentPredictions(): Promise<Prediction[]> {
    const predictions = await this.getAllPredictions();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return predictions.filter(
      (prediction) => new Date(prediction.predictedAt) >= sevenDaysAgo
    );
  }

  // Get high-stake predictions
  async getHighStakePredictions(minStake: number = 100): Promise<Prediction[]> {
    const predictions = await this.getAllPredictions();
    return predictions.filter((prediction) => prediction.stake >= minStake);
  }

  // Search predictions by pool title
  async searchPredictions(query: string): Promise<Prediction[]> {
    const predictions = await this.getAllPredictions();
    const lowercaseQuery = query.toLowerCase();

    // Note: This would be more efficient with backend search, but for now we filter client-side
    return predictions.filter(
      (prediction) =>
        prediction.pool?.question.toLowerCase().includes(lowercaseQuery) ||
        prediction.pool?.video?.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get predictions by choice (YES/NO)
  async getPredictionsByChoice(
    choice: PredictionChoice
  ): Promise<Prediction[]> {
    const predictions = await this.getAllPredictions();
    return predictions.filter((prediction) => prediction.choice === choice);
  }

  // Get predictions by stake range
  async getPredictionsByStakeRange(
    minStake: number,
    maxStake: number
  ): Promise<Prediction[]> {
    const predictions = await this.getAllPredictions();
    return predictions.filter(
      (prediction) =>
        prediction.stake >= minStake && prediction.stake <= maxStake
    );
  }

  // Validate prediction data
  static validatePredictionData(data: CreatePredictionRequest): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.poolId) {
      errors.push("Pool ID is required");
    }

    if (!data.choice || !["yes", "no"].includes(data.choice)) {
      errors.push('Choice must be either "yes" or "no"');
    }

    if (!data.stake || data.stake < 1) {
      errors.push("Stake must be at least $1");
    }

    if (data.stake && data.stake > 500) {
      errors.push("Stake cannot exceed $500");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Calculate potential payout
  static calculatePotentialPayout(stake: number, odds: number): number {
    return Number((stake * (1 + odds)).toFixed(2));
  }

  // Format prediction choice for display
  static formatChoice(choice: PredictionChoice): string {
    return choice.toUpperCase();
  }

  // Get choice color class
  static getChoiceColor(choice: PredictionChoice): string {
    return choice === "yes"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
  }

  // Get result color class
  static getResultColor(result: PredictionResult): string {
    const resultColors = {
      won: "text-green-600 bg-green-100",
      lost: "text-red-600 bg-red-100",
      pending: "text-yellow-600 bg-yellow-100",
    };
    return resultColors[result] || "text-gray-600 bg-gray-100";
  }

  // Format result for display
  static formatResult(result: PredictionResult): string {
    const resultLabels = {
      won: "Won",
      lost: "Lost",
      pending: "Pending",
    };
    return resultLabels[result] || result;
  }

  // Format stake amount
  static formatStake(stake: number): string {
    return `$${stake.toFixed(2)}`;
  }

  // Format payout amount
  static formatPayout(payout: number | undefined): string {
    if (payout === undefined || payout === null) {
      return "N/A";
    }
    return `$${payout.toFixed(2)}`;
  }

  // Format prediction date
  static formatPredictionDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  // Get prediction age in days
  static getPredictionAgeInDays(predictedAt: string): number {
    const predicted = new Date(predictedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - predicted.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if prediction is recent (within last 24 hours)
  static isRecentPrediction(predictedAt: string): boolean {
    return this.getPredictionAgeInDays(predictedAt) <= 1;
  }

  // Calculate ROI (Return on Investment)
  static calculateROI(stake: number, payout: number | undefined): number {
    if (payout === undefined || payout === null) {
      return 0;
    }
    return Number((((payout - stake) / stake) * 100).toFixed(2));
  }

  // Get prediction summary for display
  static getPredictionSummary(prediction: Prediction): string {
    const choice = this.formatChoice(prediction.choice);
    const stake = this.formatStake(prediction.stake);
    const result = this.formatResult(prediction.result);

    return `${choice} ${stake} - ${result}`;
  }
}

// Create singleton instance
export const predictionService = new PredictionService();
