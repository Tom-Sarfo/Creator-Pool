// Import types
import type { Pool } from "./types";

// Probability utility functions
export function formatProbabilityAsPercentage(probability: number): string {
  // Formats probability (0-1 range) as percentage string
  return `${(probability * 100).toFixed(1)}%`;
}

export function getProbabilityColor(probability: number): string {
  // Returns color classes based on probability value
  if (probability >= 0.7) return "text-green-600";
  if (probability >= 0.5) return "text-blue-600";
  if (probability >= 0.3) return "text-yellow-600";
  return "text-red-600";
}

export function estimatePotentialPayout(
  userStake: number,
  totalStakeOnUserSide: number,
  totalPool: number
): number {
  // Estimates potential payout: (userStake / totalStakeOnUserSide) * totalPool
  // This is only used for preview before submission
  if (totalStakeOnUserSide === 0) return 0;
  const estimated = (userStake / totalStakeOnUserSide) * totalPool;
  const cap = totalPool * 0.94 * 0.8; // 80% of net pool after 6% house edge
  return Number(Math.min(estimated, cap).toFixed(2));
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
  return { valid: true };
}

// Parse backend time format "MM:SS" to { minutes, seconds }
function parseTimeRemaining(
  timeStr: string
): { minutes: number; seconds: number } | null {
  const parts = timeStr.split(":");
  if (parts.length !== 2) return null;

  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);

  if (isNaN(minutes) || isNaN(seconds)) return null;
  return { minutes, seconds };
}

