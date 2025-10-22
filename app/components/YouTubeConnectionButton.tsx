import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
  faExternalLinkAlt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

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

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call our API to get the authorization URL
      const response = await fetch("/api/youtube/auth");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to get authorization URL");
      }

      // Redirect to YouTube OAuth
      window.location.href = data.authUrl;
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

  return (
    <div className="space-y-4">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
        ) : (
          <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
        )}
        <span>{isLoading ? "Connecting..." : "Connect YouTube Channel"}</span>
        <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4" />
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">
            <strong>Connection Error:</strong> {error}
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• We'll access your unlisted videos to create prediction pools</p>
        <p>• You can revoke access anytime in your YouTube settings</p>
        <p>• We only read video metadata, never modify your content</p>
      </div>
    </div>
  );
}
