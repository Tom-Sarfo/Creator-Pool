import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("onboarding", "routes/onboarding.tsx"),
  route("signup", "routes/signup.tsx"),
  route("login", "routes/login.tsx"),
  route("pools", "routes/pools.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("youtube-test", "routes/youtube-test.tsx"),
  route("api/youtube/auth", "routes/api/youtube/auth.ts"),
  route("api/youtube/callback", "routes/api/youtube/callback.ts"),
  route("creator", "routes/creator-layout.tsx", [
    index("routes/creator-dashboard.tsx"),
    route("pools", "routes/creator-pools.tsx"),
    route("pool/:id", "routes/creator-pool-detail.tsx"),
    route("analytics", "routes/creator-analytics.tsx"),
    route("wallet", "routes/creator-wallet.tsx"),
    route("settings", "routes/creator-settings.tsx"),
  ]),
  route("predictor", "routes/predictor-layout.tsx", [
    index("routes/predictor-dashboard.tsx"),
    route("pools", "routes/predictor-pools.tsx"),
    route("predictions", "routes/predictor-predictions.tsx"),
    route("wallet", "routes/predictor-wallet.tsx"),
    route("profile", "routes/predictor-profile.tsx"),
    route("pool/:id", "routes/pool-detail.tsx"),
  ]),
] satisfies RouteConfig;