// Format minutes:seconds to MM:SS
function formatMinutesSeconds(totalMinutes: number, seconds: number): string {
  return `${totalMinutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Format longer durations to readable format like "29 days", "12 hours", "30 minutes"
function formatLongDuration(totalMinutes: number, seconds: number): string {
  const days = Math.floor(totalMinutes / (24 * 60));
  const remainingMinutes = totalMinutes % (24 * 60);
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  const parts: string[] = [];

  // Format days
  if (days > 0) {
    parts.push(days === 1 ? "1 day" : `${days} days`);
  }

  // Format hours (show if less than 7 days to keep it readable)
  if (hours > 0 && days < 7) {
    parts.push(hours === 1 ? "1 hour" : `${hours} hours`);
  }

  // Format minutes (only show if no days to avoid clutter)
  if (minutes > 0 && days === 0) {
    parts.push(minutes === 1 ? "1 minute" : `${minutes} minutes`);
  }

  // If we have parts, join them
  if (parts.length > 0) {
    return parts.join(" ");
  }

  // For very short durations, show seconds
  if (seconds > 0 && totalMinutes < 1) {
    return seconds === 1 ? "1 second" : `${seconds} seconds`;
  }

  return "00:00";
}

// Format time remaining from backend (format: "42113:45" = minutes:seconds)
export function formatTimeRemaining(
  timeRemaining: string | undefined | null
): string {
  if (!timeRemaining || timeRemaining === "N/A") return "N/A";

  const parsed = parseTimeRemaining(timeRemaining);
  if (!parsed) return timeRemaining;

  const { minutes: totalMinutes, seconds } = parsed;

  if (totalMinutes < 60) {
    return formatMinutesSeconds(totalMinutes, seconds);
  }

  return formatLongDuration(totalMinutes, seconds);
}

// Calculate remaining time for open pools with precise formatting
export function calculateRemainingTime(pool: Pool, currentTime: Date): string {
  // Check if pool has timeRemaining from backend (may not be in type definition)
  const poolWithTimeRemaining = pool as Pool & { timeRemaining?: string };

  // Use backend timeRemaining if available and format it nicely
  if (poolWithTimeRemaining.timeRemaining) {
    const formatted = formatTimeRemaining(poolWithTimeRemaining.timeRemaining);
    // If backend returned "N/A", try to calculate
    if (formatted !== "N/A") {
      return formatted;
    }
  }

  // Handle different pool statuses
  if (pool.status === "settled") {
    return "Settled";
  }

  if (pool.status === "closed") {
    return "Closed";
  }

  if (pool.status === "awaiting_release") {
    return "Awaiting Release";
  }

  if (pool.status === "live_tracking") {
    // Calculate time remaining in tracking period if we have trackingStartedAt
    const poolWithTracking = pool as Pool & {
      trackingStartedAt?: string | Date;
    };
    if (poolWithTracking.trackingStartedAt && pool.trackingDurationDays) {
      const trackingStart = new Date(
        typeof poolWithTracking.trackingStartedAt === "string"
          ? poolWithTracking.trackingStartedAt
          : poolWithTracking.trackingStartedAt.toISOString()
      );
      const trackingEnd = new Date(
        trackingStart.getTime() +
          pool.trackingDurationDays * 24 * 60 * 60 * 1000
      );
      const remaining = trackingEnd.getTime() - currentTime.getTime();

      if (remaining > 0) {
        const minutes = Math.floor(remaining / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        const timeStr = `${minutes}:${seconds}`;
        return formatTimeRemaining(timeStr);
      }
      return "Tracking Ended";
    }
    return "Tracking";
  }

  // For open pools, calculate based on createdAt and predictionWindowMinutes
  if (pool.status === "open") {
    if (!pool.createdAt) {
      return "Open";
    }

    const deadline = new Date(
      new Date(
        typeof pool.createdAt === "string"
          ? pool.createdAt
          : pool.createdAt.toISOString()
      ).getTime() +
        (pool.predictionWindowMinutes || 43200) * 60 * 1000
    );
    const remaining = deadline.getTime() - currentTime.getTime();

    if (remaining <= 0) return "00:00";

    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    // Format the calculated time using formatTimeRemaining logic
    const timeStr = `${minutes}:${seconds}`;
    return formatTimeRemaining(timeStr);
  }

  // Fallback for unknown statuses
  return "—";
}

// Check if timer is in final 30 seconds (for visual urgency)
export function isTimerUrgent(pool: Pool, currentTime: Date): boolean {
  if (pool.status !== "open") return false;

  // Always calculate since timeRemaining is not part of Pool type

  // Fallback to calculation
  if (!pool.createdAt) return false;

  const deadline = new Date(
    new Date(
      typeof pool.createdAt === "string"
        ? pool.createdAt
        : pool.createdAt.toISOString()
    ).getTime() +
      (pool.predictionWindowMinutes || 10) * 60 * 1000
  );
  const remaining = deadline.getTime() - currentTime.getTime();
  return remaining <= 30000 && remaining > 0;
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

// Get effective pool status - prioritizes backend status, uses client-side calculation only as fallback
export function getEffectivePoolStatus(pool: Pool, currentTime: Date): string {
  // Always prioritize backend status - trust the server's state
  // Only use client-side calculation for edge cases (e.g., when status is "open" but window has expired)

  // If pool status is already set by backend (not "open"), trust it
  if (pool.status !== "open") {
    return pool.status;
  }

  // For "open" pools, check if prediction window has expired (client-side validation for UI)
  // This is only a visual indication - actual status transitions are handled by backend
  const poolWithTimeRemaining = pool as Pool & { timeRemaining?: string };

  // Check if timeRemaining exists and is expired
  if (poolWithTimeRemaining.timeRemaining) {
    const parsed = parseTimeRemaining(poolWithTimeRemaining.timeRemaining);
    if (parsed) {
      const totalMinutes = parsed.minutes;
      // If time remaining is 0 or negative, it's expired
      // Note: Backend should handle this, but we show "awaiting_release" for UI purposes
      if (totalMinutes <= 0) {
        return "awaiting_release";
      }
    }
  }

  // Fallback: calculate if expired based on createdAt and predictionWindowMinutes
  if (pool.createdAt) {
    const deadline = new Date(
      new Date(
        typeof pool.createdAt === "string"
          ? pool.createdAt
          : pool.createdAt.toISOString()
      ).getTime() +
        (pool.predictionWindowMinutes || 43200) * 60 * 1000
    );
    const remaining = deadline.getTime() - currentTime.getTime();

    // If remaining time is 0 or negative, prediction window has expired
    // Note: Backend should handle this, but we show "awaiting_release" for UI purposes
    if (remaining <= 0) {
      return "awaiting_release";
    }
  }

  // Pool is still open and within prediction window (backend will handle transitions)
  return pool.status; // Always use backend status
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

const toNumber = (value: unknown) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof value === "bigint") return Number(value);
  return 0;
};

export function calculatePoolMetrics(poolData: any, videoData: any) {
  const currentViews = Math.round(
    poolData.currentViews !== undefined
      ? toNumber(poolData.currentViews)
      : toNumber(videoData?.viewCount ?? videoData?.views)
  );
  const targetViews = Math.round(toNumber(poolData.targetViews));
  const progress =
    targetViews > 0
      ? Math.round(Math.min((currentViews / targetViews) * 100, 100) * 10) / 10
      : 0;

  const creatorPledge = toNumber(poolData.creatorPledge);

  const yesStake = toNumber(poolData.yesStake);
  const noStake = toNumber(poolData.noStake);
  const predictorStakes = yesStake + noStake;

  // Total pool amount includes both creator pledge and all predictor stakes
  const totalPoolAmount = predictorStakes + creatorPledge;

  let yesPercentage = 0;
  let noPercentage = 0;
  if (predictorStakes > 0) {
    yesPercentage = Math.round((yesStake / predictorStakes) * 100);
    noPercentage = 100 - yesPercentage;
  }

  const totalParticipants = toNumber(poolData.participants);
  const yesStakers = toNumber(poolData.yesCount);
  const noStakers = toNumber(poolData.noCount);

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
    creatorPledge: creatorPledge || 0,
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

// Get thumbnail for pool or video with fallback logic
export function getThumbnail(
  data: any,
  getVideoById?: (id: string) => any,
  isPool: boolean = false
): string {
  // For videos, just return thumbnail or placeholder
  if (!isPool) {
    return (
      data?.thumbnail || "https://via.placeholder.com/300x200?text=No+Thumbnail"
    );
  }

  // For pools, check multiple sources
  const poolThumbnail = data?.thumbnail || data?.video?.thumbnail;

  if (poolThumbnail) {
    return poolThumbnail;
  }

  // Try to get video from context if getVideoById is provided
  if (data?.videoId && getVideoById) {
    const videoData = getVideoById(data.videoId);
    if (videoData?.thumbnail) {
      return videoData.thumbnail;
    }
  }

  // Fallback placeholder
  return "https://via.placeholder.com/300x200?text=No+Thumbnail";
}

// Parse ISO 8601 duration format (e.g., "PT3S", "PT1M30S", "PT1H30M45S") to readable format
export function parseISODuration(
  isoDuration: string | null | undefined
): string {
  if (!isoDuration || typeof isoDuration !== "string") {
    return "Unknown duration";
  }

  // Remove PT prefix (Period Time)
  const durationStr = isoDuration.replace(/^PT/i, "");

  if (!durationStr) {
    return "0 seconds";
  }

  // Extract hours, minutes, and seconds using regex
  const hoursMatch = durationStr.match(/(\d+)H/i);
  const minutesMatch = durationStr.match(/(\d+)M/i);
  const secondsMatch = durationStr.match(/(\d+)S/i);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

  // Build readable duration string
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(hours === 1 ? "1 hour" : `${hours} hours`);
  }

  if (minutes > 0) {
    parts.push(minutes === 1 ? "1 minute" : `${minutes} minutes`);
  }

  if (seconds > 0 || parts.length === 0) {
    // Always show seconds if there are no other parts
    parts.push(seconds === 1 ? "1 second" : `${seconds} seconds`);
  }

  // Join parts with space
  return parts.join(" ");
}

// Format ISO 8601 duration to short format (e.g., "1:23", "1h 23m", "3s")
export function formatISODurationShort(
  isoDuration: string | null | undefined
): string {
  if (!isoDuration || typeof isoDuration !== "string") {
    return "—";
  }

  // Remove PT prefix
  const durationStr = isoDuration.replace(/^PT/i, "");

  if (!durationStr) {
    return "0s";
  }

  // Extract components
  const hoursMatch = durationStr.match(/(\d+)H/i);
  const minutesMatch = durationStr.match(/(\d+)M/i);
  const secondsMatch = durationStr.match(/(\d+)S/i);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

  // Format based on duration length
  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds > 0 ? `${seconds}s` : ""}`.trim();
  }

  return `${seconds}s`;
}

