// Navigation constants
export const PREDICTOR_NAVIGATION = [
  { name: "Dashboard", href: "/predictor", icon: "home" },
  { name: "Active Pools", href: "/predictor/pools", icon: "users-rectangle" },
  {
    name: "My Predictions",
    href: "/predictor/predictions",
    icon: "brain",
  },
  { name: "Wallet", href: "/predictor/wallet", icon: "wallet" },
  { name: "Profile", href: "/predictor/profile", icon: "user" },
];

export const CREATOR_NAVIGATION = [
  { name: "Dashboard", href: "/creator", icon: "home" },
  { name: "Pools", href: "/creator/pools", icon: "users-rectangle" },
  { name: "Analytics", href: "/creator/analytics", icon: "chart-line" },
  { name: "Wallet", href: "/creator/wallet", icon: "wallet" },
  { name: "Settings", href: "/creator/settings", icon: "cog" },
];

export const DASHBOARD_NAVIGATION = [
  { name: "Dashboard", href: "/dashboard", icon: "home" },
  { name: "Active Pools", href: "/predictor/pools", icon: "users-rectangle" },
  {
    name: "My Predictions",
    href: "/predictor/predictions",
    icon: "brain",
  },
  { name: "Wallet", href: "/predictor/wallet", icon: "wallet" },
  { name: "Profile", href: "/predictor/profile", icon: "user" },
];

// Category constants
export const CATEGORIES = [
  { id: "all", name: "All Categories" },
  { id: "tech", name: "Tech" },
  { id: "gaming", name: "Gaming" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "education", name: "Education" },
  { id: "entertainment", name: "Entertainment" },
];

