import type { Route } from "./+types/creator-analytics";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faDollarSign,
  faTrophy,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import {
  CREATOR_ANALYTICS_DATA,
  CREATOR_ANALYTICS_POOL_PERFORMANCE,
  CREATOR_ANALYTICS_MONTHLY_DATA,
  TIME_RANGES,
} from "../lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Analytics - Creator Pool" },
    {
      name: "description",
      content: "View analytics and insights for your prediction pools.",
    },
  ];
}

export default function CreatorAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const analytics = CREATOR_ANALYTICS_DATA;
  const poolPerformance = CREATOR_ANALYTICS_POOL_PERFORMANCE;
  const monthlyData = CREATOR_ANALYTICS_MONTHLY_DATA;
  const timeRanges = TIME_RANGES;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Analytics
            </h1>
            <p className="text-gray-600">
              Insights and performance metrics for your prediction pools.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="w-5 h-5 text-blue-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Pools</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.totalPools}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="w-5 h-5 text-green-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">
                Total Participants
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.totalParticipants}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="w-5 h-5 text-purple-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Staked</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${analytics.totalStaked.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="w-5 h-5 text-yellow-600"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Win Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.winRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Pool Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pool Performance
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {poolPerformance.map((pool, index) => (
              <div key={index} className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {pool.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pool.status === "won"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pool.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Participants</p>
                    <p className="font-medium text-gray-900">
                      {pool.participants}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Staked</p>
                    <p className="font-medium text-gray-900">${pool.stake}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Earnings</p>
                    <p className="font-medium text-gray-900">
                      ${pool.earnings}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Overview
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-900">
                      {month.month}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{month.pools} pools</span>
                        <span>{month.participants} participants</span>
                        <span>${month.earnings} earned</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(month.earnings / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Pool */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top Performing Pool
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {analytics.topPerformingPool.title}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Participants</p>
                <p className="font-medium text-gray-900">
                  {analytics.topPerformingPool.participants}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Total Staked</p>
                <p className="font-medium text-gray-900">
                  ${analytics.topPerformingPool.totalStake}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Creator Earnings</p>
                <p className="font-medium text-gray-900">
                  ${analytics.topPerformingPool.earnings}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-right">
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-purple-50 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-4">
          <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
          Insights
        </h2>
        <div className="space-y-3 text-sm text-purple-800">
          <p>
            • Your gaming content performs best with prediction pools, averaging
            20+ participants per pool.
          </p>
          <p>
            • Tutorial videos tend to have higher engagement rates and longer
            prediction periods.
          </p>
          <p>
            • Consider creating pools for videos with 5K+ views for optimal
            participation.
          </p>
          <p>
            • Your win rate of {analytics.winRate}% is above the platform
            average of 65%.
          </p>
        </div>
      </div>

      {/* Mobile bottom navigation hint */}
      <div className="lg:hidden mt-8 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700 text-center">
          <FontAwesomeIcon icon={faLightbulb} className="mr-1" />
          Swipe left/right on charts to see more detailed analytics
        </p>
      </div>
    </div>
  );
}
