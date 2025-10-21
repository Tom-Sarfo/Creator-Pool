import { createContext, useContext, useState, type ReactNode } from "react";
import { ALL_VIDEOS } from "../lib/constants";
import { calculateDynamicOdds } from "../lib/utils";
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
  poolCreatorPledge: number; // Creator's pledged amount
  poolPredictorStakes: number; // Total amount staked by predictors
  poolTimeRemaining: string | null;
  poolTargetViews: number | null;
  poolCurrentViews: number;
  poolCreatedAt: string | null;
  poolOdds: { yes: number; no: number } | null;
  poolYesStake: number;
  poolNoStake: number;
  poolYesCount: number;
  poolNoCount: number;
}

// Prediction interfaces
export interface Prediction {
  id: number;
  poolId: number;
  predictorId: string; // User ID
  predictorName: string;
  choice: "yes" | "no";
  stake: number;
  predictedAt: string;
  potentialPayout?: number;
  actualPayout?: number;
  result?: "won" | "lost" | "pending";
  settledAt?: string;
}

export interface PredictorPoolStats {
  yesStake: number;
  noStake: number;
  yesCount: number;
  noCount: number;
  yesPercentage: number;
  noPercentage: number;
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
  totalStake: number; // Total pool amount (includes both predictor stakes and creator pledge)
  creatorPledge?: number; // Creator's pledged amount (separate from predictor stakes)
  predictorStakes?: number; // Total amount staked by predictors only
  timeRemaining: string;
  status: string;
  createdAt?: string;
  targetViews?: number;
  currentViews?: number;
  duration?: number; // Duration in days for the pool
  odds?: { yes: number; no: number };
  result?: string;
  creatorEarnings?: number;
  predictions?: Prediction[]; // Individual predictions on this pool
  yesStake?: number; // Total stake on YES
  noStake?: number; // Total stake on NO
  yesCount?: number; // Number of YES predictors
  noCount?: number; // Number of NO predictors
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

  // Prediction state
  predictions: Prediction[];
  addPrediction: (prediction: Omit<Prediction, "id">) => void;
  updatePrediction: (id: number, updates: Partial<Prediction>) => void;
  getPredictionsByPoolId: (poolId: number) => Prediction[];
  getPredictionsByPredictor: (predictorId: string) => Prediction[];
  calculatePoolOdds: (poolId: number) => { yes: number; no: number };

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
  const [predictions, setPredictions] = useState<Prediction[]>([]);

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
      creatorPledge: video.poolCreatorPledge || 0,
      predictorStakes: video.poolPredictorStakes || 0,
      timeRemaining: video.poolTimeRemaining!,
      status: video.poolStatus!,
      createdAt: video.poolCreatedAt || undefined,
      targetViews: video.poolTargetViews || undefined,
      currentViews: video.poolCurrentViews,
      odds: video.poolOdds || undefined,
      yesStake: video.poolYesStake || 0,
      noStake: video.poolNoStake || 0,
      yesCount: video.poolYesCount || 0,
      noCount: video.poolNoCount || 0,
      predictions: predictions.filter((p) => p.poolId === video.poolId),
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
          poolCreatorPledge: newPool.creatorPledge || 0,
          poolPredictorStakes: newPool.predictorStakes || 0,
          poolTimeRemaining: newPool.timeRemaining,
          poolTargetViews: newPool.targetViews || null,
          poolCurrentViews: newPool.currentViews || 0,
          poolCreatedAt: newPool.createdAt || null,
          poolOdds: newPool.odds || null,
          poolYesStake: newPool.yesStake || 0,
          poolNoStake: newPool.noStake || 0,
          poolYesCount: newPool.yesCount || 0,
          poolNoCount: newPool.noCount || 0,
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
        poolCreatorPledge:
          updates.creatorPledge ?? videoWithPool.poolCreatorPledge,
        poolPredictorStakes:
          updates.predictorStakes ?? videoWithPool.poolPredictorStakes,
        poolTimeRemaining:
          updates.timeRemaining || videoWithPool.poolTimeRemaining,
        poolTargetViews: updates.targetViews ?? videoWithPool.poolTargetViews,
        poolCurrentViews:
          updates.currentViews ?? videoWithPool.poolCurrentViews,
        poolOdds: updates.odds || videoWithPool.poolOdds,
        poolYesStake: updates.yesStake ?? videoWithPool.poolYesStake,
        poolNoStake: updates.noStake ?? videoWithPool.poolNoStake,
        poolYesCount: updates.yesCount ?? videoWithPool.poolYesCount,
        poolNoCount: updates.noCount ?? videoWithPool.poolNoCount,
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
        poolCreatorPledge: 0,
        poolPredictorStakes: 0,
        poolTimeRemaining: null,
        poolTargetViews: null,
        poolCurrentViews: 0,
        poolCreatedAt: null,
        poolOdds: null,
        poolYesStake: 0,
        poolNoStake: 0,
        poolYesCount: 0,
        poolNoCount: 0,
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

