import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../lib/api-config";
import type { Video } from "../lib/types";

export interface VideoMetrics {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  lastSyncedAt: string;
}

export interface GetVideoResponse {
  video: Video;
}

// Video service class
export class VideoService {
  // Get video by ID with full details (includes metrics)
  async getVideoById(videoId: string): Promise<GetVideoResponse> {
    return apiClient.get<GetVideoResponse>(
      API_ENDPOINTS.VIDEOS.GET_BY_ID(videoId)
    );
  }

  // Get video metrics only
  async getVideoMetrics(videoId: string): Promise<VideoMetrics> {
    return apiClient.get<VideoMetrics>(API_ENDPOINTS.VIDEOS.METRICS(videoId));
  }

  // Manually trigger metrics sync
  async syncVideoMetrics(videoId: string): Promise<Video> {
    return apiClient.post<Video>(API_ENDPOINTS.VIDEOS.SYNC_METRICS(videoId));
  }
}

// Create singleton instance
export const videoService = new VideoService();