// Unified video and pool data structure - all videos start as unlisted by default
export const ALL_VIDEOS = [
  {
    // Video basic info
    id: 1,
    title: "Ultimate Gaming Setup Tour 2024 - $10K Build!",
    thumbnail:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop&crop=center",
    status: "unlisted", // First 3 videos are published
    views: 0,
    likes: 0,
    duration: "12:34",
    uploadDate: "2 days ago",

    // Creator info
    creator: "TechReview Pro",
    creatorVerified: true,
    creatorSubs: "2.4M subs",
    category: "tech",

    // Pool info - initially no pool
    poolId: null,
    poolStatus: null, // No pool initially - will be set when pool is created
    poolQuestion: null,
    poolParticipants: 0,
    poolTotalStake: 0,
    poolCreatorPledge: 0,
    poolPredictorStakes: 0,
    poolTimeRemaining: null,
    poolTargetViews: null,
    poolCurrentViews: 0,
    poolCreatedAt: null,
    poolOdds: null,
    poolYesStake: 0,
    poolNoStake: 0,
    poolYesCount: 0,
    poolNoCount: 0,
  },
  {
    id: 2,
    title: "React vs Vue: The Ultimate 2024 Comparison",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop&crop=center",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "18:42",
    uploadDate: "1 day ago",

    creator: "GameMaster Elite",
    creatorVerified: true,
    creatorSubs: "1.8M subs",
    category: "tech",

    poolId: null,
    poolStatus: null,
    poolQuestion: null,
    poolParticipants: 0,
    poolTotalStake: 0,
    poolCreatorPledge: 0,
    poolPredictorStakes: 0,
    poolTimeRemaining: null,
    poolTargetViews: null,
    poolCurrentViews: 0,
    poolCreatedAt: null,
    poolOdds: null,
    poolYesStake: 0,
    poolNoStake: 0,
    poolYesCount: 0,
    poolNoCount: 0,
  },
  {
    id: 3,
    title: "5 Minute Crafts That Actually Work!",
    thumbnail:
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop&crop=center",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "8:15",
    uploadDate: "6 hours ago",

    creator: "FitLife Coach",
    creatorVerified: true,
    creatorSubs: "950K subs",
    category: "lifestyle",

    poolId: null,
    poolStatus: null,
    poolQuestion: null,
    poolParticipants: 0,
    poolTotalStake: 0,
    poolCreatorPledge: 0,
    poolPredictorStakes: 0,
    poolTimeRemaining: null,
    poolTargetViews: null,
    poolCurrentViews: 0,
    poolCreatedAt: null,
    poolOdds: null,
    poolYesStake: 0,
    poolNoStake: 0,
    poolYesCount: 0,
    poolNoCount: 0,
  },
  {
    id: 4,
    title: "AI Will Change Everything in 2024 - Here's How",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop&crop=center",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "22:18",
    uploadDate: "2 hours ago",

    creator: "TechReview Pro",
    creatorVerified: true,
    creatorSubs: "2.4M subs",
    category: "tech",

    poolId: null,
    poolStatus: null,
    poolQuestion: null,
    poolParticipants: 0,
    poolTotalStake: 0,
    poolCreatorPledge: 0,
    poolPredictorStakes: 0,
    poolTimeRemaining: null,
    poolTargetViews: null,
    poolCurrentViews: 0,
    poolCreatedAt: null,
    poolOdds: null,
    poolYesStake: 0,
    poolNoStake: 0,
    poolYesCount: 0,
    poolNoCount: 0,
  },
  {
    id: 5,
    title: "10 Productivity Hacks That Actually Work",
    thumbnail:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=200&fit=crop&crop=center",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "15:30",
    uploadDate: "1 hour ago",

    creator: "GameMaster Elite",
    creatorVerified: true,
    creatorSubs: "1.8M subs",
    category: "lifestyle",

    poolId: null,
    poolStatus: null,
    poolQuestion: null,
    poolParticipants: 0,
    poolTotalStake: 0,
    poolCreatorPledge: 0,
    poolPredictorStakes: 0,
    poolTimeRemaining: null,
    poolTargetViews: null,
    poolCurrentViews: 0,
    poolCreatedAt: null,
    poolOdds: null,
    poolYesStake: 0,
    poolNoStake: 0,
    poolYesCount: 0,
    poolNoCount: 0,
  },
  {
    id: 6,
    title: "Home Gym Setup Under $500 - Complete Guide",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&crop=center",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "11:45",
    uploadDate: "5 hours ago",

    creator: "FitLife Coach",
    creatorVerified: true,
    creatorSubs: "950K subs",
    category: "lifestyle",

    poolId: null,
    poolStatus: null,
    poolQuestion: null,
    poolParticipants: 0,
    poolTotalStake: 0,
    poolCreatorPledge: 0,
    poolPredictorStakes: 0,
    poolTimeRemaining: null,
    poolTargetViews: null,
    poolCurrentViews: 0,
    poolCreatedAt: null,
    poolOdds: null,
    poolYesStake: 0,
    poolNoStake: 0,
    poolYesCount: 0,
    poolNoCount: 0,
  },
  {
    id: 7,
    title: "Advanced JavaScript Concepts Explained",
    thumbnail:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300&h=200&fit=crop&crop=center",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "25:30",
    uploadDate: "3 hours ago",

    creator: "Chef Maria",
    creatorVerified: true,
    creatorSubs: "1.2M subs",
    category: "education",

    poolId: null,
    poolStatus: null,
    poolQuestion: null,
    poolParticipants: 0,
    poolTotalStake: 0,
    poolCreatorPledge: 0,
    poolPredictorStakes: 0,
    poolTimeRemaining: null,
    poolTargetViews: null,
    poolCurrentViews: 0,
    poolCreatedAt: null,
    poolOdds: null,
    poolYesStake: 0,
    poolNoStake: 0,
    poolYesCount: 0,
    poolNoCount: 0,
  },
  {
    id: 8,
    title: "CSS Grid vs Flexbox - Complete Guide",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "18:15",
    uploadDate: "4 hours ago",

    creator: "Wanderlust Adventures",
    creatorVerified: true,
    creatorSubs: "3.1M subs",
    category: "education",

    poolId: null,
    poolStatus: null,
    poolQuestion: null,
    poolParticipants: 0,
    poolTotalStake: 0,
    poolCreatorPledge: 0,
    poolPredictorStakes: 0,
    poolTimeRemaining: null,
    poolTargetViews: null,
    poolCurrentViews: 0,
    poolCreatedAt: null,
    poolOdds: null,
    poolYesStake: 0,
    poolNoStake: 0,
    poolYesCount: 0,
    poolNoCount: 0,
  },
  {
    id: 9,
    title: "Node.js Backend Development Tutorial",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop&crop=center",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "32:45",
    uploadDate: "6 hours ago",

    creator: "EduMaster Pro",
    creatorVerified: true,
    creatorSubs: "750K subs",
    category: "education",

    poolId: null,
    poolStatus: null,
    poolQuestion: null,
    poolParticipants: 0,
    poolTotalStake: 0,
    poolCreatorPledge: 0,
    poolPredictorStakes: 0,
    poolTimeRemaining: null,
    poolTargetViews: null,
    poolCurrentViews: 0,
    poolCreatedAt: null,
    poolOdds: null,
    poolYesStake: 0,
    poolNoStake: 0,
    poolYesCount: 0,
    poolNoCount: 0,
  },
];

