import type { Route } from "./+types/creator-pools";
import { useState } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faPlus,
  faChartBar,
  faUsers,
  faUsersRectangle,
  faDollarSign,
  faTrophy,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import Tabs from "../components/Tabs";
import EnablePoolModal from "../components/EnablePoolModal";
import StatsCard from "../components/StatsCard";
import { CREATOR_POOLS_DATA } from "../lib/constants";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pools = CREATOR_POOLS_DATA;

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

  const handleCreatePoolClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePool = (poolData: any) => {
    // Handle pool creation logic here
    console.log("Creating pool:", poolData);
    // You can add API call to create the pool here
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
            <button
              onClick={handleCreatePoolClick}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
              Create New Pool
            </button>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Active Pools"
          value={pools.filter((p) => p.status === "active").length}
          icon={faUsersRectangle}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          iconSize="medium"
        />

        <StatsCard
          title="Total Participants"
          value={pools.reduce((sum, pool) => sum + pool.participants, 0)}
          icon={faUsers}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          iconSize="medium"
        />

        <StatsCard
          title="Total Staked"
          value={`$${pools.reduce((sum, pool) => sum + pool.totalStake, 0).toLocaleString()}`}
          icon={faDollarSign}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          iconSize="medium"
        />

        <StatsCard
          title="Total Earned"
          value={`$${pools
            .filter((p) => p.creatorEarnings)
            .reduce((sum, pool) => sum + (pool.creatorEarnings || 0), 0)
            .toFixed(2)}`}
          icon={faDollarSign}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          iconSize="medium"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Pools list */}
      <div className="space-y-4">
        {filteredPools.map((pool) => (
          <div
            key={pool.id}
            className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            {/* Status badges at the top right */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <span className={getStatusBadge(pool.status)}>{pool.status}</span>
              {pool.result && (
                <span className={getResultBadge(pool.result)}>
                  {pool.result}
                </span>
              )}
            </div>

            <div className="pr-24">
              {/* Title and question */}
              <div className="mb-3">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {pool.videoTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{pool.question}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
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

              {/* Time remaining */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">Time Remaining</p>
                <p className="text-sm font-medium text-gray-900">
                  {pool.timeRemaining}
                </p>
              </div>

              {/* Progress bar - extended to full width */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>
                    {pool.status === "active"
                      ? "Progress to target"
                      : pool.status === "settled"
                        ? "Final progress"
                        : "Final progress"}
                  </span>
                  <span>
                    {Math.round((pool.currentViews / pool.targetViews) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      pool.status === "active"
                        ? "bg-purple-600"
                        : pool.status === "settled"
                          ? "bg-green-600"
                          : "bg-gray-500"
                    }`}
                    style={{
                      width: `${Math.min((pool.currentViews / pool.targetViews) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Creator earnings for settled pools */}
              {pool.creatorEarnings && (
                <div className="mb-4 p-3 bg-green-50 rounded-md">
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

              {/* Action buttons under progress bar */}
              <div className="flex space-x-2">
                <Link
                  to={`/creator/pool/${pool.id}?status=${pool.status}`}
                  className="bg-white text-gray-600 border border-gray-300 text-sm py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  View Details
                </Link>
                {pool.status === "active" && (
                  <Link
                    to={`/creator/pool/${pool.id}?status=active`}
                    className="bg-purple-600 text-white text-sm py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Manage Pool
                  </Link>
                )}
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
            <button
              onClick={handleCreatePoolClick}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Create New Pool
            </button>
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

      {/* Enable Pool Modal */}
      <EnablePoolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={null}
        onEnablePool={handleCreatePool}
      />
    </div>
  );
}
