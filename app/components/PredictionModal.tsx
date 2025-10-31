import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import type { Pool, PredictionChoice } from "../lib/types";
import { PredictionChoice as PredictionChoiceEnum } from "../lib/types";
import {
  calculateDynamicOdds,
  calculatePotentialPayout,
  validateStake,
} from "../lib/utils";

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
  preselectedChoice?: PredictionChoice;
  onSubmit: (prediction: { choice: PredictionChoice; stake: number }) => void;
}

const QUICK_STAKES = [10, 25, 50, 100];

export default function PredictionModal({
  isOpen,
  onClose,
  pool,
  preselectedChoice,
  onSubmit,
}: PredictionModalProps) {
  const [choice, setChoice] = useState<PredictionChoice>(
    preselectedChoice || PredictionChoiceEnum.YES
  );
  const [stake, setStake] = useState("");
  const [error, setError] = useState("");

  // Calculate current odds
  const odds = calculateDynamicOdds(pool.yesStake || 0, pool.noStake || 0);
  const currentOdds = choice === PredictionChoiceEnum.YES ? odds.yes : odds.no;
  const potentialPayout = stake
    ? calculatePotentialPayout(parseFloat(stake), currentOdds)
    : 0;

  const handleStakeInput = (value: string) => {
    setStake(value);
    setError("");

    if (value) {
      const stakeAmount = parseFloat(value);
      const validation = validateStake(stakeAmount, pool.totalStake);

      if (!validation.valid) {
        setError(validation.error || "Invalid stake");
      }
    }
  };

  const handleQuickStake = (amount: number) => {
    const validation = validateStake(amount, pool.totalStake);
    if (validation.valid) {
      setStake(amount.toString());
      setError("");
    } else {
      setError(validation.error || "Invalid stake");
    }
  };

  const handleSubmit = () => {
    if (!stake || error) return;

    const stakeAmount = parseFloat(stake);
    const validation = validateStake(stakeAmount, pool.totalStake);

    if (!validation.valid) {
      setError(validation.error || "Invalid stake");
      return;
    }

    onSubmit({ choice, stake: stakeAmount });
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setChoice(preselectedChoice || PredictionChoiceEnum.YES);
      setStake("");
      setError("");
    }
  }, [isOpen, preselectedChoice]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-80"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full prediction-modal">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Make Prediction
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Pool Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src={pool.video?.thumbnail || ""}
                  alt={pool.video?.title || pool.question}
                  className="w-12 h-8 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {pool.video?.title || pool.question}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pool.creator?.name || "Unknown"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{pool.question}</p>
            </div>

            {/* Choice Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Your Prediction
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setChoice(PredictionChoiceEnum.YES)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    choice === PredictionChoiceEnum.YES
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">YES</div>
                    <div className="text-sm">{odds.yes.toFixed(2)}x odds</div>
                  </div>
                </button>
                <button
                  onClick={() => setChoice(PredictionChoiceEnum.NO)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    choice === PredictionChoiceEnum.NO
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">NO</div>
                    <div className="text-sm">{odds.no.toFixed(2)}x odds</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Stake Amount */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Stake Amount
              </label>

              {/* Quick Stake Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {QUICK_STAKES.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickStake(amount)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      stake === amount.toString()
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="text-gray-400"
                  />
                </div>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => handleStakeInput(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  max="500"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Stake Limits Info */}
              <div className="text-xs text-gray-500">
                Minimum: $1 • Maximum: $500 • Max 10% of pool size
              </div>
            </div>

            {/* Potential Payout */}
            {stake && !error && (
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-orange-700">
                    Potential Payout:
                  </span>
                  <span className="text-lg font-bold text-orange-900">
                    ${potentialPayout.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  Based on current odds of {currentOdds.toFixed(2)}x
                </div>
              </div>
            )}

            {/* Pool Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">YES Stake</div>
                  <div className="font-medium">
                    ${(pool.yesStake || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">NO Stake</div>
                  <div className="font-medium">
                    ${(pool.noStake || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Total Predictors</div>
                  <div className="font-medium">{pool.participants}</div>
                </div>
                <div>
                  <div className="text-gray-600">Pool Size</div>
                  <div className="font-medium">
                    ${pool.totalStake.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!stake || !!error}
              className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Place Prediction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
