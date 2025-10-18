import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faChartLine,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

export default function PredictorDashboard() {
  // Mock data for demonstration
  const stats = {
    totalPredictions: 47,
    winRate: 78.7,
    totalEarnings: 1247.5,
    activePredictions: 8,
  };

  const recentPools = [
    {
      id: 1,
      creator: "TechReviewer",
      title: "Will this iPhone review hit 1M views?",
      thumbnail:
        "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=iPhone+Review",
      timeRemaining: "2d 14h",
      totalStake: 2840,
      participants: 156,
      myStake: 25,
      myChoice: "YES",
      odds: { yes: 1.8, no: 2.1 },
    },
    {
      id: 2,
      creator: "GamingPro",
      title: "Will this game trailer reach 500K views?",
      thumbnail:
        "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Game+Trailer",
      timeRemaining: "5d 8h",
      totalStake: 1920,
      participants: 89,
      myStake: 50,
      myChoice: "NO",
      odds: { yes: 2.3, no: 1.6 },
    },
    {
      id: 3,
      creator: "CookingMaster",
      title: "Will this recipe video go viral?",
      thumbnail:
        "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Recipe+Video",
      timeRemaining: "1d 3h",
      totalStake: 1560,
      participants: 67,
      myStake: 0,
      myChoice: null,
      odds: { yes: 1.9, no: 1.9 },
    },
  ];

  const quickActions = [
    {
      title: "Browse Active Pools",
      description: "Discover new prediction opportunities",
      icon: faBullseye,
      href: "/predictor/pools",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "View My Predictions",
      description: "Track your active predictions",
      icon: faChartLine,
      href: "/predictor/predictions",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Manage Wallet",
      description: "Deposit, withdraw, or view balance",
      icon: faWallet,
      href: "/predictor/wallet",
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Predictor! 🎯</h1>
        <p className="text-purple-100">
          Ready to make your next prediction? Discover active pools and test
          your intuition.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Predictions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPredictions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.winRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalEarnings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Predictions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activePredictions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className={`${action.color} text-white rounded-lg p-4 transition-colors duration-200`}
              >
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon
                    icon={action.icon}
                    className="text-2xl mr-3"
                  />
                  <h3 className="font-semibold">{action.title}</h3>
                </div>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Pools */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Pools
            </h2>
            <Link
              to="/predictor/pools"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentPools.map((pool) => (
              <div
                key={pool.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <img
                  src={pool.thumbnail}
                  alt={pool.title}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {pool.creator}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{pool.title}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>⏱️ {pool.timeRemaining}</span>
                    <span>👥 {pool.participants} predictors</span>
                    <span>💰 ${pool.totalStake} total</span>
                  </div>
                </div>
                <div className="text-right">
                  {pool.myStake > 0 ? (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        My Stake: ${pool.myStake}
                      </div>
                      <div
                        className={`text-xs ${pool.myChoice === "YES" ? "text-green-600" : "text-red-600"}`}
                      >
                        {pool.myChoice}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <div className="text-gray-500 mb-1">Odds</div>
                      <div className="flex space-x-2">
                        <span className="text-green-600 font-medium">
                          YES {pool.odds.yes}x
                        </span>
                        <span className="text-red-600 font-medium">
                          NO {pool.odds.no}x
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Performance Insights
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Prediction Accuracy by Category
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tech Reviews</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gaming Content</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lifestyle</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: "68%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Won prediction on "iPhone Review"
                    </p>
                    <p className="text-xs text-gray-500">
                      +$45.00 • 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Made prediction on "Game Trailer"
                    </p>
                    <p className="text-xs text-gray-500">
                      Stake: $50 • 5 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Lost prediction on "Cooking Video"
                    </p>
                    <p className="text-xs text-gray-500">-$25.00 • 1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
