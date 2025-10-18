import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";

export default function PredictorPools() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPredictions, setSelectedPredictions] = useState<{
    [key: number]: "yes" | "no" | null;
  }>({});

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "tech", name: "Tech" },
    { id: "gaming", name: "Gaming" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "education", name: "Education" },
    { id: "entertainment", name: "Entertainment" },
  ];

  const pools = [
    {
      id: 1,
      creator: "TechReview Pro",
      creatorVerified: true,
      creatorSubs: "2.4M subs",
      title: "iPhone 15 Pro Max - Complete Review & Hidden Features",
      thumbnail:
        "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=iPhone+15+Pro",
      category: "tech",
      timeRemaining: "2h 34m",
      totalStake: 12450,
      participants: 847,
      odds: { yes: 0.68, no: 0.32 },
      status: "LIVE",
      question: "Will this video reach 500K views in 7 days?",
    },
    {
      id: 2,
      creator: "GameMaster Elite",
      creatorVerified: true,
      creatorSubs: "1.8M subs",
      title: "PlayStation 6 Leak - Everything We Know So Far",
      thumbnail:
        "https://via.placeholder.com/300x200/10B981/FFFFFF?text=PS6+Leak",
      category: "gaming",
      timeRemaining: "5h 12m",
      totalStake: 8920,
      participants: 623,
      odds: { yes: 0.45, no: 0.55 },
      status: "HOT",
      question: "Will this video reach 1M views in 3 days?",
    },
    {
      id: 3,
      creator: "FitLife Coach",
      creatorVerified: true,
      creatorSubs: "950K subs",
      title: "30-Day Fitness Transformation - Real Results",
      thumbnail:
        "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Fitness+Transform",
      category: "lifestyle",
      timeRemaining: "1h 45m",
      totalStake: 5670,
      participants: 412,
      odds: { yes: 0.72, no: 0.28 },
      status: "TRENDING",
      question: "Will this video reach 250K views in 5 days?",
    },
    {
      id: 4,
      creator: "Chef Maria",
      creatorVerified: true,
      creatorSubs: "1.2M subs",
      title: "Perfect Pasta Recipe - 5 Minutes to Delicious",
      thumbnail:
        "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Pasta+Recipe",
      category: "lifestyle",
      timeRemaining: "8h 22m",
      totalStake: 3450,
      participants: 289,
      odds: { yes: 0.58, no: 0.42 },
      status: "NEW",
      question: "Will this video reach 100K views in 10 days?",
    },
    {
      id: 5,
      creator: "Wanderlust Adventures",
      creatorVerified: true,
      creatorSubs: "3.1M subs",
      title: "Most Dangerous City in the World - Travel Guide",
      thumbnail:
        "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Dangerous+City",
      category: "entertainment",
      timeRemaining: "12h 8m",
      totalStake: 15680,
      participants: 1024,
      odds: { yes: 0.35, no: 0.65 },
      status: "HOT",
      question: "Will this video reach 2M views in 14 days?",
    },
    {
      id: 6,
      creator: "EduMaster Pro",
      creatorVerified: true,
      creatorSubs: "750K subs",
      title: "How to Memorize Anything - Memory Techniques",
      thumbnail:
        "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Memory+Techniques",
      category: "education",
      timeRemaining: "6h 15m",
      totalStake: 7890,
      participants: 567,
      odds: { yes: 0.63, no: 0.37 },
      status: "LIVE",
      question: "Will this video reach 750K views in 7 days?",
    },
  ];

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

  const handlePredictionSelect = (poolId: number, prediction: "yes" | "no") => {
    setSelectedPredictions((prev) => ({
      ...prev,
      [poolId]: prev[poolId] === prediction ? null : prediction,
    }));
  };

  const handlePredict = (poolId: number) => {
    // Redirect to pool detail page
    window.location.href = `/predictor/pool/${poolId}`;
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
                <button
                  onClick={() => handlePredictionSelect(pool.id, "yes")}
                  className={`flex-1 rounded-lg p-2 text-center transition-all cursor-pointer ${
                    selectedPredictions[pool.id] === "yes"
                      ? "bg-green-200 border-2 border-green-500"
                      : "bg-green-50 border border-green-200 hover:bg-green-100"
                  }`}
                >
                  <div className="text-xs text-green-600 font-medium">YES</div>
                  <div className="text-sm font-bold text-green-700">
                    {pool.odds.yes}
                  </div>
                  <div className="text-xs text-green-600">
                    {Math.round(pool.odds.yes * 100)}% chance
                  </div>
                </button>
                <button
                  onClick={() => handlePredictionSelect(pool.id, "no")}
                  className={`flex-1 rounded-lg p-2 text-center transition-all cursor-pointer ${
                    selectedPredictions[pool.id] === "no"
                      ? "bg-red-200 border-2 border-red-500"
                      : "bg-red-50 border border-red-200 hover:bg-red-100"
                  }`}
                >
                  <div className="text-xs text-red-600 font-medium">NO</div>
                  <div className="text-sm font-bold text-red-700">
                    {pool.odds.no}
                  </div>
                  <div className="text-xs text-red-600">
                    {Math.round(pool.odds.no * 100)}% chance
                  </div>
                </button>
              </div>

              {/* Action Button - Only show when a prediction is selected */}
              {selectedPredictions[pool.id] && (
                <button
                  onClick={() => handlePredict(pool.id)}
                  className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Predict {selectedPredictions[pool.id]?.toUpperCase()}
                </button>
              )}
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
    </div>
  );
}
