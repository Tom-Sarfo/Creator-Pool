import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { API_CONFIG } from "../lib/api-config";
import { useAuth } from "./AuthContext";
import { useWebSocket } from "../services/websocket.service";
import {
  youtubeService,
  poolService,
  predictionService,
  walletService,
  analyticsService,
  PoolService,
} from "../services";
import type {
  Video,
  Pool,
  Prediction,
  User,
  WalletBalanceResponse,
  CreatorAnalyticsResponse,
  PredictorAnalyticsResponse,
} from "../types/api";
import type { ToastData } from "../components/Toast";

// Feature flag for mock data fallback
const USE_MOCK_DATA = API_CONFIG.USE_MOCK_DATA;

// Mock data imports (fallback)
import { ALL_VIDEOS } from "../lib/constants";

// Unified interfaces for backward compatibility
export interface UnifiedVideo {
  // Core video fields
  id: string;
  youtubeId: string;
  title: string;
  description?: string;
  thumbnail: string;
  status: "unlisted" | "private" | "public";
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  publishedAt: string;
  lastSyncedAt?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;

  // Legacy fields for backward compatibility
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
  poolCreatorPledge: number;
  poolPredictorStakes: number;
  poolTimeRemaining: string | null;
  poolTargetViews: number | null;
  poolCurrentViews: number;
  poolCreatedAt: string | null;
  poolClosesAt?: string | null;
  poolPublishedAt?: string | null;
  poolClosedAt?: string | null;
  poolSettledAt?: string | null;
  poolDuration?: number;
  poolPredictionWindow?: number;
  poolOdds: { yes: number; no: number } | null;
  poolYesStake: number;
  poolNoStake: number;
  poolYesCount: number;
  poolNoCount: number;
}

export interface UnifiedPool {
  // Core pool fields
  id: string;
  videoId: string;
  creatorId: string;
  question: string;
  targetViews: number;
  duration: number;
  predictionWindow: number;
  status: "open" | "awaiting_release" | "live_tracking" | "closed" | "settled";
  totalStake: number;
  creatorPledge: number;
  predictorStakes: number;
  yesStake: number;
  noStake: number;
  yesCount: number;
  noCount: number;
  participants: number;
  currentViews: number;
  yesOdds?: number;
  noOdds?: number;
  result?: boolean;
  creatorEarnings: number;
  closesAt?: string;
  publishedAt?: string;
  closedAt?: string;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;

  // Legacy fields for backward compatibility
  title?: string;
  videoTitle?: string;
  creator?: string;
  creatorVerified?: boolean;
  creatorSubs?: string;
  thumbnail?: string;
  category?: string;
  timeRemaining: string;
}

export interface UnifiedPrediction extends Prediction {
  // Legacy fields for backward compatibility
  predictorName: string;
}

interface AppState {
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  // Loading States
  isLoading: boolean;
  isYouTubeLoading: boolean;
  isPoolsLoading: boolean;
  isPredictionsLoading: boolean;
  isWalletLoading: boolean;

  // Data State
  videos: UnifiedVideo[];
  pools: UnifiedPool[];
  predictions: UnifiedPrediction[];
  walletBalance: WalletBalanceResponse | null;
  creatorAnalytics: CreatorAnalyticsResponse | null;
  predictorAnalytics: PredictorAnalyticsResponse | null;

  // YouTube Integration
  youtubeChannel: any | null;
  isYouTubeConnected: boolean;
  lastYouTubeSync: string | null;
  syncYouTubeVideos: () => Promise<void>;

  // Data Management Functions
  updateVideo: (id: string, updates: Partial<UnifiedVideo>) => void;
  getVideoById: (id: string) => UnifiedVideo | undefined;
  addPool: (pool: Omit<UnifiedPool, "id">) => Promise<void>;
  updatePool: (id: string, updates: Partial<UnifiedPool>) => Promise<void>;
  deletePool: (id: string) => Promise<void>;
  getPoolById: (id: string) => UnifiedPool | undefined;
  filteredPools: (
    filter: "active" | "settled" | "expired" | "all"
  ) => UnifiedPool[];
  addPrediction: (prediction: Omit<UnifiedPrediction, "id">) => Promise<void>;
  updatePrediction: (
    id: string,
    updates: Partial<UnifiedPrediction>
  ) => Promise<void>;
  getPredictionsByPoolId: (poolId: string) => UnifiedPrediction[];
  getPredictionsByPredictor: (predictorId: string) => UnifiedPrediction[];
  calculatePoolOdds: (poolId: string) => { yes: number; no: number };

