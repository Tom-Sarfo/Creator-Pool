# 🎬 Creator Pool - Development Plan

## 📋 Project Overview

Based on the PRD and UI designs, this plan breaks down the Creator Pool development into iterative phases, focusing on building a prediction platform where fans can predict YouTube video performance and earn rewards.

## 🎯 Core Concept

- Creators upload unlisted YouTube videos and create prediction pools
- Fans predict outcomes (e.g., "Will this video reach 500K views in 7 days?")
- Winners share reward pools; creators earn a percentage of settled pools
- Platform emphasizes community engagement, not gambling

---

## 🚀 Phase 1: Foundation & Setup (Week 1-2)

### 1.1 Project Initialization

- [ ] **Set up React Router v7 project structure**
  - Initialize with `@react-router/dev`
  - Configure TypeScript and Tailwind CSS
  - Set up shadcn/ui components
  - Configure ESLint and Prettier
  - Set up path aliases and absolute imports
- [ ] **Set up Playwright testing framework**
  - Install and configure Playwright
  - Set up test configuration for desktop and mobile
  - Create initial test structure and utilities
  - Set up CI/CD pipeline for automated testing

### 1.2 Database Design & Setup

- [ ] **Design Prisma schema**
  - Users table (id, name, email, role, wallet_balance, created_at)
  - Videos table (id, youtube_id, title, status, creator_id, created_at)
  - Pools table (id, video_id, question, target_views, duration, status, total_stake, created_at)
  - Predictions table (id, pool_id, user_id, choice, stake, payout, result, created_at)
  - Transactions table (id, user_id, amount, type, reference, timestamp)
- [ ] **Set up PostgreSQL database**
  - Configure Prisma with PostgreSQL
  - Set up database migrations
  - Create seed data for development

### 1.3 Authentication System

- [ ] **Implement Clerk authentication**
  - Google OAuth integration
  - Role-based access (Creator/Predictor)
  - User profile management
  - Session handling and middleware

---

## 🎨 Phase 2: Core UI & Landing Page (Week 2-3)

### 2.1 Design System & Components

- [ ] **Create design tokens**
  - Color palette (purple primary, green/red for predictions)
  - Typography scale
  - Spacing and layout system
  - Component library with shadcn/ui

### 2.2 Landing Page (Logged-Out)

- [ ] **Hero section**
  - Main headline: "Predict YouTube Video Performance With Your Favorite Creators"
  - Subtitle explaining the concept
  - CTA buttons: "Get Started" and "Explore Pools"
- [ ] **How it works section**
  - 3-step process cards (Creators Create Pools, Fans Make Predictions, Earn Rewards)
  - Statistics section (10K+ Active Predictors, 500+ Creators, $2M+ Pool Rewards, 85% Accuracy Rate)
- [ ] **Call-to-action section**
  - "Ready to Start Predicting?" with sign-up CTA
- [ ] **Footer with copyright**

### 2.3 Responsive Design

- [ ] **Mobile optimization**
  - Stack columns vertically on mobile
  - Adjust text sizes and spacing
  - Optimize touch targets
  - Test on various screen sizes

---

## 🔐 Phase 3: Authentication & Onboarding (Week 3-4)

### 3.1 Authentication Pages

- [ ] **Sign-up page**
  - Role selection (Creator/Predictor)
  - Google OAuth integration
  - Form validation and error handling
- [ ] **Sign-in page**
  - Email/password and Google OAuth
  - Remember me functionality
  - Password reset flow
- [ ] **Password reset**
  - Email-based reset flow
  - Secure token handling

### 3.2 Onboarding Flow

- [ ] **Creator onboarding**
  - YouTube channel connection
  - Channel verification
  - First pool creation tutorial
- [ ] **Predictor onboarding**
  - Platform explanation
  - How predictions work
  - First prediction tutorial

---

## 📊 Phase 4: Creator Dashboard (Week 4-5)

