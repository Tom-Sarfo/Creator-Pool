import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { CATEGORIES } from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";
import type { Pool } from "../contexts/AppContext";
import PredictionModal from "../components/PredictionModal";
import { calculateDynamicOdds } from "../lib/utils";

export default function PredictorPools() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [preselectedChoice, setPreselectedChoice] = useState<
    "yes" | "no" | undefined
  >();

  const { pools, addPrediction, addToast, calculatePoolOdds } = useAppContext();
  const categories = CATEGORIES;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "HOT":
        return "bg-red-100 text-red-800";
      case "TRENDING":
        return "bg-blue-100 text-blue-800";
      case "LIVE":
        return "bg-green-100 text-green-800";
      case "NEW":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPools = pools.filter(
    (pool) => selectedCategory === "all" || pool.category === selectedCategory
  );

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
      predictorId: "current-user-id", // TODO: Get from auth context
      predictorName: "Current User", // TODO: Get from auth context
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

          {/* Search */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Pool"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <FontAwesomeIcon
                icon="search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPools.map((pool) => (
          <div
            key={pool.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Pool Image */}
            <div className="relative">
              <img
                src={pool.thumbnail}
                alt={pool.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon="play"
                    className="w-6 h-6 text-white ml-1"
                  />
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pool.status)}`}
                >
                  {pool.status}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <FontAwesomeIcon icon="clock" className="w-3 h-3" />
                  <span>{pool.timeRemaining}</span>
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
                    className="w-4 h-4 text-blue-500"
                  />
                )}
                <span className="text-xs text-gray-500">
                  {pool.creatorSubs}
                </span>
              </div>

              {/* Video Title */}
              <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                {pool.title}
              </h3>

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
                  return (
                    <>
                      <button
                        onClick={() => handlePredictClick(pool, "yes")}
                        className="flex-1 rounded-lg p-2 text-center transition-all cursor-pointer bg-green-50 border border-green-200 hover:bg-green-100"
                      >
                        <div className="text-xs text-green-600 font-medium">
                          YES
                        </div>
                        <div className="text-sm font-bold text-green-700">
                          {odds.yes.toFixed(2)}x
                        </div>
                      </button>
                      <button
                        onClick={() => handlePredictClick(pool, "no")}
                        className="flex-1 rounded-lg p-2 text-center transition-all cursor-pointer bg-red-50 border border-red-200 hover:bg-red-100"
                      >
                        <div className="text-xs text-red-600 font-medium">
                          NO
                        </div>
                        <div className="text-sm font-bold text-red-700">
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

      {/* Load More */}
      <div className="text-center">
        <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Load More Pools
        </button>
      </div>

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
