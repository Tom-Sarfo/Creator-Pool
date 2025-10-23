import type { Route } from "./+types/creator-dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faPlay,
  faUsersRectangle,
  faCoins,
  faSync,
  faVideo,
  faBullseye,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  CREATOR_STATS,
  CREATOR_VIDEO_TABS,
  CREATOR_DASHBOARD_EMPTY_STATE_MESSAGES,
} from "../lib/constants";
import {
  extractDurationAndTimeRemaining,
  getPoolStatusColor,
  getPoolStatusLabel,
  formatNumber,
} from "../lib/utils";
import Tabs from "../components/Tabs";
import EnablePoolModal from "../components/EnablePoolModal";
import StatsCard from "../components/StatsCard";
import VideoCard from "../components/VideoCard";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import { useAppContext } from "../contexts/AppContext";
import type { Pool } from "../contexts/AppContext";
import YouTubeConnectionButton from "../components/YouTubeConnectionButton";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const stats = CREATOR_STATS;

  const {
    addPool,
    pools,
    filteredPools,
    updatePool,
    videos,
    syncYouTubeVideos,
    isYouTubeConnected,
    lastYouTubeSync,
  } = useAppContext();

  const getVideosWithPoolStatus = () => {
    return videos.map((video) => {
      const anyPool = pools.find((pool) => pool.videoId === video.id);
      const isActivePool =
        anyPool &&
        ["open", "awaiting_release", "live_tracking", "closed"].includes(
          anyPool.status
        );
      const poolStatus = anyPool ? anyPool.status : "available";

      return {
        ...video,
        status: anyPool ? anyPool.status : video.status, // Use pool status if pool exists
        poolStatus: isActivePool ? "active" : poolStatus,
        hasPool: !!anyPool,
        poolData: anyPool,
        effectiveStatus: isActivePool ? "active" : video.status,
        isYouTubeVideo: video.isYouTubeVideo || false,
      };
    });
  };

  const getFilteredVideos = () => {
    const videosWithStatus = getVideosWithPoolStatus();

    switch (activeTab) {
      case "active":
        return videosWithStatus.filter(
          (video) => video.poolStatus === "active"
        );
      case "settled":
        return videosWithStatus.filter(
          (video) => video.hasPool && video.poolData?.status === "settled"
        );
      case "unlisted":
        return videosWithStatus.filter(
          (video) => video.status === "unlisted" && !video.hasPool
        );
      default:
        return videosWithStatus;
    }
  };

  const allFilteredVideos = getFilteredVideos();
  const totalPages = Math.ceil(allFilteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredVideos = allFilteredVideos.slice(startIndex, endIndex);
  const videosWithStatus = getVideosWithPoolStatus();

  const activeVideoCount = videosWithStatus.filter(
    (video) => video.poolStatus === "active"
  ).length;
  const unlistedVideoCount = videosWithStatus.filter(
    (video) => video.status === "unlisted" && !video.hasPool
  ).length;
  const settledVideoCount = videosWithStatus.filter(
    (video) => video.hasPool && video.poolData?.status === "settled"
  ).length;

  const videoTabs = CREATOR_VIDEO_TABS.map((tab) => ({
    ...tab,
    count:
      tab.id === "all"
        ? videos.length
        : tab.id === "active"
          ? activeVideoCount
          : tab.id === "settled"
            ? settledVideoCount
            : tab.id === "unlisted"
              ? unlistedVideoCount
              : 0,
  }));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const getEmptyStateConfig = (tabId: string) => {
    const iconMap = {
      all: faVideo,
      active: faBullseye,
      settled: faTrophy,
      unlisted: faEyeSlash,
    };

    return {
      icon: iconMap[tabId as keyof typeof iconMap] || faVideo,
      message:
        CREATOR_DASHBOARD_EMPTY_STATE_MESSAGES[
          tabId as keyof typeof CREATOR_DASHBOARD_EMPTY_STATE_MESSAGES
        ] || "No items found",
    };
  };

  const handleEnablePoolClick = (video: any) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handleEnablePool = (poolData: any) => {
    const selectedVideoData = poolData.videoId
      ? videos.find((video) => video.id === poolData.videoId)
      : selectedVideo;

    const videoTitle =
      selectedVideoData?.title ||
      (selectedVideo
        ? selectedVideo.title
        : `Pool for Video ${poolData.videoId}`);

    const questionText =
      poolData.question?.text || "Will this video reach target views?";
    const targetMatch = questionText.match(/([\d,]+)\s*views?/i);
    const targetViews = targetMatch
      ? parseInt(targetMatch[1].replace(/,/g, ""))
      : 50000;

    const { duration, timeRemaining, totalDays } =
      extractDurationAndTimeRemaining(questionText);

    const isUnlistedVideo =
      selectedVideoData && selectedVideoData.status === "unlisted";

    const newPool: Omit<Pool, "id"> = {
      title: videoTitle,
      videoTitle: videoTitle,
      videoId: poolData.videoId,
      question: questionText,
      participants: 0,
      totalStake: poolData.pledgeAmount || 0,
      creatorPledge: poolData.pledgeAmount || 0,
      predictorStakes: 0,
      timeRemaining: "10m",
      status: "open",
      createdAt: new Date().toISOString(),
      targetViews: targetViews,
      currentViews: selectedVideoData?.views || 0,
      duration: totalDays,
      predictionWindow: 10,
      ...(selectedVideoData && {
        thumbnail: selectedVideoData.thumbnail,
        creator: selectedVideoData.creator,
        creatorVerified: selectedVideoData.creatorVerified,
        creatorSubs: selectedVideoData.creatorSubs,
        category: selectedVideoData.category,
      }),
    };

    addPool(newPool);
    handleCloseModal();
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8 bg-gray-50 min-h-screen w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Creator Hub
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your prediction pools and earnings
        </p>
      </div>

      {/* YouTube Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              YouTube Channel Connection
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              {isYouTubeConnected
                ? "Your YouTube channel is connected. Sync to get your latest videos."
                : "Connect your YouTube channel to sync unlisted videos and create prediction pools."}
            </p>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <div
                className={`w-2 h-2 rounded-full ${isYouTubeConnected ? "bg-green-500" : "bg-yellow-500"}`}
              ></div>
              <span>
                {isYouTubeConnected
                  ? `Connected${lastYouTubeSync ? ` • Last synced: ${new Date(lastYouTubeSync).toLocaleString()}` : ""}`
                  : "Ready to connect"}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {isYouTubeConnected ? (
              <button
                onClick={syncYouTubeVideos}
                className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center space-x-2 text-sm"
              >
                <FontAwesomeIcon icon={faSync} className="w-4 h-4" />
                <span>Sync Videos</span>
              </button>
            ) : (
              <YouTubeConnectionButton />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Total Videos"
          value={videos.length}
          icon={faPlay}
          iconColor="text-cyan-600"
          iconBgColor="bg-cyan-100"
          size="large"
          square={true}
        />

        <StatsCard
          title="Active Pools"
          value={filteredPools("active").length}
          icon={faUsersRectangle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          size="large"
          square={true}
        />

        <StatsCard
          title="Total Pledged Amount"
          value={`$${pools.reduce((sum, pool) => sum + pool.totalStake, 0).toLocaleString()}`}
          icon={faCoins}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          size="large"
          square={true}
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
          square={true}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="px-4 sm:px-6 py-4">
          <Tabs
            tabs={videoTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Video List */}
        {filteredVideos.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onEnablePoolClick={handleEnablePoolClick}
                getPoolStatusColor={getPoolStatusColor}
                getPoolStatusLabel={getPoolStatusLabel}
                formatNumber={formatNumber}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={getEmptyStateConfig(activeTab).icon}
            title="No videos found"
            message={getEmptyStateConfig(activeTab).message}
            actionText={activeTab === "all" ? "Connect YouTube" : undefined}
            onAction={activeTab === "all" ? undefined : undefined}
          />
        )}

        {filteredVideos.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={allFilteredVideos.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <EnablePoolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={selectedVideo}
        onEnablePool={handleEnablePool}
      />
    </div>
  );
}
