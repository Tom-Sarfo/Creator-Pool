import { Link  } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import {
  faBullseye,
  faChartLine,
  faWallet,
  faBrain,
  faChartBar,
  faDollarSign,
  faClock,
  faUsers,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  PREDICTOR_QUICK_ACTIONS,
  PREDICTOR_DASHBOARD_STATS_CONFIG,
  PREDICTOR_DASHBOARD_WELCOME_MESSAGE,
} from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";
import {
  calculateRemainingTime,
  getPoolStatusColor,
  getPoolStatusLabel,
  calculatePredictorStats,
  getRecentPools,
} from "../lib/utils";
import StatsCard from "../components/StatsCard";

export default function PredictorDashboard() {
  const { pools, predictions } = useAppContext();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = calculatePredictorStats(predictions, user?.id || "anonymous");
  const recentPools = getRecentPools(pools, 3);
  const userPredictions = predictions.filter(
    (p) => p.predictorId === (user?.id || "anonymous")
  );

  const quickActions = PREDICTOR_QUICK_ACTIONS.map((action) => ({
    ...action,
    icon:
      action.icon === "bullseye"
        ? faBullseye
        : action.icon === "chart-line"
          ? action.href === "/predictor/predictions"
            ? faBrain
            : faChartLine
          : action.icon === "wallet"
            ? faWallet
            : faBullseye,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center mb-2">
          <FontAwesomeIcon icon={faBrain} className="text-2xl mr-3" />
          <h1 className="text-2xl font-bold">
            {PREDICTOR_DASHBOARD_WELCOME_MESSAGE.title}
          </h1>
        </div>
        <p className="text-orange-100">
          {PREDICTOR_DASHBOARD_WELCOME_MESSAGE.description}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {PREDICTOR_DASHBOARD_STATS_CONFIG.map((config, index) => {
          const iconMap = {
            faChartBar,
            faBullseye,
            faDollarSign,
            faBrain,
          };
          const valueMap = [
            stats.totalPredictions,
            `${stats.winRate}%`,
            `$${stats.totalEarnings}`,
            stats.activePredictions,
          ];

          return (
            <StatsCard
              key={config.title}
              title={config.title}
              value={valueMap[index]}
              icon={iconMap[config.icon as keyof typeof iconMap]}
              iconColor={config.iconColor}
              iconBgColor={config.iconBgColor}
              size="large"
              square={true}
            />
          );
        })}
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

      {recentPools.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Pools
              </h2>
              <Link
                to="/predictor/pools"
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
              >
                View All{" "}
                <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPools.map((pool) => {
                const userPrediction = userPredictions.find(
                  (p) => p.poolId === pool.id
                );

                return (
                  <div
                    key={pool.id}
                    className="border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Mobile-first responsive layout */}
                    <div className="p-3 sm:p-4">
                      {/* Top row: Thumbnail and basic info */}
                      <div className="flex items-start space-x-3 mb-3">
                        <Link
                          to={`/predictor/pool/${pool.id}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={pool.thumbnail}
                            alt={pool.title}
                            className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                  {pool.creator}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${getPoolStatusColor(pool.status)}`}
                                >
                                  {getPoolStatusLabel(pool.status)}
                                </span>
                              </div>
                              <Link to={`/predictor/pool/${pool.id}`}>
                                <p className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors">
                                  {pool.title}
                                </p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats row - responsive layout */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-3">
                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <span className="truncate">
                            {calculateRemainingTime(pool, currentTime)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <span className="truncate">
                            {pool.participants} predictors
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500 col-span-2 sm:col-span-1">
                          <FontAwesomeIcon
                            icon={faDollarSign}
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <span className="truncate">
                            ${pool.totalStake} total
                          </span>
                        </div>
                      </div>

                      {/* Bottom row: Prediction info or odds */}
                      <div className="border-t border-gray-100 pt-3">
                        {userPrediction ? (
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-gray-600">
                                My Prediction:
                              </span>
                              <span
                                className={`ml-2 font-medium ${userPrediction.choice === "yes" ? "text-green-600" : "text-red-600"}`}
                              >
                                {userPrediction.choice.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              ${userPrediction.stake} stake
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Current Odds:
                            </div>
                            <div className="flex space-x-3">
                              <span className="text-green-600 font-medium text-sm">
                                YES {(pool.odds?.yes || 2.0).toFixed(1)}x
                              </span>
                              <span className="text-red-600 font-medium text-sm">
                                NO {(pool.odds?.no || 2.0).toFixed(1)}x
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