### 4.1 Creator Hub Dashboard

- [ ] **Main dashboard layout**
  - Left sidebar navigation
  - Top header with sync, search, notifications, profile
  - Summary statistics cards (Total Videos, Active Pools, Total Pledged Amount, Total Royalties Earned)
- [ ] **Video management**
  - Tabbed interface (All Videos, Active Pools, Unlisted)
  - Video list with thumbnails, titles, stats, and pool status
  - Pagination and search functionality
- [ ] **Pool creation flow**
  - Select unlisted video
  - Set prediction question and target
  - Configure pool duration and settings
  - Publish pool

### 4.2 Pool Management

- [ ] **Active pool monitoring**
  - Real-time pool status updates
  - Participant count and stake tracking
  - Performance metrics and progress bars
- [ ] **Pool settlement**
  - Automatic settlement when video goes live
  - Results display and payout calculations
  - Creator reward distribution

---

## 🎯 Phase 5: Predictor Dashboard (Week 5-6)

### 5.1 Active Pools Interface

- [ ] **Pool discovery**
  - Grid layout of active pools
  - Video thumbnails with status labels (LIVE, HOT, TRENDING)
  - Creator information and verification badges
  - Pool details (size, predictors, time remaining)
- [ ] **Prediction interface**
  - YES/NO prediction buttons with dynamic odds
  - Stake amount input with quick-select buttons
  - Payout calculation display
  - Confirmation flow

### 5.2 My Predictions Dashboard

- [ ] **Prediction tracking**
  - Filter tabs (All, Active, Won, Lost, Settled)
  - Prediction cards with status indicators
  - Progress bars for active predictions
  - Win/loss statistics and accuracy rate
- [ ] **Results and rewards**
  - Settlement notifications
  - Reward distribution display
  - Transaction history

---

## 💰 Phase 6: Wallet System (Week 6-7)

### 6.1 Wallet Dashboard

- [ ] **Balance overview**
  - Available balance display
  - Total earned and staked amounts
  - Quick action buttons (Deposit, Withdraw, Transfer)
- [ ] **Payment methods**
  - Connected payment methods (PayPal, Stripe, Bank)
  - Add new payment method flow
  - Method verification and status
- [ ] **Transaction history**
  - Filterable transaction list
  - Transaction types (wins, stakes, deposits, withdrawals)
  - Status indicators and timestamps

### 6.2 Payment Integration

- [ ] **Deposit functionality**
  - Stripe integration for card payments
  - PayPal integration
  - Bank transfer options
- [ ] **Withdrawal system**
  - Withdrawal request flow
  - Processing status tracking
  - Fee calculations

---

## 🔔 Phase 7: Notifications & Real-time Features (Week 7-8)

### 7.1 Notification System

- [ ] **Push notifications**
  - Firebase Cloud Messaging setup
  - Notification preferences
  - Pool event notifications (opening, closing, results)
- [ ] **In-app notifications**
  - Notification center
  - Real-time updates
  - Mark as read functionality

### 7.2 Real-time Updates

- [ ] **WebSocket integration**
  - Real-time pool updates
  - Live prediction counts
  - Dynamic odds updates
- [ ] **Polling system**
  - YouTube API data refresh (every 6 hours)
  - Pool status updates
  - Performance metric tracking

---

## 📱 Phase 8: Mobile Optimization (Week 8-9)

### 8.1 Mobile Web Optimization

- [ ] **Responsive design improvements**
  - Mobile-first approach for all screens
  - Touch-friendly interactions
  - Optimized loading and performance
- [ ] **Mobile navigation**
  - Bottom navigation bar for main sections
  - Hamburger menu for secondary pages
  - Swipe gestures and mobile patterns

### 8.2 Performance Optimization

- [ ] **Lazy loading**
  - Image lazy loading
  - Component code splitting
  - Route-based splitting
- [ ] **Caching strategy**
  - Redis for active pool data
  - Browser caching for static assets
  - API response caching