  // Pool Lifecycle Management
  updatePoolStatus: (poolId: string, newStatus: string) => Promise<void>;
  transitionPoolToNextStage: (poolId: string) => Promise<void>;
  checkAndUpdatePoolLifecycle: () => Promise<void>;

  // Toast Management
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;

  // Error Handling
  error: string | null;
  clearError: () => void;

  // Refresh Functions
  refreshVideos: () => Promise<void>;
  refreshPools: () => Promise<void>;
  refreshPredictions: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  checkYouTubeConnection: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { wsClient, on: wsOn, off: wsOff } = useWebSocket();

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isYouTubeLoading, setIsYouTubeLoading] = useState(false);
  const [isPoolsLoading, setIsPoolsLoading] = useState(false);
  const [isPredictionsLoading, setIsPredictionsLoading] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  // Data State
  const [videos, setVideos] = useState<UnifiedVideo[]>([]);
  const [pools, setPools] = useState<UnifiedPool[]>([]);
  const [predictions, setPredictions] = useState<UnifiedPrediction[]>([]);
  const [walletBalance, setWalletBalance] =
    useState<WalletBalanceResponse | null>(null);
  const [creatorAnalytics, setCreatorAnalytics] =
    useState<CreatorAnalyticsResponse | null>(null);
  const [predictorAnalytics, setPredictorAnalytics] =
    useState<PredictorAnalyticsResponse | null>(null);

  // YouTube Integration State
  const [youtubeChannel, setYoutubeChannel] = useState<any | null>(null);
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [lastYouTubeSync, setLastYouTubeSync] = useState<string | null>(null);

  // Toast State
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeData();
    } else if (USE_MOCK_DATA) {
      // Fallback to mock data when not authenticated
      initializeMockData();
    }
  }, [isAuthenticated, user]);

  // WebSocket event listeners
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Join user-specific room for personal updates
    wsClient.joinUser(user.id);

    // Set up WebSocket event listeners
    const handlePoolUpdate = () => {
      refreshPools();
    };

    const handleNewPrediction = () => {
      refreshPredictions();
      refreshPools();
    };

    const handleOddsUpdate = () => {
      refreshPools();
    };

    const handlePoolStatusChange = () => {
      refreshPools();
    };

    wsOn("poolUpdate", handlePoolUpdate);
    wsOn("newPrediction", handleNewPrediction);
    wsOn("oddsUpdate", handleOddsUpdate);
    wsOn("poolStatusChange", handlePoolStatusChange);

    return () => {
      wsOff("poolUpdate", handlePoolUpdate);
      wsOff("newPrediction", handleNewPrediction);
      wsOff("oddsUpdate", handleOddsUpdate);
      wsOff("poolStatusChange", handlePoolStatusChange);
      wsClient.leaveUser(user.id);
    };
  }, [isAuthenticated, user, wsClient, wsOn, wsOff]);

  // Initialize mock data (fallback)
  const initializeMockData = useCallback(() => {
    if (!USE_MOCK_DATA) return;

    // Convert mock videos to UnifiedVideo format
    const mockVideos: UnifiedVideo[] = ALL_VIDEOS.map((video) => ({
      id: video.id.toString(),
      youtubeId: `mock-${video.id}`,
      title: video.title,
      description: "",
      thumbnail: video.thumbnail,
      status: video.status as "unlisted" | "private" | "public",
      viewCount: video.views,
      likeCount: video.likes,
      commentCount: 0,
      duration: video.duration,
      publishedAt: video.uploadDate,
      lastSyncedAt: undefined,
      creatorId: "mock-creator",
      createdAt: video.uploadDate,
      updatedAt: video.uploadDate,
      // Legacy fields
      creator: video.creator,
      creatorVerified: video.creatorVerified,
      creatorSubs: video.creatorSubs,
      category: video.category,
      // Pool fields
      poolId: video.poolId,
      poolStatus: video.poolStatus,
      poolQuestion: video.poolQuestion,
      poolParticipants: video.poolParticipants,
      poolTotalStake: video.poolTotalStake,
      poolCreatorPledge: video.poolCreatorPledge,
      poolPredictorStakes: video.poolPredictorStakes,
      poolTimeRemaining: video.poolTimeRemaining,
      poolTargetViews: video.poolTargetViews,
      poolCurrentViews: video.poolCurrentViews,
      poolCreatedAt: video.poolCreatedAt,
      poolClosesAt: undefined,
      poolPublishedAt: undefined,
      poolClosedAt: undefined,
      poolSettledAt: undefined,
      poolDuration: undefined,
      poolPredictionWindow: undefined,
      poolOdds: video.poolOdds,
      poolYesStake: video.poolYesStake,
      poolNoStake: video.poolNoStake,
      poolYesCount: video.poolYesCount,
      poolNoCount: video.poolNoCount,
    }));

    setVideos(mockVideos);

    // Derive pools from mock videos
    const mockPools: UnifiedPool[] = ALL_VIDEOS.filter(
      (video) => video.poolId !== null
    ).map((video, index) => ({
      id: String(video.poolId),
      videoId: video.id.toString(),
      creatorId: "mock-creator",
      question: video.poolQuestion || "Mock question",
      targetViews: video.poolTargetViews || 10000,
      duration: 7,
      predictionWindow: 10,
      status: (video.poolStatus || "open") as
        | "open"
        | "awaiting_release"
        | "live_tracking"
        | "closed"
        | "settled",
      totalStake: video.poolTotalStake || 0,
      creatorPledge: video.poolCreatorPledge || 0,
      predictorStakes: video.poolPredictorStakes || 0,
      yesStake: video.poolYesStake || 0,
      noStake: video.poolNoStake || 0,
      yesCount: video.poolYesCount || 0,
      noCount: video.poolNoCount || 0,
      participants: video.poolParticipants || 0,
      currentViews: video.poolCurrentViews || 0,
      yesOdds: 0.5,
      noOdds: 0.5,
      result: undefined,
      creatorEarnings: 0,
      closesAt: undefined,
      publishedAt: undefined,
      closedAt: undefined,
      settledAt: undefined,
      createdAt: video.poolCreatedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Legacy fields
      title: video.title,
      videoTitle: video.title,
      creator: video.creator,
      creatorVerified: video.creatorVerified,
      creatorSubs: video.creatorSubs,
      thumbnail: video.thumbnail,
      category: video.category,
      timeRemaining: video.poolTimeRemaining || "10:00",
    }));

    setPools(mockPools);
  }, []);

  // Initialize real data from API
  const initializeData = useCallback(async () => {
    if (!user || !isAuthenticated) {
      return;
    }

    setIsLoading(true);
    try {
      await Promise.all([
        refreshVideos(),
        refreshPools(),
        refreshPredictions(),
        refreshWallet(),
        refreshAnalytics(),
        checkYouTubeConnection(),
      ]);
    } catch (error) {
      console.error("AppContext: Error initializing data:", error);
      console.error("AppContext: Error details:", {
        error,
        message: (error as any)?.message,
        status: (error as any)?.status,
      });
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Data refresh functions
  const refreshVideos = useCallback(async () => {
    if (!isAuthenticated || USE_MOCK_DATA) return;

    try {
      const apiVideos = await youtubeService.getAllVideos();

      const unifiedVideos = apiVideos.map((video) => ({
        ...video,
        // Legacy fields
        creator: video.creator?.name || "Unknown",
        creatorVerified: false,
        creatorSubs: "0",
        category: "Entertainment",
        // Pool fields (will be populated by pools)
        poolId: null,
        poolStatus: null,
        poolQuestion: null,
        poolParticipants: 0,
        poolTotalStake: 0,
        poolCreatorPledge: 0,
        poolPredictorStakes: 0,
        poolTimeRemaining: null,
        poolTargetViews: null,
        poolCurrentViews: video.viewCount,
        poolCreatedAt: null,
        poolClosesAt: null,
        poolPublishedAt: null,
        poolClosedAt: null,
        poolSettledAt: null,
        poolDuration: undefined,
        poolPredictionWindow: undefined,
        poolOdds: null,
        poolYesStake: 0,
        poolNoStake: 0,
        poolYesCount: 0,
        poolNoCount: 0,
      })) as UnifiedVideo[];

      setVideos(unifiedVideos);
    } catch (error) {
      console.error("AppContext: Error refreshing videos:", error);
      console.error("AppContext: Error details:", {
        error,
        message: (error as any)?.message,
        status: (error as any)?.status,
      });
      if (USE_MOCK_DATA) {
        initializeMockData();
      }
    }
  }, [isAuthenticated, initializeMockData]);

  const refreshPools = useCallback(async () => {
    if (!isAuthenticated || USE_MOCK_DATA) return;

    setIsPoolsLoading(true);
    try {
      const apiPools = await poolService.getAllPools();
      const unifiedPools: UnifiedPool[] = apiPools.map((pool) => ({
        ...pool,
        // Legacy fields
        title: pool.video?.title,
        videoTitle: pool.video?.title,
        videoId: pool.videoId,
        creator: pool.creator?.name,
        creatorVerified: false,
        creatorSubs: "0",
        thumbnail: pool.video?.thumbnail,
        category: "Entertainment",
        timeRemaining: PoolService.getTimeRemaining(pool),
      }));

      setPools(unifiedPools);
    } catch (error) {
      console.error("Error refreshing pools:", error);
    } finally {
      setIsPoolsLoading(false);
    }
  }, [isAuthenticated]);

  const refreshPredictions = useCallback(async () => {
    if (!isAuthenticated || USE_MOCK_DATA) return;

    setIsPredictionsLoading(true);
    try {
      const apiPredictions = await predictionService.getAllPredictions();
      const unifiedPredictions = apiPredictions.map((prediction) => ({
        ...prediction,
        // Legacy fields
        predictorName: prediction.predictor?.name || "Unknown",
      })) as UnifiedPrediction[];

      setPredictions(unifiedPredictions);
    } catch (error) {
      console.error("Error refreshing predictions:", error);
    } finally {
      setIsPredictionsLoading(false);
    }
  }, [isAuthenticated]);

  const refreshWallet = useCallback(async () => {
    if (!isAuthenticated || USE_MOCK_DATA) return;

    setIsWalletLoading(true);
    try {
      const balance = await walletService.getBalance();
      setWalletBalance(balance);
    } catch (error) {
      console.error("Error refreshing wallet:", error);
    } finally {
      setIsWalletLoading(false);
    }
  }, [isAuthenticated]);

  const refreshAnalytics = useCallback(async () => {
    if (!isAuthenticated || !user || USE_MOCK_DATA) return;

    try {
      if (user.role === "creator") {
        const analytics = await analyticsService.getCreatorAnalytics(user.id);
        setCreatorAnalytics(analytics);
      } else if (user.role === "predictor") {
        const analytics = await analyticsService.getPredictorAnalytics(user.id);
        setPredictorAnalytics(analytics);
      }
    } catch (error) {
      console.error("Error refreshing analytics:", error);
    }
  }, [isAuthenticated, user]);

  const checkYouTubeConnection = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    if (USE_MOCK_DATA) {
      return;
    }

    setIsYouTubeLoading(true);
    try {
      const isConnected = await youtubeService.isConnected();

      if (isConnected) {
        try {
          const status = await youtubeService.getConnectionStatus();

          if (status.connected && status.channelId) {
            setYoutubeChannel({
              id: status.channelId,
              name: `YouTube Channel`,
              channelName: `YouTube Channel`,
              channelId: status.channelId,
              lastSyncAt: status.lastSyncAt,
            });
            setIsYouTubeConnected(true);
          } else {
            setIsYouTubeConnected(true);
            setYoutubeChannel(null);
          }
        } catch {
          setIsYouTubeConnected(true);
          setYoutubeChannel(null);
        }
      } else {
        setIsYouTubeConnected(false);
        setYoutubeChannel(null);
      }
    } catch (error: any) {
      setIsYouTubeConnected(false);
      setYoutubeChannel(null);
      throw error;
    } finally {
      setIsYouTubeLoading(false);
    }
  }, [isAuthenticated]);

  // YouTube sync function
  const syncYouTubeVideos = useCallback(async () => {
    if (!isAuthenticated || USE_MOCK_DATA) return;

    setIsYouTubeLoading(true);
    try {
      await youtubeService.syncVideos();
      setLastYouTubeSync(new Date().toISOString());

      // Add a small delay to ensure backend has finished processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await refreshVideos();

      addToast({
        type: "success",
        title: "YouTube Sync Complete",
        message: `Your videos have been synced successfully. ${videos.length} videos available.`,
      });
    } catch (error) {
      console.error("AppContext: Error syncing YouTube videos:", error);
      addToast({
        type: "error",
        title: "Sync Failed",
        message: "Failed to sync YouTube videos. Please try again.",
      });
      throw error; // Re-throw so caller can show error
    } finally {
      setIsYouTubeLoading(false);
    }
  }, [isAuthenticated, refreshVideos, videos.length]);

  // Data management functions
  const updateVideo = useCallback(
    (id: string, updates: Partial<UnifiedVideo>) => {
      setVideos((prev) =>
        prev.map((video) =>
          video.id === id ? { ...video, ...updates } : video
        )
      );
    },
    []
  );

  const getVideoById = useCallback(
    (id: string): UnifiedVideo | undefined => {
      return videos.find((video) => video.id === id);
    },
    [videos]
  );

  const addPool = useCallback(
    async (poolData: Omit<UnifiedPool, "id">) => {
      if (USE_MOCK_DATA) {
        const newPool = {
          ...poolData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as UnifiedPool;
        setPools((prev) => [...prev, newPool]);
        return;
      }

      try {
        const newPool = await poolService.createPool({
          videoId: poolData.videoId!.toString(),
          question: poolData.question,
          targetViews: poolData.targetViews || 10000,
          duration: poolData.duration,
          predictionWindow: poolData.predictionWindow,
          creatorPledge: poolData.creatorPledge,
        });

        await refreshPools();
        addToast({
          type: "success",
          title: "Pool Created",
          message: "Your prediction pool has been created successfully.",
        });
      } catch (error) {
        console.error("Error creating pool:", error);
        addToast({
          type: "error",
          title: "Creation Failed",
          message: "Failed to create pool. Please try again.",
        });
      }
    },
    [refreshPools]
  );

  const updatePool = useCallback(
    async (id: string, updates: Partial<UnifiedPool>) => {
      if (USE_MOCK_DATA) {
        setPools((prev) =>
          prev.map((pool) =>
            pool.id === id
              ? { ...pool, ...updates, updatedAt: new Date().toISOString() }
              : pool
          )
        );
        return;
      }

      try {
        await poolService.updatePoolStatus(id, updates.status!);
        await refreshPools();
      } catch (error) {
        console.error("Error updating pool:", error);
      }
    },
    [refreshPools]
  );

  const deletePool = useCallback(
    async (id: string) => {
      if (USE_MOCK_DATA) {
        setPools((prev) => prev.filter((pool) => pool.id !== id));
        return;
      }

      try {
        // Note: Backend might not support pool deletion
        await refreshPools();
      } catch (error) {
        console.error("Error deleting pool:", error);
      }
    },
    [refreshPools]
  );

  const getPoolById = useCallback(
    (id: string): UnifiedPool | undefined => {
      return pools.find((pool) => pool.id === id);
    },
    [pools]
  );

  const filteredPools = useCallback(
    (filter: "active" | "settled" | "expired" | "all"): UnifiedPool[] => {
      switch (filter) {
        case "active":
          return pools.filter((pool) =>
            ["open", "awaiting_release", "live_tracking"].includes(pool.status)
          );
        case "settled":
          return pools.filter((pool) => pool.status === "settled");
        case "expired":
          return pools.filter((pool) => pool.status === "closed");
        case "all":
        default:
          return pools;
      }
    },
    [pools]
  );

  const addPrediction = useCallback(
    async (predictionData: Omit<UnifiedPrediction, "id">) => {
      if (USE_MOCK_DATA) {
        const newPrediction = {
          ...predictionData,
          id: Date.now().toString(),
          predictedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as UnifiedPrediction;
        setPredictions((prev) => [...prev, newPrediction]);
        return;
      }

      try {
        await predictionService.createPrediction({
          poolId: predictionData.poolId,
          choice: predictionData.choice,
          stake: predictionData.stake,
        });

        await refreshPredictions();
        await refreshPools();
        addToast({
          type: "success",
          title: "Prediction Placed",
          message: "Your prediction has been placed successfully.",
        });
      } catch (error) {
        console.error("Error creating prediction:", error);
        addToast({
          type: "error",
          title: "Prediction Failed",
          message: "Failed to place prediction. Please try again.",
        });
      }
    },
    [refreshPredictions, refreshPools]
  );

  const updatePrediction = useCallback(
    async (id: string, updates: Partial<UnifiedPrediction>) => {
      if (USE_MOCK_DATA) {
        setPredictions((prev) =>
          prev.map((prediction) =>
            prediction.id === id
              ? {
                  ...prediction,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : prediction
          )
        );
        return;
      }

      try {
        // Note: Backend might not support prediction updates
        await refreshPredictions();
      } catch (error) {
        console.error("Error updating prediction:", error);
      }
    },
    [refreshPredictions]
  );

  const getPredictionsByPoolId = useCallback(
    (poolId: string): UnifiedPrediction[] => {
      return predictions.filter((prediction) => prediction.poolId === poolId);
    },
    [predictions]
  );

  const getPredictionsByPredictor = useCallback(
    (predictorId: string): UnifiedPrediction[] => {
      return predictions.filter(
        (prediction) => prediction.predictorId === predictorId
      );
    },
    [predictions]
  );

  const calculatePoolOdds = useCallback(
    (poolId: string): { yes: number; no: number } => {
      const pool = getPoolById(poolId);
      if (!pool) return { yes: 0.5, no: 0.5 };

      return PoolService.calculateOdds(pool.yesStake || 0, pool.noStake || 0);
    },
    [getPoolById]
  );

  // Pool lifecycle management
  const updatePoolStatus = useCallback(
    async (poolId: string, newStatus: string) => {
      await updatePool(poolId, {
        status: newStatus as
          | "open"
          | "awaiting_release"
          | "live_tracking"
          | "closed"
          | "settled",
      });
    },
    [updatePool]
  );

  const transitionPoolToNextStage = useCallback(
    async (poolId: string) => {
      const pool = getPoolById(poolId);
      if (!pool) return;

      const statusTransitions: Record<string, string> = {
        open: "awaiting_release",
        awaiting_release: "live_tracking",
        live_tracking: "closed",
        closed: "settled",
      };

      const nextStatus = statusTransitions[pool.status];
      if (nextStatus) {
        await updatePoolStatus(poolId, nextStatus);
      }
    },
    [getPoolById, updatePoolStatus]
  );

  const checkAndUpdatePoolLifecycle = useCallback(async () => {
    if (USE_MOCK_DATA) return;

    // This would typically be handled by the backend with scheduled tasks
    // For now, we'll just refresh the pools to get the latest status
    await refreshPools();
  }, [refreshPools]);

  // Toast management
  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue: AppState = {
    // UI State
    sidebarOpen,
    setSidebarOpen,
    theme,
    setTheme,

    // Loading States
    isLoading,
    isYouTubeLoading,
    isPoolsLoading,
    isPredictionsLoading,
    isWalletLoading,

    // Data State
    videos,
    pools,
    predictions,
    walletBalance,
    creatorAnalytics,
    predictorAnalytics,

    // YouTube Integration
    youtubeChannel,
    isYouTubeConnected,
    lastYouTubeSync,
    syncYouTubeVideos,

    // Data Management Functions
    updateVideo,
    getVideoById,
    addPool,
    updatePool,
    deletePool,
    getPoolById,
    filteredPools,
    addPrediction,
    updatePrediction,
    getPredictionsByPoolId,
    getPredictionsByPredictor,
    calculatePoolOdds,

    // Pool Lifecycle Management
    updatePoolStatus,
    transitionPoolToNextStage,
    checkAndUpdatePoolLifecycle,

    // Toast Management
    toasts,
    addToast,
    removeToast,

    // Error Handling
    error,
    clearError,

    // Refresh Functions
    refreshVideos,
    refreshPools,
    refreshPredictions,
    refreshWallet,
    refreshAnalytics,
    checkYouTubeConnection,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
