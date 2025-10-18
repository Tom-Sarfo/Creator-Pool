import type { Route } from "./+types/creator-pools";
import { Link } from "react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faPlus,
  faChartBar,
  faUsers,
  faDollarSign,
  faTrophy,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pool Management - Creator Pool" },
    {
      name: "description",
      content: "Create and manage prediction pools for your YouTube videos.",
    },
  ];
}

export default function CreatorPools() {
  const [activeTab, setActiveTab] = useState("active");

  // Mock data - will be replaced with real data later
  const pools = [
    {
      id: 1,
      videoTitle: "My Latest Gaming Video - Epic Win!",
      question: "Will this video reach 20K views in 7 days?",
      participants: 23,
      totalStake: 450,
      timeRemaining: "5 days, 12 hours",
      status: "active",
      createdAt: "2024-01-15",
      targetViews: 20000,
      currentViews: 12500,
    },
    {
      id: 2,
      videoTitle: "React Tutorial Series",
      question: "Will this get 15K views in 5 days?",
      participants: 18,
      totalStake: 320,
      timeRemaining: "2 days, 8 hours",
      status: "active",
      createdAt: "2024-01-12",
      targetViews: 15000,
      currentViews: 8900,
    },
    {
      id: 3,
      videoTitle: "Tutorial: How to Build a React App",
      question: "Will this reach 10K views in 3 days?",
      participants: 12,
      totalStake: 180,
      timeRemaining: "Settled",
      status: "settled",
      createdAt: "2024-01-10",
      targetViews: 10000,
      currentViews: 12500,
      result: "won",
      creatorEarnings: 12.5,
    },
    {
      id: 4,
      videoTitle: "Advanced JavaScript Concepts",
      question: "Will this get 25K views in 10 days?",
      participants: 0,
      totalStake: 0,
      timeRemaining: "Expired",
      status: "expired",
      createdAt: "2024-01-05",
      targetViews: 25000,
      currentViews: 8500,
    },
  ];

  const tabs = [
    {
      id: "active",
      name: "Active",
      count: pools.filter((p) => p.status === "active").length,
    },
    {
      id: "settled",
      name: "Settled",
      count: pools.filter((p) => p.status === "settled").length,
    },
    {
      id: "expired",
      name: "Expired",
      count: pools.filter((p) => p.status === "expired").length,
    },
  ];

  const filteredPools = pools.filter((pool) => {
    if (activeTab === "active") return pool.status === "active";
    if (activeTab === "settled") return pool.status === "settled";
    if (activeTab === "expired") return pool.status === "expired";
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      settled: "bg-blue-100 text-blue-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`;
  };

  const getResultBadge = (result: string) => {
    const styles = {
      won: "bg-green-100 text-green-800",
      lost: "bg-red-100 text-red-800",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[result as keyof typeof styles]}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Pool Management
            </h1>
            <p className="text-gray-600">
              Create and manage prediction pools for your YouTube videos.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/creator/pools/new"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
              Create New Pool
            </Link>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="w-5 h-5 text-green-600"
                />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Pools</p>
              <p className="text-xl font-semibold text-gray-900">
                {pools.filter((p) => p.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="w-5 h-5 text-blue-600"
                />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Total Participants
              </p>
              <p className="text-xl font-semibold text-gray-900">
                {pools.reduce((sum, pool) => sum + pool.participants, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="w-5 h-5 text-purple-600"
                />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Staked</p>
              <p className="text-xl font-semibold text-gray-900">
                $
                {pools
                  .reduce((sum, pool) => sum + pool.totalStake, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="w-5 h-5 text-yellow-600"
                />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Earned</p>
              <p className="text-xl font-semibold text-gray-900">
                $
                {pools
                  .filter((p) => p.creatorEarnings)
                  .reduce((sum, pool) => sum + (pool.creatorEarnings || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Pools list */}
      <div className="space-y-4">
        {filteredPools.map((pool) => (
          <div
            key={pool.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {pool.videoTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {pool.question}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={getStatusBadge(pool.status)}>
                      {pool.status}
                    </span>
                    {pool.result && (
                      <span className={getResultBadge(pool.result)}>
                        {pool.result}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Participants</p>
                    <p className="font-medium text-gray-900">
                      {pool.participants}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Staked</p>
                    <p className="font-medium text-gray-900">
                      ${pool.totalStake}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Target Views</p>
                    <p className="font-medium text-gray-900">
                      {pool.targetViews.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Views</p>
                    <p className="font-medium text-gray-900">
                      {pool.currentViews.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Progress bar for active pools */}
                {pool.status === "active" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                      <span>Progress to target</span>
                      <span>
                        {Math.round(
                          (pool.currentViews / pool.targetViews) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((pool.currentViews / pool.targetViews) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Creator earnings for settled pools */}
                {pool.creatorEarnings && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">
                        Creator Earnings
                      </span>
                      <span className="text-lg font-semibold text-green-800">
                        ${pool.creatorEarnings}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Time Remaining</p>
                  <p className="text-sm font-medium text-gray-900">
                    {pool.timeRemaining}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-white text-gray-600 border border-gray-300 text-sm py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                  {pool.status === "active" && (
                    <button className="bg-purple-600 text-white text-sm py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                      Manage Pool
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredPools.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon
            icon={faBullseye}
            className="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No pools found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "active"
              ? "Create your first prediction pool to get started."
              : activeTab === "settled"
                ? "No settled pools yet."
                : "No expired pools."}
          </p>
          <div className="mt-6">
            <Link
              to="/creator/pools/new"
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Create New Pool
            </Link>
          </div>
        </div>
      )}

      {/* Mobile bottom navigation hint */}
      <div className="lg:hidden mt-8 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700 text-center">
          <FontAwesomeIcon icon={faLightbulb} className="mr-1" />
          Tap on pool cards to view detailed information and manage settings
        </p>
      </div>
    </div>
  );
}
