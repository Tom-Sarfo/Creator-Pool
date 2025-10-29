import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faBullseye,
  faDollarSign,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faPlay,
  faCalendar,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faThumbsUp,
  faThumbsDown,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import Tabs from "../components/Tabs";
import StatsCard from "../components/StatsCard";
import { useAppContext } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";

export default function PredictorPredictions() {
  const [activeTab, setActiveTab] = useState("active");
  const [isContextReady, setIsContextReady] = useState(false);

  // Add a safety check for AppContext
  let context;
  try {
    context = useAppContext();
    if (!isContextReady) {
      setIsContextReady(true);
    }
  } catch (error) {
    console.error("AppContext not available:", error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">
            Please wait while the application loads.
          </p>
        </div>
      </div>
    );
  }

  const {
    predictions: allPredictions,
    pools,
    getPredictionsByPredictor,
  } = context;

  const { user } = useAuth();
  const userPredictions = getPredictionsByPredictor(user?.id || "anonymous");
  const activePredictions = userPredictions.filter(
    (p) => p.result === "pending"
  );
  const wonPredictions = userPredictions.filter((p) => p.result === "won");
  const lostPredictions = userPredictions.filter((p) => p.result === "lost");

  // Calculate real stats from user predictions
  const totalPredictions = userPredictions.length;
  const activePredictionsCount = userPredictions.filter(
    (p) => p.result === "pending"
  ).length;
  const settledPredictions = userPredictions.filter(
    (p) => p.result !== "pending"
  );
  const winRate =
    settledPredictions.length > 0
      ? Math.round((wonPredictions.length / settledPredictions.length) * 100)
      : 0;
  const totalEarnings = wonPredictions.reduce(
    (sum, p) => sum + (p.actualPayout || 0),
    0
  );

  // Helper function to get pool data for a prediction
  const getPoolForPrediction = (prediction: any) => {
    return pools.find((p) => p.id === prediction.poolId);
  };

  const tabs = [
    { id: "active", name: "Active", count: activePredictions.length },
    { id: "won", name: "Won", count: wonPredictions.length },
    { id: "lost", name: "Lost", count: lostPredictions.length },
    {
      id: "settled",
      name: "Settled",
      count: wonPredictions.length + lostPredictions.length,
    },
  ];

  const getChoiceIcon = (choice: string) => {
    return choice?.toLowerCase() === "yes" ? faThumbsUp : faThumbsDown;
  };

  const getChoiceColor = (choice: string) => {
    return choice?.toLowerCase() === "yes"
      ? "text-green-600 bg-green-50 border-green-200"
      : "text-red-600 bg-red-50 border-red-200";
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "WON":
        return "text-green-600 bg-green-50 border-green-200";
      case "LOST":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const renderPredictions = () => {
    switch (activeTab) {
      case "active":
        return activePredictions;
      case "won":
        return wonPredictions;
      case "lost":
        return lostPredictions;
      case "settled":
        return [...wonPredictions, ...lostPredictions];
      default:
        return [];
    }
  };

  const predictions = renderPredictions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Predictions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your prediction performance and earnings
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Predictions"
          value={totalPredictions.toString()}
          icon={faBrain}
          iconColor="text-cyan-600"
          iconBgColor="bg-cyan-50"
          size="medium"
          variant="rounded-xl"
        />

        <StatsCard
          title="Win Rate"
          value={`${winRate}%`}
          icon={faBullseye}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
          size="medium"
          variant="rounded-xl"
        />

        <StatsCard
          title="Total Earnings"
          value={`$${totalEarnings.toFixed(2)}`}
          icon={faDollarSign}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50"
          size="medium"
          variant="rounded-xl"
        />

        <StatsCard
          title="Active Now"
          value={activePredictionsCount.toString()}
          icon={faClock}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
          size="medium"
          variant="rounded-xl"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-6">
          {predictions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="w-8 h-8 text-gray-400"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No predictions found
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {activeTab === "active"
                  ? "You don't have any active predictions. Start predicting to see them here!"
                  : `You haven't ${activeTab} any predictions yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => {
                const pool = getPoolForPrediction(prediction);
                if (!pool) return null;

                return (
                  <div
                    key={prediction.id}
                    className="group relative bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
                      {/* Video Thumbnail */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={pool.thumbnail || ""}
                            alt={pool.title || ""}
                            className="w-32 h-20 lg:w-24 lg:h-16 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 left-2 bg-black bg-opacity-60 rounded px-2 py-1">
                            <FontAwesomeIcon
                              icon={faPlay}
                              className="w-3 h-3 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {pool.creator}
                              </span>
                              {pool.creatorVerified && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                                  VERIFIED
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">
                              {pool.title}
                            </h3>

                            {/* Status and Time Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                              {activeTab === "active" ? (
                                <>
                                  <div className="flex items-center space-x-1">
                                    <FontAwesomeIcon
                                      icon={faClock}
                                      className="w-4 h-4"
                                    />
                                    <span>{pool.timeRemaining || "N/A"}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <FontAwesomeIcon
                                      icon={faChartLine}
                                      className="w-4 h-4"
                                    />
                                    <span>
                                      {pool.currentViews && pool.targetViews
                                        ? Math.round(
                                            (pool.currentViews /
                                              pool.targetViews) *
                                              100
                                          )
                                        : 0}
                                      % progress
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <FontAwesomeIcon
                                    icon={faCalendar}
                                    className="w-4 h-4"
                                  />
                                  <span>{prediction.settledAt || "N/A"}</span>
                                </div>
                              )}
                            </div>

                            {/* Progress Bar for Active Predictions */}
                            {activeTab === "active" &&
                              pool.currentViews &&
                              pool.targetViews && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                                    <span>Progress to target</span>
                                    <span>
                                      {Math.round(
                                        (pool.currentViews / pool.targetViews) *
                                          100
                                      )}
                                      %
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min((pool.currentViews / pool.targetViews) * 100, 100)}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                          </div>

                          {/* Prediction Details */}
                          <div className="mt-4 sm:mt-0 flex flex-col items-end space-y-3">
                            {/* Choice and Result Badges */}
                            <div className="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getChoiceColor(prediction.choice)}`}
                              >
                                <FontAwesomeIcon
                                  icon={getChoiceIcon(prediction.choice)}
                                  className="w-3 h-3 mr-1"
                                />
                                {prediction.choice.toUpperCase()}
                              </span>
                              {prediction.result &&
                                prediction.result !== "pending" && (
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getResultColor(prediction.result.toUpperCase())}`}
                                  >
                                    <FontAwesomeIcon
                                      icon={
                                        prediction.result === "won"
                                          ? faCheckCircle
                                          : faTimesCircle
                                      }
                                      className="w-3 h-3 mr-1"
                                    />
                                    {prediction.result.toUpperCase()}
                                  </span>
                                )}
                            </div>

                            {/* Stake and Payout */}
                            <div className="text-right">
                              <div className="text-sm text-gray-600 mb-1">
                                Stake:{" "}
                                <span className="font-medium">
                                  ${prediction.stake}
                                </span>
                              </div>
                              {activeTab === "active" ? (
                                <div className="text-lg font-bold text-gray-900">
                                  Potential: ${prediction.potentialPayout || 0}
                                </div>
                              ) : (
                                <div
                                  className={`text-lg font-bold flex items-center space-x-1 ${
                                    prediction.result === "won"
                                      ? "text-green-600"
                                      : prediction.result === "lost"
                                        ? "text-red-600"
                                        : "text-gray-900"
                                  }`}
                                >
                                  {prediction.result === "won" && (
                                    <FontAwesomeIcon
                                      icon={faArrowUp}
                                      className="w-4 h-4"
                                    />
                                  )}
                                  {prediction.result === "lost" && (
                                    <FontAwesomeIcon
                                      icon={faArrowDown}
                                      className="w-4 h-4"
                                    />
                                  )}
                                  <span>
                                    {prediction.result === "won" ? "+" : ""}$
                                    {prediction.actualPayout || 0}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Over Time
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FontAwesomeIcon icon={faChartLine} className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faChartBar}
                className="w-8 h-8 text-gray-400"
              />
            </div>
            <p className="text-gray-500 font-medium">
              Performance chart coming soon
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Track your prediction trends and insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
