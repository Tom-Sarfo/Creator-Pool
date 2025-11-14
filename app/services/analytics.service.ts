import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../lib/api-config";
import type {
  CreatorAnalyticsResponse,
  PredictorAnalyticsResponse,
  MonthlyAnalytics,
  PoolPerformance,
  PredictionHistory,
} from "../lib/types";

// Analytics service class
export class AnalyticsService {
  // Get creator analytics
  async getCreatorAnalytics(
    creatorId: string
  ): Promise<CreatorAnalyticsResponse> {
    return apiClient.get<CreatorAnalyticsResponse>(
      API_ENDPOINTS.ANALYTICS.CREATOR(creatorId)
    );
  }

  // Get predictor analytics
  async getPredictorAnalytics(
    predictorId: string
  ): Promise<PredictorAnalyticsResponse> {
    return apiClient.get<PredictorAnalyticsResponse>(
      API_ENDPOINTS.ANALYTICS.PREDICTOR(predictorId)
    );
  }

  // Get creator performance metrics
  async getCreatorPerformanceMetrics(creatorId: string): Promise<{
    totalPools: number;
    totalParticipants: number;
    totalStaked: number;
    totalEarned: number;
    averagePoolSize: number;
    averageParticipants: number;
    winRate: number;
  }> {
    const analytics = await this.getCreatorAnalytics(creatorId);
    return {
      totalPools: analytics.totalPools,
      totalParticipants: analytics.totalParticipants,
      totalStaked: analytics.totalStaked,
      totalEarned: analytics.totalEarned,
      averagePoolSize: analytics.averagePoolSize,
      averageParticipants: analytics.averageParticipants,
      winRate: analytics.winRate,
    };
  }

  // Get predictor performance metrics
  async getPredictorPerformanceMetrics(predictorId: string): Promise<{
    totalPredictions: number;
    winRate: number;
    totalEarnings: number;
    activePredictions: number;
  }> {
    const analytics = await this.getPredictorAnalytics(predictorId);
    return {
      totalPredictions: analytics.totalPredictions,
      winRate: analytics.winRate,
      totalEarnings: analytics.totalEarnings,
      activePredictions: analytics.activePredictions,
    };
  }

  // Get monthly analytics data
  async getMonthlyAnalytics(
    userId: string,
    userType: "creator" | "predictor"
  ): Promise<MonthlyAnalytics[]> {
    const analytics =
      userType === "creator"
        ? await this.getCreatorAnalytics(userId)
        : await this.getPredictorAnalytics(userId);

    return analytics.monthlyData;
  }

  // Get pool performance data
  async getPoolPerformance(creatorId: string): Promise<PoolPerformance[]> {
    const analytics = await this.getCreatorAnalytics(creatorId);
    return analytics.poolPerformance;
  }

  // Get prediction history
  async getPredictionHistory(
    predictorId: string
  ): Promise<PredictionHistory[]> {
    const analytics = await this.getPredictorAnalytics(predictorId);
    return analytics.predictionHistory;
  }

  // Get revenue analytics for creator
  async getCreatorRevenueAnalytics(creatorId: string): Promise<{
    totalRevenue: number;
    monthlyRevenue: MonthlyAnalytics[];
    averageRevenuePerPool: number;
    revenueGrowth: number;
  }> {
    const analytics = await this.getCreatorAnalytics(creatorId);
    const monthlyData = analytics.monthlyData;

    const totalRevenue = analytics.totalEarned;
    const averageRevenuePerPool =
      analytics.totalPools > 0 ? totalRevenue / analytics.totalPools : 0;

    // Calculate revenue growth (comparing last month to previous month)
    let revenueGrowth = 0;
    if (monthlyData.length >= 2) {
      const lastMonth = monthlyData[monthlyData.length - 1];
      const previousMonth = monthlyData[monthlyData.length - 2];
      revenueGrowth =
        previousMonth.revenue > 0
          ? ((lastMonth.revenue - previousMonth.revenue) /
              previousMonth.revenue) *
            100
          : 0;
    }

    return {
      totalRevenue,
      monthlyRevenue: monthlyData,
      averageRevenuePerPool,
      revenueGrowth: Math.round(revenueGrowth),
    };
  }

  // Get engagement analytics for creator
  async getCreatorEngagementAnalytics(creatorId: string): Promise<{
    totalParticipants: number;
    averageParticipantsPerPool: number;
    participantGrowth: number;
    engagementRate: number;
  }> {
    const analytics = await this.getCreatorAnalytics(creatorId);
    const monthlyData = analytics.monthlyData;

    const totalParticipants = analytics.totalParticipants;
    const averageParticipantsPerPool = analytics.averageParticipants;

    // Calculate participant growth
    let participantGrowth = 0;
    if (monthlyData.length >= 2) {
      const lastMonth = monthlyData[monthlyData.length - 1];
      const previousMonth = monthlyData[monthlyData.length - 2];
      participantGrowth =
        previousMonth.participants > 0
          ? ((lastMonth.participants - previousMonth.participants) /
              previousMonth.participants) *
            100
          : 0;
    }

    // Calculate engagement rate (participants per pool)
    const engagementRate =
      analytics.totalPools > 0
        ? (totalParticipants / analytics.totalPools) * 100
        : 0;

    return {
      totalParticipants,
      averageParticipantsPerPool,
      participantGrowth: Math.round(participantGrowth),
      engagementRate: Math.round(engagementRate),
    };
  }

