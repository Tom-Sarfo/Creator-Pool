import type { Route } from "./+types/dashboard";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  RedirectToSignIn,
} from "@clerk/react-router";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  faHome,
  faChartLine,
  faWallet,
  faUser,
  faCog,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import { DASHBOARD_NAVIGATION, CATEGORIES } from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";
import PlayButtonOverlay from "../components/PlayButtonOverlay";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pool Market - Creator Pool" },
    {
      name: "description",
      content: "Discover and participate in prediction pools.",
    },
  ];
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { pools } = useAppContext();

  const navigation = DASHBOARD_NAVIGATION.map((item) => ({
    ...item,
    icon:
      item.icon === "home"
        ? faHome
        : item.icon === "chart-line"
          ? faChartLine
          : item.icon === "brain"
            ? faBrain
            : item.icon === "wallet"
              ? faWallet
              : item.icon === "user"
                ? faUser
                : faHome,
  }));

  const categories = CATEGORIES;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "HOT":
        return "bg-red-100 text-red-800";
      case "TRENDING":
        return "bg-cyan-100 text-cyan-800";
      case "LIVE":
        return "bg-green-100 text-green-800";
      case "NEW":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPools = pools.filter(
    (pool) => selectedCategory === "all" || pool.category === selectedCategory
  );

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <Header
            title="Pool Market"
            showMenuButton={false}
            walletBalance={2450.0}
          />

          <div className="flex">
            {/* Sidebar */}
            <Sidebar navigation={navigation} />

            {/* Main Content */}
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Pool Market
                  </h1>
                  <p className="text-gray-600">
                    Discover and participate in prediction pools from your
                    favorite creators
                  </p>
                </div>

                {/* Filters and Search */}
                <div className="mb-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Tabs */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setActiveTab("active")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === "active"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Active Pools
                      </button>
                      <button
                        onClick={() => setActiveTab("ending")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === "ending"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Ending Soon
                      </button>
                    </div>

                    {/* Search and Category */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search Pool"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <FontAwesomeIcon
                          icon="search"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                        />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPools.map((pool) => (
                    <div
                      key={pool.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Pool Image */}
                      <div className="relative">
                        <img
                          src={pool.thumbnail}
                          alt={pool.title}
                          className="w-full h-48 object-cover"
                        />
                        <PlayButtonOverlay className="bg-black bg-opacity-20" />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pool.status)}`}
                          >
                            {pool.status}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                            <FontAwesomeIcon icon="clock" className="w-3 h-3" />
                            <span>{pool.timeRemaining}</span>
                          </span>
                        </div>
                      </div>

                      {/* Pool Content */}
                      <div className="p-4">
                        {/* Creator Info */}
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">
                            {pool.creator}
                          </span>
                          {pool.creatorVerified && (
                            <FontAwesomeIcon
                              icon="check-circle"
                              className="w-4 h-4 text-cyan-500"
                            />
                          )}
                        </div>

                        {/* Video Title */}
                        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {pool.title}
                        </h3>

                        {/* Prediction Question */}
                        <p className="text-xs text-gray-600 mb-3">
                          {pool.question}
                        </p>

                        {/* Pool Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>
                            Pool Size: ${pool.totalStake.toLocaleString()}
                          </span>
                          <span>{pool.participants} Predictors</span>
                        </div>

                        {/* Odds */}
                        <div className="flex space-x-2 mb-4">
                          <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-green-600 font-medium">
                              YES
                            </div>
                            <div className="text-sm font-bold text-green-700">
                              {pool.odds?.yes || 0}
                            </div>
                            <div className="text-xs text-green-600">
                              {Math.round((pool.odds?.yes || 0) * 100)}% chance
                            </div>
                          </div>
                          <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                            <div className="text-xs text-red-600 font-medium">
                              NO
                            </div>
                            <div className="text-sm font-bold text-red-700">
                              {pool.odds?.no || 0}
                            </div>
                            <div className="text-xs text-red-600">
                              {Math.round((pool.odds?.no || 0) * 100)}% chance
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                          Predict Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                  <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Load More Pools
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
