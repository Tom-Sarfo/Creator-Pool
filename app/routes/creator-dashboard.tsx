import type { Route } from "./+types/creator-dashboard";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faChartBar,
  faDollarSign,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

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
  // Mock data - will be replaced with real data later
  const stats = {
    totalVideos: 24,
    activePools: 3,
    totalPledged: 1250,
    totalEarned: 89.5,
  };

  const recentVideos = [
    {
      id: 1,
      title: "My Latest Gaming Video - Epic Win!",
      thumbnail: "/api/placeholder/160/90",
      views: 12500,
      status: "published",
      poolStatus: "active",
      poolSize: 450,
    },
    {
      id: 2,
      title: "Tutorial: How to Build a React App",
      thumbnail: "/api/placeholder/160/90",
      views: 8900,
      status: "published",
      poolStatus: "settled",
      poolSize: 320,
    },
    {
      id: 3,
      title: "Unlisted: Secret Project Reveal",
      thumbnail: "/api/placeholder/160/90",
      views: 0,
      status: "unlisted",
      poolStatus: "pending",
      poolSize: 0,
    },
  ];

  const activePools = [
    {
      id: 1,
      videoTitle: "My Latest Gaming Video - Epic Win!",
      question: "Will this video reach 20K views in 7 days?",
      participants: 23,
      totalStake: 450,
      timeRemaining: "5 days, 12 hours",
      status: "active",
    },
    {
      id: 2,
      videoTitle: "React Tutorial Series",
      question: "Will this get 15K views in 5 days?",
      participants: 18,
      totalStake: 320,
      timeRemaining: "2 days, 8 hours",
      status: "active",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Creator! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your content and prediction pools.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faVideo}
                  className="w-5 h-5 text-blue-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Videos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalVideos}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="w-5 h-5 text-purple-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Active Pools</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activePools}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="w-5 h-5 text-green-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Pledged</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalPledged.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="w-5 h-5 text-yellow-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Earned</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalEarned}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/creator/videos"
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
          >
            🎬 Manage Videos
          </Link>
          <Link
            to="/creator/pools"
            className="flex-1 bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors text-center"
          >
            🎯 Create New Pool
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Videos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Videos
              </h2>
              <Link
                to="/creator/videos"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentVideos.map((video) => (
              <div key={video.id} className="p-4 sm:p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-500">Thumbnail</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {video.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span>{video.views.toLocaleString()} views</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          video.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {video.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          video.poolStatus === "active"
                            ? "bg-purple-100 text-purple-800"
                            : video.poolStatus === "settled"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {video.poolStatus === "active"
                          ? `Pool: $${video.poolSize}`
                          : video.poolStatus === "settled"
                            ? "Pool settled"
                            : "No pool"}
                      </span>
                      <button className="text-xs text-purple-600 hover:text-purple-700">
                        {video.poolStatus === "pending"
                          ? "Create Pool"
                          : "View Pool"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Pools */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Active Pools
              </h2>
              <Link
                to="/creator/pools"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {activePools.map((pool) => (
              <div key={pool.id} className="p-4 sm:p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {pool.videoTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{pool.question}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{pool.participants} participants</span>
                    <span>${pool.totalStake} total</span>
                  </div>
                  <span className="text-purple-600 font-medium">
                    {pool.timeRemaining}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((pool.participants / 30) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((pool.participants / 30) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation hint */}
      <div className="lg:hidden mt-8 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700 text-center">
          💡 Use the menu button above to navigate between sections
        </p>
      </div>
    </div>
  );
}
