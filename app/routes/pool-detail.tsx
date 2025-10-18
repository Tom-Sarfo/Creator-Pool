import type { Route } from "./+types/pool-detail";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faTag,
  faPlay,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

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
  const [selectedPrediction, setSelectedPrediction] = useState<
    "yes" | "no" | null
  >(null);
  const [stakeAmount, setStakeAmount] = useState(0);

  // Mock pool data - in real app, this would come from the loader
  const pool = {
    id: parseInt(params.id),
    creator: "TechReview Pro",
    creatorVerified: true,
    creatorSubs: "2.4M subscribers",
    title: "iPhone 15 Pro Max - Complete Review & Hidden Features",
    thumbnail:
      "https://via.placeholder.com/800x450/8B5CF6/FFFFFF?text=iPhone+15+Pro+Max",
    category: "Technology",
    timeRemaining: "2h 34m",
    totalStake: 12450,
    participants: 847,
    odds: { yes: 0.68, no: 0.32 },
    status: "Open for predictions",
    question: "Will this video reach 500K views in 7 days?",
    description:
      "Join me for the most comprehensive iPhone 15 Pro Max review you'll find anywhere. I'll be testing the camera system against the iPhone 14 Pro, running performance benchmarks, and revealing some hidden features that Apple didn't mention in their keynote. Plus, I'll be sharing my honest thoughts on whether the Pro Max is worth the premium price tag.",
    releaseDate: "Dec 15, 2024",
    expectedDuration: "12 min",
    yesPool: 8466,
    noPool: 3984,
    platformFee: "3.5%",
    creatorRoyalty: "0.1%",
    creatorPledge: "15% AdSense",
  };

  const recentPredictions = [
    {
      user: "CryptoKing23",
      time: "2 minutes ago",
      prediction: "YES",
      amount: 125,
    },
    {
      user: "TechSavvy_Sarah",
      time: "5 minutes ago",
      prediction: "NO",
      amount: 75,
    },
    {
      user: "InvestorMike",
      time: "8 minutes ago",
      prediction: "YES",
      amount: 200,
    },
  ];

  const quickStakes = [10, 25, 50, 100];

  const potentialPayout =
    selectedPrediction && stakeAmount > 0
      ? stakeAmount *
        (selectedPrediction === "yes" ? 1 / pool.odds.yes : 1 / pool.odds.no)
      : 0;

  const potentialProfit = potentialPayout - stakeAmount;

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
                    {pool.odds.yes}
                  </div>
                  <div className="text-sm text-green-600 mb-1">
                    {Math.round(pool.odds.yes * 100)}% chance
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
                    {pool.odds.no}
                  </div>
                  <div className="text-sm text-red-600 mb-1">
                    {Math.round(pool.odds.no * 100)}% chance
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
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={stakeAmount || ""}
                  onChange={(e) =>
                    setStakeAmount(parseFloat(e.target.value) || 0)
                  }
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  min="1"
                  max="500"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Min: $1.00</span>
                <span>Max: $500.00</span>
              </div>
            </div>

            {/* Quick Stake Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {quickStakes.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setStakeAmount(amount)}
                  className="py-2 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Potential Payout */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Potential Payout:</span>
                <span className="font-medium">
                  ${potentialPayout.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Potential Profit:</span>
                <span className="font-medium">
                  ${potentialProfit.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              disabled={!selectedPrediction || stakeAmount < 1}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
