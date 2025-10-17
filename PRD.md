Creator Pool – Product Requirements Document (PRD)
Product Description

Creator Pool is a playful, community-driven prediction platform where fans engage with YouTube creators by forecasting how new videos will perform.
Predictors (fans) participate in pools tied to upcoming video releases — guessing outcomes such as “Will this video reach 50K views in 24 hours?”
When results are finalized, predictors who made accurate forecasts share community rewards, and creators earn a percentage of their pool’s settled rewards.

It’s not about gambling — it’s about fun, insight, and celebrating content performance together.

Problem

Creators struggle to build deeper fan engagement before content drops, while fans often want more ways to feel connected and recognized for their insight or excitement about a creator’s upcoming videos.
There’s no current system that gamifies performance predictions in a transparent, entertaining, and creator-friendly way.

Project Overview
Summary

Creator Pool creates an interactive ecosystem around creator content — allowing predictors to engage with upcoming videos and creators to gain both fan participation and insights before publishing.
When the prediction period closes, and the video goes live, performance is tracked, rewards are distributed, and both sides stay connected through transparent, fun participation.

Goals

Empower fans to engage meaningfully with creators’ upcoming content.

Help creators generate buzz before their videos go public.

Encourage playful, transparent, non-financial engagement tied to video performance.

Build a foundational MVP for creator-fan prediction interaction.

Target Demographic

Primary: YouTube creators with active fan bases (1K–100K subscribers).

Secondary: Fans and supporters who enjoy engaging with creator content and predicting performance outcomes.

Features
1. Creator Features

Create a Pool: Select an unlisted YouTube video and define prediction metrics (e.g., “Will it reach 50K views in 24 hours?”).

Reward Share: Earn a small percentage (e.g., 10%) of settled rewards from their pool.

Creator Dashboard: View number of pools, pledged engagement, and total rewards earned.

2. Predictor Features

Join Pool: Participate by predicting an outcome before staking closes.

Dynamic Pool Price: As more predictors choose one side of the binary question, that side’s price increases.

View Pool: See pool details, video preview, reward progress, and countdown until reveal.

Results Page: See whether their prediction was accurate and their earned rewards.

3. Pool Mechanics

Binary outcomes (Yes/No).

Pool closes when the video is about to go public.

Reward distribution:

Accurate predictors share the reward pool proportionally.

Creators earn a small % from their pool’s final reward.

If a creator delays publication:

The pool status changes to “Awaiting Video Release” and a message indicates the new expected timeline.

4. Notification System

Predictors are notified:

When a pool is closing soon.

When a video goes live.

When pool results are settled.

Tax & Compliance

No betting language: Terms like “bet,” “wager,” or “stake” are avoided.

Transparent framing: Creator Pool emphasizes fun, insight, and participation — not profit.

Reward framing: Rewards are positioned as recognition and community tokens, not guaranteed earnings.

Compliance note: MVP avoids financial transactions tied to gambling frameworks.

Design Goals

Tone: Playful, community-first, and empowering.

Visual Identity: Light, social-media feel with familiar UI patterns.

Experience:

Simple for creators to set up pools.

Effortless for fans to join and track predictions.

Clear, transparent progress indicators.

Logged-Out Home Page (LOHP)
Purpose:

Introduce the concept to first-time visitors.

Sections:

Hero section explaining how Creator Pool works.

“How It Works” cards:

Creators upload unlisted video.

Fans predict how it will perform.

Results and rewards revealed post-launch.

CTA: “Sign Up to Predict with Your Favorite Creators.”

Featured creator pools (limited preview).

User Authentication
User Management

Unified login for creators and predictors.

Basic roles: Creator, Predictor, Admin.

Sign In

Email + password or Google OAuth.

Sign Up

Choose role (Creator or Predictor).

Quick onboarding walkthrough.

Reset Password

Email reset link flow.

Phone Verification (Optional MVP+)

Basic verification to ensure authentic users.

Onboarding

Creators: Guided flow to connect YouTube channel and create their first pool.

Predictors: Intro explaining how prediction and reward systems work.

Logged-In Home Page (LIHP)
For Creators

Sections:

Creator Overview Card:

Total Pools

Total Pledged Amount

Total Rewards Earned

“Create New Pool” button.

Active and Past Pools list.

Quick analytics summary (e.g., participation trends).

For Predictors

Sections:

“Active Pools” list (open or awaiting results).

“Settled Pools” tab with won/lost indicators.

Metric Cards:

Total Pools Joined

Accuracy Rate (%)

Total Rewards Earned

