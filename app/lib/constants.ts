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

// Pool data constants
export const MOCK_POOLS = [
  {
    id: 1,
    creator: "TechReview Pro",
    creatorVerified: true,
    creatorSubs: "2.4M subs",
    title: "iPhone 15 Pro Max - Complete Review & Hidden Features",
    thumbnail:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=240&fit=crop&crop=center",
    category: "tech",
    timeRemaining: "2h 34m",
    totalStake: 12450,
    participants: 847,
    odds: { yes: 0.68, no: 0.32 },
    status: "LIVE",
    question: "Will this video reach 500K views in 7 days?",
  },
  {
    id: 2,
    creator: "GameMaster Elite",
    creatorVerified: true,
    creatorSubs: "1.8M subs",
    title: "PlayStation 6 Leak - Everything We Know So Far",
    thumbnail:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=240&fit=crop&crop=center",
    category: "gaming",
    timeRemaining: "5h 12m",
    totalStake: 8920,
    participants: 623,
    odds: { yes: 0.45, no: 0.55 },
    status: "HOT",
    question: "Will this video reach 1M views in 3 days?",
  },
  {
    id: 3,
    creator: "FitLife Coach",
    creatorVerified: true,
    creatorSubs: "950K subs",
    title: "30-Day Fitness Transformation - Real Results",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop&crop=center",
    category: "lifestyle",
    timeRemaining: "1h 45m",
    totalStake: 5670,
    participants: 412,
    odds: { yes: 0.72, no: 0.28 },
    status: "TRENDING",
    question: "Will this video reach 250K views in 5 days?",
  },
  {
    id: 4,
    creator: "Chef Maria",
    creatorVerified: true,
    creatorSubs: "1.2M subs",
    title: "Perfect Pasta Recipe - 5 Minutes to Delicious",
    thumbnail:
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=240&fit=crop&crop=center",
    category: "lifestyle",
    timeRemaining: "8h 22m",
    totalStake: 3450,
    participants: 289,
    odds: { yes: 0.58, no: 0.42 },
    status: "NEW",
    question: "Will this video reach 100K views in 10 days?",
  },
  {
    id: 5,
    creator: "Wanderlust Adventures",
    creatorVerified: true,
    creatorSubs: "3.1M subs",
    title: "Most Dangerous City in the World - Travel Guide",
    thumbnail:
      "https://images.unsplash.com/photo-1527004762775-e53ab78ba0df?w=400&h=240&fit=crop&crop=center",
    category: "entertainment",
    timeRemaining: "12h 8m",
    totalStake: 15680,
    participants: 1024,
    odds: { yes: 0.35, no: 0.65 },
    status: "HOT",
    question: "Will this video reach 2M views in 14 days?",
  },
  {
    id: 6,
    creator: "EduMaster Pro",
    creatorVerified: true,
    creatorSubs: "750K subs",
    title: "How to Memorize Anything - Memory Techniques",
    thumbnail:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop&crop=center",
    category: "education",
    timeRemaining: "6h 15m",
    totalStake: 7890,
    participants: 567,
    odds: { yes: 0.63, no: 0.37 },
    status: "LIVE",
    question: "Will this video reach 750K views in 7 days?",
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

// Recent videos for creator dashboard
export const RECENT_VIDEOS = [
  {
    id: 1,
    title: "Ultimate Gaming Setup Tour 2024 - $10K Build!",
    thumbnail:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop&crop=center",
    status: "published",
    views: 247000,
    likes: 12400,
    duration: "12:34",
    uploadDate: "2 days ago",
    poolStatus: "active",
    poolParticipants: 847,
    poolStake: 1240,
    poolType: "Active Pool",
  },
  {
    id: 2,
    title: "React vs Vue: The Ultimate 2024 Comparison",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop&crop=center",
    status: "published",
    views: 89000,
    likes: 4200,
    duration: "18:42",
    uploadDate: "5 days ago",
    poolStatus: "closing",
    poolParticipants: 623,
    poolStake: 892,
    poolType: "Pool Closing Soon",
    timeRemaining: "2 hours left",
  },
  {
    id: 3,
    title: "5 Minute Crafts That Actually Work!",
    thumbnail:
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop&crop=center",
    status: "published",
    views: 156000,
    likes: 8700,
    duration: "8:15",
    uploadDate: "1 week ago",
    poolStatus: "settled",
    poolParticipants: 567,
    poolStake: 32450,
    poolType: "Pool Settled",
    earnedAmount: 324.5,
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
    poolStatus: "ready",
    poolParticipants: 0,
    poolStake: 0,
    poolType: "Ready for Pool",
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
    poolStatus: "ready",
    poolParticipants: 0,
    poolStake: 0,
    poolType: "Ready for Pool",
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
    poolStatus: "ready",
    poolParticipants: 0,
    poolStake: 0,
    poolType: "Ready for Pool",
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
  totalVideos: 247,
  activePools: 12,
  totalPledgedAmount: 548,
  totalRoyaltiesEarned: 76,
};

// Creator pools data
export const CREATOR_POOLS_DATA = [
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
