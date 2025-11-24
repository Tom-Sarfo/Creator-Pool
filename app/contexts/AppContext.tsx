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
  PoolStatus,
  UserRole,
} from "../lib/types";
import {
  UserRole as UserRoleEnum,
  PoolStatus as PoolStatusEnum,
} from "../lib/types";
import type { ToastData } from "../components/Toast";

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
  videos: Video[];
  pools: Pool[];
  predictions: Prediction[];
  walletBalance: WalletBalanceResponse | null;
  creatorAnalytics: CreatorAnalyticsResponse | null;
  predictorAnalytics: PredictorAnalyticsResponse | null;

  // YouTube Integration
  youtubeChannel: any | null;
  isYouTubeConnected: boolean;
  lastYouTubeSync: string | null;
  syncYouTubeVideos: () => Promise<void>;

  // Data Management Functions
  updateVideo: (id: string, updates: Partial<Video>) => void;
  getVideoById: (id: string) => Video | undefined;
  addPool: (
    pool: Omit<Pool, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updatePool: (id: string, updates: Partial<Pool>) => Promise<void>;
  deletePool: (id: string) => Promise<void>;
  getPoolById: (id: string) => Pool | undefined;
  filteredPools: (filter: "active" | "settled" | "expired" | "all") => Pool[];
  addPrediction: (
    prediction: Omit<Prediction, "id" | "predictedAt" | "updatedAt">
  ) => Promise<void>;
  updatePrediction: (id: string, updates: Partial<Prediction>) => Promise<void>;
  getPredictionsByPoolId: (poolId: string) => Prediction[];
  getPredictionsByPredictor: (predictorId: string) => Prediction[];

  // Pool Lifecycle Management
  updatePoolStatus: (poolId: string, newStatus: PoolStatus) => Promise<void>;
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
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

    const handleProbabilityUpdate = () => {
      refreshPools();
    };

    const handlePoolStatusChange = (data?: {
      poolId?: string;
      oldStatus?: string;
      newStatus?: string;
    }) => {
      refreshPools();

      // Show notification if status change data is provided
      if (
        data?.oldStatus &&
        data?.newStatus &&
        data.oldStatus !== data.newStatus
      ) {
        const statusMessages: Record<string, Record<string, string>> = {
          live_tracking: {
            open: "Video is now public! Pool is live tracking.",
            awaiting_release: "Video is now public! Pool is live tracking.",
          },
          awaiting_release: {
            open: "Prediction window closed. Waiting for video release.",
          },
          closed: {
            live_tracking: "Tracking period ended.",
          },
          settled: {
            closed: "Pool has been settled! Check your results.",
          },
        };

        const message = statusMessages[data.newStatus]?.[data.oldStatus];
        if (message) {
          addToast({
            type: "info",
            title: "Pool Status Updated",
            message,
            duration: 5000,
          });
        }
      }
    };

    wsOn("poolUpdate", handlePoolUpdate);
    wsOn("newPrediction", handleNewPrediction);
    wsOn("probabilityUpdate", handleProbabilityUpdate);
    wsOn("poolStatusChange", handlePoolStatusChange);

    return () => {
      wsOff("poolUpdate", handlePoolUpdate);
      wsOff("newPrediction", handleNewPrediction);
      wsOff("probabilityUpdate", handleProbabilityUpdate);
      wsOff("poolStatusChange", handlePoolStatusChange);
      wsClient.leaveUser(user.id);
    };
  }, [isAuthenticated, user, wsClient, wsOn, wsOff]);

  // Mock initialization removed

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
    if (!isAuthenticated || !user) return;

    try {
      const apiVideos = await youtubeService.getAllVideos();
      // Filter videos by creatorId to ensure data isolation
      // Only show videos that belong to the current user
      const filteredVideos = apiVideos.filter(
        (video) => video.creatorId === user.id
      );
      setVideos(filteredVideos);

      // Log a warning if we filtered out videos (indicates backend issue)
      if (apiVideos.length > filteredVideos.length) {
        console.warn(
          `AppContext: Filtered out ${apiVideos.length - filteredVideos.length} videos that don't belong to current user. Backend should filter by creatorId.`
        );
      }
    } catch (error) {
      console.error("AppContext: Error refreshing videos:", error);
      console.error("AppContext: Error details:", {
        error,
        message: (error as any)?.message,
        status: (error as any)?.status,
      });
    }
  }, [isAuthenticated, user]);

  const refreshPools = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setIsPoolsLoading(true);
    try {
      const apiPools = await poolService.getAllPools();
      // Filter pools by creatorId to ensure data isolation
      // Only show pools that belong to the current user (for creators)
      // For predictors, show all pools (they can predict on any pool)
      const filteredPools =
        user.role === UserRoleEnum.CREATOR
          ? apiPools.filter((pool) => pool.creatorId === user.id)
          : apiPools;

      // Ensure numeric fields are numbers (avoid NaN in UI)
      const pools: Pool[] = filteredPools.map((pool) => ({
        ...pool,
        totalStake: Number(pool.totalStake ?? 0),
        creatorPledge: Number(pool.creatorPledge ?? 0),
        predictorStakes: Number(pool.predictorStakes ?? 0),
        yesStake: Number(pool.yesStake ?? 0),
        noStake: Number(pool.noStake ?? 0),
        yesCount: Number(pool.yesCount ?? 0),
        noCount: Number(pool.noCount ?? 0),
        participants: Number(pool.participants ?? 0),
        creatorEarnings: Number(pool.creatorEarnings ?? 0),
      }));
      setPools(pools);

      // Log a warning if we filtered out pools (indicates backend issue)
      if (
        user.role === UserRoleEnum.CREATOR &&
        apiPools.length > filteredPools.length
      ) {
        console.warn(
          `AppContext: Filtered out ${apiPools.length - filteredPools.length} pools that don't belong to current creator. Backend should filter by creatorId.`
        );
      }
    } catch (error) {
      console.error("Error refreshing pools:", error);
    } finally {
      setIsPoolsLoading(false);
    }
  }, [isAuthenticated, user]);

  const refreshPredictions = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsPredictionsLoading(true);
    try {
      const apiPredictions = await predictionService.getAllPredictions();
      setPredictions(apiPredictions);
    } catch (error) {
      console.error("Error refreshing predictions:", error);
    } finally {
      setIsPredictionsLoading(false);
    }
  }, [isAuthenticated]);

  const refreshWallet = useCallback(async () => {
    if (!isAuthenticated) return;

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
    if (!isAuthenticated || !user) return;

    try {
      if (user.role === UserRoleEnum.CREATOR) {
        const analytics = await analyticsService.getCreatorAnalytics(user.id);
        setCreatorAnalytics(analytics);
      } else if (user.role === UserRoleEnum.USER) {
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
    if (!isAuthenticated) return;

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
  const updateVideo = useCallback((id: string, updates: Partial<Video>) => {
    setVideos((prev) =>
      prev.map((video) => (video.id === id ? { ...video, ...updates } : video))
    );
  }, []);

  const getVideoById = useCallback(
    (id: string): Video | undefined => {
      return videos.find((video) => video.id === id);
    },
    [videos]
  );

  const addPool = useCallback(
    async (poolData: Omit<Pool, "id" | "createdAt" | "updatedAt">) => {
      try {
        const newPool = await poolService.createPool({
          videoId: poolData.videoId!.toString(),
          question: poolData.question,
          targetViews: poolData.targetViews || 10000,
          trackingDurationDays: poolData.trackingDurationDays,
          predictionWindowMinutes: poolData.predictionWindowMinutes,
          creatorPledge: poolData.creatorPledge,
        });

        await refreshPools();
        // Refresh wallet after pool creation to reflect pledge deduction
        await refreshWallet();
        addToast({
          type: "success",
          title: "Pool Created",
          message: "Your prediction pool has been created successfully.",
        });
      } catch (error: any) {
        console.error("Error creating pool:", error);
        
        // Extract error message from various possible error formats
        const backendMessage =
          error?.message ||
          error?.data?.message ||
          error?.response?.data?.message ||
          "";
        
        // Map backend error messages to user-friendly messages
        let errorMessage: string;
        let errorTitle: string;
        
        if (
          backendMessage.includes("Insufficient wallet balance") ||
          backendMessage.includes("insufficient wallet balance")
        ) {
          errorTitle = "Insufficient Balance";
          errorMessage =
            "You don't have enough funds. Please reduce your pledge or add funds to your wallet.";
        } else if (backendMessage.includes("Video already has an active pool")) {
          errorTitle = "Pool Already Exists";
          errorMessage = "This video already has an active pool.";
        } else if (backendMessage) {
          errorTitle = "Creation Failed";
          errorMessage = backendMessage;
        } else {
          errorTitle = "Creation Failed";
          errorMessage = "Failed to create pool. Please try again.";
        }
        
        addToast({
          type: "error",
          title: errorTitle,
          message: errorMessage,
          duration: 5000,
        });
        
        // Re-throw error so EnablePoolModal can handle it and show in the form
        throw error;
      }
    },
    [refreshPools, refreshWallet]
  );

  const updatePool = useCallback(
    async (id: string, updates: Partial<Pool>) => {
      try {
        if (updates.status) {
          await poolService.updatePoolStatus(id, updates.status);
        }
        await refreshPools();
      } catch (error) {
        console.error("Error updating pool:", error);
      }
    },
    [refreshPools]
  );

  const deletePool = useCallback(
    async (id: string) => {
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
    (id: string): Pool | undefined => {
      return pools.find((pool) => pool.id === id);
    },
    [pools]
  );

  const filteredPools = useCallback(
    (filter: "active" | "settled" | "expired" | "all"): Pool[] => {
      switch (filter) {
        case "active":
          return pools.filter((pool) =>
            [
              PoolStatusEnum.OPEN,
              PoolStatusEnum.AWAITING_RELEASE,
              PoolStatusEnum.LIVE_TRACKING,
            ].includes(pool.status)
          );
        case "settled":
          return pools.filter((pool) => pool.status === PoolStatusEnum.SETTLED);
        case "expired":
          return pools.filter((pool) => pool.status === PoolStatusEnum.CLOSED);
        case "all":
        default:
          return pools;
      }
    },
    [pools]
  );

  const addPrediction = useCallback(
    async (
      predictionData: Omit<Prediction, "id" | "predictedAt" | "updatedAt">
    ) => {
      try {
        await predictionService.createPrediction({
          poolId: predictionData.poolId,
          choice: predictionData.choice,
          stake: predictionData.stake,
        });

        await refreshPredictions();
        await refreshPools();
        // Refresh wallet after prediction to reflect stake deduction
        await refreshWallet();
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
    [refreshPredictions, refreshPools, refreshWallet]
  );

  const updatePrediction = useCallback(
    async (id: string, updates: Partial<Prediction>) => {
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
    (poolId: string): Prediction[] => {
      return predictions.filter((prediction) => prediction.poolId === poolId);
    },
    [predictions]
  );

  const getPredictionsByPredictor = useCallback(
    (predictorId: string): Prediction[] => {
      return predictions.filter(
        (prediction) => prediction.predictorId === predictorId
      );
    },
    [predictions]
  );

  // Pool lifecycle management
  const updatePoolStatus = useCallback(
    async (poolId: string, newStatus: PoolStatus) => {
      await updatePool(poolId, { status: newStatus });
    },
    [updatePool]
  );

  const transitionPoolToNextStage = useCallback(
    async (poolId: string) => {
      const pool = getPoolById(poolId);
      if (!pool) return;

      const statusTransitions: Record<PoolStatus, PoolStatus | null> = {
        [PoolStatusEnum.OPEN]: PoolStatusEnum.AWAITING_RELEASE,
        [PoolStatusEnum.AWAITING_RELEASE]: PoolStatusEnum.LIVE_TRACKING,
        [PoolStatusEnum.LIVE_TRACKING]: PoolStatusEnum.CLOSED,
        [PoolStatusEnum.CLOSED]: PoolStatusEnum.SETTLED,
        [PoolStatusEnum.SETTLED]: null,
      };

      const nextStatus = statusTransitions[pool.status];
      if (nextStatus) {
        await updatePoolStatus(poolId, nextStatus);
      }
    },
    [getPoolById, updatePoolStatus]
  );

  const checkAndUpdatePoolLifecycle = useCallback(async () => {
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