// Quick actions constants
export const PREDICTOR_QUICK_ACTIONS = [
  {
    title: "Browse Active Pools",
    description: "Discover new prediction opportunities",
    icon: "bullseye",
    href: "/predictor/pools",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "View My Predictions",
    description: "Track your active predictions",
    icon: "chart-line",
    href: "/predictor/predictions",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Manage Wallet",
    description: "Deposit, withdraw, or view balance",
    icon: "wallet",
    href: "/predictor/wallet",
    color: "bg-green-500 hover:bg-green-600",
  },
];

// Recent predictions constants
export const RECENT_PREDICTIONS = [
  {
    user: "CryptoKing23",
    time: "2 minutes ago",
    prediction: "YES",
    amount: 125,
  },
  {
    user: "TechSavvy_Sarah",
    time: "5 minutes ago",
    prediction: "NO",
    amount: 75,
  },
  {
    user: "InvestorMike",
    time: "8 minutes ago",
    prediction: "YES",
    amount: 200,
  },
];

// Quick stakes constants
export const QUICK_STAKES = [10, 25, 50, 100];

// Video data constants
export const MOCK_VIDEOS = [
  {
    id: 1,
    title: "iPhone 15 Pro Max - Complete Review",
    thumbnail:
      "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=iPhone+15+Pro",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "12:34",
    uploadDate: "2024-01-15",
    poolStatus: "active",
    poolParticipants: 847,
    poolStake: 12450,
  },
  {
    id: 2,
    title: "PlayStation 6 Leak Analysis",
    thumbnail:
      "https://via.placeholder.com/300x200/10B981/FFFFFF?text=PS6+Leak",
    status: "unlisted",
    views: 0,
    likes: 0,
    duration: "8:45",
    uploadDate: "2024-01-14",
    poolStatus: "active",
    poolParticipants: 623,
    poolStake: 8920,
  },
  {
    id: 3,
    title: "Fitness Transformation Journey",
    thumbnail:
      "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Fitness+Transform",
    status: "published",
    views: 125000,
    likes: 8500,
    duration: "15:20",
    uploadDate: "2024-01-10",
    poolStatus: "settled",
    poolParticipants: 412,
    poolStake: 5670,
  },
];

// Tab constants
export const VIDEO_TABS = [
  { id: "all", name: "All Videos", count: 0 },
  { id: "active", name: "Active Pools", count: 0 },
  { id: "unlisted", name: "Unlisted", count: 0 },
];

export const PREDICTION_TABS = [
  { id: "active", name: "Active", count: 8 },
  { id: "won", name: "Won", count: 12 },
  { id: "lost", name: "Lost", count: 5 },
  { id: "settled", name: "Settled", count: 25 },
];

export const CREATOR_SETTINGS_TABS = [
  { id: "profile", name: "Profile", icon: "user" },
  { id: "youtube", name: "YouTube", icon: "tv" },
  { id: "notifications", name: "Notifications", icon: "bell" },
  { id: "billing", name: "Billing", icon: "credit-card" },
  { id: "privacy", name: "Privacy", icon: "shield" },
];

export const CREATOR_POOL_TABS = [
  { id: "active", name: "Active", count: 3 },
  { id: "settled", name: "Settled", count: 12 },
  { id: "expired", name: "Expired", count: 2 },
];