  // Prediction management functions
  const addPrediction = (newPrediction: Omit<Prediction, "id">) => {
    const nextPredictionId =
      predictions.length > 0
        ? Math.max(...predictions.map((p) => p.id)) + 1
        : 1;

    const prediction: Prediction = {
      ...newPrediction,
      id: nextPredictionId,
    };

    setPredictions((prev) => [...prev, prediction]);

    // Update pool aggregates
    updatePoolStakes(prediction.poolId, prediction.choice, prediction.stake);
  };

  const updatePrediction = (id: number, updates: Partial<Prediction>) => {
    setPredictions((prev) =>
      prev.map((prediction) =>
        prediction.id === id ? { ...prediction, ...updates } : prediction
      )
    );
  };

  const getPredictionsByPoolId = (poolId: number): Prediction[] => {
    return predictions.filter((p) => p.poolId === poolId);
  };

  const getPredictionsByPredictor = (predictorId: string): Prediction[] => {
    return predictions.filter((p) => p.predictorId === predictorId);
  };

  const calculatePoolOdds = (poolId: number): { yes: number; no: number } => {
    const videoWithPool = videos.find((v) => v.poolId === poolId);
    if (!videoWithPool) {
      return { yes: 0.5, no: 0.5 };
    }
    return calculateDynamicOdds(
      videoWithPool.poolYesStake || 0,
      videoWithPool.poolNoStake || 0
    );
  };

  const updatePoolStakes = (
    poolId: number,
    choice: "yes" | "no",
    stake: number
  ) => {
    const videoWithPool = videos.find((v) => v.poolId === poolId);
    if (!videoWithPool) return;

    const updates: Partial<UnifiedVideo> = {
      poolParticipants: videoWithPool.poolParticipants + 1,
      poolPredictorStakes: videoWithPool.poolPredictorStakes + stake,
      poolTotalStake: videoWithPool.poolTotalStake + stake,
    };

    if (choice === "yes") {
      updates.poolYesStake = (videoWithPool.poolYesStake || 0) + stake;
      updates.poolYesCount = (videoWithPool.poolYesCount || 0) + 1;
    } else {
      updates.poolNoStake = (videoWithPool.poolNoStake || 0) + stake;
      updates.poolNoCount = (videoWithPool.poolNoCount || 0) + 1;
    }

    // Recalculate odds
    const newOdds = calculateDynamicOdds(
      updates.poolYesStake || videoWithPool.poolYesStake || 0,
      updates.poolNoStake || videoWithPool.poolNoStake || 0
    );
    updates.poolOdds = newOdds;

    updateVideo(videoWithPool.id, updates);
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
        predictions,
        addPrediction,
        updatePrediction,
        getPredictionsByPoolId,
        getPredictionsByPredictor,
        calculatePoolOdds,
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
