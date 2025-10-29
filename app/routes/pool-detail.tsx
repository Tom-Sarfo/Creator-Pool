import type { Route } from "./+types/pool-detail";
import { useState, useEffect } from "react";
import { Link, useSearchParams  } from "react-router";
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
import { POOL_DETAIL_TABS, HOW_IT_WORKS_STEPS } from "../lib/constants";
import {
  calculateRemainingTime,
  isTimerUrgent,
  calculateDynamicOdds,
  calculatePotentialPayout,
  getPoolStatusColor,
  getPoolStatusLabel,
} from "../lib/utils";
import { useAppContext } from "../contexts/AppContext";
import PlayButtonOverlay from "../components/PlayButtonOverlay";
import PredictionModal from "../components/PredictionModal";

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

  const { user } = useAuth();
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

  const handlePredictionSubmit = (prediction: {
    choice: "yes" | "no";
    stake: number;
  }) => {
    if (!poolData) return;

    addPrediction({
      poolId: poolData.id,
      predictorId: user?.id || "anonymous",
      predictorName: user?.fullName || user?.firstName || "Anonymous User",
      choice: prediction.choice,
      stake: prediction.stake,
      predictedAt: new Date().toISOString(),
      result: "pending",
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
