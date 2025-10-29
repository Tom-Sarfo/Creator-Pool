import type { Route } from "./+types/creator-youtube-settings";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSync,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faClock,
  faUsers,
  faEye,
  faHeart,
  faCalendar,
  faVideo,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import YouTubeConnectionButton from "../components/YouTubeConnectionButton";
import {
  syncYouTubeVideos,
  type YouTubeVideo,
  type YouTubeChannel,
} from "../lib/youtube-video-api";
import { useAppContext } from "../contexts/AppContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "YouTube Settings - Creator Pool" },
    {
      name: "description",
      content: "Manage your YouTube channel connection and sync settings.",
    },
  ];
}

export default function CreatorYouTubeSettings() {
  const [searchParams] = useSearchParams();
  const [oauthMessage, setOauthMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Use AppContext instead of local state
  const {
    youtubeChannel,
    syncYouTubeVideos: contextSyncYouTubeVideos,
    isYouTubeConnected,
    lastYouTubeSync,
    videos,
  } = useAppContext();

  // Check for OAuth success/error parameters
  useEffect(() => {
    const youtubeSuccess = searchParams.get("youtube_success");
    const youtubeError = searchParams.get("youtube_error");

    if (youtubeSuccess === "true") {
      setOauthMessage({
        type: "success",
        message: "YouTube channel connected successfully!",
      });
      // Connection is managed by AppContext - no need to set it manually
    } else if (youtubeError) {
      setOauthMessage({
        type: "error",
        message: `Connection failed: ${youtubeError}`,
      });
    }

    // Clear URL parameters after processing
    if (youtubeSuccess || youtubeError) {
      const url = new URL(window.location.href);
      url.searchParams.delete("youtube_success");
      url.searchParams.delete("youtube_error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  // Connection status is managed by AppContext - no need to check localStorage

  const handleSync = async () => {
    setSyncError(null);

    try {
      await contextSyncYouTubeVideos();
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncError(
        error instanceof Error ? error.message : "Failed to sync videos"
      );
    }
  };

  const handleDisconnect = () => {
    // TODO: Implement disconnect via YouTube service
    setSyncError(null);
    setOauthMessage(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "syncing":
        return "text-cyan-600";
      case "disconnected":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return faCheckCircle;
      case "syncing":
        return faSync;
      case "disconnected":
        return faExclamationTriangle;
      default:
        return faExclamationTriangle;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          YouTube Settings
        </h1>
        <p className="text-gray-600">
          Manage your YouTube channel connection and sync settings.
        </p>
      </div>

      {/* OAuth Message */}
      {oauthMessage && (
        <div
          className={`rounded-lg p-4 mb-6 ${
            oauthMessage.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon
              icon={
                oauthMessage.type === "success"
                  ? faCheckCircle
                  : faExclamationTriangle
              }
              className={`w-5 h-5 ${
                oauthMessage.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            />
            <span
              className={`font-medium ${
                oauthMessage.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {oauthMessage.message}
            </span>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faYoutube}
                className="w-6 h-6 text-red-600"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Channel Connection
              </h3>
              <p className="text-sm text-gray-600">
                {isYouTubeConnected
                  ? "Your YouTube channel is connected and synced"
                  : "Connect your YouTube channel to get started"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon
              icon={isYouTubeConnected ? faCheckCircle : faExclamationTriangle}
              className={`w-5 h-5 ${isYouTubeConnected ? "text-green-600" : "text-yellow-600"}`}
            />
            <span
              className={`text-sm font-medium ${isYouTubeConnected ? "text-green-600" : "text-yellow-600"}`}
            >
              {isYouTubeConnected ? "Connected" : "Not Connected"}
            </span>
          </div>
        </div>

        {!isYouTubeConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="w-5 h-5 text-yellow-600 mt-0.5"
              />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">
                  Connection Required
                </h4>
                <p className="text-sm text-yellow-700">
                  Connect your YouTube channel to access unlisted videos and
                  create prediction pools. Your channel data is synced securely
                  and only used for pool creation.
                </p>
              </div>
            </div>
          </div>
        )}

        {isYouTubeConnected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="w-5 h-5 text-green-600 mt-0.5"
              />
              <div>
                <h4 className="font-medium text-green-800 mb-1">
                  Channel Connected
                </h4>
                <p className="text-sm text-green-700">
                  Your YouTube channel is connected and ready for pool creation.
                  {lastYouTubeSync &&
                    ` Last synced: ${new Date(lastYouTubeSync).toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            {!isYouTubeConnected ? (
              <YouTubeConnectionButton />
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSync}
                  disabled={false}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faSync} className="w-4 h-4" />
                  <span>Sync Channel</span>
                </button>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sync Error */}
      {syncError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="w-5 h-5 text-red-600"
            />
            <div>
              <h4 className="font-medium text-red-800">Sync Failed</h4>
              <p className="text-sm text-red-700">{syncError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sync Statistics */}
      {isYouTubeConnected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faEye}
                  className="w-5 h-5 text-cyan-600"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Total Videos</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {videos.length}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">All videos in your channel</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="w-5 h-5 text-yellow-600"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Unlisted Videos</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {videos.filter((v) => v.status === "unlisted").length}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Available for pool creation</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="w-5 h-5 text-green-600"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Public Videos</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {videos.filter((v) => v.status === "public").length}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Published videos</p>
          </div>
        </div>
      )}

      {/* Sync Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Sync Settings
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Auto Sync</h4>
              <p className="text-sm text-gray-600">
                Automatically sync your channel every 6 hours
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                Sync Unlisted Videos
              </h4>
              <p className="text-sm text-gray-600">
                Include unlisted videos in sync (recommended for pool creation)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sync Video Metadata</h4>
              <p className="text-sm text-gray-600">
                Include video titles, descriptions, and thumbnails
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Last Sync</h4>
              <p className="text-sm text-gray-600">
                {lastYouTubeSync
                  ? new Date(lastYouTubeSync).toLocaleString()
                  : "Never synced"}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
              <span>Every 6 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synced Videos */}
      {isYouTubeConnected && videos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Your YouTube Videos
            </h3>
            <span className="text-sm text-gray-500">
              {videos.length} videos synced
            </span>
          </div>

          <div className="space-y-4">
            {videos.slice(0, 10).map((video) => (
              <div
                key={video.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-20 h-14 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {video.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        video.status === "unlisted"
                          ? "bg-yellow-100 text-yellow-800"
                          : video.status === "public"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {video.status}
                    </span>
                    <span>{video.viewCount.toLocaleString()} views</span>
                    <span>{video.likeCount.toLocaleString()} likes</span>
                    <span>
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId || video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-800"
                  >
                    <FontAwesomeIcon icon={faVideo} className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}

            {videos.length > 10 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Showing 10 of {videos.length} videos
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-8 bg-cyan-50 border border-cyan-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="w-5 h-5 text-cyan-600 mt-0.5"
          />
          <div>
            <h4 className="font-medium text-cyan-900 mb-2">
              Privacy & Security
            </h4>
            <ul className="text-sm text-cyan-800 space-y-1">
              <li>
                • Your YouTube data is accessed securely through Google's OAuth
                2.0
              </li>
              <li>
                • We only access videos you explicitly choose for pool creation
              </li>
              <li>• Your channel data is never shared with third parties</li>
              <li>• You can disconnect your channel at any time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
