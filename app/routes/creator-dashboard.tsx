import type { Route } from "./+types/creator-dashboard";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faPlay,
  faEye,
  faHeart,
  faCalendar,
  faEllipsisV,
  faPlus,
  faUsersRectangle,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { CREATOR_STATS } from "../lib/constants";
import { extractDurationAndTimeRemaining } from "../lib/utils";
import Tabs from "../components/Tabs";
import EnablePoolModal from "../components/EnablePoolModal";
import StatsCard from "../components/StatsCard";
import { useAppContext } from "../contexts/AppContext";
import type { Pool } from "../contexts/AppContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Creator Dashboard - Creator Pool" },
    {
      name: "description",
      content: "Overview of your YouTube videos and prediction pools.",
    },
  ];
}

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const stats = CREATOR_STATS;

  const { addPool, pools, filteredPools, updatePool, videos } = useAppContext();

  // Get videos with their pool status based on actual pools data
  const getVideosWithPoolStatus = () => {
    return videos.map((video) => {
      // Find if this video has any pool
      const anyPool = pools.find((pool) => pool.videoId === video.id);

      // Check if pool is in active states (open to closed)
      const isActivePool =
        anyPool &&
        ["open", "awaiting_release", "live_tracking", "closed"].includes(
          anyPool.status
        );

      // Use the actual pool status if there is one, otherwise videos without pools are available for pool creation
      const poolStatus = anyPool ? anyPool.status : "available";

      return {
        ...video,
        poolStatus: isActivePool ? "active" : poolStatus,
        hasPool: !!anyPool,
        poolData: anyPool,
        // Override the original status for display purposes
        effectiveStatus: isActivePool ? "active" : video.status,
      };
    });
  };

  // Filter videos based on active tab
  const getFilteredVideos = () => {
    const videosWithStatus = getVideosWithPoolStatus();

    switch (activeTab) {
      case "active":
        return videosWithStatus.filter(
          (video) => video.poolStatus === "active"
        );
      case "settled":
        // Show videos with settled pools
        return videosWithStatus.filter(
          (video) => video.hasPool && video.poolData?.status === "settled"
        );
      case "unlisted":
        // Show videos that are available for pool creation (unlisted without pools)
        return videosWithStatus.filter(
          (video) => video.poolStatus === "available"
        );
      default:
        return videosWithStatus;
    }
  };

  const filteredVideos = getFilteredVideos();
  const videosWithStatus = getVideosWithPoolStatus();

  const activeVideoCount = videosWithStatus.filter(
    (video) => video.poolStatus === "active"
  ).length;
  const unlistedVideoCount = videosWithStatus.filter(
    (video) => video.poolStatus === "available"
  ).length;
  const settledVideoCount = videosWithStatus.filter(
    (video) => video.hasPool && video.poolData?.status === "settled"
  ).length;

  const getPoolStatusColor = (poolStatus: string) => {
    switch (poolStatus) {
      case "open":
        return "bg-green-100 text-green-800";
      case "awaiting_release":
        return "bg-yellow-100 text-yellow-800";
      case "live_tracking":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-orange-100 text-orange-800";
      case "settled":
        return "bg-purple-100 text-purple-800";
      case "available":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPoolStatusLabel = (poolStatus: string) => {
    switch (poolStatus) {
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
      case "available":
        return "Available for Pool";
      default:
        return poolStatus;
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  const formatLikes = (likes: number) => {
    if (likes >= 1000000) {
      return (likes / 1000000).toFixed(1) + "M";
    } else if (likes >= 1000) {
      return (likes / 1000).toFixed(1) + "K";
    }
    return likes.toString();
  };

  // Tab data for the reusable Tabs component
  const videoTabs = [
    {
      id: "all",
      name: "All Videos",
      count: videos.length,
    },
    {
      id: "active",
      name: "Active Pool",
      count: activeVideoCount,
    },
    {
      id: "settled",
      name: "Settled",
      count: settledVideoCount,
    },
    {
      id: "unlisted",
      name: "Unlisted",
      count: unlistedVideoCount,
    },
  ];

  const handleEnablePoolClick = (video: any) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Moved: extractDurationAndTimeRemaining to app/lib/utils.ts

  const handleEnablePool = (poolData: any) => {
    // Find the selected video from unified videos data if videoId is provided
    const selectedVideoData = poolData.videoId
      ? videos.find((video) => video.id === poolData.videoId)
      : selectedVideo;

    // Get video title from the selected video or use default
    const videoTitle =
      selectedVideoData?.title ||
      (selectedVideo
        ? selectedVideo.title
        : `Pool for Video ${poolData.videoId}`);

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

    const isUnlistedVideo =
      selectedVideoData && selectedVideoData.status === "unlisted";

    // Create new pool object - always active for prediction on unlisted videos
    const newPool: Omit<Pool, "id"> = {
      title: videoTitle,
      videoTitle: videoTitle,
      videoId: poolData.videoId, // Store the video ID for tracking
      question: questionText,
      participants: 0,
      totalStake: poolData.pledgeAmount || 0,
      timeRemaining: "10m", // Will be updated automatically by context
      status: "open", // Always open to allow predictions during unlisted stage
      createdAt: new Date().toISOString(),
      targetViews: targetViews,
      currentViews: 0,
      duration: totalDays,
      predictionWindow: 10, // 10 minutes for prediction window
      // Add additional properties based on the selected video if available
      ...(selectedVideoData && {
        thumbnail: selectedVideoData.thumbnail,
      }),
    };

    // Add pool to context state
    addPool(newPool);

    // Close modal after successful creation
    handleCloseModal();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Creator Hub
        </h1>
        <p className="text-gray-600">
          Manage your prediction pools and earnings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatsCard
          title="Total Videos"
          value={videos.length}
          icon={faPlay}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          size="large"
        />

        <StatsCard
          title="Active Pools"
          value={filteredPools("active").length}
          icon={faUsersRectangle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          size="large"
        />

        <StatsCard
          title="Total Pledged Amount"
          value={`$${pools.reduce((sum, pool) => sum + pool.totalStake, 0).toLocaleString()}`}
          icon={faCoins}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          size="large"
        />

        <StatsCard
          title="Total Royalties Earned"
          value={`$${pools
            .filter((p) => p.creatorEarnings)
            .reduce((sum, pool) => sum + (pool.creatorEarnings || 0), 0)
            .toFixed(2)}`}
          icon={faTrophy}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
          size="large"
        />
      </div>

      {/* Video List Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="px-4 sm:px-6 py-4">
          <Tabs
            tabs={videoTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Video List */}
        <div className="divide-y divide-gray-200">
          {filteredVideos.map((video) => (
            <div key={video.id} className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Video Thumbnail */}
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-12 sm:w-20 sm:h-14 bg-gray-200 rounded-md overflow-hidden relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Duration overlay */}
                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 rounded-tl">
                      {video.duration}
                    </div>
                    {/* Unlisted badge */}
                    {video.status === "unlisted" && (
                      <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-1 rounded-br">
                        Unlisted
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {video.title}
                  </h3>

                  {/* Video Stats */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <FontAwesomeIcon
                        icon={faEye}
                        className="w-3 h-3 flex-shrink-0"
                      />
                      <span className="truncate">
                        {formatViews(video.views)} views
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="w-3 h-3 flex-shrink-0"
                      />
                      <span className="truncate">
                        {formatLikes(video.likes)} likes
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="w-3 h-3 flex-shrink-0"
                      />
                      <span className="truncate">{video.uploadDate}</span>
                    </div>
                  </div>

                  {/* Pool Status and Action */}
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      {video.hasPool && video.poolData && (
                        <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getPoolStatusColor(video.poolData.status)}`}
                          >
                            {getPoolStatusLabel(video.poolData.status)}
                          </span>
                          <span className="text-xs text-gray-600 break-words">
                            {video.poolData.status === "settled" ? (
                              <>
                                Target reached • +$
                                {video.poolData.creatorEarnings || 0} earned
                              </>
                            ) : (
                              <>
                                ${video.poolData.totalStake.toLocaleString()}{" "}
                                pool • {video.poolData.participants} predictions
                                {video.poolData.timeRemaining && (
                                  <>
                                    {" "}
                                    • {video.poolData.timeRemaining} remaining
                                  </>
                                )}
                              </>
                            )}
                          </span>
                        </div>
                      )}
                      {!video.hasPool && (
                        <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getPoolStatusColor("available")}`}
                          >
                            Available for Pool
                          </span>
                          <span className="text-xs text-gray-600">
                            Perfect for predictions
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button and Menu */}
                    <div className="flex items-center space-x-2 sm:ml-4 flex-shrink-0">
                      {video.hasPool && video.poolData && (
                        <Link
                          to={`/creator/pool/${video.poolData.id}?status=${video.poolData.status}`}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                            video.poolData.status === "settled"
                              ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                              : "bg-purple-600 text-white hover:bg-purple-700"
                          }`}
                        >
                          <span className="hidden sm:inline">
                            {video.poolData.status === "settled"
                              ? "View Results"
                              : "View Pool"}
                          </span>
                          <span className="sm:hidden">
                            {video.poolData.status === "settled"
                              ? "Results"
                              : "View"}
                          </span>
                        </Link>
                      )}
                      {!video.hasPool && (
                        <button
                          onClick={() => handleEnablePoolClick(video)}
                          className="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1 whitespace-nowrap"
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="w-4 h-4 flex-shrink-0"
                          />
                          <span className="hidden sm:inline">
                            Enable Prediction Pool
                          </span>
                          <span className="sm:hidden">Enable Pool</span>
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                        <FontAwesomeIcon
                          icon={faEllipsisV}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar for Active Pools */}
                  {video.hasPool &&
                    video.poolData &&
                    [
                      "open",
                      "awaiting_release",
                      "live_tracking",
                      "closed",
                    ].includes(video.poolData.status) && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>
                            Progress to{" "}
                            {video.poolData.targetViews?.toLocaleString() ||
                              "target"}{" "}
                            views
                          </span>
                          <span>
                            {Math.round(
                              ((video.poolData.currentViews || 0) /
                                (video.poolData.targetViews || 1)) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(((video.poolData.currentViews || 0) / (video.poolData.targetViews || 1)) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing 1-{filteredVideos.length} of {videos.length} videos
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                2
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                3
              </button>
              <span className="px-2 text-sm text-gray-500">...</span>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                42
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enable Pool Modal */}
      <EnablePoolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={selectedVideo}
        onEnablePool={handleEnablePool}
      />
    </div>
  );
}
