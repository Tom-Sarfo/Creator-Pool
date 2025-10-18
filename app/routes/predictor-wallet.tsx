import { useState } from "react";

export default function PredictorWallet() {
  const [activeTab, setActiveTab] = useState("overview");

  const walletData = {
    balance: 1247.5,
    totalEarnings: 2840.25,
    totalStaked: 1592.75,
    pendingWithdrawals: 0,
  };

  const transactions = [
    {
      id: 1,
      type: "win",
      amount: 45.0,
      description: "Won prediction: iPhone Review",
      date: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "stake",
      amount: -25.0,
      description: "Prediction stake: Game Trailer",
      date: "5 hours ago",
      status: "completed",
    },
    {
      id: 3,
      type: "deposit",
      amount: 100.0,
      description: "Bank transfer deposit",
      date: "1 day ago",
      status: "completed",
    },
    {
      id: 4,
      type: "win",
      amount: 35.0,
      description: "Won prediction: Game Review",
      date: "2 days ago",
      status: "completed",
    },
    {
      id: 5,
      type: "withdrawal",
      amount: -200.0,
      description: "Withdrawal to bank account",
      date: "3 days ago",
      status: "completed",
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "bank",
      name: "Chase Bank ****1234",
      isDefault: true,
      status: "verified",
    },
    {
      id: 2,
      type: "paypal",
      name: "PayPal (user@example.com)",
      isDefault: false,
      status: "verified",
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "win":
        return "🎉";
      case "stake":
        return "🎯";
      case "deposit":
        return "💰";
      case "withdrawal":
        return "💸";
      default:
        return "📊";
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) {
      return "text-green-600";
    } else {
      return "text-red-600";
    }
  };

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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Available Balance</h2>
          <span className="text-2xl">💰</span>
        </div>
        <div className="text-3xl font-bold mb-2">
          ${walletData.balance.toFixed(2)}
        </div>
        <div className="flex space-x-6 text-sm text-purple-100">
          <div>
            <span className="block">Total Earned</span>
            <span className="font-semibold">
              ${walletData.totalEarnings.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="block">Total Staked</span>
            <span className="font-semibold">
              ${walletData.totalStaked.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💳</span>
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
            <span className="text-2xl">💸</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">Withdraw</div>
              <div className="text-sm text-gray-500">Transfer to your bank</div>
            </div>
          </div>
        </button>
        <button className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📊</span>
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
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("payment-methods")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "payment-methods"
                  ? "border-purple-500 text-purple-600"
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
                    <span className="text-2xl">📈</span>
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
                    <span className="text-2xl">🎯</span>
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
                    <span className="text-2xl">⏱️</span>
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
                      <span className="text-xl">
                        {getTransactionIcon(transaction.type)}
                      </span>
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
                  <span className="text-2xl">
                    {getTransactionIcon(transaction.type)}
                  </span>
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
                    <span className="text-2xl">
                      {method.type === "bank" ? "🏦" : "💳"}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {method.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
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
    </div>
  );
}
