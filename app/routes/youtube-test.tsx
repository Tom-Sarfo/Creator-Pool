import type { Route } from "./+types/youtube-test";
import { useState, useEffect } from "react";
import YouTubeConnectionButton from "../components/YouTubeConnectionButton";

export async function loader({}: Route.LoaderArgs) {
  // Check environment variables on the server side
  const envCheck = {
    hasClientId: !!process.env.YOUTUBE_CLIENT_ID,
    hasClientSecret: !!process.env.YOUTUBE_CLIENT_SECRET,
    redirectUri:
      process.env.YOUTUBE_REDIRECT_URI ||
      "http://localhost:5178/api/youtube/callback",
  };

  return { envCheck };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "YouTube OAuth Test - Creator Pool" },
    {
      name: "description",
      content: "Test YouTube OAuth integration and API connection.",
    },
  ];
}

export default function YouTubeTestPage({ loaderData }: Route.ComponentProps) {
  const [connectionData, setConnectionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { envCheck } = loaderData;

  // Check for OAuth callback parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const youtubeError = urlParams.get("youtube_error");

    if (youtubeError) {
      setError(`OAuth Error: ${youtubeError}`);
    }
  }, []);

  const handleConnectionSuccess = (data: any) => {
    console.log("Connection successful:", data);
    setConnectionData(data);
    setError(null);
  };

  const handleConnectionError = (error: string) => {
    console.error("Connection error:", error);
    setError(error);
    setConnectionData(null);
  };

  const testAuthUrl = async () => {
    try {
      const response = await fetch("/api/youtube/auth");
      const data = await response.json();

      console.log("Auth URL Response:", data);

      if (data.success) {
        alert(
          `Authorization URL generated successfully!\n\nURL: ${data.authUrl}\n\nClick "Connect YouTube Channel" to test the full flow.`
        );
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Test auth URL error:", err);
      alert("Failed to test auth URL generation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            YouTube OAuth Test
          </h1>
          <p className="text-gray-600 mb-6">
            Test the YouTube OAuth flow and API integration.
          </p>

          {/* Test Auth URL Generation */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Step 1: Test Authorization URL Generation
            </h2>
            <button
              onClick={testAuthUrl}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Auth URL Generation
            </button>
            <p className="text-sm text-gray-500 mt-2">
              This tests if the YouTube API service can generate a valid OAuth
              URL.
            </p>
          </div>

          {/* OAuth Connection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Step 2: Test Full OAuth Flow
            </h2>
            <YouTubeConnectionButton
              onConnectionSuccess={handleConnectionSuccess}
              onConnectionError={handleConnectionError}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Connection Data Display */}
          {connectionData && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Connection Successful!
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <pre className="text-sm text-green-700 overflow-auto">
                  {JSON.stringify(connectionData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Testing Instructions:
            </h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>
                Make sure you have set up your Google Cloud credentials in the
                .env file
              </li>
              <li>
                Click "Test Auth URL Generation" to verify the API service works
              </li>
              <li>
                Click "Connect YouTube Channel" to test the full OAuth flow
              </li>
              <li>You'll be redirected to Google's OAuth consent screen</li>
              <li>
                After authorization, you'll be redirected back to this page
              </li>
              <li>Check the browser console for detailed logs</li>
            </ol>
          </div>

          {/* Environment Check */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Environment Check:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                • Client ID: {envCheck.hasClientId ? "✅ Set" : "❌ Missing"}
              </p>
              <p>
                • Client Secret:{" "}
                {envCheck.hasClientSecret ? "✅ Set" : "❌ Missing"}
              </p>
              <p>• Redirect URI: {envCheck.redirectUri}</p>
            </div>
            {(!envCheck.hasClientId || !envCheck.hasClientSecret) && (
              <div className="mt-2 text-xs text-red-600">
                <p>
                  <strong>Warning:</strong> Missing environment variables.
                  Create a .env file with your YouTube API credentials.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
