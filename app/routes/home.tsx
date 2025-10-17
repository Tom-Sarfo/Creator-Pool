import type { Route } from "./+types/home";
import { Link } from "react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Creator Pool - Predict YouTube Video Performance" },
    {
      name: "description",
      content:
        "Join prediction pools for upcoming videos, showcase your insights, and earn rewards when you're right. It's not gambling—it's community engagement.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
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
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/pools" className="text-gray-600 hover:text-gray-800">
              Explore Pools
            </Link>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-600 hover:text-gray-800">
                  Login
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Sign Up
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 border border-purple-200 rounded-full text-sm text-gray-600 mb-8">
            <div className="w-4 h-4 bg-purple-600 rounded mr-2 flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </div>
            Predict. Engage. Win.
          </div>

          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Predict YouTube Video Performance With Your Favorite Creators
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join prediction pools for upcoming videos, showcase your insights,
            and earn rewards when you're right. It's not gambling—it's community
            engagement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 flex items-center justify-center">
                  Get Started
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                to="/dashboard"
                className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 flex items-center justify-center"
              >
                Go to Dashboard
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </SignedIn>
            <Link
              to="/pools"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50"
            >
              Explore Pools
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            How Creator Pool Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 5v10l8-5-8-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                1. Creators Create Pools
              </h3>
              <p className="text-gray-600">
                Creators upload unlisted videos and set prediction questions
                about their performance—views, likes, or engagement targets.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                2. Fans Make Predictions
              </h3>
              <p className="text-gray-600">
                Join pools and predict outcomes before the video goes public.
                Dynamic odds adjust based on community predictions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                3. Earn Rewards
              </h3>
              <p className="text-gray-600">
                When the video goes live and results are in, accurate predictors
                share the reward pool. Creators earn too!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600">Active Predictors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Creators</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                $2M+
              </div>
              <div className="text-gray-600">Pool Rewards</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Predicting?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of fans engaging with their favorite creators
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 inline-flex items-center">
                Create Your Account
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 inline-flex items-center"
            >
              Go to Dashboard
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-500">
        <p>© 2025 Creator Pool. Built for creators and fans.</p>
      </footer>
    </div>
  );
}
