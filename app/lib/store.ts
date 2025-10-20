import { create } from "zustand";

// Define the types for our store
interface Pool {
  id: number;
  title: string;
  creator: string;
  status: string;
  timeRemaining: string;
  totalStake: number;
  participants: number;
  // Add other pool properties as needed
}

interface Prediction {
  id: number;
  poolId: number;
  choice: "yes" | "no";
  stake: number;
  // Add other prediction properties as needed
}

interface AppState {
  // Navigation and UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Pool state
  pools: Pool[];
  selectedPools: Pool[];
  setPools: (pools: Pool[]) => void;
  addPool: (pool: Pool) => void;
  updatePool: (id: number, updates: Partial<Pool>) => void;
  setSelectedPools: (pools: Pool[]) => void;

  // Prediction state
  predictions: Prediction[];
  userPredictions: { [poolId: number]: "yes" | "no" };
  setUserPrediction: (poolId: number, choice: "yes" | "no") => void;
  clearUserPrediction: (poolId: number) => void;
  addPrediction: (prediction: Prediction) => void;
  updatePrediction: (id: number, updates: Partial<Prediction>) => void;

  // Filter and search state
  activeTab: string;
  selectedCategory: string;
  searchQuery: string;
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;

  // Wallet state
  walletBalance: number;
  setWalletBalance: (balance: number) => void;

  // Actions
  reset: () => void;
}

// Define the initial state
const initialState = {
  sidebarOpen: false,
  pools: [],
  selectedPools: [],
  predictions: [],
  userPredictions: {},
  activeTab: "active",
  selectedCategory: "all",
  searchQuery: "",
  walletBalance: 0,
};

// Create the Zustand store
export const useStore = create<AppState>((set, get) => ({
  ...initialState,

  // Navigation actions
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  // Pool actions
  setPools: (pools: Pool[]) => set({ pools }),
  addPool: (pool: Pool) => set((state) => ({ pools: [...state.pools, pool] })),
  updatePool: (id: number, updates: Partial<Pool>) =>
    set((state) => ({
      pools: state.pools.map((pool) =>
        pool.id === id ? { ...pool, ...updates } : pool
      ),
    })),
  setSelectedPools: (selectedPools: Pool[]) => set({ selectedPools }),

  // Prediction actions
  setUserPrediction: (poolId: number, choice: "yes" | "no") =>
    set((state) => ({
      userPredictions: {
        ...state.userPredictions,
        [poolId]: choice,
      },
    })),
  clearUserPrediction: (poolId: number) =>
    set((state) => {
      const newPredictions = { ...state.userPredictions };
      delete newPredictions[poolId];
      return { userPredictions: newPredictions };
    }),
  addPrediction: (prediction: Prediction) =>
    set((state) => ({ predictions: [...state.predictions, prediction] })),
  updatePrediction: (id: number, updates: Partial<Prediction>) =>
    set((state) => ({
      predictions: state.predictions.map((prediction) =>
        prediction.id === id ? { ...prediction, ...updates } : prediction
      ),
    })),

  // Filter actions
  setActiveTab: (activeTab: string) => set({ activeTab }),
  setSelectedCategory: (selectedCategory: string) => set({ selectedCategory }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  // Wallet actions
  setWalletBalance: (walletBalance: number) => set({ walletBalance }),

  // Reset action
  reset: () => set(initialState),
}));

// Selector hooks for specific parts of the store
export const useSidebar = () =>
  useStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    setSidebarOpen: state.setSidebarOpen,
  }));

export const usePools = () =>
  useStore((state) => ({
    pools: state.pools,
    setPools: state.setPools,
    addPool: state.addPool,
    updatePool: state.updatePool,
    selectedPools: state.selectedPools,
    setSelectedPools: state.setSelectedPools,
  }));

export const usePredictions = () =>
  useStore((state) => ({
    predictions: state.predictions,
    userPredictions: state.userPredictions,
    setUserPrediction: state.setUserPrediction,
    clearUserPrediction: state.clearUserPrediction,
    addPrediction: state.addPrediction,
    updatePrediction: state.updatePrediction,
  }));

export const useFilters = () =>
  useStore((state) => ({
    activeTab: state.activeTab,
    selectedCategory: state.selectedCategory,
    searchQuery: state.searchQuery,
    setActiveTab: state.setActiveTab,
    setSelectedCategory: state.setSelectedCategory,
    setSearchQuery: state.setSearchQuery,
  }));

export const useWallet = () =>
  useStore((state) => ({
    walletBalance: state.walletBalance,
    setWalletBalance: state.setWalletBalance,
  }));