// Prediction data constants
export const ACTIVE_PREDICTIONS = [
  {
    id: 1,
    poolTitle: "iPhone 15 Pro Max Review",
    creator: "TechReview Pro",
    myChoice: "YES",
    stake: 25,
    odds: 1.8,
    timeRemaining: "2d 14h",
    progress: 65,
  },
  {
    id: 2,
    poolTitle: "PlayStation 6 Leak",
    creator: "GameMaster Elite",
    myChoice: "NO",
    stake: 50,
    odds: 2.1,
    timeRemaining: "5h 12m",
    progress: 80,
  },
];

export const WON_PREDICTIONS = [
  {
    id: 4,
    poolTitle: "Fitness Transformation",
    creator: "FitLife Coach",
    myChoice: "YES",
    stake: 30,
    odds: 1.9,
    settledAt: "2024-01-10",
    result: "WON",
    payout: 57,
  },
];

export const LOST_PREDICTIONS = [
  {
    id: 6,
    poolTitle: "Cooking Masterclass",
    creator: "Chef Maria",
    myChoice: "NO",
    stake: 20,
    odds: 2.2,
    settledAt: "2024-01-08",
    result: "LOST",
    payout: 0,
  },
];

// Transaction data constants
export const MOCK_TRANSACTIONS = [
  {
    id: 1,
    type: "deposit",
    amount: 100,
    status: "completed",
    timestamp: "2024-01-15T10:30:00Z",
    description: "Deposit via PayPal",
  },
  {
    id: 2,
    type: "stake",
    amount: -25,
    status: "completed",
    timestamp: "2024-01-15T09:15:00Z",
    description: "Stake on iPhone Review Pool",
  },
  {
    id: 3,
    type: "win",
    amount: 45,
    status: "completed",
    timestamp: "2024-01-14T16:45:00Z",
    description: "Won prediction on Gaming Video",
  },
];

// Payment methods constants
export const PAYMENT_METHODS = [
  {
    id: 1,
    type: "paypal",
    name: "PayPal",
    last4: "1234",
    isDefault: true,
  },
  {
    id: 2,
    type: "card",
    name: "Visa",
    last4: "5678",
    isDefault: false,
  },
];

// Analytics data constants
export const POOL_PERFORMANCE = [
  {
    name: "Gaming Video",
    participants: 156,
    totalStake: 2840,
    creatorEarnings: 28.4,
    accuracy: 85,
  },
  {
    name: "Tech Review",
    participants: 89,
    totalStake: 1920,
    creatorEarnings: 19.2,
    accuracy: 72,
  },
  {
    name: "Fitness Content",
    participants: 234,
    totalStake: 4560,
    creatorEarnings: 45.6,
    accuracy: 91,
  },
];

export const MONTHLY_DATA = [
  { month: "Jan", pools: 2, participants: 25, earnings: 15.5 },
  { month: "Feb", pools: 3, participants: 45, earnings: 28.3 },
  { month: "Mar", pools: 4, participants: 67, earnings: 42.1 },
  { month: "Apr", pools: 5, participants: 89, earnings: 58.7 },
  { month: "May", pools: 6, participants: 112, earnings: 73.2 },
  { month: "Jun", pools: 7, participants: 134, earnings: 89.4 },
];

export const TIME_RANGES = [
  { id: "7d", name: "Last 7 days" },
  { id: "30d", name: "Last 30 days" },
  { id: "90d", name: "Last 90 days" },
  { id: "1y", name: "Last year" },
];

// Achievements constants
export const ACHIEVEMENTS = [
  {
    id: 1,
    title: "First Prediction",
    description: "Made your first prediction",
    icon: "🎯",
    unlocked: true,
    unlockedAt: "2024-01-01",
  },
  {
    id: 2,
    title: "Lucky Streak",
    description: "Won 5 predictions in a row",
    icon: "🔥",
    unlocked: true,
    unlockedAt: "2024-01-10",
  },
  {
    id: 3,
    title: "High Roller",
    description: "Staked $100+ in a single pool",
    icon: "💰",
    unlocked: false,
    unlockedAt: null,
  },
];