  // Get prediction analytics for predictor
  async getPredictorPredictionAnalytics(predictorId: string): Promise<{
    totalPredictions: number;
    winRate: number;
    averageStake: number;
    totalEarnings: number;
    roi: number;
    predictionFrequency: number;
  }> {
    const analytics = await this.getPredictorAnalytics(predictorId);
    const predictionHistory = analytics.predictionHistory;

    const totalPredictions = analytics.totalPredictions;
    const winRate = analytics.winRate;
    const totalEarnings = analytics.totalEarnings;

    // Calculate average stake
    const totalStaked = predictionHistory.reduce((sum, p) => sum + p.stake, 0);
    const averageStake =
      totalPredictions > 0 ? totalStaked / totalPredictions : 0;

    // Calculate ROI
    const roi = totalStaked > 0 ? (totalEarnings / totalStaked) * 100 : 0;

    // Calculate prediction frequency (predictions per month)
    const monthlyData = analytics.monthlyData;
    const predictionFrequency =
      monthlyData.length > 0
        ? monthlyData.reduce((sum, m) => sum + m.participants, 0) /
          monthlyData.length
        : 0;

    return {
      totalPredictions,
      winRate,
      averageStake,
      totalEarnings,
      roi: Math.round(roi),
      predictionFrequency: Math.round(predictionFrequency),
    };
  }

  // Get top performing pools
  async getTopPerformingPools(
    creatorId: string,
    limit: number = 5
  ): Promise<PoolPerformance[]> {
    const poolPerformance = await this.getPoolPerformance(creatorId);
    return poolPerformance
      .sort((a, b) => b.totalStake - a.totalStake)
      .slice(0, limit);
  }

  // Get recent prediction performance
  async getRecentPredictionPerformance(
    predictorId: string,
    days: number = 30
  ): Promise<{
    recentPredictions: number;
    recentWins: number;
    recentWinRate: number;
    recentEarnings: number;
  }> {
    const predictionHistory = await this.getPredictionHistory(predictorId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentPredictions = predictionHistory.filter(
      (p) => new Date(p.predictedAt) >= cutoffDate
    );

    const recentWins = recentPredictions.filter(
      (p) => p.result === "won"
    ).length;
    const recentWinRate =
      recentPredictions.length > 0
        ? (recentWins / recentPredictions.length) * 100
        : 0;
    const recentEarnings = recentPredictions
      .filter((p) => p.result === "won")
      .reduce((sum, p) => sum + (p.payout || 0), 0);

    return {
      recentPredictions: recentPredictions.length,
      recentWins,
      recentWinRate: Math.round(recentWinRate),
      recentEarnings,
    };
  }

  // Format analytics data for display
  static formatAnalyticsNumber(
    value: number,
    type: "currency" | "percentage" | "number" = "number"
  ): string {
    switch (type) {
      case "currency":
        return `$${value.toLocaleString()}`;
      case "percentage":
        return `${value}%`;
      case "number":
      default:
        return value.toLocaleString();
    }
  }

  // Format monthly data for charts
  static formatMonthlyDataForChart(monthlyData: MonthlyAnalytics[]): {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  } {
    const labels = monthlyData.map((m) => m.month);
    const poolsData = monthlyData.map((m) => m.pools);
    const participantsData = monthlyData.map((m) => m.participants);
    const revenueData = monthlyData.map((m) => m.revenue);

    return {
      labels,
      datasets: [
        {
          label: "Pools",
          data: poolsData,
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderColor: "rgba(59, 130, 246, 1)",
        },
        {
          label: "Participants",
          data: participantsData,
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 1)",
        },
        {
          label: "Revenue",
          data: revenueData,
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderColor: "rgba(245, 158, 11, 1)",
        },
      ],
    };
  }

  // Get analytics summary for dashboard
  static getAnalyticsSummary(
    analytics: CreatorAnalyticsResponse | PredictorAnalyticsResponse
  ): {
    primaryMetric: {
      label: string;
      value: string;
      type: "currency" | "percentage" | "number";
    };
    secondaryMetrics: {
      label: string;
      value: string;
      type: "currency" | "percentage" | "number";
    }[];
  } {
    if ("totalPools" in analytics) {
      // Creator analytics
      return {
        primaryMetric: {
          label: "Total Revenue",
          value: this.formatAnalyticsNumber(analytics.totalEarned, "currency"),
          type: "currency",
        },
        secondaryMetrics: [
          {
            label: "Total Pools",
            value: this.formatAnalyticsNumber(analytics.totalPools, "number"),
            type: "number",
          },
          {
            label: "Total Participants",
            value: this.formatAnalyticsNumber(
              analytics.totalParticipants,
              "number"
            ),
            type: "number",
          },
          {
            label: "Win Rate",
            value: this.formatAnalyticsNumber(analytics.winRate, "percentage"),
            type: "percentage",
          },
        ],
      };
    } else {
      // Predictor analytics
      return {
        primaryMetric: {
          label: "Total Earnings",
          value: this.formatAnalyticsNumber(
            analytics.totalEarnings,
            "currency"
          ),
          type: "currency",
        },
        secondaryMetrics: [
          {
            label: "Total Predictions",
            value: this.formatAnalyticsNumber(
              analytics.totalPredictions,
              "number"
            ),
            type: "number",
          },
          {
            label: "Win Rate",
            value: this.formatAnalyticsNumber(analytics.winRate, "percentage"),
            type: "percentage",
          },
          {
            label: "Active Predictions",
            value: this.formatAnalyticsNumber(
              analytics.activePredictions,
              "number"
            ),
            type: "number",
          },
        ],
      };
    }
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();
