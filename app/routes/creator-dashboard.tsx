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
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
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
import type { Pool } from "../lib/types";
import YouTubeConnectionButton from "../components/YouTubeConnectionButton";
import { youtubeService } from "../services/youtube.service";
import { API_CONFIG } from "../lib/api-config";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
    addToast,
    checkYouTubeConnection,
    refreshVideos,
    youtubeChannel,
    isYouTubeLoading,
  } = useAppContext();

  // Handle YouTube connection success query parameter
  useEffect(() => {
    const youtubeParam = searchParams.get("youtube");
    const youtubeError = searchParams.get("youtube_error");
    const messageParam = searchParams.get("message");

    // Handle message parameter from backend redirect
    if (messageParam) {
      // If we have a message but no youtube param, still show success
      if (!youtubeParam) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("youtube", "connected");
        newSearchParams.delete("message"); // Remove message, we'll show it in toast
        navigate(
          `/creator${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
          { replace: true }
        );
        // Show the message in a toast
        addToast({
          title: "YouTube Connected",
          message: decodeURIComponent(messageParam),
          type: "success",
        });
        return;
      }
    }

    if (youtubeParam === "connected") {
      setShowSuccessMessage(true);

      // Remove query parameter from URL first (but keep it in memory for the async operations)
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("youtube");
      navigate(
        `/creator${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
        { replace: true }
      );

      // Refresh YouTube connection status and sync videos
      // Add a small delay to ensure backend has processed the OAuth callback
      const connectionTimer = setTimeout(async () => {
        try {
          await checkYouTubeConnection();

          addToast({
            title: "YouTube Connected",
            message: "YouTube channel connected successfully!",
            type: "success",
          });

          try {
            await syncYouTubeVideos();
          } catch (error) {
            console.error("Failed to sync videos after connection:", error);
            addToast({
              title: "Sync Warning",
              message:
                "Connected but failed to sync videos. Please try syncing manually.",
              type: "warning",
            });
          }
        } catch (error) {
          console.error("Failed to verify YouTube connection:", error);
          addToast({
            title: "Connection Error",
            message:
              "Failed to verify YouTube connection. Please refresh the page or try connecting again.",
            type: "error",
          });
        }
      }, 1000); // Wait 1 second for backend to process

      // Auto-hide success message after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => {
        clearTimeout(connectionTimer);
        clearTimeout(hideTimer);
      };
    }

    if (youtubeError) {
      const errorMessages: Record<string, string> = {
        no_code: "No authorization code received from YouTube",
        callback_failed: "Failed to complete YouTube connection",
      };
      addToast({
        title: "Connection Error",
        message:
          errorMessages[youtubeError] || "Failed to connect YouTube channel",
        type: "error",
      });
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("youtube_error");
      navigate(
        `/creator${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
        { replace: true }
      );
    }
  }, [
    searchParams,
    navigate,
    addToast,
    syncYouTubeVideos,
    checkYouTubeConnection,
  ]);

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

  console.log("pools", pools);

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

    const newPool = {
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
      currentViews:
        selectedVideoData?.viewCount || selectedVideoData?.views || 0,
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
  // console.log("videos", videos);

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

      {/* YouTube Connection Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="w-5 h-5 text-green-600"
            />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                YouTube Channel Connected!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Your YouTube channel has been successfully connected. You can
                now sync your videos.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-600 hover:text-green-800"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* YouTube Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                YouTube Channel Connection
              </h3>
            </div>

            {isYouTubeConnected && youtubeChannel ? (
              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  ✅ Connected to:{" "}
                  <span className="font-semibold text-gray-900">
                    {youtubeChannel.name ||
                      youtubeChannel.channelName ||
                      "YouTube Channel"}
                  </span>
                </p>
                {youtubeChannel.subscriberCount && (
                  <p className="text-xs text-gray-500">
                    {youtubeChannel.subscriberCount.toLocaleString()}{" "}
                    subscribers
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                {isYouTubeConnected
                  ? "Your YouTube channel is connected. Sync to get your latest videos."
                  : "Connect your YouTube channel to sync unlisted videos and create prediction pools."}
              </p>
            )}

            {/* Status dots and debug text removed for cleaner UI */}
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {isYouTubeConnected ? (
              <>
                <button
                  onClick={syncYouTubeVideos}
                  disabled={isYouTubeLoading}
                  className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon
                    icon={faSync}
                    className={`w-4 h-4 ${isYouTubeLoading ? "animate-spin" : ""}`}
                  />
                  <span>{isYouTubeLoading ? "Syncing..." : "Sync Videos"}</span>
                </button>
              </>
            ) : (
              <>
                <YouTubeConnectionButton />
              </>
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
            .reduce((sum, pool) => sum + Number(pool.creatorEarnings ?? 0), 0)
            .toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
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