Win/Loss Count

Feature Descriptions/Pages
1. Create Pool Page (Creator)

Upload unlisted video link.

Set prediction question.

Define target (e.g., “50K views in 24 hours”).

Publish pool (visible to predictors).

2. View Pool Page (Predictor or Creator)

Video thumbnail visible (not blurred).

Pool details: prediction type, closing timer, total participants, reward pool.

Indicator for status:

Active (Open) – accepting predictions.

Closed (Awaiting Video) – prediction period ended.

Live (Tracking Performance) – video published.

Settled (Completed) – final results available.

3. Settled Pool Page
For Predictors:

Outcome summary (Win/Loss).

Reward amount earned.

View engagement data used for settlement.

For Creators:

Pool performance insights.

Creator reward summary (% share).

Viewer participation data.

Product & Business
Revenue Model Clarification

Platform Fee: 5% of total settled pool rewards (kept by Creator Pool).

Creator Royalty: 1% (not 0.1%) of each settled pool on their videos.

Creator Pledge (optional): 15% of YouTube AdSense revenue pledged by creator (if enabled).

Note: This is an optional future feature — not part of MVP.

Reward Distribution

Rewards are split proportionally among predictors who made correct predictions.

Formula:

PredictorReward = (UserStake / TotalWinningStake) * (TotalLosingStake * (1 - PlatformFee - CreatorRoyalty))


Example:

$1,000 total pool (50% YES, 50% NO)

YES wins → $500 from NO pool distributed to all YES predictors

Platform keeps 5%, Creator gets 1%, remaining 94% distributed by stake ratio.

Pool Duration Limits

Minimum Duration: 24 hours

Maximum Duration: 14 days

Default Duration: 7 days

Pool auto-closes when:

Timer ends or

Creator publishes the video (whichever comes first).

Stake Limits

Minimum Stake: $1

Maximum Stake: $500

No single predictor can exceed 10% of total pool size.

YouTube API Quotas

Use YouTube Data API v3 with channel-level OAuth for creators.

Unlisted video fetching is done via authenticated requests (per creator token).

Caching and rate control handled by backend — polling every 6 hours for updates.

Implement fallback for quota exhaustion (display “Pending update” state).

⚙️ Technical
Database Schema

Core tables:

Users: id, name, email, role (creator/predictor), wallet_balance

Videos: id, youtube_id, title, status (active, unlisted, published)

Pools: id, video_id, question, target_views, duration, status, total_stake

Predictions: id, pool_id, user_id, choice (yes/no), stake, payout, result

Transactions: id, user_id, amount, type (stake/reward/fee/royalty), reference, timestamp

(Cursor can auto-generate Prisma schema from this.)

YouTube Integration

Creator connects channel via OAuth 2.0.

API access tokens stored securely.

Only connected creators’ videos (public/unlisted) fetched.

Unlisted videos are visible only to creator in dashboard (predictors see preview info only).

Real-time Data

Real-time:

Pool countdown timers

Pool settlement results

Periodic polling (every 6–12 hrs):

YouTube video stats (views, likes)

Caching Strategy

Cache YouTube view data for 6 hours.

Use Redis for:

Active pool data

Leaderboards

Dashboard stats summary

Error Handling

YouTube API failures:

Retry 3 times

If still fails → show fallback “Data temporarily unavailable”

Log all errors in Sentry

🎨 Design & UX
Mobile Navigation

Bottom Navigation Bar for logged-in users.

Hamburger menu for secondary pages (Settings, Wallet, Help).

Dark Mode

Not in MVP, but keep design tokenized (easy future support).

Accessibility

Target WCAG 2.1 AA compliance.

Clear contrast, semantic HTML, focus states.

Animation Preferences

Subtle, smooth transitions (Framer Motion).

Keep interactions fun and rewarding (e.g., confetti when a pool is won).

Loading States

Use skeleton loaders for video cards, analytics, and pool results.

Add playful micro-loading animations on prediction submission.

📱 Mobile Specific
App Store Strategy

PWA-first approach for MVP.

Native wrapper (React Native) considered later.

Mobile Performance

Aim for Lighthouse score > 85.

Lazy-load all pool lists and charts.

Offline Support

Minimal.

Show cached pages and alert “You’re offline” — no predictions allowed.

Push Notifications

Web push via Firebase.

Notify:

When a pool settles.

When creator launches new pool.

When reward is credited.


Help me think through how to break this into iterative pieces and write a plan.md.

Check out items in the plan as we accomplish them as a todo list. If you have open questions that require my input, add those in the plan as well