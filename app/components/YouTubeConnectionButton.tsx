import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
  faExternalLinkAlt,
  faCheckCircle,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import { youtubeService } from "../services/youtube.service";
import Loader from "./Loader";

interface YouTubeConnectionButtonProps {
  onConnectionSuccess?: (data: any) => void;
  onConnectionError?: (error: string) => void;
}

export default function YouTubeConnectionButton({
  onConnectionSuccess,
  onConnectionError,
}: YouTubeConnectionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connected" | "syncing"
  >("disconnected");
  const [channelInfo, setChannelInfo] = useState<any>(null);

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      // Check localStorage for stored tokens
      const stored = localStorage.getItem("youtube_tokens");
      if (stored) {
        setConnectionStatus("connected");
        // You could also fetch channel info here
      }
    } catch (error) {
      console.error("Failed to check connection status:", error);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await youtubeService.getAuthUrl();
      const authUrl = response.authUrl || (response as any).data?.authUrl;

      if (!authUrl) {
        throw new Error("Failed to get authorization URL from backend");
      }

      window.location.href = authUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to initiate YouTube connection";
      setError(errorMessage);
      onConnectionError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    setConnectionStatus("syncing");
    setError(null);

    try {
      // For now, just simulate a successful sync
      setConnectionStatus("connected");
      onConnectionSuccess?.({ success: true, videos: [] });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sync YouTube channel";
      setError(errorMessage);
      onConnectionError?.(errorMessage);
      setConnectionStatus("connected"); // Still connected, just sync failed
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Clear localStorage tokens
      localStorage.removeItem("youtube_tokens");
      localStorage.removeItem("youtube_user_id");
      setConnectionStatus("disconnected");
      setChannelInfo(null);
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
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
        return faYoutube;
      default:
        return faYoutube;
    }
  };

  return (
    <div className="space-y-4">
      {connectionStatus === "disconnected" && (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <Loader size="sm" variant="white" />
          ) : (
            <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
          )}
          <span>{isLoading ? "Connecting..." : "Connect YouTube Channel"}</span>
          <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4" />
        </button>
      )}

      {connectionStatus === "connected" && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-green-600">
            <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
            <span className="font-medium">YouTube Channel Connected</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSync}
              disabled={isLoading}
              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <Loader size="sm" variant="white" />
              ) : (
                <FontAwesomeIcon icon={faSync} className="w-4 h-4" />
              )}
              <span>{isLoading ? "Syncing..." : "Sync Channel"}</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {connectionStatus === "syncing" && (
        <div className="flex items-center space-x-2 text-cyan-600">
          <Loader size="sm" />
          <span className="font-medium">Syncing YouTube Channel...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {connectionStatus === "disconnected" && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>• We'll access your unlisted videos to create prediction pools</p>
          <p>• You can revoke access anytime in your YouTube settings</p>
          <p>• We only read video metadata, never modify your content</p>
        </div>
      )}
    </div>
  );
}
