import type { Route } from "./+types/creator-pool-detail";
import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCheckCircle,
  faQuestionCircle,
  faChartLine,
  faUsers,
  faDollarSign,
  faPause,
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
  faArrowUp,
  faArrowLeft,
  faFlag,
  faBan,
  faExclamationTriangle,
  faUser,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";
import {
  STATUS_COLORS,
  STATUS_TIMELINE,
  STATUS_LABELS,
  generateTimelineForStatus,
  CREATOR_POOL_DETAIL_TABS,
  PREDICTION_FILTER_OPTIONS,
  ANALYTICS_COMING_SOON_FEATURES,
  type PoolStatus,
} from "../lib/constants";
import { PoolStatus as PoolStatusEnum } from "../lib/types";
import {
  calculatePoolMetrics,
  transformPredictionsToDisplay,
  parseISODuration,
  formatPoolQuestion,
} from "../lib/utils";
import { useAppContext } from "../contexts/AppContext";
import { poolService } from "../services/pool.service";
import type { Pool, PoolResult } from "../lib/types";
import { PoolResult as PoolResultEnum } from "../lib/types";
import Stepper from "../components/Stepper";
import PoolDistribution from "../components/PoolDistribution";
import { useLivePoolMetrics } from "../hooks/useLivePoolMetrics";

const getStatusColor = (status: PoolStatus) =>
  STATUS_COLORS[status] || "bg-gray-100 text-gray-800";

const getStatusLabel = (status: PoolStatus) => STATUS_LABELS[status] || status;

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `My Pool - Creator Pool` },
    {
      name: "description",
      content: "View your pool details and performance metrics.",
    },
  ];
}

