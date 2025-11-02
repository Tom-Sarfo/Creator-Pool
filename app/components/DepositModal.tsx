import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faDollarSign,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { walletService, WalletService } from "../services/wallet.service";
import { useAppContext } from "../contexts/AppContext";
import type { DepositRequest } from "../lib/types";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [25, 50, 100, 250, 500];

export default function DepositModal({
  isOpen,
  onClose,
  onSuccess,
}: DepositModalProps) {
  const { addToast, refreshWallet } = useAppContext();
  const [amount, setAmount] = useState("");
  //   const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">(
  //     "stripe"
  //   );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountInput = (value: string) => {
    setAmount(value);
    setError("");

    if (value) {
      const depositAmount = parseFloat(value);
      const validation = WalletService.validateDepositData({
        amount: depositAmount,
        // paymentMethod,
      });

      if (!validation.valid) {
        setError(validation.errors[0] || "Invalid amount");
      }
    }
  };

  const handleQuickAmount = (value: number) => {
    const validation = WalletService.validateDepositData({
      amount: value,
      //   paymentMethod,
    });

    if (validation.valid) {
      setAmount(value.toString());
      setError("");
    } else {
      setError(validation.errors[0] || "Invalid amount");
    }
  };

  const handlePaymentMethodChange = (method: "stripe" | "paypal") => {
    // setPaymentMethod(method);
    setError("");

    if (amount) {
      const depositAmount = parseFloat(amount);
      const validation = WalletService.validateDepositData({
        amount: depositAmount,
        // paymentMethod: method,
      });

      if (!validation.valid) {
        setError(validation.errors[0] || "Invalid amount");
      }
    }
  };

  const handleSubmit = async () => {
    if (!amount || error || isSubmitting) return;

    const depositAmount = parseFloat(amount);
    const validation = WalletService.validateDepositData({
      amount: depositAmount,
      //   paymentMethod,
    });

    if (!validation.valid) {
      setError(validation.errors[0] || "Invalid deposit data");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const depositData: DepositRequest = {
        amount: depositAmount,
        // paymentMethod,
      };

      const response = await walletService.deposit(depositData);

      // Handle payment redirect if needed
      if (response.approvalUrl) {
        // Redirect to payment gateway
        window.location.href = response.approvalUrl;
        return;
      }

      // If payment intent is returned (Stripe), handle it
      if (response.paymentIntent) {
        // You might want to use Stripe.js here to handle the payment
        // For now, we'll just show success
        addToast({
          type: "success",
          title: "Deposit Initiated",
          message: `Deposit of $${depositAmount.toFixed(2)} has been initiated. Please complete the payment.`,
          duration: 5000,
        });
      } else {
        // Direct deposit success
        addToast({
          type: "success",
          title: "Deposit Successful",
          message: `$${depositAmount.toFixed(2)} has been added to your wallet.`,
          duration: 4000,
        });
      }

      await refreshWallet();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to process deposit. Please try again.";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Deposit Failed",
        message: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      //   setPaymentMethod("stripe");
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-80"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Funds to Wallet
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Payment Method Selection */}
            {/* <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePaymentMethodChange("stripe")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "stripe"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      className="w-6 h-6 mb-2 mx-auto"
                    />
                    <div className="text-sm font-medium">Stripe</div>
                    <div className="text-xs text-gray-500">Card Payment</div>
                  </div>
                </button>
                <button
                  onClick={() => handlePaymentMethodChange("paypal")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "paypal"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      className="w-6 h-6 mb-2 mx-auto"
                    />
                    <div className="text-sm font-medium">PayPal</div>
                    <div className="text-xs text-gray-500">PayPal Account</div>
                  </div>
                </button>
              </div>
            </div> */}

            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Deposit Amount
              </label>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {QUICK_AMOUNTS.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => handleQuickAmount(quickAmount)}
                    disabled={isSubmitting}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      amount === quickAmount.toString()
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    ${quickAmount}
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
                  value={amount}
                  onChange={(e) => handleAmountInput(e.target.value)}
                  placeholder="Enter custom amount"
                  min="10"
                  max="10000"
                  step="0.01"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Amount Limits Info */}
              <div className="text-xs text-gray-500">
                Minimum: $10 • Maximum: $10,000
              </div>
            </div>

            {/* Summary */}
            {amount && !error && (
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-orange-700">
                    Deposit Amount:
                  </span>
                  <span className="text-lg font-bold text-orange-900">
                    ${parseFloat(amount || "0").toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-orange-600">
                  Funds will be added to your wallet immediately after payment
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!amount || !!error || isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Processing..." : "Deposit Funds"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
