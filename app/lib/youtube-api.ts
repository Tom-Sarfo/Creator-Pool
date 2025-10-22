import { google } from "googleapis";

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
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private oauth2Client: any;

  constructor() {
    this.clientId = process.env.YOUTUBE_CLIENT_ID || "";
    this.clientSecret = process.env.YOUTUBE_CLIENT_SECRET || "";
    this.redirectUri =
      process.env.YOUTUBE_REDIRECT_URI ||
      "http://localhost:5178/api/youtube/callback";

    this.oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );
  }

  /**
   * Generate the OAuth authorization URL
   */
  getAuthorizationUrl(): string {
    const scopes = [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
      prompt: "consent", // Force consent screen to get refresh token
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<TokenResponse> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);

      return {
        access_token: tokens.access_token || "",
        refresh_token: tokens.refresh_token || "",
        expires_in: tokens.expiry_date
          ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
          : 3600,
        token_type: tokens.token_type || "Bearer",
      };
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      throw new Error("Failed to exchange authorization code for tokens");
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();

      return {
        access_token: credentials.access_token || "",
        refresh_token: credentials.refresh_token || refreshToken,
        expires_in: credentials.expiry_date
          ? Math.floor((credentials.expiry_date - Date.now()) / 1000)
          : 3600,
        token_type: credentials.token_type || "Bearer",
      };
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw new Error("Failed to refresh access token");
    }
  }

  /**
   * Get channel information
   */
  async getChannel(accessToken: string): Promise<ChannelData> {
    try {
      this.oauth2Client.setCredentials({
        access_token: accessToken,
      });

      const youtube = google.youtube({
        version: "v3",
        auth: this.oauth2Client,
      });

      const response = await youtube.channels.list({
        part: ["snippet", "statistics"],
        mine: true,
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error("No channel found");
      }

      const channel = response.data.items[0];

      return {
        id: channel.id || "",
        title: channel.snippet?.title || "",
        thumbnail: channel.snippet?.thumbnails?.default?.url || "",
        subscriberCount: parseInt(channel.statistics?.subscriberCount || "0"),
      };
    } catch (error) {
      console.error("Error getting channel:", error);
      throw new Error("Failed to get channel information");
    }
  }

  /**
   * Get all videos from a channel
   */
  async getVideos(
    accessToken: string,
    channelId: string
  ): Promise<VideoData[]> {
    try {
      this.oauth2Client.setCredentials({
        access_token: accessToken,
      });

      const youtube = google.youtube({
        version: "v3",
        auth: this.oauth2Client,
      });

      const response = await youtube.search.list({
        part: ["snippet"],
        channelId: channelId,
        type: ["video"],
        maxResults: 50,
        order: "date",
      });

      if (!response.data.items) {
        return [];
      }

      // Get detailed information for each video
      const videoIds = response.data.items
        .map((item) => item.id?.videoId)
        .filter(Boolean);
      const videoDetails = await this.getVideoDetails(accessToken, videoIds);

      return videoDetails.map((video) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        status: video.status,
        publishedAt: video.publishedAt,
        duration: video.duration,
        viewCount: video.viewCount,
        likeCount: video.likeCount,
      }));
    } catch (error) {
      console.error("Error getting videos:", error);
      throw new Error("Failed to get channel videos");
    }
  }

  /**
   * Get unlisted videos specifically
   */
  async getUnlistedVideos(
    accessToken: string,
    channelId: string
  ): Promise<VideoData[]> {
    try {
      const allVideos = await this.getVideos(accessToken, channelId);
      return allVideos.filter((video) => video.status === "unlisted");
    } catch (error) {
      console.error("Error getting unlisted videos:", error);
      throw new Error("Failed to get unlisted videos");
    }
  }

  /**
   * Get detailed information for specific videos
   */
  async getVideoDetails(
    accessToken: string,
    videoIds: string[]
  ): Promise<VideoDetails[]> {
    try {
      this.oauth2Client.setCredentials({
        access_token: accessToken,
      });

      const youtube = google.youtube({
        version: "v3",
        auth: this.oauth2Client,
      });

      const response = await youtube.videos.list({
        part: ["snippet", "statistics", "contentDetails"],
        id: videoIds,
      });

      if (!response.data.items) {
        return [];
      }

      return response.data.items.map((video) => ({
        id: video.id || "",
        title: video.snippet?.title || "",
        description: video.snippet?.description || "",
        thumbnail:
          video.snippet?.thumbnails?.high?.url ||
          video.snippet?.thumbnails?.default?.url ||
          "",
        status:
          (video.snippet?.privacyStatus as "unlisted" | "private" | "public") ||
          "private",
        publishedAt: video.snippet?.publishedAt || "",
        duration: video.contentDetails?.duration || "",
        viewCount: parseInt(video.statistics?.viewCount || "0"),
        likeCount: parseInt(video.statistics?.likeCount || "0"),
        commentCount: parseInt(video.statistics?.commentCount || "0"),
      }));
    } catch (error) {
      console.error("Error getting video details:", error);
      throw new Error("Failed to get video details");
    }
  }

  /**
   * Test the API connection
   */
  async testConnection(accessToken: string): Promise<boolean> {
    try {
      await this.getChannel(accessToken);
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }
}

// Export a singleton instance
export const youtubeAPI = new YouTubeAPI();