export default function CreatorPoolDetailPage({
  params,
}: Route.ComponentProps) {
  // Keep poolId as string - pool IDs are strings in the system
  const poolId = params.id;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [predictionFilter, setPredictionFilter] = useState("all");
  const [poolData, setPoolData] = useState<Pool | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const previousStatusRef = useRef<string | null>(null);

  const {
    getPoolById,
    pools,
    getVideoById,
    getPredictionsByPoolId,
    transitionPoolToNextStage,
    addToast,
    refreshPools,
  } = useAppContext();
  const { user } = useAuth();
  const statusParam = searchParams.get("status") || "active";

  // Use live metrics hook for real-time updates
  const {
    pool: livePool,
    metrics: liveMetrics,
    lastUpdated,
  } = useLivePoolMetrics(poolId);

  // Find pool in context - try both exact match and string comparison
  const initialPoolData =
    getPoolById(poolId) ||
    pools.find((p) => p.id === poolId || p.id?.toString() === poolId);

  // Debug: Log pool lookup if not found
  useEffect(() => {
    if (!initialPoolData && pools.length > 0) {
      console.debug(
        `Pool ${poolId} not found in context. Available pool IDs:`,
        pools.map((p) => p.id).slice(0, 5)
      );
    }
  }, [poolId, initialPoolData, pools.length]);

  // Initial data fetch on mount - use context data if available, otherwise fetch from API
  useEffect(() => {
    // If we have context data, use it immediately and try to refresh from API in background
    if (initialPoolData) {
      setPoolData(initialPoolData);
      previousStatusRef.current = initialPoolData.status;
      setIsLoading(false);

      // Still try to fetch fresh data in background (non-blocking)
      const fetchFreshData = async () => {
        try {
          const response = await poolService.getPoolById(poolId);
          // Handle both response formats: { pool: ... } or direct pool object
          const pool = response?.pool || (response as any);
          if (pool && pool.id && pool.status) {
            setPoolData(pool);
            previousStatusRef.current = pool.status;
            refreshPools();
          }
        } catch (error: any) {
          // Silently fail if we have context data - just log it
          console.warn(
            "Could not refresh pool data from API, using cached data:",
            error?.message
          );
        }
      };

      fetchFreshData();
      return;
    }

    // If no context data, try to fetch from API (blocking)
    const fetchInitialPool = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await poolService.getPoolById(poolId);

        // Handle both response formats: { pool: ... } or direct pool object
        const fetchedPool = response?.pool || (response as any);

        // Check if we have a valid pool object
        if (!fetchedPool || !fetchedPool.id || !fetchedPool.status) {
          throw new Error("Invalid response from server");
        }

        setPoolData(fetchedPool);
        previousStatusRef.current = fetchedPool.status;
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching pool:", error);
        setFetchError(error?.message || "Failed to load pool data");
        setIsLoading(false);
        // Only show error if we don't have context data
        addToast({
          type: "error",
          title: "Failed to Load Pool",
          message: "Could not load pool data from the server.",
          duration: 5000,
        });
      }
    };

    fetchInitialPool();
  }, [poolId, initialPoolData?.id, addToast, refreshPools]);

  // Merge live pool data with local pool data
  const currentPoolData = livePool || poolData || initialPoolData;

  // Show status change notifications when live pool status changes
  // Also refresh context to ensure other pages (pools list, dashboard) reflect status changes
  useEffect(() => {
    if (!livePool) return;

    const previousStatus = previousStatusRef.current;

    if (previousStatus && previousStatus !== livePool.status) {
      // Refresh context pools list to reflect status changes immediately
      // This ensures pools list and dashboard show updated status without manual refresh
      refreshPools();

      const statusMessages: Record<string, Record<string, string>> = {
        live_tracking: {
          open: "Video is now public! Pool is live tracking.",
          awaiting_release: "Video is now public! Pool is live tracking.",
        },
        awaiting_release: {
          open: "Prediction window closed. Waiting for video release.",
        },
        closed: {
          live_tracking: "Tracking period ended.",
        },
        settled: {
          closed: "Pool has been settled! Check your results.",
        },
      };

      const message = statusMessages[livePool.status]?.[previousStatus];
      if (message) {
        addToast({
          type: "info",
          title: "Pool Status Updated",
          message,
          duration: 5000,
        });
      }
    }

    previousStatusRef.current = livePool.status;
  }, [livePool, addToast, refreshPools]);

  // Show loading state while fetching
  if (isLoading && !currentPoolData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading pool data...</p>
        </div>
      </div>
    );
  }

  // Early return if pool not found (only after we've tried fetching)
  if (!currentPoolData && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pool Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The pool you're looking for doesn't exist or has been removed.
          </p>
          {fetchError && (
            <p className="text-sm text-red-600 mb-4">Error: {fetchError}</p>
          )}
          <Link
            to="/creator/pools"
            className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to My Pools
          </Link>
        </div>
      </div>
    );
  }

  // At this point, currentPoolData is guaranteed to be defined (we checked above)
  if (!currentPoolData) return null;

  // Get video data after we have pool data
  const videoData = currentPoolData.videoId
    ? getVideoById(currentPoolData.videoId)
    : null;

  // Use backend status - always trust the server
  const poolStatus = currentPoolData.status || "open";
  const statusData =
    STATUS_TIMELINE[poolStatus as keyof typeof STATUS_TIMELINE] ||
    STATUS_TIMELINE.open;

  // Use live metrics if available, otherwise use calculated metrics
  const baseMetrics = calculatePoolMetrics(currentPoolData, videoData);
  const metrics = liveMetrics
    ? {
        ...baseMetrics,
        currentViews: Math.round(liveMetrics.viewCount),
        progress:
          currentPoolData.targetViews > 0
            ? Math.min(
                (Math.round(liveMetrics.viewCount) /
                  currentPoolData.targetViews) *
                  100,
                100
              )
            : 0,
      }
    : baseMetrics;

  console.log("currentPoolData distribution:", {
    yesStake: currentPoolData.yesStake,
    noStake: currentPoolData.noStake,
    yesCount: currentPoolData.yesCount,
    noCount: currentPoolData.noCount,
  });
  console.log("metrics distribution:", {
    yesPercentage: metrics.yesPercentage,
    noPercentage: metrics.noPercentage,
    yesPool: metrics.yesPool,
    noPool: metrics.noPool,
    yesStakers: metrics.yesStakers,
    noStakers: metrics.noStakers,
  });

  const pool = {
    ...metrics,
    id: currentPoolData.id,
    // Explicitly set distribution values from metrics to ensure they're correct
    yesPercentage: metrics.yesPercentage || 0,
    noPercentage: metrics.noPercentage || 0,
    yesPool: metrics.yesPool || 0,
    noPool: metrics.noPool || 0,
    yesStakers: metrics.yesStakers || 0,
    noStakers: metrics.noStakers || 0,
    title:
      currentPoolData.title ||
      currentPoolData.videoTitle ||
      videoData?.title ||
      "Untitled Pool",
    creator:
      typeof currentPoolData.creator === "object" &&
      currentPoolData.creator?.name
        ? currentPoolData.creator.name
        : typeof currentPoolData.creator === "string"
          ? currentPoolData.creator
          : typeof videoData?.creator === "object" && videoData.creator?.name
            ? videoData.creator.name
            : typeof videoData?.creator === "string"
              ? videoData.creator
              : "Unknown Creator",
    creatorVerified:
      currentPoolData.creatorVerified || videoData?.creatorVerified || false,
    creatorSubs:
      currentPoolData.creatorSubs || videoData?.creatorSubs || "0 subs",
    thumbnail:
      (currentPoolData as any).thumbnail ||
      (currentPoolData as any).video?.thumbnail ||
      videoData?.thumbnail ||
      "https://via.placeholder.com/300x200?text=No+Thumbnail",
    category: currentPoolData.category || videoData?.category || "general",
    status: poolStatus, // Always use backend status
    timeRemaining: currentPoolData.timeRemaining || statusData.timeRemaining,
    totalStake: metrics.totalPoolAmount || 0, // Use the calculated total pool amount
    participants: currentPoolData.participants || 0,
    odds: currentPoolData.odds,
    question: currentPoolData.question || "Prediction question not available",
    targetViews: currentPoolData.targetViews || 0,
    targetTimeframe: currentPoolData.trackingDurationDays
      ? `${currentPoolData.trackingDurationDays} days`
      : "7 days",
    description:
      currentPoolData.title ||
      currentPoolData.videoTitle ||
      videoData?.title ||
      "Pool description",
    youtubeUrl: videoData?.id
      ? `https://youtube.com/watch?v=video${videoData.id}`
      : "https://youtube.com/watch?v=example",
    youtubeId: `video${videoData?.id || currentPoolData.videoId || "unknown"}`,
    releaseDate: currentPoolData.createdAt
      ? new Date(currentPoolData.createdAt).toLocaleDateString()
      : "Unknown",
    expectedDuration: videoData?.duration
      ? parseISODuration(videoData.duration)
      : "Unknown duration",
    poolDuration: currentPoolData.trackingDurationDays
      ? `${currentPoolData.trackingDurationDays} days`
      : "7 days",
    createdAt: currentPoolData.createdAt || new Date().toISOString(),
    closesAt: currentPoolData.createdAt
      ? new Date(
          new Date(currentPoolData.createdAt).getTime() +
            (currentPoolData.trackingDurationDays || 7) * 24 * 60 * 60 * 1000
        ).toISOString()
      : new Date().toISOString(),
    publishedAt: videoData?.uploadDate || new Date().toISOString(),
    pledgeStatus: statusData.pledgeStatus,
    pledgeDeposited: statusData.pledgeDeposited,
    creatorWalletBalance: 5000,
    currentLikes: videoData?.likeCount || videoData?.likes || 0,
    currentComments: Math.round(
      (videoData?.commentCount || videoData?.likes || 0) * 0.06
    ),
    likeRatio: (() => {
      const likes = videoData?.likeCount || videoData?.likes || 0;
      const views = videoData?.viewCount || videoData?.views || 0;
      if (likes > 0 && views > 0) {
        return `${Math.round((likes / views) * 100)}%`;
      }
      return "0%";
    })(),
    timeline: generateTimelineForStatus(
      currentPoolData.status || "open",
      currentPoolData
    ),
    dailyStats: [
      {
        date: "Dec 16",
        views: Math.round((metrics.currentViews || 0) * 0.25),
        predictions: Math.round((currentPoolData.participants || 0) * 0.17),
      },
      {
        date: "Dec 17",
        views: Math.round((metrics.currentViews || 0) * 0.38),
        predictions: Math.round((currentPoolData.participants || 0) * 0.22),
      },
      {
        date: "Dec 18",
        views: Math.round((metrics.currentViews || 0) * 0.49),
        predictions: Math.round((currentPoolData.participants || 0) * 0.24),
      },
      {
        date: "Dec 19",
        views: metrics.currentViews || 0,
        predictions: currentPoolData.participants || 0,
      },
    ],
  };

  // console.log("currentPoolData", currentPoolData);

  const poolPredictions = getPredictionsByPoolId(poolId);
  const allPredictions = transformPredictionsToDisplay(poolPredictions);
  const hasPredictions = allPredictions.length > 0;

  const tabs = CREATOR_POOL_DETAIL_TABS.map((tab) => ({
    ...tab,
    count: tab.id === "predictions" ? allPredictions.length : null,
  }));
  console.log("pool", pool);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0 mt-1"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  Pool Details
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                  Video: {pool.title}
                </p>
              </div>
            </div>

            {/* Mobile: Stack actions horizontally, Desktop: Horizontal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium text-center sm:text-left ${getStatusColor(pool.status)}`}
              >
                {getStatusLabel(pool.status)}
              </span>

              {/* Action buttons - always horizontal layout */}
              <div className="flex flex-row space-x-2 sm:space-x-3">
                {pool.status === "open" && (
                  <button className="px-2 sm:px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm flex-1 sm:flex-none">
                    <FontAwesomeIcon
                      icon={faPause}
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                    <span className="hidden sm:inline">Pause Pool</span>
                    <span className="sm:hidden">Pause</span>
                  </button>
                )}

                {/* Manual transition button for testing */}
                {pool.status !== "settled" && (
                  <button
                    onClick={() => transitionPoolToNextStage(poolId)}
                    className="px-2 sm:px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                    <span className="hidden sm:inline">Next Stage</span>
                    <span className="sm:hidden">Next</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 sm:space-x-8 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === "overview" && "Overview"}
                    {tab.id === "predictions" && "Predictions"}
                    {tab.id === "analytics" && "Analytics"}
                    {tab.id === "settings" && "Settings"}
                  </span>
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content - Mobile: Show first, Desktop: Show second */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-1">
            {/* Tab Content */}
            {activeTab === "overview" && (
              <>
                {/* Pool Timeline */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Pool Timeline
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Progress</span>
                    </div>
                  </div>

                  {/* Convert timeline data to Stepper format */}
                  <Stepper
                    steps={pool.timeline.map((phase, index) => ({
                      id: `step-${index}`,
                      title: phase.phase,
                      description: phase.description,
                      date: phase.date,
                      completed: phase.completed,
                      icon:
                        phase.icon === "check"
                          ? "check"
                          : phase.icon === "play"
                            ? "play"
                            : "clock",
                    }))}
                    orientation="horizontal"
                    className="hidden sm:block"
                  />

                  {/* Mobile vertical stepper */}
                  <Stepper
                    steps={pool.timeline.map((phase, index) => ({
                      id: `step-${index}`,
                      title: phase.phase,
                      description: phase.description,
                      date: phase.date,
                      completed: phase.completed,
                      icon:
                        phase.icon === "check"
                          ? "check"
                          : phase.icon === "play"
                            ? "play"
                            : "clock",
                    }))}
                    orientation="vertical"
                    className="block sm:hidden"
                  />
                </div>

                {/* Video Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  {/* Mobile: Stack image and content vertically, Desktop: Side by side */}
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <img
                      src={pool.thumbnail}
                      alt={pool.title}
                      className="w-full sm:w-32 h-48 sm:h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                        <a
                          href={pool.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-600 hover:text-cyan-800 flex items-center space-x-1 text-sm"
                        >
                          <FontAwesomeIcon
                            icon={faExternalLinkAlt}
                            className="w-4 h-4"
                          />
                          <span>View on YouTube</span>
                        </a>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                        {pool.title}
                      </h3>
                      {/* Mobile: Stack info vertically, Desktop: Wrap */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <span className="break-words">
                          Target:{" "}
                          {Math.round(pool.targetViews || 0).toLocaleString()}{" "}
                          views in {pool.targetTimeframe}
                        </span>
                        <span>Duration: {pool.poolDuration}</span>
                        <span>Category: {pool.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="border-t pt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="w-5 h-5 text-orange-600"
                      />
                      <h4 className="text-lg font-medium text-gray-900">
                        Prediction Question
                      </h4>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {formatPoolQuestion(
                        pool.question || "",
                        pool.targetViews || 0,
                        currentPoolData.trackingDurationDays
                      )}
                    </p>

                    {/* Progress */}
                    <div className="mb-2">
                      {/* Mobile: Stack stats vertically, Desktop: Side by side */}
                      <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600 mb-2">
                        <span>
                          Current Progress: {pool.progress.toFixed(1)}%
                        </span>
                        <span className="break-all sm:break-normal">
                          {Math.round(pool.currentViews || 0).toLocaleString()}{" "}
                          / {Math.round(pool.targetViews || 0).toLocaleString()}{" "}
                          views
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            pool.progress > 100
                              ? "bg-green-500"
                              : "bg-orange-600"
                          }`}
                          style={{ width: `${Math.min(pool.progress, 100)}%` }}
                        ></div>
                        {pool.progress > 100 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                              Target Exceeded!
                            </span>
                          </div>
                        )}
                      </div>
                      {lastUpdated && (
                        <div className="mt-2 text-xs text-gray-500">
                          Last updated: {lastUpdated.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Predictions Tab */}
            {activeTab === "predictions" && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      All Predictions
                    </h3>
                    <div className="flex items-center space-x-4">
                      <select
                        value={predictionFilter}
                        onChange={(e) => setPredictionFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                      >
                        {PREDICTION_FILTER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="w-4 h-4"
                        />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {hasPredictions ? (
                      allPredictions.map((prediction) => (
                        <div
                          key={prediction.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <FontAwesomeIcon
                                icon={faUser}
                                className="w-5 h-5 text-orange-600"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {prediction.user}
                              </p>
                              <p className="text-sm text-gray-500">
                                {prediction.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p
                                className={`font-medium ${prediction.prediction === "YES" ? "text-green-600" : "text-red-600"}`}
                              >
                                {prediction.prediction}
                              </p>
                              <p className="text-sm text-gray-500">
                                Prediction
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-gray-900">
                                ${prediction.amount}
                              </p>
                              <p className="text-sm text-gray-500">Stake</p>
                            </div>
                            {prediction.potentialPayout && (
                              <div className="text-center">
                                <p className="font-medium text-green-600">
                                  ${prediction.potentialPayout}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Potential
                                </p>
                              </div>
                            )}
                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-400 hover:text-red-600">
                                <FontAwesomeIcon
                                  icon={faFlag}
                                  className="w-4 h-4"
                                />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-cyan-600">
                                <FontAwesomeIcon
                                  icon={faBan}
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="w-12 h-12 text-gray-400 mx-auto mb-4"
                        />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Predictions Yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                          This pool hasn't received any predictions yet. Share
                          your pool to get started!
                        </p>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          Share Pool
                        </button>
                      </div>
                    )}
                  </div>

                  {hasPredictions && (
                    <div className="mt-6 flex justify-center">
                      <button className="px-6 py-2 text-sm text-orange-600 hover:text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-50">
                        Load More Predictions
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-center min-h-[40vh]">
                  <div className="text-center max-w-md mx-auto">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon
                          icon={faChartLine}
                          className="w-10 h-10 text-orange-600"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Analytics Coming Soon
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Detailed analytics for this pool are being developed.
                        You'll soon be able to track performance metrics,
                        participant engagement, and revenue insights.
                      </p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4 text-left">
                      <h4 className="font-semibold text-orange-900 mb-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        What's Coming
                      </h4>
                      <ul className="space-y-1 text-sm text-orange-800">
                        {ANALYTICS_COMING_SOON_FEATURES.map(
                          (feature, index) => (
                            <li key={index}>• {feature}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Pool Configuration
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pool Question
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        rows={3}
                        defaultValue={formatPoolQuestion(
                          pool.question || "",
                          pool.targetViews || 0,
                          currentPoolData.trackingDurationDays
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Views
                        </label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          defaultValue={pool.targetViews}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeframe (days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="14"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          defaultValue={7}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="w-5 h-5 text-yellow-600"
                        />
                        <div>
                          <p className="font-medium text-yellow-800">
                            Danger Zone
                          </p>
                          <p className="text-sm text-yellow-700">
                            These actions cannot be undone
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Close Pool Early
                      </button>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Right Sidebar - Mobile: Show after main content, Desktop: Show on right */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* Pool Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pool Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex">
                  <span className="text-gray-600">
                    Total Pool Size:{" "}
                    <span className="font-medium">
                      ${pool.totalStake.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Total Predictors:{" "}
                    <span className="font-medium">
                      {pool.participants.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Predictor Stakes:{" "}
                    <span className="font-medium">
                      ${pool.predictorStakes.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Creator Pledge:{" "}
                    <span className="font-medium">
                      ${pool.creatorPledge.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Platform Fee (5%):{" "}
                    <span className="font-medium">
                      ${pool.platformFee.toFixed(2)}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Your Royalty (1%):{" "}
                    <span className="font-medium">
                      ${pool.creatorRoyalty.toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Pledge Status */}
              {pool.creatorPledge > 0 && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Pledge Status</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Auto-Deduct
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Automatic Deduction</span>
                    </div>
                    <p className="text-xs">
                      Your pledge of ${pool.creatorPledge.toLocaleString()} was
                      automatically deducted from your wallet when you enabled
                      the pool and added to the pool for disbursement to
                      winners.
                    </p>
                  </div>
                </div>
              )}

              {/* Pool Distribution */}
              <PoolDistribution
                yesPercentage={metrics.yesPercentage || 0}
                noPercentage={metrics.noPercentage || 0}
                yesPool={metrics.yesPool || 0}
                noPool={metrics.noPool || 0}
                yesStakers={metrics.yesStakers || 0}
                noStakers={metrics.noStakers || 0}
              />

              {/* Winning Side Indicator - Show only for settled pools */}
              {poolStatus === PoolStatusEnum.SETTLED &&
                currentPoolData.result && (
                  <div className="border-t pt-4 mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Pool Result</h4>
                    </div>
                    <div
                      className={`rounded-lg p-4 ${
                        currentPoolData.result === PoolResultEnum.YES_WON
                          ? "bg-green-50 border border-green-200"
                          : currentPoolData.result === PoolResultEnum.NO_WON
                            ? "bg-red-50 border border-red-200"
                            : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon
                          icon={faTrophy}
                          className={`w-6 h-6 ${
                            currentPoolData.result === PoolResultEnum.YES_WON
                              ? "text-green-600"
                              : currentPoolData.result === PoolResultEnum.NO_WON
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {currentPoolData.result === PoolResultEnum.YES_WON
                              ? "YES Prediction Won"
                              : currentPoolData.result === PoolResultEnum.NO_WON
                                ? "NO Prediction Won"
                                : "Result Pending"}
                          </p>
                          {currentPoolData.result !==
                            PoolResultEnum.PENDING && (
                            <p className="text-sm text-gray-600 mt-1">
                              {currentPoolData.result === PoolResultEnum.YES_WON
                                ? "The video reached its target views. YES predictors win."
                                : "The video did not reach its target views. NO predictors win."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
