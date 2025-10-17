import type { Route } from "./+types/pools";
import { SignedIn, SignedOut, SignInButton } from "@clerk/react-router";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Active Pools - Creator Pool" },
    {
      name: "description",
      content: "Explore active prediction pools for upcoming YouTube videos.",
    },
  ];
}

export default function PoolsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Creator Pool
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-600 hover:text-gray-800">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="text-gray-600">Welcome back!</div>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Active Pools
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover prediction pools for upcoming YouTube videos. Join the
              community and showcase your insights!
            </p>
          </div>

          <SignedOut>
            <div className="text-center py-12">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  Sign in to view pools
                </h3>
                <p className="text-purple-600 mb-4">
                  Create an account or sign in to explore active prediction
                  pools.
                </p>
                <SignInButton mode="modal">
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                    Get Started
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Placeholder pool cards */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-gray-400">Video Thumbnail</div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Sample Pool Coming Soon
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  More pools will be available once creators start creating
                  them.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pool Size: $0</span>
                  <span className="text-sm text-gray-500">0 Predictors</span>
                </div>
              </div>
            </div>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