// Stats constants
export const PREDICTOR_STATS = [
  { label: "Total Predictions", value: "25", icon: "📊" },
  { label: "Win Rate", value: "78.7%", icon: "🎯" },
  { label: "Total Earnings", value: "$1,247.50", icon: "💰" },
  { label: "Active Predictions", value: "8", icon: "⏰" },
];

// Recent pools for dashboard
export const RECENT_POOLS = [
  {
    id: 1,
    creator: "TechReviewer",
    title: "Will this iPhone review hit 1M views?",
    thumbnail:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=200&fit=crop&crop=center",
    timeRemaining: "2d 14h",
    totalStake: 2840,
    participants: 156,
    myStake: 25,
    myChoice: "YES",
    odds: { yes: 1.8, no: 2.1 },
  },
  {
    id: 2,
    creator: "GamingPro",
    title: "Will this game trailer reach 500K views?",
    thumbnail:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=300&h=200&fit=crop&crop=center",
    timeRemaining: "1d 8h",
    totalStake: 1920,
    participants: 89,
    myStake: 50,
    myChoice: "NO",
    odds: { yes: 1.9, no: 1.9 },
  },
];

// Active pools for creator dashboard
export const ACTIVE_POOLS = [
  {
    id: 1,
    title: "iPhone 15 Pro Max Review",
    participants: 847,
    totalStake: 12450,
    timeRemaining: "2h 34m",
    progress: 65,
  },
  {
    id: 2,
    title: "PlayStation 6 Leak Analysis",
    participants: 623,
    totalStake: 8920,
    timeRemaining: "5h 12m",
    progress: 80,
  },
];

// Creator dashboard stats
export const CREATOR_STATS = {
  totalVideos: 9, // Actual count from ALL_VIDEOS (9 total videos)
  activePools: 0, // Will be calculated dynamically
  totalPledgedAmount: 0, // Will be calculated dynamically
  totalRoyaltiesEarned: 0, // Will be calculated dynamically
};

// Creator analytics data
export const CREATOR_ANALYTICS_DATA = {
  totalPools: 12,
  totalParticipants: 156,
  totalStaked: 2450,
  totalEarned: 89.5,
  averagePoolSize: 204,
  averageParticipants: 13,
  winRate: 75,
  topPerformingPool: {
    title: "My Latest Gaming Video - Epic Win!",
    participants: 23,
    totalStake: 450,
    earnings: 18.5,
  },
};

export const CREATOR_ANALYTICS_POOL_PERFORMANCE = [
  {
    name: "Gaming Video",
    participants: 23,
    stake: 450,
    earnings: 18.5,
    status: "won",
  },
  {
    name: "React Tutorial",
    participants: 18,
    stake: 320,
    earnings: 12.8,
    status: "won",
  },
  {
    name: "JavaScript Guide",
    participants: 15,
    stake: 280,
    earnings: 0,
    status: "lost",
  },
  {
    name: "CSS Tips",
    participants: 12,
    stake: 180,
    earnings: 7.2,
    status: "won",
  },
  {
    name: "Node.js Basics",
    participants: 20,
    stake: 380,
    earnings: 15.2,
    status: "won",
  },
];

export const CREATOR_ANALYTICS_MONTHLY_DATA = [
  { month: "Jan", pools: 2, participants: 25, earnings: 15.5 },
  { month: "Feb", pools: 3, participants: 45, earnings: 28.3 },
  { month: "Mar", pools: 4, participants: 67, earnings: 35.7 },
  { month: "Apr", pools: 3, participants: 52, earnings: 10.0 },
];

// Creator settings data
export const CREATOR_SETTINGS_DATA = {
  displayName: "Creator Name",
  bio: "I create amazing content and love engaging with my audience through prediction pools!",
  website: "",
  channelName: "Creator Channel (1,250 subscribers)",
  earningsHistory: [
    { month: "January 2024", amount: "$89.50" },
    { month: "December 2023", amount: "$156.20" },
    { month: "November 2023", amount: "$78.90" },
  ],
};

// Predictor dashboard stats
export const PREDICTOR_DASHBOARD_STATS = {
  totalPredictions: 47,
  winRate: 78.7,
  totalEarnings: 1247.5,
  activePredictions: 8,
};

