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

// Poll every 90 seconds to match 2-minute backend update cycle
// Backend updates metrics every 2 minutes, so polling slightly faster ensures near-real-time updates
// Backend also automatically transitions pool status (OPEN/AWAITING_RELEASE → LIVE_TRACKING) when videos go public
// No manual sync needed - status transitions happen automatically every 2 minutes
const POLL_INTERVAL = 90000; // 90 seconds - matches 2-minute backend cycle
const INITIAL_RETRY_DELAY = 10000; // 10 seconds
const MAX_RETRY_DELAY = 300000; // 5 minutes max for rate limiting

// Pools in these statuses are actively tracked and should be polled for updates
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
    // Skip fetching if poolId is empty (for non-pool cards)
    if (!poolId || poolId.trim() === "") {
      setIsPolling(false);
      return;
    }

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
      // Priority: pool.currentViews (updated every 2 minutes) > pool.video.viewCount > 0
      // The pool response includes currentViews directly, which is always updated
      const viewCount =
        fetchedPool.currentViews !== undefined &&
        fetchedPool.currentViews !== null
          ? fetchedPool.currentViews
          : fetchedPool.video?.viewCount || 0;

      const likeCount =
        fetchedPool.video?.likeCount !== undefined &&
        fetchedPool.video?.likeCount !== null
          ? fetchedPool.video.likeCount
          : 0;

      const commentCount =
        fetchedPool.video?.commentCount !== undefined &&
        fetchedPool.video?.commentCount !== null
          ? fetchedPool.video.commentCount
          : 0;

      const lastSyncedAt = fetchedPool.video?.lastSyncedAt || null;

      setMetrics({
        viewCount,
        likeCount,
        commentCount,
        lastSyncedAt,
      });

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
      const isNetworkError =
        err?.message?.includes("Network Error") ||
        err?.message?.includes("Failed to fetch") ||
        err?.code === 0;

      // Handle 429 (Too Many Requests) specially - stop polling temporarily
      // Check both status and message for 429 errors
      const isRateLimitError =
        err?.status === 429 ||
        err?.code === 429 ||
        err?.message?.includes("429") ||
        err?.message?.includes("Too Many Requests");

      if (isRateLimitError) {
        // Stop polling on rate limit - wait longer before retrying
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // Set a much longer retry delay for rate limiting
        retryDelayRef.current = Math.min(
          retryDelayRef.current * 4,
          MAX_RETRY_DELAY
        );
        setIsPolling(false);
        // Don't log rate limit errors - they're expected when too many requests
        return;
      }

      // Only log errors if they're not network errors (which are often transient)
      if (!isNetworkError) {
        console.error("Error fetching pool metrics:", err);
      }

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
    // Skip if poolId is empty (for non-pool cards)
    if (!poolId || poolId.trim() === "") {
      return;
    }

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
  }, [poolId, fetchPoolData]);

  return {
    pool,
    metrics,
    isPolling,
    error,
    lastUpdated,
  };
}
