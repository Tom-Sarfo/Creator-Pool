import type { Route } from "./+types/creator-pools";
import { useState } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faPlus,
  faChartBar,
  faUsers,
  faUsersRectangle,
  faDollarSign,
  faTrophy,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import Tabs from "../components/Tabs";
import EnablePoolModal from "../components/EnablePoolModal";
import StatsCard from "../components/StatsCard";
import { extractDurationAndTimeRemaining } from "../lib/utils";
import { useAppContext } from "../contexts/AppContext";
import type { Pool } from "../contexts/AppContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pool Management - Creator Pool" },
    {
      name: "description",
      content: "Create and manage prediction pools for your YouTube videos.",
    },
  ];
}

export default function CreatorPools() {
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { pools, addPool, filteredPools, videos } = useAppContext();

  // Get filtered pools using context function
  const currentPools = filteredPools(
    activeTab as "active" | "settled" | "expired" | "all"
  );

  const tabs = [
    {
      id: "active",
      name: "Active",
      count: filteredPools("active").length,
    },
    {
      id: "settled",
      name: "Settled",
      count: filteredPools("settled").length,
    },
    {
      id: "expired",
      name: "Expired",
      count: filteredPools("expired").length,
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      settled: "bg-blue-100 text-blue-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`;
  };

  const getResultBadge = (result: string) => {
    const styles = {
      won: "bg-green-100 text-green-800",
      lost: "bg-red-100 text-red-800",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[result as keyof typeof styles]}`;
  };

  const handleCreatePoolClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Moved: extractDurationAndTimeRemaining to app/lib/utils.ts

  const handleCreatePool = (poolData: any) => {
    // Find the selected video from unified videos data
    const selectedVideo = videos.find((video) => video.id === poolData.videoId);

    // Extract video title from the selected video or use default
    const videoTitle =
      selectedVideo?.title || `Pool for Video ${poolData.videoId}`;

    // Extract target views and duration from question text
    const questionText =
      poolData.question?.text || "Will this video reach target views?";
    const targetMatch = questionText.match(/([\d,]+)\s*views?/i);
    const targetViews = targetMatch
      ? parseInt(targetMatch[1].replace(/,/g, ""))
      : 50000;

    // Extract duration and calculate time remaining
    const { duration, timeRemaining, totalDays } =
      extractDurationAndTimeRemaining(questionText);

    // According to PRD: Pools on unlisted videos should be ACTIVE immediately
    // to allow predictions before the video goes live
    const isUnlistedVideo =
      selectedVideo && selectedVideo.status === "unlisted";

    // Create new pool object - always active for prediction on unlisted videos
    const creatorPledgeAmount = poolData.pledgeAmount || 0;
    const newPool: Omit<Pool, "id"> = {
      title: videoTitle,
      videoTitle: videoTitle,
      videoId: poolData.videoId, // Store the video ID for tracking
      question: questionText,
      participants: 0,
      totalStake: creatorPledgeAmount, // Initially just the creator pledge
      creatorPledge: creatorPledgeAmount, // Track creator pledge separately
      predictorStakes: 0, // No predictor stakes initially
      timeRemaining: "10m", // Will be updated automatically by context
      status: "open", // Always open to allow predictions during unlisted stage
      createdAt: new Date().toISOString(),
      targetViews: targetViews,
      currentViews: 0,
      duration: totalDays,
      predictionWindow: 10, // 10 minutes for prediction window
      // Add additional properties based on the selected video if available
      ...(selectedVideo && {
        thumbnail: selectedVideo.thumbnail,
      }),
    };

    // Add pool to context state
    addPool(newPool);

    // Close modal after successful creation
    handleCloseModal();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Pool Management
            </h1>
            <p className="text-gray-600">
              Create and manage prediction pools for your YouTube videos.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleCreatePoolClick}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
              Create New Pool
            </button>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Active Pools"
          value={pools.filter((p) => p.status === "open").length}
          icon={faUsersRectangle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          size="small"
        />

        <StatsCard
          title="Total Participants"
          value={pools.reduce((sum, pool) => sum + pool.participants, 0)}
          icon={faUsers}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          size="small"
        />

        <StatsCard
          title="Total Staked"
          value={`$${pools.reduce((sum, pool) => sum + pool.totalStake, 0).toLocaleString()}`}
          icon={faDollarSign}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          size="small"
        />

        <StatsCard
          title="Total Earned"
          value={`$${pools
            .filter((p) => p.creatorEarnings)
            .reduce((sum, pool) => sum + (pool.creatorEarnings || 0), 0)
            .toFixed(2)}`}
          icon={faDollarSign}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
          size="small"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Pools list */}
      <div className="space-y-4">
        {currentPools.map((pool) => (
          <div
            key={pool.id}
            className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            {/* Status badges at the top right */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center space-x-1 sm:space-x-2">
              <span className={getStatusBadge(pool.status)}>{pool.status}</span>
              {pool.result && (
                <span className={getResultBadge(pool.result)}>
                  {pool.result}
                </span>
              )}
            </div>

            <div className="pr-16 sm:pr-24">
              {/* Title and question */}
              <div className="mb-3 pr-2">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 line-clamp-2 leading-tight">
                  {pool.videoTitle}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {pool.question}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Participants</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    {pool.participants}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Staked</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    ${pool.totalStake}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Target Views</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    {(pool.targetViews || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Views</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    {(pool.currentViews || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Time remaining */}
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  Time Remaining
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  {pool.timeRemaining}
                </p>
              </div>

              {/* Progress bar - extended to full width */}
              <div className="mb-4 -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2">
                  <span className="truncate mr-2">
                    {pool.status === "open"
                      ? "Progress to target"
                      : pool.status === "settled"
                        ? "Final progress"
                        : "Final progress"}
                  </span>
                  <span className="flex-shrink-0">
                    {Math.round(
                      ((pool.currentViews || 0) / (pool.targetViews || 1)) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className={`h-2 sm:h-3 rounded-full ${
                      pool.status === "open"
                        ? "bg-purple-600"
                        : pool.status === "settled"
                          ? "bg-green-600"
                          : "bg-gray-500"
                    }`}
                    style={{
                      width: `${Math.min(((pool.currentViews || 0) / (pool.targetViews || 1)) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Creator earnings for settled pools */}
              {pool.creatorEarnings && (
                <div className="mb-4 p-3 bg-green-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">
                      Creator Earnings
                    </span>
                    <span className="text-lg font-semibold text-green-800">
                      ${pool.creatorEarnings}
                    </span>
                  </div>
                </div>
              )}

              {/* Action buttons under progress bar */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 -mx-4 sm:mx-0 px-4 sm:px-0">
                <Link
                  to={`/creator/pool/${pool.id}?status=${pool.status}`}
                  className="bg-white text-gray-600 border border-gray-300 text-sm py-2 px-3 sm:px-4 rounded-md hover:bg-gray-50 transition-colors text-center w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">View</span>
                </Link>
                {pool.status === "open" && (
                  <Link
                    to={`/creator/pool/${pool.id}?status=active`}
                    className="bg-purple-600 text-white text-sm py-2 px-3 sm:px-4 rounded-md hover:bg-purple-700 transition-colors text-center w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">Manage Pool</span>
                    <span className="sm:hidden">Manage</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {currentPools.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon
            icon={faBullseye}
            className="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No pools found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "active"
              ? "Create your first prediction pool to get started."
              : activeTab === "settled"
                ? "No settled pools yet."
                : "No expired pools."}
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreatePoolClick}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Create New Pool
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom navigation hint */}
      <div className="lg:hidden mt-8 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700 text-center">
          <FontAwesomeIcon icon={faLightbulb} className="mr-1" />
          Tap on pool cards to view detailed information and manage settings
        </p>
      </div>

      {/* Enable Pool Modal */}
      <EnablePoolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={null}
        onEnablePool={handleCreatePool}
      />
    </div>
  );
}