// Predictor predictions data
export const PREDICTOR_ACTIVE_PREDICTIONS_DATA = [
  {
    id: 1,
    creator: "TechReviewer",
    title: "Will this iPhone review hit 1M views?",
    thumbnail:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=200&fit=crop&crop=center",
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
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=300&h=200&fit=crop&crop=center",
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
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=300&h=200&fit=crop&crop=center",
    myChoice: "YES",
    myStake: 15,
    potentialPayout: 28.5,
    timeRemaining: "1d 3h",
    currentOdds: { yes: 1.9, no: 1.9 },
    progress: 85,
  },
];

export const PREDICTOR_WON_PREDICTIONS_DATA = [
  {
    id: 4,
    creator: "TechReviewer",
    title: "Will this MacBook review hit 500K views?",
    thumbnail:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop&crop=center",
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
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=300&h=200&fit=crop&crop=center",
    myChoice: "NO",
    myStake: 20,
    payout: 35,
    settledAt: "1 day ago",
    result: "WON",
  },
];

export const PREDICTOR_LOST_PREDICTIONS_DATA = [
  {
    id: 6,
    creator: "CookingMaster",
    title: "Will this cooking video hit 100K views?",
    thumbnail:
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=300&h=200&fit=crop&crop=center",
    myChoice: "YES",
    myStake: 25,
    payout: 0,
    settledAt: "3 days ago",
    result: "LOST",
  },
];

// Predictor wallet data
export const PREDICTOR_WALLET_DATA = {
  balance: 1247.5,
  totalEarnings: 2840.25,
  totalStaked: 1592.75,
  pendingWithdrawals: 0,
};

