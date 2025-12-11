import type { Route } from "./+types/pool-detail";
import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCheckCircle,
  faQuestionCircle,
  faChartLine,
  faUsers,
  faDollarSign,
  faExternalLinkAlt,
  faInfoCircle,
  faArrowLeft,
  faBullseye,
  faTrophy,
  faUser,
  faShare,
  faEdit,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";
import { POOL_DETAIL_TABS, HOW_IT_WORKS_STEPS } from "../lib/constants";
import {
  calculateRemainingTime,
  isTimerUrgent,
  getPoolStatusColor,
  getPoolStatusLabel,
  parseISODuration,
  formatPoolQuestion,
  formatProbabilityAsPercentage,
  estimatePotentialPayout,
} from "../lib/utils";
import { useAppContext } from "../contexts/AppContext";
import { poolService } from "../services/pool.service";
import type { Pool, PoolResult } from "../lib/types";
import { PoolResult as PoolResultEnum } from "../lib/types";
import PlayButtonOverlay from "../components/PlayButtonOverlay";
import PredictionModal from "../components/PredictionModal";
import PoolDistribution from "../components/PoolDistribution";
import { useLivePoolMetrics } from "../hooks/useLivePoolMetrics";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Pool Detail - Creator Pool` },
    {
      name: "description",
      content: "View pool details and make your prediction.",
    },
  ];
}

export default function PoolDetailPage({ params }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [poolData, setPoolData] = useState<Pool | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const previousStatusRef = useRef<string | null>(null);

  const { user } = useAuth();
  const {
    getPoolById,
    getVideoById,
    getPredictionsByPoolId,
    addPrediction,
    addToast,
    refreshPools,
  } = useAppContext();

  const poolId = params.id;
  const initialPoolData = getPoolById(poolId) || poolData;

  // Use live metrics hook for real-time updates
  const {
    pool: livePool,
    metrics: liveMetrics,
    lastUpdated,
  } = useLivePoolMetrics(poolId);

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
  const mergedPoolData = livePool || poolData || initialPoolData;

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

  // Update current time every second for real-time timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Use current pool data or fallback
  const currentPoolData = mergedPoolData;

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

  // Show error if pool not found (only after we've tried fetching)
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
            to="/predictor/pools"
            className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Pools
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

  // Get all predictions for this pool
  const allPredictions = getPredictionsByPoolId(currentPoolData.id);

  // Get user's prediction for this pool
  const userPrediction = allPredictions.find(
    (p) => p.predictorId === (user?.id || "anonymous")
  );

  // Use backend status - always trust the server
  const poolStatus = currentPoolData.status || "open";

  // Normalize numeric inputs that may arrive as strings
  const toNumber = (value: unknown) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const parsed = parseFloat(value.replace(/,/g, ""));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (typeof value === "bigint") return Number(value);
    return 0;
  };

  // Use live metrics for currentViews if available
  const currentViews = Math.round(
    liveMetrics
      ? liveMetrics.viewCount
      : currentPoolData.currentViews !== undefined &&
          currentPoolData.currentViews !== null
        ? toNumber(currentPoolData.currentViews)
        : toNumber((videoData as any)?.viewCount ?? (videoData as any)?.views)
  );

  // Calculate progress similar to creator-pool-detail.tsx
  const targetViews = Math.round(toNumber(currentPoolData.targetViews));
  const progress =
    targetViews > 0
      ? Math.round(Math.min((currentViews / targetViews) * 100, 100) * 10) / 10
      : 0;

  // Calculate distribution metrics from actual stakes
  const yesStake = toNumber(currentPoolData.yesStake);
  const noStake = toNumber(currentPoolData.noStake);
  const predictorStakes = yesStake + noStake;
  const creatorPledge = toNumber(currentPoolData.creatorPledge);
  const yesStakers = toNumber(currentPoolData.yesCount);
  const noStakers = toNumber(currentPoolData.noCount);

  // Calculate distribution percentages from stake amounts, not probabilities
  let yesPercentage = 0;
  let noPercentage = 0;
  if (predictorStakes > 0) {
    yesPercentage = Math.round((yesStake / predictorStakes) * 100);
    noPercentage = 100 - yesPercentage;
  }

  // Total pool size includes both creator pledge and all predictor stakes
  const totalPoolSize = predictorStakes + creatorPledge;

  const pool = {
    ...currentPoolData,
    status: poolStatus, // Always use backend status
    title:
      currentPoolData.video?.title ||
      videoData?.title ||
      (currentPoolData as any).title ||
      (currentPoolData as any).videoTitle ||
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
      (currentPoolData as any).creatorVerified ||
      (videoData as any)?.creatorVerified ||
      false,
    creatorSubs:
      (currentPoolData as any).creatorSubs ||
      (videoData as any)?.creatorSubs ||
      "0 subs",
    thumbnail:
      (currentPoolData as any).thumbnail ||
      (currentPoolData as any).video?.thumbnail ||
      (videoData as any)?.thumbnail ||
      "https://via.placeholder.com/300x200?text=No+Thumbnail",
    category:
      (currentPoolData as any).category ||
      (videoData as any)?.category ||
      "general",
    question: currentPoolData.question || "Prediction question not available",
    targetViews,
    currentViews,
    progress, // Add progress calculation
    totalStake: totalPoolSize, // Total includes creator pledge + predictor stakes
    participants: currentPoolData.participants || 0, // Use backend participants
    creatorPledge: creatorPledge, // Creator's pledge amount
    predictorStakes: predictorStakes, // Total predictor stakes
    yesPercentage,
    noPercentage,
    yesPool: yesStake,
    noPool: noStake,
    yesStakers,
    noStakers,
    releaseDate: currentPoolData.createdAt
      ? new Date(currentPoolData.createdAt).toLocaleDateString()
      : "Unknown",
    expectedDuration: (videoData as any)?.duration
      ? parseISODuration((videoData as any).duration)
      : currentPoolData.trackingDurationDays
        ? currentPoolData.trackingDurationDays === 1
          ? "1 day"
          : `${currentPoolData.trackingDurationDays} days`
        : "Unknown duration",
    youtubeUrl: (videoData as any)?.id
      ? `https://youtube.com/watch?v=video${(videoData as any).id}`
      : "https://youtube.com/watch?v=example",
  };

  const handlePredictionSubmit = (prediction: {
    choice: "yes" | "no";
    stake: number;
  }) => {
    if (!currentPoolData) return;

    addPrediction({
      poolId: currentPoolData.id,
      predictorId: user?.id || "anonymous",
      choice: prediction.choice as any,
      stake: prediction.stake,
      result: "pending" as any,
    });

    addToast({
      type: "success",
      title: "Prediction Placed!",
      message: `You predicted ${prediction.choice.toUpperCase()} with $${prediction.stake}`,
      duration: 4000,
    });

    setShowPredictionModal(false);
  };

  const tabs = POOL_DETAIL_TABS;
  console.log("pool progress", pool);

  const predictionResult = userPrediction?.result;
  const showResultCard =
    pool.status === "settled" &&
    userPrediction &&
    predictionResult &&
    predictionResult !== "pending";
  const resultStake = showResultCard ? toNumber(userPrediction!.stake) : 0;
  const resultPayout =
    showResultCard && typeof userPrediction!.actualPayout !== "undefined"
      ? toNumber(userPrediction!.actualPayout)
      : null;
  const resultChoice = showResultCard ? userPrediction!.choice : null;
  const resultSettledAt = showResultCard ? userPrediction!.settledAt : null;
  const didWin = showResultCard && predictionResult === "won";

  // Calculate potential payout if user has a prediction
  const calculatedPotentialPayout = userPrediction
    ? userPrediction.potentialPayout !== null &&
      userPrediction.potentialPayout !== undefined
      ? userPrediction.potentialPayout
      : userPrediction.result === "pending" &&
          pool.status === "open" &&
          pool.totalStake > 0
        ? estimatePotentialPayout(
            toNumber(userPrediction.stake),
            userPrediction.choice === "yes"
              ? pool.yesPool || 0
              : pool.noPool || 0,
            pool.totalStake
          )
        : null
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
              <Link
                to="/predictor/pools"
                className="text-gray-500 hover:text-gray-700 flex-shrink-0 mt-1"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {pool.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                  by {pool.creator}
                </p>
              </div>
            </div>

            {/* Mobile: Stack actions horizontally, Desktop: Horizontal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium text-center sm:text-left ${getPoolStatusColor(pool.status)}`}
              >
                {getPoolStatusLabel(pool.status)}
              </span>

              {/* Action buttons - always horizontal layout */}
              <div className="flex flex-row space-x-2 sm:space-x-3">
                {!userPrediction && pool.status === "open" && (
                  <button
                    onClick={() => setShowPredictionModal(true)}
                    className="px-2 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <FontAwesomeIcon
                      icon={faBullseye}
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                    <span className="hidden sm:inline">Make Prediction</span>
                    <span className="sm:hidden">Predict</span>
                  </button>
                )}

                {userPrediction && (
                  <button
                    onClick={() => setShowPredictionModal(true)}
                    className="px-2 sm:px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                    <span className="hidden sm:inline">View My Prediction</span>
                    <span className="sm:hidden">My Prediction</span>
                  </button>
                )}

                <button className="px-2 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm flex-1 sm:flex-none">
                  <FontAwesomeIcon
                    icon={faShare}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="hidden sm:inline">Share Pool</span>
                  <span className="sm:hidden">Share</span>
                </button>
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
                    {tab.id === "stats" && "Stats"}
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
                {/* Video Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  {/* Mobile: Stack image and content vertically, Desktop: Side by side */}
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <div className="relative w-full sm:w-32 h-48 sm:h-24">
                      <img
                        src={pool.thumbnail}
                        alt={pool.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <PlayButtonOverlay />
                      <div className="absolute top-2 left-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPoolStatusColor(pool.status)}`}
                        >
                          {getPoolStatusLabel(pool.status)}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded text-xs flex items-center space-x-1 font-mono ${
                            pool.status === "open" &&
                            calculateRemainingTime(pool, currentTime) ===
                              "00:00"
                              ? "bg-red-600 text-white animate-pulse"
                              : pool.status === "open" &&
                                  isTimerUrgent(pool, currentTime)
                                ? "bg-orange-500 text-white animate-pulse"
                                : "bg-black bg-opacity-50 text-white"
                          }`}
                        >
                          <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                          <span className="font-bold">
                            {calculateRemainingTime(pool, currentTime)}
                          </span>
                        </span>
                      </div>
                    </div>
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
                          views
                        </span>
                        <span>Duration: {pool.expectedDuration}</span>
                        <span>Category: {pool.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {pool.creator}
                        </h4>
                        {pool.creatorVerified && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="w-5 h-5 text-cyan-500"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {pool.creatorSubs}
                      </p>
                    </div>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Subscribe
                    </button>
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
                        (currentPoolData as any).trackingDurationDays
                      )}
                    </p>

                    {/* Progress */}
                    {pool.targetViews > 0 && (
                      <div className="mb-2">
                        {/* Mobile: Stack stats vertically, Desktop: Side by side */}
                        <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600 mb-2">
                          <span>
                            Current Progress: {pool.progress.toFixed(1)}%
                          </span>

                          <span className="break-all sm:break-normal">
                            {Math.round(
                              pool.currentViews || 0
                            ).toLocaleString()}{" "}
                            /{" "}
                            {Math.round(pool.targetViews || 0).toLocaleString()}{" "}
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
                            style={{
                              width: `${Math.min(pool.progress, 100)}%`,
                            }}
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
                    )}
                  </div>

                  {/* Escrow Information */}
                  <div className="border-t pt-6 mt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="w-5 h-5 text-blue-600"
                      />
                      <h4 className="text-lg font-medium text-gray-900">
                        Escrow Status
                      </h4>
                    </div>
                    {pool.status !== "settled" &&
                    Number(pool.escrowedAmount || 0) > 0 ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900">
                              Total in Escrow
                            </span>
                            <span className="text-lg font-bold text-blue-700">
                              ${Number(pool.escrowedAmount || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-blue-600 mb-3">
                            Funds are securely held until pool settlement
                          </div>
                        </div>
                        <div className="space-y-2 border-t border-blue-200 pt-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              Creator Pledge
                            </span>
                            <span className="font-medium text-gray-900">
                              $
                              {Number(pool.escrowedCreatorPledge || 0).toFixed(
                                2
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              Predictor Stakes
                            </span>
                            <span className="font-medium text-gray-900">
                              $
                              {Number(
                                pool.escrowedPredictorStakes || 0
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : pool.status === "settled" ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              Settlement Details
                            </span>
                            <span className="text-xs text-gray-500">
                              Escrow cleared
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 border-t border-gray-200 pt-3">
                          {Number(pool.platformFeeCollected || 0) > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                Platform Fee (5%)
                              </span>
                              <span className="font-medium text-gray-900">
                                $
                                {Number(pool.platformFeeCollected || 0).toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          )}
                          {Number(pool.creatorRoyaltyCollected || 0) > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                Creator Royalty (1%)
                              </span>
                              <span className="font-medium text-gray-900">
                                $
                                {Number(
                                  pool.creatorRoyaltyCollected || 0
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* How It Works / Winner Card */}
                {pool.status === "settled" && currentPoolData.result ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4">
                    {/* Winning Side Indicator */}
                    <div
                      className={`rounded-lg p-4 ${
                        currentPoolData.result === PoolResultEnum.YES_WON
                          ? "bg-green-50 border border-green-200"
                          : currentPoolData.result === PoolResultEnum.NO_WON
                            ? "bg-red-50 border border-red-200"
                            : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <FontAwesomeIcon
                          icon={faTrophy}
                          className={`w-5 h-5 ${
                            currentPoolData.result === PoolResultEnum.YES_WON
                              ? "text-green-600"
                              : currentPoolData.result === PoolResultEnum.NO_WON
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {currentPoolData.result === PoolResultEnum.YES_WON
                            ? "YES Prediction Won"
                            : currentPoolData.result === PoolResultEnum.NO_WON
                              ? "NO Prediction Won"
                              : "Pool Settled"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {currentPoolData.result === PoolResultEnum.YES_WON
                          ? "The video reached its target views. YES predictors win."
                          : currentPoolData.result === PoolResultEnum.NO_WON
                            ? "The video did not reach its target views. NO predictors win."
                            : "The pool has been settled."}
                      </p>
                    </div>

                    {/* User's Prediction Result Card */}
                    {showResultCard && (
                      <div
                        className={`rounded-lg border p-4 ${
                          didWin
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              didWin
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={didWin ? faTrophy : faInfoCircle}
                              className="w-5 h-5"
                            />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-gray-900">
                              {didWin
                                ? "You won this pool!"
                                : "Your prediction didn't win"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {didWin
                                ? `Great call on your ${resultChoice?.toUpperCase()} prediction.`
                                : `Your ${resultChoice?.toUpperCase()} prediction didn't win this time.`}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-gray-700">
                            <span>Your stake</span>
                            <span className="font-medium text-gray-900">
                              ${resultStake.toLocaleString()}
                            </span>
                          </div>
                          {resultPayout !== null && resultPayout >= 0 && (
                            <div className="flex justify-between text-sm text-gray-700">
                              <span>
                                {didWin ? "Payout received" : "Returned amount"}
                              </span>
                              <span
                                className={`font-medium ${
                                  didWin ? "text-green-700" : "text-gray-800"
                                }`}
                              >
                                ${resultPayout.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            Settled on{" "}
                            {resultSettledAt
                              ? new Date(resultSettledAt).toLocaleString()
                              : "recently"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show message if user didn't make a prediction */}
                    {!userPrediction && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">
                          You didn't make a prediction on this pool.
                        </p>
                      </div>
                    )}
                  </div>
                ) : showResultCard ? (
                  <div
                    className={`bg-white rounded-lg border p-4 sm:p-6 ${
                      didWin ? "border-green-200" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          didWin
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={didWin ? faTrophy : faInfoCircle}
                          className="w-5 h-5"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {didWin ? "You won this pool!" : "Pool settled"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {didWin
                            ? `Great call on your ${resultChoice?.toUpperCase()} prediction.`
                            : `Your ${resultChoice?.toUpperCase()} prediction didn't win this time.`}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`rounded-lg p-4 space-y-3 ${
                        didWin
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Your stake</span>
                        <span className="font-medium text-gray-900">
                          ${resultStake.toLocaleString()}
                        </span>
                      </div>
                      {resultPayout !== null && resultPayout >= 0 && (
                        <div className="flex justify-between text-sm text-gray-700">
                          <span>
                            {didWin ? "Payout received" : "Returned amount"}
                          </span>
                          <span
                            className={`font-medium ${
                              didWin ? "text-green-700" : "text-gray-800"
                            }`}
                          >
                            ${resultPayout.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Settled on{" "}
                        {resultSettledAt
                          ? new Date(resultSettledAt).toLocaleString()
                          : "recently"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      How It Works
                    </h3>
                    <div className="space-y-4">
                      {HOW_IT_WORKS_STEPS.map((step) => (
                        <div
                          key={step.step}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-orange-600">
                              {step.step}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {step.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Pool Stats Tab */}
            {activeTab === "stats" && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                    <div className="flex flex-col items-center text-center space-y-3 md:flex-row md:items-center md:text-left md:space-y-0 md:space-x-4">
                      <div className="p-3 bg-cyan-100 rounded-lg">
                        <FontAwesomeIcon
                          icon={faDollarSign}
                          className="w-6 h-6 text-cyan-600"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Pool Size</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          ${pool.totalStake.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                    <div className="flex flex-col items-center text-center space-y-3 md:flex-row md:items-center md:text-left md:space-y-0 md:space-x-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="w-6 h-6 text-green-600"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Total Predictors
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          {pool.participants.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 col-span-2 md:col-span-1">
                    <div className="flex flex-col items-center text-center space-y-3 md:flex-row md:items-center md:text-left md:space-y-0 md:space-x-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <FontAwesomeIcon
                          icon={faChartLine}
                          className="w-6 h-6 text-orange-600"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Average Stake</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          $
                          {pool.participants > 0
                            ? Math.round(pool.totalStake / pool.participants)
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Predictors */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Top Predictors
                  </h3>
                  <div className="space-y-3">
                    {allPredictions
                      .sort((a, b) => b.stake - a.stake)
                      .slice(0, 10)
                      .map((prediction, index) => (
                        <div
                          key={prediction.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                              {index === 0 && (
                                <FontAwesomeIcon
                                  icon={faCrown}
                                  className="w-4 h-4 text-yellow-500"
                                />
                              )}
                              {index > 0 && (
                                <span className="text-sm font-bold text-gray-600">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {typeof prediction.predictor === "object" &&
                                prediction.predictor?.name
                                  ? prediction.predictor.name
                                  : typeof prediction.predictor === "string"
                                    ? prediction.predictor
                                    : "Anonymous"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(
                                  prediction.predictedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${
                                prediction.choice === "yes"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {prediction.choice.toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${prediction.stake}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar - Mobile: Show after main content, Desktop: Show on right */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* My Prediction Card */}
            {userPrediction && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  My Prediction
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Your Choice</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        userPrediction.choice === "yes"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {userPrediction.choice.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Stake Amount</span>
                    <span className="font-medium">${userPrediction.stake}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userPrediction.result === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : userPrediction.result === "won"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {userPrediction.result === "pending"
                        ? "Active"
                        : userPrediction.result}
                    </span>
                  </div>
                  {calculatedPotentialPayout !== null &&
                    userPrediction.result === "pending" && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Potential Payout</span>
                        <span className="font-medium text-green-600">
                          ${calculatedPotentialPayout.toFixed(2)}
                        </span>
                      </div>
                    )}
                  {pool.status === "open" && (
                    <button
                      onClick={() => setShowPredictionModal(true)}
                      className="w-full mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                      Edit Prediction
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Pool Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pool Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pool Size</span>
                  <span className="font-medium text-gray-900">
                    ${pool.totalStake.toLocaleString()}
                  </span>
                </div>
                {pool.creatorPledge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Creator Pledge</span>
                    <span className="font-medium text-gray-900">
                      ${pool.creatorPledge.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Predictors</span>
                  <span className="font-medium text-gray-900">
                    {pool.participants.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Remaining</span>
                  <span className="font-medium text-gray-900">
                    {calculateRemainingTime(pool, currentTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium text-gray-900">5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Creator Royalty</span>
                  <span className="font-medium text-gray-900">1%</span>
                </div>
              </div>

              {pool.status !== "open" && (
                <div className="border-t pt-4">
                  <PoolDistribution
                    yesPercentage={pool.yesPercentage || 0}
                    noPercentage={pool.noPercentage || 0}
                    yesPool={pool.yesPool || 0}
                    noPool={pool.noPool || 0}
                    yesStakers={pool.yesStakers || 0}
                    noStakers={pool.noStakers || 0}
                  />
                </div>
              )}
            </div>

            {/*  */}
          </div>
        </div>
      </div>

      {/* Prediction Modal */}
      {showPredictionModal && (
        <PredictionModal
          isOpen={showPredictionModal}
          onClose={() => setShowPredictionModal(false)}
          pool={pool}
          preselectedChoice={userPrediction?.choice}
          onSubmit={handlePredictionSubmit}
        />
      )}
    </div>
  );
}