export function formatPoolQuestion(
  question: string,
  targetViews: number,
  trackingDurationDays?: number
): string {
  if (!question || !targetViews) {
    return question || "";
  }

  const formattedViews = Math.round(targetViews).toLocaleString();

  let formatted = question
    // Replace "{targetViews}" or "targetViews" with formatted number
    .replace(/\{targetViews\}/gi, formattedViews)
    .replace(/\btargetViews\b/gi, formattedViews)
    // Replace "target views" (case insensitive) with "{formattedViews} views"
    .replace(/\btarget\s+views\b/gi, `${formattedViews} views`)
    // Replace standalone "target" when followed by "views" context
    .replace(/\btarget\b(?=\s*views?)/gi, formattedViews);

  // Replace tracking duration day patterns if provided
  if (trackingDurationDays && trackingDurationDays > 0) {
    const daysText =
      trackingDurationDays === 1 ? "1 day" : `${trackingDurationDays} days`;

    // Check if question already has a tracking duration placeholder (before replacement)
    const hasTrackingDurationPlaceholder = /\{?trackingDurationDays?\}?/gi.test(
      formatted
    );

    formatted = formatted
      // Replace "{trackingDurationDay}" or "{trackingDurationDays}" with "{days} days"
      .replace(/\{trackingDurationDays?\}/gi, daysText)
      // Replace "trackingDurationDay" or "trackingDurationDays" with "{days} days"
      .replace(/\btrackingDurationDays?\b/gi, daysText)
      // Replace standalone "tracking duration" when followed by "day/days" context
      .replace(/\btracking\s+duration\s+days?\b/gi, daysText);

    // Check if question already mentions days/timeframe (after replacement)
    // This catches both original timeframe mentions and replaced placeholders
    const hasTimeframeMention =
      /\b(within|in|after|during|over)\s+[\d\s,]*\s*(day|days|week|weeks|month|months|hour|hours|minute|minutes)\b/gi.test(
        formatted
      );

    // If no placeholder existed and no timeframe is mentioned, append "in X days" to the end
    if (!hasTrackingDurationPlaceholder && !hasTimeframeMention) {
      // Remove trailing punctuation and whitespace before appending
      formatted = formatted.trim().replace(/[.?!]*$/, "");
      formatted = `${formatted} in ${daysText}`;
    }
  }

  return formatted;
}
