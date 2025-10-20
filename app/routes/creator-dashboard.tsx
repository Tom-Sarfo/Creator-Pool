import type { Route } from "./+types/creator-dashboard";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faChartBar,
  faDollarSign,
  faTrophy,
  faPlay,
  faEye,
  faHeart,
  faCalendar,
  faSync,
  faEllipsisV,
  faPlus,
  faLayerGroup,
  faUsersRectangle,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { RECENT_VIDEOS, CREATOR_STATS } from "../lib/constants";
import Tabs from "../components/Tabs";
import EnablePoolModal from "../components/EnablePoolModal";

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
  const [selectedVideo, setSelectedVideo] = useState(null);
  const stats = CREATOR_STATS;
  const videos = RECENT_VIDEOS;

  // Filter videos based on active tab
  const getFilteredVideos = () => {
    switch (activeTab) {
      case "active":
        return videos.filter(
          (video) =>
            video.poolStatus === "active" || video.poolStatus === "closing"
        );
      case "unlisted":
        return videos.filter((video) => video.status === "unlisted");
      default:
        return videos;
    }
  };

  const filteredVideos = getFilteredVideos();

  const activeVideoCount = videos.filter(
    (video) => video.poolStatus === "active" || video.poolStatus === "closing"
  ).length;
  const unlistedVideoCount = videos.filter(
    (video) => video.status === "unlisted"
  ).length;

  const getPoolStatusColor = (poolStatus: string) => {
    switch (poolStatus) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closing":
        return "bg-yellow-100 text-yellow-800";
      case "settled":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      count: stats.totalVideos,
    },
    {
      id: "active",
      name: "Active Pool",
      count: activeVideoCount,
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

  const handleEnablePool = (poolData: any) => {
    // Handle pool creation/enabling logic here
    console.log("Enabling pool:", poolData);
    // You can add API call to create the pool here
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
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
        {/* Total Videos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faPlay}
                  className="w-6 h-6 text-blue-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Videos</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalVideos}
              </p>
            </div>
          </div>
        </div>

        {/* Active Pools */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUsersRectangle}
                  className="w-6 h-6 text-green-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Active Pools</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.activePools}
              </p>
            </div>
          </div>
        </div>

        {/* Total Pledged Amount */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCoins}
                  className="w-6 h-6 text-purple-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Total Pledged Amount
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ${stats.totalPledgedAmount}
              </p>
            </div>
          </div>
        </div>

        {/* Total Royalties Earned */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="w-6 h-6 text-red-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Total Royalties Earned
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ${stats.totalRoyaltiesEarned}
              </p>
            </div>
          </div>
        </div>
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
              <div className="flex items-start space-x-4">
                {/* Video Thumbnail */}
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-12 bg-gray-200 rounded-md overflow-hidden relative">
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
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {video.title}
                  </h3>

                  {/* Video Stats */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                      <span>{formatViews(video.views)} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faHeart} className="w-3 h-3" />
                      <span>{formatLikes(video.likes)} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                      <span>{video.uploadDate}</span>
                    </div>
                  </div>

                  {/* Pool Status and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {video.poolStatus === "active" && (
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPoolStatusColor(video.poolStatus)}`}
                          >
                            Active Pool
                          </span>
                          <span className="text-xs text-gray-600">
                            ${video.poolStake.toLocaleString()} pool •{" "}
                            {video.poolParticipants} predictions
                          </span>
                        </div>
                      )}
                      {video.poolStatus === "closing" && (
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPoolStatusColor(video.poolStatus)}`}
                          >
                            Pool Closing Soon
                          </span>
                          <span className="text-xs text-gray-600">
                            ${video.poolStake.toLocaleString()} pool •{" "}
                            {video.timeRemaining}
                          </span>
                        </div>
                      )}
                      {video.poolStatus === "settled" && (
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPoolStatusColor(video.poolStatus)}`}
                          >
                            Pool Settled
                          </span>
                          <span className="text-xs text-gray-600">
                            Target reached • +${video.earnedAmount} earned
                          </span>
                        </div>
                      )}
                      {video.poolStatus === "ready" && (
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPoolStatusColor(video.poolStatus)}`}
                          >
                            Ready for Pool
                          </span>
                          <span className="text-xs text-gray-600">
                            Perfect for predictions
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button and Menu */}
                    <div className="flex items-center space-x-2 ml-4">
                      {video.poolStatus === "active" && (
                        <Link
                          to={`/creator/pool/${video.id}?status=active`}
                          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          View Pool
                        </Link>
                      )}
                      {video.poolStatus === "closing" && (
                        <Link
                          to={`/creator/pool/${video.id}?status=active`}
                          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          View Pool
                        </Link>
                      )}
                      {video.poolStatus === "settled" && (
                        <Link
                          to={`/creator/pool/${video.id}?status=settled`}
                          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Results
                        </Link>
                      )}
                      {video.poolStatus === "ready" && (
                        <button
                          onClick={() => handleEnablePoolClick(video)}
                          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1"
                        >
                          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                          <span>Enable Prediction Pool</span>
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon
                          icon={faEllipsisV}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar for Active Pools */}
                  {video.poolStatus === "active" && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress to 50K views</span>
                        <span>57.4%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: "57.4%" }}
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
              Showing 1-{filteredVideos.length} of {stats.totalVideos} videos
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
