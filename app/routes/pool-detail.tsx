import type { Route } from "./+types/pool-detail";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faTag,
  faPlay,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router";
import { RECENT_PREDICTIONS, QUICK_STAKES } from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";
import { calculatePotentialPayout } from "../lib/utils";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Pool Detail - Creator Pool` },
    {
      name: "description",
      content: "View pool details and make your prediction.",
    },
  ];
}

export default function PoolDetailPage({ params }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const [selectedPrediction, setSelectedPrediction] = useState<
    "yes" | "no" | null
  >(null);
  const [stakeAmount, setStakeAmount] = useState("");

  const { getPoolById } = useAppContext();

  // Find the actual pool data based on the ID
  const poolId = parseInt(params.id);
  const poolData = getPoolById(poolId);

  // Create pool object with additional fields needed for the detail page
  const pool = poolData
    ? {
        id: poolData.id,
        creator: poolData.creator,
        creatorVerified: poolData.creatorVerified,
        creatorSubs: poolData.creatorSubs,
        title: poolData.title,
        thumbnail: poolData.thumbnail,
        category: poolData.category,
        timeRemaining: poolData.timeRemaining,
        totalStake: poolData.totalStake,
        participants: poolData.participants,
        odds: poolData.odds || { yes: 0.5, no: 0.5 },
        status:
          poolData.status === "LIVE" ? "Open for predictions" : poolData.status,
        question: poolData.question,
        description: `Join this prediction pool for ${poolData.title}. ${poolData.question} Help determine the outcome and potentially earn rewards based on your prediction accuracy.`,
        releaseDate: "Dec 15, 2024",
        expectedDuration: "12 min",
        yesPool: Math.round(poolData.totalStake * (poolData.odds?.yes || 0)),
        noPool: Math.round(poolData.totalStake * (poolData.odds?.no || 0)),
        platformFee: "3.5%",
        creatorRoyalty: "0.1%",
        creatorPledge: "15% AdSense",
      }
    : null;

  // Handle URL search parameters for pre-selected prediction
  useEffect(() => {
    const predictionParam = searchParams.get("prediction");
    if (
      predictionParam &&
      (predictionParam === "yes" || predictionParam === "no")
    ) {
      setSelectedPrediction(predictionParam as "yes" | "no");
    }
  }, [searchParams]);

  // Show error if pool not found
  if (!pool) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pool Not Found
          </h2>
          <p className="text-gray-600">
            The pool you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const recentPredictions = RECENT_PREDICTIONS;
  const quickStakes = QUICK_STAKES;

  const stakeAmountNumber = parseFloat(stakeAmount) || 0;
  const potentialPayout =
    selectedPrediction && stakeAmountNumber > 0
      ? calculatePotentialPayout(
          stakeAmountNumber,
          selectedPrediction === "yes"
            ? pool.odds?.yes || 0
            : pool.odds?.no || 0
        )
      : 0;

  const potentialProfit = potentialPayout - stakeAmountNumber;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Video Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pool Status */}
          <div className="flex items-center justify-between">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Ends in {pool.timeRemaining}
            </span>
          </div>

          {/* Video Player */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={pool.thumbnail}
              alt={pool.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon="play"
                  className="w-8 h-8 text-white ml-1"
                />
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {pool.status}
              </span>
            </div>
          </div>

          <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
            Preview Video
          </button>

          {/* Creator Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {pool.creator}
                </h3>
                {pool.creatorVerified && (
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-5 h-5 text-blue-500"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600">{pool.creatorSubs}</p>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Subscribe
            </button>
          </div>

          {/* Video Title & Metadata */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {pool.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <FontAwesomeIcon icon="calendar" className="w-4 h-4" />
                <span>Releases {pool.releaseDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FontAwesomeIcon icon="clock" className="w-4 h-4" />
                <span>Expected: {pool.expectedDuration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FontAwesomeIcon icon="tag" className="w-4 h-4" />
                <span>{pool.category}</span>
              </div>
            </div>
          </div>

          {/* Video Description */}
          <div>
            <p className="text-gray-700 leading-relaxed">{pool.description}</p>
          </div>

          {/* Unlisted Video Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              Video is currently unlisted. Predictions close before it goes
              public. You'll be notified when tracking starts.
            </p>
          </div>
        </div>

        {/* Right Column - Prediction & Stats */}
        <div className="space-y-6">
          {/* Make Your Prediction */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Make Your Prediction
            </h2>
            <p className="text-sm text-gray-600 mb-6">{pool.question}</p>

            {/* Binary Prediction Boxes */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() =>
                  setSelectedPrediction(
                    selectedPrediction === "yes" ? null : "yes"
                  )
                }
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedPrediction === "yes"
                    ? "border-green-500 bg-green-50"
                    : "border-green-200 bg-green-50 hover:bg-green-100"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700 mb-1">
                    YES
                  </div>
                  <div className="text-2xl font-bold text-green-800 mb-1">
                    {pool.odds?.yes || 0}
                  </div>
                  <div className="text-sm text-green-600 mb-1">
                    {Math.round(pool.odds?.yes || 0 * 100)}% chance
                  </div>
                  <div className="text-sm text-green-600">1.47x payout</div>
                </div>
              </button>

              <button
                onClick={() =>
                  setSelectedPrediction(
                    selectedPrediction === "no" ? null : "no"
                  )
                }
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedPrediction === "no"
                    ? "border-red-500 bg-red-50"
                    : "border-red-200 bg-red-50 hover:bg-red-100"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-red-700 mb-1">NO</div>
                  <div className="text-2xl font-bold text-red-800 mb-1">
                    {pool.odds?.no || 0}
                  </div>
                  <div className="text-sm text-red-600 mb-1">
                    {Math.round(pool.odds?.no || 0 * 100)}% chance
                  </div>
                  <div className="text-sm text-red-600">3.13x payout</div>
                </div>
              </button>
            </div>

            {/* Stake Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stake Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                  $
                </span>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-base"
                  placeholder="0.00"
                  min="1"
                  max="500"
                  step="0.01"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="font-medium">Min: $1.00</span>
                <span className="font-medium">Max: $500.00</span>
              </div>
            </div>

            {/* Quick Stake Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {quickStakes.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setStakeAmount(amount.toString())}
                  className={`py-2 px-3 text-sm border rounded-lg transition-colors font-medium ${
                    stakeAmount === amount.toString()
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Potential Payout */}
            {selectedPrediction && stakeAmountNumber > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Potential Payout:</span>
                  <span className="font-semibold text-gray-900">
                    ${potentialPayout.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Potential Profit:</span>
                  <span
                    className={`font-semibold ${
                      potentialProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {potentialProfit >= 0 ? "+" : ""}$
                    {potentialProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button
              disabled={!selectedPrediction || stakeAmountNumber < 1}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Confirm Prediction
            </button>
          </div>

          {/* Pool Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pool Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Pool Size:</span>
                <span className="font-medium">
                  ${pool.totalStake.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Predictors:</span>
                <span className="font-medium">
                  {pool.participants.toLocaleString()}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600">YES Pool</span>
                    <span className="text-green-600">
                      ${pool.yesPool.toLocaleString()} (68%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-600">NO Pool</span>
                    <span className="text-red-600">
                      ${pool.noPool.toLocaleString()} (32%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: "32%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span>{pool.platformFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Creator Royalty:</span>
                  <span>{pool.creatorRoyalty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Creator Pledge:</span>
                  <span>{pool.creatorPledge}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Predictions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Predictions
            </h2>
            <div className="space-y-3">
              {recentPredictions.map((prediction, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {prediction.user}
                      </p>
                      <p className="text-xs text-gray-500">{prediction.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        prediction.prediction === "YES"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {prediction.prediction}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${prediction.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 transition-colors">
              View All Predictions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
