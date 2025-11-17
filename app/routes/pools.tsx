import type { Route } from "./+types/pools";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { CATEGORIES } from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import {
  calculateRemainingTime,
  isTimerUrgent,
  getPoolStatusColor,
  getPoolStatusLabel,
  getEffectivePoolStatus,
  formatPoolQuestion,
  formatProbabilityAsPercentage,
} from "../lib/utils";
import PlayButtonOverlay from "../components/PlayButtonOverlay";
import Pagination from "../components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { poolService } from "../services/pool.service";
import type { Pool } from "../lib/types";

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
  const { isAuthenticated, user, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { pools: contextPools } = useAppContext();
  const [guestPools, setGuestPools] = useState<Pool[]>([]);
  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const categories = CATEGORIES;
  const [currentTime, setCurrentTime] = useState(new Date());

  // Use context pools if authenticated, otherwise use guest pools
  const allPools = isAuthenticated ? contextPools : guestPools;

  // Update current time every second for real-time timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load pools for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      loadGuestPools();
    }
  }, [isAuthenticated]);

  const loadGuestPools = async () => {
    setIsLoadingPools(true);
    try {
      const response = await poolService.getPools({ limit: 10 });
      const pools = response.pools || [];
      // Ensure numeric fields are numbers
      const formattedPools: Pool[] = pools.map((pool) => ({
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
      setGuestPools(formattedPools);
    } catch (error) {
      console.error("Error loading guest pools:", error);
      setGuestPools([]);
    } finally {
      setIsLoadingPools(false);
    }
  };

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

  const allFilteredPools = allPools.filter((pool) => {
    // Note: category filter removed as Pool type doesn't have category property
    const matchesSearch =
      searchQuery === "" ||
      pool.video?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.creator?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.question?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // For guest users, limit to first 10 pools only
  const poolsForDisplay = isAuthenticated
    ? allFilteredPools
    : allFilteredPools.slice(0, 10);

  const totalPages = Math.ceil(poolsForDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredPools = isAuthenticated
    ? poolsForDisplay.slice(startIndex, endIndex)
    : poolsForDisplay; // Guest users see all 10 without pagination

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
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-orange-600">
                    <FontAwesomeIcon icon="wallet" className="w-5 h-5" />
                    <span className="font-semibold">$2,450.00</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {typeof user?.name === "string"
                        ? user.name
                        : typeof user?.email === "string"
                          ? user.email
                          : "User"}
                    </span>
                    <button
                      onClick={logout}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
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
          {isLoadingPools && !isAuthenticated ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading pools...</p>
            </div>
          ) : filteredPools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No pools found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPools.map((pool) => {
                const effectiveStatus = getEffectivePoolStatus(
                  pool,
                  currentTime
                );
                const isPoolOpen = effectiveStatus === "open";
                const remainingTime = calculateRemainingTime(pool, currentTime);
                const isExpired =
                  remainingTime === "00:00" ||
                  effectiveStatus === "awaiting_release";

                return (
                  <div
                    key={pool.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Pool Image */}
                    <div className="relative group">
                      {isAuthenticated ? (
                        <Link to={`/predictor/pool/${pool.id}`}>
                          <img
                            src={pool.video?.thumbnail || ""}
                            alt={pool.video?.title || pool.question}
                            className="w-full h-48 object-cover cursor-pointer"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop";
                            }}
                          />
                        </Link>
                      ) : (
                        <div className="relative">
                          <img
                            src={pool.video?.thumbnail || ""}
                            alt={pool.video?.title || pool.question}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop";
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <Link
                              to="/login"
                              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                            >
                              Sign In to View Details
                            </Link>
                          </div>
                        </div>
                      )}
                      {/* Play button overlay - only visible on hover for authenticated users */}
                      {isAuthenticated && <PlayButtonOverlay />}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(effectiveStatus)}`}
                        >
                          {getStatusLabel(effectiveStatus)}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2 py-1 rounded text-xs flex items-center space-x-1 font-mono ${
                            isPoolOpen && isExpired
                              ? "bg-red-600 text-white animate-pulse"
                              : isPoolOpen && isTimerUrgent(pool, currentTime)
                                ? "bg-orange-500 text-white animate-pulse"
                                : "bg-black bg-opacity-50 text-white"
                          }`}
                        >
                          <FontAwesomeIcon icon="clock" className="w-3 h-3" />
                          <span className="font-bold">{remainingTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Pool Content */}
                    <div className="p-4">
                      {/* Creator Info */}
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">
                          {pool.creator?.name ||
                            pool.creator?.email ||
                            "Unknown"}
                        </span>
                      </div>

                      {/* Video Title */}
                      {isAuthenticated ? (
                        <Link to={`/predictor/pool/${pool.id}`}>
                          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors">
                            {pool.video?.title || pool.question}
                          </h3>
                        </Link>
                      ) : (
                        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {pool.video?.title || pool.question}
                        </h3>
                      )}

                      {/* Prediction Question */}
                      <p className="text-xs text-gray-600 mb-3">
                        {formatPoolQuestion(
                          pool.question || "",
                          pool.targetViews || 0,
                          (pool as any).trackingDurationDays
                        )}
                      </p>

                      {/* Pool Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>
                          Pool Size: ${pool.totalStake.toLocaleString()}
                        </span>
                        <span>{pool.participants} Predictors</span>
                      </div>

                      {/* Probability */}
                      <div className="flex space-x-2 mb-4">
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
                            {formatProbabilityAsPercentage(
                              pool.probabilityYes || 0.5
                            )}
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
                            {formatProbabilityAsPercentage(
                              pool.probabilityNo || 0.5
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {isAuthenticated ? (
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
                      ) : (
                        <Link
                          to="/login"
                          className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center"
                        >
                          Sign In to Predict
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination - Only show for authenticated users */}
          {isAuthenticated && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={poolsForDisplay.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
    </div>
  );
}
