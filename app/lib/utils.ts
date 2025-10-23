// Import types
import type { Pool } from "../contexts/AppContext";

// Prediction and odds calculation utilities
export function calculateDynamicOdds(yesStake: number, noStake: number) {
  const totalStake = yesStake + noStake;

  if (totalStake === 0) {
    return { yes: 2.0, no: 2.0 }; // Even odds when no stakes - using 2.0 as even odds
  }

  // Calculate odds based on stake ratio
  // Lower stake side gets higher odds (more attractive)
  const yesOdds = totalStake / Math.max(yesStake, 1);
  const noOdds = totalStake / Math.max(noStake, 1);

  // Apply house edge (6% total: 5% platform + 1% creator)
  const houseEdge = 0.94;

  return {
    yes: Math.max(2.0, Number((yesOdds * houseEdge).toFixed(2))),
    no: Math.max(2.0, Number((noOdds * houseEdge).toFixed(2))),
  };
}

export function calculatePotentialPayout(stake: number, odds: number): number {
  // In parimutuel system, odds represent net return ratio
  // 2.0 odds means you get back stake + (stake * 2.0) = stake * 3.0
  return Number((stake * (1 + odds)).toFixed(2));
}

export function validateStake(
  stake: number,
  poolTotalStake: number
): {
  valid: boolean;
  error?: string;
} {
  if (stake < 1) {
    return { valid: false, error: "Minimum stake is $1" };
  }
  if (stake > 500) {
    return { valid: false, error: "Maximum stake is $500" };
  }
  const maxAllowed = poolTotalStake * 0.1;
  if (stake > maxAllowed && poolTotalStake > 0) {
    return {
      valid: false,
      error: `Cannot exceed 10% of pool size ($${maxAllowed.toFixed(2)})`,
    };
  }
  return { valid: true };
}

