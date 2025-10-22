// Types for our YouTube integration
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface ChannelData {
  id: string;
  title: string;
  thumbnail: string;
  subscriberCount: number;
}

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  status: "unlisted" | "private" | "public";
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
}

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: "unlisted" | "private" | "public";
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export class YouTubeAPI {
  private redirectUri: string;

  constructor() {
    this.redirectUri = "http://localhost:5178/api/youtube/callback";
  }

  /**
   * Generate the OAuth authorization URL
   */
  async getAuthorizationUrl(): Promise<string> {
    try {
      const response = await fetch("/api/youtube/auth");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to get authorization URL");
      }

      return data.authUrl;
    } catch (error) {
      console.error("Failed to get authorization URL:", error);
      // Fallback: redirect to the auth endpoint directly
      window.location.href = "/api/youtube/auth";
      throw error;
    }
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<TokenResponse> {
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error_description || "Failed to exchange code for tokens"
        );
      }

      const data = await response.json();
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      };
    } catch (error) {
      console.error("Failed to exchange code for tokens:", error);
      throw error;
    }
  }

  // Store tokens in localStorage (client-side) or database (server-side)
  async storeTokens(tokens: TokenResponse, userId?: string): Promise<void> {
    if (typeof window !== "undefined") {
      // Client-side storage
      localStorage.setItem("youtube_tokens", JSON.stringify(tokens));
      localStorage.setItem("youtube_user_id", userId || "");
    }
    // In a real app, you'd also store these server-side in a database
  }

  // Retrieve tokens from localStorage
  async getStoredTokens(): Promise<TokenResponse | null> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("youtube_tokens");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  // Check if user has valid YouTube connection
  async hasValidConnection(): Promise<boolean> {
    try {
      const tokens = await this.getStoredTokens();
      if (!tokens) return false;

      // For now, just check if tokens exist
      // In a real app, you'd validate the token with YouTube API
      return true;
    } catch (error) {
      console.error("YouTube connection check failed:", error);
      return false;
    }
  }

  // Sync all videos from connected channel
  async syncChannelVideos(): Promise<{
    success: boolean;
    videos: VideoData[];
    error?: string;
  }> {
    try {
      const tokens = await this.getStoredTokens();
      if (!tokens) {
        return {
          success: false,
          videos: [],
          error: "No YouTube connection found",
        };
      }

      // For now, return mock data
      // In a real app, you'd call YouTube API here
      const mockVideos: VideoData[] = [
        {
          id: "mock1",
          title: "My Unlisted Video 1",
          thumbnail: "https://via.placeholder.com/320x180",
          status: "unlisted",
          publishedAt: new Date().toISOString(),
          duration: "5:30",
          viewCount: 0,
          likeCount: 0,
        },
        {
          id: "mock2",
          title: "My Unlisted Video 2",
          thumbnail: "https://via.placeholder.com/320x180",
          status: "unlisted",
          publishedAt: new Date().toISOString(),
          duration: "3:45",
          viewCount: 0,
          likeCount: 0,
        },
      ];

      return { success: true, videos: mockVideos };
    } catch (error) {
      console.error("YouTube sync failed:", error);
      return {
        success: false,
        videos: [],
        error: `Sync failed: ${error}`,
      };
    }
  }

  // Disconnect YouTube channel
  async disconnect(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("youtube_tokens");
      localStorage.removeItem("youtube_user_id");
    }
    // In a real app, you'd also remove tokens from the database
  }
}

// Export a singleton instance
export const youtubeAPI = new YouTubeAPI();
