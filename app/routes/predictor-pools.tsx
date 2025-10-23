import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { useUser } from "@clerk/react-router";
import { CATEGORIES } from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";
import type { Pool } from "../contexts/AppContext";
import PredictionModal from "../components/PredictionModal";
import PlayButtonOverlay from "../components/PlayButtonOverlay";
import {
  calculateDynamicOdds,
  calculateRemainingTime,
  isTimerUrgent,
  getPoolStatusColor,
  getPoolStatusLabel,
} from "../lib/utils";
import Pagination from "../components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function PredictorPools() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [preselectedChoice, setPreselectedChoice] = useState<
    "yes" | "no" | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { pools, addPrediction, addToast, calculatePoolOdds } = useAppContext();
  const { user } = useUser();
  const categories = CATEGORIES;
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for real-time timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "awaiting_release":
        return "bg-yellow-100 text-yellow-800";
      case "live_tracking":
        return "bg-cyan-100 text-cyan-800";
      case "closed":
        return "bg-orange-100 text-orange-800";
      case "settled":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "awaiting_release":
        return "Awaiting Release";
      case "live_tracking":
        return "Live Tracking";
      case "closed":
        return "Closed";
      case "settled":
        return "Settled";
      default:
        return status;
    }
  };

  const allFilteredPools = pools.filter((pool) => {
    const matchesCategory =
      selectedCategory === "all" || pool.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      pool.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.creator?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.question?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(allFilteredPools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredPools = allFilteredPools.slice(startIndex, endIndex);

  const handlePredictClick = (pool: Pool, choice: "yes" | "no") => {
    setSelectedPool(pool);
    setPreselectedChoice(choice);
    setShowPredictionModal(true);
  };

  const handlePredictionSubmit = (prediction: {
    choice: "yes" | "no";
    stake: number;
  }) => {
    if (!selectedPool) return;

    // Add prediction via context
    addPrediction({
      poolId: selectedPool.id,
      predictorId: user?.id || "anonymous",
      predictorName: user?.fullName || user?.firstName || "Anonymous User",
      choice: prediction.choice,
      stake: prediction.stake,
      predictedAt: new Date().toISOString(),
      result: "pending",
    });

    // Show success toast
    addToast({
      type: "success",
      title: "Prediction Placed!",
      message: `You predicted ${prediction.choice.toUpperCase()} with $${prediction.stake}`,
      duration: 4000,
    });

    setShowPredictionModal(false);
    setSelectedPool(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Pools</h1>
        <p className="text-gray-600">
          Discover and participate in prediction pools from your favorite
          creators
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Active Pools
            </button>
            <button
              onClick={() => setActiveTab("ending")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "ending"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Ending Soon
            </button>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Pool"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-colors"
              />
              <FontAwesomeIcon
                icon="search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPools.map((pool) => (
          <div
            key={pool.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Pool Image */}
            <div className="relative group">
              <Link to={`/predictor/pool/${pool.id}`}>
                <img
                  src={pool.thumbnail}
                  alt={pool.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop";
                  }}
                />
              </Link>
              {/* Play button overlay - only visible on hover */}
              <PlayButtonOverlay />
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pool.status)}`}
                >
                  {getStatusLabel(pool.status)}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-1 rounded text-xs flex items-center space-x-1 font-mono ${
                    pool.status === "open" &&
                    calculateRemainingTime(pool, currentTime) === "00:00"
                      ? "bg-red-600 text-white animate-pulse"
                      : pool.status === "open" &&
                          isTimerUrgent(pool, currentTime)
                        ? "bg-orange-500 text-white animate-pulse"
                        : "bg-black bg-opacity-50 text-white"
                  }`}
                >
                  <FontAwesomeIcon icon="clock" className="w-3 h-3" />
                  <span className="font-bold">
                    {calculateRemainingTime(pool, currentTime)}
                  </span>
                </span>
              </div>
            </div>

            {/* Pool Content */}
            <div className="p-4">
              {/* Creator Info */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">
                  {pool.creator}
                </span>
                {pool.creatorVerified && (
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-4 h-4 text-cyan-500"
                  />
                )}
                <span className="text-xs text-gray-500">
                  {pool.creatorSubs}
                </span>
              </div>

              {/* Video Title */}
              <Link to={`/predictor/pool/${pool.id}`}>
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors">
                  {pool.title}
                </h3>
              </Link>

              {/* Prediction Question */}
              <p className="text-xs text-gray-600 mb-3">{pool.question}</p>

              {/* Pool Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>
                  Pool Size:{" "}
                  <span className="font-semibold">
                    ${pool.totalStake.toLocaleString()}
                  </span>
                </span>
                <span>
                  <span className="font-semibold">
                    {pool.participants.toLocaleString()}
                  </span>{" "}
                  Predictors
                </span>
              </div>

              {/* Odds */}
              <div className="flex space-x-2 mb-4">
                {(() => {
                  const odds =
                    pool.odds ||
                    calculateDynamicOdds(pool.yesStake || 0, pool.noStake || 0);
                  const isPoolOpen = pool.status === "open";
                  return (
                    <>
                      <button
                        onClick={() =>
                          isPoolOpen && handlePredictClick(pool, "yes")
                        }
                        disabled={!isPoolOpen}
                        className={`flex-1 rounded-lg p-2 text-center transition-all ${
                          isPoolOpen
                            ? "cursor-pointer bg-green-50 border border-green-200 hover:bg-green-100"
                            : "cursor-not-allowed bg-gray-50 border border-gray-200 opacity-60"
                        }`}
                      >
                        <div
                          className={`text-xs font-medium ${
                            isPoolOpen ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          YES
                        </div>
                        <div
                          className={`text-sm font-bold ${
                            isPoolOpen ? "text-green-700" : "text-gray-600"
                          }`}
                        >
                          {odds.yes.toFixed(2)}x
                        </div>
                      </button>
                      <button
                        onClick={() =>
                          isPoolOpen && handlePredictClick(pool, "no")
                        }
                        disabled={!isPoolOpen}
                        className={`flex-1 rounded-lg p-2 text-center transition-all ${
                          isPoolOpen
                            ? "cursor-pointer bg-red-50 border border-red-200 hover:bg-red-100"
                            : "cursor-not-allowed bg-gray-50 border border-gray-200 opacity-60"
                        }`}
                      >
                        <div
                          className={`text-xs font-medium ${
                            isPoolOpen ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          NO
                        </div>
                        <div
                          className={`text-sm font-bold ${
                            isPoolOpen ? "text-red-700" : "text-gray-600"
                          }`}
                        >
                          {odds.no.toFixed(2)}x
                        </div>
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={allFilteredPools.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Prediction Modal */}
      {selectedPool && (
        <PredictionModal
          isOpen={showPredictionModal}
          onClose={() => {
            setShowPredictionModal(false);
            setSelectedPool(null);
            setPreselectedChoice(undefined);
          }}
          pool={selectedPool}
          preselectedChoice={preselectedChoice}
          onSubmit={handlePredictionSubmit}
        />
      )}
    </div>
  );
}
