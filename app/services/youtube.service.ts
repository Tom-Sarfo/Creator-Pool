import { apiClient, buildQueryString, TokenManager } from "./api-client";
import { API_CONFIG, API_ENDPOINTS } from "../lib/api-config";
import { formatISODurationShort } from "../lib/utils";
import type {
  YouTubeAuthUrlResponse,
  YouTubeChannelResponse,
  YouTubeCallbackRequest,
  SyncVideosResponse,
  VideosResponse,
  Video,
} from "../lib/types";

// YouTube service class
export class YouTubeService {
  // Get YouTube OAuth authorization URL
  async getAuthUrl(token?: string | null): Promise<YouTubeAuthUrlResponse> {
    // If token is provided (server-side), use it directly
    // Otherwise, apiClient will get it from localStorage (client-side)
    const options = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;

    return apiClient.get<YouTubeAuthUrlResponse>(
      API_ENDPOINTS.YOUTUBE.AUTH_URL,
      options
    );
  }

  // Handle YouTube OAuth callback
  async handleCallback(callbackData: YouTubeCallbackRequest): Promise<void> {
    // Don't follow redirects - backend might redirect, but we'll handle it in the route
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.YOUTUBE.CALLBACK}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TokenManager.getAccessToken()}`,
        },
        body: JSON.stringify(callbackData),
        redirect: "manual", // Don't follow redirects automatically
      }
    );

    // Check if backend returned a redirect
    if (response.status >= 300 && response.status < 400) {
      // We'll ignore the backend redirect and use our own frontend redirect
      // But we still consider this a success
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    // Success - backend processed the callback
    return;
  }

  // Get connected YouTube channel information
  async getChannel(): Promise<YouTubeChannelResponse> {
    return apiClient.get<YouTubeChannelResponse>(API_ENDPOINTS.YOUTUBE.CHANNEL);
  }

  // Sync videos from YouTube (try new endpoint first, fallback to old)
  async syncVideos(): Promise<SyncVideosResponse> {
    try {
      return await apiClient.post<SyncVideosResponse>(
        API_ENDPOINTS.YOUTUBE.SYNC
      );
    } catch (error: any) {
      // If that endpoint doesn't exist, try the old one
      if (error?.status === 404) {
        return apiClient.post<SyncVideosResponse>(
          API_ENDPOINTS.YOUTUBE.SYNC_VIDEOS
        );
      }
      throw error;
    }
  }

  // Get videos with pagination and filters
  async getVideos(params?: {
    page?: number;
    limit?: number;
    status?: "unlisted" | "private" | "public";
    search?: string;
  }): Promise<VideosResponse> {
    const queryString = params ? buildQueryString(params) : "";
    return apiClient.get<VideosResponse>(
      `${API_ENDPOINTS.YOUTUBE.VIDEOS}${queryString}`
    );
  }

  // Get all videos (for dashboard display)
  async getAllVideos(): Promise<Video[]> {
    const response = await this.getVideos({ limit: 1000 });
    return response.videos || [];
  }

  // Get unlisted videos only
  async getUnlistedVideos(): Promise<Video[]> {
    const response = await this.getVideos({ status: "unlisted" });
    return response.videos;
  }

  // Disconnect YouTube channel
  async disconnectChannel(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.YOUTUBE.DISCONNECT);
  }

  // Get connection status (simpler check - from guide)
  async getConnectionStatus(): Promise<{
    connected: boolean;
    channelId?: string;
    lastSyncAt?: string;
  }> {
    return apiClient.get<{
      connected: boolean;
      channelId?: string;
      lastSyncAt?: string;
    }>(API_ENDPOINTS.YOUTUBE.STATUS);
  }

  // Check if YouTube is connected (try status endpoint first, fallback to channel)
  async isConnected(): Promise<boolean> {
    try {
      try {
        const status = await this.getConnectionStatus();
        return status.connected === true;
      } catch (statusError: any) {
        // If status endpoint doesn't exist (404), fallback to channel endpoint
        if (statusError?.status === 404) {
          try {
            await this.getChannel();
            return true;
          } catch {
            return false;
          }
        }
        // If it's a 401/403, user is not connected
        if (statusError?.status === 401 || statusError?.status === 403) {
          return false;
        }
        return false;
      }
    } catch {
      return false;
    }
  }

  // Get video by ID
  async getVideoById(videoId: string): Promise<Video> {
    return apiClient.get<Video>(`${API_ENDPOINTS.YOUTUBE.VIDEOS}/${videoId}`);
  }

  // Update video information
  async updateVideo(videoId: string, updates: Partial<Video>): Promise<Video> {
    return apiClient.put<Video>(
      `${API_ENDPOINTS.YOUTUBE.VIDEOS}/${videoId}`,
      updates
    );
  }

  // Search videos by title
  async searchVideos(query: string): Promise<Video[]> {
    const response = await this.getVideos({ search: query });
    return response.videos;
  }

  // Get video statistics
  async getVideoStats(videoId: string): Promise<{
    viewCount: number;
    likeCount: number;
    commentCount: number;
    lastSyncedAt: string;
  }> {
    return apiClient.get(`${API_ENDPOINTS.YOUTUBE.VIDEOS}/${videoId}/stats`);
  }

  // Refresh video statistics
  async refreshVideoStats(videoId: string): Promise<void> {
    await apiClient.post(
      `${API_ENDPOINTS.YOUTUBE.VIDEOS}/${videoId}/refresh-stats`
    );
  }

  // Get channel statistics
  async getChannelStats(): Promise<{
    subscriberCount: number;
    videoCount: number;
    totalViews: number;
    lastSyncedAt: string;
  }> {
    return apiClient.get(`${API_ENDPOINTS.YOUTUBE.CHANNEL}/stats`);
  }

  // Validate YouTube video URL
  static validateYouTubeUrl(url: string): { valid: boolean; videoId?: string } {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return { valid: true, videoId: match[1] };
      }
    }

    return { valid: false };
  }

  // Extract video ID from YouTube URL
  static extractVideoId(url: string): string | null {
    const result = this.validateYouTubeUrl(url);
    return result.valid ? result.videoId || null : null;
  }

  // Generate YouTube video URL from video ID
  static generateVideoUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  // Generate YouTube thumbnail URL
  static generateThumbnailUrl(
    videoId: string,
    quality: "default" | "medium" | "high" | "standard" | "maxres" = "medium"
  ): string {
    const qualityMap = {
      default: "default",
      medium: "mqdefault",
      high: "hqdefault",
      standard: "sddefault",
      maxres: "maxresdefault",
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
  }

  // Format subscriber count
  static formatSubscriberCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  // Format view count
  static formatViewCount(count: number): string {
    if (count >= 1000000000) {
      return `${(count / 1000000000).toFixed(1)}B`;
    } else if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  // Format duration (ISO 8601 to readable format)
  static formatDuration(duration: string): string {
    // Use the utility function from utils.ts
    return formatISODurationShort(duration) || duration;
  }

  // Check if video is eligible for pool creation
  static isVideoEligibleForPool(video: Video): boolean {
    // Only unlisted videos are eligible for pool creation
    return video.status === "unlisted";
  }

  // Get video age in days
  static getVideoAgeInDays(publishedAt: string): number {
    const published = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - published.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if video is recent (within last 30 days)
  static isRecentVideo(publishedAt: string): boolean {
    return this.getVideoAgeInDays(publishedAt) <= 30;
  }
}

// Create singleton instance
export const youtubeService = new YouTubeService();
