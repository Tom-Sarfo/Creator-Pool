import { useState, useEffect, useRef, useCallback } from "react";
import { poolService } from "../services/pool.service";
import type { Pool } from "../lib/types";

interface UseLivePoolMetricsReturn {
  pool: Pool | null;
  metrics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
    lastSyncedAt: string | null;
  } | null;
  isPolling: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const POLL_INTERVAL = 30000; // 30 seconds
const INITIAL_RETRY_DELAY = 10000; // 10 seconds
const MAX_RETRY_DELAY = 60000; // 60 seconds max

const ACTIVE_STATUSES = ["open", "awaiting_release", "live_tracking"];

export function useLivePoolMetrics(poolId: string): UseLivePoolMetricsReturn {
  const [pool, setPool] = useState<Pool | null>(null);
  const [metrics, setMetrics] =
    useState<UseLivePoolMetricsReturn["metrics"]>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const retryDelayRef = useRef(INITIAL_RETRY_DELAY);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const shouldPoll = useCallback((poolStatus?: string) => {
    return poolStatus ? ACTIVE_STATUSES.includes(poolStatus) : true;
  }, []);

  const fetchPoolData = useCallback(async () => {
    try {
      setIsPolling(true);
      setError(null);

      const response = await poolService.getPoolById(poolId);
      const fetchedPool = response?.pool || (response as any);

      if (!fetchedPool || !fetchedPool.id || !fetchedPool.status) {
        throw new Error("Invalid pool data received");
      }

      setPool(fetchedPool);
      setLastUpdated(new Date());

      // Extract metrics from pool data
      if (fetchedPool.video) {
        setMetrics({
          viewCount: fetchedPool.video.viewCount || 0,
          likeCount: fetchedPool.video.likeCount || 0,
          commentCount: fetchedPool.video.commentCount || 0,
          lastSyncedAt: fetchedPool.video.lastSyncedAt || null,
        });
      }

      // Reset retry delay on success
      retryDelayRef.current = INITIAL_RETRY_DELAY;
      setIsPolling(false);

      // Stop polling if pool is no longer in active status
      if (!shouldPoll(fetchedPool.status)) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (err: any) {
      console.error("Error fetching pool metrics:", err);
      setError(err?.message || "Failed to fetch pool data");
      setIsPolling(false);

      // Implement exponential backoff
      retryDelayRef.current = Math.min(
        retryDelayRef.current * 2,
        MAX_RETRY_DELAY
      );
    }
  }, [poolId, shouldPoll]);

  useEffect(() => {
    // Initial fetch
    fetchPoolData();

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      fetchPoolData();
    }, POLL_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchPoolData]);

  return {
    pool,
    metrics,
    isPolling,
    error,
    lastUpdated,
  };
}