---

## 🧪 Phase 9: Testing & Quality Assurance (Week 9-10)

### 9.1 Testing Framework

- [ ] **Unit testing**
  - Jest and React Testing Library setup
  - Component testing
  - Utility function testing
- [ ] **Integration testing**
  - API endpoint testing
  - Database integration tests
  - Authentication flow testing
- [ ] **E2E testing**
  - Playwright setup
  - Critical user journey testing
  - Cross-browser testing

### 9.2 Quality Assurance

- [ ] **Accessibility testing**
  - WCAG 2.1 AA compliance
  - Screen reader testing
  - Keyboard navigation
- [ ] **Performance testing**
  - Lighthouse audits
  - Core Web Vitals optimization
  - Mobile performance testing

---

## 🚀 Phase 10: Deployment & Launch (Week 10-11)

### 10.1 Production Setup

- [ ] **Infrastructure setup**
  - Vercel deployment for frontend
  - Railway/Supabase for backend
  - Database production setup
  - CDN configuration
- [ ] **Environment configuration**
  - Production environment variables
  - API key management
  - Security headers and CORS

### 10.2 Monitoring & Analytics

- [ ] **Error tracking**
  - Sentry integration
  - Error logging and monitoring
  - Performance monitoring
- [ ] **Analytics setup**
  - PostHog or Plausible integration
  - User behavior tracking
  - Conversion funnel analysis

---

## ❓ Open Questions Requiring Input

### Technical Decisions

1. **Backend Framework**: Should we use Express.js or NestJS for the backend API?
2. **Database Hosting**: Preference between Railway, Supabase, or AWS RDS for PostgreSQL?
3. **Payment Processing**: Any preference for Stripe vs PayPal integration priority?
4. **Real-time Updates**: Should we use WebSockets or Server-Sent Events for real-time features?

### Business Logic

1. **Pool Duration**: Are the current limits (24h-14d, default 7d) appropriate?
2. **Stake Limits**: Should we adjust the $1-$500 range or 10% max per predictor?
3. **Platform Fees**: Confirm 5% platform fee and 1% creator royalty are correct?
4. **Creator Pledge**: Should the 15% AdSense pledge be part of MVP or future feature?

### Design & UX

1. **Mobile App**: Should we prioritize PWA or consider React Native wrapper later?
2. **Dark Mode**: Include in MVP or defer to post-launch?
3. **Animation Level**: How much animation/micro-interactions should we include?
4. **Accessibility**: Any specific accessibility requirements beyond WCAG 2.1 AA?

### Launch Strategy

1. **Beta Testing**: Should we run a closed beta with select creators first?
2. **Content Moderation**: How should we handle inappropriate content or spam?
3. **Legal Compliance**: Any specific legal requirements for different regions?
4. **Monetization Timeline**: When should we introduce the platform fee structure?

---

## 📈 Success Metrics

### Technical Metrics

- [ ] Lighthouse score > 85
- [ ] Page load time < 3 seconds
- [ ] 99.9% uptime
- [ ] Zero critical security vulnerabilities

### Business Metrics

- [ ] 100+ active creators in first month
- [ ] 1,000+ active predictors in first month
- [ ] 85%+ prediction accuracy rate
- [ ] $10,000+ total pool volume in first month

### User Experience Metrics

- [ ] < 5% bounce rate on landing page
- [ ] 80%+ user completion rate for onboarding
- [ ] 4.5+ star average user rating
- [ ] < 2% support ticket rate

---

## 🔄 Iteration Strategy

Each phase should be completed and tested before moving to the next. We'll use a weekly sprint cycle with:

- **Monday**: Sprint planning and task assignment
- **Wednesday**: Mid-sprint review and adjustments
- **Friday**: Sprint completion and demo
- **Weekend**: Buffer time for unexpected issues

The plan allows for flexibility and adjustments based on user feedback and technical discoveries during development.
