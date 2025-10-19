import type { Route } from "./+types/creator-videos";
import { Link } from "react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faVideo,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { CREATOR_VIDEOS_DATA } from "../lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Video Management - Creator Pool" },
    {
      name: "description",
      content: "Manage your YouTube videos and create prediction pools.",
    },
  ];
}

export default function CreatorVideos() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const videos = CREATOR_VIDEOS_DATA;

  const tabs = [
    { id: "all", name: "All Videos", count: videos.length },
    {
      id: "active",
      name: "Active Pools",
      count: videos.filter((v) => v.poolStatus === "active").length,
    },
    {
      id: "unlisted",
      name: "Unlisted",
      count: videos.filter((v) => v.status === "unlisted").length,
    },
  ];

  const filteredVideos = videos.filter((video) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && video.poolStatus === "active") ||
      (activeTab === "unlisted" && video.status === "unlisted");

    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      published: "bg-green-100 text-green-800",
      unlisted: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`;
  };

  const getPoolStatusBadge = (poolStatus: string) => {
    const styles = {
      active: "bg-purple-100 text-purple-800",
      settled: "bg-blue-100 text-blue-800",
      pending: "bg-orange-100 text-orange-800",
      none: "bg-gray-100 text-gray-500",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[poolStatus as keyof typeof styles]}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Video Management
        </h1>
        <p className="text-gray-600">
          Manage your YouTube videos and create prediction pools for your
          content.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={faSearch}
              className="h-5 w-5 text-gray-400"
            />
          </div>
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
                <span
                  className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Videos grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-500">Video Thumbnail</span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                {video.title}
              </h3>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                <span>{video.views.toLocaleString()} views</span>
                <span>{video.likes} likes</span>
                <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
              </div>

              {/* Status badges */}
              <div className="flex items-center space-x-2 mb-3">
                <span className={getStatusBadge(video.status)}>
                  {video.status}
                </span>
                <span className={getPoolStatusBadge(video.poolStatus)}>
                  {video.poolStatus === "active"
                    ? `Pool: $${video.poolSize}`
                    : video.poolStatus === "settled"
                      ? "Settled"
                      : video.poolStatus === "pending"
                        ? "Pending"
                        : "No Pool"}
                </span>
              </div>

              {/* Pool info */}
              {video.poolStatus === "active" && (
                <div className="mb-3 p-2 bg-purple-50 rounded-md">
                  <div className="flex items-center justify-between text-xs text-purple-700">
                    <span>{video.poolParticipants} participants</span>
                    <span>${video.poolSize} total</span>
                  </div>
                  <div className="mt-1 w-full bg-purple-200 rounded-full h-1">
                    <div
                      className="bg-purple-600 h-1 rounded-full"
                      style={{
                        width: `${Math.min((video.poolParticipants / 30) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {video.poolStatus === "pending" &&
                  video.status === "unlisted" && (
                    <Link
                      to={`/creator/pools/new?video=${video.id}`}
                      className="flex-1 bg-purple-600 text-white text-xs py-2 px-3 rounded-md hover:bg-purple-700 transition-colors text-center"
                    >
                      Create Pool
                    </Link>
                  )}
                {video.poolStatus === "active" && (
                  <Link
                    to={`/creator/pools/${video.id}`}
                    className="flex-1 bg-white text-purple-600 border border-purple-600 text-xs py-2 px-3 rounded-md hover:bg-purple-50 transition-colors text-center"
                  >
                    View Pool
                  </Link>
                )}
                {video.poolStatus === "none" &&
                  video.status === "published" && (
                    <button className="flex-1 bg-gray-100 text-gray-600 text-xs py-2 px-3 rounded-md hover:bg-gray-200 transition-colors">
                      Create Pool
                    </button>
                  )}
                <button className="bg-white text-gray-600 border border-gray-300 text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon
            icon={faVideo}
            className="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No videos found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search terms."
              : "Connect your YouTube channel to get started."}
          </p>
          <div className="mt-6">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
              Connect YouTube Channel
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom navigation hint */}
      <div className="lg:hidden mt-8 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700 text-center">
          <FontAwesomeIcon icon={faLightbulb} className="mr-1" />
          Swipe between videos or use the search to find specific content
        </p>
      </div>
    </div>
  );
}
