// Import types
import type { Pool } from "../contexts/AppContext";

// Prediction and odds calculation utilities
export function calculateDynamicOdds(yesStake: number, noStake: number) {
  const totalStake = yesStake + noStake;

  if (totalStake === 0) {
    return { yes: 0.5, no: 0.5 }; // Even odds when no stakes - using 0.5 as requested
  }

  // Calculate odds based on stake ratio
  // Lower stake side gets higher odds (more attractive)
  const yesOdds = totalStake / Math.max(yesStake, 1);
  const noOdds = totalStake / Math.max(noStake, 1);

  // Apply house edge (6% total: 5% platform + 1% creator)
  const houseEdge = 0.94;

  return {
    yes: Math.max(0.5, Number((yesOdds * houseEdge).toFixed(2))),
    no: Math.max(0.5, Number((noOdds * houseEdge).toFixed(2))),
  };
}

export function calculatePotentialPayout(stake: number, odds: number): number {
  // In parimutuel system, odds represent net return ratio
  // 0.5 odds means you get back stake + (stake * 0.5) = stake * 1.5
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