// Calculate remaining time for open pools with precise formatting
export function calculateRemainingTime(pool: Pool, currentTime: Date) {
  if (pool.status !== "open" || !pool.createdAt) {
    return pool.timeRemaining || "N/A";
  }

  const poolCreatedAt = new Date(pool.createdAt);
  const predictionWindow = pool.predictionWindow || 10; // Default 10 minutes
  const deadline = new Date(
    poolCreatedAt.getTime() + predictionWindow * 60 * 1000
  );
  const remaining = deadline.getTime() - currentTime.getTime();

  if (remaining <= 0) {
    return "00:00";
  }

  const minutes = Math.floor(remaining / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  // Format with leading zeros for better visual consistency
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Check if timer is in final 30 seconds (for visual urgency)
export function isTimerUrgent(pool: Pool, currentTime: Date) {
  if (pool.status !== "open" || !pool.createdAt) {
    return false;
  }

  const poolCreatedAt = new Date(pool.createdAt);
  const predictionWindow = pool.predictionWindow || 10;
  const deadline = new Date(
    poolCreatedAt.getTime() + predictionWindow * 60 * 1000
  );
  const remaining = deadline.getTime() - currentTime.getTime();

  return remaining <= 30000 && remaining > 0; // Last 30 seconds
}

// Utility to extract duration from question text and calculate time remaining
export function extractDurationAndTimeRemaining(questionText: string) {
  // Patterns to match different time formats - ordered by specificity
  const timePatterns = [
    // Hours patterns
    { pattern: /(\d+)\s*hours?/i, unit: "hours", multiplier: 1 / 24 },
    { pattern: /(\d+)\s*hour/i, unit: "hour", multiplier: 1 / 24 },
    // Days patterns
    { pattern: /(\d+)\s*days?/i, unit: "days", multiplier: 1 },
    { pattern: /(\d+)\s*day/i, unit: "day", multiplier: 1 },
    // Weeks patterns
    { pattern: /(\d+)\s*weeks?/i, unit: "weeks", multiplier: 7 },
    { pattern: /(\d+)\s*week/i, unit: "week", multiplier: 7 },
  ];

  for (const { pattern, unit, multiplier } of timePatterns) {
    const match = questionText.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      const totalDays = value * multiplier;

      // Format time remaining nicely
      if (value === 1 && unit.includes("day")) {
        return { duration: 1, timeRemaining: "1 day", totalDays };
      } else if (value === 24 && unit.includes("hour")) {
        return { duration: 1, timeRemaining: "1 day", totalDays };
      } else if (totalDays >= 1) {
        return {
          duration: Math.round(totalDays),
          timeRemaining: `${Math.round(totalDays)} days`,
          totalDays,
        };
      } else {
        return {
          duration: totalDays,
          timeRemaining: `${value} hours`,
          totalDays,
        };
      }
    }
  }

  // Default fallback
  return { duration: 7, timeRemaining: "7 days", totalDays: 7 };
}

// shadcn/ui utility functions
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Pool status configuration and utilities
export const POOL_STATUS_CONFIG = {
  open: { color: "bg-green-100 text-green-800", label: "Open" },
  awaiting_release: {
    color: "bg-yellow-100 text-yellow-800",
    label: "Awaiting Release",
  },
  live_tracking: {
    color: "bg-cyan-100 text-cyan-800",
    label: "Live Tracking",
  },
  closed: { color: "bg-orange-100 text-orange-800", label: "Closed" },
  settled: { color: "bg-orange-100 text-orange-800", label: "Settled" },
  available: {
    color: "bg-gray-100 text-gray-800",
    label: "Available for Pool",
  },
  unlisted: {
    color: "bg-cyan-100 text-cyan-800",
    label: "Unlisted",
  },
};

export function getPoolStatusColor(poolStatus: string) {
  return (
    POOL_STATUS_CONFIG[poolStatus as keyof typeof POOL_STATUS_CONFIG]?.color ||
    "bg-gray-100 text-gray-800"
  );
}

export function getPoolStatusLabel(poolStatus: string) {
  return (
    POOL_STATUS_CONFIG[poolStatus as keyof typeof POOL_STATUS_CONFIG]?.label ||
    poolStatus
  );
}

export function formatNumber(num: number | undefined | null) {
  if (num === undefined || num === null || isNaN(num)) {
    return "0";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function getStatusBadgeStyle(status: string) {
  const styles = {
    active: "bg-green-100 text-green-800",
    settled: "bg-cyan-100 text-cyan-800",
    expired: "bg-gray-100 text-gray-800",
  };
  return `px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`;
}

export function getResultBadgeStyle(result: string) {
  const styles = {
    won: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
  };
  return `px-2 py-1 rounded-full text-xs font-medium ${styles[result as keyof typeof styles]}`;
}

export function calculatePredictorStats(predictions: any[], userId: string) {
  const userPredictions = predictions.filter(
    (p) => p.predictorId === (userId || "anonymous")
  );

  return {
    totalPredictions: userPredictions.length,
    activePredictions: userPredictions.filter((p) => p.result === "pending")
      .length,
    winRate:
      userPredictions.length > 0
        ? Math.round(
            (userPredictions.filter((p) => p.result === "won").length /
              userPredictions.filter((p) => p.result !== "pending").length) *
              100
          ) || 0
        : 0,
    totalEarnings: userPredictions
      .filter((p) => p.result === "won")
      .reduce((sum, p) => sum + (p.actualPayout || 0), 0),
  };
}

export function getRecentPools(pools: any[], limit: number = 3) {
  return pools
    .filter((p) => p.status === "open")
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, limit);
}

export function mapQuickActionsToIcons(actions: any[]) {
  return actions.map((action) => ({
    ...action,
    icon:
      action.icon === "bullseye"
        ? "faBullseye"
        : action.icon === "chart-line"
          ? action.href === "/predictor/predictions"
            ? "faBrain"
            : "faChartLine"
          : action.icon === "wallet"
            ? "faWallet"
            : "faBullseye",
  }));
}

export function calculatePoolMetrics(poolData: any, videoData: any) {
  const currentViews =
    poolData.currentViews !== undefined
      ? poolData.currentViews
      : videoData?.views || 0;
  const targetViews = poolData.targetViews || 0;
  const progress =
    targetViews > 0 ? Math.min((currentViews / targetViews) * 100, 100) : 0;

  const totalPoolAmount = poolData.totalStake || 0;
  const creatorPledge = poolData.creatorPledge || 0;

  const yesStake = poolData.yesStake || 0;
  const noStake = poolData.noStake || 0;
  const predictorStakes = yesStake + noStake;

  const yesPercentage =
    predictorStakes > 0 ? Math.round((yesStake / predictorStakes) * 100) : 0;
  const noPercentage = 100 - yesPercentage;

  const totalParticipants = poolData.participants || 0;
  const yesStakers = poolData.yesCount || 0;
  const noStakers = poolData.noCount || 0;

  const viewGrowthRate = (() => {
    if (targetViews === 0 || currentViews === 0) return "+0.0%";
    const baseGrowth = 8.5;
    const progressRatio = targetViews > 0 ? currentViews / targetViews : 0;
    const growthFactor = progressRatio > 0.8 ? 1.5 : 1.0;
    const randomVariation = 0.8 + Math.random() * 0.4;
    return `+${(baseGrowth * growthFactor * randomVariation).toFixed(1)}%`;
  })();

  const totalPoolForFees = totalPoolAmount;

  return {
    currentViews,
    progress,
    platformFee: totalPoolForFees
      ? Math.round(totalPoolForFees * 0.05 * 100) / 100
      : 0,
    creatorRoyalty: totalPoolForFees
      ? Math.round(totalPoolForFees * 0.01 * 100) / 100
      : 0,
    creatorPledge:
      creatorPledge ||
      (totalPoolForFees ? Math.round(totalPoolForFees * 0.15 * 100) / 100 : 0),
    yesPool: yesStake,
    noPool: noStake,
    yesPercentage,
    noPercentage,
    yesStakers,
    noStakers,
    viewGrowthRate,
    predictorStakes,
    totalPoolAmount,
  };
}

export function transformPredictionsToDisplay(predictions: any[]) {
  return predictions.map((prediction) => ({
    id: prediction.id,
    user: prediction.predictorName || "Anonymous User",
    time: new Date(prediction.predictedAt).toLocaleString(),
    prediction: prediction.choice.toUpperCase(),
    amount: prediction.stake,
    status: prediction.result || "active",
    potentialPayout: prediction.potentialPayout,
    actualPayout: prediction.actualPayout,
  }));
}

export function filterAndSortPredictions(
  predictions: any[],
  filter: string,
  sort: string
) {
  const filtered = predictions.filter((prediction) => {
    switch (filter) {
      case "yes":
        return prediction.choice === "yes";
      case "no":
        return prediction.choice === "no";
      case "high":
        return prediction.stake >= 100;
      default:
        return true;
    }
  });

  return filtered.sort((a, b) => {
    switch (sort) {
      case "stake":
        return b.stake - a.stake;
      case "chronological":
        return (
          new Date(a.predictedAt).getTime() - new Date(b.predictedAt).getTime()
        );
      default:
        return (
          new Date(b.predictedAt).getTime() - new Date(a.predictedAt).getTime()
        );
    }
  });
}
