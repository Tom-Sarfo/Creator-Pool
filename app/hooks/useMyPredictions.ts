import { useState, useEffect } from "react";
import { predictionService } from "../services/prediction.service";
import type { Prediction } from "../lib/types";

interface UseMyPredictionsReturn {
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMyPredictions(): UseMyPredictionsReturn {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await predictionService.getMyPredictions();
      setPredictions(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch predictions";
      setError(errorMessage);
      console.error("Error fetching predictions:", err);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return {
    predictions,
    loading,
    error,
    refetch: fetchPredictions,
  };
}

