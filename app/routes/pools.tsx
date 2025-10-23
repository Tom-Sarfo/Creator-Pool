import type { Route } from "./+types/pools";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/react-router";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { CATEGORIES } from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";
import { calculateRemainingTime, isTimerUrgent } from "../lib/utils";
import PlayButtonOverlay from "../components/PlayButtonOverlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Active Pools - Creator Pool" },
    {
      name: "description",
      content: "Explore active prediction pools for upcoming YouTube videos.",
    },
  ];
}

export default function PoolsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { pools: allPools } = useAppContext();
  const categories = CATEGORIES;
  const [currentTime, setCurrentTime] = useState(new Date());

  const pools = allPools.slice(0, 3); // Use first 3 pools for this page

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

  const filteredPools = pools.filter((pool) => {
    const matchesCategory =
      selectedCategory === "all" || pool.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      pool.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.creator?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.question?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                <FontAwesomeIcon icon="play" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                Creator Pool
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <div className="flex items-center space-x-2 text-orange-600">
                  <FontAwesomeIcon icon="wallet" className="w-5 h-5" />
                  <span className="font-semibold">$2,450.00</span>
                </div>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link
                  to="/onboarding"
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Get Started
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Pool Market
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover prediction pools for upcoming YouTube videos. Join the
              community and showcase your insights!
            </p>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pools..."
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
              <SelectTrigger className="w-[180px]">
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

          {/* Pools Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <span>Pool Size: ${pool.totalStake.toLocaleString()}</span>
                    <span>{pool.participants} Predictors</span>
                  </div>

                  {/* Odds */}
                  <div className="flex space-x-2 mb-4">
                    {(() => {
                      const isPoolOpen = pool.status === "open";
                      return (
                        <>
                          <div
                            className={`flex-1 rounded-lg p-2 text-center ${
                              isPoolOpen
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50 border border-gray-200 opacity-60"
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
                              {pool.odds?.yes || 0}
                            </div>
                            <div
                              className={`text-xs ${
                                isPoolOpen ? "text-green-600" : "text-gray-500"
                              }`}
                            >
                              {Math.round(pool.odds?.yes || 0 * 100)}% chance
                            </div>
                          </div>
                          <div
                            className={`flex-1 rounded-lg p-2 text-center ${
                              isPoolOpen
                                ? "bg-red-50 border border-red-200"
                                : "bg-gray-50 border border-gray-200 opacity-60"
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
                              {pool.odds?.no || 0}
                            </div>
                            <div
                              className={`text-xs ${
                                isPoolOpen ? "text-red-600" : "text-gray-500"
                              }`}
                            >
                              {Math.round(pool.odds?.no || 0 * 100)}% chance
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Action Button */}
                  <SignedIn>
                    {(() => {
                      const isPoolOpen = pool.status === "open";
                      return (
                        <button
                          onClick={() =>
                            isPoolOpen && navigate(`/predictor/pool/${pool.id}`)
                          }
                          disabled={!isPoolOpen}
                          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            isPoolOpen
                              ? "bg-orange-600 text-white hover:bg-orange-700 cursor-pointer"
                              : "bg-gray-400 text-white cursor-not-allowed opacity-60"
                          }`}
                        >
                          {isPoolOpen ? "Predict Now" : "Pool Closed"}
                        </button>
                      );
                    })()}
                  </SignedIn>
                  <SignedOut>
                    <Link
                      to="/onboarding"
                      className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center"
                    >
                      Sign In to Predict
                    </Link>
                  </SignedOut>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Pools
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