export const PREDICTOR_WALLET_TRANSACTIONS = [
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

export const PREDICTOR_WALLET_PAYMENT_METHODS = [
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

// Creator wallet data
export const CREATOR_WALLET_DATA = {
  balance: 5670.25,
  totalEarnings: 9840.75,
  totalPledged: 3200.0,
  pendingWithdrawals: 150.0,
};

export const CREATOR_WALLET_TRANSACTIONS = [
  {
    id: 1,
    type: "royalty",
    amount: 89.5,
    description: "Pool royalties: iPhone Review",
    date: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "pledge",
    amount: -1245.0,
    description: "Pledge deposit: Gaming Video Pool",
    date: "1 day ago",
    status: "completed",
  },
  {
    id: 3,
    type: "withdrawal",
    amount: -500.0,
    description: "Withdrawal to bank account",
    date: "3 days ago",
    status: "completed",
  },
  {
    id: 4,
    type: "royalty",
    amount: 156.2,
    description: "Pool royalties: React Tutorial",
    date: "1 week ago",
    status: "completed",
  },
  {
    id: 5,
    type: "deposit",
    amount: 1000.0,
    description: "Stripe deposit to wallet",
    date: "1 week ago",
    status: "completed",
  },
];

export const CREATOR_WALLET_PAYMENT_METHODS = [
  {
    id: 1,
    type: "bank",
    name: "Chase Bank ****5678",
    isDefault: true,
    status: "verified",
  },
  {
    id: 2,
    type: "stripe",
    name: "Visa Card ****4242",
    isDefault: false,
    status: "verified",
  },
];

// Predictor profile data
export const PREDICTOR_PROFILE_DATA = {
  username: "PredictorPro",
  email: "user@example.com",
  joinDate: "January 2024",
  totalPredictions: 25,
  winRate: 78.7,
  totalEarnings: 1247.5,
  rank: "Gold",
  badges: ["Early Adopter", "High Roller", "Streak Master"],
};

export const PREDICTOR_PROFILE_ACHIEVEMENTS = [
  {
    id: 1,
    title: "First Win",
    description: "Won your first prediction",
    icon: "🎉",
    unlocked: true,
    date: "Jan 15, 2024",
  },
  {
    id: 2,
    title: "Win Streak",
    description: "Won 5 predictions in a row",
    icon: "🔥",
    unlocked: true,
    date: "Feb 3, 2024",
  },
  {
    id: 3,
    title: "High Roller",
    description: "Made a prediction with $100+ stake",
    icon: "💰",
    unlocked: true,
    date: "Feb 10, 2024",
  },
  {
    id: 4,
    title: "Prediction Master",
    description: "Made 50 total predictions",
    icon: "🎯",
    unlocked: false,
    date: null,
  },
  {
    id: 5,
    title: "Perfect Month",
    description: "100% win rate for a month",
    icon: "⭐",
    unlocked: false,
    date: null,
  },
];

// Pool creation constants
export const POOL_QUESTIONS = [
  {
    id: 0,
    text: "Will this video reach 50,000 views within 7 days of going public?",
    basis: "Based on your channel's average performance",
    performance: "Based on your avg. 68K views/week",
  },
  {
    id: 1,
    text: "Will this video get more than 1,000 likes in the first 24 hours?",
    basis: "Based on your channel's engagement rate",
    performance: "Based on your avg. 4.2% engagement rate",
  },
  {
    id: 2,
    text: "Will this video reach 100,000 views within 14 days?",
    basis: "Based on your channel's performance",
    performance: "Based on your avg. 85K views/2 weeks",
  },
  {
    id: 3,
    text: "Will this video have more than 500 comments in 7 days?",
    basis: "Based on your channel's comment rate",
    performance: "Based on your avg. 320 comments/week",
  },
];

export const PLEDGE_OPTIONS = [
  {
    type: "none",
    title: "No Pledge",
    description: "Start with a basic pool (users only)",
    amount: "$0",
  },
  {
    type: "fixed",
    title: "Fixed Amount",
    description: "Add a one-time amount to the pool",
    amount: "$200", // This will be updated dynamically in the component
  },
  {
    type: "percentage",
    title: "Revenue Percentage",
    description: "Pledge % of AdSense earnings from this video",
    amount: "15%",
  },
];

// Pool lifecycle stages
export type PoolStatus =
  | "open"
  | "awaiting_release"
  | "live_tracking"
  | "closed"
  | "settled";

// Pool status constants
export const STATUS_COLORS = {
  open: "bg-green-100 text-green-800",
  awaiting_release: "bg-yellow-100 text-yellow-800",
  live_tracking: "bg-blue-100 text-blue-800",
  closed: "bg-orange-100 text-orange-800",
  settled: "bg-purple-100 text-purple-800",
  expired: "bg-gray-100 text-gray-800",
  paused: "bg-yellow-100 text-yellow-800",
} as const;

// Pool status labels
export const STATUS_LABELS = {
  open: "Open",
  awaiting_release: "Awaiting Release",
  live_tracking: "Live Tracking",
  closed: "Closed",
  settled: "Settled",
  expired: "Expired",
  paused: "Paused",
} as const;

export const STATUS_TIMELINE = {
  open: {
    status: "OPEN",
    timeRemaining: "4 days 12h",
    pledgeStatus: "pending",
    pledgeDeposited: 0,
    currentViews: 0,
    progress: 0,
    timeline: [
      {
        phase: "Pool Created",
        date: "Dec 10, 2024",
        completed: true,
        icon: "check",
        description: "Pool is open for predictions",
      },
      {
        phase: "Predictions Close",
        date: "Dec 16, 2024",
        completed: false,
        icon: "clock",
        description: "Prediction period ends",
      },
      {
        phase: "Video Published",
        date: "TBD",
        completed: false,
        icon: "play",
        description: "Creator publishes video",
      },
      {
        phase: "Settlement",
        date: "TBD",
        completed: false,
        icon: "clock",
        description: "Results calculated and rewards distributed",
      },
    ],
  },
  awaiting_release: {
    status: "AWAITING RELEASE",
    timeRemaining: "Waiting for video",
    pledgeStatus: "pending",
    pledgeDeposited: 0,
    currentViews: 0,
    progress: 0,
    timeline: [
      {
        phase: "Pool Created",
        date: "Dec 10, 2024",
        completed: true,
        icon: "check",
        description: "Pool configuration completed",
      },
      {
        phase: "Predictions Close",
        date: "Dec 16, 2024",
        completed: true,
        icon: "check",
        description: "Prediction period ended",
      },
      {
        phase: "Video Published",
        date: "TBD",
        completed: false,
        icon: "play",
        description: "Waiting for creator to publish video",
      },
      {
        phase: "Settlement",
        date: "TBD",
        completed: false,
        icon: "clock",
        description: "Results calculated and rewards distributed",
      },
    ],
  },
  live_tracking: {
    status: "LIVE TRACKING",
    timeRemaining: "2h 30m",
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
        phase: "Predictions Close",
        date: "Dec 16, 2024",
        completed: true,
        icon: "check",
        description: "Prediction period ended",
      },
      {
        phase: "Video Published",
        date: "Dec 15, 2024",
        completed: true,
        icon: "play",
        description: "Video went live on YouTube",
      },
      {
        phase: "Settlement",
        date: "Dec 22, 2024",
        completed: false,
        icon: "clock",
        description: "Tracking performance metrics",
      },
    ],
  },
  closed: {
    status: "CLOSED",
    timeRemaining: "Processing",
    pledgeStatus: "pending",
    pledgeDeposited: 0,
    currentViews: 500000,
    progress: 100,
    timeline: [
      {
        phase: "Pool Created",
        date: "Dec 10, 2024",
        completed: true,
        icon: "check",
        description: "Pool configuration completed",
      },
      {
        phase: "Predictions Close",
        date: "Dec 16, 2024",
        completed: true,
        icon: "check",
        description: "Prediction period ended",
      },
      {
        phase: "Video Published",
        date: "Dec 15, 2024",
        completed: true,
        icon: "play",
        description: "Video went live on YouTube",
      },
      {
        phase: "Settlement",
        date: "Dec 22, 2024",
        completed: false,
        icon: "clock",
        description: "Processing final results",
      },
    ],
  },
  settled: {
    status: "SETTLED",
    timeRemaining: "Completed",
    pledgeStatus: "deposited",
    pledgeDeposited: 1245,
    currentViews: 612000,
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
    currentViews: 380000,
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
} as const;

// Helper function to generate timeline based on pool status
export const generateTimelineForStatus = (
  status: PoolStatus,
  poolData: any
) => {
  const baseTimeline = [
    {
      phase: "Pool Created",
      date: poolData.createdAt
        ? new Date(poolData.createdAt).toLocaleDateString()
        : "Today",
      completed: true,
      icon: "check" as const,
      description: "Pool is open for predictions",
    },
    {
      phase: "Predictions Close",
      date: poolData.closesAt
        ? new Date(poolData.closesAt).toLocaleDateString()
        : poolData.createdAt
          ? new Date(
              new Date(poolData.createdAt).getTime() +
                (poolData.predictionWindow || 10) * 60 * 1000
            ).toLocaleString()
          : "TBD",
      completed: status !== "open",
      icon: status !== "open" ? ("check" as const) : ("clock" as const),
      description:
        status !== "open"
          ? "Prediction period ended"
          : "Prediction period ends",
    },
    {
      phase: "Video Published",
      date: poolData.publishedAt
        ? new Date(poolData.publishedAt).toLocaleDateString()
        : "TBD",
      completed:
        status === "live_tracking" ||
        status === "closed" ||
        status === "settled",
      icon:
        status === "live_tracking" ||
        status === "closed" ||
        status === "settled"
          ? ("check" as const)
          : ("play" as const),
      description:
        status === "live_tracking" ||
        status === "closed" ||
        status === "settled"
          ? "Video went live on YouTube"
          : status === "awaiting_release"
            ? "Waiting for creator to publish video"
            : "Creator publishes video",
    },
    {
      phase: "Settlement",
      date: poolData.settledAt
        ? new Date(poolData.settledAt).toLocaleDateString()
        : "TBD",
      completed: status === "settled",
      icon: status === "settled" ? ("check" as const) : ("clock" as const),
      description:
        status === "settled"
          ? "Results calculated and rewards distributed"
          : status === "closed"
            ? "Processing final results"
            : status === "live_tracking"
              ? "Tracking performance metrics"
              : "Results calculated and rewards distributed",
    },
  ];

  return baseTimeline;
};
