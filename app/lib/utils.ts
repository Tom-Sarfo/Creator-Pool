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
