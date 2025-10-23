import type { Route } from "./+types/pool-detail";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "@clerk/react-router";
import {
  faPlay,
  faCalendar,
  faClock,
  faCheckCircle,
  faEye,
  faHeart,
  faComment,
  faThumbsUp,
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
  faCoins,
  faBullseye,
  faExclamationTriangle,
  faTrophy,
  faUser,
  faShare,
  faEdit,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../contexts/AppContext";
import type { Pool, Prediction } from "../contexts/AppContext";
import PlayButtonOverlay from "../components/PlayButtonOverlay";
import PredictionModal from "../components/PredictionModal";
import {
  calculateRemainingTime,
  isTimerUrgent,
  calculateDynamicOdds,
  calculatePotentialPayout,
} from "../lib/utils";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Pool Detail - Creator Pool` },
    {
      name: "description",
      content: "View pool details and make your prediction.",
    },
  ];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800";
    case "awaiting_release":
      return "bg-yellow-100 text-yellow-800";
    case "live_tracking":
      return "bg-cyan-100 text-cyan-800";
    case "closed":
      return "bg-orange-100 text-orange-800";
    case "settled":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "open":
      return "Open";
    case "awaiting_release":
      return "Awaiting Release";
    case "live_tracking":
      return "Live Tracking";
    case "closed":
      return "Closed";
    case "settled":
      return "Settled";
    default:
      return status;
  }
};

export default function PoolDetailPage({ params }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [predictionFilter, setPredictionFilter] = useState("all");
  const [predictionSort, setPredictionSort] = useState("recent");
  const [currentTime, setCurrentTime] = useState(new Date());

  const { user } = useUser();
  const {
    getPoolById,
    getVideoById,
    getPredictionsByPoolId,
    addPrediction,
    addToast,
    calculatePoolOdds,
  } = useAppContext();

  const poolId = parseInt(params.id);
  const poolData = getPoolById(poolId);
  const videoData = poolData?.videoId ? getVideoById(poolData.videoId) : null;

  // Update current time every second for real-time timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show error if pool not found
  if (!poolData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pool Not Found
          </h2>
          <p className="text-gray-600">
            The pool you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/predictor/pools"
            className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Pools
          </Link>
        </div>
      </div>
    );
  }

  // Get all predictions for this pool
  const allPredictions = getPredictionsByPoolId(poolId);

  // Get user's prediction for this pool
  const userPrediction = allPredictions.find(
    (p) => p.predictorId === (user?.id || "anonymous")
  );

  // Calculate pool metrics
  const odds =
    poolData.odds ||
    calculateDynamicOdds(poolData.yesStake || 0, poolData.noStake || 0);
  const yesPercentage =
    poolData.yesStake && poolData.noStake
      ? Math.round(
          (poolData.yesStake / (poolData.yesStake + poolData.noStake)) * 100
        )
      : 50;
  const noPercentage = 100 - yesPercentage;

  const pool = {
    ...poolData,
    title: poolData.title || poolData.videoTitle || "Untitled Pool",
    creator: poolData.creator || videoData?.creator || "Unknown Creator",
    creatorVerified:
      poolData.creatorVerified || videoData?.creatorVerified || false,
    creatorSubs: poolData.creatorSubs || videoData?.creatorSubs || "0 subs",
    thumbnail: poolData.thumbnail || videoData?.thumbnail || "",
    category: poolData.category || videoData?.category || "general",
    question: poolData.question || "Prediction question not available",
    targetViews: poolData.targetViews || 0,
    currentViews: poolData.currentViews || 0,
    odds,
    yesPercentage,
    noPercentage,
    releaseDate: poolData.createdAt
      ? new Date(poolData.createdAt).toLocaleDateString()
      : "Unknown",
    expectedDuration: videoData?.duration || "Unknown duration",
    youtubeUrl: videoData?.id
      ? `https://youtube.com/watch?v=video${videoData.id}`
      : "https://youtube.com/watch?v=example",
  };

  // Filter and sort predictions
  const filteredPredictions = allPredictions
    .filter((prediction) => {
      switch (predictionFilter) {
        case "yes":
          return prediction.choice === "yes";
        case "no":
          return prediction.choice === "no";
        case "high":
          return prediction.stake >= 100;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (predictionSort) {
        case "stake":
          return b.stake - a.stake;
        case "chronological":
          return (
            new Date(a.predictedAt).getTime() -
            new Date(b.predictedAt).getTime()
          );
        default: // recent
          return (
            new Date(b.predictedAt).getTime() -
            new Date(a.predictedAt).getTime()
          );
      }
    });

  const handlePredictionSubmit = (prediction: {
    choice: "yes" | "no";
    stake: number;
  }) => {
    if (!poolData) return;

    // Add prediction via context
    addPrediction({
      poolId: poolData.id,
      predictorId: user?.id || "anonymous",
      predictorName: user?.fullName || user?.firstName || "Anonymous User",
      choice: prediction.choice,
      stake: prediction.stake,
      predictedAt: new Date().toISOString(),
      result: "pending",
    });

    // Show success toast
    addToast({
      type: "success",
      title: "Prediction Placed!",
      message: `You predicted ${prediction.choice.toUpperCase()} with $${prediction.stake}`,
      duration: 4000,
    });

    setShowPredictionModal(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", count: null },
    { id: "stats", label: "Pool Stats", count: null },
    {
      id: "predictions",
      label: "All Predictions",
      count: allPredictions.length,
    },
  ];

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

            {/* Mobile: Stack actions vertically, Desktop: Horizontal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium text-center sm:text-left ${getStatusColor(pool.status)}`}
              >
                {getStatusLabel(pool.status)}
              </span>

              {/* Action buttons - responsive sizing */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {!userPrediction && pool.status === "open" && (
                  <button
                    onClick={() => setShowPredictionModal(true)}
                    className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                  >
                    <FontAwesomeIcon icon={faBullseye} className="w-4 h-4" />
                    <span className="hidden sm:inline">Make Prediction</span>
                    <span className="sm:hidden">Predict</span>
                  </button>
                )}

                {userPrediction && (
                  <button
                    onClick={() => setShowPredictionModal(true)}
                    className="px-3 sm:px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                    <span className="hidden sm:inline">View My Prediction</span>
                    <span className="sm:hidden">My Prediction</span>
                  </button>
                )}

                <button className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 text-sm">
                  <FontAwesomeIcon icon={faShare} className="w-4 h-4" />
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
                    {tab.id === "predictions" && "Predictions"}
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
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
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pool.status)}`}
                        >
                          {getStatusLabel(pool.status)}
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
                          Target: {pool.targetViews.toLocaleString()} views
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
                    <p className="text-gray-700 mb-4">{pool.question}</p>

                    {/* Progress */}
                    {pool.targetViews > 0 && (
                      <div className="mb-2">
                        {/* Mobile: Stack stats vertically, Desktop: Side by side */}
                        <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600 mb-2">
                          <span>
                            Current Progress:{" "}
                            {Math.round(
                              (pool.currentViews / pool.targetViews) * 100
                            )}
                            %
                          </span>
                          <span className="break-all sm:break-normal">
                            {pool.currentViews.toLocaleString()} /{" "}
                            {pool.targetViews.toLocaleString()} views
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${
                              pool.currentViews / pool.targetViews > 1
                                ? "bg-green-500"
                                : "bg-orange-600"
                            }`}
                            style={{
                              width: `${Math.min((pool.currentViews / pool.targetViews) * 100, 100)}%`,
                            }}
                          ></div>
                          {pool.currentViews / pool.targetViews > 1 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                                Target Exceeded!
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* How It Works */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    How It Works
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-orange-600">
                          1
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Make Your Prediction
                        </h4>
                        <p className="text-sm text-gray-600">
                          Choose YES or NO and stake an amount. Higher stakes
                          mean higher potential payouts.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-orange-600">
                          2
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Wait for Results
                        </h4>
                        <p className="text-sm text-gray-600">
                          The video will be tracked for the specified timeframe
                          to determine the outcome.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-orange-600">
                          3
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Get Paid</h4>
                        <p className="text-sm text-gray-600">
                          If you're correct, you'll receive your stake back plus
                          a share of the losing side's stakes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Pool Stats Tab */}
            {activeTab === "stats" && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-cyan-100 rounded-lg">
                        <FontAwesomeIcon
                          icon={faDollarSign}
                          className="w-6 h-6 text-cyan-600"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Total Pool Size</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${pool.totalStake.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="w-6 h-6 text-green-600"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">
                          Total Predictors
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {pool.participants.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <FontAwesomeIcon
                          icon={faChartLine}
                          className="w-6 h-6 text-orange-600"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Average Stake</p>
                        <p className="text-2xl font-bold text-gray-900">
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
                                {prediction.predictorName}
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

            {/* All Predictions Tab */}
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
                        <option value="all">All Predictions</option>
                        <option value="yes">YES Only</option>
                        <option value="no">NO Only</option>
                        <option value="high">High Stakes ($100+)</option>
                      </select>
                      <select
                        value={predictionSort}
                        onChange={(e) => setPredictionSort(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="recent">Recent First</option>
                        <option value="stake">Stake Amount</option>
                        <option value="chronological">Chronological</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredPredictions.length > 0 ? (
                      filteredPredictions.map((prediction) => (
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
                                {prediction.predictorName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(
                                  prediction.predictedAt
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p
                                className={`font-medium ${prediction.choice === "yes" ? "text-green-600" : "text-red-600"}`}
                              >
                                {prediction.choice.toUpperCase()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Prediction
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-gray-900">
                                ${prediction.stake}
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
                          No Predictions Found
                        </h3>
                        <p className="text-gray-500">
                          No predictions match your current filter criteria.
                        </p>
                      </div>
                    )}
                  </div>

                  {filteredPredictions.length > 0 && (
                    <div className="mt-6 flex justify-center">
                      <button className="px-6 py-2 text-sm text-orange-600 hover:text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-50">
                        Load More Predictions
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
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
                  {userPrediction.potentialPayout && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Potential Payout</span>
                      <span className="font-medium text-green-600">
                        ${userPrediction.potentialPayout}
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
                  <span className="font-medium">
                    ${pool.totalStake.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Predictors</span>
                  <span className="font-medium">
                    {pool.participants.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Remaining</span>
                  <span className="font-medium">
                    {calculateRemainingTime(pool, currentTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Creator Royalty</span>
                  <span className="font-medium">1%</span>
                </div>
              </div>
            </div>

            {/* Prediction Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Prediction Distribution
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600">
                      YES ({pool.yesPercentage}%)
                    </span>
                    <span className="text-green-600">
                      ${(pool.yesStake || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${pool.yesPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {pool.yesCount || 0} stakers
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-600">
                      NO ({pool.noPercentage}%)
                    </span>
                    <span className="text-red-600">
                      ${(pool.noStake || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${pool.noPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {pool.noCount || 0} stakers
                  </p>
                </div>
              </div>
            </div>
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
