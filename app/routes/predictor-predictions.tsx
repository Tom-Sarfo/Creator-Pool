import { useState } from "react";

export default function PredictorPredictions() {
  const [activeTab, setActiveTab] = useState("active");

  const tabs = [
    { id: "active", name: "Active", count: 8 },
    { id: "won", name: "Won", count: 12 },
    { id: "lost", name: "Lost", count: 5 },
    { id: "settled", name: "Settled", count: 25 },
  ];

  const activePredictions = [
    {
      id: 1,
      creator: "TechReviewer",
      title: "Will this iPhone review hit 1M views?",
      thumbnail:
        "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=iPhone+Review",
      myChoice: "YES",
      myStake: 25,
      potentialPayout: 45,
      timeRemaining: "2d 14h",
      currentOdds: { yes: 1.8, no: 2.1 },
      progress: 65,
    },
    {
      id: 2,
      creator: "GamingPro",
      title: "Will this game trailer reach 500K views?",
      thumbnail:
        "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Game+Trailer",
      myChoice: "NO",
      myStake: 50,
      potentialPayout: 80,
      timeRemaining: "5d 8h",
      currentOdds: { yes: 2.3, no: 1.6 },
      progress: 30,
    },
    {
      id: 3,
      creator: "CookingMaster",
      title: "Will this recipe video go viral?",
      thumbnail:
        "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Recipe+Video",
      myChoice: "YES",
      myStake: 15,
      potentialPayout: 28.5,
      timeRemaining: "1d 3h",
      currentOdds: { yes: 1.9, no: 1.9 },
      progress: 85,
    },
  ];

  const wonPredictions = [
    {
      id: 4,
      creator: "TechReviewer",
      title: "Will this MacBook review hit 500K views?",
      thumbnail:
        "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=MacBook+Review",
      myChoice: "YES",
      myStake: 30,
      payout: 54,
      settledAt: "2 hours ago",
      result: "WON",
    },
    {
      id: 5,
      creator: "GamingPro",
      title: "Will this game review reach 200K views?",
      thumbnail:
        "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Game+Review",
      myChoice: "NO",
      myStake: 20,
      payout: 35,
      settledAt: "1 day ago",
      result: "WON",
    },
  ];

  const lostPredictions = [
    {
      id: 6,
      creator: "CookingMaster",
      title: "Will this cooking video hit 100K views?",
      thumbnail:
        "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Cooking+Video",
      myChoice: "YES",
      myStake: 25,
      payout: 0,
      settledAt: "3 days ago",
      result: "LOST",
    },
  ];

  const getChoiceColor = (choice: string) => {
    return choice === "YES"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "WON":
        return "text-green-600 bg-green-100";
      case "LOST":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Predictions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your prediction performance and earnings
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-xl">📊</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Total Predictions
              </p>
              <p className="text-lg font-bold text-gray-900">25</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl">🎯</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-lg font-bold text-gray-900">78.7%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-xl">💰</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Total Earnings
              </p>
              <p className="text-lg font-bold text-gray-900">$1,247.50</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-xl">⏱️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Now</p>
              <p className="text-lg font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {predictions.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">📊</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No predictions found
              </h3>
              <p className="text-gray-500">
                {activeTab === "active"
                  ? "You don't have any active predictions. Start predicting to see them here!"
                  : `You haven't ${activeTab} any predictions yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <img
                    src={prediction.thumbnail}
                    alt={prediction.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {prediction.creator}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        VERIFIED
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {prediction.title}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      {activeTab === "active" ? (
                        <>
                          <span>
                            ⏱️{" "}
                            {"timeRemaining" in prediction
                              ? prediction.timeRemaining
                              : "N/A"}
                          </span>
                          <span>
                            📈{" "}
                            {"progress" in prediction ? prediction.progress : 0}
                            % progress
                          </span>
                        </>
                      ) : (
                        <span>
                          ⏰{" "}
                          {"settledAt" in prediction
                            ? prediction.settledAt
                            : "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getChoiceColor(prediction.myChoice)}`}
                      >
                        {prediction.myChoice}
                      </span>
                      {"result" in prediction && prediction.result && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getResultColor(prediction.result)}`}
                        >
                          {prediction.result}
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600">
                        Stake: ${prediction.myStake}
                      </div>
                      {activeTab === "active" ? (
                        <div className="font-medium text-gray-900">
                          Potential: $
                          {"potentialPayout" in prediction
                            ? prediction.potentialPayout
                            : 0}
                        </div>
                      ) : (
                        <div
                          className={`font-medium ${"result" in prediction && prediction.result === "WON" ? "text-green-600" : "text-red-600"}`}
                        >
                          {"result" in prediction && prediction.result === "WON"
                            ? "+"
                            : ""}
                          ${"payout" in prediction ? prediction.payout : 0}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Over Time
        </h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl mb-2 block">📈</span>
            <p className="text-gray-500">Performance chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
