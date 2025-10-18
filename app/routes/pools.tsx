import type { Route } from "./+types/pools";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/react-router";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

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
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <FontAwesomeIcon icon="play" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                Creator Pool
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <div className="flex items-center space-x-2 text-purple-600">
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
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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

          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pools Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  </div>

                  {/* Video Title */}
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {pool.title}
                  </h3>

                  {/* Prediction Question */}
                  <p className="text-xs text-gray-600 mb-3">{pool.question}</p>

                  {/* Pool Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Pool Size: ${pool.totalStake.toLocaleString()}</span>
                    <span>{pool.participants} Predictors</span>
                  </div>

                  {/* Odds */}
                  <div className="flex space-x-2 mb-4">
                    <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                      <div className="text-xs text-green-600 font-medium">
                        YES
                      </div>
                      <div className="text-sm font-bold text-green-700">
                        {pool.odds.yes}
                      </div>
                      <div className="text-xs text-green-600">
                        {Math.round(pool.odds.yes * 100)}% chance
                      </div>
                    </div>
                    <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                      <div className="text-xs text-red-600 font-medium">NO</div>
                      <div className="text-sm font-bold text-red-700">
                        {pool.odds.no}
                      </div>
                      <div className="text-xs text-red-600">
                        {Math.round(pool.odds.no * 100)}% chance
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <SignedIn>
                    <button className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Predict Now
                    </button>
                  </SignedIn>
                  <SignedOut>
                    <Link
                      to="/onboarding"
                      className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
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
