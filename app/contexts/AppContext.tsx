import { createContext, useContext, useState, type ReactNode } from "react";
import { ALL_VIDEOS } from "../lib/constants";
import type { ToastData } from "../components/Toast";

export interface UnifiedVideo {
  id: number;
  title: string;
  thumbnail: string;
  status: string; 
  views: number;
  likes: number;
  duration: string;
  uploadDate: string;

  // Creator info
  creator: string;
  creatorVerified: boolean;
  creatorSubs: string;
  category: string;

  // Pool info - initially null/0 for unlisted videos
  poolId: number | null;
  poolStatus: string | null;
  poolQuestion: string | null;
  poolParticipants: number;
  poolTotalStake: number;
  poolTimeRemaining: string | null;
  poolTargetViews: number | null;
  poolCurrentViews: number;
  poolCreatedAt: string | null;
  poolOdds: { yes: number; no: number } | null;
}

// Pool interfaces
export interface Pool {
  id: number;
  title?: string;
  videoTitle?: string;
  videoId?: number; // ID of the associated video
  creator?: string;
  creatorVerified?: boolean;
  creatorSubs?: string;
  thumbnail?: string;
  category?: string;
  question: string;
  participants: number;
  totalStake: number;
  timeRemaining: string;
  status: string;
  createdAt?: string;
  targetViews?: number;
  currentViews?: number;
  duration?: number; // Duration in days for the pool
  odds?: { yes: number; no: number };
  result?: string;
  creatorEarnings?: number;
}

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Theme state
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  // Unified video/pool state
  videos: UnifiedVideo[];
  setVideos: (videos: UnifiedVideo[]) => void;
  updateVideo: (id: number, updates: Partial<UnifiedVideo>) => void;
  getVideoById: (id: number) => UnifiedVideo | undefined;

  // Pool state (derived from videos)
  pools: Pool[];
  addPool: (pool: Omit<Pool, "id">) => void;
  updatePool: (id: number, updates: Partial<Pool>) => void;
  deletePool: (id: number) => void;
  getPoolById: (id: number) => Pool | undefined;
  filteredPools: (filter: "active" | "settled" | "expired" | "all") => Pool[];

  // Toast state
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize with unified video data
  const [videos, setVideos] = useState<UnifiedVideo[]>(ALL_VIDEOS);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Derive pools from videos that have pool data
  const pools: Pool[] = videos
    .filter((video) => video.poolId !== null && video.poolStatus !== null)
    .map((video) => ({
      id: video.poolId!,
      title: video.title,
      videoTitle: video.title,
      videoId: video.id,
      creator: video.creator,
      creatorVerified: video.creatorVerified,
      creatorSubs: video.creatorSubs,
      thumbnail: video.thumbnail,
      category: video.category,
      question: video.poolQuestion!,
      participants: video.poolParticipants,
      totalStake: video.poolTotalStake,
      timeRemaining: video.poolTimeRemaining!,
      status: video.poolStatus!,
      createdAt: video.poolCreatedAt || undefined,
      targetViews: video.poolTargetViews || undefined,
      currentViews: video.poolCurrentViews,
      odds: video.poolOdds || undefined,
    }));

  // Video management functions
  const updateVideo = (id: number, updates: Partial<UnifiedVideo>) => {
    setVideos((prev) =>
      prev.map((video) => (video.id === id ? { ...video, ...updates } : video))
    );
  };

  const getVideoById = (id: number): UnifiedVideo | undefined => {
    return videos.find((video) => video.id === id);
  };

  // Toast management functions
  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Pool management functions (working with unified video structure)
  const addPool = (newPool: Omit<Pool, "id">) => {
    const nextPoolId =
      videos.reduce((maxId, video) => {
        const videoPoolId = video.poolId || 0;
        return videoPoolId > maxId ? videoPoolId : maxId;
      }, 0) + 1;

    // Find the video this pool is for and update it
    if (newPool.videoId) {
      const videoToUpdate = videos.find((v) => v.id === newPool.videoId);
      if (videoToUpdate) {
        updateVideo(videoToUpdate.id, {
          poolId: nextPoolId,
          poolStatus: newPool.status,
          poolQuestion: newPool.question,
          poolParticipants: newPool.participants,
          poolTotalStake: newPool.totalStake,
          poolTimeRemaining: newPool.timeRemaining,
          poolTargetViews: newPool.targetViews || null,
          poolCurrentViews: newPool.currentViews || 0,
          poolCreatedAt: newPool.createdAt || null,
          poolOdds: newPool.odds || null,
        });
      }
    }

    // Show success toast
    addToast({
      type: "success",
      title: "Pool Created Successfully!",
      message: `Your pool "${newPool.title}" is now live and accepting predictions.`,
      duration: 4000,
    });
  };

  const updatePool = (id: number, updates: Partial<Pool>) => {
    // Find the video with this pool ID and update its pool data
    const videoWithPool = videos.find((v) => v.poolId === id);
    if (videoWithPool) {
      updateVideo(videoWithPool.id, {
        poolStatus: updates.status || videoWithPool.poolStatus,
        poolQuestion: updates.question || videoWithPool.poolQuestion,
        poolParticipants:
          updates.participants ?? videoWithPool.poolParticipants,
        poolTotalStake: updates.totalStake ?? videoWithPool.poolTotalStake,
        poolTimeRemaining:
          updates.timeRemaining || videoWithPool.poolTimeRemaining,
        poolTargetViews: updates.targetViews ?? videoWithPool.poolTargetViews,
        poolCurrentViews:
          updates.currentViews ?? videoWithPool.poolCurrentViews,
        poolOdds: updates.odds || videoWithPool.poolOdds,
      });
    }
  };

  const deletePool = (id: number) => {
    // Find the video with this pool ID and remove its pool data
    const videoWithPool = videos.find((v) => v.poolId === id);
    if (videoWithPool) {
      updateVideo(videoWithPool.id, {
        poolId: null,
        poolStatus: null,
        poolQuestion: null,
        poolParticipants: 0,
        poolTotalStake: 0,
        poolTimeRemaining: null,
        poolTargetViews: null,
        poolCurrentViews: 0,
        poolCreatedAt: null,
        poolOdds: null,
      });
    }
  };

  const getPoolById = (id: number): Pool | undefined => {
    return pools.find((pool) => pool.id === id);
  };

  const filteredPools = (
    filter: "active" | "settled" | "expired" | "all"
  ): Pool[] => {
    let filteredPools = pools;

    if (filter !== "all") {
      filteredPools = pools.filter(
        (pool) => pool.status.toLowerCase() === filter.toLowerCase()
      );
    }

    // Sort by ID descending (newest first), then by createdAt if available
    return filteredPools.sort((a, b) => {
      // First try to sort by createdAt if both have it
      if (a.createdAt && b.createdAt) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      // Fallback to ID sorting (newer pools have higher IDs)
      return b.id - a.id;
    });
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        theme,
        setTheme,
        videos,
        setVideos,
        updateVideo,
        getVideoById,
        pools,
        addPool,
        updatePool,
        deletePool,
        getPoolById,
        filteredPools,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
