import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Pool, PredictionChoice } from "../lib/types";
import { PredictionChoice as PredictionChoiceEnum } from "../lib/types";
import PlayButtonOverlay from "./PlayButtonOverlay";
import {
  calculateRemainingTime,
  isTimerUrgent,
  getPoolStatusColor,
  getPoolStatusLabel,
  getEffectivePoolStatus,
  formatPoolQuestion,
  formatProbabilityAsPercentage,
} from "../lib/utils";

interface PoolCardProps {
  pool: Pool;
  currentTime: Date;
  onPredictClick: (pool: Pool, choice: PredictionChoice) => void;
}

export default function PoolCard({
  pool,
  currentTime,
  onPredictClick,
}: PoolCardProps) {
  const effectiveStatus = getEffectivePoolStatus(pool, currentTime);
  const isPoolOpen = effectiveStatus === "open";
  const remainingTime = calculateRemainingTime(pool, currentTime);
  const isUrgent = isTimerUrgent(pool, currentTime);
  const isExpired =
    remainingTime === "00:00" || effectiveStatus === "awaiting_release";

  const getTimerColor = () => {
    if (effectiveStatus === "open" && isExpired) {
      return "bg-red-600 text-white animate-pulse";
    }
    if (effectiveStatus === "open" && isUrgent) {
      return "bg-orange-500 text-white animate-pulse";
    }
    return "bg-black bg-opacity-50 text-white";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative group">
        <Link to={`/predictor/pool/${pool.id}`}>
          <img
            src={pool.video?.thumbnail || ""}
            alt={pool.video?.title || pool.question}
            className="w-full h-48 object-cover cursor-pointer"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop";
            }}
          />
        </Link>
        <PlayButtonOverlay />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPoolStatusColor(effectiveStatus)}`}
          >
            {getPoolStatusLabel(effectiveStatus)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded text-xs flex items-center space-x-1 font-mono ${getTimerColor()}`}
          >
            <FontAwesomeIcon icon="clock" className="w-3 h-3" />
            <span className="font-bold">{remainingTime}</span>
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <span className="text-sm font-medium text-gray-900">
            {pool.creator?.name || "Unknown"}
          </span>
        </div>

        <Link to={`/predictor/pool/${pool.id}`}>
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors">
            {pool.video?.title || pool.question}
          </h3>
        </Link>

        <p className="text-xs text-gray-600 mb-3">
          {formatPoolQuestion(
            pool.question || "",
            pool.targetViews || 0,
            pool.trackingDurationDays
          )}
        </p>

        {/* Progress bar for pools in tracking status */}
        {pool.targetViews > 0 &&
          ["open", "awaiting_release", "live_tracking", "closed"].includes(
            pool.status
          ) && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>
                  {Math.round(pool.currentViews || 0).toLocaleString()} /{" "}
                  {Math.round(pool.targetViews || 0).toLocaleString()} views
                </span>
                <span>
                  {pool.targetViews > 0
                    ? (
                        Math.round(
                          Math.min(
                            ((pool.currentViews || 0) / pool.targetViews) * 100,
                            100
                          ) * 10
                        ) / 10
                      ).toFixed(1)
                    : "0.0"}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    pool.currentViews && pool.targetViews > 0
                      ? (pool.currentViews / pool.targetViews) * 100 > 100
                        ? "bg-green-500"
                        : "bg-orange-600"
                      : "bg-gray-300"
                  }`}
                  style={{
                    width: `${
                      pool.targetViews > 0
                        ? Math.min(
                            ((pool.currentViews || 0) / pool.targetViews) * 100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            Pool Size:{" "}
            <span className="font-semibold">
              $
              {(
                (pool.creatorPledge || 0) +
                (pool.predictorStakes ||
                  (pool.yesStake || 0) + (pool.noStake || 0))
              ).toLocaleString()}
            </span>
          </span>
          <span>
            <span className="font-semibold">
              {pool.participants.toLocaleString()}
            </span>{" "}
            Predictors
          </span>
        </div>

        {/* Escrow Status */}
        {pool.status !== "settled" && Number(pool.escrowedAmount || 0) > 0 && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-blue-700 flex items-center gap-1">
                <FontAwesomeIcon icon="lock" className="w-3 h-3" />$
                {Number(pool.escrowedAmount || 0).toFixed(2)} in escrow
              </span>
            </div>
            <div className="flex gap-2 text-xs text-blue-600">
              <span>
                Pledge: ${Number(pool.escrowedCreatorPledge || 0).toFixed(2)}
              </span>
              <span>•</span>
              <span>
                Stakes: ${Number(pool.escrowedPredictorStakes || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Settlement Info */}
        {pool.status === "settled" && (
          <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs text-gray-600 space-y-1">
              {Number(pool.platformFeeCollected || 0) > 0 && (
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="font-medium">
                    ${Number(pool.platformFeeCollected || 0).toFixed(2)}
                  </span>
                </div>
              )}
              {Number(pool.creatorRoyaltyCollected || 0) > 0 && (
                <div className="flex justify-between">
                  <span>Creator Royalty:</span>
                  <span className="font-medium">
                    ${Number(pool.creatorRoyaltyCollected || 0).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() =>
              isPoolOpen && onPredictClick(pool, PredictionChoiceEnum.YES)
            }
            disabled={!isPoolOpen}
            className={`flex-1 rounded-lg p-2 text-center transition-all ${
              isPoolOpen
                ? "cursor-pointer bg-green-50 border border-green-200 hover:bg-green-100"
                : "cursor-not-allowed bg-gray-50 border border-gray-200 opacity-60"
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
              {formatProbabilityAsPercentage(pool.probabilityYes || 0.5)}
            </div>
          </button>
          <button
            onClick={() =>
              isPoolOpen && onPredictClick(pool, PredictionChoiceEnum.NO)
            }
            disabled={!isPoolOpen}
            className={`flex-1 rounded-lg p-2 text-center transition-all ${
              isPoolOpen
                ? "cursor-pointer bg-red-50 border border-red-200 hover:bg-red-100"
                : "cursor-not-allowed bg-gray-50 border border-gray-200 opacity-60"
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
              {formatProbabilityAsPercentage(pool.probabilityNo || 0.5)}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
