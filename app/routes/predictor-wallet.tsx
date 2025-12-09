import { useState } from "react";
import {
  PREDICTOR_WALLET_TRANSACTIONS,
  PREDICTOR_WALLET_PAYMENT_METHODS,
} from "../lib/constants";
import DepositModal from "../components/DepositModal";
import { useAppContext } from "../contexts/AppContext";
import { useAuth } from "~/contexts/AuthContext";
import IconContainer from "../components/IconContainer";
import Loader from "../components/Loader";
import {
  faWallet,
  faCreditCard,
  faMoneyBillTransfer,
  faChartBar,
  faTrophy,
  faBullseye,
  faCrown,
  faHandshake,
  faChartLine,
  faClock,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

export default function PredictorWallet() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const { walletBalance, isWalletLoading, refreshWallet } = useAppContext();
  const { user } = useAuth();

  const transactions = PREDICTOR_WALLET_TRANSACTIONS;
  const paymentMethods = PREDICTOR_WALLET_PAYMENT_METHODS;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "win":
        return faTrophy;
      case "stake":
        return faBullseye;
      case "deposit":
        return faWallet;
      case "withdrawal":
        return faMoneyBillTransfer;
      case "royalty":
        return faCrown;
      case "pledge":
        return faHandshake;
      default:
        return faChartBar;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) {
      return "text-green-600";
    } else {
      return "text-red-600";
    }
  };

  const getTransactionIconColors = (type: string) => {
    switch (type) {
      case "win":
        return { bg: "bg-yellow-100", icon: "text-yellow-600" };
      case "stake":
        return { bg: "bg-orange-100", icon: "text-orange-600" };
      case "deposit":
        return { bg: "bg-green-100", icon: "text-green-600" };
      case "withdrawal":
        return { bg: "bg-red-100", icon: "text-red-600" };
      case "royalty":
        return { bg: "bg-yellow-100", icon: "text-yellow-600" };
      case "pledge":
        return { bg: "bg-cyan-100", icon: "text-cyan-600" };
      default:
        return { bg: "bg-orange-100", icon: "text-orange-600" };
    }
  };

  console.log("user", user);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your balance, deposits, and withdrawals
        </p>
      </div>

      {/* Balance Overview */}
      <div className="bg-gradient-to-r from-orange-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Available Balance</h2>
          <IconContainer
            icon={faWallet}
            size="medium"
            iconColor="text-white"
            iconBgColor="bg-white/20"
          />
        </div>
        {isWalletLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size="md" variant="white" />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold mb-2">
              ${user?.walletBalance?.toFixed(2) || "0.00"}
            </div>
            <div className="flex space-x-6 text-sm text-orange-100">
              <div>
                <span className="block">Total Earned</span>
                <span className="font-semibold">
                  ${user?.walletBalance?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div>
                <span className="block">Total Staked</span>
                <span className="font-semibold">
                  ${user?.walletBalance?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowDepositModal(true)}
          className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <IconContainer
              icon={faCreditCard}
              size="medium"
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
            <div className="text-left">
              <div className="font-medium text-gray-900">Deposit</div>
              <div className="text-sm text-gray-500">
                Add funds to your wallet
              </div>
            </div>
          </div>
        </button>
        <button className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <IconContainer
              icon={faMoneyBillTransfer}
              size="medium"
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <div className="text-left">
              <div className="font-medium text-gray-900">Withdraw</div>
              <div className="text-sm text-gray-500">Transfer to your bank</div>
            </div>
          </div>
        </button>
        <button className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <IconContainer
              icon={faChartBar}
              size="medium"
              iconColor="text-cyan-600"
              iconBgColor="bg-cyan-100"
            />
            <div className="text-left">
              <div className="font-medium text-gray-900">History</div>
              <div className="text-sm text-gray-500">View all transactions</div>
            </div>
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("payment-methods")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "payment-methods"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Payment Methods
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        This Month
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        +$245.50
                      </p>
                    </div>
                    <IconContainer
                      icon={faChartLine}
                      size="large"
                      iconColor="text-cyan-600"
                      iconBgColor="bg-cyan-100"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Win Rate
                      </p>
                      <p className="text-2xl font-bold text-gray-900">78.7%</p>
                    </div>
                    <IconContainer
                      icon={faBullseye}
                      size="large"
                      iconColor="text-orange-600"
                      iconBgColor="bg-orange-100"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Stakes
                      </p>
                      <p className="text-2xl font-bold text-gray-900">$90</p>
                    </div>
                    <IconContainer
                      icon={faClock}
                      size="large"
                      iconColor="text-orange-600"
                      iconBgColor="bg-orange-100"
                    />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <IconContainer
                        icon={getTransactionIcon(transaction.type)}
                        size="small"
                        iconColor={
                          getTransactionIconColors(transaction.type).icon
                        }
                        iconBgColor={
                          getTransactionIconColors(transaction.type).bg
                        }
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.date}
                        </p>
                      </div>
                      <span
                        className={`font-medium ${getTransactionColor(transaction.type, transaction.amount)}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}$
                        {transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <IconContainer
                    icon={getTransactionIcon(transaction.type)}
                    size="medium"
                    iconColor={getTransactionIconColors(transaction.type).icon}
                    iconBgColor={getTransactionIconColors(transaction.type).bg}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${getTransactionColor(transaction.type, transaction.amount)}`}
                    >
                      {transaction.amount > 0 ? "+" : ""}$
                      {transaction.amount.toFixed(2)}
                    </span>
                    <p className="text-xs text-gray-500 capitalize">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "payment-methods" && (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <IconContainer
                      icon={method.type === "bank" ? faBuilding : faCreditCard}
                      size="medium"
                      iconColor={
                        method.type === "bank"
                          ? "text-blue-600"
                          : "text-orange-600"
                      }
                      iconBgColor={
                        method.type === "bank" ? "bg-blue-100" : "bg-orange-100"
                      }
                    />
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {method.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl">+</span>
                  <span>Add Payment Method</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={() => {
          refreshWallet();
        }}
      />
    </div>
  );
}
