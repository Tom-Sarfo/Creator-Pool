// Prediction and odds calculation utilities
export function calculateDynamicOdds(yesStake: number, noStake: number) {
  const totalStake = yesStake + noStake;

  if (totalStake === 0) {
    return { yes: 2.0, no: 2.0 }; // Even odds when no stakes
  }

  // Calculate odds based on stake ratio
  // Lower stake side gets higher odds (more attractive)
  const yesOdds = totalStake / Math.max(yesStake, 1);
  const noOdds = totalStake / Math.max(noStake, 1);

  // Apply house edge (6% total: 5% platform + 1% creator)
  const houseEdge = 0.94;

  return {
    yes: Math.max(1.01, Number((yesOdds * houseEdge).toFixed(2))),
    no: Math.max(1.01, Number((noOdds * houseEdge).toFixed(2))),
  };
}

export function calculatePotentialPayout(stake: number, odds: number): number {
  return Number((stake * odds).toFixed(2));
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
