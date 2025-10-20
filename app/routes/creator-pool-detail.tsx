import type { Route } from "./+types/creator-pool-detail";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faCalendar,
  faClock,
  faTag,
  faCheckCircle,
  faEye,
  faHeart,
  faComment,
  faThumbsUp,
  faShare,
  faBookmark,
  faBell,
  faQuestionCircle,
  faChartLine,
  faUsers,
  faDollarSign,
  faEdit,
  faTrash,
  faPause,
  faStop,
  faExclamationTriangle,
  faDownload,
  faExternalLinkAlt,
  faInfoCircle,
  faFilter,
  faSort,
  faSearch,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faFlag,
  faBan,
  faCheck,
  faTimes,
  faCalendarAlt,
  faLayerGroup,
  faCoins,
  faTrophy,
  faGlobe,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { RECENT_PREDICTIONS } from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `My Pool - Creator Pool` },
    {
      name: "description",
      content: "View your pool details and performance metrics.",
    },
  ];
}

export default function CreatorPoolDetailPage({
  params,
}: Route.ComponentProps) {
  const poolId = parseInt(params.id);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [predictionFilter, setPredictionFilter] = useState("all");

  const { getPoolById, pools } = useAppContext();

  // Get status from URL search params (e.g., ?status=settled)
  const statusParam = searchParams.get("status") || "active";

  // Find the pool data from context - fallback to first pool if not found
  const poolData =
    getPoolById(poolId) ||
    (pools.length > 0
      ? pools[0]
      : {
          id: poolId,
          title: "Pool not found",
          question: "Pool data not available",
          participants: 0,
          totalStake: 0,
          timeRemaining: "N/A",
          status: "unknown",
        });

  // Function to get pool data based on status
  const getPoolDataByStatus = (baseData: any, status: string) => {
    const statusMap = {
      active: {
        status: "ACTIVE",
        timeRemaining: "4 days 12h",
        pledgeStatus: "pending",
        pledgeDeposited: 0,
        currentViews: 342000,
        progress: 68.4,
        timeline: [
          {
            phase: "Pool Created",
            date: "Dec 10, 2024",
            completed: true,
            icon: "check",
            description: "Pool configuration completed",
          },
          {
            phase: "Video Published",
            date: "Dec 15, 2024",
            completed: true,
            icon: "play",
            description: "Video went live on YouTube",
          },
          {
            phase: "Predictions Close",
            date: "Dec 16, 2024",
            completed: true,
            icon: "clock",
            description: "Prediction period ended",
          },
          {
            phase: "Settlement",
            date: "Dec 22, 2024",
            completed: false,
            icon: "clock",
            description:
              "Platform automatically settles pool and disburses rewards",
          },
        ],
      },
      settled: {
        status: "SETTLED",
        timeRemaining: "Completed",
        pledgeStatus: "pending",
        pledgeDeposited: 0,
        currentViews: 612000, // Final views exceeded target
        progress: 122.4,
        timeline: [
          {
            phase: "Pool Created",
            date: "Dec 10, 2024",
            completed: true,
            icon: "check",
            description: "Pool configuration completed",
          },
          {
            phase: "Video Published",
            date: "Dec 15, 2024",
            completed: true,
            icon: "play",
            description: "Video went live on YouTube",
          },
          {
            phase: "Predictions Close",
            date: "Dec 16, 2024",
            completed: true,
            icon: "clock",
            description: "Prediction period ended",
          },
          {
            phase: "Settlement",
            date: "Dec 22, 2024",
            completed: true,
            icon: "check",
            description: "Pool settled automatically - Target exceeded!",
          },
        ],
      },
      expired: {
        status: "EXPIRED",
        timeRemaining: "Expired",
        pledgeStatus: "disbursed",
        pledgeDeposited: 1245,
        currentViews: 380000, // Below target
        progress: 76.0,
        timeline: [
          {
            phase: "Pool Created",
            date: "Dec 10, 2024",
            completed: true,
            icon: "check",
            description: "Pool configuration completed",
          },
          {
            phase: "Video Published",
            date: "Dec 15, 2024",
            completed: true,
            icon: "play",
            description: "Video went live on YouTube",
          },
          {
            phase: "Predictions Close",
            date: "Dec 16, 2024",
            completed: true,
            icon: "clock",
            description: "Prediction period ended",
          },
          {
            phase: "Settlement",
            date: "Dec 22, 2024",
            completed: true,
            icon: "check",
            description: "Pool settled - Target not reached",
          },
        ],
      },
    };

    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  const statusData = getPoolDataByStatus(poolData, statusParam);

  // Create comprehensive pool object with creator-specific data based on PRD requirements
  const pool = {
    id: poolData.id,
    title: poolData.title,
    creator: poolData.creator,
    creatorVerified: poolData.creatorVerified,
    creatorSubs: poolData.creatorSubs,
    thumbnail: poolData.thumbnail,
    category: poolData.category,
    status: statusData.status, // ACTIVE, SETTLING, SETTLED, EXPIRED, PAUSED
    timeRemaining: statusData.timeRemaining,
    totalStake: 12450,
    participants: 847,
    odds: poolData.odds,
    question: "Will this video reach 500K views within 7 days of release?",
    targetViews: 500000,
    targetTimeframe: "7 days",
    description: poolData.title,
    youtubeUrl: "https://youtube.com/watch?v=example",
    youtubeId: "example123",
    releaseDate: "Dec 15, 2024",
    expectedDuration: "12 min",

    // PRD-specific data
    poolDuration: "7 days", // Min: 24h, Max: 14d, Default: 7d
    createdAt: "2024-12-10T10:00:00Z",
    closesAt: "2024-12-22T10:00:00Z",
    publishedAt: "2024-12-15T14:30:00Z",

    // Revenue breakdown per PRD
    platformFee: 622.5, // 5% of total pool
    creatorRoyalty: 124.5, // 1% of total pool
    creatorPledge: 1245, // 15% AdSense pledge amount
    pledgeStatus: statusData.pledgeStatus, // pending, deposited, disbursed
    pledgeDeposited: statusData.pledgeDeposited, // amount actually deposited to platform
    creatorWalletBalance: 5000, // creator's current wallet balance

    // Pool distribution
    yesPool: 8964,
    noPool: 3486,
    yesPercentage: 72,
    noPercentage: 28,
    yesStakers: 589,
    noStakers: 258,

    // Video metrics (updated via YouTube API)
    currentViews: statusData.currentViews,
    currentLikes: 18200,
    currentComments: 1200,
    likeRatio: "94%",
    viewGrowthRate: "+12.3%",
    progress: statusData.progress, // % of target reached

    // Timeline data
    timeline: statusData.timeline,

    // Performance metrics
    dailyStats: [
      { date: "Dec 16", views: 156000, predictions: 145 },
      { date: "Dec 17", views: 234000, predictions: 189 },
      { date: "Dec 18", views: 298000, predictions: 201 },
      { date: "Dec 19", views: 342000, predictions: 312 },
    ],
  };

  const recentPredictions = RECENT_PREDICTIONS;

  // Extended predictions data with creator management features
  const allPredictions = [
    ...RECENT_PREDICTIONS,
    {
      user: "GamerPro89",
      time: "1 hour ago",
      prediction: "YES",
      amount: 250,
      status: "active",
    },
    {
      user: "TechEnthusiast",
      time: "2 hours ago",
      prediction: "NO",
      amount: 100,
      status: "active",
    },
    {
      user: "CreatorFan123",
      time: "3 hours ago",
      prediction: "YES",
      amount: 75,
      status: "active",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "SETTLING":
        return "bg-blue-100 text-blue-800";
      case "SETTLED":
        return "bg-purple-100 text-purple-800";
      case "EXPIRED":
        return "bg-gray-100 text-gray-800";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressIcon = (phase: any) => {
    if (phase.completed) {
      return (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="w-4 h-4 text-purple-600"
        />
      );
    }
    return <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-400" />;
  };

  const tabs = [
    { id: "overview", label: "Overview", count: null },
    { id: "predictions", label: "Predictions", count: pool.participants },
    { id: "analytics", label: "Analytics", count: null },
    { id: "settings", label: "Pool Settings", count: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
              <Link
                to="/creator/pools"
                className="text-gray-500 hover:text-gray-700 flex-shrink-0 mt-1"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  Pool Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                  Video: {pool.title}
                </p>
              </div>
            </div>

            {/* Mobile: Stack actions vertically, Desktop: Horizontal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium text-center sm:text-left ${getStatusColor(pool.status)}`}
              >
                {pool.status}
              </span>

              {/* Action buttons - responsive sizing */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {pool.status === "ACTIVE" && (
                  <button className="px-3 sm:px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2 text-sm">
                    <FontAwesomeIcon icon={faPause} className="w-4 h-4" />
                    <span className="hidden sm:inline">Pause Pool</span>
                    <span className="sm:hidden">Pause</span>
                  </button>
                )}
                {pool.pledgeStatus === "pending" && (
                  <button
                    onClick={() => setShowPledgeModal(true)}
                    className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                  >
                    <FontAwesomeIcon icon={faCoins} className="w-4 h-4" />
                    <span className="hidden sm:inline">Deposit Pledge</span>
                    <span className="sm:hidden">Deposit</span>
                  </button>
                )}
                {pool.pledgeStatus === "deposited" && (
                  <div className="px-3 sm:px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center justify-center space-x-2 text-sm">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                    <span className="hidden sm:inline">Pledge Deposited</span>
                    <span className="sm:hidden">Deposited</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 sm:space-x-8 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === "overview" && "Overview"}
                    {tab.id === "predictions" && "Predictions"}
                    {tab.id === "analytics" && "Analytics"}
                    {tab.id === "settings" && "Settings"}
                  </span>
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Tab Content */}
            {activeTab === "overview" && (
              <>
                {/* Pool Timeline */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Pool Timeline
                  </h3>
                  {/* Mobile: Vertical timeline, Desktop: Horizontal */}
                  <div className="block sm:hidden space-y-4">
                    {pool.timeline.map((phase, index) => (
                      <div
                        key={phase.phase}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              phase.completed ? "bg-purple-100" : "bg-gray-100"
                            }`}
                          >
                            {getProgressIcon(phase)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm font-medium ${phase.completed ? "text-gray-900" : "text-gray-500"}`}
                          >
                            {phase.phase}
                          </div>
                          <div
                            className={`text-xs ${phase.completed ? "text-gray-600" : "text-gray-400"}`}
                          >
                            {phase.date}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {phase.description}
                          </div>
                        </div>
                        {index < pool.timeline.length - 1 && (
                          <div className="absolute left-7 mt-8 w-0.5 h-6 bg-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Desktop: Horizontal timeline */}
                  <div className="hidden sm:flex items-center justify-between">
                    {pool.timeline.map((phase, index) => (
                      <div key={phase.phase} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              phase.completed ? "bg-purple-100" : "bg-gray-100"
                            }`}
                          >
                            {getProgressIcon(phase)}
                          </div>
                          <span
                            className={`text-xs mt-2 text-center ${phase.completed ? "text-gray-900" : "text-gray-500"}`}
                          >
                            {phase.phase}
                          </span>
                          <span
                            className={`text-xs text-center ${phase.completed ? "text-gray-600" : "text-gray-400"}`}
                          >
                            {phase.date}
                          </span>
                        </div>
                        {index < pool.timeline.length - 1 && (
                          <div
                            className={`w-12 h-0.5 mx-4 ${
                              pool.timeline[index + 1].completed
                                ? "bg-purple-200"
                                : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  {/* Mobile: Stack image and content vertically, Desktop: Side by side */}
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <img
                      src={pool.thumbnail}
                      alt={pool.title}
                      className="w-full sm:w-32 h-48 sm:h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                        <a
                          href={pool.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                        >
                          <FontAwesomeIcon
                            icon={faExternalLinkAlt}
                            className="w-4 h-4"
                          />
                          <span>View on YouTube</span>
                        </a>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                        {pool.title}
                      </h3>
                      {/* Mobile: Stack info vertically, Desktop: Wrap */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <span className="break-words">
                          Target: {pool.targetViews.toLocaleString()} views in{" "}
                          {pool.targetTimeframe}
                        </span>
                        <span>Duration: {pool.poolDuration}</span>
                        <span>Category: {pool.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="border-t pt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="w-5 h-5 text-purple-600"
                      />
                      <h4 className="text-lg font-medium text-gray-900">
                        Prediction Question
                      </h4>
                    </div>
                    <p className="text-gray-700 mb-4">{pool.question}</p>

                    {/* Progress */}
                    <div className="mb-2">
                      {/* Mobile: Stack stats vertically, Desktop: Side by side */}
                      <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600 mb-2">
                        <span>Current Progress: {pool.progress}%</span>
                        <span className="break-all sm:break-normal">
                          {pool.currentViews.toLocaleString()} /{" "}
                          {pool.targetViews.toLocaleString()} views
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            pool.progress > 100
                              ? "bg-green-500"
                              : "bg-purple-600"
                          }`}
                          style={{ width: `${Math.min(pool.progress, 100)}%` }}
                        ></div>
                        {pool.progress > 100 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                              Target Exceeded!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Predictions Tab */}
            {activeTab === "predictions" && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      All Predictions
                    </h3>
                    <div className="flex items-center space-x-4">
                      <select
                        value={predictionFilter}
                        onChange={(e) => setPredictionFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="all">All Predictions</option>
                        <option value="yes">YES Only</option>
                        <option value="no">NO Only</option>
                        <option value="high">High Stakes ($100+)</option>
                      </select>
                      <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="w-4 h-4"
                        />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {allPredictions.map((prediction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {prediction.user}
                            </p>
                            <p className="text-sm text-gray-500">
                              {prediction.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p
                              className={`font-medium ${prediction.prediction === "YES" ? "text-green-600" : "text-red-600"}`}
                            >
                              {prediction.prediction}
                            </p>
                            <p className="text-sm text-gray-500">Prediction</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900">
                              ${prediction.amount}
                            </p>
                            <p className="text-sm text-gray-500">Stake</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-red-600">
                              <FontAwesomeIcon
                                icon={faFlag}
                                className="w-4 h-4"
                              />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600">
                              <FontAwesomeIcon
                                icon={faBan}
                                className="w-4 h-4"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button className="px-6 py-2 text-sm text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50">
                      Load More Predictions
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <>
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="w-6 h-6 text-blue-600"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">
                          Total Participants
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {pool.participants}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FontAwesomeIcon
                          icon={faDollarSign}
                          className="w-6 h-6 text-green-600"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Total Pool Size</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${pool.totalStake.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <FontAwesomeIcon
                          icon={faTrophy}
                          className="w-6 h-6 text-purple-600"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Your Royalty</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${pool.creatorRoyalty}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily Stats Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Daily Performance
                  </h3>
                  <div className="space-y-4">
                    {pool.dailyStats.map((stat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {stat.date}
                          </p>
                          <p className="text-sm text-gray-600">
                            {stat.predictions} new predictions
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {stat.views.toLocaleString()} views
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-green-600">
                            <FontAwesomeIcon
                              icon={faArrowUp}
                              className="w-4 h-4"
                            />
                            <span>
                              +
                              {(
                                ((stat.views -
                                  (index > 0
                                    ? pool.dailyStats[index - 1].views
                                    : 0)) /
                                  Math.max(
                                    pool.dailyStats[index - 1]?.views || 1,
                                    1
                                  )) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Pool Configuration
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pool Question
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        rows={3}
                        defaultValue={pool.question}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Views
                        </label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          defaultValue={pool.targetViews}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeframe (days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="14"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          defaultValue={7}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="w-5 h-5 text-yellow-600"
                        />
                        <div>
                          <p className="font-medium text-yellow-800">
                            Danger Zone
                          </p>
                          <p className="text-sm text-yellow-700">
                            These actions cannot be undone
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Close Pool Early
                      </button>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Pool Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pool Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pool Size:</span>
                  <span className="font-medium">
                    ${pool.totalStake.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Predictors:</span>
                  <span className="font-medium">
                    {pool.participants.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee (5%):</span>
                  <span className="font-medium">${pool.platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Royalty (1%):</span>
                  <span className="font-medium">${pool.creatorRoyalty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Creator Pledge:</span>
                  <span className="font-medium">
                    ${pool.creatorPledge.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Pledge Status */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Pledge Status</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pool.pledgeStatus === "deposited"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {pool.pledgeStatus === "deposited"
                      ? "Deposited"
                      : "Pending"}
                  </span>
                </div>
                {pool.pledgeStatus === "deposited" ? (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="w-4 h-4"
                      />
                      <span>
                        Pledge amount deposited and ready for disbursement
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                      <span className="font-medium">
                        Pledge not yet deposited
                      </span>
                    </div>
                    <p className="text-xs">
                      Deposit your pledge amount to add it to the pool for
                      disbursement to winners.
                    </p>
                  </div>
                )}
              </div>

              {/* Pool Distribution */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Pool Distribution</h4>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600">
                      YES ({pool.yesPercentage}%)
                    </span>
                    <span className="text-green-600">
                      ${pool.yesPool.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${pool.yesPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {pool.yesStakers} stakers
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-600">
                      NO ({pool.noPercentage}%)
                    </span>
                    <span className="text-red-600">
                      ${pool.noPool.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${pool.noPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {pool.noStakers} stakers
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                    <span>Current Views</span>
                  </span>
                  <span className="font-medium">
                    {pool.currentViews.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faThumbsUp} className="w-4 h-4" />
                    <span>Likes</span>
                  </span>
                  <span className="font-medium">
                    {pool.currentLikes.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faComment} className="w-4 h-4" />
                    <span>Comments</span>
                  </span>
                  <span className="font-medium">
                    {pool.currentComments.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4" />
                    <span>Growth Rate</span>
                  </span>
                  <span className="font-medium text-green-600">
                    {pool.viewGrowthRate}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentPredictions.slice(0, 4).map((prediction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {prediction.user}
                        </p>
                        <p className="text-xs text-gray-500">
                          {prediction.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${prediction.prediction === "YES" ? "text-green-600" : "text-red-600"}`}
                      >
                        {prediction.prediction}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${prediction.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pledge Deposit Modal */}
      {showPledgeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowPledgeModal(false)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center space-x-3 mb-4">
                <FontAwesomeIcon
                  icon={faCoins}
                  className="w-6 h-6 text-purple-600"
                />
                <h3 className="text-lg font-medium text-gray-900">
                  Deposit Creator Pledge
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm font-medium text-purple-900">
                      Pledge Details
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    You pledged <strong>15%</strong> of your estimated AdSense
                    revenue from this video to add to the pool for disbursement.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Pledge Amount</span>
                    <span className="font-medium text-lg">
                      ${pool.creatorPledge.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Your Wallet Balance</span>
                    <span className="font-medium">
                      ${pool.creatorWalletBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">After Deposit</span>
                    <span className="font-medium text-gray-900">
                      $
                      {(
                        pool.creatorWalletBalance - pool.creatorPledge
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="w-4 h-4 text-yellow-600 mt-0.5"
                    />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Important:</p>
                      <p>
                        This amount will be automatically disbursed to winning
                        predictors when the pool settles. Platform takes 5% fee
                        from total pool.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPledgeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    pool.creatorWalletBalance >= pool.creatorPledge
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                  disabled={pool.creatorWalletBalance < pool.creatorPledge}
                >
                  <FontAwesomeIcon icon={faCoins} className="w-4 h-4" />
                  <span>Deposit ${pool.creatorPledge.toLocaleString()}</span>
                </button>
              </div>

              {pool.creatorWalletBalance < pool.creatorPledge && (
                <div className="mt-3 text-center">
                  <p className="text-sm text-red-600">
                    Insufficient wallet balance. You need $
                    {pool.creatorPledge.toLocaleString()} but only have $
                    {pool.creatorWalletBalance.toLocaleString()}.
                  </p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                    Add Funds to Wallet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
