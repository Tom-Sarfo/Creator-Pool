// YouTube Video API service for fetching videos from connected channels

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  status: "unlisted" | "private" | "public";
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  channelId: string;
  channelTitle: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: number;
  videoCount: number;
}

import { formatISODurationShort } from "./utils";

export class YouTubeVideoAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  // Get channel information
  async getChannel(): Promise<YouTubeChannel> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch channel: ${response.statusText}`);
    }

    const data = await response.json();
    const channel = data.items?.[0];

    if (!channel) {
      throw new Error("No channel found");
    }

    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.default.url,
      subscriberCount: parseInt(channel.statistics.subscriberCount || "0"),
      videoCount: parseInt(channel.statistics.videoCount || "0"),
    };
  }

  // Get all videos from the channel
  async getVideos(maxResults: number = 50): Promise<YouTubeVideo[]> {
    // First get the channel details including uploads playlist
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true&access_token=${this.accessToken}`
    );

    if (!channelResponse.ok) {
      throw new Error(`Failed to fetch channel: ${channelResponse.statusText}`);
    }

    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      throw new Error("No channel found");
    }

    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

    // Get videos from the uploads playlist (this includes unlisted videos)
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch videos: ${response.statusText}`);
    }

    const data = await response.json();
    const videos = data.items || [];

    // Get detailed information for each video
    const videoDetails = await Promise.all(
      videos.map(async (video: any) => {
        try {
          const videoId = video.snippet.resourceId.videoId;
          const details = await this.getVideoDetails(videoId);
          return {
            id: videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail:
              video.snippet.thumbnails.medium?.url ||
              video.snippet.thumbnails.default.url,
            publishedAt: video.snippet.publishedAt,
            status: details.status,
            viewCount: details.viewCount,
            likeCount: details.likeCount,
            commentCount: details.commentCount,
            duration: details.duration,
            channelId: video.snippet.channelId,
            channelTitle: video.snippet.channelTitle,
          };
        } catch (error) {
          console.error(
            `Failed to get details for video ${video.snippet.resourceId.videoId}:`,
            error
          );
          return null;
        }
      })
    );

    console.log("videos", videos);

    const filteredVideos = videoDetails.filter(
      (video): video is YouTubeVideo => video !== null
    );

    console.log(`YouTube API: Found ${filteredVideos.length} videos`);
    console.log(
      "Video statuses:",
      filteredVideos.map((v) => ({ title: v.title, status: v.status }))
    );

    return filteredVideos;
  }

  // Get detailed information for a specific video
  async getVideoDetails(videoId: string): Promise<{
    status: "unlisted" | "private" | "public";
    viewCount: number;
    likeCount: number;
    commentCount: number;
    duration: string;
  }> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,status,contentDetails&id=${videoId}&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch video details: ${response.statusText}`);
    }

    const data = await response.json();
    const video = data.items?.[0];

    if (!video) {
      throw new Error("Video not found");
    }

    return {
      status: video.status.privacyStatus as "unlisted" | "private" | "public",
      viewCount: parseInt(video.statistics.viewCount || "0"),
      likeCount: parseInt(video.statistics.likeCount || "0"),
      commentCount: parseInt(video.statistics.commentCount || "0"),
      duration: this.parseDuration(video.contentDetails.duration),
    };
  }

  // Get only unlisted videos
  async getUnlistedVideos(): Promise<YouTubeVideo[]> {
    const allVideos = await this.getVideos();
    return allVideos.filter((video) => video.status === "unlisted");
  }

  // Parse YouTube duration format (PT4M13S) to readable format
  private parseDuration(duration: string): string {
    // Use the utility function from utils.ts
    return formatISODurationShort(duration) || "0s";
  }

  // Convert YouTube video to app's video format
  static convertToAppVideo(youtubeVideo: YouTubeVideo): any {
    return {
      id: youtubeVideo.id,
      title: youtubeVideo.title,
      thumbnail: youtubeVideo.thumbnail,
      duration: youtubeVideo.duration,
      views: youtubeVideo.viewCount,
      likes: youtubeVideo.likeCount,
      uploadDate: new Date(youtubeVideo.publishedAt).toLocaleDateString(),
      status: youtubeVideo.status,
      youtubeId: youtubeVideo.id,
      youtubeChannelId: youtubeVideo.channelId,
      lastSyncedAt: new Date().toISOString(),
    };
  }
}

// Utility function to get stored access token
export async function getStoredAccessToken(): Promise<string | null> {
  try {
    // Use absolute URL to ensure correct port
    const baseUrl = window.location.origin;
    const response = await fetch(`${baseUrl}/api/youtube/tokens`);
    console.log(
      "getStoredAccessToken: Fetching from:",
      `${baseUrl}/api/youtube/tokens`
    );

    if (response.ok) {
      const data = await response.json();
      console.log("getStoredAccessToken: Response data:", data);
      return data.tokens?.accessToken || null;
    } else {
      const errorText = await response.text();
      console.error(
        "getStoredAccessToken: Response not ok:",
        response.status,
        response.statusText
      );
      console.error("getStoredAccessToken: Error response body:", errorText);
    }
  } catch (error) {
    console.error("Failed to get stored access token:", error);
  }
  return null;
}

// Utility function to sync videos
export async function syncYouTubeVideos(): Promise<{
  channel: YouTubeChannel;
  videos: YouTubeVideo[];
  unlistedVideos: YouTubeVideo[];
}> {
  const accessToken = await getStoredAccessToken();

  if (!accessToken) {
    throw new Error(
      "No YouTube access token found. Please connect your channel first."
    );
  }

  const api = new YouTubeVideoAPI(accessToken);

  const [channel, allVideos] = await Promise.all([
    api.getChannel(),
    api.getVideos(),
  ]);

  const unlistedVideos = allVideos.filter(
    (video) => video.status === "unlisted"
  );

  return {
    channel,
    videos: allVideos,
    unlistedVideos,
  };
}
