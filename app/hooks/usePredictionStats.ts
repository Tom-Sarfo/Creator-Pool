import { useState, useEffect, useRef } from "react";
import { predictionService } from "../services/prediction.service";
import type { PredictionStats } from "../lib/types";

interface UsePredictionStatsOptions {
  pollInterval?: number;
  enabled?: boolean;
}

interface UsePredictionStatsReturn {
  stats: PredictionStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePredictionStats(
  options: UsePredictionStatsOptions = {}
): UsePredictionStatsReturn {
  const { pollInterval = 30000, enabled = true } = options;
  const [stats, setStats] = useState<PredictionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await predictionService.getMyStats();
      setStats(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch prediction stats";
      setError(errorMessage);
      console.error("Error fetching prediction stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    if (enabled && pollInterval > 0) {
      intervalRef.current = setInterval(fetchStats, pollInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollInterval, enabled]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
