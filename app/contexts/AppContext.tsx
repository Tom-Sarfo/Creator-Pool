import { createContext, useContext, useState, type ReactNode } from "react";
import { CREATOR_POOLS_DATA, MOCK_POOLS } from "../lib/constants";
import type { ToastData } from "../components/Toast";

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

  // Pool state
  pools: Pool[];
  setPools: (pools: Pool[]) => void;
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

  // Combine both pool datasets and initialize state
  const initialPools: Pool[] = [
    ...CREATOR_POOLS_DATA.map((pool) => ({
      ...pool,
      title: pool.videoTitle, // Map videoTitle to title for consistency
    })),
    ...MOCK_POOLS,
  ];

  const [pools, setPools] = useState<Pool[]>(initialPools);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Toast management functions
  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Pool management functions
  const addPool = (newPool: Omit<Pool, "id">) => {
    const id = pools.length > 0 ? Math.max(...pools.map((p) => p.id)) + 1 : 1;
    const pool: Pool = { ...newPool, id };
    setPools((prev) => [...prev, pool]);

    // Show success toast
    addToast({
      type: "success",
      title: "Pool Created Successfully!",
      message: `Your pool "${pool.title}" has been created and is now active.`,
      duration: 4000,
    });
  };

  const updatePool = (id: number, updates: Partial<Pool>) => {
    setPools((prev) =>
      prev.map((pool) => (pool.id === id ? { ...pool, ...updates } : pool))
    );
  };

  const deletePool = (id: number) => {
    setPools((prev) => prev.filter((pool) => pool.id !== id));
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
        pools,
        setPools,
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
